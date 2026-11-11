# Features — Portfolio (vanshul.com)

> **TL;DR** — Capability catalog for the personal site + blog: ✅ shipped, 🔜
> proposed, ⛔ non-goal. React 19 + Vite SPA on GitHub Pages, markdown blog, 3D
> hero, strong SEO. Deep docs: [documentation/README.md](documentation/README.md).

**Legend:** ✅ shipped · ⏸️ built but switched off · 🔜 proposed/potential · ⛔ deliberate non-goal.

## Site (✅ shipped)

- ✅ **Desktop 3D hero sculpture** (three.js / @react-three/fiber + drei) with a
  space-themed ambient layer (starfield, telemetry glyphs, rocket), Framer-Motion
  section animations, smooth in-page navigation.
- ✅ Sections, in page order: Home · Projects · About · Work · Blog · Contact.
- ✅ **Contact form** (`useContactForm`) → Formspree, with validation, duplicate-submit
  guarding, cancellation and visible failures; Toast + ErrorBoundary.
- ✅ **Self-healing after deploys**: a page whose code a new release removed
  reloads once on its own, then falls back to an error page that keeps the
  navigation (`RouteError`).
- ✅ **Accessible + responsive** design; SPA routing (react-router 7) with a
  `404.html` GitHub-Pages shim.
- ✅ Original multilingual intro, three-tap rocket/smoke/About transition,
  desktop sculpture and persistent display preferences are retained.
- ✅ **Playful touches** (copy in `constants/wit.js`, built only from what the
  site already shows): a random footer quip, space-themed 404 quips with the
  missing path, a Konami-code toast and barrel roll (toast only under reduced
  motion or with ambient motion off), an away-tab title, space-themed contact
  toasts and a DevTools console greeting linking to the source.
- ✅ Featured projects plus a keyboard-operable, initially collapsed directory.
- ✅ Work: full cards for the current and most recent roles, then a compact
  "Earlier" list of shorter roles (internships, NASA HERC team lead, Space Apps
  Collective volunteer).
- ✅ **Project story pages** at `/projects/<id>/` (AdBrain, Tiny Arcade, NASA
  HERC): role, title, summary, image, key facts, the four-part case study, a
  longer story in plain sentences, live/source links and "More projects".
  Homepage cards link to them with "Read the full story". Lazy-loaded,
  prerendered, in the sitemap and llms.txt; unknown ids get the noindex 404.
- ✅ **Editorial design system**: one palette of paper, ink and a single blue
  accent; hairline surfaces; mono eyebrows; motion tokens; shared
  `SectionHeader`, `PageHeader`, `PageLayout` and `Button`/`ButtonLink`/
  `TextLink` primitives
  ([documentation/styles.md](documentation/styles.md)).
- ✅ Floating frosted navigation. On `/` the active item follows scroll-spy;
  "Blog" is active on `/blog*` and `/reading-list`, "Projects" on
  `/projects/*`. On mobile, a numbered,
  focus-managed drawer. The site footer ends every route.
- ✅ Screen-reader-announced notifications (polite live region). Failed contact
  submits move focus to the first invalid field. Every page has one `main`
  landmark.
- ✅ Separate Books (18) and Essays (8) at `/reading-list/`, with external sources.
- ✅ Private analytics dashboard: owner-gated SQL aggregates, time ranges, IST
  charts, safe CSV export, loading/error/empty states and sign-out invalidation.

## Blog (✅)

- ✅ Unpublished drafts live in `drafts/` (never built); see `drafts/README.md`.
- ✅ Markdown posts in `src/blogs/*.md` (filename = slug), rendered at `/blog/<slug>/`
  with a `/blog/` index and a homepage `#blog` section.
- ✅ View counts: one count per post per browser session, queried only for
  published slugs, degrading to no counts when Supabase is unconfigured.
- ✅ Canonical URLs, sitemap entries and internal links use the final
  trailing-slash form, so no advertised URL redirects on GitHub Pages.
- ✅ Homepage writing preview features the three newest posts and links to the full archive.
- ✅ Archive at `/blog/`: grouped by year (sticky year labels on wide screens),
  with links to the RSS feed and the reading list.
- ✅ Articles: a ~70-character reading measure, a byline (avatar, date, read
  time, live views, Share), "On this page" contents, an author card and
  "More writings" related posts.
- ✅ Article sections have stable deep-link ids; posts with three or more
  `h2`/`h3` headings show a table of contents (also in the no-JavaScript HTML).
- ✅ Frontmatter schema (title, slug, summary, date, readTime, category, optional
  updated and tags), read by one parser shared by the app and the build. An
  `updated` date drives `dateModified`, `article:modified_time`, sitemap
  `<lastmod>` and an "Updated" note in the byline.
- ✅ Readable static article bodies, writing index, shelf, project story and homepage content;
  public navigation works without JavaScript. Per-post OG images, RSS, sitemap.

## SEO (✅ strong)

- ✅ Per-page title/description/canonical/OG/Twitter; **JSON-LD** (an `@graph`
  of WebSite + Person + ProfilePage on the homepage only; BlogPosting +
  BreadcrumbList per post; Blog + BreadcrumbList on the archive; ItemList +
  BreadcrumbList on the shelf; WebPage + BreadcrumbList per project story).
- ✅ **PNG OG images** generated via `sharp` (scrapers don't render SVG); sitemap,
  sitemap index and robots; RSS. Build-time scripts under `scripts/` (shared
  `scripts/lib/*`).
- ✅ **`/llms.txt`** for AI assistants, built from the same posts and data modules.
- ✅ **IndexNow**: each deploy that changes content submits exactly the changed
  URLs to Bing, Yandex, Seznam, Naver and Yep.
- ✅ Build guards: unique titles and descriptions, consistent article dates and a
  first-load JS/CSS budget, all in `verify:build`.

## Engineering (✅)

- ✅ React 19 + Vite 8, styled-components, react-icons.
- ✅ **Vitest 5 + React Testing Library**, isolated SQL authorization tests,
  desktop/mobile Playwright interaction and canvas checks, axe accessibility scans.
- ✅ Verified database TLS, least-privilege schema grants, DNT/GPC privacy gates,
  sanitized analytics URLs and shared build/runtime article structured data.
- ✅ **Auto-deploy** to GitHub Pages on push to `main`, only after the audit,
  lint, unit, build, build-verification and browser gates pass in CI.
- ⏸️ Archive search and topic filter, switched off for simplicity
  (`ARCHIVE_SEARCH_ENABLED` in `src/constants/blogConstants.js`). When on: local
  full-text search with announced loading, results, visible failures and
  recovery. Article bodies load only for a text
  query; the complete static archive remains readable without JavaScript.
- ✅ Shared build/article publishing validation, literal metadata replacements,
  substantive revision dates and collision-free heading anchors.
- ✅ Enforced frontend/build-helper coverage floors, generated metadata/fragment
  checks, configuration validation, CSP/referrer policy and stamped live smoke.

## Proposed / potential 🔜

- Smaller first load: the Framer chunk is about 54 KB of the 173.2 KB the heaviest page
  loads up front. Switching to `LazyMotion` with `m.*` components would defer most of it,
  but touches every animated component, so it waits for a dedicated pass with
  browser verification of each animation.
- Search Console and field Core Web Vitals monitoring: `index.html` already
  carries the Search Console verification tag; confirm the property, submit the
  generated sitemap index, inspect representative indexed URLs and measure
  real-user performance before making further performance changes.
- Database allowlist for view counts: a `blog_posts` table of published slugs
  checked by `increment_blog_view`, synced after each publish. Blocks rows for
  non-posts at the source; needs an owner-run sync step, so it is not enabled.
- Analytics retention and abuse protection: define a retention window and
  ingestion quota before adding a server-side ingestion endpoint. Public metrics
  remain forgeable; client-side identifiers are not an abuse-control mechanism.
- More original posts and evidenced project stories (the three featured
  projects have pages; directory projects do not). Add only authored, reviewed
  material; no generated keyword pages or fabricated achievements.
- Manual assistive-technology review and live OAuth/contact verification remain
  operational checks. Automated accessibility tests are not certification.

## Non-goals ⛔

- **General application backend**: the site stays statically hosted; Supabase
  handles views/analytics and Formspree handles contact delivery.
- **CMS** — posts are version-controlled markdown, intentionally.
- Guaranteed search rankings, fabricated content and collecting sensitive data.
