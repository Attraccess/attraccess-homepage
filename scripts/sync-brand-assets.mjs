import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Pinned first-party exports only. Never regenerate, recolor, or capture an account.
const sources = [
  {
    repo: 'Attraccess/attraccess-homepage',
    ref: 'cd35349c2de206394e9fa2fd34e0de01f0e6cdbf',
    from: 'public/',
    to: 'public/',
    assets: [
      ['logo.svg', '1ff9e1c058b7ac9962ea6667b844fe35ee9d48a0'],
      ['logo.png', 'c8ab950e45073956517b7c2fc85860966f41a061'],
      ['favicon.ico', 'fba05a9e0d585665536eae782e5db29c345e2fd2'],
      ['og-image.png', 'a2e30a4c05ebd0394a68410a6d788a32a63577df'],
      ['hero/app-screenshot.png', 'a2e30a4c05ebd0394a68410a6d788a32a63577df'],
      ['hero/app-screenshot-dark.png', 'ebcfddfe955adcc497dfc7db24b3021562a5a3e8'],
    ],
  },
  {
    repo: 'Attraccess/Attraccess',
    ref: 'd37f3eaa7790588a6d0d49ec2ac6123a2c1c4521',
    from: 'docs/_media/',
    to: 'public/reader-ui/',
    assets: [
      ['firmware-theme-init.png', 'fb90d26df328308ecaaf97a947ceecbe060086e2'],
      ['firmware-theme-enrollment.png', '8a88ba067cdd53e8a0a8058dbb93a94904ffa76f'],
      ['firmware-theme-reset.png', 'ed2807e9b4408d9de96ddc88eefd1135215fbf05'],
      ['firmware-theme-supervision.png', '0ac0683d82b17c9915bbc10029948779edaca351'],
      ['firmware-theme-pin.png', '374be6aab1ee3ef6b149856c90446809377a9bab'],
      ['firmware-theme-pin-error.png', 'c5349d96642c938539d60de220fa62942bd9996b'],
      ['firmware-theme-overview.png', 'f7e97a357fb817f7aab4ca5f477ec58a31e73a69'],
    ],
  },
  {
    repo: 'Attraccess/Attraccess',
    ref: 'ceb366969b93da429ba8b8119d1f17c1cecf5972',
    from: 'docs/_media/',
    to: 'public/reader-ui/',
    assets: [
      ['brand-resource-details.png', '207df7e697095da00abecfc7786e05f4716a3a9a'],
      ['brand-resource-details-mobile.png', '427d0e2a017733f2ce802e77da007070e46e54e6'],
      ['brand-resource-maintenance.png', '63ffb379cd6421b8d250e3d0e74c3994d2ac8704'],
      ['brand-flow-editor.png', '09341d70cfdf670b37da13a9305d90c6a4bc3490'],
    ],
  },
];

if (process.argv.slice(2).some((argument) => argument !== '--check')) {
  throw new Error('Usage: node scripts/sync-brand-assets.mjs [--check]');
}
const checkOnly = process.argv.includes('--check');
let totalBytes = 0;

for (const source of sources) {
  for (const [name, expectedHash] of source.assets) {
    const destination = new URL(`../${source.to}${name}`, import.meta.url);
    // Decode API content mechanically; gh's raw binary output can fail on PNGs.
    const bytes = checkOnly ? readFileSync(destination) : Buffer.from(execFileSync('gh', [
      'api', `repos/${source.repo}/contents/${source.from}${name}?ref=${source.ref}`,
      '-H', 'Accept: application/vnd.github+json', '--jq', '.content',
    ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] }), 'base64');
    const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    if (hash !== expectedHash) throw new Error(`Git blob mismatch: ${source.to}${name}`);

    if (!checkOnly) {
      mkdirSync(new URL('.', destination), { recursive: true });
      writeFileSync(destination, bytes);
    }
    totalBytes += bytes.length;
    const dimensions = name.endsWith('.png') ? `, ${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}` : '';
    console.log(`${checkOnly ? 'Verified' : 'Synced'} ${source.to}${name} (${bytes.length} bytes${dimensions})`);
  }
}

console.log(`Verified first-party bytes: ${totalBytes}. See docs/research/workshop-brand-reference.md for provenance.`);
