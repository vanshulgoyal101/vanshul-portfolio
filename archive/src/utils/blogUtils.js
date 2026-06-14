/**
 * Utility functions for blog operations
 */

import ReactMarkdown from 'react-markdown';

/**
 * Convert markdown content to HTML string
 * @param {string} markdown - Markdown content
 * @returns {string} HTML string
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // For now, we'll use React Markdown component directly in the modal
  // This function is a placeholder if we need server-side rendering
  return markdown;
};

/**
 * Sort blog posts by date in descending order (newest first)
 * @param {Array} posts - Array of blog post objects
 * @returns {Array} Sorted array of blog posts
 */
export const sortBlogsByDate = (posts) => {
  if (!Array.isArray(posts)) return [];
  
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
};

/**
 * Filter blogs by category
 * @param {Array} posts - Array of blog post objects
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered array of blog posts
 */
export const filterBlogsByCategory = (posts, category) => {
  if (!Array.isArray(posts) || !category) return posts;
  
  return posts.filter(post => 
    post.category?.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get all unique categories from blog posts
 * @param {Array} posts - Array of blog post objects
 * @returns {Array} Array of unique categories
 */
export const getBlogCategories = (posts) => {
  if (!Array.isArray(posts)) return [];
  
  const categories = posts
    .map(post => post.category)
    .filter(Boolean);
  
  return [...new Set(categories)];
};

/**
 * Format date string to a more readable format
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string
 */
export const formatBlogDate = (dateStr) => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Find a blog post by slug
 * @param {Array} posts - Array of blog post objects
 * @param {string} slug - Blog slug to search for
 * @returns {Object|null} Blog post object or null if not found
 */
export const findBlogBySlug = (posts, slug) => {
  if (!Array.isArray(posts) || !slug) return null;
  
  return posts.find(post => post.slug === slug) || null;
};

/**
 * Get estimated reading time from content
 * @param {string} content - Blog content
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {string} Estimated reading time
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return '0 min read';
  
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
};

/**
 * Sanitize HTML content for safe rendering
 * Note: This is a basic implementation. For production, consider using a library like DOMPurify
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  // Basic sanitization - you may want to use DOMPurify in production
  const allowedTags = ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedAttributes = {
    'a': ['href', 'target', 'rel']
  };
  
  // For now, return as-is, but recommend using DOMPurify
  return html;
};
