import { useEffect } from 'react';

const SITE_URL = 'https://vanshul.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

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
 */
export const useSeo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
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
    cleanups.push(upsertMeta('name', 'twitter:image', image));
    cleanups.push(upsertLink('canonical', url));

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
  }, [title, description, path, image, type, jsonLd]);
};

export default useSeo;
