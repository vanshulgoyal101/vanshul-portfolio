# SEO & Discoverability

The portfolio combines a client-rendered React application with static readable
documents for every public route. Build-time content and metadata support
crawlers and JavaScript-disabled readers; runtime metadata follows navigation.
This improves technical discoverability, not guaranteed ranking. Relevance,
original content, reputable references, competition and search intent matter.

## URL and canonical policy

GitHub Pages serves each prerendered route from `<route>/index.html` and
answers the slash-less form with a permanent redirect. Measured on the live
site (November 2026):

```
https://vanshul.com/blog/the-new-leverage   301 -> https://vanshul.com/blog/the-new-leverage/
https://vanshul.com/blog                    301 -> https://vanshul.com/blog/
https://vanshul.com/reading-list            301 -> https://vanshul.com/reading-list/
```

Earlier builds declared the slash-less URLs as canonical and listed them in the
sitemap, so every advertised URL redirected to a page that pointed back at the
redirecting URL. Every public URL now uses its final, non-redirecting form:

| Page | Canonical URL |
| --- | --- |
| Home | `https://vanshul.com/` |
| Writing archive | `https://vanshul.com/blog/` |
| Article | `https://vanshul.com/blog/<slug>/` |
| Reading list | `https://vanshul.com/reading-list/` |

[`src/constants/routes.js`](../src/constants/routes.js) is the single source
for these paths (`BLOG_PATH`, `READING_LIST_PATH`, `postPath(slug)`,
`homeSectionPath(id)`, `absoluteUrl(path)`). The application links, `useSeo`
canonicals, prerendered shells, sitemap, feed links, JSON-LD and the build
verifier all use it. `npm run verify:build` fails if a sitemap URL does not end
in `/`, if a page's canonical differs from its sitemap URL, or if fallback
content links to anything other than an exact published URL.

React Router matches both forms, so old slash-less links keep working in the
application, and `/blogs` and `/blogs/<slug>` aliases redirect to the canonical
paths. RSS `<guid>` values intentionally keep the original slash-less strings
(marked `isPermaLink="false"`) so feed readers do not show existing posts as new.

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
"prebuild":  "generate-sitemap.mjs && generate-og-images.mjs && generate-feed.mjs && generate-llms.mjs",
"build":     "vite build",
"postbuild": "prerender-blog.mjs && gen-sitemap-index.mjs"
```

| Script | Output | Purpose |
| --- | --- | --- |
| `scripts/generate-sitemap.mjs` | `public/sitemap.xml` | Lists home, blog, shelf and every post; article dates supply `lastmod`. |
| `scripts/generate-og-images.mjs` | `public/og/<slug>.png` | Per-post Open Graph images (rendered with `sharp`; needs Node ≥ 20.9). |
| `scripts/generate-feed.mjs` | `public/feed.xml` | Full-content RSS 2.0 feed (`content:encoded` article HTML, `dc:creator`, canonical links, stable GUIDs), built by `scripts/lib/feed.mjs` and linked from `index.html` via `<link rel="alternate" type="application/rss+xml">`. |
| `scripts/generate-llms.mjs` | `public/llms.txt` | Curated Markdown map of the site for AI assistants (see [llms.txt](#llmstxt)). |
| `scripts/prerender-blog.mjs` | Home, blog index, article and shelf HTML | Readable static content, metadata and JSON-LD from the existing Markdown and constants. |
| `scripts/gen-sitemap-index.mjs` | `dist/sitemap-index.xml` | Master sitemap index referencing every sitemap in the vanshul.com family (edit `sitemap-sites.json`). Runs in `postbuild`; XML shape in `scripts/lib/sitemapIndex.mjs` (unit-tested). Submit this one URL to Search Console. |

`scripts/generate-icons.mjs` regenerates the favicon/app-icon PNG set
(`panda-32.png`, `panda-apple-touch.png`, `panda-192.png`, `panda-512.png`)
from `public/panda.svg`.

The frontmatter parser, XML escaping and post-reading logic shared by the feed,
OG-image and prerender scripts live once in **`scripts/lib/seo.mjs`** (unit-tested
in `scripts/lib/seo.test.js`), so the three generators can't drift apart.

## llms.txt

`https://vanshul.com/llms.txt` follows the [llms.txt proposal](https://llmstxt.org/):
a short, curated Markdown map that gives AI assistants and answer engines
accurate facts and canonical links without crawling the whole site.

- **Contents**: the author name (H1), the homepage description (blockquote),
  one paragraph of profile facts (role, employer, location, education,
  topics), then link lists: `## Writing` (every post, newest first, with its
  `summary`), `## Projects`, `## Pages` (home, archive, reading list, RSS feed,
  sitemap) and `## Elsewhere` (social profiles).
- **Data sources**: the same posts as the feed (`readPosts`, sorted with
  `byDateDesc`; there are no drafts, every Markdown file in `src/blogs` is
  published) and the modules the site renders: `AUTHOR_NAME`,
  `HOME_DESCRIPTION` and `SOCIAL_PROFILES` (`siteConfig.js`), `PROFILE`,
  `FEATURED_PROJECTS` and `PROJECT_DIRECTORY`, plus the archive and shelf meta
  descriptions. URLs come from `routes.js`. Projects link only to URLs in the
  data (live site first, else the repository), or to the homepage `#projects`
  section when they have none.
- **Generator**: `scripts/generate-llms.mjs` writes the gitignored
  `public/llms.txt` during `prebuild`, and Vite copies it into `dist/`. The
  pure builder `buildLlmsTxt` (`scripts/lib/llms.mjs`, tested in
  `llms.test.js`) keeps authored text on one line, escapes `[`, `]` and `\` in
  link text and adds no timestamps, so the same content always yields the
  same file.
- **Verification**: `npm run verify:build` fails unless `dist/llms.txt` exists,
  starts with an H1 and links the archive and every published article by its
  canonical URL.

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
- The homepage graph (`homeJsonLd`) contains the `WebSite`, the `Person` and the
  `ProfilePage` whose `mainEntity` is that person. It is emitted **only on the
  homepage**: the prerender step injects it into `dist/index.html`, and
  `HomeMetadata` in `App.jsx` adds it at runtime. `index.html` itself carries no
  JSON-LD because every other shell is built from it; earlier builds leaked the
  homepage `ProfilePage` onto every article, the archive and the shelf.
  `src/seo.test.js` keeps the template clean and `verify:build` fails if a
  `ProfilePage` appears on any page other than `/`.
- `Person` facts come from [`src/constants/profile.js`](../src/constants/profile.js),
  the same module the hero and About section render: `jobTitle`
  (Associate Analyst), `worksFor` (United Airlines), `alumniOf` (Punjab
  Engineering College), the About photo as `image`, `knowsAbout` and the
  `sameAs` profiles. Entity IDs connect the profile, site and articles without
  inventing qualifications, reviews, awards or organizations.

## Readable HTML and input validation

`scripts/lib/prerenderContent.mjs` renders Markdown with the installed
`react-markdown` library, the same safe renderer used by the application. Raw HTML
is not enabled and unsafe link protocols are rejected. The article, shelf,
index and basic homepage content sit inside `#root`; `createRoot` replaces them
when the application starts. This is progressive fallback content, not React
hydration or a second hidden copy of the page. Links in the fallback content
use the same canonical trailing-slash URLs as the application.

The shared post reader normalizes CRLF, rejects missing titles, unsafe/duplicate
slugs and invalid dates. Slugs must be lowercase kebab-case, at most 120
characters. It fails publishing rather than silently omitting or overwriting
articles. Dates describe actual publication, not the time of each rebuild.

`npm run verify:build` checks all sitemap routes for readable content, one H1,
unique metadata, canonical/Open Graph/Twitter URL parity, valid JSON-LD, local
social images, and published internal links. Browser tests also navigate with
JavaScript disabled and check runtime metadata after direct subpage entry.

## Static SEO files

- **`public/robots.txt`** — allows crawling and points at `sitemap.xml` and
  `sitemap-index.xml`. On the live site Cloudflare prepends its managed
  AI-crawler rules (see [deployment.md](deployment.md#dns-and-cloudflare)).
- **Unknown routes** render a real `NotFound` page (`src/pages/NotFound.jsx`) that
  sets `robots: noindex, follow` via `useSeo` and offers recovery links, so soft-404s
  aren't indexed. The private `/dashboard` is likewise `noindex, nofollow`, unlinked
  and absent from the sitemap.
- **`public/404.html`** — SPA fallback so deep links resolve on GitHub Pages
  (see [deployment.md](deployment.md)).
- **`index.html`** — base meta plus the RSS `<link rel="alternate">`; no
  structured data (see above).

## Internal linking

Article sections have stable ids and long posts list them in an "On this
page" navigation ("Contents" in the static HTML), so sections can be
deep-linked (`/blog/<slug>/#<section>`) from
search results, shares and other posts. `verify:build` fails on any in-page
link without a matching id.


Each blog post ends with a **related-posts** section (`getRelatedPosts` in
`src/utils/blogUtils.js`): same-category posts first (newest first), then the most
recent remaining posts fill any gap, excluding the current post. Beyond the UX
value, this adds crawlable internal links between articles, which helps search
engines discover and relate the content.

## Blog frontmatter

Posts live in `src/blogs/*.md`. The SEO output is derived from their frontmatter
(`title`, `slug`, `summary`, `date`, `readTime`, `category`, optional `tags`) — see
[data.md](data.md) for the full schema and how loading/parsing works.

## Keeping it in sync

When you change blog post shape or add SEO fields, update **both** the runtime
path (`useSeo`, `BlogPost.jsx`) **and** the build path (`prerender-blog.mjs`,
`generate-*.mjs`). Validate with a full `npm run build` and check a generated
`dist/blog/<slug>/index.html` plus `dist/sitemap.xml`, `dist/feed.xml` and
`dist/llms.txt`.

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
