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
const { route, locale } = resolveRoute(window.location.pathname);
const app = (
  <StrictMode>
    <App page={prerendered ?? route.id} locale={(container.dataset.locale as Locale | undefined) ?? locale} />
  </StrictMode>
);

if (prerendered) hydrateRoot(container, app);
else createRoot(container).render(app);

initAnalytics();
