/**
 * Shared, dependency-free helpers for the SEO build scripts (feed, OG images,
 * blog prerender). Kept in one place so the frontmatter parser and XML escaping
 * are defined — and tested — exactly once.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parsePostDate, postTimestamp, compareNewestFirst } from '../../src/utils/seoValues.js';

/**
 * Parse the leading YAML frontmatter block of a markdown string into a flat
 * object. Only splits on the first colon, strips surrounding quotes, and leaves
 * values as strings (build scripts don't need numeric coercion).
 * @param {string} md
 * @returns {Record<string, string>}
 */
export const parseFrontmatter = (md) => {
  const match = String(md).replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) {
        data[line.slice(0, i).trim()] = line
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  }
  return data;
};

/** Escape a string for use in an XML/HTML attribute value (escapes quotes too). */
export const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escape a string for XML/HTML text content (quotes left intact). */
export const escapeText = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** A post date as an RFC-822 string (for RSS), or undefined if invalid. */
export const rfc822 = (value) => {
  const timestamp = postTimestamp(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toUTCString();
};

/**
 * Read every `*.md` post in a directory, returning parsed frontmatter enriched
 * with `body`, `wordCount` and `filename`. Throws on a missing title, an invalid
 * or duplicate slug, or an invalid date, so a bad post fails the build instead
 * of being silently skipped.
 * @param {string} blogsDir
 * @returns {Array<Record<string, unknown>>}
 */
export const readPosts = (blogsDir) => {
  const slugs = new Set();
  return readdirSync(blogsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(blogsDir, f), 'utf8').replace(/\r\n/g, '\n');
      const data = parseFrontmatter(raw);
      if (!data.title || !data.slug || data.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
        throw new Error(`Invalid title or URL slug in ${f}`);
      }
      if (slugs.has(data.slug)) throw new Error(`Duplicate blog slug in ${f}: ${data.slug}`);
      if (!parsePostDate(data.date)) throw new Error(`Invalid publication date in ${f}: use "29 Jul, 2026" or "2026-07-29"`);
      slugs.add(data.slug);
      const body = raw.replace(/^---\n[\s\S]*?\n---/, '').trim();
      return {
        ...data,
        body,
        wordCount: body ? body.split(/\s+/).length : undefined,
        filename: f.replace(/\.md$/, ''),
      };
    });
};

/** Sort comparator: newest post first, by `date`. */
export const byDateDesc = compareNewestFirst;

// Browser-safe helpers shared with the application (see src/utils/seoValues.js).
export { parseTags, postKeywords, postDate, postPublishedAt } from '../../src/utils/seoValues.js';
