# SEO & Discoverability

The portfolio combines a client-rendered React application with static readable
documents for every public route. Build-time content and metadata support
crawlers and JavaScript-disabled readers; runtime metadata follows navigation.
This improves technical discoverability, not guaranteed ranking. Relevance,
original content, reputable references, competition and search intent matter.

## Runtime: the `useSeo` hook

`src/hooks/useSeo.js` imperatively manages `<head>` for the current route:
`<title>`, `<meta name="description">`, canonical, Open Graph, and Twitter card
tags. Passing the `article` option also emits `article:*` Open Graph tags
(`published_time`, `modified_time`, `author`, `section`) for blog posts. This
keeps meta correct as the user moves between sections and posts without a reload.

## Build-time generation

The build pipeline (see [config.md](config.md) and [deployment.md](deployment.md))
runs SEO generators around the Vite build:

```jsonc
// package.json
"prebuild":  "generate-sitemap.mjs && generate-og-images.mjs && generate-feed.mjs",
"build":     "vite build",
"postbuild": "prerender-blog.mjs && gen-sitemap-index.mjs"
```

| Script | Output | Purpose |
| --- | --- | --- |
| `scripts/generate-sitemap.mjs` | `public/sitemap.xml` | Lists home, blog, shelf and every post; article dates supply `lastmod`. |
| `scripts/generate-og-images.mjs` | `public/og/<slug>.png` | Per-post Open Graph images (rendered with `sharp`; needs Node ≥ 20.9). |
| `scripts/generate-feed.mjs` | `public/feed.xml` | RSS 2.0 feed of blog posts, linked from `index.html` via `<link rel="alternate" type="application/rss+xml">`. |
| `scripts/prerender-blog.mjs` | Home, blog index, article and shelf HTML | Readable static content, metadata and JSON-LD from the existing Markdown and constants. |
| `scripts/gen-sitemap-index.mjs` | `dist/sitemap-index.xml` | Master sitemap index referencing every sitemap in the vanshul.com family (edit `sitemap-sites.json`). Runs in `postbuild`; XML shape in `scripts/lib/sitemapIndex.mjs` (unit-tested). Submit this one URL to Search Console. |

`scripts/generate-icons.mjs` regenerates the favicon/app-icon PNG set from
`public/favicon.svg`.

The frontmatter parser, XML escaping and post-reading logic shared by the feed,
OG-image and prerender scripts live once in **`scripts/lib/seo.mjs`** (unit-tested
in `scripts/lib/seo.test.js`), so the three generators can't drift apart.

## Structured data (JSON-LD)

- **Blog posts** emit a `BlogPosting` plus a `BreadcrumbList`. The `BlogPosting`
  includes `datePublished`/`dateModified`, `inLanguage`, `wordCount`,
  `timeRequired` (`PT{min}M` from the post's read time), the author with `sameAs`
  social links, and a publisher image.
- Article JSON-LD uses the same `postJsonLd` builder in
  `scripts/lib/structuredData.mjs` at runtime and build time. It imports only
  browser-safe value helpers from `src/utils/seoValues.js`. The shelf likewise
  shares `src/constants/readingListSeo.js`. Tests compare actual runtime output
  with the shared article builder.
- The homepage ProfilePage identifies the author Person as `mainEntity`; entity
  IDs connect the profile, site and articles without inventing qualifications,
  reviews, awards or organizations.

## Readable HTML and input validation

`scripts/lib/prerenderContent.mjs` renders Markdown with the installed
`react-markdown` library, the same safe renderer used by the application. Raw HTML
is not enabled and unsafe link protocols are rejected. The article, shelf,
index and basic homepage content sit inside `#root`; `createRoot` replaces them
when the application starts. This is progressive fallback content, not React
hydration or a second hidden copy of the page. No-JavaScript navigation uses
directory URLs ending in `/` to reach actual files on static hosts. Canonicals
retain the existing public non-trailing-slash convention.

The shared post reader normalizes CRLF, rejects missing titles, unsafe/duplicate
slugs and invalid dates. Slugs must be lowercase kebab-case, at most 120
characters. It fails publishing rather than silently omitting or overwriting
articles. Dates describe actual publication, not the time of each rebuild.

`npm run verify:build` checks all sitemap routes for readable content, one H1,
unique metadata, canonical/Open Graph/Twitter URL parity, valid JSON-LD, local
social images, and published internal links. Browser tests also navigate with
JavaScript disabled and check runtime metadata after direct subpage entry.

## Static SEO files

- **`public/robots.txt`** — allows crawling and points at `sitemap.xml`.
- **Unknown routes** render a real `NotFound` page (`src/pages/NotFound.jsx`) that
  sets `robots: noindex, follow` via `useSeo` and offers recovery links, so soft-404s
  aren't indexed. The private `/dashboard` is likewise `noindex, nofollow`, unlinked
  and absent from the sitemap.
- **`public/404.html`** — SPA fallback so deep links resolve on GitHub Pages
  (see [deployment.md](deployment.md)).
- **`index.html`** — base meta plus the RSS `<link rel="alternate">`.

## Internal linking

Each blog post ends with a **related-posts** section (`getRelatedPosts` in
`src/utils/blogUtils.js`): same-category posts first (newest first), then the most
recent remaining posts fill any gap, excluding the current post. Beyond the UX
value, this adds crawlable internal links between articles, which helps search
engines discover and relate the content.

## Blog frontmatter

Posts live in `src/blogs/*.md`. The SEO output is derived from their frontmatter
(`id`, `title`, `slug`, `summary`, `date`, `readTime`, `category`) — see
[data.md](data.md) for the full schema and how loading/parsing works.

## Keeping it in sync

When you change blog post shape or add SEO fields, update **both** the runtime
path (`useSeo`, `BlogPost.jsx`) **and** the build path (`prerender-blog.mjs`,
`generate-*.mjs`). Validate with a full `npm run build` and check a generated
`dist/blog/<slug>/index.html` plus `dist/sitemap.xml` and `dist/feed.xml`.

## Owner operations and limitations

1. Confirm the production domain property in Search Console and submit
  `https://vanshul.com/sitemap-index.xml`. Verify ownership of cross-property
  sitemap destinations before relying on that index.
2. Inspect the homepage and representative article URLs; compare the crawled
  canonical with the declared canonical and request indexing only as needed.
3. Validate representative article/profile structured data in Google's Rich
  Results Test. Valid markup does not guarantee a rich result.
4. Track indexing, relevant queries, click-through rate and real-user Core Web
  Vitals. Local tests cannot establish field performance or ranking gains.
5. Publish accurate, substantive work and keep supporting links current. Do not
  add keyword-stuffed copy, fake FAQs/reviews, or fabricated expertise.

GitHub Pages cannot set per-route server headers/statuses like an application
server. Unknown routes use the existing 404 SPA fallback; private and missing
React pages set noindex. Stronger HTTP-level policy requires hosting/CDN support.
No Search Console changes or indexing claims are implied by the repository tests.
