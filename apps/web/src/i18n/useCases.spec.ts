import { describe, expect, it } from 'vitest';
import { de } from './de';
import { en } from './en';
import { render } from '../entry-server';
import { USE_CASE_IDS } from '../lib/routes';

const LOCALES = [
  ['en', en],
  ['de', de],
] as const;

describe('KRITIS use-case copy', () => {
  // Engine-start release isn't built yet, so the page must not present it as available or as part of a pilot.
  it.each([
    ['en', en, 'Engine start release on the vehicle'],
    ['de', de, 'Startfreigabe am Fahrzeug'],
  ] as const)('shows engine-start release as planned (%s)', (locale, copy, title) => {
    const page = copy.useCases.pages.kritis;
    expect(page.capabilities.items.find((item) => item.title === title)?.status).toBe('planned');
    // The hint has to reach the page, not only the dictionary.
    expect(page.hero.trace.plannedNote).toBeTruthy();
    expect(render('kritis', locale)).toContain(page.hero.trace.plannedNote);
  });
});

describe('use-case capability status', () => {
  // Copy strings are widened to `string`, so a typo here would typecheck and render an empty badge.
  const statuses = Object.keys(en.useCases.status).filter((key) => key !== 'legend');

  it.each(LOCALES.flatMap(([locale, copy]) => USE_CASE_IDS.map((id) => [locale, id, copy] as const)))(
    'only uses known statuses (%s, %s)',
    (_locale, id, copy) => {
      for (const item of copy.useCases.pages[id].capabilities.items) expect(statuses).toContain(item.status);
    },
  );
});

describe('English and German copy', () => {
  // The Copy type makes both dictionaries share keys, but not list lengths, flags or the ids of list entries.
  type Diff = string[];
  const compare = (a: unknown, b: unknown, at: string, diff: Diff) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) diff.push(`${at}: ${a.length} vs ${b.length} entries`);
      a.slice(0, b.length).forEach((value, i) => compare(value, b[i], `${at}[${i}]`, diff));
    } else if (a && b && typeof a === 'object' && typeof b === 'object') {
      for (const key of Object.keys(a)) compare((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${at}.${key}`, diff);
    } else if (typeof a !== 'string' || /\]\.(status|key)$/.test(at)) {
      if (a !== b) diff.push(`${at}: ${String(a)} vs ${String(b)}`);
    }
  };

  it('have the same lists, flags, statuses and keys', () => {
    const diff: Diff = [];
    compare(en, de, 'copy', diff);
    expect(diff).toEqual([]);
  });
});
