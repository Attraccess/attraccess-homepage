import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { initAnalytics } from './lib/analytics';
import { resolveRoute, type PageId } from './lib/routes';
import type { Locale } from './lib/site';
import './styles.css';

const container = document.getElementById('root') as HTMLElement;

// Prerendered pages say which page they contain (the web server may serve index.html or 404.html for
// unknown paths); the dev server renders from the URL instead.
const prerendered = container.dataset.page as PageId | undefined;
const resolved = resolveRoute(window.location.pathname);
const { route } = resolved;
// The prerendered locale wins over the URL: the 404 page is English even when served under /de/.
const locale = (container.dataset.locale as Locale | undefined) ?? resolved.locale;
// Prerendered pages already carry the right lang; the dev server's template doesn't, and hyphenation depends on it.
document.documentElement.lang = route.contentLocale ?? locale;
const app = (
  <StrictMode>
    <App page={prerendered ?? route.id} locale={locale} />
  </StrictMode>
);

if (prerendered) hydrateRoot(container, app);
else createRoot(container).render(app);

initAnalytics();
