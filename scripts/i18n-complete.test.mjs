// Fails the build if any language is missing (or has extra) translation keys.
// Run with: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const src = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "src/contexts/i18n.tsx"),
  "utf8"
);

// ponytail: the translations object is a plain literal, so slice it out and eval
// it rather than pulling in a TS loader just to read a dictionary.
const start = src.indexOf("const translations = {");
const end = src.indexOf("\n};", start);
assert.ok(start !== -1 && end !== -1, "could not locate the translations object in i18n.tsx");
const translations = eval(`(${src.slice(start + "const translations = ".length, end + 2)})`);

const languages = Object.keys(translations);
const reference = "en";

test("every language defines exactly the English key set", () => {
  const expected = Object.keys(translations[reference]).sort();
  assert.ok(expected.length > 0, "no keys found for the reference language");

  for (const lang of languages) {
    const actual = Object.keys(translations[lang]);
    const missing = expected.filter((k) => !actual.includes(k));
    const extra = actual.filter((k) => !expected.includes(k));

    assert.deepEqual(
      { lang, missing, extra },
      { lang, missing: [], extra: [] },
      `"${lang}" is out of sync with "${reference}"`
    );
  }
});

test("no translation value is empty", () => {
  for (const lang of languages) {
    for (const [key, value] of Object.entries(translations[lang])) {
      assert.ok(
        typeof value === "string" && value.trim() !== "",
        `${lang}.${key} is empty`
      );
    }
  }
});

test("placeholders like {name} match the English original", () => {
  const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[0]).sort();

  for (const lang of languages.filter((l) => l !== reference)) {
    for (const [key, value] of Object.entries(translations[reference])) {
      assert.deepEqual(
        placeholders(translations[lang][key] ?? ""),
        placeholders(value),
        `${lang}.${key} has different placeholders than ${reference}.${key}`
      );
    }
  }
});
