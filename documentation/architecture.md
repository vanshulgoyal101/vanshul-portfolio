# Architecture

## Overview

A single-page React application built with Vite. It renders a one-page portfolio
(hero, projects, about, work, blog, contact) plus blog, shelf and dashboard routes.
Styling is CSS-in-JS via styled-components on top of CSS custom properties;
animation is handled by Framer Motion; the hero and background use three.js via
`@react-three/fiber`. The app is a static SPA with generated readable public
HTML for GitHub Pages, with an emphasis on tested WCAG 2.1 AA practices,
responsiveness, and perceived
performance (deferred decorative work + skeleton loaders).

## Directory layout

```
src/
  App.jsx              # Router, page composition, homepage metadata
  main.jsx             # createRoot entry point (StrictMode)
  index.css            # Base reset; GlobalStyles owns the design tokens
  blogs/               # One Markdown file per post (frontmatter + body)
  components/          # Homepage sections (Hero, Projects, About, Work, Blog,
                       # Contact), Navigation, SiteFooter, Toast, ErrorBoundary,
                       # FunElements (decorative), socialIcons.js
  constants/           # Content and config data (see data.md): siteConfig,
                       # profile, projects, experience, books, blogConstants,
                       # routes, readingListSeo, motionVariants
  hooks/               # useSeo, useBlogViews, useContactForm, useIdle
  lib/                 # Supabase clients (view counts; private analytics)
  pages/               # BlogIndex, BlogPost, ReadingList, Dashboard, NotFound
  styles/              # GlobalStyles.js
  test/                # Vitest setup
  utils/               # blogLoader, blogUtils, blogViews, seoValues,
                       # scrollToSection, cursorPreference, magnetic,
                       # dashboardData
scripts/               # Build steps (sitemap, OG images, feed, prerender,
                       # sitemap index, verify-build), asset generators and
                       # the database runner; shared pure helpers in lib/
supabase/              # Analytics schema (web_events, web_stats)
e2e/                   # Playwright browser and accessibility tests
public/                # Static files served as-is (see assets.md)
documentation/         # This documentation
```

## Routing & navigation

- **Client-side routing** with `react-router-dom` v7:
  - `/` — the full one-page portfolio (all sections).
  - `/blog/<slug>/` — an individual blog post ([`pages/BlogPost.jsx`](../src/pages/BlogPost.jsx)).
  - `/blog/` - full writing index.
  - `/reading-list/` - separate Books and Essays collections with anchor links.
  - `/dashboard` - noindex private reporting UI; authorization is enforced in SQL.
  - `/blogs` and `/blogs/:slug` - legacy aliases to the canonical writing routes.
  - Unknown paths/posts - friendly noindex recovery.
- **Public publishing**: prebuild validates Markdown metadata and generates
  sitemap, social images and feed. Postbuild uses ReactMarkdown to emit readable
  articles, indexes, shelf and basic homepage content inside `#root`. These are
  fallback documents, not full SSR: React `createRoot` replaces them on startup.
  Public URLs end in `/` because GitHub Pages redirects the slash-less form;
  [`constants/routes.js`](../src/constants/routes.js) builds every path (see
  [seo.md](seo.md#url-and-canonical-policy)).
  `scripts/verify-build.mjs` checks all public sitemap routes and metadata.
- **GitHub Pages SPA workaround** (see [deployment.md](deployment.md)):
  - `public/404.html` captures deep links, encodes the path into a query string,
    and redirects to `index.html`.
  - A snippet in `index.html` restores the real URL before React boots.
- **Section navigation**:
  - `Navigation.jsx` renders anchor links and a scroll-spy that highlights the
    active section.
  - Same page: `scrollToSection(id)` calculates header clearance, moves with
    `window.scrollTo`, and optionally focuses the destination heading.
  - From a blog route: navigation goes home first; the hash helper waits for
    the boot loader and fonts before finding and focusing the destination.
  - `ScrollToHash` in `App.jsx` scrolls to `location.hash` on direct hits once
    the boot loader has finished.

## State management

- **Local state** via `useState` / `useEffect` / `useCallback` within components.
- **Context** — `ToastProvider` ([`components/Toast`](../src/components/Toast/ToastProvider.jsx))
  exposes `showSuccess`, `showError`, `showInfo`, and `removeToast` through the
  `useToast()` hook. Toasts auto-dismiss after a configurable duration
  (default 5s).
- **URL state** — route params via react-router.

## Data flow

1. `main.jsx` mounts `App` in `React.StrictMode`.
2. `App` wraps everything in `ToastProvider`, renders `GlobalStyles`, the boot
   loader, decorative background, and the routes.
3. Blog data is loaded synchronously at import time:
   - `utils/blogLoader.js` uses `import.meta.glob('../blogs/*.md', { query: '?raw', eager: true })`
     to inline every post's raw markdown at build time.
   - A small in-house parser extracts YAML-style frontmatter (no `gray-matter`
     dependency); the body is kept as a markdown string.
   - `utils/blogUtils.js` → `sortBlogsByDate` orders posts newest-first.
   - `react-markdown` renders the body in `BlogPost`.
4. Decorative 3D/telemetry elements are deferred until the browser is idle via
   the `useIdle` hook and `React.lazy`, keeping them off the critical path.

## Performance strategy

- **Deferred decorative work**: `useIdle` + `Suspense`/`lazy` load
  `FloatingRocket`, `RandomTelemetry`, and `InteractiveSpaceBackground` only
  after first paint.
- **Manual chunking**: `vite.config.js` splits vendors (react, framer-motion,
  styled-components, three core, three-react, icons, markdown) for better
  caching. three.js is unavoidably the largest chunk and is isolated.
- **Error boundaries** wrap each section so a failure in one does not blank the
  page.

## External boundaries

- Contact uses Formspree via `useContactForm`, with validation, cancellation,
  duplicate-submit guarding and visible failure states. No custom contact server.
- Blog view counts use a bounded Supabase RPC. Counts are untrusted popularity
  signals, not billing-grade measurements or proof of unique human readers.
- The private analytics client uses a separate public Supabase endpoint/key.
  The email check is UI gating only; SQL verifies the authenticated owner UID.
- Optional GoatCounter and the separately installed first-party beacon have
  distinct data flows. See [analytics.md](analytics.md) for privacy and grants.
- Database scripts require verified TLS. SQL tests run in PGlite, not production.

## Tech stack

- **Framework**: React 19
- **Build**: Vite 7 (`@vitejs/plugin-react`)
- **Routing**: react-router-dom 7
- **Styling**: styled-components 6 + CSS custom properties
- **Animation**: Framer Motion 12
- **3D**: three.js, @react-three/fiber, @react-three/drei
- **Markdown**: react-markdown (in-house frontmatter parser)
- **Icons**: react-icons
- **Testing**: Vitest 5, @testing-library/react, jsdom, PGlite, Playwright, axe-core
- **Linting**: ESLint 9 (flat config) with react, react-hooks, react-refresh
- **Deploy**: GitHub Actions tested artifact to GitHub Pages (`vanshul.com`)

## Extending

- **New section**: add a component folder under `src/components/`, import it in
  `App.jsx`, and wrap it in `<ErrorBoundary><SectionWrapper id="…">`.
- **New route**: add a `<Route>` in `App.jsx` and a component in `src/pages/`.
- **New blog post**: drop a `.md` file into `src/blogs/` (see [data.md](data.md)).
- **Global styles/tokens**: edit `src/index.css` or `src/styles/GlobalStyles.js`.
