/**
 * Pure builders for the blog's JSON-LD structured data. Kept dependency-free
 * and side-effect-free so they can be unit-tested with fixtures and reused by
 * the prerender script. All identity (site URL, author, sameAs) is injected via
 * `opts` — nothing is read from disk or the environment here.
 */
import { isoDate, postKeywords } from '../../src/utils/seoValues.js';
import { HOME_PATH, BLOG_PATH, postPath, absoluteUrl } from '../../src/constants/routes.js';

const websiteId = (site) => `${site}/#website`;
const personId = (site) => `${site}/#person`;

/**
 * @typedef {Object} SeoIdentity
 * @property {string} site        Canonical site origin, e.g. "https://vanshul.com"
 * @property {string} authorName
 * @property {string[]} authorSameAs
 */

/** A schema.org BreadcrumbList from `[name, item]` pairs. */
export const breadcrumbList = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, item], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item,
  })),
});

/**
 * JSON-LD for a single blog post: a BlogPosting cross-linked to the site's
 * WebSite/Person entities (via @id) plus its breadcrumb trail.
 * @param {Record<string, unknown>} post  Parsed frontmatter (+ optional wordCount)
 * @param {SeoIdentity} identity
 * @returns {object[]}
 */
export const postJsonLd = (post, { site, authorName, authorSameAs }) => {
  const canonical = absoluteUrl(postPath(post.slug), site);
  const ogImage = `${site}/og/${post.slug}.png`;
  const desc = post.summary || '';
  const published = isoDate(post.date);
  const readMinutes = parseInt(post.readTime, 10);
  const keywords = postKeywords(post);

  const author = {
    '@type': 'Person',
    '@id': personId(site),
    name: authorName,
    url: site,
    sameAs: authorSameAs,
  };

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: desc,
      image: [ogImage],
      inLanguage: 'en',
      ...(published ? { datePublished: published, dateModified: published } : {}),
      ...(Number.isFinite(readMinutes) ? { timeRequired: `PT${readMinutes}M` } : {}),
      ...(post.wordCount ? { wordCount: post.wordCount } : {}),
      ...(post.category ? { articleSection: post.category } : {}),
      ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
      author,
      publisher: {
        '@type': 'Person',
        '@id': personId(site),
        name: authorName,
        url: site,
        image: `${site}/og-image.png`,
      },
      isPartOf: { '@type': 'WebSite', '@id': websiteId(site) },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
    },
    breadcrumbList([
      ['Home', absoluteUrl(HOME_PATH, site)],
      ['Blog', absoluteUrl(BLOG_PATH, site)],
      [post.title, canonical],
    ]),
  ];
};

/**
 * JSON-LD for the /blog index: a Blog entity listing every post plus a
 * breadcrumb trail.
 * @param {Array<Record<string, unknown>>} posts  Newest-first
 * @param {SeoIdentity & { title: string, description: string }} identity
 * @returns {object[]}
 */
export const blogIndexJsonLd = (posts, { site, authorName, title, description }) => {
  const canonical = absoluteUrl(BLOG_PATH, site);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${canonical}#blog`,
      name: title,
      url: canonical,
      description,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', '@id': websiteId(site) },
      author: { '@type': 'Person', '@id': personId(site), name: authorName, url: site },
      blogPost: posts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: absoluteUrl(postPath(p.slug), site),
        ...(isoDate(p.date) ? { datePublished: isoDate(p.date) } : {}),
        ...(p.category ? { articleSection: p.category } : {}),
      })),
    },
    breadcrumbList([
      ['Home', absoluteUrl(HOME_PATH, site)],
      ['Blog', canonical],
    ]),
  ];
};
