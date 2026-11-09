import { describe, it, expect } from 'vitest';
import { sortBlogsByDate, getRelatedPosts, formatPostDate, groupPostsByYear } from './blogUtils';

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

describe('getRelatedPosts', () => {
  const posts = [
    { slug: 'a', date: '2025-01-01', category: 'AI' },
    { slug: 'b', date: '2025-03-01', category: 'AI' },
    { slug: 'c', date: '2025-02-01', category: 'Space' },
    { slug: 'd', date: '2025-04-01', category: 'Space' },
    { slug: 'e', date: '2025-05-01', category: 'AI' },
  ];

  it('returns an empty array for invalid input', () => {
    expect(getRelatedPosts(null, posts[0])).toEqual([]);
    expect(getRelatedPosts(posts, null)).toEqual([]);
  });

  it('never includes the current post', () => {
    const related = getRelatedPosts(posts, posts[0], 4);
    expect(related.map((p) => p.slug)).not.toContain('a');
  });

  it('prefers same-category posts, newest first', () => {
    const related = getRelatedPosts(posts, posts[0], 2); // current is AI/a
    // Other AI posts are e (May) and b (Mar) — newest first.
    expect(related.map((p) => p.slug)).toEqual(['e', 'b']);
  });

  it('fills remaining slots with the most recent other posts', () => {
    const related = getRelatedPosts(posts, posts[0], 4); // AI 'a'
    // AI first (e, b), then most recent of the rest (d, c).
    expect(related.map((p) => p.slug)).toEqual(['e', 'b', 'd', 'c']);
  });

  it('respects the limit', () => {
    expect(getRelatedPosts(posts, posts[0], 1)).toHaveLength(1);
    expect(getRelatedPosts(posts, posts[0], 0)).toHaveLength(0);
  });

  it('works when the current post has no category', () => {
    const related = getRelatedPosts(posts, { slug: 'x', date: '2025-01-01' }, 3);
    expect(related.map((p) => p.slug)).toEqual(['e', 'd', 'b']);
  });
});

describe('formatPostDate', () => {
  it('formats both frontmatter styles the same way', () => {
    expect(formatPostDate('29 Jul, 2026')).toBe('29 Jul 2026');
    expect(formatPostDate('2026-07-29')).toBe('29 Jul 2026');
    expect(formatPostDate('8 February 2026')).toBe('8 Feb 2026');
  });

  it('can omit the year', () => {
    expect(formatPostDate('29 Jul, 2026', { year: false })).toBe('29 Jul');
  });

  it('does not depend on the reader timezone', () => {
    // 1 Jan at midnight IST is still 31 Dec in UTC; the calendar date must win.
    expect(formatPostDate('2026-01-01')).toBe('1 Jan 2026');
  });

  it('returns values that are not real dates unchanged', () => {
    expect(formatPostDate('Jan 1, 2024')).toBe('Jan 1, 2024');
    expect(formatPostDate('31 Feb, 2026')).toBe('31 Feb, 2026');
    expect(formatPostDate(undefined)).toBe('');
  });
});

describe('groupPostsByYear', () => {
  it('groups sorted posts by year, newest year first, keeping post order', () => {
    const posts = sortBlogsByDate([
      { slug: 'a', date: '29 Jul, 2026' },
      { slug: 'b', date: '12 Oct, 2025' },
      { slug: 'c', date: '8 Feb, 2026' },
      { slug: 'd', date: '16 Nov, 2023' },
    ]);
    expect(groupPostsByYear(posts)).toEqual([
      { year: '2026', posts: [posts[0], posts[1]] },
      { year: '2025', posts: [posts[2]] },
      { year: '2023', posts: [posts[3]] },
    ]);
    expect(posts.map((post) => post.slug)).toEqual(['a', 'c', 'b', 'd']);
  });

  it('collects posts without a real date under "Undated"', () => {
    expect(groupPostsByYear([{ slug: 'x', date: 'soon' }])).toEqual([{ year: 'Undated', posts: [{ slug: 'x', date: 'soon' }] }]);
  });

  it('returns no groups for no posts', () => {
    expect(groupPostsByYear([])).toEqual([]);
  });
});
