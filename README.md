# Vanshul Portfolio

A modern, animated personal portfolio and blog built with React 19 and Vite. It
features a 3D space-themed hero, smooth section navigation, a markdown-powered
blog, a reading shelf, and a responsive design with automated accessibility
checks. Deployed as a static SPA with readable public HTML to
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
| Testing     | Vitest 5 + React Testing Library + PGlite + Playwright + axe-core |
| Deployment  | GitHub Actions → GitHub Pages |

## Getting started

Use Node 22.12+, 24, or a newer supported release (see `package.json` engines).

```bash
npm ci            # install locked dependencies
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm test          # run the test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with a coverage report
npm run verify:build   # validate every published route after building
npm run test:e2e       # desktop/mobile browser checks (install Chromium first)
npm audit             # production and development advisories
```

A `Makefile` provides shortcuts (`make dev`, `make build`, `make preview`,
`make clean`, `make install`, `make setup`).

## Project structure

```
src/
  App.jsx              # Routing + page layout
  main.jsx             # React entry point
  index.css            # Base CSS + design tokens (CSS custom properties)
  blogs/               # Markdown blog posts (one file per post)
  components/          # Feature-grouped React components
    Blog/  Contact/  Hero/  Navigation/  Projects/
    Work/  About/  Toast/  Skeleton/  FunElements/
    ErrorBoundary.jsx
  constants/           # Static config (blog constants)
  hooks/               # Custom hooks (useContactForm, useIdle)
  pages/               # Route-level pages (BlogPost)
  styles/              # GlobalStyles (styled-components)
  test/                # Vitest setup
  utils/               # blogLoader, blogUtils
public/                # Static assets, 404.html SPA shim, SEO files
documentation/         # In-depth documentation (see below)
```

## Documentation

Comprehensive documentation lives in [`documentation/`](documentation/README.md):
architecture, components, hooks, data/blog system, styling, assets, testing,
configuration, deployment, and accessibility.
Start with the [capability catalog](FEATURES.md) and the
[September audit](documentation/audit-2026-09.md) for verified changes and
operational limitations. Push validated changes to `main` for deployment;
the legacy `npm run deploy` command bypasses the current release gates.

## Adding a blog post

Create a new `.md` file in `src/blogs/`. The filename (without `.md`) becomes the
slug and must match the `slug` frontmatter field. See
[documentation/data.md](documentation/data.md) for the frontmatter schema.
