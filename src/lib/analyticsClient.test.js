import { afterEach, describe, it, expect, vi } from 'vitest';

const createClient = vi.hoisted(() => vi.fn(() => ({ auth: {}, rpc: () => {} })));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

afterEach(() => {
  vi.resetModules();
});

// The test environment blanks VITE_SUPABASE_*, so these also show the dashboard
// client does not depend on build-time settings.
describe('analytics client', () => {
  it('connects the dashboard to its Supabase project without build-time settings', async () => {
    const { analytics } = await import('./analyticsClient');
    expect(createClient).toHaveBeenCalledTimes(1);
    const [url] = createClient.mock.calls[0];
    expect(new URL(url).protocol).toBe('https:');
    expect(new URL(url).hostname).toMatch(/\.supabase\.co$/);
    expect(analytics).toBe(createClient.mock.results[0].value);
  });

  it('ships only a publishable key to the browser', async () => {
    await import('./analyticsClient');
    // Secret and service-role keys bypass row-level security and must never be
    // bundled; publishable keys are designed to be public.
    const [, key] = createClient.mock.calls[0];
    expect(key).toMatch(/^sb_publishable_/);
  });
});
