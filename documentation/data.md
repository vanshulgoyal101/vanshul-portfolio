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
| [`constants/siteConfig.js`](../src/constants/siteConfig.js) | `SITE_URL`, `AUTHOR_NAME`, `HOME_DESCRIPTION`, `DEFAULT_OG_IMAGE`, `SOCIAL_LINKS`, `AUTHOR_SAME_AS`, `SOCIAL_PROFILES` | Hero, Contact, footer, SEO and build scripts |
| [`constants/profile.js`](../src/constants/profile.js) | `PROFILE` (headline, role, employer, education, summary, location, languages, photo, `knowsAbout`), `HIGHLIGHTS`, `SKILL_GROUPS` | Hero, About, Contact, homepage JSON-LD |
| [`constants/projects.js`](../src/constants/projects.js) | `FEATURED_PROJECTS`, `CASE_STUDY_FIELDS`, `PROJECT_DIRECTORY` | Projects |
| [`constants/experience.js`](../src/constants/experience.js) | `EXPERIENCE` (newest first; the first entry is the current role) | Work, About |
| [`constants/books.js`](../src/constants/books.js) | `BOOKS`, `ESSAYS`, `SHELF_ITEMS` | Reading list, shelf card |
| [`constants/blogConstants.js`](../src/constants/blogConstants.js) | `BLOG_CONTENT`, `BLOG_INDEX_DESCRIPTION` | Blog preview, archive |
| [`constants/routes.js`](../src/constants/routes.js) | Public URL paths and `absoluteUrl` | Links, canonicals, sitemap, feed |

Rules:

- Only publish facts that are true and visible on the site; structured data is
  generated from these modules, so an inaccurate entry becomes an inaccurate
  claim to search engines.
- `scripts/lib/prerenderContent.test.js` and `npm run verify:build` fail if a
  featured project, directory entry, job, highlight or skill is missing from
  the static homepage HTML.
- Editing a module updates the UI, the fallback HTML and the structured data
  together; no other file needs to change unless a new icon key is introduced
  (add it to the component's `ICONS` map).

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
| `title`    | string | Display title. |
| `slug`     | string | Must match the filename; lowercase kebab-case, at most 120 characters, unique. Drives the URL and is the post's identity. |
| `summary`  | string | Shown on the blog card. |
| `date`     | string | Publication date as `27 Aug, 2025` (also accepts `2025-08-27`). A calendar date in India Standard Time; see below. Displayed as written. |
| `readTime` | string | e.g. `"4 min read"`. Displayed as-is. |
| `category` | string | Optional grouping label. |

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
| RSS `<pubDate>` | `rfc822` (build) | `Tue, 28 Jul 2026 18:30:00 GMT` |
| Sorting (app and build) | `compareNewestFirst` | newest first; undated posts last |

The build fails on an impossible date such as `31 Feb, 2026`.

### Section headings and the table of contents

Use `##` for an article's sections (and `###` for subsections). Each `h2`/`h3`
gets an id derived from its text by `headingSlug` in
[`src/utils/articleHeadings.js`](../src/utils/articleHeadings.js) — lowercase,
accents and punctuation removed, words joined by hyphens, with `-1`, `-2`
suffixes for repeats. For example `## The counter-force` becomes
`/blog/will-money-become-obsolete/#the-counter-force`.

- The same rehype plugin (`rehypeHeadingIds`) runs in the app and in the build
  renderer, so prerendered and React ids are identical (a test checks every
  published post).
- Posts with at least `MIN_TOC_HEADINGS` (3) sections show a "Contents" list
  linking to each section, in the app and in the static HTML.
- Renaming a heading changes its anchor and breaks existing deep links to that
  section.

### Loading & parsing

[`src/utils/blogLoader.js`](../src/utils/blogLoader.js):

- `import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default', eager: true })`
  inlines every post's raw markdown at build time.
- A small in-house `parseFrontmatter` function extracts the frontmatter (quoted
  strings are unquoted, numeric values are coerced to numbers). **No
  `gray-matter` dependency is used.**
- `loadBlogPosts()` returns an array of `{ ...frontmatter, content, filename }`.
- `loadBlogBySlug(slug)` returns a single post or `null`.

[`src/utils/blogUtils.js`](../src/utils/blogUtils.js):

- `sortBlogsByDate(posts)` returns a new array sorted newest-first (does not
  mutate its input; returns `[]` for non-array input).

### Rendering

- The **Blog section** ([`components/Blog/Blog.jsx`](../src/components/Blog/Blog.jsx))
  loads posts with `useMemo`, sorts them, and renders the three newest as
  `BlogCard`s plus a link to the full archive (or an empty state).
- `BlogCard` links to the canonical `/blog/<slug>/` URL.
- The full post renders in [`pages/BlogPost.jsx`](../src/pages/BlogPost.jsx) using
  `react-markdown`. Links inside
  rendered markdown open in a new tab with `rel="noopener noreferrer"`.

### Adding a post

1. Create `src/blogs/<slug>.md`.
2. Add frontmatter with a **unique `id`** and a `slug` equal to `<slug>`.
3. Write the body in Markdown.

That's it — the glob import picks it up automatically on the next build/dev
reload. Run `npm test` to confirm the content-integrity checks still pass.

### View counts (Supabase)

Blog view counts are stored in [Supabase](https://supabase.com). The feature is
**optional and fully self-disabling**: if the env vars below are absent, the
Supabase client is `null`, every counter call becomes a no-op, and no counts are
shown — the site builds and runs exactly as before.

#### Client code

- [`src/lib/supabaseClient.js`](../src/lib/supabaseClient.js) — creates the client
  from env vars, or exports `null` when unconfigured.
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

The homepage preview and the archive pass each count to `BlogCard`;
`BlogPost.jsx` shows the count in the article header. Counts are popularity
signals for display, not unique-reader measurements: the endpoint is anonymous
and can be called directly.

#### Environment variables

Copy `.env.example` to `.env` for local development. Production builds read
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from GitHub Actions secrets
(see `.github/workflows/deploy.yml`).

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is a **public** key — safe to ship in the bundle. Security is
enforced by Row Level Security and grants in the database, not by hiding the key.

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

Residual risk: an anonymous caller can still create rows for slugs that are not
posts. The bounded client query makes such rows invisible on the site. A
database-side allowlist of published slugs would close this, but it would need
a sync step after every publish (forgetting it would silently stop counting a
new post), so it is listed as a proposal in [FEATURES.md](../FEATURES.md).
