import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import credits from '../../demo/images/credits.json';
import { shotSrc, type Locale, type ShotName, type Theme } from './site';

const root = path.resolve(__dirname, '../..');
const SHOTS: ShotName[] = [
  'resources',
  'resource-laser',
  'resource-history',
  'resource-people',
  'resource-maintenance',
  'resource-flows',
  'projects',
  'billing',
  'kiosk',
  'printables',
  'mobile-resources',
  'mobile-resource',
];

describe('site assets', () => {
  it('has every screenshot the site can request, in both languages and themes', () => {
    const missing = (['en', 'de'] as Locale[]).flatMap((locale) =>
      (['light', 'dark'] as Theme[]).flatMap((theme) =>
        SHOTS.map((name) => shotSrc(name, locale, theme)).filter((src) => !existsSync(path.join(root, 'public', src))),
      ),
    );
    expect(missing).toEqual([]);
  });

  it('credits every demo photo, and only with licenses that allow use in screenshots', () => {
    const photos = readdirSync(path.join(root, 'demo/images')).filter((file) => file.endsWith('.jpg'));
    expect(credits.map((credit) => credit.file).sort()).toEqual(photos.sort());
    for (const credit of credits) {
      // ShareAlike would put the cropped copies inside our screenshots under the same license.
      expect(credit.license).toMatch(/^(CC BY 2\.0|CC0 1\.0)$/);
      expect(credit.source).toMatch(/^https:\/\/www\.flickr\.com\/photos\//);
    }
  });
});
