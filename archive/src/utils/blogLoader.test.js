import { describe, it, expect } from 'vitest';
import { loadBlogPosts, loadBlogBySlug } from './blogLoader';

describe('blogLoader', () => {
  describe('loadBlogPosts', () => {
    it('should load all blog posts with frontmatter', () => {
      const posts = loadBlogPosts();
      expect(posts.length).toBeGreaterThan(0);
      
      const firstPost = posts[0];
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('slug');
      expect(firstPost).toHaveProperty('content');
      expect(firstPost).toHaveProperty('date');
      expect(firstPost).toHaveProperty('category');
    });
  });

  describe('loadBlogBySlug', () => {
    it('should find a post by slug', () => {
      const post = loadBlogBySlug('the-two-worlds');
      expect(post).not.toBeNull();
      expect(post.title).toBe('The Two Worlds');
      expect(post.category).toBe('Infrastructure');
    });

    it('should return null for non-existent slug', () => {
      const post = loadBlogBySlug('non-existent-slug-xyz');
      expect(post).toBeNull();
    });
  });
});
