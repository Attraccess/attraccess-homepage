// Every page of the site. Prerendering, the sitemap, the language switch and the browser-language
// redirect in index.html are all driven by this list, so a new page only has to be added here.
import type { Locale } from './site';

export type PageId = 'home' | 'contact' | 'credits' | 'privacy' | 'terms' | 'imprint' | 'notFound';

export interface PageRoute {
  id: PageId;
  /** Path per language. Legal pages only exist in German, so both languages point at the same path. */
  paths: Record<Locale, string>;
  /** Language the page content is written in when it isn't translated. */
  contentLocale?: Locale;
  indexable: boolean;
}

export const ROUTES: PageRoute[] = [
  { id: 'home', paths: { en: '/', de: '/de/' }, indexable: true },
  { id: 'contact', paths: { en: '/contact', de: '/de/contact' }, indexable: true },
  { id: 'credits', paths: { en: '/credits', de: '/de/credits' }, indexable: true },
  { id: 'privacy', paths: { en: '/datenschutz', de: '/datenschutz' }, contentLocale: 'de', indexable: false },
  { id: 'terms', paths: { en: '/agb', de: '/agb' }, contentLocale: 'de', indexable: false },
  { id: 'imprint', paths: { en: '/impressum', de: '/impressum' }, contentLocale: 'de', indexable: false },
  { id: 'notFound', paths: { en: '/404', de: '/404' }, indexable: false },
];

/** Normalises `/contact/`, `/de` and `/de/index.html` to the canonical paths used in ROUTES. */
export function normalizePath(pathname: string): string {
  let path = pathname.replace(/index\.html$/, '');
  if (path === '/de') return '/de/';
  if (path.length > 1 && path.endsWith('/') && path !== '/de/') path = path.slice(0, -1);
  return path || '/';
}

export interface ResolvedRoute {
  route: PageRoute;
  locale: Locale;
}

export function resolveRoute(pathname: string): ResolvedRoute {
  const path = normalizePath(pathname);
  for (const route of ROUTES) {
    if (route.paths.en === route.paths.de && route.paths.en === path) return { route, locale: route.contentLocale ?? 'en' };
    if (route.paths.de === path) return { route, locale: 'de' };
    if (route.paths.en === path) return { route, locale: 'en' };
  }
  return { route: ROUTES.find((r) => r.id === 'notFound') as PageRoute, locale: path.startsWith('/de/') ? 'de' : 'en' };
}

export function pathFor(id: PageId, locale: Locale): string {
  return (ROUTES.find((route) => route.id === id) as PageRoute).paths[locale];
}

/**
 * Links that change language carry `?lang=` so the pre-paint script in index.html can remember the
 * choice even before React has hydrated; it strips the parameter again.
 */
export function languageSwitchHref(id: PageId, target: Locale): string {
  const route = ROUTES.find((r) => r.id === id) as PageRoute;
  const path = route.paths.en === route.paths.de ? pathFor('home', target) : route.paths[target];
  return `${path}?lang=${target}`;
}
