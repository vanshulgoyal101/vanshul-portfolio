/**
 * Vite plugin serving `virtual:blog-index`: every post's frontmatter plus
 * `filename` and `wordCount`, without its body. The homepage, the archive and
 * the view counts only need this, so the post bodies stay in the lazy article
 * chunk instead of the first load (see src/utils/blogLoader.js).
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readPosts } from './seo.mjs';

const ID = 'virtual:blog-index';
const RESOLVED = `\0${ID}`;

/**
 * Post metadata for a posts directory, validated like every other build step.
 * @param {string} blogsDir
 * @returns {Array<Record<string, unknown>>}
 */
export const blogIndex = (blogsDir) =>
  readPosts(blogsDir).map(({ body, ...meta }) => meta);

/** @param {{ blogsDir: string }} options */
export const blogIndexPlugin = ({ blogsDir }) => ({
  name: 'vanshul:blog-index',
  resolveId: (id) => (id === ID ? RESOLVED : undefined),
  load(id) {
    if (id !== RESOLVED) return undefined;
    // Rebuild the index in dev whenever a post changes.
    for (const file of readdirSync(blogsDir).filter((f) => f.endsWith('.md'))) {
      this.addWatchFile(join(blogsDir, file));
    }
    return `export default ${JSON.stringify(blogIndex(blogsDir))};`;
  },
});
