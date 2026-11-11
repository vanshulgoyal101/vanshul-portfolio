/**
 * Pure builder for the RSS 2.0 feed (no fs/env), unit-tested with fixtures;
 * scripts/generate-feed.mjs handles I/O.
 */
import { escapeXml, rfc822 } from './seo.mjs';
import { renderMarkdown } from './markdown.mjs';
import { BLOG_PATH, postPath, absoluteUrl } from '../../src/constants/routes.js';
import { postModifiedDate, postTimestamp } from '../../src/utils/seoValues.js';

// CDATA cannot contain "]]>"; split it across two sections.
const cdata = (text) => `<![CDATA[${String(text).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

/**
 * @param {Array<Record<string, unknown>>} posts  Parsed posts, newest first
 * @param {{ site: string, authorName: string, description: string }} options
 * @returns {string} RSS XML
 */
export const buildFeed = (posts, { site, authorName, description }) => {
  const items = posts
    .map((post) => {
      const url = absoluteUrl(postPath(post.slug), site);
      const pubDate = rfc822(post.date);
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        // Stable identifiers: the slash-less URL predates trailing-slash canonicals.
        `      <guid isPermaLink="false">${site}/blog/${escapeXml(post.slug)}</guid>`,
        pubDate && `      <pubDate>${pubDate}</pubDate>`,
        `      <dc:creator>${escapeXml(authorName)}</dc:creator>`,
        post.category && `      <category>${escapeXml(post.category)}</category>`,
        `      <description>${escapeXml(post.summary || '')}</description>`,
        `      <content:encoded>${cdata(renderMarkdown(post.body || '', { origin: site }))}</content:encoded>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const newestChange = posts.map(postModifiedDate).sort((a, b) => postTimestamp(b) - postTimestamp(a))[0];
  const lastBuild = newestChange ? rfc822(newestChange) : undefined;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(authorName)} — Blog</title>`,
    `    <link>${absoluteUrl(BLOG_PATH, site)}</link>`,
    `    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(description)}</description>`,
    '    <language>en</language>',
    lastBuild && `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter(Boolean)
    .join('\n') + '\n';
};
