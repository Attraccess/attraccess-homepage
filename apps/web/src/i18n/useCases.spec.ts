import { describe, expect, it } from 'vitest';
import { de } from './de';
import { en } from './en';

describe('KRITIS use-case copy', () => {
  // Engine-start release isn't built yet, so the page must not present it as available or as part of a pilot.
  it.each([
    ['en', en, 'Engine start release on the vehicle'],
    ['de', de, 'Startfreigabe am Fahrzeug'],
  ])('shows engine-start release as planned (%s)', (_locale, copy, title) => {
    const page = copy.useCases.pages.kritis;
    expect(page.capabilities.items.find((item) => item.title === title)?.status).toBe('planned');
    expect(page.hero.trace.plannedNote).toBeTruthy();
  });
});
