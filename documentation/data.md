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
- [`src/utils/blogViews.js`](../src/utils/blogViews.js) — `incrementBlogView(slug)`,
  `getAllBlogViews()`, and a `formatViews()` display helper.
- [`src/hooks/useBlogViews.js`](../src/hooks/useBlogViews.js) — `useBlogViews()`
  returns a `{ slug: views }` map for the listing; `useBlogView(slug)` records one
  view on the post page and returns the current count.

The listing (`Blog.jsx`) fetches all counts once and passes each to `BlogCard`;
`BlogPost.jsx` increments and displays the count in the header.

#### Environment variables

Copy `.env.example` to `.env` and fill in the two values from your Supabase
project (Project Settings → API). They are also needed at build time for
`npm run deploy`.

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is a **public** key — safe to ship in the bundle. Security is
enforced by Row Level Security in the database, not by hiding the key.

#### Database setup (run once in the Supabase SQL editor)

```sql
-- 1. Counts table
create table if not exists public.blog_views (
  slug  text primary key,
  views integer not null default 0
);

-- 2. Lock it down, then allow anonymous *reads* only
alter table public.blog_views enable row level security;

drop policy if exists "Public can read view counts" on public.blog_views;
create policy "Public can read view counts"
  on public.blog_views for select
  to anon
  using (true);

-- 3. The only way anon can write is through this controlled function.
--    SECURITY DEFINER lets it upsert without granting anon direct write access.
create or replace function public.increment_blog_view(post_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.blog_views (slug, views)
    values (post_slug, 1)
  on conflict (slug)
    do update set views = public.blog_views.views + 1
  returning views into new_count;
  return new_count;
end;
$$;

grant execute on function public.increment_blog_view(text) to anon;
```

With that in place, visiting a post calls `increment_blog_view` and the count
appears on both the post page and its card in the listing.

