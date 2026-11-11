import { afterEach, describe, it, expect, vi } from 'vitest';

const createClient = vi.hoisted(() => vi.fn(() => ({ rpc: () => {} })));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  createClient.mockClear();
});

describe('getSupabase', () => {
  it('resolves to null and never creates a client when unconfigured', async () => {
    const { getSupabase, isSupabaseConfigured } = await import('./supabaseClient');
    expect(isSupabaseConfigured).toBe(false);
    await expect(getSupabase()).resolves.toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('stays unconfigured when a value fails the configuration schema', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_test-key');
    const { getSupabase, isSupabaseConfigured } = await import('./supabaseClient');
    expect(isSupabaseConfigured).toBe(false);
    await expect(getSupabase()).resolves.toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('creates one session-less client lazily and shares it', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_test-key');
    const { getSupabase, isSupabaseConfigured } = await import('./supabaseClient');
    expect(isSupabaseConfigured).toBe(true);
    expect(createClient).not.toHaveBeenCalled();
    const [first, second] = await Promise.all([getSupabase(), getSupabase()]);
    expect(first).toBe(second);
    expect(await getSupabase()).toBe(first);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith('https://example.supabase.co', 'sb_publishable_test-key', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  });

  it('retries after a failed load instead of caching the failure', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_test-key');
    createClient.mockImplementationOnce(() => { throw new Error('chunk failed'); });
    const { getSupabase } = await import('./supabaseClient');
    await expect(getSupabase()).rejects.toThrow('chunk failed');
    await expect(getSupabase()).resolves.toEqual(expect.objectContaining({ rpc: expect.any(Function) }));
    expect(createClient).toHaveBeenCalledTimes(2);
  });
});
