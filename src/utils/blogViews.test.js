import { describe, it, expect } from 'vitest';
import {
  formatViews,
  incrementBlogView,
  getAllBlogViews,
} from './blogViews';

describe('formatViews', () => {
  it('returns null for nullish or NaN input', () => {
    expect(formatViews(null)).toBeNull();
    expect(formatViews(undefined)).toBeNull();
    expect(formatViews(NaN)).toBeNull();
  });

  it('shows raw numbers under 1000', () => {
    expect(formatViews(0)).toBe('0');
    expect(formatViews(1)).toBe('1');
    expect(formatViews(999)).toBe('999');
  });

  it('abbreviates thousands', () => {
    expect(formatViews(1000)).toBe('1k');
    expect(formatViews(1200)).toBe('1.2k');
    expect(formatViews(15000)).toBe('15k');
    expect(formatViews(999999)).toBe('1m');
  });

  it('abbreviates millions', () => {
    expect(formatViews(1_000_000)).toBe('1m');
    expect(formatViews(2_500_000)).toBe('2.5m');
  });
});

// With no VITE_SUPABASE_* env vars in the test environment, the Supabase client
// is null and all data functions degrade to safe no-ops (no network calls).
describe('view counters without Supabase configured', () => {
  it('incrementBlogView resolves to null', async () => {
    await expect(incrementBlogView('some-slug')).resolves.toBeNull();
  });

  it('incrementBlogView resolves to null for a falsy slug', async () => {
    await expect(incrementBlogView('')).resolves.toBeNull();
  });

  it('getAllBlogViews resolves to an empty map', async () => {
    await expect(getAllBlogViews()).resolves.toEqual({});
  });
});
