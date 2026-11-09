import { test, expect } from '@playwright/test';

const ARTICLE = '/blog/will-money-become-obsolete/';
const localOnly = route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort();

const clearOfHeader = async (page, selector) => {
  const headerBottom = await page.locator('[data-site-header]').evaluate(element => element.getBoundingClientRect().bottom);
  const headingTop = await page.locator(selector).evaluate(element => element.getBoundingClientRect().top);
  expect(headingTop).toBeGreaterThanOrEqual(headerBottom);
};

test('article sections are reachable from the table of contents and by URL', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*', localOnly);
  await page.goto(ARTICLE);
  const contents = page.getByRole('navigation', { name: 'Table of contents' });
  await expect(contents.getByRole('link')).toHaveCount(5);

  await contents.getByRole('link', { name: 'The counter-force' }).click();
  await expect(page).toHaveURL(/#the-counter-force$/);
  await expect(page.locator('#the-counter-force')).toBeInViewport();
  await clearOfHeader(page, '#the-counter-force');

  await page.goto(`${ARTICLE}#the-allocation-problem`);
  await expect(page.locator('#the-allocation-problem')).toBeInViewport();
  await clearOfHeader(page, '#the-allocation-problem');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the prerendered article keeps its table of contents and section anchors', async ({ page }) => {
    await page.route('**/*', localOnly);
    await page.goto(ARTICLE);
    const contents = page.getByRole('navigation', { name: 'Table of contents' });
    await expect(contents.getByRole('link')).toHaveCount(5);
    await contents.getByRole('link', { name: 'Three questions people merge into one' }).click();
    await expect(page.locator('#three-questions-people-merge-into-one')).toBeInViewport();
  });
});
