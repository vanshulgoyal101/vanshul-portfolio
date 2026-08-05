#!/usr/bin/env node
// gen-sitemap-index.mjs — writes dist/sitemap-index.xml, a master index that
// references every sitemap in the vanshul.com family. Submit THIS file to
// Google Search Console once (https://vanshul.com/sitemap-index.xml) and Google
// discovers all the individual site sitemaps from it. Edit sitemap-sites.json
// to add or remove sites.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const sites = JSON.parse(readFileSync('sitemap-sites.json', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sites.map((loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>
`;
if (!existsSync('dist')) mkdirSync('dist', { recursive: true });
writeFileSync('dist/sitemap-index.xml', xml);
console.log(`\u2713 wrote dist/sitemap-index.xml with ${sites.length} sitemaps`);
