# Configuration

Root-level configuration files that define how the app is developed, built,
linted, tested, and deployed.

---

## package.json

**Scripts**

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `dev` | `vite` | Start the dev server with HMR. |
| `build` | `vite build` | Production build → `dist/`. |
| `preview` | `vite preview` | Serve the production build locally. |
| `lint` | `eslint .` | Lint the project. |
| `test` | `vitest run` | Run the test suite once. |
| `test:watch` | `vitest` | Run tests in watch mode. |
| `test:ui` | `vitest --ui` | Vitest browser UI. |
| `test:coverage` | `vitest run --coverage` | Tests with a V8 coverage report. |
| `predeploy` | `npm run build` | Runs automatically before `deploy`. |
| `deploy` | `gh-pages -d dist` | Publish `dist/` to the `gh-pages` branch. |

**`homepage`**: `https://vanshul.com` (custom domain).

**Runtime dependencies**: `react`, `react-dom`, `react-router-dom`,
`styled-components`, `framer-motion`, `three`, `@react-three/fiber`,
`@react-three/drei`, `react-markdown`, `react-icons`, `prop-types`.

**Dev dependencies**: `vite`, `@vitejs/plugin-react`, `eslint` and plugins
(`@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`,
`eslint-plugin-react-refresh`, `globals`), the test stack (`vitest`,
`@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`,
`@testing-library/user-event`, `jsdom`), `gh-pages`, `sharp`, and React types.

> Note: `gsap`, `@studio-freight/lenis`, and `gray-matter` were removed — they
> were not used anywhere in the source.

---

## vite.config.js

- `plugins: [react()]`, `base: '/'`.
- **Test config** (Vitest reads the same file): `globals: true`,
  `environment: 'jsdom'`, `setupFiles: './src/test/setup.js'`, `css: true`, and
  V8 coverage settings. See [testing.md](testing.md).
- **Build**: `outDir: 'dist'`, `chunkSizeWarningLimit: 600`, and a
  `manualChunks(id)` function that isolates vendors into named chunks:
  `vite-preload`, `react-vendor` (react-dom + router), `react-core`, `framer`,
  `styled`, `three-core`, `three-react`, `icons`, and `markdown`. three.js core
  is the largest chunk by nature and is deliberately isolated for caching.
- **`vite-preload` is load-bearing.** Vite's dynamic-import helper
  (`vite/preload-helper`) is statically imported by the entry chunk. If it is
  left unassigned, Rollup can park it inside a lazy vendor chunk — which makes
  that chunk a first-paint dependency and silently defeats code-splitting.
  Pinning it to its own chunk keeps `three-core` / `three-react` / `markdown`
  out of the entry's `modulepreload` list.
- **Verifying code-splitting**: after `npm run build`, the entry HTML should
  only preload `react-core`, `react-vendor`, `vite-preload`, `styled`, `icons`
  and `framer`:

  ```bash
  grep -o 'assets/[a-zA-Z0-9._-]*\.js' dist/index.html | sort -u
  ```

---

## eslint.config.js

Flat config (ESLint 9). Highlights:

- **Ignores**: `**/dist`, `coverage`, `space-portfolio`, `archive`,
  `documentation`.
- **Extends**: `@eslint/js` recommended, `eslint-plugin-react-hooks`
  (recommended-latest), and `eslint-plugin-react-refresh` (vite).
- **`eslint-plugin-react`** is enabled with `react/jsx-uses-vars` so identifiers
  used only inside JSX (e.g. `motion` in `<motion.div>`) are correctly counted
  as used. `react.version` is auto-detected.
- **Rules**: `no-unused-vars` with `ignoreRestSiblings: true`.
- **Test override**: files matching `**/*.test.{js,jsx}` and `src/test/**` get
  Node + Vitest globals.

Run with `npm run lint`.

---

## Makefile

Convenience shortcuts around the npm scripts:

| Target | Effect |
| ------ | ------ |
| `make dev` / `make start` | Start the dev server. |
| `make stop` | Kill any running Vite process. |
| `make restart` | Stop then start the dev server. |
| `make build` | Production build. |
| `make preview` | Preview the production build. |
| `make clean` | Remove `dist/`. |
| `make install` | `npm install`. |
| `make setup` | Install dependencies then start dev. |

---

## Hosting / SEO files (in `public/`)

- `CNAME` — custom domain for GitHub Pages.
- `404.html` — SPA deep-link redirect shim (see [deployment.md](deployment.md)).
- `robots.txt`, `sitemap.xml` — crawler directives and sitemap.
