import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES, USE_CASE_IDS, languageSwitchHref, pathFor, resolveRoute } from './routes';

describe('routes', () => {
  // The build rewrites this map from ROUTES, but the dev server serves the hand-written one.
  it('keeps the language redirect map in index.html in sync with ROUTES', () => {
    const html = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
    const literal = html.match(/\/\*language-pairs\*\/ (\{[^}]*\})/)?.[1] ?? '';
    const pairs = Object.fromEntries([...literal.matchAll(/'([^']+)': '([^']+)'/g)].map((m) => [m[1], m[2]]));
    expect(pairs).toEqual(Object.fromEntries(ROUTES.filter((r) => r.paths.en !== r.paths.de).map((r) => [r.paths.en, r.paths.de])));
  });

  it('resolves every use-case page in both languages and switches between them', () => {
    for (const id of USE_CASE_IDS) {
      for (const [locale, other] of [['en', 'de'], ['de', 'en']] as const) {
        const resolved = resolveRoute(`${pathFor(id, locale)}/`);
        expect([resolved.route.id, resolved.locale]).toEqual([id, locale]);
        expect(languageSwitchHref(id, other)).toBe(`${pathFor(id, other)}?lang=${other}`);
      }
    }
    expect(resolveRoute('/use-cases/foo').route.id).toBe('notFound');
  });
});
