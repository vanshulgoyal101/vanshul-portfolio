# Features — Portfolio (vanshul.com)

> **TL;DR** — Capability catalog for the personal site + blog: ✅ shipped, 🔜
> proposed, ⛔ non-goal. React 19 + Vite SPA on GitHub Pages, markdown blog, 3D
> hero, strong SEO. Deep docs: [documentation/README.md](documentation/README.md).

**Legend:** ✅ shipped · 🔜 proposed/potential · ⛔ deliberate non-goal.

## Site (✅ shipped)

- ✅ **3D space-themed hero** (three.js / @react-three/fiber + drei), Framer-Motion
  section animations, smooth in-page navigation.
- ✅ Sections: Home · About · Work · Projects · Blog · Contact.
- ✅ **Contact form** (`useContactForm`) → Formspree, with validation, duplicate-submit
  guarding, cancellation and visible failures; Toast + Skeleton + ErrorBoundary.
- ✅ **Accessible + responsive** design; SPA routing (react-router 7) with a
  `404.html` GitHub-Pages shim.
- ✅ Original multilingual intro, three-tap rocket/smoke/About transition,
  desktop sculpture and persistent display preferences are retained.
- ✅ Featured projects plus a keyboard-operable, initially collapsed directory.
- ✅ Separate Books (12) and Essays (8) at `/reading-list`, with external sources.
- ✅ Private analytics dashboard: owner-gated SQL aggregates, time ranges, IST
  charts, safe CSV export, loading/error/empty states and sign-out invalidation.

## Blog (✅)

- ✅ Markdown posts in `src/blogs/*.md` (filename = slug), rendered at `/blog/:slug`
  with a `/blog` index and a homepage `#blog` section.
- ✅ Frontmatter schema (id, title, slug, summary, date, readTime, category).
- ✅ Readable static article bodies, writing index, shelf and basic homepage;
  public navigation works without JavaScript. Per-post OG images, RSS, sitemap.

## SEO (✅ strong)

- ✅ Per-page title/description/canonical/OG/Twitter; **`@graph` JSON-LD**
  (WebSite + Person + ProfilePage; BlogPosting + BreadcrumbList per post).
- ✅ **PNG OG images** generated via `sharp` (scrapers don't render SVG); sitemap +
  robots; RSS. Build-time scripts under `scripts/` (shared `scripts/lib/*`).

## Engineering (✅)

- ✅ React 19 + Vite 7, styled-components, react-icons.
- ✅ **Vitest 5 + React Testing Library**, isolated SQL authorization tests,
  desktop/mobile Playwright interaction and canvas checks, axe accessibility scans.
- ✅ Verified database TLS, least-privilege schema grants, DNT/GPC privacy gates,
  sanitized analytics URLs and shared build/runtime article structured data.
- ✅ **Auto-deploy** to GitHub Pages on push to `main` (validate before pushing).

## Proposed / potential 🔜

- Search Console and field Core Web Vitals monitoring: establish ownership,
  submit the generated sitemap, inspect representative indexed URLs and measure
  real-user performance before making further performance changes.
- Analytics retention and abuse protection: define a retention window and
  ingestion quota before adding a server-side ingestion endpoint. Public metrics
  remain forgeable; client-side identifiers are not an abuse-control mechanism.
- More original posts and evidenced project case studies. Add only authored,
  reviewed material; no generated keyword pages or fabricated achievements.
- Manual assistive-technology review and live OAuth/contact verification remain
  operational checks. Automated accessibility tests are not certification.

## Non-goals ⛔

- **General application backend**: the site stays statically hosted; Supabase
  handles views/analytics and Formspree handles contact delivery.
- **CMS** — posts are version-controlled markdown, intentionally.
- Guaranteed search rankings, fabricated content and collecting sensitive data.
