#!/usr/bin/env node
/**
 * Generates public/llms.txt (https://llmstxt.org/), a curated map of the site
 * for AI assistants and answer engines, from the same posts and data modules
 * the site renders. Runs in `prebuild`.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, AUTHOR_NAME, HOME_DESCRIPTION, SOCIAL_PROFILES } from '../src/constants/siteConfig.js';
import { PROFILE } from '../src/constants/profile.js';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY } from '../src/constants/projects.js';
import { readPosts } from './lib/seo.mjs';
import { buildLlmsTxt } from './lib/llms.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const posts = readPosts(join(root, 'src', 'blogs'));

writeFileSync(join(root, 'public', 'llms.txt'), buildLlmsTxt(posts, {
  site: SITE_URL,
  authorName: AUTHOR_NAME,
  description: HOME_DESCRIPTION,
  profile: PROFILE,
  featuredProjects: FEATURED_PROJECTS,
  projectDirectory: PROJECT_DIRECTORY,
  socialProfiles: SOCIAL_PROFILES,
}));
console.log(`Wrote public/llms.txt with ${posts.length} posts.`);
