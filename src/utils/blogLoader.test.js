import { describe, it, expect } from 'vitest';
import { loadBlogPosts, loadBlogBySlug } from './blogLoader';

describe('loadBlogPosts', () => {
  const posts = loadBlogPosts();

  it('returns an array', () => {
    expect(Array.isArray(posts)).toBe(true);
  });

  it('loads at least one post from the blogs directory', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('parses frontmatter into each post object', () => {
    for (const post of posts) {
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('filename');
    }
  });

  it('strips the .md extension from filenames', () => {
    for (const post of posts) {
      expect(post.filename).not.toMatch(/\.md$/);
    }
  });

  it('produces non-empty content for every post', () => {
    for (const post of posts) {
      expect(typeof post.content).toBe('string');
      expect(post.content.length).toBeGreaterThan(0);
    }
  });

  it('gives every post a unique slug', () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('trims frontmatter string values (no surrounding quotes)', () => {
    for (const post of posts) {
      if (typeof post.title === 'string') {
        expect(post.title.startsWith('"')).toBe(false);
        expect(post.title.startsWith("'")).toBe(false);
      }
    }
  });
});

describe('loadBlogBySlug', () => {
  const posts = loadBlogPosts();

  it('returns the matching post for a known slug', () => {
    const known = posts[0];
    const found = loadBlogBySlug(known.slug);
    expect(found).not.toBeNull();
    expect(found.slug).toBe(known.slug);
  });

  it('returns null for an unknown slug', () => {
    expect(loadBlogBySlug('this-slug-does-not-exist-xyz')).toBeNull();
  });

  it('returns null for an empty slug', () => {
    expect(loadBlogBySlug('')).toBeNull();
  });

  it('returns the same content as the corresponding entry from loadBlogPosts', () => {
    const known = posts[0];
    const found = loadBlogBySlug(known.slug);
    expect(found.content).toBe(known.content);
  });
});
