import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('multilingual greeting finishes and reveals centered projects', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem('vg.ambient', 'off');
    window.bootGreetings = [];
    const observer = new MutationObserver(() => {
      const word = document.querySelector('[data-greeting-word]');
      const language = document.querySelector('[data-greeting-language]');
      if (word && language && !window.bootGreetings.some(entry => entry.word === word.textContent)) {
        window.bootGreetings.push({ word: word.textContent, language: language.textContent });
      }
    });
    observer.observe(document, { subtree: true, childList: true, characterData: true });
  });
  await page.goto('/');
  const loader = page.locator('[data-boot-loader]');
  await expect(loader).toBeVisible();
  await expect(page.locator('#main-content').locator('..')).toHaveAttribute('inert', '');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-greeting-word]')].some(word =>
    word.textContent === 'Welcome' && Number(getComputedStyle(word.parentElement).opacity) > 0.9
  ));
  const capture = await page.context().newCDPSession(page);
  const { data } = await capture.send('Page.captureScreenshot');
  await writeFile(testInfo.outputPath('multilingual-greeting.png'), Buffer.from(data, 'base64'));
  await capture.detach();
  await expect(loader).toHaveCount(0, { timeout: 7000 });
  const greetings = await page.evaluate(() => window.bootGreetings);
  expect(greetings.length).toBeGreaterThanOrEqual(4);
  expect(greetings.at(-1)).toEqual({ word: 'Welcome', language: 'English' });
  await expect(page.locator('#main-content').locator('..')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('#projects h2')).toHaveCSS('text-align', 'center');
  await expect(page.locator('#projects h2 + p')).toHaveCSS('text-align', 'center');
  await page.screenshot({ path: testInfo.outputPath('centered-projects.png'), animations: 'disabled' });
  await page.getByRole('contentinfo').getByRole('link', { name: 'Blog', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(loader).toHaveCount(0);
});

test('About deep links focus their destination after the greeting', async ({ page }) => {
  await page.goto('/#about');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 7000 });
  const heading = page.locator('#about h2');
  await expect(heading).toBeFocused();
  await expect.poll(() => heading.evaluate(element => Math.abs(element.getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom - 20))).toBeLessThan(1);
});

test('reduced-motion visitors bypass the greeting', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Vanshul Goyal', exact: true })).toBeVisible();
  await expect(page.locator('#main-content').locator('..')).not.toHaveAttribute('inert');
});