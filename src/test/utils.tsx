import React from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider, type Language } from "@/contexts/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface RenderWithProvidersOptions extends Omit<
  RenderOptions,
  "wrapper"
> {
  /** UI language. `I18nProvider` picks this up from `navigator.language`. */
  language?: Language;
  /** Initial router entry. */
  route?: string;
}

/**
 * Render a component inside the providers the app supplies in production.
 *
 * `I18nProvider` derives the language from `navigator.language` on mount, so
 * that is what we stub rather than reaching into the context.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { language = "en", route = "/", ...options }: RenderWithProvidersOptions = {}
): RenderResult {
  Object.defineProperty(window.navigator, "language", {
    value: language === "de" ? "de-DE" : "en-GB",
    configurable: true,
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <TooltipProvider>
          <I18nProvider>{children}</I18nProvider>
        </TooltipProvider>
      </MemoryRouter>
    ),
    ...options,
  });
}

/**
 * A dotted, lower-case, space-free token — what `t()` returns when a key has no
 * translation. Real copy never looks like this.
 */
const KEY_SHAPED = /^[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*)+$/;

/** Text that legitimately looks like a translation key. */
const ALLOWED = new Set(["docker", "attraccess.org"]);

/**
 * Collect every rendered text node that looks like an untranslated i18n key.
 *
 * This is the safety net for keys built at runtime (`t(\`prefix.${x}\`)`),
 * which a static scan of the source cannot see.
 */
export function findUntranslatedKeys(container: HTMLElement): string[] {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const found = new Set<string>();

  let node = walker.nextNode();
  while (node) {
    const text = node.textContent?.trim() ?? "";
    if (text && KEY_SHAPED.test(text) && !ALLOWED.has(text)) {
      found.add(text);
    }
    node = walker.nextNode();
  }

  // aria-label and alt carry translated copy too.
  container
    .querySelectorAll("[aria-label], [alt], [title]")
    .forEach((element) => {
      for (const attribute of ["aria-label", "alt", "title"]) {
        const value = element.getAttribute(attribute)?.trim();
        if (value && KEY_SHAPED.test(value) && !ALLOWED.has(value)) {
          found.add(value);
        }
      }
    });

  return [...found].sort();
}

/** Assert a rendered tree contains no untranslated keys. */
export function expectNoUntranslatedKeys(container: HTMLElement): void {
  const missing = findUntranslatedKeys(container);
  if (missing.length) {
    throw new Error(
      `Rendered output contains ${missing.length} untranslated key(s):\n  ${missing.join("\n  ")}`
    );
  }
}
