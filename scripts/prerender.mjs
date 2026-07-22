// Postbuild: bake per-route <head> meta into static HTML so non-JS OG scrapers
// (Slack/Facebook/LinkedIn/WhatsApp) get the right card on deep links. Body stays
// the SPA shell — scrapers only read <head>, and Google renders the JS body itself.
// ponytail: head-only static injection, no headless browser. Route content lives
// in src/lib/seo-meta.json (shared with the useSEO hook). Keep the 3 constants below
// in sync with src/hooks/use-seo.ts.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const SITE_NAME = "Attraccess";
const DEFAULT_TITLE = `${SITE_NAME} — Access & Lifecycle for Shared Resources`;
const DEFAULT_DESCRIPTION =
  "Control and automate access to shared machines, tools and doors. Usage analytics, maintenance scheduling, RBAC and SSO — self-hosted, free for non-profits.";
const ORIGIN = "https://attraccess.org";

const routes = JSON.parse(readFileSync(join(root, "src/lib/seo-meta.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Replace an attribute's value on a tag matched by a stable anchor attribute.
function setAttr(html, anchor, valueAttr, value) {
  const re = new RegExp(`(${anchor}[^>]*?${valueAttr}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender: could not find ${anchor} / ${valueAttr}`);
  return html.replace(re, `$1${esc(value)}$2`);
}

for (const [path, meta] of Object.entries(routes)) {
  if (path === "/") continue; // dist/index.html already carries the home meta

  const title = meta.title ? `${meta.title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const description = meta.description ?? DEFAULT_DESCRIPTION;
  const url = `${ORIGIN}${meta.canonicalPath ?? path}`;

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  if (html === template) throw new Error(`prerender: <title> not found for ${path}`);

  html = setAttr(html, '<meta name="description"', "content", description);
  html = setAttr(html, '<meta property="og:title"', "content", title);
  html = setAttr(html, '<meta property="og:description"', "content", description);
  html = setAttr(html, '<meta property="og:url"', "content", url);
  html = setAttr(html, '<meta name="twitter:title"', "content", title);
  html = setAttr(html, '<meta name="twitter:description"', "content", description);
  html = setAttr(html, '<link rel="canonical"', "href", url);

  // Self-check: the baked title must actually be present.
  if (!html.includes(`<title>${esc(title)}</title>`))
    throw new Error(`prerender: title injection failed for ${path}`);

  const outDir = join(dist, meta.canonicalPath ?? path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered ${path} -> ${title}`);
}
