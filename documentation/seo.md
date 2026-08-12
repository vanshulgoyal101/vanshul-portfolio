# SEO & Discoverability

The portfolio is a client-rendered React SPA, so ranking and rich social
previews rely on a mix of **runtime meta** (set as you navigate) and
**build-time generation** (static files + pre-rendered blog shells) so crawlers
that don't execute JavaScript still get real content.

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
"postbuild": "prerender-blog.mjs"
```

| Script | Output | Purpose |
| --- | --- | --- |
| `scripts/generate-sitemap.mjs` | `public/sitemap.xml` | Lists the homepage and every blog post with `lastmod`. |
| `scripts/generate-og-images.mjs` | `public/og/<slug>.png` | Per-post Open Graph images (rendered with `sharp`; needs Node ≥ 20.9). |
| `scripts/generate-feed.mjs` | `public/feed.xml` | RSS 2.0 feed of blog posts, linked from `index.html` via `<link rel="alternate" type="application/rss+xml">`. |
| `scripts/prerender-blog.mjs` | `dist/blog/<slug>/index.html` | Static, crawlable shells per post: full meta + JSON-LD injected into the built template. |
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
- The JSON-LD is produced in **two places that must stay in sync**: at runtime in
  `BlogPost.jsx` (a `useMemo`) and at build time in `prerender-blog.mjs` for the
  static shell.

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
