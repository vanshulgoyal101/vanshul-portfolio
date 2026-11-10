/**
 * Shared, dependency-free helpers for the SEO build scripts (feed, OG images,
 * blog prerender): post reading and validation, and XML escaping. Frontmatter
 * parsing lives in src/utils/frontmatter.js, shared with the app.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseFrontmatter } from '../../src/utils/frontmatter.js';
import { parsePostDate, postTimestamp, compareNewestFirst } from '../../src/utils/seoValues.js';

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
 * or duplicate slug, an invalid date, or an `updated` date that is invalid or
 * earlier than `date`, so a bad post fails the build instead of being silently
 * skipped.
 * @param {string} blogsDir
 * @returns {Array<Record<string, unknown>>}
 */
export const readPosts = (blogsDir) => {
  const slugs = new Set();
  return readdirSync(blogsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content: body } = parseFrontmatter(readFileSync(join(blogsDir, f), 'utf8'));
      if (!data.title || !data.slug || data.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
        throw new Error(`Invalid title or URL slug in ${f}`);
      }
      if (slugs.has(data.slug)) throw new Error(`Duplicate blog slug in ${f}: ${data.slug}`);
      if (!parsePostDate(data.date)) throw new Error(`Invalid publication date in ${f}: use "29 Jul, 2026" or "2026-07-29"`);
      if (data.updated !== undefined) {
        if (!parsePostDate(data.updated)) throw new Error(`Invalid update date in ${f}: use "29 Jul, 2026" or "2026-07-29"`);
        if (postTimestamp(data.updated) < postTimestamp(data.date)) throw new Error(`Update date before the publication date in ${f}`);
      }
      slugs.add(data.slug);
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
export { parseTags, postKeywords, postDate, postPublishedAt, postLastModified } from '../../src/utils/seoValues.js';
