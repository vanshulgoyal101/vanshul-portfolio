# Data — The Blog System

Blog posts are plain Markdown files. There is no CMS or database; posts are
bundled at build time.

## Location & naming

- Posts live in [`src/blogs/`](../src/blogs/), one `.md` file per post.
- **The filename (without `.md`) is the slug** and must equal the `slug`
  frontmatter field (a test enforces this — see
  [testing.md](testing.md)). Example: `the-new-leverage.md` → slug
  `the-new-leverage` → URL `/blog/the-new-leverage`.

## Frontmatter schema

Each file begins with a YAML-style frontmatter block delimited by `---`:

```markdown
---
id: 4
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
| `id`       | number | Unique across all posts (used as React key). |
| `title`    | string | Display title. |
| `slug`     | string | Must match the filename. Drives the URL. |
| `summary`  | string | Shown on the blog card. |
| `date`     | string | Human-readable, must be `Date`-parseable (e.g. `27 Aug, 2025`). Used for sorting. |
| `readTime` | string | e.g. `"4 min read"`. Displayed as-is. |
| `category` | string | Optional grouping label. |

## Loading & parsing

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

## Rendering

- The **Blog section** ([`components/Blog/Blog.jsx`](../src/components/Blog/Blog.jsx))
  loads posts with `useMemo`, sorts them, and renders a `BlogCard` grid (or an
  empty state).
- `BlogCard` links to `/blog/:slug`.
- The full post renders in [`pages/BlogPost.jsx`](../src/pages/BlogPost.jsx) using
  `react-markdown`; `BlogModal` offers an in-page modal view. Links inside
  rendered markdown open in a new tab with `rel="noopener noreferrer"`.

## Adding a post

1. Create `src/blogs/<slug>.md`.
2. Add frontmatter with a **unique `id`** and a `slug` equal to `<slug>`.
3. Write the body in Markdown.

That's it — the glob import picks it up automatically on the next build/dev
reload. Run `npm test` to confirm the content-integrity checks still pass.
