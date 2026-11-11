import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readPosts } from '../scripts/lib/seo.mjs';
import { join } from 'node:path';
import { ARCHIVE_SEARCH_ENABLED } from '../src/constants/blogConstants.js';

const posts = readPosts(join(process.cwd(), 'src', 'blogs'));
const localOnly = route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort();

test('archive search and topic filtering work with keyboard, clear, and article navigation', async ({ page }) => {
  test.skip(!ARCHIVE_SEARCH_ENABLED, 'Archive search is switched off in src/constants/blogConstants.js');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/*', localOnly);
  await page.goto('/blog/');
  const search = page.getByRole('searchbox', { name: 'Search writings' });
  const topic = page.getByRole('combobox', { name: 'Topic' });
  await expect(search).toBeVisible();
  await search.fill(posts[0].title);
  await topic.selectOption(posts[0].category);
  await expect(page.getByRole('status')).toHaveText(`1 of ${posts.length} posts`);
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(1);
  await search.fill('a-phrase-with-no-matching-post');
  await expect(page.getByText(/No writings match/)).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(`0 of ${posts.length} posts`);
  await search.press('Tab');
  await expect(topic).toBeFocused();
  await topic.press('Tab');
  const clear = page.getByRole('button', { name: 'Clear filters' });
  await expect(clear).toBeFocused();
  await clear.press('Enter');
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(topic).toHaveValue('');
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(posts.length);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vanshul.com/blog/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 780 });
  expect(await page.evaluate(() => innerWidth)).toBe(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const control of [search, topic, clear]) {
    const bounds = await control.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  }
  await search.fill(posts[0].title);
  await topic.selectOption(posts[0].category);
  await expect(page.getByRole('status')).toHaveText(`1 of ${posts.length} posts`);
  await page.getByRole('link', { name: posts[0].title, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: posts[0].title })).toBeVisible();
});

test.describe('static archive', () => {
  test.use({ javaScriptEnabled: false });
  test('keeps every article discoverable without a search script', async ({ page }) => {
    await page.route('**/*', localOnly);
    await page.goto('/blog/');
    for (const post of posts) {
      await expect(page.getByRole('link', { name: post.title, exact: true })).toHaveAttribute('href', `/blog/${post.slug}/`);
    }
    await expect(page.getByRole('searchbox')).toHaveCount(0);
  });
});
