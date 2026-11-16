// Lossless conversion of the production harness's RGB565-expanded RGBA output.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const workspace = path.resolve(__dirname, '../..');
const sharp = require(require.resolve('sharp', { paths: [path.join(workspace, 'software')] }));
const rawRoot = process.argv[2];
const output = path.join(workspace, 'assets/reader');

async function main() {
  if (!rawRoot) throw new Error('Usage: node export.cjs RAW_ROOT');
  const screens = [];
  for (const locale of ['en', 'de']) {
    const dest = path.join(output, locale === 'en' ? 'dark-en' : 'dark-production-de');
    await fs.mkdir(dest, { recursive: true });
    for (const filename of (await fs.readdir(path.join(rawRoot, locale))).sort()) {
      if (!filename.endsWith('.rgba')) continue;
      const name = filename.replace(/\.rgba$/, '');
      const data = await fs.readFile(path.join(rawRoot, locale, filename));
      if (data.length !== 480 * 480 * 4) throw new Error(`Wrong framebuffer size: ${filename}`);
      const source = () => sharp(data, { raw: { width: 480, height: 480, channels: 4 } });
      await source().png().toFile(path.join(dest, `${name}.png`));
      await source().resize(1440, 1440, { kernel: 'nearest' }).png().toFile(path.join(dest, `${name}@3x.png`));
      const relative = path.relative(output, path.join(dest, `${name}.png`));
      screens.push({ file: relative, width: 480, height: 480,
        upscale: relative.replace(/\.png$/, '@3x.png'), upscaleWidth: 1440, upscaleHeight: 1440,
        genuineProductionCode: true, copy: locale === 'en' ? 'capture-only English label substitution' : 'unchanged production German',
        rgbaSha256: crypto.createHash('sha256').update(data).digest('hex') });
      await fs.mkdir(path.join(output, 'qa', locale), { recursive: true });
      await fs.copyFile(path.join(rawRoot, locale, `${name}.labels.txt`), path.join(output, 'qa', locale, `${name}.labels.txt`));
    }
  }
  const hardware = path.join(output, 'hardware');
  await fs.mkdir(hardware, { recursive: true });
  await fs.copyFile(path.join(workspace, '../web/public/hardware/attractap.webp'), path.join(hardware, 'attractap-homepage.webp'));
  await sharp(path.join(hardware, 'attractap-homepage.webp')).png().toFile(path.join(hardware, 'attractap-homepage.png'));
  await fs.copyFile(path.join(workspace, 'software/apps/attractap/desktop/assets/attractap.png'), path.join(hardware, 'attractap-front-original.png'));
  // Coordinates come from desktop/src/sdl_display.cpp's Screen rectangle and
  // its 500x901 logical device canvas, scaled to each source image.
  const rects = [
    { file: 'attractap-homepage.webp', width: 900, height: 1622, screen: { x: 18, y: 126, width: 864, height: 864, radius: 22 } },
    { file: 'attractap-homepage.png', width: 900, height: 1622, screen: { x: 18, y: 126, width: 864, height: 864, radius: 22 } },
    { file: 'attractap-front-original.png', width: 1880, height: 3388, screen: { x: 38, y: 263, width: 1805, height: 1805, radius: 45 } },
  ];
  await fs.writeFile(path.join(hardware, 'screen-rectangles.json'), JSON.stringify({
    units: 'pixels; origin top-left; width/height extents; axis-aligned front view; clip screen to rounded rectangle',
    source: 'software/apps/attractap/desktop/src/sdl_display.cpp: Screen{10,70,480,480}, ScreenRadius=12, canvas 500x901',
    assets: rects,
  }, null, 2) + '\n');
  const r = rects[2].screen;
  const mask = Buffer.from(`<svg width="${r.width}" height="${r.height}"><rect width="${r.width}" height="${r.height}" rx="${r.radius}" fill="white"/></svg>`);
  const screen = await sharp(path.join(output, 'dark-en/01-idle-ready.png'))
    .resize(r.width, r.height, { kernel: 'nearest' })
    .composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  await sharp(path.join(hardware, 'attractap-front-original.png'))
    .composite([{ input: screen, left: r.x, top: r.y }]).png()
    .toFile(path.join(hardware, 'composite-idle-en.png'));
  await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify({
    productionCommit: 'a4d5e3b772686164dc353f2449edf0617a3509f5',
    renderer: 'LVGL 9.3.0 software renderer; untouched production screen C++/fonts/raw assets; RGB565 framebuffer',
    theme: 'current production dark only', variant: 'Attractap Touch WiFi; same 480x480 layouts as Touch V2/Ethernet',
    nativeResolution: [480, 480], upscale: '3x nearest neighbour; not a higher DPI render', screens,
  }, null, 2) + '\n');
  console.log(`Exported ${screens.length} native PNGs and ${screens.length} 3x PNGs plus hardware assets.`);
}
main().catch(e => { console.error(e); process.exitCode = 1; });
