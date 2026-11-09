import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

// A minimal stand-in for the Supabase client: records the query chain and
// resolves with whatever each test configures.
const client = vi.hoisted(() => {
  const state = { rpc: { data: null, error: null }, rows: { data: [], error: null }, row: { data: null, error: null } };
  const query = {
    select: vi.fn(() => query),
    in: vi.fn(async () => state.rows),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(async () => state.row),
  };
  return {
    state,
    query,
    supabase: { rpc: vi.fn(async () => state.rpc), from: vi.fn(() => query) },
  };
});

vi.mock('../lib/supabaseClient', () => ({ supabase: client.supabase, isSupabaseConfigured: true }));

const { getAllBlogViews, getBlogView, incrementBlogView, recordBlogView } = await import('./blogViews');

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  client.state.rpc = { data: null, error: null };
  client.state.rows = { data: [], error: null };
  client.state.row = { data: null, error: null };
});

afterEach(() => vi.restoreAllMocks());

describe('getAllBlogViews', () => {
  it('queries only the requested slugs and maps rows by slug', async () => {
    client.state.rows = { data: [{ slug: 'a', views: 3 }, { slug: 'b', views: 7 }], error: null };
    await expect(getAllBlogViews(['a', 'b'])).resolves.toEqual({ a: 3, b: 7 });
    expect(client.supabase.from).toHaveBeenCalledWith('blog_views');
    expect(client.query.select).toHaveBeenCalledWith('slug, views');
    expect(client.query.in).toHaveBeenCalledWith('slug', ['a', 'b']);
  });

  it('makes no request without slugs and degrades to an empty map on error', async () => {
    await expect(getAllBlogViews([])).resolves.toEqual({});
    expect(client.supabase.from).not.toHaveBeenCalled();
    client.state.rows = { data: null, error: { message: 'down' } };
    await expect(getAllBlogViews(['a'])).resolves.toEqual({});
  });
});

describe('incrementBlogView and getBlogView', () => {
  it('increments through the bounded RPC', async () => {
    client.state.rpc = { data: 5, error: null };
    await expect(incrementBlogView('a')).resolves.toBe(5);
    expect(client.supabase.rpc).toHaveBeenCalledWith('increment_blog_view', { post_slug: 'a' });
    client.state.rpc = { data: null, error: { message: 'invalid post slug' } };
    await expect(incrementBlogView('a')).resolves.toBeNull();
  });

  it('reads a single count without incrementing', async () => {
    client.state.row = { data: { views: 9 }, error: null };
    await expect(getBlogView('a')).resolves.toBe(9);
    expect(client.query.eq).toHaveBeenCalledWith('slug', 'a');
    expect(client.supabase.rpc).not.toHaveBeenCalled();
    client.state.row = { data: null, error: null };
    await expect(getBlogView('missing')).resolves.toBeNull();
  });
});

describe('recordBlogView', () => {
  it('counts a post once per session and reads it afterwards', async () => {
    client.state.rpc = { data: 10, error: null };
    client.state.row = { data: { views: 10 }, error: null };
    await expect(recordBlogView('a')).resolves.toBe(10);
    await expect(recordBlogView('a')).resolves.toBe(10);
    expect(client.supabase.rpc).toHaveBeenCalledTimes(1);
    expect(client.query.maybeSingle).toHaveBeenCalledTimes(1);
  });

  it('counts different posts independently', async () => {
    client.state.rpc = { data: 1, error: null };
    await recordBlogView('a');
    await recordBlogView('b');
    expect(client.supabase.rpc).toHaveBeenCalledTimes(2);
  });

  it('does not count twice when two calls overlap', async () => {
    client.state.rpc = { data: 4, error: null };
    client.state.row = { data: { views: 4 }, error: null };
    await Promise.all([recordBlogView('a'), recordBlogView('a')]);
    expect(client.supabase.rpc).toHaveBeenCalledTimes(1);
  });

  it('forgets a failed increment so a later visit can count it', async () => {
    client.state.rpc = { data: null, error: { message: 'down' } };
    await expect(recordBlogView('a')).resolves.toBeNull();
    client.state.rpc = { data: 2, error: null };
    await expect(recordBlogView('a')).resolves.toBe(2);
    expect(client.supabase.rpc).toHaveBeenCalledTimes(2);
  });

  it('forgets an increment that throws', async () => {
    client.supabase.rpc.mockRejectedValueOnce(new Error('offline'));
    await expect(recordBlogView('a')).rejects.toThrow('offline');
    client.state.rpc = { data: 1, error: null };
    await expect(recordBlogView('a')).resolves.toBe(1);
  });

  it('still counts when session storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    client.state.rpc = { data: 1, error: null };
    await expect(recordBlogView('a')).resolves.toBe(1);
    await expect(recordBlogView('a')).resolves.toBe(1);
    expect(client.supabase.rpc).toHaveBeenCalledTimes(2);
  });
});
