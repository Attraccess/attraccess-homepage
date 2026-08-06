// Postbuild full-page prerender: serve the built SPA, render each route in a
// headless browser, and write the fully-rendered HTML (body + head meta) to
// dist/<route>/index.html. This gives non-JS crawlers/scanners real content
// (H1, headings, internal links, text) — not just the empty SPA shell — and
// correct per-route OG/meta (useSEO runs during the snapshot).
// Routes come from src/lib/seo-meta.json. Third-party embeds (analytics) are
// blocked so their markup never bakes into the static HTML.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { preview } from "vite";
import puppeteer from "puppeteer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = Object.keys(JSON.parse(readFileSync(join(root, "src/lib/seo-meta.json"), "utf8")));
const PORT = 4188;
const BLOCK = /google-analytics|googletagmanager|doubleclick|matomo|piwik/i;
// Matomo's script/endpoint can be renamed arbitrarily (VITE_MATOMO_SCRIPT), so
// block the configured host too — window.__PRERENDER__ below is the real guard.
const matomoHost = (process.env.VITE_MATOMO_HOST || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const isBlocked = (url) => BLOCK.test(url) || (matomoHost !== "" && url.includes(matomoHost));

// Prefer a system Chromium (Debian build image installs it via railpack.json
// buildAptPackages, so its shared libs are guaranteed present); fall back to
// puppeteer's bundled download locally (macOS dev).
const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].find(existsSync);

const server = await preview({ root, preview: { port: PORT, strictPort: true } });
const browser = await puppeteer.launch({
  headless: true,
  executablePath: chromePath || undefined,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

let failed = false;
for (const path of routes) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => (isBlocked(req.url()) ? req.abort() : req.continue()));
  // keeps src/lib/analytics.ts inert: no tracker <script> in the snapshot, no
  // page views recorded for the build-time crawl
  await page.evaluateOnNewDocument(() => {
    window.__PRERENDER__ = true;
  });

  try {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle2", timeout: 45000 });
    await page.waitForSelector("#root > *", { timeout: 15000 });
    await page.waitForSelector("h1", { timeout: 15000 }).catch(() => {});

    const html = "<!DOCTYPE html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));

    // Self-check: the snapshot must contain real rendered content, not the shell.
    if (/<div id="root">\s*<\/div>/.test(html)) throw new Error("empty #root");

    const outDir = path === "/" ? join(root, "dist") : join(root, "dist", path);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html);
    console.log(`prerendered ${path} (${(html.length / 1024).toFixed(0)} kB)`);
  } catch (err) {
    failed = true;
    console.error(`prerender FAILED for ${path}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
await server.httpServer.close();
if (failed) {
  console.error("prerender: one or more routes failed — build aborted.");
  process.exit(1);
}
process.exit(0);
