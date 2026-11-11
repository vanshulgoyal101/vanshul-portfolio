# Architecture

## Overview

A single-page React application built with Vite. It renders a one-page portfolio
(hero, projects, about, work, blog, contact) plus blog, shelf and dashboard routes.
Styling is CSS-in-JS via styled-components on top of CSS custom properties;
animation is handled by Framer Motion; the desktop hero sculpture uses three.js
via `@react-three/fiber`, while the starfield and rocket smoke are 2D
canvases. The app is a static SPA with generated readable public
HTML for GitHub Pages, with an emphasis on tested WCAG 2.1 AA practices,
responsiveness, and perceived performance (deferred decorative work, lazy
routes and a "Loading page..." fallback).

## Directory layout

```
src/
  App.jsx              # Router, page composition, homepage metadata
  main.jsx             # createRoot entry point (StrictMode)
  index.css            # Base reset; GlobalStyles owns the design tokens
  blogs/               # One Markdown file per post (frontmatter + body)
  components/          # Homepage sections (Hero, Projects, About, Work, Blog,
                       # Contact), Navigation, SiteFooter, CursorToggle, Toast,
                       # ErrorBoundary, BackgroundElements, Analytics
                       # (GoatCounter), ui/ (shared primitives), FunElements/
                       # (decorative), socialIcons.js
  constants/           # Content and config data (see data.md): siteConfig,
                       # profile, projects, projectStories, experience, books,
                       # blogConstants, routes, readingListSeo, motionVariants
  hooks/               # useSeo, useBlogViews, useContactForm, useIdle
  lib/                 # Supabase clients (view counts; private analytics)
  pages/               # BlogIndex, BlogPost, ReadingList, ProjectPage,
                       # Dashboard, NotFound
  styles/              # GlobalStyles.js
  test/                # Vitest setup
  utils/               # articleHeadings, blogLoader, blogUtils, blogViews,
                       # seoValues, frontmatter, links, scrollToSection,
                       # cursorPreference, magnetic, dashboardData,
                       # routeRetry (see the module table below)
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
  - `/projects/<id>/` - the full story of a featured project
    ([`pages/ProjectPage.jsx`](../src/pages/ProjectPage.jsx)); there is no
    `/projects/` index, the homepage `#projects` section is the list.
  - `/dashboard` - noindex private reporting UI; authorization is enforced in SQL.
  - `/blogs` and `/blogs/:slug` - legacy aliases to the canonical writing routes.
  - Unknown paths, posts and project ids - friendly noindex recovery.
- **Public publishing**: prebuild validates Markdown metadata and generates
  sitemap, social images and feed. Postbuild uses ReactMarkdown to emit readable
  articles, indexes, shelf and homepage content inside `#root`. These are
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
  - `Navigation.jsx` renders `/#section` links (`/#home` … `/#contact`) and,
    on `/` only, a scroll-spy that highlights the active section.
  - A plain left click calls `navigate('/#section')` from any route, the
    homepage included; modified clicks (new tab, new window) keep the browser
    default.
  - `ScrollToHash` in `App.jsx` handles every location that has a hash:
    direct hits, cross-route links and same-page clicks. Once the boot loader
    has finished and `document.fonts.ready` resolves, it calls
    `scrollToSection(target, { focus: true })` on the next animation frame.
    There is no fixed delay; a target that is not in the DOM yet is skipped.
  - `scrollToSection` ([`utils/scrollToSection.js`](../src/utils/scrollToSection.js))
    finds the section's first `h1`/`h2`, subtracts the fixed header's bottom
    edge plus 20px, scrolls with `window.scrollTo` (instant under reduced
    motion, smooth otherwise) and focuses the heading, marking it with
    `data-section-focus`. `#home` scrolls to the top. The rocket's smoke
    transition and the reading list's `#books`/`#essays`/`#shelf-top`
    handling call it directly.

## State management

- **Local state** via `useState` / `useEffect` / `useCallback` within components.
- **Context** — `ToastProvider` ([`components/Toast`](../src/components/Toast/ToastProvider.jsx))
  exposes `showSuccess`, `showError`, `showInfo`, and `removeToast` through the
  `useToast()` hook. Toasts auto-dismiss after a configurable duration
  (default 5s).
- **URL state** — route params via react-router.
- **Browser storage**:
  - `localStorage`: `vg.ambient` (`on`/`off`, the ambient-motion switch, read
    by `App`) and `vg.cursor` (`on`/`off`, the custom-cursor switch; absent
    means the default) from `utils/cursorPreference.js`.
  - `sessionStorage`: `vg.viewedPosts`, the slugs already counted in this
    browser session (`utils/blogViews.js`).
  - The dashboard's supabase-js client keeps its auth session in
    `localStorage` under the library's default `sb-<project-ref>-auth-token`
    key. The `a.js` beacon, which this site does not load, uses `vg.vid`.

## Data flow

1. `main.jsx` mounts `App` in `React.StrictMode`.
2. `App` wraps the tree in `MotionConfig reducedMotion="user"`, the router and
   `ToastProvider`. It renders `ScrollToHash`, the GoatCounter `Analytics`
   loader, `GlobalStyles`, the boot loader, the skip link, the custom cursor,
   the background wash, the idle decorative layer, the routes (inside a
   `Suspense` loading fallback and `RouteBoundary`, which shows `RouteError`
   when a page fails to load or render) and the footer.
3. Blog data is bundled at build time and parsed synchronously on first use:
   - `utils/blogLoader.js` uses
     `import.meta.glob('../blogs/*.md', { query: '?raw', import: 'default', eager: true })`
     to inline every post's raw markdown at build time, and caches the parsed
     posts after the first `loadBlogPosts()` call.
   - `utils/frontmatter.js`, an in-house parser shared with the build scripts,
     extracts the YAML-style frontmatter (no `gray-matter` dependency); the
     body is kept as a markdown string.
   - `utils/blogUtils.js` → `sortBlogsByDate` orders posts newest-first.
   - `react-markdown` renders the body in `BlogPost`.
4. Decorative 3D/telemetry elements are deferred until the browser is idle via
   the `useIdle` hook and `React.lazy`, keeping them off the critical path.

## Performance strategy

- **Deferred decorative work**: `useIdle` + `Suspense`/`lazy` load
  `SmokeTransition`, `FloatingRocket`, `RandomTelemetry` and
  `InteractiveSpaceBackground` (in `App`) and `HeroScene` (in `Hero`) only
  after the browser is idle. None of them load for reduced motion; the
  ambient four also wait for the boot loader and the ambient-motion switch,
  and the hero scene only loads above 1024px.
- **Lazy routes**: `BlogPost`, `BlogIndex`, `ReadingList`, `ProjectPage` and
  `Dashboard` are `React.lazy` chunks, so the markdown renderer, the project
  stories (`constants/projectStories.js`) and the dashboard stay off the
  homepage bundle. With five lazy pages sharing `PageLayout`, Rolldown emits
  the shared shell (router, `Navigation`, `PageLayout`, `PageHeader`,
  `useSeo`) as a common chunk the entry HTML preloads, instead of keeping it
  inside the entry chunk; that split costs about 1.5 KB of gzip on first load.
- **Manual chunking**: `vite.config.js` splits vendors (`vite-preload`, react,
  framer-motion, styled-components, three core, three-react, icons, markdown,
  supabase) for better caching. three.js is unavoidably the largest chunk and
  is isolated.
- **Lazy services**: supabase-js loads on first use through `getSupabase()`,
  never on first paint. `verify:build` fails the build if any published page
  eagerly loads the three.js, markdown, supabase, dashboard or hero-scene
  chunks.
- **Error boundaries** wrap each homepage section, the routes as a whole and
  the hero scene (with a `null` fallback), so a failure in one does not blank
  the page.

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

## Utility and library modules

Every module in `src/utils/` and `src/lib/`, with the document that covers it
in detail.

| Module | Exports | Details |
| --- | --- | --- |
| [`utils/articleHeadings.js`](../src/utils/articleHeadings.js) | `headingSlug`, `rehypeHeadingIds`, `articleHeadings`, `MIN_TOC_HEADINGS` | [data.md](data.md#section-headings-and-the-table-of-contents) |
| [`utils/frontmatter.js`](../src/utils/frontmatter.js) | `parseFrontmatter` (shared by the app and `scripts/lib/seo.mjs`) | [data.md](data.md#loading--parsing) |
| [`utils/links.js`](../src/utils/links.js) | `classifyLink` (article links: in-app, new tab or plain) | [data.md](data.md#rendering) |
| [`utils/blogLoader.js`](../src/utils/blogLoader.js) | `loadBlogPosts`, `loadBlogBySlug` | [data.md](data.md#loading--parsing) |
| [`utils/blogUtils.js`](../src/utils/blogUtils.js) | `sortBlogsByDate`, `getRelatedPosts`, `formatPostDate`, `groupPostsByYear` | [data.md](data.md#loading--parsing) |
| [`utils/blogViews.js`](../src/utils/blogViews.js) | `incrementBlogView`, `getBlogView`, `recordBlogView`, `getAllBlogViews`, `formatViews` | [data.md](data.md#client-code) |
| [`utils/seoValues.js`](../src/utils/seoValues.js) | `parsePostDate`, `postDate`, `postPublishedAt`, `postLastModified`, `postTimestamp`, `compareNewestFirst`, `PUBLICATION_TIMEZONE_OFFSET`, `parseTags`, `postKeywords` | [data.md](data.md#frontmatter-schema), [seo.md](seo.md) |
| [`utils/scrollToSection.js`](../src/utils/scrollToSection.js) | `scrollToSection`, `getHashTarget`, `getScrollOffset`, `getSectionScrollTop` | [Routing & navigation](#routing--navigation) above |
| [`utils/cursorPreference.js`](../src/utils/cursorPreference.js) | `getCursorPreference`, `setCursorPreference`, `isPointerFine`, `isAutoCursorCapable`, `isCustomCursorEnabled`, `CURSOR_PREF_EVENT` | [components.md](components.md#shared-ui) |
| [`utils/routeRetry.js`](../src/utils/routeRetry.js) | `shouldRetry`, `RETRY_KEY` (the once-a-minute reload guard used by `RouteError`) | [components.md](components.md) |
| [`utils/magnetic.js`](../src/utils/magnetic.js) | `magneticOffset`, `FOLLOW_RATIO` | [components.md](components.md#decorative-elements--componentsfunelements) |
| [`utils/dashboardData.js`](../src/utils/dashboardData.js) | `formatNumber`, `fillDailySeries`, `hourSeries`, `toBars`, `shortenUrl`, `percentDelta`, `statsToCsv` | [analytics.md](analytics.md#4-the-dashboard--dashboard) |
| [`lib/supabaseClient.js`](../src/lib/supabaseClient.js) | `isSupabaseConfigured`, `getSupabase` (lazy view-count client) | [data.md](data.md#view-counts-supabase) |
| [`lib/analyticsClient.js`](../src/lib/analyticsClient.js) | `analytics` (supabase-js client for the dashboard), `OWNER_EMAIL` | [analytics.md](analytics.md#4-the-dashboard--dashboard) |

Content and configuration modules in `src/constants/` are listed in
[data.md](data.md#portfolio-content-modules); `motionVariants.js` is covered in
[styles.md](styles.md#motion).

## Tech stack

- **Framework**: React 19
- **Build**: Vite 8 (`@vitejs/plugin-react` 6, Rolldown)
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
- **Global styles/tokens**: tokens and element defaults live in
  `src/styles/GlobalStyles.js`; `src/index.css` holds the reset, the focus
  ring and print rules (see [styles.md](styles.md)).
