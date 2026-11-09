/**
 * Utility functions for blog operations.
 */
import { compareNewestFirst, parsePostDate } from './seoValues';

/**
 * Sort blog posts by date in descending order (newest first).
 * Returns a new array and does not mutate the input.
 *
 * @param {Array} posts - Array of blog post objects with a `date` field
 * @returns {Array} Sorted array of blog posts
 */
export const sortBlogsByDate = (posts) => {
  if (!Array.isArray(posts)) return [];

  return [...posts].sort(compareNewestFirst);
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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Display a frontmatter date as "29 Jul 2026", or "29 Jul" when the year is
 * shown elsewhere. Values that are not real dates are returned unchanged.
 *
 * @param {string} value - Frontmatter date ("29 Jul, 2026" or "2026-07-29")
 * @param {{ year?: boolean }} [options]
 * @returns {string}
 */
export const formatPostDate = (value, { year = true } = {}) => {
  const parts = parsePostDate(value);
  if (!parts) return String(value ?? '');
  const dayMonth = `${parts.day} ${MONTH_LABELS[parts.month - 1]}`;
  return year ? `${dayMonth} ${parts.year}` : dayMonth;
};

/**
 * Split posts that are already sorted newest first into consecutive groups by
 * publication year, for the archive.
 *
 * @param {Array} posts - Posts sorted with `sortBlogsByDate`
 * @returns {Array<{ year: string, posts: Array }>}
 */
export const groupPostsByYear = (posts) => {
  const groups = [];
  for (const post of posts) {
    const year = String(parsePostDate(post.date)?.year ?? 'Undated');
    const current = groups.at(-1);
    if (current?.year === year) current.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
};
