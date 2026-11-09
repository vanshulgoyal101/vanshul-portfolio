# Vanshul Portfolio

A modern, animated personal portfolio and blog built with React 19 and Vite. It
features a desktop-only 3D hero sculpture with a space-themed ambient layer
(starfield, rocket, telemetry glyphs), smooth section navigation, a
markdown-powered blog, a reading shelf, and a responsive design with automated
accessibility checks. Deployed as a static SPA with readable public HTML to
GitHub Pages at [vanshul.com](https://vanshul.com).

## Tech stack

| Area        | Technology |
| ----------- | ---------- |
| Framework   | React 19 |
| Build tool  | Vite 7 |
| Routing     | react-router-dom 7 |
| Styling     | styled-components 6 (CSS-in-JS) + CSS custom properties |
| Animation   | Framer Motion 12 |
| 3D graphics | three.js, @react-three/fiber, @react-three/drei |
| Markdown    | react-markdown (frontmatter parsed by a small in-house parser) |
| Icons       | react-icons |
| Services    | Supabase (blog view counts, private analytics dashboard), Formspree (contact form), optional GoatCounter |
| Testing     | Vitest 5 + React Testing Library + PGlite + Playwright + axe-core |
| Deployment  | GitHub Actions → GitHub Pages |

## Getting started

Use Node 22.12+, 24, or a newer supported release (see `package.json` engines).

```bash
npm ci            # install locked dependencies
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/ (prebuild and postbuild steps run automatically)
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm test          # run the unit test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with a coverage report
npm run verify:build   # validate every published route after building
npm run test:e2e       # desktop/mobile browser checks (install Chromium first)
npm run check          # the full release gate: audit, lint, test, build, verify, e2e
npm audit             # production and development advisories
```

Optional services read `VITE_*` variables; copy `.env.example` to `.env` to
set them. Without them the site still builds and runs: view counts and
GoatCounter stay off and the contact form posts to its default Formspree
endpoint (see
[documentation/config.md](documentation/config.md#environment-variables)).

A `Makefile` provides shortcuts (`make dev`, `make build`, `make preview`,
`make clean`, `make install`, `make setup`; see
[documentation/config.md](documentation/config.md#makefile)).

## Project structure

```
src/
  App.jsx              # Router, page composition, homepage metadata
  main.jsx             # React entry point
  index.css            # Reset, global focus ring, custom-cursor and print rules
  blogs/               # Markdown blog posts (one file per post)
  components/          # Homepage sections (Hero, Projects, About, Work, Blog,
                       # Contact), Navigation, SiteFooter, Toast, ErrorBoundary,
                       # RouteError,
                       # Analytics, ui/ primitives, FunElements/ (decorative)
  constants/           # Content and config data modules (site, profile,
                       # projects, experience, books, blog copy, routes)
  hooks/               # useSeo, useBlogViews, useContactForm, useIdle
  lib/                 # Supabase clients (view counts, private analytics)
  pages/               # BlogIndex, BlogPost, ReadingList, Dashboard, NotFound
  styles/              # GlobalStyles (design tokens, element defaults)
  test/                # Vitest setup
  utils/               # Blog loading, dates, view counts, scrolling, helpers
scripts/               # Build-time SEO generators, build verifier, asset
                       # generators, database runner (shared helpers in lib/)
supabase/              # Analytics schema (web_events, web_stats)
e2e/                   # Playwright browser and accessibility tests
public/                # Static assets, 404.html SPA shim, SEO files
documentation/         # In-depth documentation (see below)
```

## Documentation

Comprehensive documentation lives in [`documentation/`](documentation/README.md):
architecture, components, hooks, data/blog system, styling, assets, testing,
configuration, deployment, accessibility, SEO, analytics and the homepage
contracts.
Start with the [capability catalog](FEATURES.md) and the
[September audit](documentation/audit-2026-09.md) for verified changes and
operational limitations. Push validated changes to `main` for deployment;
the legacy `npm run deploy` command bypasses the release gates and does not
update the live site, which GitHub Pages serves from the Actions workflow
(see [documentation/deployment.md](documentation/deployment.md)).

## Adding a blog post

Create a new `.md` file in `src/blogs/`. The filename (without `.md`) becomes the
slug and must match the `slug` frontmatter field. See
[documentation/data.md](documentation/data.md#frontmatter-schema) for the
frontmatter schema.
