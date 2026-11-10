# Configuration

Root-level configuration files that define how the app is developed, built,
linted, tested, and deployed, plus the environment variables and the scripts
in `scripts/`.

---

## package.json

**Scripts**

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `dev` | `vite` | Start the dev server with HMR (http://localhost:5173). |
| `prebuild` | `node scripts/generate-sitemap.mjs && node scripts/generate-og-images.mjs && node scripts/generate-feed.mjs && node scripts/generate-llms.mjs` | Runs automatically before `build`: writes `public/sitemap.xml`, `public/og/<slug>.png`, `public/feed.xml` and `public/llms.txt`. |
| `build` | `vite build` | Production build → `dist/`. |
| `postbuild` | `node scripts/prerender-blog.mjs && node scripts/gen-sitemap-index.mjs` | Runs automatically after `build`: writes the readable route shells and `dist/sitemap-index.xml`. |
| `generate:og` | `node scripts/generate-og-images.mjs` | Regenerate only the per-post social cards. |
| `preview` | `vite preview` | Serve the production build locally. |
| `lint` | `eslint .` | Lint the project. |
| `test` | `vitest run` | Run the unit test suite once. |
| `test:watch` | `vitest` | Run tests in watch mode. |
| `test:ui` | `vitest --ui` | Vitest browser UI. `@vitest/ui` is not a dependency, so Vitest offers to install it on first use. |
| `test:coverage` | `vitest run --coverage` | Tests with a V8 coverage report. |
| `verify:build` | `node scripts/verify-build.mjs` | Check every published route in `dist/` (run after `build`). |
| `test:e2e` | `playwright test` | Desktop and mobile browser tests against a production preview. |
| `check` | `npm audit --audit-level=moderate && npm run lint && npm test && npm run build && npm run verify:build && npm run test:e2e` | The full release gate, in the same order as CI; stops at the first failure. |
| `predeploy` | `npm run build` | Runs automatically before `deploy`. |
| `deploy` | `gh-pages -d dist` | Legacy: publish `dist/` to the `gh-pages` branch. Not the production path (see [deployment.md](deployment.md#legacy-branch-deployment)). |

`prebuild`, `postbuild` and `predeploy` are npm lifecycle hooks: `npm run build`
always runs the generators first and the prerender after.

**`engines`**: Node `^22.22.2 || ^24.15.0 || >=26.0.0`. The jsdom 31
test environment requires these minimum patch releases; older Node 22/24
installations are not supported. CI resolves the current Node LTS.

Direct dependencies were refreshed against the npm `latest` tags on 2026-11-10.
The lockfile is the exact release record, not a promise that future registry
releases are already installed. Check `npm outdated --prefer-online` before
upgrading, review peers and engines, then run `npm run check`. Cross-check
registry `latest` tags directly: abbreviated metadata used by `npm outdated`
can disagree with the full package metadata.

**Compatibility exception (2026-11-10):** ESLint and `@eslint/js` remain on the
latest supported 9.x releases (9.39.5). ESLint 10.14.0 / `@eslint/js` 10.0.1
are available, but the latest `eslint-plugin-react` 7.37.5 declares support only
through ESLint 9. Do not bypass its peer contract with `--force` or
`--legacy-peer-deps`; revisit the pair when the plugin supports ESLint 10.

**`homepage`**: `https://vanshul.com` (custom domain).

**Runtime dependencies**: `react`, `react-dom`, `react-router-dom`,
`styled-components`, `framer-motion`, `three`, `@react-three/fiber`,
`@react-three/drei`, `react-markdown`, `unified`, `remark-parse`,
`remark-rehype` (heading ids), `@supabase/supabase-js`, `react-icons`,
`prop-types`.

**Dev dependencies**: `vite`, `@vitejs/plugin-react`, `eslint` and plugins
(`@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`,
`eslint-plugin-react-refresh`, `globals`), the unit test stack (`vitest`,
`@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`,
`@testing-library/user-event`, `jsdom`, `@electric-sql/pglite`), the browser
test stack (`@playwright/test`, `@axe-core/playwright`), `pg` (database
runner), `sharp` (image generation), `gh-pages`, and React types.

> Note: `gsap`, `@studio-freight/lenis`, and `gray-matter` were removed — they
> were not used anywhere in the source.

---

## vite.config.js

- Vite 8 with `@vitejs/plugin-react` 6, `plugins: [react()]`, `base: '/'`.
- **Test config** (Vitest reads the same file; see [testing.md](testing.md)):
  - `include`: `src/**/*.test.{js,jsx}` and `scripts/**/*.test.{js,mjs}`
  - `globals: true`, `environment: 'jsdom'`,
    `setupFiles: './src/test/setup.js'`, `css: true`
  - `maxWorkers: 2` bounds concurrent DOM environments, avoiding CPU/memory
    contention on shared development machines without relaxing test timeouts
  - `testTimeout: 15000`, because rendering full styled-components trees in
    jsdom can take seconds
  - `env` forces `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to empty
    strings, so tests never reach Supabase even when a local `.env` exists
  - coverage: V8 provider, `text` and `html` reporters, `src/**/*.{js,jsx}`
    only, excluding `src/main.jsx`, `src/test/**`, test files and
    `src/**/index.js`
- **Build**: `outDir: 'dist'`, `assetsDir: 'assets'`,
  `chunkSizeWarningLimit: 600`, and a `manualChunks(id)` function (through
  Vite 8's `rollupOptions` compatibility configuration) that
  isolates vendors into named chunks: `vite-preload`, `react-vendor`
  (`react-dom` and `react-router-dom`), `react-core`, `framer`, `styled`,
  `three-core`, `three-react`, `icons`, `markdown` (react-markdown, remark,
  rehype, unified, micromark) and `supabase`.
  three.js core is the largest chunk by nature and is deliberately isolated for
  caching. `supabase` is reached only through the dynamic import in
  `src/lib/supabaseClient.js` (view counts) and the lazy dashboard.
- **`vite-preload` is load-bearing.** Vite's dynamic-import helper
  (`vite/preload-helper`) is statically imported by the entry chunk. If it is
  left unassigned, the bundler can park it inside a lazy vendor chunk — which makes
  that chunk a first-paint dependency and silently defeats code-splitting.
  Pinning it to its own chunk keeps `three-core` / `three-react` / `markdown`
  out of the entry's `modulepreload` list.
- **First-load budget**: `npm run verify:build` also fails when a page's
  up-front gzipped JS and CSS exceed `FIRST_LOAD_BUDGET_KB` (205 KB) in
  `scripts/verify-build.mjs`. In November 2026 every page loaded 187 KB:
  `react-vendor` (react-dom and react-router, 71 KB), the entry (46 KB),
  `framer` (45 KB), `icons` (13 KB), `styled` (12 KB), `react-core` (3 KB),
  CSS and the preload helper. Raise the budget only for a deliberate change.
- **Verifying code-splitting**: `npm run verify:build` fails if any published
  page eagerly loads `three-core`, `three-react`, `markdown`, `supabase`,
  `Dashboard` or `HeroScene`. After `npm run build` the entry HTML should load
  only the entry plus shared runtime/core vendor dependencies, never the lazy
  groups above. Vite 8 also emits a small `rolldown-runtime` helper.
  Moving supabase-js out of the entry cut it from about
  102 KB to about 45 KB gzipped (measured for commit 41ac89c). To list what
  loads up front:

  ```bash
  grep -o 'assets/[a-zA-Z0-9._-]*\.js' dist/index.html | sort -u
  ```

---

## eslint.config.js

Flat config (ESLint 9). Highlights:

- **Ignores**: `**/dist`, `coverage`, `playwright-report`, `test-results`,
  `documentation`.
- **Files**: `**/*.{js,jsx,mjs}`, with browser globals and JSX enabled.
- **Extends**: `@eslint/js` recommended, `eslint-plugin-react-hooks`
  (recommended-latest), and `eslint-plugin-react-refresh` (vite).
- **`eslint-plugin-react`** is enabled with `react/jsx-uses-vars` so identifiers
  used only inside JSX (e.g. `motion` in `<motion.div>`) are correctly counted
  as used. `react.version` is auto-detected.
- **Rules**: `no-unused-vars` with `ignoreRestSiblings: true`.
- **Test override**: files matching `**/*.test.{js,jsx}` and
  `src/test/**/*.{js,jsx}` get Node + Vitest globals.
- **Node override**: `scripts/**/*.{js,mjs}`, `e2e/**/*.js` and `*.config.js`
  get Node and browser globals (Playwright specs run in Node but evaluate
  callbacks in the page).

Run with `npm run lint`.

---

## playwright.config.js

- `testDir: './e2e'`, `fullyParallel: true`, 2 workers, no retries.
- `baseURL: 'http://127.0.0.1:4327'`; traces are kept and screenshots taken
  only for failures.
- Two Chromium projects: `desktop` (1440×1000) and `mobile` (390×844,
  `isMobile`, `hasTouch`).
- `webServer` runs
  `npm run preview -- --host 127.0.0.1 --port 4327 --strictPort` and never
  reuses a running server, so it serves whatever is in `dist/`: build first.
  See [testing.md](testing.md#production-browser-checks).

---

## Makefile

Convenience shortcuts around the npm scripts:

| Target | Effect |
| ------ | ------ |
| `make help` | Default target: lists the targets below except `install` and `setup`. |
| `make dev` / `make start` | Start the dev server. |
| `make stop` | `pkill -f "vite"`: stops every process whose command line contains "vite", including `vite preview` and Vitest runs. |
| `make restart` | Stop then start the dev server. |
| `make build` | Production build. |
| `make preview` | Preview the production build. |
| `make clean` | Remove `dist/`. |
| `make install` | `npm install` (use `npm ci` for the locked tree). |
| `make setup` | Install dependencies then start dev. |

---

## Environment variables

Copy `.env.example` to `.env` for local development; `.env` and `.env.*`
(except `.env.example`) are git-ignored. `VITE_*` values are inlined into the
public bundle at build time, so they must never hold secrets.

| Variable | Read by | When unset |
| --- | --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `src/lib/supabaseClient.js` (blog view counts) | No counts are requested or shown. |
| `VITE_GOATCOUNTER_CODE` | `src/components/Analytics.jsx` | GoatCounter never loads. |
| `VITE_CONTACT_ENDPOINT` | `src/hooks/useContactForm.js` | Optional Formspree endpoint override; unset, the form posts to the site's own form. Listed in `.env.example`. |
| `SUPABASE_DB_URL`, or `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`; optional `PGSSLMODE`, `PGSSLROOTCERT` | `scripts/db.mjs` (Node only, never bundled) | The runner exits with an error. See [data.md](data.md#database-runner). |

The deploy workflow passes `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and
`VITE_GOATCOUNTER_CODE` to `npm run build` from repository secrets. The
analytics dashboard's Supabase URL and publishable key are hard-coded in
`src/lib/analyticsClient.js`, not read from the environment.

---

## Build and maintenance scripts (`scripts/`)

| Script | When it runs | Output | Details |
| --- | --- | --- | --- |
| `generate-sitemap.mjs` | `prebuild` | `public/sitemap.xml`: home, `/blog/`, `/reading-list/` and every post (with its social image) | [seo.md](seo.md#build-time-generation) |
| `generate-og-images.mjs` | `prebuild`, `npm run generate:og` | `public/og/<slug>.png` (1200×630, rendered with `sharp`) | [seo.md](seo.md#build-time-generation) |
| `generate-feed.mjs` | `prebuild` | `public/feed.xml` (RSS 2.0 with full article HTML) | [seo.md](seo.md#build-time-generation) |
| `generate-llms.mjs` | `prebuild` | `public/llms.txt` (a curated Markdown map of the site for AI assistants) | [seo.md](seo.md#llmstxt) |
| `prerender-blog.mjs` | `postbuild` | `dist/index.html` (homepage JSON-LD and content), `dist/blog/index.html`, `dist/blog/<slug>/index.html`, `dist/reading-list/index.html` | [seo.md](seo.md#build-time-generation) |
| `gen-sitemap-index.mjs` | `postbuild` | `dist/sitemap-index.xml` from `sitemap-sites.json` | [seo.md](seo.md#build-time-generation) |
| `verify-build.mjs` | `npm run verify:build` | Fails on any broken published route, metadata, eager lazy chunk, missing or third-party font, feed item or llms.txt link | [testing.md](testing.md#production-browser-checks) |
| `generate-og-image.mjs` | By hand | `public/og-image.png`, the default social card | [assets.md](assets.md#icons-and-social-images) |
| `generate-icons.mjs` | By hand | `public/panda-32.png`, `panda-apple-touch.png` (180px), `panda-192.png`, `panda-512.png` from `public/panda.svg` | [assets.md](assets.md#icons-and-social-images) |
| `capture-projects.mjs` | By hand: `node scripts/capture-projects.mjs [adbrain] [tiny-arcade]` | `public/images/projects/<name>.webp` screenshots (Playwright Chromium + `sharp`) | [homepage.md](homepage.md#project-media) |
| `db.mjs` | By hand | Runs SQL on the database over verified TLS | [data.md](data.md#database-runner) |
| `schema.sql` | Applied with `db.mjs` | The `blog_views` table and `increment_blog_view` RPC | [data.md](data.md#database-schema) |
| `database.test.js` | `npm test` | PGlite tests of both SQL schemas | [testing.md](testing.md#database-and-accessibility-checks) |

Shared modules in `scripts/lib/` do no file or network access except where
noted. Each has a co-located `*.test.js` except `markdown.mjs`, which the feed
and prerender tests exercise:

| Module | Exports | Used by |
| --- | --- | --- |
| `seo.mjs` | `escapeXml`, `escapeText`, `rfc822`, `readPosts` (reads a posts directory through `src/utils/frontmatter.js` and validates titles, slugs, dates and update dates), `byDateDesc`, and re-exports of `parseTags`, `postKeywords`, `postDate`, `postPublishedAt`, `postLastModified` | sitemap, OG image, feed and prerender scripts |
| `sitemap.mjs` | `buildSitemap` | `generate-sitemap.mjs` |
| `sitemapIndex.mjs` | `buildSitemapIndex` | `gen-sitemap-index.mjs` |
| `feed.mjs` | `buildFeed` | `generate-feed.mjs` |
| `llms.mjs` | `buildLlmsTxt` | `generate-llms.mjs` |
| `markdown.mjs` | `renderMarkdown`: react-markdown with `rehypeHeadingIds`, no raw HTML, unsafe URLs removed; an `origin` option makes root-relative URLs absolute | `feed.mjs`, `prerenderContent.mjs` |
| `prerenderContent.mjs` | `prerenderContent`: the readable fallback HTML for the home, archive, article and shelf pages | `prerender-blog.mjs` |
| `structuredData.mjs` | `breadcrumbList`, `postJsonLd`, `homeJsonLd`, `blogIndexJsonLd` | `prerender-blog.mjs` and the app (`App.jsx`, `BlogIndex`, `BlogPost`) |
| `databaseConfig.mjs` | `databaseConfig` (reads a CA file when one is configured) | `db.mjs` |

---

## Other root files

- `sitemap-sites.json`: the sitemap URLs listed in `dist/sitemap-index.xml`
  (vanshul.com plus the tools, games, adbrain, blog, links, ctx, mcp and vbrain
  subdomains).
- `.env.example`: placeholders for the `VITE_SUPABASE_*` and
  `VITE_GOATCOUNTER_CODE` variables.
- `.gitignore`: besides `node_modules`, `dist`, `coverage`, `playwright-report`
  and `test-results`, it ignores the generated `public/og/`,
  `public/sitemap.xml` and `public/feed.xml`.
- `index.html`: the template for every page (see
  [seo.md](seo.md#static-seo-files) and
  [deployment.md](deployment.md#2-indexhtml-script-decode--restore)).

## Hosting files (in `public/`)

- `CNAME` (`vanshul.com`): GitHub reads it only when a site is published from
  a branch, as the legacy `npm run deploy` does. For the GitHub Actions
  deployment the custom domain is set in Settings → Pages and the file is
  ignored ([GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).
- `404.html` — SPA deep-link redirect shim (see [deployment.md](deployment.md)).
- `robots.txt` — allows all crawlers and lists `sitemap.xml` and
  `sitemap-index.xml`.
- `site.webmanifest` — web-app manifest.
- `sitemap.xml`, `feed.xml` and `og/` are generated by `prebuild` and
  git-ignored. [assets.md](assets.md) lists every public file.
