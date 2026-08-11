#!/usr/bin/env node
/**
 * Generates the raster icon set (favicon PNGs, Apple touch icon) from
 * public/panda.svg. Run once (or after changing the favicon):
 *   node scripts/generate-icons.mjs
 */
import { readFileSync } from 'node:fs';
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
