#!/usr/bin/env node
/**
 * One-off: generate the AdBrain project card (1200x630 webp) in the same family
 * style as the Tiny Arcade card, so the Projects grid is visually consistent.
 * Mirrors arcade/scripts/generate-og.mjs. Run from the portfolio root.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "images", "projects", "adbrain.webp");

const accent = "#60a5fa"; // blue-400 — the AdBrain brand blue, legible on dark
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="-10%" r="95%">
      <stop offset="0%" stop-color="#1d2233"/>
      <stop offset="100%" stop-color="#12141c"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="14" fill="${accent}"/>
  <text x="600" y="150" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="8" fill="#9aa3b8">${esc("ADBRAIN")}</text>
  <text x="600" y="358" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="116" font-weight="800" fill="#eef1f7">${esc("AI Ad Creative")}</text>
  <text x="600" y="438" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="40" fill="${accent}">${esc("brand brain · image · copy · Meta")}</text>
</svg>`;

const webp = await sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer();
writeFileSync(out, webp);
console.log(`Wrote ${out} (${webp.length} bytes)`);
