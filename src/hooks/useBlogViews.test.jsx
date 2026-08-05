import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBlogViews, useBlogView } from './useBlogViews';

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
