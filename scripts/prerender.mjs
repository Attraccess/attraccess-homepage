#!/usr/bin/env node
// Turns the client build into static, crawlable HTML for every route in src/lib/routes.ts, plus
// sitemap.xml and robots.txt. Runs after `vite build` and `vite build --ssr src/entry-server.tsx`.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const SITE = (process.env.SITE_URL ?? 'https://attraccess.org').replace(/\/+$/, '');

const { render, COPY, ROUTES } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function titleFor(id, copy) {
  switch (id) {
    case 'home':
      return { title: copy.meta.title, description: copy.meta.description };
    case 'contact':
      return { title: copy.contact.metaTitle, description: copy.contact.metaDescription };
    case 'credits':
      return { title: copy.credits.metaTitle, description: copy.credits.metaDescription };
    case 'privacy':
      return { title: 'Datenschutzerklärung – Attraccess', description: 'Informationen zur Verarbeitung personenbezogener Daten auf attraccess.org.' };
    case 'terms':
      return { title: 'AGB – Attraccess', description: 'Allgemeine Geschäftsbedingungen für Attraccess.' };
    case 'imprint':
      return { title: 'Impressum – Attraccess', description: 'Impressum von attraccess.org.' };
    default:
      return { title: `404 – ${copy.notFound.title}`, description: copy.notFound.lead };
  }
}

const structuredData = (locale) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Attraccess',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Self-hosted (Linux, Docker)',
    url: SITE,
    inLanguage: locale,
    description: COPY[locale].meta.description,
    image: `${SITE}/og-${locale}.png`,
    license: 'https://github.com/Attraccess/Attraccess/blob/main/LICENSE.md',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Free for non-profit organisations' },
    author: { '@type': 'Organization', name: 'Attraccess', url: SITE, email: 'contact@attraccess.org', sameAs: ['https://github.com/Attraccess/Attraccess'] },
  });

// The browser-language redirect in index.html needs the en ↔ de path pairs; keep them in sync with ROUTES.
const languagePairs = Object.fromEntries(ROUTES.filter((r) => r.paths.en !== r.paths.de).map((r) => [r.paths.en, r.paths.de]));

const outputFile = (urlPath) => {
  if (urlPath === '/404') return path.join(dist, '404.html');
  return path.join(dist, urlPath, 'index.html');
};

const written = new Set();
for (const route of ROUTES) {
  const translated = route.paths.en !== route.paths.de;
  for (const locale of translated ? ['en', 'de'] : [route.contentLocale ?? 'en']) {
    const urlPath = route.paths[locale];
    if (written.has(urlPath)) continue;
    written.add(urlPath);
    const copy = COPY[locale];
    const { title, description } = titleFor(route.id, copy);
    const url = `${SITE}${urlPath}`;
    const head = [
      route.indexable ? `<link rel="canonical" href="${url}" />` : '<meta name="robots" content="noindex, follow" />',
      ...(translated && route.indexable
        ? [
            `<link rel="alternate" hreflang="en" href="${SITE}${route.paths.en}" />`,
            `<link rel="alternate" hreflang="de" href="${SITE}${route.paths.de}" />`,
            `<link rel="alternate" hreflang="x-default" href="${SITE}${route.paths.en}" />`,
          ]
        : []),
      '<meta property="og:site_name" content="Attraccess" />',
      '<meta property="og:type" content="website" />',
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${escape(title)}" />`,
      `<meta property="og:description" content="${escape(description)}" />`,
      `<meta property="og:image" content="${SITE}/og-${locale}.png" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      `<meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'de_DE'}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      ...(route.id === 'home' ? [`<script type="application/ld+json">${structuredData(locale)}</script>`] : []),
    ].join('\n    ');

    const html = template
      .replace('<html lang="en">', `<html lang="${route.contentLocale ?? locale}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
      .replace('<!--head-meta-->', head)
      .replace(/\/\*language-pairs\*\/ \{[^}]*\}/, JSON.stringify(languagePairs))
      .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-page="${route.id}" data-locale="${locale}">${render(route.id, locale)}</div>`);
    if (html.includes('<!--app-html-->') || html.includes('/*language-pairs*/')) throw new Error(`Template placeholders left in ${urlPath}`);

    const file = outputFile(urlPath);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, html);
    console.info(`prerendered ${urlPath.padEnd(14)} → ${path.relative(root, file)}`);
  }
}

const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.indexable).flatMap((route) =>
  ['en', 'de'].map(
    (locale) => `  <url>
    <loc>${SITE}${route.paths[locale]}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${route.paths.en}"/>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE}${route.paths.de}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${route.paths.en}"/>
  </url>`,
  ),
);
writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
);
writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.info('wrote sitemap.xml and robots.txt');

rmSync(ssrDir, { recursive: true, force: true });
