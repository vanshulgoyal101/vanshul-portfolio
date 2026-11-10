import { test, expect } from '@playwright/test';

test('a partial tap resumes idle floating and the countdown resets', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1024, height: 1000 });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  const rocket = page.locator('[data-rocket]');
  await expect(rocket).toBeVisible({ timeout: 15000 });
  await rocket.focus();
  await page.keyboard.press('Enter');
  await expect(rocket).toHaveAccessibleName('Launch rocket: 2 taps remaining');
  // Sample real rendered frames after the hop; fake timers do not drive every
  // browser animation timeline. WebGL has its own full-viewport tests.
  const offsets = await rocket.evaluate(element => new Promise(resolve => {
    const started = performance.now();
    const samples = [];
    const sample = (now) => {
      if (now - started >= 700) samples.push(new DOMMatrix(getComputedStyle(element).transform).m42);
      if (now - started < 1900) requestAnimationFrame(sample);
      else resolve(samples);
    };
    requestAnimationFrame(sample);
  }));
  expect(Math.max(...offsets) - Math.min(...offsets)).toBeGreaterThan(1);
  // The partial-tap countdown resets three seconds after the tap.
  await expect(rocket).toHaveAccessibleName('Launch rocket: 3 taps remaining');
  await page.keyboard.press('Enter');
  await expect(rocket).toHaveAccessibleName('Launch rocket: 2 taps remaining');
});

test('smoke and flame stay anchored to the rotating rocket nozzle', async ({ page }, testInfo) => {
  test.setTimeout(60000);
  // Keep the separately tested hero WebGL out of the rocket trajectory check.
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1024, height: 1000 });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  const rocket = page.locator('[data-rocket]');
  await expect(rocket).toBeVisible({ timeout: 15000 });
  await page.evaluate(() => {
    window.exhaustSamples = [];
    window.addEventListener('rocket-emit-smoke', event => {
      const svg = document.querySelector('[data-rocket] svg');
      const nozzle = new DOMPoint(131, 381).matrixTransform(svg.getScreenCTM());
      const flame = document.querySelector('[data-rocket-flame]');
      const anchor = flame.parentElement.getBoundingClientRect();
      const rotation = new DOMMatrix(getComputedStyle(svg.parentElement).transform);
      const exhaustRotation = new DOMMatrix(getComputedStyle(flame.parentElement).transform);
      const combined = rotation.multiply(exhaustRotation);
      window.exhaustSamples.push({
        offset: Math.hypot(event.detail.x - nozzle.x, event.detail.y - nozzle.y),
        sharedAnchor: Math.hypot(event.detail.x - anchor.left, event.detail.y - anchor.top),
        flameCentered: flame.offsetLeft + flame.offsetWidth / 2 === 0 && flame.offsetTop === 0,
        direction: Math.abs(combined.c),
      });
    });
  });
  // Keep the three activations in one browser task; this test owns geometry,
  // while the keyboard workflow below checks native Enter and Space.
  await rocket.evaluate(element => {
    element.click();
    element.click();
    element.click();
  });
  await expect.poll(() => page.evaluate(() => window.exhaustSamples.length)).toBeGreaterThan(6);
  await page.screenshot({ path: testInfo.outputPath('aligned-exhaust.png') });
  await expect(page.locator('#about h2')).toBeFocused();
  const samples = await page.evaluate(() => window.exhaustSamples);
  expect(Math.max(...samples.map(sample => sample.offset))).toBeLessThan(0.1);
  expect(samples.every(sample => sample.sharedAnchor < 0.1 && sample.flameCentered)).toBe(true);
  expect(samples.at(-1).direction).toBeLessThan(0.01);
});

test('rocket works by keyboard without a 2D canvas context', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...options) {
      return type === '2d' ? null : getContext.call(this, type, ...options);
    };
  });
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  const rocket = page.getByRole('button', { name: 'Launch rocket: 3 taps remaining' });
  await expect(rocket).toBeVisible();
  await rocket.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await expect(page.locator('#about h2')).toBeFocused();
  expect(errors).toEqual([]);
});

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

test('mobile shows the floating rocket and accepts the three-tap launch', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only rocket contract');
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  const rocket = page.locator('[data-rocket]');
  await expect(rocket).toBeVisible();
  const bounds = await rocket.boundingBox();
  expect(bounds.x).toBeGreaterThan(0);
  expect(bounds.y).toBeGreaterThan(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  await rocket.dispatchEvent('click');
  await rocket.dispatchEvent('click');
  await rocket.dispatchEvent('click');
  await expect(page.locator('[data-rocket-smoke]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.querySelector('[data-rocket]')?.getBoundingClientRect().top)).toBeLessThan(bounds.y);
});

test('original rocket launches with colored smoke and lands on About twice', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The existing floating rocket is desktop-only');
  test.setTimeout(60000);
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/');
  const rocket = page.locator('[data-rocket]');
  const smoke = page.locator('[data-rocket-smoke]');
  // The rocket is idle-loaded after the ~2.7s greeting, so allow for both.
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  await expect(rocket).toBeVisible({ timeout: 10000 });
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