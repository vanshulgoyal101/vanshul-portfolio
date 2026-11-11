import { describe, it, expect } from 'vitest';
import { loadBlogPosts } from './blogLoader';
import { loadFullBlogPosts, loadBlogBySlug } from './blogPostLoader';

const index = loadBlogPosts();
const full = loadFullBlogPosts();

describe('loadBlogPosts (listing metadata)', () => {
  it('lists every post once, by slug', () => {
    expect(index.length).toBeGreaterThan(0);
    expect(new Set(index.map((post) => post.slug)).size).toBe(index.length);
    expect(index.map((post) => post.slug).sort()).toEqual(full.map((post) => post.slug).sort());
  });

  it('carries the frontmatter and a word count but never the body', () => {
    for (const post of index) {
      const article = full.find((candidate) => candidate.slug === post.slug);
      for (const field of ['title', 'slug', 'summary', 'date', 'readTime']) {
        expect(post[field], `${field} of ${post.slug}`).toBe(article[field]);
      }
      expect(post.filename).toBe(article.filename);
      expect(post.wordCount).toBe(article.content.split(/\s+/).length);
      expect(post).not.toHaveProperty('content');
      expect(post).not.toHaveProperty('body');
    }
  });
});

describe('loadFullBlogPosts and loadBlogBySlug (article bodies)', () => {
  it('parses each file into frontmatter, a non-empty body and its filename', () => {
    for (const post of full) {
      expect(post.title.startsWith('"')).toBe(false);
      expect(typeof post.content).toBe('string');
      expect(post.content.length).toBeGreaterThan(0);
      expect(post.filename).not.toMatch(/\.md$/);
    }
  });

  it('parses once and returns the same objects', () => {
    expect(loadFullBlogPosts()).toBe(full);
    expect(loadBlogBySlug(full[0].slug)).toBe(full[0]);
  });

  it('returns null for an unknown slug', () => {
    expect(loadBlogBySlug('no-such-post')).toBeNull();
    expect(loadBlogBySlug(undefined)).toBeNull();
  });
});
