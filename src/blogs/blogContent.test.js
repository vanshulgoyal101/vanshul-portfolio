import { describe, it, expect } from 'vitest';
import { loadBlogPosts } from '../utils/blogLoader';

const posts = loadBlogPosts();

describe('blog content integrity', () => {
  it('has at least one blog post', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('gives every post a unique id', () => {
    const ids = posts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every post a unique slug', () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('requires a title, slug, date, and summary on every post', () => {
    for (const post of posts) {
      expect(post.title, `title for ${post.filename}`).toBeTruthy();
      expect(post.slug, `slug for ${post.filename}`).toBeTruthy();
      expect(post.date, `date for ${post.filename}`).toBeTruthy();
      expect(post.summary, `summary for ${post.filename}`).toBeTruthy();
    }
  });

  it('uses a parseable date for every post', () => {
    for (const post of posts) {
      expect(
        isNaN(new Date(post.date).getTime()),
        `date "${post.date}" for ${post.filename}`
      ).toBe(false);
    }
  });

  it('declares a readTime on every post', () => {
    for (const post of posts) {
      expect(post.readTime, `readTime for ${post.filename}`).toBeTruthy();
    }
  });

  it('matches each slug to its filename', () => {
    for (const post of posts) {
      expect(post.slug).toBe(post.filename);
    }
  });
});
