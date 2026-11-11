import { test, expect } from '@playwright/test';

// The built pages ship a <meta> Content-Security-Policy (vite.config.js). These
// journeys exercise every integration it must allow: the 3D hero and ambient
// layers, lazy chunks, fonts, images, the contact endpoint and the dashboard's
// Supabase calls. Third-party requests are answered locally, after the browser
// has already applied the policy to them.
const user = { id: '00000000-0000-0000-0000-000000000001', email: 'vanshulg101@gmail.com', role: 'authenticated' };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.cspViolations.push(`${event.effectiveDirective} blocked ${event.blockedURI || 'inline'}`);
    });
    localStorage.setItem('vg.ambient', 'on');
  });
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname === 'formspree.io') return route.fulfill({ json: { ok: true } });
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (url.pathname === '/rest/v1/rpc/web_stats') return route.fulfill({ json: {
      total_pageviews: 1, unique_visitors: 1, range_pageviews: 1, range_visitors: 1, range_events: 1,
      prev_pageviews: 1, prev_visitors: 1, pageviews_today: 1,
      per_site: [], top_pages: [], per_tool: [], per_link: [], top_referrers: [], by_hour: [], by_day: [],
    } });
    return route.abort();
  });
});

const violations = page => page.evaluate(() => window.cspViolations);
const visit = async (page, path) => {
  await page.goto(path);
  await expect(page.locator('[data-boot-loader]')).toHaveCount(0, { timeout: 15000 });
};

test('the policy is enforced: an injected inline script does not run', async ({ page }) => {
  await visit(page, '/blog/');
  const ran = await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.injectedScriptRan = true';
    document.head.append(script);
    return window.injectedScriptRan === true;
  });
  expect(ran).toBe(false);
  await expect.poll(() => violations(page)).toEqual(['script-src-elem blocked inline']);
});

test('home, hero, ambient layers and contact delivery run without violations', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await visit(page, '/');
  if (testInfo.project.name === 'desktop') await expect(page.locator('#home canvas').first()).toBeVisible({ timeout: 15000 });
  for (const id of ['projects', 'about', 'work', 'blog', 'contact']) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.getByLabel('Your Name').fill('Ada Lovelace');
  await page.getByLabel('Email Address').fill('ada@example.com');
  await page.getByLabel('Message').fill('Checking the security policy.');
  const sent = page.waitForResponse(response => new URL(response.url()).hostname === 'formspree.io');
  await page.getByRole('button', { name: 'Send Message' }).click();
  expect((await sent).ok()).toBe(true);
  // A successful submission clears the form.
  await expect(page.getByLabel('Message')).toHaveValue('');
  await page.waitForTimeout(1500); // let idle-time decorative layers mount
  expect(await violations(page)).toEqual([]);
  expect(errors).toEqual([]);
});

for (const path of ['/blog/the-new-leverage/', '/reading-list/', '/missing-security-route']) {
  test(`${path} renders without violations`, async ({ page }) => {
    await visit(page, path);
    await expect(page.locator('main h1')).toBeVisible();
    expect(await violations(page)).toEqual([]);
  });
}

test('the owner dashboard reaches its analytics API without violations', async ({ page }) => {
  await page.addInitScript(user => {
    localStorage.setItem('sb-tmngedsmgcgbkbkmsnsw-auth-token', JSON.stringify({
      access_token: 'test-only-not-a-real-token', refresh_token: 'test-only', token_type: 'bearer',
      expires_at: Math.floor(Date.now() / 1000) + 3600, user,
    }));
  }, user);
  await visit(page, '/dashboard/');
  await expect(page.getByText('Pageviews by site')).toBeVisible();
  expect(await violations(page)).toEqual([]);
});
