/**
 * Utility functions for blog operations.
 */

/**
 * Sort blog posts by date in descending order (newest first).
 * Returns a new array and does not mutate the input.
 *
 * @param {Array} posts - Array of blog post objects with a `date` field
 * @returns {Array} Sorted array of blog posts
 */
export const sortBlogsByDate = (posts) => {
  if (!Array.isArray(posts)) return [];

  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
};

