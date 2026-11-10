import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useBlogViews, useBlogView } from './useBlogViews';
import * as views from '../utils/blogViews';

afterEach(() => vi.restoreAllMocks());

describe('view request lifecycle', () => {
  it('handles rejected requests without an unhandled rejection', async () => {
    vi.spyOn(views, 'getAllBlogViews').mockRejectedValue(new Error('offline'));
    vi.spyOn(views, 'recordBlogView').mockRejectedValue(new Error('offline'));
    const all = renderHook(() => useBlogViews());
    const single = renderHook(() => useBlogView('post'));
    await act(async () => {});
    expect(all.result.current).toEqual({});
    expect(single.result.current).toBeNull();
  });

  it('requests counts for the published posts only', async () => {
    const spy = vi.spyOn(views, 'getAllBlogViews').mockResolvedValue({ 'the-new-leverage': 3 });
    const { result } = renderHook(() => useBlogViews());
    await waitFor(() => expect(result.current).toEqual({ 'the-new-leverage': 3 }));
    const [slugs] = spy.mock.calls[0];
    expect(slugs).toContain('the-new-leverage');
    expect(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true);
  });

  it('clears the previous count when the slug becomes absent', async () => {
    vi.spyOn(views, 'recordBlogView').mockResolvedValue(42);
    const { result, rerender } = renderHook(slug => useBlogView(slug), { initialProps: 'post' });
    await waitFor(() => expect(result.current).toBe(42));
    rerender(null);
    expect(result.current).toBeNull();
  });

  it('does not reuse an old count when returning before another request completes', async () => {
    vi.spyOn(views, 'recordBlogView')
      .mockResolvedValueOnce(42)
      .mockImplementation(() => new Promise(() => {}));
    const { result, rerender } = renderHook(slug => useBlogView(slug), { initialProps: 'first' });
    await waitFor(() => expect(result.current).toBe(42));
    rerender('second');
    expect(result.current).toBeNull();
    rerender('first');
    expect(result.current).toBeNull();
  });

  it('ignores counts and failures that arrive for a post the reader has left', async () => {
    const pending = {};
    vi.spyOn(views, 'recordBlogView').mockImplementation(slug => new Promise((resolve, reject) => {
      pending[slug] = { resolve, reject };
    }));
    const { result, rerender } = renderHook(slug => useBlogView(slug), { initialProps: 'first' });
    rerender('second');
    rerender('third');
    await act(async () => pending.third.resolve(7));
    await act(async () => pending.first.resolve(3));
    await act(async () => pending.second.reject(new Error('offline')));
    expect(result.current).toBe(7);
  });
});

// The test env forces Supabase "unconfigured" (empty VITE_SUPABASE_* — see
// vite.config.js), so these hooks must degrade gracefully to empty/null without
// throwing or hitting the network.
describe('useBlogViews (Supabase unconfigured)', () => {
  it('returns an empty map', async () => {
    const { result } = renderHook(() => useBlogViews());
    await waitFor(() => expect(result.current).toEqual({}));
  });
});

describe('useBlogView (Supabase unconfigured)', () => {
  it('stays null for a given slug', async () => {
    const { result } = renderHook(() => useBlogView('some-post'));
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toBeNull());
  });

  it('is null when no slug is provided', () => {
    const { result } = renderHook(() => useBlogView(null));
    expect(result.current).toBeNull();
  });
});
