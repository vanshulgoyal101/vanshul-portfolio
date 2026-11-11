import { parsePostDate, postTimestamp } from './seoValues.js';
import { parseFrontmatter } from './frontmatter.js';
export { parseFrontmatter } from './frontmatter.js';

export const parseBlogPost = (markdown, filename) => {
  if (typeof markdown !== 'string') throw new TypeError('Post content must be a string.');
  const { data, content } = parseFrontmatter(markdown);
  const required = ['title', 'slug', 'summary', 'date', 'readTime'];
  for (const field of required) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(`Invalid ${field} in ${filename}.md: a non-empty string is required.`);
    }
  }
  if (data.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`Invalid URL slug in ${filename}.md.`);
  }
  if (data.slug !== filename) throw new Error(`Slug must match filename in ${filename}.md.`);
  if (!parsePostDate(data.date)) {
    throw new Error(`Invalid publication date in ${filename}.md: use "29 Jul, 2026" or "2026-07-29".`);
  }
  if (data.updated !== undefined) {
    if (!parsePostDate(data.updated)) throw new Error(`Invalid update date in ${filename}.md: use a real calendar date.`);
    if (postTimestamp(data.updated) < postTimestamp(data.date)) {
      throw new Error(`Update date before the publication date in ${filename}.md.`);
    }
  }
  if (!/^[1-9]\d* min read$/.test(data.readTime)) {
    throw new Error(`Invalid readTime in ${filename}.md: use a positive number followed by " min read".`);
  }
  if (!content) throw new Error(`Empty article body in ${filename}.md.`);
  return { ...data, content, filename, wordCount: content.split(/\s+/).length };
};
