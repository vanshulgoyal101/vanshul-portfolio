/**
 * Shared, dependency-free helpers for the SEO build scripts (feed, OG images,
 * blog prerender). Kept in one place so the frontmatter parser and XML escaping
 * are defined — and tested — exactly once.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse the leading YAML frontmatter block of a markdown string into a flat
 * object. Only splits on the first colon, strips surrounding quotes, and leaves
 * values as strings (build scripts don't need numeric coercion).
 * @param {string} md
 * @returns {Record<string, string>}
 */
export const parseFrontmatter = (md) => {
  const match = String(md).match(/^---\n([\s\S]*?)\n---/);
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

/** Format a date value as an RFC-822 string (for RSS), or undefined if invalid. */
export const rfc822 = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toUTCString();
};

/**
 * Read every `*.md` post in a directory, returning parsed frontmatter enriched
 * with `body`, `wordCount` and `filename`. Posts missing `slug` or `title` are
 * dropped.
 * @param {string} blogsDir
 * @returns {Array<Record<string, unknown>>}
 */
export const readPosts = (blogsDir) =>
  readdirSync(blogsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(blogsDir, f), 'utf8');
      const body = raw.replace(/^---\n[\s\S]*?\n---/, '').trim();
      return {
        ...parseFrontmatter(raw),
        body,
        wordCount: body ? body.split(/\s+/).length : undefined,
        filename: f.replace(/\.md$/, ''),
      };
    })
    .filter((p) => p.slug && p.title);

/** Sort comparator: newest post first, by `date`. */
export const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

/**
 * Parse a frontmatter `tags` value ("AI, Robotics, Future of Work") into a
 * clean, de-duplicated array. Accepts an array too. Empty/missing → [].
 * @param {string|string[]|undefined} value
 * @returns {string[]}
 */
export const parseTags = (value) => {
  if (!value) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const tag = String(raw).trim().replace(/^["']|["']$/g, '');
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      out.push(tag);
    }
  }
  return out;
};

/**
 * Topical keywords for a post: its category (first) plus any `tags`,
 * de-duplicated. Used for JSON-LD `keywords` and `article:tag` meta.
 * @param {Record<string, unknown>} post
 * @returns {string[]}
 */
export const postKeywords = (post) => {
  const seen = new Set();
  const out = [];
  for (const kw of [post.category, ...parseTags(post.tags)]) {
    const tag = kw ? String(kw).trim() : '';
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      out.push(tag);
    }
  }
  return out;
};

/** ISO 8601 date (or undefined if the value isn't a parseable date). */
export const isoDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

/**
 * Local calendar date as `YYYY-MM-DD` (for sitemap <lastmod>). Uses local date
 * parts so output matches the human-written date regardless of the runner's
 * timezone (avoids a UTC off-by-one). Returns null for invalid input.
 */
export const localCalendarDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
