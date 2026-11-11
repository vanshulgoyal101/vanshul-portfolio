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

// Remove a static <meta> that would misdescribe the page, restoring it on cleanup.
const detachMeta = (attr, key) => {
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  el?.remove();
  return () => { if (el) document.head.appendChild(el); };
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

const IMAGE_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };

/** The MIME type for a raster social image URL, or undefined when unsupported. */
export const socialImageType = (url) => {
  const pathname = URL.canParse(url) ? new URL(url).pathname : String(url);
  return IMAGE_TYPES[pathname.split('.').pop().toLowerCase()];
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
 * @param {string} [opts.robots] - Robots directive (e.g. 'noindex, nofollow')
 * @param {Object} [opts.article] - Article OG metadata (used when type==='article')
 * @param {string} [opts.article.publishedTime] - ISO 8601 publish date
 * @param {string} [opts.article.modifiedTime]  - ISO 8601 last-modified date
 * @param {string} [opts.article.author]  - Author name or profile URL
 * @param {string} [opts.article.section] - Article category/section
 * @param {string[]} [opts.article.tags] - Article tags, one article:tag each
 */
export const useSeo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  article,
} = {}) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const prevTitle = document.title;
    const cleanups = [];
    const previousRouteTags = [...document.head.querySelectorAll('script[data-route-seo], meta[property^="article:"]')];
    previousRouteTags.forEach(element => element.remove());

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
    cleanups.push(upsertMeta('name', 'twitter:url', url));
    cleanups.push(upsertMeta('property', 'og:image', image));
    // Crawlers refuse SVG cards; the type tag states the raster format outright.
    const imageType = socialImageType(image);
    if (imageType) cleanups.push(upsertMeta('property', 'og:image:type', imageType));
    else cleanups.push(detachMeta('property', 'og:image:type'));
    cleanups.push(upsertMeta('property', 'og:image:width', '1200'));
    cleanups.push(upsertMeta('property', 'og:image:height', '630'));
    if (title) cleanups.push(upsertMeta('property', 'og:image:alt', title));
    cleanups.push(upsertMeta('name', 'twitter:image', image));
    cleanups.push(upsertLink('canonical', url));

    if (robots) cleanups.push(upsertMeta('name', 'robots', robots));

    if (type === 'article' && article) {
      if (article.publishedTime)
        cleanups.push(upsertMeta('property', 'article:published_time', article.publishedTime));
      if (article.modifiedTime)
        cleanups.push(upsertMeta('property', 'article:modified_time', article.modifiedTime));
      if (article.author)
        cleanups.push(upsertMeta('property', 'article:author', article.author));
      if (article.section)
        cleanups.push(upsertMeta('property', 'article:section', article.section));
      // Mirrors the prerendered tags, which the reset above removed.
      for (const tag of article.tags ?? []) {
        const element = document.createElement('meta');
        element.setAttribute('property', 'article:tag');
        element.setAttribute('content', tag);
        document.head.appendChild(element);
        cleanups.push(() => element.remove());
      }
    }

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-route-seo', '');
      script.textContent = jsonLd;
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
      if (script) script.remove();
      previousRouteTags.forEach(element => document.head.appendChild(element));
    };
  }, [title, description, path, image, type, jsonLd, robots, article]);
};

export default useSeo;
