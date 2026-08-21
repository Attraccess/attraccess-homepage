#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class TranslationAnalyzer {
  constructor() {
    this.definedKeys = new Set();
    this.usedKeys = new Set();
    // t(`prefix.${expr}`) call sites, compiled to key matchers
    this.dynamicPatterns = [];
    // every scanned file, kept for the bare-string-literal lookup
    this.sources = [];
    this.sourceDir = path.join(__dirname, "..", "src");
    this.i18nFile = path.join(this.sourceDir, "contexts", "i18n.tsx");
  }

  // Extract all defined translation keys from i18n.tsx
  extractDefinedKeys() {
    try {
      const content = fs.readFileSync(this.i18nFile, "utf8");

      // Find the translations object
      const translationsMatch = content.match(
        /const translations = \{([\s\S]*?)\};/
      );
      if (!translationsMatch) {
        console.log("✅ No legacy translation dictionary remains; public copy is maintained with the supported languages.");
        return;
      }

      const translationsContent = translationsMatch[1];

      // Extract English keys (assuming they're complete)
      const enMatch = translationsContent.match(/en: \{([\s\S]*?)\},\s*de:/);
      if (!enMatch) {
        throw new Error("Could not find English translations");
      }

      const enContent = enMatch[1];

      // Extract all quoted keys using regex
      const keyRegex = /"([^"]+)":/g;
      let match;
      while ((match = keyRegex.exec(enContent)) !== null) {
        this.definedKeys.add(match[1]);
      }

      console.log(`✅ Found ${this.definedKeys.size} defined translation keys`);
    } catch (error) {
      console.error("❌ Error extracting defined keys:", error.message);
      process.exit(1);
    }
  }

  // Find all files that might use translations
  findSourceFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules"
      ) {
        files.push(...this.findSourceFiles(fullPath));
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  // Extract translation keys used in source files
  extractUsedKeys() {
    const sourceFiles = this.findSourceFiles(this.sourceDir);

    console.log(`🔍 Scanning ${sourceFiles.length} source files...`);

    for (const filePath of sourceFiles) {
      let content;
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${filePath}`);
        continue;
      }

      // Skip scanning the i18n context file itself to avoid false positives
      if (filePath === this.i18nFile) {
        continue;
      }

      this.sources.push({ filePath, content });

      // Literal calls: t("key"), t('key'), t(`key`). The leading \b matters —
      // without it, document.createElement("meta") reads as t("meta").
      const patterns = [
        /\bt\(\s*"([^"$]+)"\s*\)/g,
        /\bt\(\s*'([^'$]+)'\s*\)/g,
        /\bt\(\s*`([^`$]+)`\s*\)/g,
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          // Filter out obvious non-translation keys (single characters, etc.)
          const key = match[1];
          if (key.length > 1 && !key.match(/^[\s\-_]+$/)) {
            this.usedKeys.add(key);
          }
        }
      }

      // Interpolated calls: t(`nav.${item.key}`), t(`home.pricing.${k}.item${i}`).
      // Each ${...} becomes a wildcard that cannot cross a dot, so the compiled
      // pattern matches the key shapes that call site can actually produce.
      const interpolated = /\bt\(\s*`([^`]*\$\{[^`]*)`\s*\)/g;
      let match;
      while ((match = interpolated.exec(content)) !== null) {
        const template = match[1];
        const regex = new RegExp(
          "^" +
            template
              .split(/\$\{[^}]*\}/)
              .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              .join("[^.]+") +
            "$"
        );
        this.dynamicPatterns.push({ regex, template, filePath });
      }
    }

    console.log(
      `✅ Found ${this.usedKeys.size} used translation keys` +
        ` and ${this.dynamicPatterns.length} interpolated t(\`…\`) call sites`
    );
  }

  // A key counts as used when a component asks for it by name, when an
  // interpolated t(`…`) call can produce it, or when it appears as a plain
  // string somewhere that later reaches t() — e.g. the key fields in
  // components/home/proof-chips.ts.
  isUsed(key) {
    if (this.usedKeys.has(key)) return true;
    if (this.dynamicPatterns.some(({ regex }) => regex.test(key))) return true;

    return this.sources.some(
      ({ content }) =>
        content.includes(`"${key}"`) ||
        content.includes(`'${key}'`) ||
        content.includes(`\`${key}\``)
    );
  }

  // Find keys that are defined but never used
  findUnusedKeys() {
    const unused = [...this.definedKeys].filter((key) => !this.isUsed(key));
    return unused.sort();
  }

  // Find keys that are used but not defined
  findMissingKeys() {
    const missing = [...this.usedKeys].filter(
      (key) => !this.definedKeys.has(key)
    );
    return missing.sort();
  }

  // Check every non-English dictionary for keys the English one defines.
  // Returns { [lang]: string[] } — the old version only ever looked at German,
  // so gaps in French and Dutch went unreported.
  findIncompleteTranslations() {
    try {
      const content = fs.readFileSync(this.i18nFile, "utf8");

      // Same slice-and-eval the i18n test uses: the dictionary is a plain
      // literal, so this beats regexing each language block out by hand.
      const start = content.indexOf("const translations = {");
      const end = content.indexOf("\n};", start);
      if (start === -1 || end === -1) return {};
      const translations = eval(
        `(${content.slice(start + "const translations = ".length, end + 2)})`
      );

      const incomplete = {};
      for (const lang of Object.keys(translations)) {
        if (lang === "en") continue;
        const keys = new Set(Object.keys(translations[lang]));
        const missing = [...this.definedKeys].filter((key) => !keys.has(key));
        if (missing.length > 0) incomplete[lang] = missing.sort();
      }
      return incomplete;
    } catch (error) {
      console.warn("⚠️  Could not check translations:", error.message);
      return {};
    }
  }

  // Generate a detailed report
  generateReport() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 TRANSLATION ANALYSIS REPORT");
    console.log("=".repeat(60));

    const unusedKeys = this.findUnusedKeys();
    const missingKeys = this.findMissingKeys();
    const incomplete = this.findIncompleteTranslations();
    const incompleteKeys = Object.values(incomplete).flat();

    // Summary
    console.log("\n📈 SUMMARY:");
    console.log(`   Total defined keys: ${this.definedKeys.size}`);
    console.log(`   Total used keys: ${this.usedKeys.size}`);
    console.log(`   Unused keys: ${unusedKeys.length}`);
    console.log(`   Missing keys: ${missingKeys.length}`);
    console.log(`   Incomplete translations: ${incompleteKeys.length}`);

    // Unused keys
    if (unusedKeys.length > 0) {
      console.log("\n🗑️  UNUSED TRANSLATION KEYS:");
      console.log("   These keys are defined but never used in the codebase:");
      unusedKeys.forEach((key) => {
        console.log(`   - "${key}"`);
      });
    } else {
      console.log("\n✅ No unused translation keys found!");
    }

    // Missing keys
    if (missingKeys.length > 0) {
      console.log("\n❌ MISSING TRANSLATION KEYS:");
      console.log("   These keys are used but not defined:");
      missingKeys.forEach((key) => {
        console.log(`   - "${key}"`);
      });
    } else {
      console.log("\n✅ No missing translation keys found!");
    }

    // Incomplete translations
    if (incompleteKeys.length > 0) {
      console.log("\n🌍 INCOMPLETE TRANSLATIONS:");
      for (const [lang, keys] of Object.entries(incomplete)) {
        console.log(`   ${lang.toUpperCase()} is missing ${keys.length} keys:`);
        keys.forEach((key) => {
          console.log(`   - "${key}"`);
        });
      }
    } else {
      console.log("\n✅ Every language defines all English keys!");
    }

    // Generate cleanup suggestions
    this.generateCleanupSuggestions(unusedKeys, missingKeys);

    console.log("\n" + "=".repeat(60));
    return {
      unusedKeys,
      missingKeys,
      incompleteKeys,
      definedCount: this.definedKeys.size,
      usedCount: this.usedKeys.size,
    };
  }

  // Generate actionable cleanup suggestions
  generateCleanupSuggestions(unusedKeys, missingKeys) {
    console.log("\n💡 CLEANUP SUGGESTIONS:");

    if (unusedKeys.length > 0) {
      console.log("\n   To remove unused keys, you can:");
      console.log(
        "   1. Review each unused key to ensure it's truly not needed"
      );
      console.log("   2. Remove them from both EN and DE translations");
      console.log(
        "   3. Consider if they might be used in dynamic key generation"
      );
    }

    if (missingKeys.length > 0) {
      console.log("\n   To fix missing keys, you need to:");
      console.log("   1. Add the missing keys to both EN and DE translations");
      console.log("   2. Provide appropriate translations for each language");
      console.log("   3. Check if the key names are correct (no typos)");
    }

    if (unusedKeys.length === 0 && missingKeys.length === 0) {
      console.log("\n   🎉 Your translations are perfectly in sync!");
    }
  }

  // Main analysis method
  analyze() {
    console.log("🚀 Starting translation analysis...\n");

    this.extractDefinedKeys();
    this.extractUsedKeys();

    return this.generateReport();
  }
}

// Export for use as module or run directly
if (require.main === module) {
  const analyzer = new TranslationAnalyzer();
  const result = analyzer.analyze();

  // Exit with error code if issues found
  const hasIssues =
    result.unusedKeys.length > 0 ||
    result.missingKeys.length > 0 ||
    result.incompleteKeys.length > 0;
  process.exit(hasIssues ? 1 : 0);
}

module.exports = TranslationAnalyzer;
