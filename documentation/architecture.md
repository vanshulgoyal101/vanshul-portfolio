# Architecture

## Overview

A single-page React application built with Vite. It renders a one-page portfolio
(hero, about, work, projects, blog, contact) plus standalone blog-post routes.
Styling is CSS-in-JS via styled-components on top of CSS custom properties;
animation is handled by Framer Motion; the hero and background use three.js via
`@react-three/fiber`. The app is a static SPA optimised for GitHub Pages, with
an emphasis on accessibility (WCAG 2.1 AA), responsiveness, and perceived
performance (deferred decorative work + skeleton loaders).

## Directory layout

```
src/
  App.jsx              # Router + page composition (imports at top, then styles, then helpers)
  main.jsx             # ReactDOM.createRoot entry point (StrictMode)
  index.css            # Base CSS + design tokens (CSS custom properties)
  blogs/               # One markdown file per blog post (frontmatter + body)
  components/          # Feature-grouped components
    About/ Work/ Projects/ Hero/ Contact/   # content sections
    Blog/                                              # Blog, BlogCard, BlogModal
    Navigation/                                        # top nav + scroll spy
    Toast/                                             # global notification context
    Skeleton/                                          # loading placeholders
    FunElements/                                       # decorative animations
    ErrorBoundary.jsx                                  # section-level error boundary
  constants/           # blogConstants.js (animation variants, copy, config)
  hooks/               # useContactForm.js, useIdle.js
  pages/               # BlogPost.jsx (route-level)
  styles/              # GlobalStyles.js
  test/                # setup.js (Vitest global setup)
  utils/               # blogLoader.js, blogUtils.js
public/                # 404.html SPA shim, CNAME, robots.txt, sitemap.xml, images/
documentation/         # this documentation
```

## Routing & navigation

- **Client-side routing** with `react-router-dom` v7:
  - `/` — the full one-page portfolio (all sections).
  - `/blog/:slug` — an individual blog post ([`pages/BlogPost.jsx`](../src/pages/BlogPost.jsx)).
- **GitHub Pages SPA workaround** (see [deployment.md](deployment.md)):
  - `public/404.html` captures deep links, encodes the path into a query string,
    and redirects to `index.html`.
  - A snippet in `index.html` restores the real URL before React boots.
- **Section navigation**:
  - `Navigation.jsx` renders anchor links and a scroll-spy that highlights the
    active section.
  - Same page: it calls `scrollToSection(id)` (native `scrollIntoView`).
  - From a blog route: it navigates to `/` first, then scrolls after the DOM
    settles.
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
   - `react-markdown` renders the body in `BlogModal` and `BlogPost`.
4. Decorative 3D/telemetry elements are deferred until the browser is idle via
   the `useIdle` hook and `React.lazy`, keeping them off the critical path.

## Performance strategy

- **Deferred decorative work**: `useIdle` + `Suspense`/`lazy` load
  `FloatingRocket`, `RandomTelemetry`, and `InteractiveSpaceBackground` only
  after first paint.
- **Manual chunking**: `vite.config.js` splits vendors (react, framer-motion,
  styled-components, three core, three-react, icons, markdown) for better
  caching. three.js is unavoidably the largest chunk and is isolated.
- **Skeleton loaders** provide perceived performance for async-feeling UI.
- **Error boundaries** wrap each section so a failure in one does not blank the
  page.

## Tech stack

- **Framework**: React 19
- **Build**: Vite 7 (`@vitejs/plugin-react`)
- **Routing**: react-router-dom 7
- **Styling**: styled-components 6 + CSS custom properties
- **Animation**: Framer Motion 12
- **3D**: three.js, @react-three/fiber, @react-three/drei
- **Markdown**: react-markdown (in-house frontmatter parser)
- **Icons**: react-icons
- **Testing**: Vitest, @testing-library/react, jsdom
- **Linting**: ESLint 9 (flat config) with react, react-hooks, react-refresh
- **Deploy**: gh-pages → GitHub Pages (custom domain `vanshul.com`)

## Extending

- **New section**: add a component folder under `src/components/`, import it in
  `App.jsx`, and wrap it in `<ErrorBoundary><SectionWrapper id="…">`.
- **New route**: add a `<Route>` in `App.jsx` and a component in `src/pages/`.
- **New blog post**: drop a `.md` file into `src/blogs/` (see [data.md](data.md)).
- **Global styles/tokens**: edit `src/index.css` or `src/styles/GlobalStyles.js`.
