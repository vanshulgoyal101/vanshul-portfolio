# Features — Portfolio (vanshul.com)

> **TL;DR** — Capability catalog for the personal site + blog: ✅ shipped, 🔜
> proposed, ⛔ non-goal. React 19 + Vite SPA on GitHub Pages, markdown blog, 3D
> hero, strong SEO. Deep docs: [documentation/README.md](documentation/README.md).

**Legend:** ✅ shipped · 🔜 proposed/potential · ⛔ deliberate non-goal.

## Site (✅ shipped)

- ✅ **3D space-themed hero** (three.js / @react-three/fiber + drei), Framer-Motion
  section animations, smooth in-page navigation.
- ✅ Sections: Home · About · Work · Projects · Blog · Contact.
- ✅ **Contact form** (`useContactForm`) → Supabase; Toast + Skeleton + ErrorBoundary.
- ✅ **Accessible + responsive** design; SPA routing (react-router 7) with a
  `404.html` GitHub-Pages shim.

## Blog (✅)

- ✅ Markdown posts in `src/blogs/*.md` (filename = slug), rendered at `/blog/:slug`
  with a `/blog` index and a homepage `#blog` section.
- ✅ Frontmatter schema (id, title, slug, summary, date, readTime, category).
- ✅ **Per-post prerender shells**, per-post OG images, RSS feed, sitemap.

## SEO (✅ strong)

- ✅ Per-page title/description/canonical/OG/Twitter; **`@graph` JSON-LD**
  (WebSite + Person + ProfilePage; BlogPosting + BreadcrumbList per post).
- ✅ **PNG OG images** generated via `sharp` (scrapers don't render SVG); sitemap +
  robots; RSS. Build-time scripts under `scripts/` (shared `scripts/lib/*`).

## Engineering (✅)

- ✅ React 19 + Vite 7, styled-components, react-icons.
- ✅ **Vitest + React Testing Library** (~36 test files).
- ✅ **Auto-deploy** to GitHub Pages on push to `main` (validate before pushing).

## Proposed / potential 🔜

- More blog posts + project case studies (content); light-theme polish; per-post
  reading analytics. No formal feature roadmap — the site is feature-complete.

## Non-goals ⛔

- **Server/DB beyond Supabase view counts + contact** — it's a static SPA.
- **CMS** — posts are version-controlled markdown, intentionally.
