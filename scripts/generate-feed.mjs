#!/usr/bin/env node
/**
 * Generates public/feed.xml (RSS 2.0 with full article HTML) from the blog
 * Markdown so readers and aggregators can subscribe. Runs in `prebuild`.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, AUTHOR_NAME } from '../src/constants/siteConfig.js';
import { readPosts, byDateDesc } from './lib/seo.mjs';
import { buildFeed } from './lib/feed.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const posts = readPosts(join(root, 'src', 'blogs')).sort(byDateDesc);

writeFileSync(join(root, 'public', 'feed.xml'), buildFeed(posts, {
  site: SITE_URL,
  authorName: AUTHOR_NAME,
  description: `Writing on AI, the future of work, technology and space by ${AUTHOR_NAME}.`,
}));
console.log(`Wrote public/feed.xml with ${posts.length} items.`);
