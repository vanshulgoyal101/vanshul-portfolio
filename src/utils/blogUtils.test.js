import { describe, it, expect } from 'vitest';
import {
  markdownToHtml,
  sortBlogsByDate,
  filterBlogsByCategory,
  getBlogCategories,
  formatBlogDate,
  findBlogBySlug,
  calculateReadingTime,
  sanitizeHTML,
} from './blogUtils';

describe('markdownToHtml', () => {
  it('returns an empty string for falsy input', () => {
    expect(markdownToHtml('')).toBe('');
    expect(markdownToHtml(null)).toBe('');
    expect(markdownToHtml(undefined)).toBe('');
    expect(markdownToHtml(0)).toBe('');
  });

  it('returns the markdown unchanged for non-empty input', () => {
    expect(markdownToHtml('# Hello')).toBe('# Hello');
    expect(markdownToHtml('plain text')).toBe('plain text');
  });

  it('preserves special characters', () => {
    const md = '## Title\n\n**bold** _italic_ `code`';
    expect(markdownToHtml(md)).toBe(md);
  });
});

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

  it('keeps equal dates stable relative to each other', () => {
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
});

describe('filterBlogsByCategory', () => {
  const posts = [
    { slug: 'a', category: 'AI' },
    { slug: 'b', category: 'Tech Industry' },
    { slug: 'c', category: 'ai' },
    { slug: 'd' },
  ];

  it('returns input unchanged when posts is not an array', () => {
    expect(filterBlogsByCategory(null, 'AI')).toBe(null);
    expect(filterBlogsByCategory(undefined, 'AI')).toBe(undefined);
  });

  it('returns input unchanged when category is falsy', () => {
    expect(filterBlogsByCategory(posts, '')).toBe(posts);
    expect(filterBlogsByCategory(posts, null)).toBe(posts);
    expect(filterBlogsByCategory(posts, undefined)).toBe(posts);
  });

  it('filters case-insensitively', () => {
    const result = filterBlogsByCategory(posts, 'ai');
    expect(result.map((p) => p.slug)).toEqual(['a', 'c']);
  });

  it('filters with a differently-cased query', () => {
    const result = filterBlogsByCategory(posts, 'AI');
    expect(result.map((p) => p.slug)).toEqual(['a', 'c']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterBlogsByCategory(posts, 'Nonexistent')).toEqual([]);
  });

  it('ignores posts without a category', () => {
    const result = filterBlogsByCategory(posts, 'Tech Industry');
    expect(result.map((p) => p.slug)).toEqual(['b']);
  });
});

describe('getBlogCategories', () => {
  it('returns an empty array for non-array input', () => {
    expect(getBlogCategories(null)).toEqual([]);
    expect(getBlogCategories(undefined)).toEqual([]);
    expect(getBlogCategories('nope')).toEqual([]);
  });

  it('returns an empty array for an empty list', () => {
    expect(getBlogCategories([])).toEqual([]);
  });

  it('returns unique categories', () => {
    const posts = [
      { category: 'AI' },
      { category: 'AI' },
      { category: 'Tech' },
    ];
    expect(getBlogCategories(posts)).toEqual(['AI', 'Tech']);
  });

  it('filters out posts without a category', () => {
    const posts = [{ category: 'AI' }, {}, { category: null }, { category: 'Tech' }];
    expect(getBlogCategories(posts)).toEqual(['AI', 'Tech']);
  });

  it('preserves insertion order of first appearance', () => {
    const posts = [
      { category: 'Z' },
      { category: 'A' },
      { category: 'Z' },
      { category: 'M' },
    ];
    expect(getBlogCategories(posts)).toEqual(['Z', 'A', 'M']);
  });
});

describe('formatBlogDate', () => {
  it('returns an empty string for falsy input', () => {
    expect(formatBlogDate('')).toBe('');
    expect(formatBlogDate(null)).toBe('');
    expect(formatBlogDate(undefined)).toBe('');
  });

  it('formats a valid ISO date', () => {
    expect(formatBlogDate('2024-01-15')).toBe('Jan 15, 2024');
  });

  it('formats another valid date', () => {
    expect(formatBlogDate('2023-12-25')).toBe('Dec 25, 2023');
  });

  it('returns the original string when the date is invalid', () => {
    expect(formatBlogDate('not-a-date')).toBe('not-a-date');
    expect(formatBlogDate('hello world')).toBe('hello world');
  });
});

describe('findBlogBySlug', () => {
  const posts = [
    { slug: 'first', title: 'First' },
    { slug: 'second', title: 'Second' },
  ];

  it('returns null for non-array input', () => {
    expect(findBlogBySlug(null, 'first')).toBe(null);
    expect(findBlogBySlug(undefined, 'first')).toBe(null);
  });

  it('returns null when slug is falsy', () => {
    expect(findBlogBySlug(posts, '')).toBe(null);
    expect(findBlogBySlug(posts, null)).toBe(null);
    expect(findBlogBySlug(posts, undefined)).toBe(null);
  });

  it('finds a post by slug', () => {
    expect(findBlogBySlug(posts, 'second')).toEqual({ slug: 'second', title: 'Second' });
  });

  it('returns null when no post matches', () => {
    expect(findBlogBySlug(posts, 'missing')).toBe(null);
  });

  it('returns null for an empty array', () => {
    expect(findBlogBySlug([], 'first')).toBe(null);
  });
});

describe('calculateReadingTime', () => {
  it('returns "0 min read" for falsy content', () => {
    expect(calculateReadingTime('')).toBe('0 min read');
    expect(calculateReadingTime(null)).toBe('0 min read');
    expect(calculateReadingTime(undefined)).toBe('0 min read');
  });

  it('rounds up to the nearest minute', () => {
    const words = Array.from({ length: 201 }, () => 'word').join(' ');
    expect(calculateReadingTime(words)).toBe('2 min read');
  });

  it('computes 1 minute for a short post', () => {
    const words = Array.from({ length: 50 }, () => 'word').join(' ');
    expect(calculateReadingTime(words)).toBe('1 min read');
  });

  it('computes exactly at the boundary', () => {
    const words = Array.from({ length: 200 }, () => 'word').join(' ');
    expect(calculateReadingTime(words)).toBe('1 min read');
  });

  it('respects a custom words-per-minute rate', () => {
    const words = Array.from({ length: 100 }, () => 'word').join(' ');
    expect(calculateReadingTime(words, 100)).toBe('1 min read');
    expect(calculateReadingTime(words, 50)).toBe('2 min read');
  });

  it('handles extra whitespace between words', () => {
    expect(calculateReadingTime('one   two\n\nthree')).toBe('1 min read');
  });
});

describe('sanitizeHTML', () => {
  it('returns an empty string for falsy input', () => {
    expect(sanitizeHTML('')).toBe('');
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
  });

  it('returns the input string for non-empty HTML', () => {
    expect(sanitizeHTML('<p>hi</p>')).toBe('<p>hi</p>');
  });
});
