import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort();
  });
});

test('immediate content, unique targets, visible project media, and no automatic 3D', async ({ page }, testInfo) => {
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push(request.url()));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Vanshul Goyal', exact: true })).toBeVisible();
  await expect(page.getByText('Engineer & independent builder')).toBeVisible();
  await expect.poll(() => page.evaluate(() => {
    const heading = document.querySelector('#projects h2').getBoundingClientRect();
    return heading.top < innerHeight;
  })).toBe(true);
  const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), animations: 'disabled' });
  await page.locator('#projects img').first().scrollIntoViewIfNeeded();
  for (const image of await page.locator('#projects img').all()) {
    await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  expect(requests.some(url => /three-core|three-react|HeroScene|RandomTelemetry|InteractiveSpaceBackground/.test(url))).toBe(false);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('selected-work.png') });
});

test('case studies expand and the full project directory is visible by default', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Read case study: AdBrain', { exact: true }).click();
  const study = page.locator('details').filter({ has: page.getByLabel('Read case study: AdBrain', { exact: true }) });
  await expect(study).toHaveAttribute('open', '');
  await expect(study.getByText('Engineering decision')).toBeVisible();
  const directory = page.getByRole('region', { name: "More things I've built" });
  await expect(directory.getByRole('heading', { level: 5 })).toHaveCount(17);
  for (const heading of await directory.getByRole('heading', { level: 5 }).all()) {
    await expect(heading).toBeVisible();
  }
  expect(await directory.evaluate(element => element.closest('details'))).toBeNull();
  await directory.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await directory.screenshot({ path: testInfo.outputPath('project-directory.png'), animations: 'disabled' });
});

test('direct reading-list response and sitemap agree', async ({ request, page }) => {
  const response = await request.get('/reading-list/');
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('Reading List');
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('<loc>https://vanshul.com/reading-list</loc>');
  await page.goto('/reading-list');
  await expect(page.getByRole('heading', { name: 'From My Shelf' })).toBeVisible();
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`section URLs land headings below the header with ${reducedMotion}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion });
    for (const id of ['projects', 'about', 'work', 'blog', 'contact']) {
      await page.goto(`/#${id}`);
      await expect.poll(() => page.evaluate(sectionId => {
        const heading = document.querySelector(`#${sectionId} h2`);
        const nav = document.querySelector('[data-site-header]');
        return Math.round(heading.getBoundingClientRect().top - nav.getBoundingClientRect().bottom);
      }, id), { timeout: 10000 }).toBeGreaterThanOrEqual(16);
      await expect.poll(() => page.evaluate(sectionId => {
        return Math.round(document.querySelector(`#${sectionId} h2`).getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom);
      }, id)).toBeLessThanOrEqual(24);
    }
    await page.goto('/reading-list');
    if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Toggle mobile menu' }).click();
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL(/\/#projects$/);
    await expect(page.locator('#projects h2')).toBeFocused();
  });
}

test('mobile menu has no hidden tab stops and supports Escape and focus wrapping', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile menu contract');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle mobile menu' });
  await expect(page.locator('#primary-menu')).toHaveAttribute('inert', '');
  await page.getByRole('link', { name: 'Vanshul Goyal, home' }).focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await toggle.click();
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(page.locator('#primary-menu')).not.toHaveAttribute('inert');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});