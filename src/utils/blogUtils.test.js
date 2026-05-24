// src/utils/blogUtils.test.js
import { describe, it, expect } from 'vitest';
import { 
  sortBlogsByDate, 
  filterBlogsByCategory, 
  getBlogCategories, 
  formatBlogDate, 
  calculateReadingTime, 
  findBlogBySlug 
} from './blogUtils';

describe('blogUtils tests', () => {
  const mockPosts = [
    { slug: 'post-1', date: '2024-09-25', category: 'AI', content: 'Hello world from artificial intelligence.' },
    { slug: 'post-2', date: '2024-10-10', category: 'Travel', content: 'Exploring the old streets of Rome and Venice in Italy.' },
    { slug: 'post-3', date: '2024-08-01', category: 'ai', content: 'Another AI article.' }
  ];

  describe('sortBlogsByDate', () => {
    it('should sort posts by date descending (newest first)', () => {
      const sorted = sortBlogsByDate(mockPosts);
      expect(sorted[0].slug).toBe('post-2'); // Oct 10
      expect(sorted[1].slug).toBe('post-1'); // Sep 25
      expect(sorted[2].slug).toBe('post-3'); // Aug 1
    });

    it('should return empty array if input is not array', () => {
      expect(sortBlogsByDate(null)).toEqual([]);
    });
  });

  describe('filterBlogsByCategory', () => {
    it('should filter posts by category case-insensitively', () => {
      const aiPosts = filterBlogsByCategory(mockPosts, 'AI');
      expect(aiPosts).toHaveLength(2);
      expect(aiPosts.map(p => p.slug)).toContain('post-1');
      expect(aiPosts.map(p => p.slug)).toContain('post-3');
    });

    it('should return all posts if no category provided', () => {
      expect(filterBlogsByCategory(mockPosts, null)).toEqual(mockPosts);
    });
  });

  describe('getBlogCategories', () => {
    it('should return unique categories (preserving case as defined)', () => {
      const categories = getBlogCategories(mockPosts);
      expect(categories).toHaveLength(3);
      expect(categories).toContain('AI');
      expect(categories).toContain('Travel');
      expect(categories).toContain('ai');
    });
  });

  describe('formatBlogDate', () => {
    it('should format valid date strings', () => {
      const formatted = formatBlogDate('2024-09-25');
      // Format uses Intl.DateTimeFormat 'en-US' so it should output Sep 25, 2024
      expect(formatted).toContain('Sep 25, 2024');
    });

    it('should return original string if date is invalid', () => {
      expect(formatBlogDate('invalid-date')).toBe('invalid-date');
    });
  });

  describe('calculateReadingTime', () => {
    it('should return 1 min read for small contents', () => {
      expect(calculateReadingTime('Hello world')).toBe('1 min read');
    });

    it('should calculate reading time based on words count', () => {
      // 200 words = 1 min
      const manyWords = Array(250).fill('word').join(' ');
      expect(calculateReadingTime(manyWords)).toBe('2 min read');
    });
  });

  describe('findBlogBySlug', () => {
    it('should return post with matching slug', () => {
      expect(findBlogBySlug(mockPosts, 'post-2').slug).toBe('post-2');
    });

    it('should return null if no match found', () => {
      expect(findBlogBySlug(mockPosts, 'non-existent')).toBeNull();
    });
  });
});
