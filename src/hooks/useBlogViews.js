import { useEffect, useState } from 'react';
import { getAllBlogViews, incrementBlogView } from '../utils/blogViews';

/**
 * Returns a `{ [slug]: views }` map of view counts for all posts, fetched once
 * on mount. Empty (`{}`) until loaded or when Supabase is not configured.
 */
export const useBlogViews = () => {
  const [views, setViews] = useState({});

  useEffect(() => {
    let active = true;
    getAllBlogViews().then((map) => {
      if (active) setViews(map);
    });
    return () => {
      active = false;
    };
  }, []);

  return views;
};

/**
 * Records one view for `slug` (once per slug) and returns the current count,
 * or `null` while loading / when Supabase is not configured.
 *
 * @param {string} slug
 */
export const useBlogView = (slug) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setCount(null);
    incrementBlogView(slug).then((n) => {
      if (active && n != null) setCount(n);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return count;
};
