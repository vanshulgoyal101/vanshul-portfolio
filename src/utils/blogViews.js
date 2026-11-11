import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

// The client loads on first use; a failed download degrades like a failed
// request (no counts) instead of rejecting.
const loadClient = () => getSupabase().catch((error) => {
  console.error('Failed to load the view-count client:', error.message);
  return null;
});

// Slugs already counted in this browser session, so reloads and revisits do
// not inflate the public counts.
const SESSION_KEY = 'vg.viewedPosts';
const MAX_COUNTED = 500;
// Slugs are at most 120 characters (the increment_blog_view RPC enforces it).
const isStoredSlug = value => typeof value === 'string' && value.length > 0 && value.length <= 120;

// Stored data is untrusted: anything but a list of slugs reads as empty or
// loses the bad entries, so a corrupt value can never block a count.
const countedSlugs = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '[]');
    return new Set(Array.isArray(stored) ? stored.filter(isStoredSlug).slice(-MAX_COUNTED) : []);
  } catch {
    return new Set();
  }
};

const setCounted = (slug, counted) => {
  try {
    const slugs = countedSlugs();
    if (counted) slugs.add(slug);
    else slugs.delete(slug);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...slugs]));
  } catch {
    // Storage unavailable (privacy mode): views are simply not deduplicated.
  }
};

/**
 * Increment the view count for a post and return the new total.
 * Returns `null` when Supabase is not configured or the request fails.
 *
 * @param {string} slug - The blog post slug
 * @returns {Promise<number|null>}
 */
export const incrementBlogView = async (slug) => {
  if (!slug) return null;
  const supabase = await loadClient();
  if (!supabase) return null;

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
 * Read the current view count for one post without changing it.
 *
 * @param {string} slug
 * @returns {Promise<number|null>}
 */
export const getBlogView = async (slug) => {
  if (!slug) return null;
  const supabase = await loadClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_views')
    .select('views')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Failed to load blog view:', error.message);
    return null;
  }

  return typeof data?.views === 'number' ? data.views : null;
};

/**
 * Count a view of `slug` at most once per browser session and return the
 * current total. The slug is marked before the request so a concurrent call
 * (React StrictMode re-running effects) reads instead of counting twice; a
 * failed increment is unmarked so a later visit can count it.
 *
 * @param {string} slug
 * @returns {Promise<number|null>}
 */
export const recordBlogView = async (slug) => {
  if (!isSupabaseConfigured || !slug) return null;
  if (countedSlugs().has(slug)) return getBlogView(slug);

  setCounted(slug, true);
  let count = null;
  try {
    count = await incrementBlogView(slug);
  } finally {
    if (count == null) setCounted(slug, false);
  }
  return count;
};

/**
 * Fetch view counts for the given slugs as a `{ [slug]: views }` map. The query
 * is limited to published slugs: the increment RPC accepts any well-formed
 * slug, so the table can hold rows that are not posts.
 * Returns an empty object when Supabase is not configured or the request fails.
 *
 * @param {string[]} slugs
 * @returns {Promise<Record<string, number>>}
 */
export const getAllBlogViews = async (slugs) => {
  if (!slugs?.length) return {};
  const supabase = await loadClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('blog_views')
    .select('slug, views')
    .in('slug', slugs);

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
