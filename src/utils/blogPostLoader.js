/**
 * Full posts with their Markdown bodies. Every post is inlined at build time,
 * so import this only from the lazily loaded article page; listings use
 * ./blogLoader, which carries metadata only.
 */
import { parseFrontmatter } from './frontmatter';

const blogFiles = import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default', eager: true });

let cachedPosts = null;

/** @returns {Array<Record<string, unknown>>} `{ ...frontmatter, content, filename }` per post */
export const loadFullBlogPosts = () => {
  if (cachedPosts) return cachedPosts;
  cachedPosts = Object.entries(blogFiles).map(([path, markdown]) => {
    const { data, content } = parseFrontmatter(markdown);
    return { ...data, content, filename: path.split('/').pop().replace(/\.md$/, '') };
  });
  return cachedPosts;
};

/** @returns {Record<string, unknown> | null} */
export const loadBlogBySlug = (slug) => loadFullBlogPosts().find((post) => post.slug === slug) || null;
