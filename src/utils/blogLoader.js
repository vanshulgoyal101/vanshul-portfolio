/**
 * Post metadata for listings: frontmatter plus `filename` and `wordCount`,
 * without the Markdown body. It comes from the `virtual:blog-index` module
 * (scripts/lib/blogIndexPlugin.mjs), so pages that only list posts don't ship
 * every article. Full posts come from ./blogPostLoader, which only the lazy
 * article page imports.
 */
import postIndex from 'virtual:blog-index';

/** @returns {Array<Record<string, unknown>>} */
export const loadBlogPosts = () => postIndex;
