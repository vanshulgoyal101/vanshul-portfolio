import { afterEach, describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  escapeXml,
  escapeText,
  rfc822,
  readPosts,
  byDateDesc,
} from './seo.mjs';
import { postTimestamp } from '../../src/utils/seoValues.js';

const blogsDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'blogs');

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
  it('formats a post date as an RFC-822 string for midnight in the author timezone', () => {
    expect(rfc822('29 Jul, 2026')).toBe('Tue, 28 Jul 2026 18:30:00 GMT');
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
      expect(postTimestamp(sorted[i - 1].date)).toBeGreaterThanOrEqual(postTimestamp(sorted[i].date));
    }
  });
});

describe('publishing input validation', () => {
  let directory;
  afterEach(() => { if (directory) rmSync(directory, { recursive: true, force: true }); });
  const fixture = (slug, date = '2026-09-16') => `---\ntitle: Example\nslug: ${slug}\ndate: ${date}\n---\nActual content`;
  const prepare = text => {
    directory = mkdtempSync(join(tmpdir(), 'portfolio-posts-'));
    writeFileSync(join(directory, 'post.md'), text);
  };
  it.each(['../escape', '/absolute', 'with spaces', 'mixedCase', 'a'.repeat(121)])('rejects invalid slug %s', slug => {
    prepare(fixture(slug));
    expect(() => readPosts(directory)).toThrow('Invalid title or URL slug');
  });
  it('rejects duplicate paths instead of overwriting a published article', () => {
    prepare(fixture('example'));
    writeFileSync(join(directory, 'duplicate.md'), fixture('example'));
    expect(() => readPosts(directory)).toThrow('Duplicate blog slug');
  });
  it('rejects invalid publication dates', () => {
    prepare(fixture('example', 'not-a-date'));
    expect(() => readPosts(directory)).toThrow('Invalid publication date');
  });
  it('accepts an update date on or after publication and keeps it on the post', () => {
    prepare(fixture('example').replace('---\nActual', 'updated: 2026-11-01\n---\nActual'));
    expect(readPosts(directory)[0]).toMatchObject({ date: '2026-09-16', updated: '2026-11-01' });
  });
  it.each([
    ['an invalid update date', 'updated: next week', 'Invalid update date'],
    ['an empty update date', 'updated:', 'Invalid update date'],
    ['an update before publication', 'updated: 2026-09-15', 'Update date before the publication date'],
  ])('rejects %s', (_, line, message) => {
    prepare(fixture('example').replace('---\nActual', `${line}\n---\nActual`));
    expect(() => readPosts(directory)).toThrow(message);
  });
  it('normalizes Windows line endings in metadata and article content', () => {
    prepare(fixture('example').replaceAll('\n', '\r\n'));
    expect(readPosts(directory)[0]).toMatchObject({ slug: 'example', body: 'Actual content', wordCount: 2 });
  });
});
