#!/usr/bin/env node
// Renders the 1200 × 630 social preview images (public/og-en.png, public/og-de.png) from real brand
// assets and product screenshots. Re-run after refreshing screenshots.
import { chromium } from 'playwright';
import path from 'node:path';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, '../public');
const require = createRequire(import.meta.url);
const fontFile = (pkg, file) => pathToFileURL(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files', file)).href;
const asset = (file) => pathToFileURL(path.join(publicDir, file)).href;

const COPY = {
  en: { title: ['Every machine.', 'Every operator.', 'One tap.'], tagline: 'Machine access control for industry, R&amp;D and universities.' },
  de: { title: ['Jede Maschine.', 'Jede Fachkraft.', 'Ein Tap.'], tagline: 'Maschinenzugang für Industrie, Forschung und Hochschulen.' },
};

function html(locale) {
  const { title, tagline } = COPY[locale];
  return `<!doctype html><html><head><style>
  @font-face { font-family: Bricolage; src: url(${fontFile('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')}); font-weight: 200 800; }
  @font-face { font-family: Inter; src: url(${fontFile('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')}); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0e1719; color: #f4f8f8; font-family: Inter; position: relative; }
  .glow { position: absolute; inset: -200px -100px auto auto; width: 900px; height: 900px; background: radial-gradient(closest-side, rgba(37,109,123,.55), transparent); }
  .wall { position: absolute; right: -40px; bottom: -40px; width: 620px; opacity: .35; }
  .copy { position: absolute; left: 72px; top: 70px; width: 510px; }
  .logo { display: flex; align-items: center; gap: 12px; font-family: Bricolage; font-size: 30px; font-weight: 700; }
  .logo img { height: 48px; }
  h1 { margin-top: 44px; font-family: Bricolage; font-size: 76px; line-height: .95; letter-spacing: -0.04em; font-weight: 800; }
  h1 span:last-child { color: #82c4ce; }
  p { margin-top: 28px; font-size: 24px; line-height: 1.35; color: rgba(244,248,248,.72); }
  .shot { position: absolute; left: 650px; top: 120px; width: 760px; border-radius: 14px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08); transform: perspective(1400px) rotateY(-14deg) rotateX(4deg); transform-origin: left center; }
  .shot img { display: block; width: 100%; }
  .mascot { position: absolute; left: 590px; bottom: -10px; width: 120px; filter: drop-shadow(0 20px 30px rgba(0,0,0,.5)); }
  </style></head><body>
  <div class="glow"></div>
  <img class="wall" src="${asset('brand/neon-wallpaper.webp')}">
  <div class="copy">
    <div class="logo"><img src="${asset('logo.png')}">Attraccess</div>
    <h1>${title.map((line) => `<span style="display:block">${line}</span>`).join('')}</h1>
    <p>${tagline}</p>
  </div>
  <div class="shot"><img src="${asset(`screenshots/${locale}/dark/resources.webp`)}"></div>
  <img class="mascot" src="${asset('brand/mascot.webp')}">
  </body></html>`;
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'attraccess-og-'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const locale of Object.keys(COPY)) {
    // A file:// page (unlike about:blank) may load the local fonts, screenshots and brand assets.
    const file = path.join(tmp, `og-${locale}.html`);
    writeFileSync(file, html(locale));
    await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(publicDir, `og-${locale}.png`) });
    console.info(`wrote public/og-${locale}.png`);
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
