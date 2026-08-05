import { useEffect } from 'react';
import { SITE_URL, DEFAULT_OG_IMAGE as DEFAULT_IMAGE } from '../constants/siteConfig';

// Update an existing <meta> (or create one), returning a cleanup that restores
// the previous state. This mutates the static tags from index.html in place so
// we never end up with duplicate title/description tags.
const upsertMeta = (attr, key, content) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  const created = !el;
  const prev = el ? el.getAttribute('content') : null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return () => {
    if (created) el.remove();
    else if (prev != null) el.setAttribute('content', prev);
  };
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  const created = !el;
  const prev = el ? el.getAttribute('href') : null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return () => {
    if (created) el.remove();
    else if (prev != null) el.setAttribute('href', prev);
  };
};

/**
 * Sets per-page SEO tags (title, description, canonical, Open Graph, Twitter,
 * and optional JSON-LD) for a client-rendered route, and restores the previous
 * values on unmount so navigating back reverts to the document defaults.
 *
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {string} [opts.path]  - Path portion of the canonical URL (e.g. '/blog/x')
 * @param {string} [opts.image] - Absolute Open Graph image URL
 * @param {string} [opts.type]  - Open Graph type ('website' | 'article')
 * @param {string} [opts.jsonLd] - Pre-serialized JSON-LD string
 * @param {Object} [opts.article] - Article OG metadata (used when type==='article')
 * @param {string} [opts.article.publishedTime] - ISO 8601 publish date
 * @param {string} [opts.article.modifiedTime]  - ISO 8601 last-modified date
 * @param {string} [opts.article.author]  - Author name or profile URL
 * @param {string} [opts.article.section] - Article category/section
 */
export const useSeo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  article,
} = {}) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const prevTitle = document.title;
    const cleanups = [];

    if (title) {
      document.title = title;
      cleanups.push(upsertMeta('property', 'og:title', title));
      cleanups.push(upsertMeta('name', 'twitter:title', title));
    }
    if (description) {
      cleanups.push(upsertMeta('name', 'description', description));
      cleanups.push(upsertMeta('property', 'og:description', description));
      cleanups.push(upsertMeta('name', 'twitter:description', description));
    }
    cleanups.push(upsertMeta('property', 'og:type', type));
    cleanups.push(upsertMeta('property', 'og:url', url));
    cleanups.push(upsertMeta('property', 'og:image', image));
    cleanups.push(upsertMeta('property', 'og:image:width', '1200'));
    cleanups.push(upsertMeta('property', 'og:image:height', '630'));
    if (title) cleanups.push(upsertMeta('property', 'og:image:alt', title));
    cleanups.push(upsertMeta('name', 'twitter:image', image));
    cleanups.push(upsertLink('canonical', url));

    if (type === 'article' && article) {
      if (article.publishedTime)
        cleanups.push(upsertMeta('property', 'article:published_time', article.publishedTime));
      if (article.modifiedTime)
        cleanups.push(upsertMeta('property', 'article:modified_time', article.modifiedTime));
      if (article.author)
        cleanups.push(upsertMeta('property', 'article:author', article.author));
      if (article.section)
        cleanups.push(upsertMeta('property', 'article:section', article.section));
    }

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = jsonLd;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
      if (script) script.remove();
    };
  }, [title, description, path, image, type, jsonLd, article]);
};

export default useSeo;
