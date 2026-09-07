import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script id="theme-init">([\s\S]*?)<\/script>/)?.[1];
const tour = readFileSync(new URL('../src/components/workshop/WorkshopTour.tsx', import.meta.url), 'utf8');

test('browser chrome uses RAL 5021', () => {
  assert.ok(html.includes('<meta name="theme-color" content="#256d7b"'));
});

test('resource overview only renders the screenshot for the resolved theme', () => {
  assert.match(tour, /src=\{actualTheme === "dark" \? "\/hero\/app-screenshot-dark\.png" : "\/hero\/app-screenshot\.png"\}/);
  assert.doesNotMatch(tour, /<picture/);
});

for (const [saved, osDark, expected] of [
  [null, true, 'light'],
  ['light', true, 'light'],
  ['dark', false, 'dark'],
  ['system', true, 'dark'],
  ['system', false, 'light'],
  ['invalid', true, 'light'],
  ['blocked', true, 'light'],
]) {
  test(`first paint: ${saved} preference, dark OS=${osDark}`, () => {
    assert.ok(script);
    const classes = new Set(['dark', 'unrelated']);
    const root = {
      classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) },
      style: {},
    };
    runInNewContext(script, {
      localStorage: { getItem: () => {
        if (saved === 'blocked') throw new Error('Storage blocked');
        return saved;
      } },
      window: { matchMedia: () => ({ matches: osDark }) },
      document: { documentElement: root },
    });
    assert.equal(root.style.colorScheme, expected);
    assert.equal(classes.has('dark'), expected === 'dark');
    assert.ok(classes.has('unrelated'));
  });
}
