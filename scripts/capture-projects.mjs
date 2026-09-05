import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  for (const project of [
    { name: 'adbrain', url: 'https://adbrain.vanshul.com' },
    { name: 'tiny-arcade', url: 'https://games.vanshul.com' },
  ]) {
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