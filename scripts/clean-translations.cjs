#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const TranslationAnalyzer = require("./check-translations.cjs");

class TranslationCleaner extends TranslationAnalyzer {
  constructor() {
    super();
    this.backupCreated = false;
  }

  // Create a backup of the original i18n file
  createBackup() {
    if (this.backupCreated) return;

    const backupPath = this.i18nFile + ".backup";
    fs.copyFileSync(this.i18nFile, backupPath);
    console.log(`📁 Created backup: ${backupPath}`);
    this.backupCreated = true;
  }

  // Remove unused keys from the translations object
  removeUnusedKeys(unusedKeys) {
    if (unusedKeys.length === 0) {
      console.log("✅ No unused keys to remove!");
      return;
    }

    this.createBackup();

    let content = fs.readFileSync(this.i18nFile, "utf8");
    let removedCount = 0;

    console.log(
      `\n🧹 Removing ${unusedKeys.length} unused translation keys...`
    );

    for (const key of unusedKeys) {
      // Escape special regex characters in the key
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Remove from both English and German sections
      // Pattern matches the full key-value pair including the comma
      const patterns = [
        new RegExp(`\\s*"${escapedKey}":\\s*"[^"]*",?\\n?`, "g"),
        new RegExp(`\\s*"${escapedKey}":\\s*'[^']*',?\\n?`, "g"),
      ];

      let keyRemoved = false;
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, "");
          keyRemoved = true;
        }
      }

      if (keyRemoved) {
        removedCount++;
        console.log(`   ❌ Removed: "${key}"`);
      } else {
        console.warn(
          `   ⚠️  Could not remove: "${key}" (manual cleanup required)`
        );
      }
    }

    // Clean up any extra commas and empty lines
    content = this.cleanupFormatting(content);

    fs.writeFileSync(this.i18nFile, content);
    console.log(
      `\n✅ Successfully removed ${removedCount}/${unusedKeys.length} unused keys`
    );
  }

  // Clean up formatting after key removal
  cleanupFormatting(content) {
    // Fix double commas
    content = content.replace(/,(\s*),/g, ",");

    // Fix trailing commas before closing braces
    content = content.replace(/,(\s*})/g, "$1");

    // Remove excessive empty lines
    content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

    return content;
  }

  // Interactive confirmation for cleanup
  async confirmCleanup(unusedKeys) {
    if (unusedKeys.length === 0) return true;

    console.log(
      `\n⚠️  This will remove ${unusedKeys.length} unused translation keys:`
    );
    unusedKeys.slice(0, 10).forEach((key) => console.log(`   - "${key}"`));
    if (unusedKeys.length > 10) {
      console.log(`   ... and ${unusedKeys.length - 10} more keys`);
    }

    // For non-interactive environments, require explicit flag
    if (!process.stdin.isTTY || process.argv.includes("--force")) {
      return process.argv.includes("--force");
    }

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      readline.question("\n❓ Do you want to proceed? (y/N): ", (answer) => {
        readline.close();
        resolve(answer.toLowerCase().startsWith("y"));
      });
    });
  }

  // Generate a safe removal report
  generateRemovalReport(unusedKeys) {
    if (unusedKeys.length === 0) return;

    console.log("\n📋 REMOVAL REPORT:");
    console.log("   The following keys will be removed:");

    // Group keys by prefix for better overview
    const groupedKeys = {};
    for (const key of unusedKeys) {
      const prefix = key.split(".")[0];
      if (!groupedKeys[prefix]) groupedKeys[prefix] = [];
      groupedKeys[prefix].push(key);
    }

    for (const [prefix, keys] of Object.entries(groupedKeys)) {
      console.log(`\n   ${prefix}.* (${keys.length} keys):`);
      keys.forEach((key) => console.log(`     - ${key}`));
    }
  }

  // Main cleanup method
  async clean() {
    console.log("🧹 Starting translation cleanup...\n");

    // First run analysis
    this.extractDefinedKeys();
    this.extractUsedKeys();

    const unusedKeys = this.findUnusedKeys();
    const missingKeys = this.findMissingKeys();

    if (missingKeys.length > 0) {
      console.log(
        "❌ Cannot proceed with cleanup - missing translations found:"
      );
      missingKeys.forEach((key) => console.log(`   - "${key}"`));
      console.log(
        "\n💡 Please add missing translations first, then run cleanup."
      );
      process.exit(1);
    }

    this.generateRemovalReport(unusedKeys);

    if (await this.confirmCleanup(unusedKeys)) {
      this.removeUnusedKeys(unusedKeys);

      console.log("\n✨ Cleanup completed!");
      console.log("💡 Run the check script again to verify the changes.");
      if (this.backupCreated) {
        console.log(`📁 Original file backed up as: ${this.i18nFile}.backup`);
      }
    } else {
      console.log("\n❌ Cleanup cancelled.");
    }
  }
}

// Command line usage
if (require.main === module) {
  const cleaner = new TranslationCleaner();

  if (process.argv.includes("--help")) {
    console.log(`
Usage: node clean-translations.js [options]

Options:
  --force    Skip confirmation prompt and remove unused keys automatically
  --help     Show this help message

Examples:
  node clean-translations.js          # Interactive cleanup
  node clean-translations.js --force  # Automatic cleanup (use in CI)
`);
    process.exit(0);
  }

  cleaner.clean().catch((error) => {
    console.error("❌ Cleanup failed:", error.message);
    process.exit(1);
  });
}

module.exports = TranslationCleaner;
