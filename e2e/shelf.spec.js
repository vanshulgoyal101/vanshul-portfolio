import { test, expect } from '@playwright/test';
import { BOOKS, ESSAYS } from '../src/constants/books.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('vg.ambient', 'off'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('shelf opens from Writings with separate collections and working navigation', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#blog');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
  const card = page.getByRole('link', { name: 'Reading list: From My Shelf' });
  await expect(card).toContainText(`${BOOKS.length} Books`);
  await expect(card).toContainText(`${ESSAYS.length} Essays`);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeInViewport({ ratio: 1 });
  await card.screenshot({ path: testInfo.outputPath('shelf-card.png') });
  await card.click();
  await expect(page).toHaveURL(/\/reading-list$/);
  await expect(page.getByRole('heading', { name: 'From My Shelf' })).toBeInViewport();
  await expect(page.getByRole('list', { name: 'Books', exact: true }).getByRole('listitem')).toHaveCount(BOOKS.length);
  await expect(page.getByRole('list', { name: 'Essays', exact: true }).getByRole('listitem')).toHaveCount(ESSAYS.length);
  const index = page.getByRole('navigation', { name: 'Shelf collections' });
  await index.getByRole('link', { name: `Essays ${ESSAYS.length}` }).click();
  await expect(page.getByRole('heading', { name: 'Essays', exact: true })).toBeInViewport();
  const clearance = await page.evaluate(() => document.querySelector('#essays h2').getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom);
  expect(clearance).toBeGreaterThanOrEqual(19);
  for (const essay of ESSAYS) {
    const link = page.getByRole('link', { name: essay.title, exact: true });
    await expect(link).toHaveAttribute('href', essay.url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: testInfo.outputPath('essays.png') });
  await page.reload();
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Essays', exact: true })).toBeInViewport();
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect(page.getByRole('heading', { name: 'From My Shelf' })).toBeInViewport();
  await index.getByRole('link', { name: `Books ${BOOKS.length}` }).click();
  await expect(page.getByRole('heading', { name: 'Books', exact: true })).toBeInViewport();
  await page.getByRole('link', { name: 'Back to Writings', exact: true }).click();
  await expect(page).toHaveURL(/\/#blog$/);
  await expect(page.locator('#blog h2')).toBeInViewport();
  expect(errors).toEqual([]);
});

test('shelf text and controls fit desktop, tablet, and narrow mobile widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Single responsive matrix');
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/reading-list');
    await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'From My Shelf' })).toBeVisible();
    const layout = await page.locator('article').evaluate(article => {
      const text = [...article.querySelectorAll('h1, h2, h3, p, a, li')];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        outside: text.filter(element => {
          const bounds = element.getBoundingClientRect();
          return bounds.left < 0 || bounds.right > innerWidth || element.scrollWidth > element.clientWidth + 1;
        }).map(element => element.textContent),
      };
    });
    expect(layout).toEqual({ overflow: false, outside: [] });
    await page.screenshot({ path: testInfo.outputPath(`shelf-${width}.png`), fullPage: true });
  }
});