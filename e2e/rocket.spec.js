import { test, expect } from '@playwright/test';

test('reduced-motion visits do not load rocket or smoke', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await page.getByRole('contentinfo').locator('summary').click();
  await expect(page.getByRole('switch', { name: 'Ambient motion' })).toBeDisabled();
  await expect(page.locator('[data-rocket], [data-rocket-smoke]')).toHaveCount(0);
  expect(requests.some(url => /FloatingRocket|SmokeTransition/.test(url))).toBe(false);
});

test('original rocket launches with colored smoke and lands on About twice', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The existing floating rocket is desktop-only');
  test.setTimeout(60000);
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  const rocket = page.locator('[data-rocket]');
  const smoke = page.locator('[data-rocket-smoke]');
  await expect(rocket).toBeVisible();
  await expect(smoke).toHaveCount(1);
  await page.evaluate(() => {
    window.rocketEvidence = { launches: 0, emissions: 0, coloredPixels: 0 };
    window.addEventListener('rocket-launch', () => window.rocketEvidence.launches++);
    window.addEventListener('rocket-emit-smoke', () => {
      window.rocketEvidence.emissions++;
      if (window.rocketEvidence.coloredPixels > 10000) return;
      const canvas = document.querySelector('[data-rocket-smoke]');
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let colored = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] > 20 && Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) - Math.min(pixels[index], pixels[index + 1], pixels[index + 2]) > 30) colored++;
      }
      window.rocketEvidence.coloredPixels = Math.max(window.rocketEvidence.coloredPixels, colored);
    });
  });

  for (const launch of [1, 2]) {
    for (const tap of [1, 2, 3]) {
      const bounds = await rocket.boundingBox();
      await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      if (tap < 3) await expect(rocket).toContainText(tap === 1 ? 'Ignition checks OK' : 'T-Minus 1s');
    }
    await expect.poll(() => page.evaluate(() => window.rocketEvidence.launches)).toBe(launch);
    await expect.poll(() => page.evaluate(() => window.rocketEvidence.coloredPixels)).toBeGreaterThan(100);
    if (launch === 1) await page.screenshot({ path: testInfo.outputPath('rocket-smoke.png') });
    const about = page.locator('#about h2');
    await expect(about).toBeFocused();
    await expect.poll(() => about.evaluate(element => Math.abs(element.getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().bottom - 20))).toBeLessThan(1);
    await expect(about).toHaveCSS('outline-style', 'none');
    await expect.poll(() => smoke.evaluate(canvas => {
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      return pixels.some((value, index) => index % 4 === 3 && value > 0);
    }), { timeout: 15000 }).toBe(false);
    await expect(rocket).toBeInViewport();
    await page.evaluate(() => { window.rocketEvidence.coloredPixels = 0; });
  }
  expect(await page.evaluate(() => window.rocketEvidence.emissions)).toBeGreaterThan(2);
});