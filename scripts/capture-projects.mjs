import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const projects = [
  { name: 'adbrain', url: 'https://adbrain.vanshul.com' },
  { name: 'tiny-arcade', url: 'https://games.vanshul.com' },
];
const requested = process.argv.slice(2);
if (requested.some(name => !projects.some(project => project.name === name))) {
  throw new Error(`Unknown project. Choose: ${projects.map(project => project.name).join(', ')}`);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  for (const project of projects.filter(project => requested.length === 0 || requested.includes(project.name))) {
    await page.goto(project.url, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot({ animations: 'disabled' });
    const destination = fileURLToPath(new URL(`../public/images/projects/${project.name}.webp`, import.meta.url));
    await sharp(image).webp({ quality: 85 }).toFile(destination);
    console.log(`Captured ${project.url} -> ${project.name}.webp`);
  }
} finally {
  await browser.close();
}