import { useEffect, useState } from 'react';
import { getAllBlogViews, recordBlogView } from '../utils/blogViews';
import { loadBlogPosts } from '../utils/blogLoader';

const PUBLISHED_SLUGS = loadBlogPosts().map((post) => post.slug);

/**
 * Returns a `{ [slug]: views }` map of view counts for the published posts,
 * fetched once on mount. Empty (`{}`) until loaded or when Supabase is not configured.
 */
export const useBlogViews = () => {
  const [views, setViews] = useState({});

  useEffect(() => {
    let active = true;
    getAllBlogViews(PUBLISHED_SLUGS).then((map) => {
      if (active) setViews(map);
    }).catch(() => {
      if (active) setViews({});
    });
    return () => {
      active = false;
    };
  }, []);

  return views;
};

/**
 * Records a view of `slug` (at most once per browser session) and returns the
 * current count, or `null` while loading / when Supabase is not configured.
 *
 * @param {string} slug
 */
export const useBlogView = (slug) => {
  const [result, setResult] = useState({ slug, count: null });
  if (result.slug !== slug) {
    setResult({ slug, count: null });
  }

  useEffect(() => {
    if (!slug) return;
    let active = true;
    recordBlogView(slug).then((n) => {
      if (active) setResult({ slug, count: n ?? null });
    }).catch(() => {
      if (active) setResult({ slug, count: null });
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return result.slug === slug ? result.count : null;
};
