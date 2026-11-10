/**
 * Pure builders for the blog's JSON-LD structured data. Kept dependency-free
 * and side-effect-free so they can be unit-tested with fixtures and reused by
 * the prerender script. All identity (site URL, author, sameAs) is injected via
 * `opts` — nothing is read from disk or the environment here.
 */
import { postPublishedAt, postLastModified, postKeywords } from '../../src/utils/seoValues.js';
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
  const published = postPublishedAt(post.date);
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
      ...(published ? { datePublished: published, dateModified: postPublishedAt(postLastModified(post)) } : {}),
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
 * JSON-LD for the homepage only: the WebSite, the Person it is about and the
 * ProfilePage describing them. Other pages reference the Person by `@id`
 * instead of repeating a ProfilePage that would claim to be the homepage.
 * @param {SeoIdentity & { profile: typeof import('../../src/constants/profile.js').PROFILE }} identity
 * @returns {object}
 */
export const homeJsonLd = ({ site, authorName, authorSameAs, profile }) => {
  const home = absoluteUrl(HOME_PATH, site);
  const photo = `${site}${profile.photo}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId(site),
        name: authorName,
        url: home,
        inLanguage: 'en',
        publisher: { '@id': personId(site) },
      },
      {
        '@type': 'Person',
        '@id': personId(site),
        name: authorName,
        url: home,
        image: photo,
        jobTitle: profile.role,
        description: `${profile.headline}; ${profile.role} at ${profile.employer.name}. ${profile.summary}`,
        worksFor: { '@type': 'Organization', name: profile.employer.name, url: profile.employer.url },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: profile.education.school,
          url: profile.education.schoolUrl,
        },
        knowsAbout: profile.knowsAbout,
        knowsLanguage: profile.languages,
        sameAs: authorSameAs,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${home}#webpage`,
        url: home,
        name: authorName,
        inLanguage: 'en',
        isPartOf: { '@id': websiteId(site) },
        about: { '@id': personId(site) },
        mainEntity: { '@id': personId(site) },
        primaryImageOfPage: { '@type': 'ImageObject', url: photo },
      },
    ],
  };
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
        ...(postPublishedAt(p.date)
          ? { datePublished: postPublishedAt(p.date), dateModified: postPublishedAt(postLastModified(p)) }
          : {}),
        ...(p.category ? { articleSection: p.category } : {}),
      })),
    },
    breadcrumbList([
      ['Home', absoluteUrl(HOME_PATH, site)],
      ['Blog', canonical],
    ]),
  ];
};
