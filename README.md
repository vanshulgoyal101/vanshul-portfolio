# Vanshul Portfolio

A modern, animated personal portfolio and blog built with React 19 and Vite. It
features a 3D space-themed hero, smooth section navigation, a markdown-powered
blog, and a fully accessible, responsive design. Deployed as a static SPA to
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
| Testing     | Vitest + React Testing Library + jsdom |
| Deployment  | gh-pages → GitHub Pages |

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
npm test          # run the test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with a coverage report
npm run deploy    # build and publish dist/ to GitHub Pages
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
    Blog/  Contact/  Hero/  Navigation/  Projects/  Timeline/
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

## Adding a blog post

Create a new `.md` file in `src/blogs/`. The filename (without `.md`) becomes the
slug and must match the `slug` frontmatter field. See
[documentation/data.md](documentation/data.md) for the frontmatter schema.
