# Data — Content Modules and the Blog System

All site content is version-controlled. Portfolio facts live in plain
JavaScript data modules and blog posts are Markdown files; there is no CMS.
Both are bundled at build time and read by the build scripts directly.

## Portfolio content modules

Content is plain data with no JSX, so the React components and the build-time
prerender ([`scripts/lib/prerenderContent.mjs`](../scripts/lib/prerenderContent.mjs))
render the same facts. Icons are referenced by string keys that each component
maps to an icon component.

| Module | Exports | Rendered by |
| --- | --- | --- |
| [`constants/siteConfig.js`](../src/constants/siteConfig.js) | `SITE_URL`, `AUTHOR_NAME`, `HOME_DESCRIPTION`, `DEFAULT_OG_IMAGE`, `SOCIAL_LINKS`, `AUTHOR_SAME_AS`, `SOCIAL_PROFILES` | Hero, Contact, footer, dashboard footer, SEO and build scripts |
| [`constants/profile.js`](../src/constants/profile.js) | `PROFILE` (headline, role, employer, education, summary, location, languages, photo, `photoAlt`, `avatar`, `knowsAbout`), `HIGHLIGHTS`, `SKILL_GROUPS` | Hero, About, Contact, article byline and author card, homepage JSON-LD |
| [`constants/projects.js`](../src/constants/projects.js) | `FEATURED_PROJECTS`, `CASE_STUDY_FIELDS`, `PROJECT_DIRECTORY` | Projects, project pages |
| [`constants/projectStories.js`](../src/constants/projectStories.js) | `PROJECT_STORIES` (per featured `id`: `seoTitle`, meta `description`, one-paragraph `summary`, extra `facts`, story `sections` of `{ heading, paragraphs }`, optional public `repo`, `linkLabel`, schema.org `about`), `getProjectPage(id)` (the project merged with its story, `path` and `pageTitle`, or `null`), `PROJECT_PAGES` | Project pages, their prerendered shells, sitemap, llms.txt (imported only by the lazy page and the build scripts, so the homepage bundle never carries it) |
| [`constants/experience.js`](../src/constants/experience.js) | `EXPERIENCE` (full cards, newest first; the first entry is the current role), `EARLIER_EXPERIENCE` (shorter earlier roles for the compact list, newest first by start date) | Work, About |
| [`constants/books.js`](../src/constants/books.js) | `BOOKS`, `ESSAYS`, `SHELF_ITEMS` (books then essays) | Reading list, shelf card |
| [`constants/readingListSeo.js`](../src/constants/readingListSeo.js) | `READING_LIST_DESCRIPTION`, `READING_LIST_JSON_LD` (an `ItemList` of `SHELF_ITEMS` plus a `BreadcrumbList`) | Reading list page metadata and its prerendered shell (`verify:build` checks that shell's `ItemList` against `books.js`) |
| [`constants/blogConstants.js`](../src/constants/blogConstants.js) | `BLOG_CONTENT`, `BLOG_INDEX_DESCRIPTION` | Blog preview, archive |
| [`constants/routes.js`](../src/constants/routes.js) | `HOME_PATH`, `BLOG_PATH`, `READING_LIST_PATH`, `postPath`, `projectPath`, `homeSectionPath`, `absoluteUrl` | Links, canonicals, sitemap, feed |

`prerenderContent.mjs` also renders the site, profile, project, experience,
shelf and blog-copy modules into the static fallback HTML. The motion presets
in `constants/motionVariants.js` are covered in [styles.md](styles.md#motion).

Rules:

- Only publish facts that are true and visible on the site; structured data is
  generated from these modules, so an inaccurate entry becomes an inaccurate
  claim to search engines.
- `scripts/lib/prerenderContent.test.js` fails if a featured project
  (title, description, outcome, link), directory entry, job, earlier role, highlight, skill,
  the school, the summary or a social profile is missing from the static
  homepage HTML. `npm run verify:build` re-checks the built homepage for every
  featured project, directory entry and job title, and every earlier role's title
  and company.
- Editing a module updates the UI, the fallback HTML and the structured data
  together; no other file needs to change unless a new icon key is introduced
  (add it to the component's `ICONS` map).
- A new featured project also needs an entry in `PROJECT_STORIES`:
  `npm test` (`projectStories.test.js`) and `npm run verify:build` fail until
  every featured project has a story page. Story copy uses only facts from the
  owner's notes, credits team work to the team and keeps stated limits (the
  HERC rover's result was partial). Nothing private: no AdBrain customers,
  prospects, internal metrics or finances.

## The blog

### Location & naming

- Posts live in [`src/blogs/`](../src/blogs/), one `.md` file per post.
- **The filename (without `.md`) is the slug** and must equal the `slug`
  frontmatter field (a test enforces this — see
  [testing.md](testing.md)). Example: `the-new-leverage.md` → slug
  `the-new-leverage` → URL `/blog/the-new-leverage/`.

### Frontmatter schema

Each file begins with a YAML-style frontmatter block delimited by `---`:

```markdown
---
title: "The New Leverage"
slug: "the-new-leverage"
summary: "Work feels meaningful when we create value…"
date: "27 Aug, 2025"
readTime: "4 min read"
category: "Future of Work"
---

Body content in Markdown…
```

| Field      | Type   | Notes |
| ---------- | ------ | ----- |
| `title`    | string | Required. Display title. |
| `slug`     | string | Required. Must match the filename; lowercase kebab-case, at most 120 characters, unique. Drives the URL and is the post's identity. |
| `summary`  | string | Required. Card, archive and article dek; the meta description. |
| `date`     | string | Required. Publication date as `27 Aug, 2025` (also accepts `2025-08-27`, full month names and no comma). A calendar date in India Standard Time; see below. Displayed by `formatPostDate` as `27 Aug 2025` (`27 Aug` in the archive, under its year heading). |
| `readTime` | string | Required. e.g. `"4 min read"`. Displayed as-is; its number becomes the JSON-LD `timeRequired`. |
| `updated`  | string | Optional. The date of the last meaningful revision, in the same formats as `date`; it may not be earlier than `date`. Becomes the JSON-LD `dateModified`, `article:modified_time`, the post's sitemap `<lastmod>` (and the homepage and archive `<lastmod>` when it is the latest change) and an "Updated <date>" note in the byline. Without it, all of these use `date`. Leave it alone for typo fixes. |
| `category` | string | Optional. Article eyebrow, related-post grouping, archive row facts, feed `<category>`, `article:section`, JSON-LD `articleSection` and `keywords`, and the per-post social card label. |
| `tags`     | string | Optional comma-separated list (no post uses it yet). Added to the JSON-LD `keywords` after the category and emitted as `article:tag` meta tags, both in the prerendered article and by `useSeo` at runtime. |

The content tests (`src/blogs/blogContent.test.js`) require `title`, `slug`,
`summary`, `date` and `readTime` on every post. The build's post reader fails
on a missing title, an invalid or duplicate slug, an invalid date, or an
`updated` date that is invalid or earlier than `date`. Each frontmatter line is
split at its first colon, values stay strings and one pair of matching
surrounding quotes is removed; YAML features such as lists or multi-line values
are not supported (see [Loading & parsing](#loading--parsing)).

Publication dates are parsed by `parsePostDate` in
[`src/utils/seoValues.js`](../src/utils/seoValues.js), never by `new Date(string)`,
whose handling of non-ISO strings is engine-specific and whose result depends
on the machine's timezone. A post date means midnight in India Standard Time
(UTC+05:30, the zone the analytics dashboard also uses), so every build and
every reader sees the same values:

| Output | Helper | Example for `29 Jul, 2026` |
| --- | --- | --- |
| Sitemap `<lastmod>` | `postDate` | `2026-07-29` |
| JSON-LD `datePublished`, `article:published_time` | `postPublishedAt` | `2026-07-29T00:00:00+05:30` |
| JSON-LD `dateModified`, `article:modified_time`, sitemap `<lastmod>` | `postLastModified` (the `updated` date, else `date`) with the helpers above | `2026-07-29T00:00:00+05:30` until an update is declared |
| RSS `<pubDate>` | `rfc822` (build) | `Tue, 28 Jul 2026 18:30:00 GMT` |
| Sorting (app and build) | `compareNewestFirst` | newest first; undated posts last |

The build fails on an impossible date such as `31 Feb, 2026`.

### Section headings and the table of contents

Use `##` for an article's sections (and `###` for subsections). The content
tests reject a heading that skips a level (the post title is the page `h1`).
Each `h2`/`h3` gets an id derived from its text by `headingSlug` in
[`src/utils/articleHeadings.js`](../src/utils/articleHeadings.js) — lowercase,
accents and punctuation removed, words joined by hyphens, with `-1`, `-2`
suffixes for repeats. For example `## The counter-force` becomes
`/blog/will-money-become-obsolete/#the-counter-force`.

- The same rehype plugin (`rehypeHeadingIds`) runs in the app and in the build
  renderer, so prerendered and React ids are identical (a test checks every
  published post).
- Posts with at least `MIN_TOC_HEADINGS` (3) `h2`/`h3` headings show a
  contents list linking to each one: "On this page" in the app, "Contents" in
  the static HTML (both are a `nav` labelled "Table of contents").
- Renaming a heading changes its anchor and breaks existing deep links to that
  section.

### Loading & parsing

Listings and articles load posts differently, so that the homepage doesn't
carry every article:

- [`src/utils/blogLoader.js`](../src/utils/blogLoader.js): `loadBlogPosts()`
  returns each post's frontmatter plus `filename` and `wordCount`, with no
  body. It reads `virtual:blog-index`, which
  [`scripts/lib/blogIndexPlugin.mjs`](../scripts/lib/blogIndexPlugin.mjs)
  builds at build (and dev) time from `readPosts`, so an invalid post fails
  there too. The homepage, the archive and view counts use it.
- [`src/utils/blogPostLoader.js`](../src/utils/blogPostLoader.js):
  `import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default', eager: true })`
  inlines every post's raw markdown; `loadFullBlogPosts()` returns
  `{ ...frontmatter, content, filename }` (parsed once, cached) and
  `loadBlogBySlug(slug)` one post or `null`. Only the lazy article page
  imports it. Before this split, six more posts pushed the homepage past the
  first-load budget; the split cut it from 217.8 KB to 191.4 KB.
- `parseFrontmatter(markdown)` from
  [`src/utils/frontmatter.js`](../src/utils/frontmatter.js) returns
  `{ data, content }`: it splits each frontmatter line on its first colon,
  keeps every value a string and removes one pair of matching surrounding
  quotes. **No `gray-matter` dependency is used.** The build scripts read posts
  through the same function (`readPosts` in `scripts/lib/seo.mjs`), so the
  prerendered metadata and the app always agree; they used to have separate
  parsers that disagreed on quotes and numbers.

[`src/utils/blogUtils.js`](../src/utils/blogUtils.js):

- `sortBlogsByDate(posts)` returns a new array sorted newest-first (does not
  mutate its input; returns `[]` for non-array input).
- `getRelatedPosts(posts, current, limit = 3)` returns same-category posts
  first, then the newest others, never the current post ("More writings").
- `formatPostDate(value, { year = true })` formats a frontmatter date as
  `29 Jul 2026` (or `29 Jul`); unparseable values are returned unchanged.
- `groupPostsByYear(posts)` splits newest-first posts into
  `{ year, posts }` groups for the archive (`Undated` for posts without a
  valid date).

### Rendering

- The **Blog section** ([`components/Blog/Blog.jsx`](../src/components/Blog/Blog.jsx))
  loads posts with `useMemo`, sorts them, and renders the three newest as
  `BlogCard`s plus a link to the full archive (or an empty state).
- `BlogCard` links to the canonical `/blog/<slug>/` URL.
- The archive ([`pages/BlogIndex.jsx`](../src/pages/BlogIndex.jsx)) groups
  the sorted posts by year and lists them with `PostList`.
- The full post renders in [`pages/BlogPost.jsx`](../src/pages/BlogPost.jsx) using
  `react-markdown` with the `rehypeHeadingIds` plugin. Raw HTML in a post is
  not rendered. Links are sorted by `classifyLink` in
  [`src/utils/links.js`](../src/utils/links.js): links to this site
  (root-relative, or absolute `vanshul.com`/`www.vanshul.com` URLs) route
  inside the app with React Router and stay in the same tab, so cross-linking
  posts is cheap for readers; other web links open in a new tab with
  `rel="noopener noreferrer"`; `#anchors`, `mailto:`, `tel:` and relative
  paths are plain links. The prerendered HTML and the feed keep plain links.

### Adding a post

1. Create `src/blogs/<slug>.md`.
2. Add the required frontmatter (`title`, `slug` equal to `<slug>`, `summary`,
   `date`, `readTime`) and, optionally, `category` and `tags`.
3. Write the body in Markdown, starting section headings at `##`.

That's it — the glob import picks it up automatically on the next build/dev
reload. Run `npm test` to confirm the content-integrity checks still pass.

### Updating a post

For a meaningful revision (new sections, corrected facts, a changed argument),
add or bump `updated` to the revision date and keep `date` unchanged, so the
URL, the publication date and the RSS `pubDate` stay stable while search
engines see the change through `dateModified` and `<lastmod>`. Typo and
formatting fixes don't need it; an accurate modified date only means something
if it isn't bumped for trivial edits.

### View counts (Supabase)

Blog view counts are stored in [Supabase](https://supabase.com). The feature is
**optional and fully self-disabling**: if the env vars below are absent,
`getSupabase()` resolves to `null`, every counter call becomes a no-op, and no
counts are shown — the site builds and runs exactly as before.

#### Client code

- [`src/lib/supabaseClient.js`](../src/lib/supabaseClient.js) — `getSupabase()`:
  - imports `@supabase/supabase-js` dynamically on first use and creates one
    shared client from the env vars, so the library (about 57 KB gzipped) never
    sits in the entry bundle
  - the client keeps no auth session (`persistSession`, `autoRefreshToken`
    and `detectSessionInUrl` are off): view counts are anonymous reads and RPC
    calls
  - resolves to `null` when unconfigured (`isSupabaseConfigured` is `false`);
    a failed chunk download is retried on the next call
  - `blogViews.js` turns a failed download into "no counts", like a failed
    request
- [`src/utils/blogViews.js`](../src/utils/blogViews.js):
  - `getAllBlogViews(slugs)` reads counts **only for the given slugs**. The
    increment RPC accepts any well-formed slug, so the table can contain rows
    that are not posts; an unbounded `select` could let such rows crowd real
    posts out of PostgREST's row limit.
  - `recordBlogView(slug)` counts a post **at most once per browser session**
    (tracked in `sessionStorage` under `vg.viewedPosts`) and otherwise reads the
    current count with `getBlogView(slug)`. The slug is marked before the
    request so overlapping calls (React StrictMode) cannot double count, and a
    failed increment is unmarked so a later visit can count it. Without
    `sessionStorage` (some privacy modes) every visit counts.
  - `incrementBlogView(slug)` calls the RPC; `formatViews(n)` formats counts
    (`1.2k`).
- [`src/hooks/useBlogViews.js`](../src/hooks/useBlogViews.js) — `useBlogViews()`
  returns a `{ slug: views }` map for the published posts; `useBlogView(slug)`
  records the article view and returns the current count.

The homepage preview passes each count to `BlogCard` and the archive passes
the map to `PostList`; `BlogPost.jsx` shows the count in the article byline.
"More writings" lists show no counts. Counts are popularity
signals for display, not unique-reader measurements: the endpoint is anonymous
and can be called directly.

#### Environment variables

Copy `.env.example` to `.env` for local development and uncomment the values you
use. Production builds read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
from GitHub Actions secrets (see `.github/workflows/deploy.yml`).

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your-key
```

The anon key is a **public** key — safe to ship in the bundle. Security is
enforced by Row Level Security and grants in the database, not by hiding the key.
The build rejects a secret or service-role key, a non-`https` URL and other
malformed values (see [config.md](config.md#environment-variables)).

#### Database schema

[`scripts/schema.sql`](../scripts/schema.sql) is the single source of truth (do
not copy SQL from elsewhere). It is idempotent; apply it with verified TLS:

```bash
node --env-file=.env scripts/db.mjs scripts/schema.sql
```

It creates `public.blog_views (slug, views)` with Row Level Security, revokes
all table privileges from `public`, `anon` and `authenticated`, grants read-only
`select`, and exposes writes only through the `security definer` function
`increment_blog_view(post_slug)`, which rejects slugs that are not lowercase
kebab-case or longer than 120 characters and runs with a fixed `search_path`.
`scripts/database.test.js` executes the schema in an isolated PGlite database
and checks these grants, the validation and idempotent re-application.

#### Database runner

[`scripts/db.mjs`](../scripts/db.mjs) runs SQL against the Postgres database
with `pg`; it never prints the credentials:

```bash
node --env-file=.env scripts/db.mjs path/to/file.sql
node --env-file=.env scripts/db.mjs -e "select * from blog_views;"
echo "select 1;" | node --env-file=.env scripts/db.mjs
```

- Credentials come from `.env`: either `SUPABASE_DB_URL` (a `postgres://` or
  `postgresql://` URL) or the libpq variables `PGHOST`, `PGPORT`, `PGUSER`,
  `PGPASSWORD` and `PGDATABASE` (`PGHOST` and `PGPASSWORD` must be set).
- [`scripts/lib/databaseConfig.mjs`](../scripts/lib/databaseConfig.mjs)
  builds the connection settings. TLS certificate verification is always on
  and the connection attempt times out after 10 seconds. `PGSSLMODE` and any
  URL `sslmode` must be `verify-full`; URL `ssl`, `sslcert` and `sslkey`
  parameters are rejected. A trusted CA file can be supplied with
  `PGSSLROOTCERT` or a URL `sslrootcert`.
- Command tags and row counts go to stderr and result rows to stdout as JSON.
  A database error sets a non-zero exit code.

Residual risk: an anonymous caller can still create rows for slugs that are not
posts. The bounded client query makes such rows invisible on the site. A
database-side allowlist of published slugs would close this, but it would need
a sync step after every publish (forgetting it would silently stop counting a
new post), so it is listed as a proposal in [FEATURES.md](../FEATURES.md).
