/**
 * IndexNow (https://www.indexnow.org/documentation): tells Bing, Yandex,
 * Seznam, Naver and Yep which URLs changed in a deploy so they recrawl them
 * promptly. Bing's index also serves ChatGPT search, Copilot and DuckDuckGo;
 * Google does not take part. Pure functions; scripts/indexnow-plan.mjs does
 * the I/O and the deploy job submits the result.
 */

// Public by design: search engines prove ownership by fetching /<key>.txt,
// which public/ serves from the site root.
export const INDEXNOW_KEY = 'cb7efe94abc5118dde33ac4ec2ddc175';

/**
 * Every URL in a sitemap with its `<lastmod>` ('' when absent).
 * @param {string} xml
 * @returns {Map<string, string>}
 */
export const sitemapEntries = (xml) =>
  new Map(
    [...String(xml).matchAll(/<url>([\s\S]*?)<\/url>/g)]
      .map(([, block]) => [block.match(/<loc>([^<]+)<\/loc>/)?.[1].trim(), block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() ?? ''])
      .filter(([loc]) => loc),
  );

/**
 * URLs that are new or have a different `<lastmod>` in the next sitemap, plus
 * URLs it no longer lists (engines recrawl them and find them gone).
 * @param {string} liveXml The sitemap currently deployed
 * @param {string} nextXml The sitemap about to be deployed
 * @returns {string[]}
 */
export const changedUrls = (liveXml, nextXml) => {
  const live = sitemapEntries(liveXml);
  const next = sitemapEntries(nextXml);
  const changed = [...next].filter(([loc, lastmod]) => live.get(loc) !== lastmod).map(([loc]) => loc);
  const removed = [...live.keys()].filter((loc) => !next.has(loc));
  return [...changed, ...removed];
};

/**
 * The JSON body of a bulk IndexNow submission.
 * @param {string} site Origin, e.g. https://vanshul.com
 * @param {string[]} urls
 * @param {string} [key]
 */
export const indexNowPayload = (site, urls, key = INDEXNOW_KEY) => ({
  host: new URL(site).host,
  key,
  keyLocation: `${site}/${key}.txt`,
  urlList: urls,
});
