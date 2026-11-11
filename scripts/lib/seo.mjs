/**
 * Shared, dependency-free helpers for the SEO build scripts (feed, OG images,
 * blog prerender): post reading and validation, and XML escaping. Frontmatter
 * parsing lives in src/utils/frontmatter.js, shared with the app.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { postTimestamp, compareNewestFirst } from '../../src/utils/seoValues.js';
import { parseFrontmatter as parsePostFrontmatter, parseBlogPost } from '../../src/utils/postContent.js';

export const parseFrontmatter = (md) => parsePostFrontmatter(md).data;

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
 * with `body`, `wordCount` and `filename`. Uses the same publishing validation
 * as the browser, so malformed posts fail the build instead of being skipped.
 * @param {string} blogsDir
 * @returns {Array<Record<string, unknown>>}
 */
export const readPosts = (blogsDir) => {
  return readdirSync(blogsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(blogsDir, f), 'utf8');
      const { content, ...post } = parseBlogPost(raw, f.replace(/\.md$/, ''));
      return { ...post, body: content };
    });
};

/** Sort comparator: newest post first, by `date`. */
export const byDateDesc = compareNewestFirst;

// Browser-safe helpers shared with the application (see src/utils/seoValues.js).
export { parseTags, postKeywords, postDate, postPublishedAt, postLastModified } from '../../src/utils/seoValues.js';
