#!/usr/bin/env node
/**
 * Generates a unique Open Graph card (1200x630) per blog post into public/og/,
 * so each shared link gets a distinct preview. Runs in `prebuild`; output is
 * git-ignored and regenerated on every build.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parseFrontmatter, escapeXml } from './lib/seo.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogsDir = join(root, 'src', 'blogs');
const outDir = join(root, 'public', 'og');

const wrapText = (text, maxChars) => {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const svgFor = ({ title, category }) => {
  const lines = wrapText(title, 22).slice(0, 4);
  const fontSize = lines.length > 3 ? 62 : 78;
  const lineHeight = Math.round(fontSize * 1.16);
  const blockHeight = (lines.length - 1) * lineHeight;
  const startY = Math.round(340 - blockHeight / 2);

  const titleTspans = lines
    .map(
      (l, i) =>
        `<text x="90" y="${startY + i * lineHeight}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#151515">${escapeXml(l)}</text>`
    )
    .join('\n  ');

  const categoryLabel = category
    ? `<text x="92" y="150" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="3" fill="#1d4ed8">${escapeXml(category.toUpperCase())}</text>`
    : '';

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="orb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.16"/>
      <stop offset="70%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#f6f3eb"/>
  <circle cx="1080" cy="90" r="340" fill="url(#orb)"/>
  <circle cx="120" cy="580" r="300" fill="url(#orb)"/>
  ${categoryLabel}
  ${titleTspans}
  <rect x="94" y="512" width="60" height="6" rx="3" fill="#1d4ed8"/>
  <text x="94" y="566" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#1d4ed8">Vanshul Goyal · vanshul.com</text>
</svg>`;
};

mkdirSync(outDir, { recursive: true });

const posts = readdirSync(blogsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8')))
  .filter((p) => p.slug && p.title);

for (const post of posts) {
  const png = await sharp(Buffer.from(svgFor(post))).png().toBuffer();
  writeFileSync(join(outDir, `${post.slug}.png`), png);
}

console.log(`Wrote ${posts.length} per-post OG images to public/og/.`);
