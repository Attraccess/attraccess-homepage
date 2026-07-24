import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider, translations, useI18n } from "@/contexts/i18n";

function Probe() {
  const { t, language, setLanguage } = useI18n();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="known">{t("nav.contact")}</span>
      <span data-testid="unknown">{t("this.key.does.not.exist")}</span>
      <span data-testid="params">{t("blog.reading-time", { minutes: 7 })}</span>
      <button type="button" onClick={() => setLanguage("de")}>
        de
      </button>
    </div>
  );
}

function renderProbe(navigatorLanguage: string) {
  Object.defineProperty(window.navigator, "language", {
    value: navigatorLanguage,
    configurable: true,
  });
  return render(
    <I18nProvider>
      <Probe />
    </I18nProvider>
  );
}

describe("I18nProvider", () => {
  it("defaults to English", () => {
    renderProbe("en-GB");
    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("known")).toHaveTextContent("Contact");
  });

  it("picks German up from the browser language", () => {
    renderProbe("de-DE");
    expect(screen.getByTestId("language")).toHaveTextContent("de");
    expect(screen.getByTestId("known")).toHaveTextContent("Kontakt");
  });

  it("ignores an unsupported browser language", () => {
    renderProbe("fr-FR");
    expect(screen.getByTestId("language")).toHaveTextContent("en");
  });

  it("returns the key itself when a translation is missing", () => {
    renderProbe("en-GB");
    expect(screen.getByTestId("unknown")).toHaveTextContent(
      "this.key.does.not.exist"
    );
  });

  it("interpolates parameters through t()", () => {
    renderProbe("en-GB");
    expect(screen.getByTestId("params")).toHaveTextContent("7 min read");
  });

  it("switches language at runtime", async () => {
    const user = userEvent.setup();
    renderProbe("en-GB");
    await user.click(screen.getByRole("button", { name: "de" }));
    expect(screen.getByTestId("language")).toHaveTextContent("de");
    expect(screen.getByTestId("known")).toHaveTextContent("Kontakt");
    expect(screen.getByTestId("params")).toHaveTextContent("7 Min. Lesezeit");
  });

  it("throws when useI18n is used outside the provider", () => {
    expect(() => render(<Probe />)).toThrow(
      /useI18n must be used within an I18nProvider/
    );
  });
});

describe("the translation catalogue", () => {
  const enKeys = Object.keys(translations.en);
  const deKeys = Object.keys(translations.de);

  it("defines the same keys in both languages", () => {
    expect(deKeys.filter((key) => !(key in translations.en))).toEqual([]);
    expect(enKeys.filter((key) => !(key in translations.de))).toEqual([]);
  });

  it("has no empty strings", () => {
    for (const [language, catalogue] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(catalogue)) {
        expect(value.trim(), `${language}.${key}`).not.toBe("");
      }
    }
  });

  it("uses the same placeholders in both languages", () => {
    const placeholders = (value: string) =>
      [...value.matchAll(/(?<!\{)\{(\w+)\}(?!\})/g)].map((m) => m[1]).sort();

    for (const key of enKeys) {
      expect(
        placeholders(translations.de[key as keyof typeof translations.de]),
        key
      ).toEqual(
        placeholders(translations.en[key as keyof typeof translations.en])
      );
    }
  });

  it("leaves no key untranslated by copying the key as its own value", () => {
    for (const [language, catalogue] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(catalogue)) {
        expect(value, `${language}.${key}`).not.toBe(key);
      }
    }
  });
});
