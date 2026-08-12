#!/usr/bin/env node
// gen-sitemap-index.mjs — writes dist/sitemap-index.xml, a master index that
// references every sitemap in the vanshul.com family. Submit THIS file to
// Google Search Console once (https://vanshul.com/sitemap-index.xml) and Google
// discovers all the individual site sitemaps from it. Edit sitemap-sites.json
// to add or remove sites. The XML shape lives in lib/sitemapIndex.mjs (pure +
// unit-tested); this file just does I/O.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSitemapIndex } from './lib/sitemapIndex.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sites = JSON.parse(readFileSync(join(root, 'sitemap-sites.json'), 'utf8'));
const xml = buildSitemapIndex(sites, { today: new Date().toISOString().slice(0, 10) });

const distDir = join(root, 'dist');
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
writeFileSync(join(distDir, 'sitemap-index.xml'), xml);
console.log(`\u2713 wrote dist/sitemap-index.xml with ${sites.length} sitemaps`);
