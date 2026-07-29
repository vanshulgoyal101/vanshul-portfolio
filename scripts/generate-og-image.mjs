#!/usr/bin/env node
/**
 * Generates public/og-image.png (1200x630) — the social/preview card used by
 * Open Graph and Twitter. Run once (or after changing branding):
 *   node scripts/generate-og-image.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.18"/>
      <stop offset="70%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#f6f3eb"/>
  <circle cx="1050" cy="120" r="360" fill="url(#orb)"/>
  <circle cx="120" cy="560" r="320" fill="url(#orb)"/>

  <text x="90" y="250" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="700" fill="#151515">Vanshul Goyal</text>
  <text x="94" y="325" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="400" fill="#4a4a4a">Engineer · Writings on AI, the future of work &amp; technology</text>

  <rect x="94" y="470" width="64" height="6" rx="3" fill="#1d4ed8"/>
  <text x="94" y="540" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#1d4ed8">vanshul.com</text>
</svg>
`;

const out = join(root, 'public', 'og-image.png');
const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, buffer);
console.log(`Wrote public/og-image.png (${buffer.length} bytes).`);
