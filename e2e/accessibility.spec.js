import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('owner dashboard keeps year data scrollable and accessible', async ({ page }, testInfo) => {
  const user = { id: '00000000-0000-0000-0000-000000000001', email: 'vanshulg101@gmail.com', role: 'authenticated' };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(user => {
    localStorage.setItem('sb-tmngedsmgcgbkbkmsnsw-auth-token', JSON.stringify({
      access_token: 'test-only-not-a-real-token', refresh_token: 'test-only', token_type: 'bearer',
      expires_at: Math.floor(Date.now() / 1000) + 3600, user,
    }));
  }, user);
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (url.pathname === '/rest/v1/rpc/web_stats') return route.fulfill({ json: {
      total_pageviews: 1234, unique_visitors: 321, range_pageviews: 500, range_visitors: 120,
      range_events: 800, prev_pageviews: 400, prev_visitors: 150, pageviews_today: 12,
      per_site: [], top_pages: [], per_tool: [], per_link: [], top_referrers: [], by_hour: [], by_day: [],
    } });
    return route.abort();
  });
  await page.goto('/dashboard/');
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
  await expect(page.getByText('Pageviews by site')).toBeVisible();
  await page.getByLabel('Time range').selectOption('8760');
  const chart = page.getByRole('region', { name: 'Daily pageviews chart' });
  await expect(chart.getByRole('img')).toHaveCount(365);
  await chart.scrollIntoViewIfNeeded();
  await chart.focus();
  await page.keyboard.press('End');
  expect(await chart.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= innerWidth && element.scrollWidth > element.clientWidth && getComputedStyle(element).overflowX === 'auto';
  })).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('owner-year-chart.png') });
});

for (const route of ['/', '/blog/', '/blog/the-new-leverage/', '/reading-list/', '/missing-audit-route', '/dashboard/']) {
  test(`accessible document structure and controls at ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*', request => new URL(request.request().url()).hostname === '127.0.0.1' ? request.continue() : request.abort());
    await page.goto(route);
    await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 10000 });
    await expect(page.locator('[data-prerender]')).toHaveCount(0);
    if (route === '/dashboard/') await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    if (route === '/') {
      await page.getByRole('region', { name: "More things I've built" }).locator('summary').click();
      await page.getByRole('contentinfo').locator('summary').click();
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map(violation => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  });
}