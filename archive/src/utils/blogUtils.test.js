import { describe, it, expect } from 'vitest';
import { 
  sortBlogsByDate, 
  filterBlogsByCategory, 
  getBlogCategories, 
  formatBlogDate, 
  calculateReadingTime 
} from './blogUtils';

describe('blogUtils', () => {
  describe('sortBlogsByDate', () => {
    it('should sort posts by date descending', () => {
      const posts = [
        { date: '2023-01-01', title: 'Old Post' },
        { date: '2023-05-01', title: 'Newer Post' },
        { date: '2023-03-01', title: 'Mid Post' },
      ];
      const sorted = sortBlogsByDate(posts);
      expect(sorted[0].title).toBe('Newer Post');
      expect(sorted[1].title).toBe('Mid Post');
      expect(sorted[2].title).toBe('Old Post');
    });

    it('should handle non-array inputs gracefully', () => {
      expect(sortBlogsByDate(null)).toEqual([]);
      expect(sortBlogsByDate(undefined)).toEqual([]);
    });
  });

  describe('filterBlogsByCategory', () => {
    const posts = [
      { category: 'AI', title: 'AI Post' },
      { category: 'Travel', title: 'Travel Post' },
      { category: 'Philosophy', title: 'Philosophy Post' },
    ];

    it('should filter posts by exact category (case-insensitive)', () => {
      const aiPosts = filterBlogsByCategory(posts, 'ai');
      expect(aiPosts).toHaveLength(1);
      expect(aiPosts[0].title).toBe('AI Post');
    });

    it('should return all posts if category is empty or undefined', () => {
      expect(filterBlogsByCategory(posts, '')).toEqual(posts);
      expect(filterBlogsByCategory(posts, null)).toEqual(posts);
    });
  });

  describe('getBlogCategories', () => {
    it('should return unique categories', () => {
      const posts = [
        { category: 'AI' },
        { category: 'Travel' },
        { category: 'AI' },
        { category: 'Philosophy' },
      ];
      expect(getBlogCategories(posts)).toEqual(['AI', 'Travel', 'Philosophy']);
    });
  });

  describe('formatBlogDate', () => {
    it('should format date correctly', () => {
      expect(formatBlogDate('2023-05-15')).toBe('May 15, 2023');
    });

    it('should return empty string if no date provided', () => {
      expect(formatBlogDate('')).toBe('');
    });
  });

  describe('calculateReadingTime', () => {
    it('should estimate reading time based on word count', () => {
      const content = 'one two three four five';
      expect(calculateReadingTime(content, 5)).toBe('1 min read');
      expect(calculateReadingTime(content, 2)).toBe('3 min read');
    });

    it('should return 0 min read for empty content', () => {
      expect(calculateReadingTime('')).toBe('0 min read');
    });
  });
});
