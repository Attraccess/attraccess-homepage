#!/usr/bin/env node
// Checks every link and asset reference in the built site (run `pnpm build` first):
//   - internal pages, assets and #anchors must exist in dist/
//   - with --external, every external URL must answer with a non-error status
//
//   pnpm check:links [--external]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const checkExternal = process.argv.includes('--external');

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* htmlFiles(full);
    else if (entry.endsWith('.html')) yield full;
  }
}

const pageUrl = (file) => {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === '404.html') return '/404';
  const dir = rel.replace(/index\.html$/, '');
  return `/${dir}`.replace(/\/$/, '') || '/';
};

/** Maps a site path to the file nginx would serve for it, or null. */
function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const candidates = [path.join(dist, clean), path.join(dist, clean, 'index.html')];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

const problems = [];
const external = new Map();
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  const from = pageUrl(file);
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  for (const ref of new Set(refs)) {
    if (ref.startsWith('mailto:') || ref.startsWith('data:')) continue;
    if (/^https?:\/\//.test(ref)) {
      if (!external.has(ref)) external.set(ref, new Set());
      external.get(ref).add(from);
      continue;
    }
    const [target, hash] = ref.split('#');
    const targetPath = target === '' ? from : new URL(target, `https://site${from.endsWith('/') ? from : `${from}/`}`).pathname;
    const targetFile = target === '' ? file : resolveFile(targetPath);
    if (!targetFile) {
      problems.push(`${from}: broken link ${ref}`);
      continue;
    }
    if (hash && targetFile.endsWith('.html') && !idsOf(targetFile).has(hash)) problems.push(`${from}: missing anchor ${ref}`);
  }
}

if (checkExternal) {
  const results = await Promise.all(
    [...external.keys()].map(async (url) => {
      try {
        let response = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'attraccess-homepage-link-check' } });
        // Some hosts reject HEAD; ask again with GET before calling the link broken.
        if (response.status >= 400) response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'attraccess-homepage-link-check' } });
        return [url, response.status];
      } catch (error) {
        return [url, error.message];
      }
    }),
  );
  for (const [url, status] of results) {
    if (typeof status !== 'number' || status >= 400) problems.push(`external ${url} → ${status} (on ${[...external.get(url)].join(', ')})`);
  }
}

console.info(`Checked ${[...htmlFiles(dist)].length} pages, ${external.size} external URLs${checkExternal ? '' : ' (not fetched, pass --external)'}.`);
if (problems.length) {
  console.error(problems.map((p) => `  ✗ ${p}`).join('\n'));
  process.exit(1);
}
console.info('All links OK.');
