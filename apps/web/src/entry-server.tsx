import { renderToString } from 'react-dom/server';
import { App } from './App';
import { en } from './i18n/en';
import { de } from './i18n/de';
import { ROUTES, type PageId } from './lib/routes';
import type { Locale } from './lib/site';

export { ROUTES };
export const COPY = { en, de };

export function render(page: PageId, locale: Locale): string {
  return renderToString(<App page={page} locale={locale} />);
}
