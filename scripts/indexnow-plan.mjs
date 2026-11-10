#!/usr/bin/env node
/**
 * Runs in CI after `npm run build`, while the previous deploy is still live. It
 * compares dist/sitemap.xml with the live sitemap and writes the IndexNow
 * payload for the URLs that changed to the step output `payload`: empty when
 * nothing changed or the live sitemap can't be read. The deploy job submits it
 * once the new build is live (see .github/workflows/deploy.yml).
 */
import { appendFileSync, readFileSync } from 'node:fs';
import { SITE_URL } from '../src/constants/siteConfig.js';
import { changedUrls, indexNowPayload, sitemapEntries } from './lib/indexnow.mjs';

const next = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
let live = '';
try {
  const response = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(10000) });
  if (response.ok) live = await response.text();
  else console.warn(`The live sitemap answered HTTP ${response.status}.`);
} catch (error) {
  console.warn(`Could not read the live sitemap: ${error.message}`);
}

// Without a readable live sitemap every URL would look new; submit nothing.
const urls = sitemapEntries(live).size > 0 ? changedUrls(live, next) : [];
const payload = urls.length > 0 ? JSON.stringify(indexNowPayload(SITE_URL, urls)) : '';
console.log(urls.length > 0 ? `IndexNow: ${urls.length} changed URL(s):\n${urls.join('\n')}` : 'IndexNow: nothing to submit.');
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `payload=${payload}\n`);
