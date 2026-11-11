import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route =>
    new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort()
  );
  await page.addInitScript(() => localStorage.setItem('vg.ambient', 'off'));
});

for (const [path, title] of [
  ['/blog/will-money-become-obsolete/', 'Will Money Ever Become Obsolete?'],
  ['/reading-list/', 'From My Shelf'],
]) {
  test(`${path} does not download the homepage`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const scripts = [];
    page.on('request', request => {
      if (request.resourceType() === 'script') scripts.push(request.url());
    });
    await page.goto(path);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
    expect(scripts.some(url => /\/Home-[^/]+\.js/.test(url))).toBe(false);
    expect(scripts.some(url => /three-core|three-react|HeroScene/.test(url))).toBe(false);
  });
}

test('a cold homepage navigation waits for its chunk before focusing the section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: 'Writings', exact: true })).toBeVisible();

  let release;
  const ready = new Promise(resolve => { release = resolve; });
  let requested;
  const requestStarted = new Promise(resolve => { requested = resolve; });
  await page.route('**/assets/Home-*.js', async route => {
    requested();
    await ready;
    await route.continue();
  });
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  const toggle = nav.getByRole('button', { name: 'Toggle mobile menu' });
  if (await toggle.isVisible()) await toggle.click();
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await requestStarted;
  release();
  await expect(page.locator('#contact h2')).toBeFocused();
  await expect(page.locator('#contact h2')).toBeInViewport();
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0);
});

test('deep links defer 3D downloads until the hero is actually visited', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The sculpture is desktop-only');
  const scripts = [];
  page.on('request', request => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.goto('/#contact');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator('#contact h2')).toBeFocused();
  await expect(page.locator('#contact h2')).toBeInViewport();
  // Cross two browser frames so the visibility observer has delivered its initial result.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(scripts.some(url => /three-core|three-react|HeroScene/.test(url))).toBe(false);

  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.locator('[data-hero-scene] canvas')).toBeVisible({ timeout: 15000 });
  expect(scripts.some(url => /three-core/.test(url))).toBe(true);
});
