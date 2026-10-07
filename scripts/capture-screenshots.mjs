#!/usr/bin/env node
// Captures real product screenshots from a running, demo-seeded Attraccess instance (see seed-demo.mjs).
//
//   node apps/website/scripts/capture-screenshots.mjs --url http://localhost:4200 --locale en --user alex.morgan
//
// Writes PNGs to apps/website/screenshots-raw/<locale>/<theme>/; `optimize-screenshots.mjs` turns them into
// the WebP files the site ships.
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const BASE = String(args.url ?? 'http://localhost:4200');
const LOCALE = args.locale === 'de' ? 'de' : 'en';
const USER = String(args.user ?? 'alex.morgan');
const PASSWORD = String(args.password ?? 'Demo1234!');
const THEMES = args.theme ? [String(args.theme)] : ['light', 'dark'];
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;
const OUT = path.resolve(here, '..', 'screenshots-raw', LOCALE);

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

// Resource ids follow the seed order: 1 laser, 2 printer, 3 cnc, 5 table saw.
const SHOTS = [
  { name: 'resources', path: '/resources' },
  { name: 'resource-laser', path: '/resources/1' },
  { name: 'resource-history', path: '/resources/1/history' },
  { name: 'resource-people', path: '/resources/5/people' },
  { name: 'resource-maintenance', path: '/resources/1/maintenance' },
  { name: 'resource-flows', path: '/resources/1/flows', wait: 2500 },
  { name: 'projects', path: '/projects' },
  { name: 'billing', path: '/billing' },
  { name: 'kiosk', path: '/kiosk/resources/1' },
  { name: 'printables', path: '/printables', wait: 4000 },
  { name: 'mobile-resources', path: '/resources', viewport: MOBILE },
  { name: 'mobile-resource', path: '/resources/1', viewport: MOBILE },
];

async function login(browser, theme) {
  const context = await browser.newContext({ ...DESKTOP, locale: LOCALE, colorScheme: theme });
  const page = await context.newPage();
  const response = await page.request.post(`${BASE}/api/auth/session/local`, {
    data: { username: USER, password: PASSWORD, tokenLocation: 'cookie' },
  });
  if (!response.ok()) throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
  const state = await context.storageState();
  await context.close();
  return state;
}

/** Waits until spinners are gone and every image has decoded, so captures never show loading states. */
async function waitUntilSettled(page) {
  await page
    .waitForFunction(
      () => {
        const busy = document.querySelector('.spinner, [role="progressbar"], [aria-busy="true"], [data-slot="spinner"]');
        const images = [...document.images].every((image) => image.complete);
        return !busy && images;
      },
      undefined,
      { timeout: 20_000, polling: 250 },
    )
    .catch(() => console.warn('    (page did not fully settle, capturing anyway)'));
}

async function capture(browser, theme, storageState, shot, attempt = 1) {
  const viewport = shot.viewport ?? DESKTOP;
  const context = await browser.newContext({
    ...viewport,
    viewport: { width: viewport.width, height: viewport.height },
    locale: LOCALE,
    colorScheme: theme,
    reducedMotion: 'reduce',
    storageState: shot.anonymous ? undefined : storageState,
  });
  const page = await context.newPage();
  await page.addInitScript((value) => {
    for (const key of Object.keys(localStorage)) if (/theme/i.test(key)) localStorage.removeItem(key);
    localStorage.setItem('i18nextLng', value);
  }, LOCALE);
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'load' });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(shot.wait ?? 1500);
  await waitUntilSettled(page);
  // An authenticated shot that lands on the sign-in form means the session hiccuped: try again.
  if (!shot.anonymous && (await page.locator('input[type="password"]').count()) > 0) {
    await context.close();
    if (attempt >= 3) throw new Error(`${shot.name}: still on the sign-in page after ${attempt} attempts`);
    console.warn(`    ${shot.name}: landed on sign-in, retrying`);
    return capture(browser, theme, storageState, shot, attempt + 1);
  }
  await page.waitForTimeout(400);
  // Hide transient UI (toasts, PWA install prompts) so every capture is clean.
  await page.addStyleTag({ content: '[data-sonner-toaster], pwa-install, .Toastify { display: none !important; } *, *::before, *::after { caret-color: transparent !important; }' });
  const dir = path.join(OUT, theme);
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${shot.name}.png`) });
  await context.close();
  console.info(`  ${LOCALE}/${theme}/${shot.name}.png`);
}

const browser = await chromium.launch();
try {
  for (const theme of THEMES) {
    const storageState = await login(browser, theme);
    for (const shot of SHOTS) {
      if (ONLY && !ONLY.has(shot.name)) continue;
      await capture(browser, theme, storageState, shot);
    }
  }
} finally {
  await browser.close();
}
