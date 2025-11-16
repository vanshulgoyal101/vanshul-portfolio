/**
 * Blog loader utility
 * Dynamically loads all blog posts from markdown files
 */

// Dynamically import all markdown files from the blogs directory
const blogFiles = import.meta.glob('../blogs/*.md', { as: 'raw', eager: true });

/**
 * Parse frontmatter from markdown content
 * @param {string} markdown - Raw markdown content with YAML frontmatter
 * @returns {Object} Object with frontmatter data and content
 */
const parseFrontmatter = (markdown) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: markdown };
  }
  
  const frontmatterText = match[1];
  const content = match[2];
  
  // Parse YAML-like frontmatter
  const data = {};
  const lines = frontmatterText.split('\n');
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Convert to number if it's a valid number
      if (!isNaN(value) && value !== '') {
        data[key] = Number(value);
      } else {
        data[key] = value;
      }
    }
  });
  
  return { data, content: content.trim() };
};

/**
 * Load all blog posts from markdown files
 * @returns {Array} Array of blog post objects with parsed frontmatter and content
 */
export const loadBlogPosts = () => {
  const posts = [];

  // Process each markdown file
  for (const path in blogFiles) {
    try {
      const markdown = blogFiles[path];
      const { data: frontmatter, content: markdownContent } = parseFrontmatter(markdown);
      
      posts.push({
        ...frontmatter,
        content: markdownContent,
        filename: path.split('/').pop().replace('.md', '')
      });
    } catch (error) {
      console.error(`Error loading blog post ${filename}:`, error);
    }
  }

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
