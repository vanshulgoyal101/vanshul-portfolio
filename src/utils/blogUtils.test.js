import { describe, it, expect } from 'vitest';
import { sortBlogsByDate } from './blogUtils';

describe('sortBlogsByDate', () => {
  it('returns an empty array for non-array input', () => {
    expect(sortBlogsByDate(null)).toEqual([]);
    expect(sortBlogsByDate(undefined)).toEqual([]);
    expect(sortBlogsByDate('string')).toEqual([]);
    expect(sortBlogsByDate(42)).toEqual([]);
    expect(sortBlogsByDate({})).toEqual([]);
  });

  it('returns an empty array unchanged', () => {
    expect(sortBlogsByDate([])).toEqual([]);
  });

  it('sorts posts newest first', () => {
    const posts = [
      { slug: 'a', date: '2023-01-01' },
      { slug: 'b', date: '2024-06-15' },
      { slug: 'c', date: '2022-12-31' },
    ];
    const sorted = sortBlogsByDate(posts);
    expect(sorted.map((p) => p.slug)).toEqual(['b', 'a', 'c']);
  });

  it('does not mutate the original array', () => {
    const posts = [
      { slug: 'a', date: '2023-01-01' },
      { slug: 'b', date: '2024-06-15' },
    ];
    const copy = [...posts];
    sortBlogsByDate(posts);
    expect(posts).toEqual(copy);
  });

  it('handles a single-element array', () => {
    const posts = [{ slug: 'only', date: '2023-01-01' }];
    expect(sortBlogsByDate(posts)).toEqual(posts);
  });

  it('keeps equal dates together', () => {
    const posts = [
      { slug: 'a', date: '2023-01-01' },
      { slug: 'b', date: '2023-01-01' },
    ];
    const sorted = sortBlogsByDate(posts);
    expect(sorted).toHaveLength(2);
    expect(sorted.map((p) => p.slug).sort()).toEqual(['a', 'b']);
  });

  it('sorts a large set correctly', () => {
    const posts = Array.from({ length: 20 }, (_, i) => ({
      slug: `post-${i}`,
      date: `2020-01-${String(i + 1).padStart(2, '0')}`,
    }));
    const sorted = sortBlogsByDate(posts);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(new Date(sorted[i].date) >= new Date(sorted[i + 1].date)).toBe(true);
    }
  });

  it('handles real frontmatter date strings', () => {
    const posts = [
      { slug: 'older', date: '14 Jun, 2025' },
      { slug: 'newer', date: '27 Aug, 2025' },
    ];
    expect(sortBlogsByDate(posts).map((p) => p.slug)).toEqual(['newer', 'older']);
  });
});
