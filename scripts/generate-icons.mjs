#!/usr/bin/env node
/**
 * Generates the raster icon set (favicon PNGs, Apple touch icon, favicon.ico)
 * from public/panda.svg. Run once (or after changing the favicon):
 *   node scripts/generate-icons.mjs
 *
 * favicon.ico matters: browsers, bookmarks and Google request /favicon.ico
 * directly, ignoring the <link> tags. Without it they synthesise a letter
 * tile ("V" for vanshul.com), so we ship a real multi-size icon.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const svg = readFileSync(join(publicDir, 'panda.svg'));

const targets = [
  { name: 'panda-apple-touch.png', size: 180 },
  { name: 'panda-192.png', size: 192 },
  { name: 'panda-512.png', size: 512 },
  { name: 'panda-32.png', size: 32 },
];

for (const { name, size } of targets) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, name));
  console.log(`Wrote public/${name} (${size}x${size}).`);
}

// Pack a multi-resolution favicon.ico (PNG-in-ICO, supported by every
// modern browser). sharp can't write .ico, so we assemble it by hand.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4); // image count

const entries = [];
let offset = 6 + pngs.length * 16;
pngs.forEach((png, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], 0); // width
  entry.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image size
  entry.writeUInt32LE(offset, 12); // image offset
  offset += png.length;
  entries.push(entry);
});

writeFileSync(join(publicDir, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));
console.log(`Wrote public/favicon.ico (${icoSizes.join(', ')}px).`);
