// Postbuild full-page prerender: serve the built SPA, render each route in a
// headless browser, and write the fully-rendered HTML (body + head meta) to
// dist/<route>/index.html. This gives non-JS crawlers/scanners real content
// (H1, headings, internal links, text) — not just the empty SPA shell — and
// correct per-route OG/meta (useSEO runs during the snapshot).
// Routes come from src/lib/seo-meta.json. Third-party embeds (HubSpot chat,
// analytics) are blocked so their markup never bakes into the static HTML.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { preview } from "vite";
import puppeteer from "puppeteer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = Object.keys(JSON.parse(readFileSync(join(root, "src/lib/seo-meta.json"), "utf8")));
const PORT = 4188;
const BLOCK = /hs-scripts|hs-analytics|hs-banner|hsforms|hubspot|usemessages|hscollectedforms|google-analytics|googletagmanager|doubleclick/i;

const server = await preview({ root, preview: { port: PORT, strictPort: true } });
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

let failed = false;
for (const path of routes) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => (BLOCK.test(req.url()) ? req.abort() : req.continue()));

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
