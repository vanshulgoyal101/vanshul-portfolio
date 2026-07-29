import { supabase } from '../lib/supabaseClient';

/**
 * Increment the view count for a post and return the new total.
 * Returns `null` when Supabase is not configured or the request fails.
 *
 * @param {string} slug - The blog post slug
 * @returns {Promise<number|null>}
 */
export const incrementBlogView = async (slug) => {
  if (!supabase || !slug) return null;

  const { data, error } = await supabase.rpc('increment_blog_view', {
    post_slug: slug,
  });

  if (error) {
    console.error('Failed to increment blog view:', error.message);
    return null;
  }

  return typeof data === 'number' ? data : null;
};

/**
 * Fetch all view counts as a `{ [slug]: views }` map.
 * Returns an empty object when Supabase is not configured or the request fails.
 *
 * @returns {Promise<Record<string, number>>}
 */
export const getAllBlogViews = async () => {
  if (!supabase) return {};

  const { data, error } = await supabase.from('blog_views').select('slug, views');

  if (error) {
    console.error('Failed to load blog views:', error.message);
    return {};
  }

  return Object.fromEntries((data ?? []).map((row) => [row.slug, row.views]));
};

/**
 * Format a view count for display (e.g. 1200 -> "1.2k", 3_000_000 -> "3m").
 *
 * @param {number|null|undefined} n
 * @returns {string|null}
 */
export const formatViews = (n) => {
  if (n == null || Number.isNaN(n)) return null;
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
    .format(n)
    .toLowerCase();
};
