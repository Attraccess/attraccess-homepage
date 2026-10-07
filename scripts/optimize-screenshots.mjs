#!/usr/bin/env node
// Converts the raw PNG captures into the WebP files the website ships (public/screenshots/...).
import sharp from 'sharp';
import path from 'node:path';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.resolve(here, '../screenshots-raw');
const OUT = path.resolve(here, '../public/screenshots');

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.png')) yield full;
  }
}

let count = 0;
for (const file of walk(RAW)) {
  const relative = path.relative(RAW, file).replace(/\.png$/, '.webp');
  const target = path.join(OUT, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  const isMobile = path.basename(file).startsWith('mobile-');
  // Desktop captures are 2880 px wide (2×); 2000 px keeps them crisp in a ~1000 px frame on retina.
  await sharp(file)
    .resize({ width: isMobile ? 780 : 2000, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(target);
  count++;
}
console.info(`Optimised ${count} screenshots into ${path.relative(process.cwd(), OUT)}`);
