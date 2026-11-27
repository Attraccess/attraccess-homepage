import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';
import { keepDashes } from './text';
import { render } from '../entry-server';

describe('spaced dashes', () => {
  it('binds the dash to the word before it in nested copy', () => {
    expect(keepDashes({ list: ['a – b — c'], plain: 'start- und Ende' })).toEqual({
      list: ['a – b — c'],
      plain: 'start- und Ende',
    });
  });

  // Covers copy and hand-written page text alike: a breakable space before a dash lets a line start with it.
  it.each(ROUTES.flatMap((route) => (['en', 'de'] as const).map((locale) => [route.id, locale] as const)))(
    'never renders a breakable space before a dash (%s, %s)',
    (page, locale) => {
      // Text between tags; React's empty comments only separate adjacent strings of one text run.
      const chunks = render(page, locale).split('<!-- -->').join('').split(/<[^>]+>/);
      expect(chunks.filter((chunk) => /[ \n\t][–—] /.test(chunk))).toEqual([]);
    },
  );
});
