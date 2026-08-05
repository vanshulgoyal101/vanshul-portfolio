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

/**
 * Pick posts related to the current one for an end-of-article "more reading"
 * section. Posts in the same category are preferred (newest first), then the
 * most recent remaining posts fill any gap. The current post is always excluded.
 *
 * @param {Array} posts - All blog posts
 * @param {Object} current - The post being viewed (matched by `slug`)
 * @param {number} [limit=3] - Maximum number of related posts to return
 * @returns {Array} Up to `limit` related posts
 */
export const getRelatedPosts = (posts, current, limit = 3) => {
  if (!Array.isArray(posts) || !current) return [];

  const others = posts.filter((p) => p.slug && p.slug !== current.slug);
  const sameCategory = current.category
    ? others.filter((p) => p.category === current.category)
    : [];
  const rest = others.filter((p) => !sameCategory.includes(p));

  return [...sortBlogsByDate(sameCategory), ...sortBlogsByDate(rest)].slice(0, Math.max(0, limit));
};


