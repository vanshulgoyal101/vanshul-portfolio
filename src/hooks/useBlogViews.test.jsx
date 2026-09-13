import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useBlogViews, useBlogView } from './useBlogViews';
import * as views from '../utils/blogViews';

afterEach(() => vi.restoreAllMocks());

describe('view request lifecycle', () => {
  it('handles rejected requests without an unhandled rejection', async () => {
    vi.spyOn(views, 'getAllBlogViews').mockRejectedValue(new Error('offline'));
    vi.spyOn(views, 'incrementBlogView').mockRejectedValue(new Error('offline'));
    const all = renderHook(() => useBlogViews());
    const single = renderHook(() => useBlogView('post'));
    await act(async () => {});
    expect(all.result.current).toEqual({});
    expect(single.result.current).toBeNull();
  });

  it('clears the previous count when the slug becomes absent', async () => {
    vi.spyOn(views, 'incrementBlogView').mockResolvedValue(42);
    const { result, rerender } = renderHook(slug => useBlogView(slug), { initialProps: 'post' });
    await waitFor(() => expect(result.current).toBe(42));
    rerender(null);
    expect(result.current).toBeNull();
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
