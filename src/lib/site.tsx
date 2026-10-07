import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { en, type Copy } from '../i18n/en';
import type { PageId } from './routes';
import { de } from '../i18n/de';

export type Locale = 'en' | 'de';
export type Theme = 'light' | 'dark';

const COPY: Record<Locale, Copy> = { en, de };
// Storage keys are documented in the privacy policy (Datenschutz, section 3) – keep them in sync.
export const THEME_KEY = 'theme';
export const LANGUAGE_KEY = 'language';

interface SiteContextValue {
  page: PageId;
  locale: Locale;
  copy: Copy;
  theme: Theme;
  toggleTheme: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

/**
 * The theme lives on <html> (set before first paint by the script in index.html), so it is read as an
 * external store. Prerendered HTML is always light: the server snapshot keeps hydration consistent and
 * React re-renders with the real theme straight after. Without a stored choice the site follows the
 * operating system, including live changes (e.g. automatic dark mode at sunset).
 */
const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function writeTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode: the toggle still works for this visit.
  }
  themeListeners.forEach((listener) => listener());
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const followSystem = (event: MediaQueryListEvent) => {
    if (storedTheme()) return;
    const root = document.documentElement;
    root.classList.toggle('dark', event.matches);
    root.classList.toggle('light', !event.matches);
    root.dataset.theme = event.matches ? 'dark' : 'light';
    listener();
  };
  media.addEventListener('change', followSystem);
  return () => {
    themeListeners.delete(listener);
    media.removeEventListener('change', followSystem);
  };
}

/** Remembers an explicit language choice (the redirect in index.html honours it on the next visit). */
export function rememberLanguage(locale: Locale) {
  try {
    localStorage.setItem(LANGUAGE_KEY, locale);
  } catch {
    // Private mode: the ?lang= parameter still carries the choice for this navigation.
  }
}

export function SiteProvider({ page, locale, children }: { page: PageId; locale: Locale; children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => 'light');
  const toggleTheme = useCallback(() => writeTheme(readTheme() === 'dark' ? 'light' : 'dark'), []);

  const value = useMemo(() => ({ page, locale, copy: COPY[locale], theme, toggleTheme }), [page, locale, theme, toggleTheme]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used inside <SiteProvider>');
  return context;
}

export type ShotName =
  | 'resources'
  | 'resource-laser'
  | 'resource-history'
  | 'resource-people'
  | 'resource-maintenance'
  | 'resource-flows'
  | 'projects'
  | 'billing'
  | 'kiosk'
  | 'printables'
  | 'mobile-resources'
  | 'mobile-resource';

/** Real product screenshots captured by scripts/capture-screenshots.mjs. */
export function shotSrc(name: ShotName, locale: Locale, theme: Theme): string {
  return `/screenshots/${locale}/${theme}/${name}.webp`;
}

/** Fills `{placeholders}` in copy strings. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}
