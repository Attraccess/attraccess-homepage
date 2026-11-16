// Generates de/index.html from index.html (the English source of truth): German copy and the ".de" media.
//   node apps/hero-film/preview/build-de.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(here, 'index.html'), 'utf8');

const replace = (from, to) => {
  if (!html.includes(from)) throw new Error(`Missing in index.html: ${from}`);
  html = html.split(from).join(to);
};

replace('<html lang="en">', '<html lang="de">');
replace('<title>Attraccess — hero film embed preview</title>', '<title>Attraccess — Vorschau Hero-Film</title>');
replace('<a href="./" aria-current="page" hreflang="en">EN</a><a href="de/" hreflang="de">DE</a>', '<a href="../" hreflang="en">EN</a><a href="./" aria-current="page" hreflang="de">DE</a>');
replace('aria-label="Language"', 'aria-label="Sprache"');
replace('Machine access control for workshops, labs and universities', 'Maschinenzugang für Werkstätten, Labore und Hochschulen');
replace('Every machine. Every operator. One tap.', 'Jede Maschine. Jede Fachkraft. Ein Tap.');
replace(
  `Attraccess checks introductions at the reader, enables the resource through its configured control path, and records every session for
        billing, maintenance and audits.`,
  `Attraccess prüft Einweisungen direkt am Leser, gibt die Ressource über den konfigurierten Steuerpfad frei und dokumentiert jede Sitzung
        für Abrechnung, Wartung und Audits.`,
);
replace('Book a free intro call →', 'Kostenloses Erstgespräch →');
replace('>Try the reader<', '>Leser ausprobieren<');
replace("'Pause film'", "'Film pausieren'");
replace("'Play film'", "'Film abspielen'");
replace('aria-label="Pause film"', 'aria-label="Film pausieren"');
replace('Embed diagnostics', 'Embed-Diagnose');
html = html.replace(
  /aria-label="Product film:[^"]*"/,
  'aria-label="Produktfilm: Ein Kartentap am Attractap-Leser wird zur geprüften Einweisung, zur laufenden Sitzung, zu einem Flow, der Strom schaltet und den PC entsperrt, zur Abrechnung und zur geplanten Wartung – dann öffnet sich der Blick auf die Integrationen rund um den Attraccess-Kreislauf."',
);
// Media: one folder up, German suffix before the codec/format extension.
html = html.replace(/(["'])media\/(hero-(?:landscape|portrait)|poster-(?:landscape|portrait))\./g, '$1../media/$2.de.');

mkdirSync(join(here, 'de'), { recursive: true });
writeFileSync(join(here, 'de', 'index.html'), html);
console.log('wrote de/index.html');
