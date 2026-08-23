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

  // The rendered post title is the page <h1>, so in-body headings start at h2
  // and must not skip a level (h2 -> h4). Going back up (h3 -> h2) is fine.
  it('never skips a heading level in any post (WCAG heading order)', () => {
    const headingLevels = (md) =>
      md
        .replace(/```[\s\S]*?```/g, '') // ignore fenced code blocks
        .split('\n')
        .map((line) => line.match(/^(#{1,6})\s+\S/))
        .filter(Boolean)
        .map((m) => m[1].length);

    for (const post of posts) {
      let prev = 1; // the page <h1> (post title)
      for (const level of headingLevels(post.content)) {
        expect(
          level <= prev + 1,
          `${post.filename}: h${level} skips a level after h${prev}`
        ).toBe(true);
        prev = level;
      }
    }
  });
});
