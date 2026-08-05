import { describe, it, expect } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseFrontmatter,
  escapeXml,
  escapeText,
  rfc822,
  readPosts,
  byDateDesc,
} from './seo.mjs';

const blogsDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'blogs');

describe('seo/parseFrontmatter', () => {
  it('returns an empty object when there is no frontmatter', () => {
    expect(parseFrontmatter('# Just a body')).toEqual({});
  });

  it('parses key/value pairs and strips quotes', () => {
    const data = parseFrontmatter(`---\ntitle: "Hello"\nslug: hello\n---\nbody`);
    expect(data.title).toBe('Hello');
    expect(data.slug).toBe('hello');
  });

  it('splits only on the first colon', () => {
    const data = parseFrontmatter(`---\ntitle: A: B\n---\nx`);
    expect(data.title).toBe('A: B');
  });

  it('leaves values as strings (no numeric coercion)', () => {
    const data = parseFrontmatter(`---\nwordCount: 2400\n---\nx`);
    expect(data.wordCount).toBe('2400');
  });
});

describe('seo/escaping', () => {
  it('escapeXml escapes &, <, > and quotes', () => {
    expect(escapeXml('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;');
  });

  it('escapeText escapes &, < and > but leaves quotes intact', () => {
    expect(escapeText('a & b < c > "d"')).toBe('a &amp; b &lt; c &gt; "d"');
  });

  it('escapes ampersands first to avoid double-encoding', () => {
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
  });
});

describe('seo/rfc822', () => {
  it('formats a valid date as an RFC-822 UTC string', () => {
    expect(rfc822('2025-01-10T00:00:00Z')).toBe(new Date('2025-01-10T00:00:00Z').toUTCString());
  });

  it('returns undefined for an invalid date', () => {
    expect(rfc822('not-a-date')).toBeUndefined();
  });
});

describe('seo/readPosts', () => {
  const posts = readPosts(blogsDir);

  it('reads real posts from the blogs directory', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('every post has a slug, title, non-empty body and numeric word count', () => {
    for (const p of posts) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.body.length).toBeGreaterThan(0);
      expect(typeof p.wordCount).toBe('number');
      expect(p.filename.endsWith('.md')).toBe(false);
    }
  });

  it('byDateDesc sorts newest first', () => {
    const sorted = [...posts].sort(byDateDesc);
    for (let i = 1; i < sorted.length; i++) {
      expect(new Date(sorted[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[i].date).getTime()
      );
    }
  });
});
