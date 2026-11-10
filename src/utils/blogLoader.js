/**
 * Blog loader utility
 * Dynamically loads all blog posts from markdown files
 */

import { parseFrontmatter } from './frontmatter';

// Dynamically import all markdown files from the blogs directory
const blogFiles = import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default', eager: true });

/**
 * Load all blog posts from markdown files
 * @returns {Array} Array of blog post objects with parsed frontmatter and content
 */
let cachedPosts = null;

export const loadBlogPosts = () => {
  // The markdown is bundled eagerly, so parse once and reuse the result.
  if (cachedPosts) return cachedPosts;

  const posts = [];

  // Process each markdown file
  for (const path in blogFiles) {
    const filename = path.split('/').pop().replace('.md', '');
    try {
      const markdown = blogFiles[path];
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(markdown);

      posts.push({
        ...frontmatter,
        content: markdownContent,
        filename
      });
    } catch (error) {
      console.error(`Error loading blog post ${filename}:`, error);
    }
  }

  cachedPosts = posts;
  return posts;
};

/**
 * Load a single blog post by slug
 * @param {string} slug - The blog post slug
 * @returns {Object|null} Blog post object or null if not found
 */
export const loadBlogBySlug = (slug) => {
  const posts = loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
};
