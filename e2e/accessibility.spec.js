import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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