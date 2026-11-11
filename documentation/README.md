# Vanshul Portfolio — Documentation

In-depth documentation for the codebase. Each document is self-contained and
focused on a single topic. Start with **architecture.md** for the big picture,
then dive into specific areas.

## Index

| Document | Contents |
| -------- | -------- |
| [architecture.md](architecture.md) | Project structure, routing, SPA/GitHub Pages setup, section navigation, state and browser storage, data flow, utility and library modules, tech stack, performance strategy. |
| [components.md](components.md) | Every React component: app shell, homepage sections, pages, shared UI primitives, Blog system, Toast, Navigation, footer, GoatCounter loader, FunElements. |
| [hooks.md](hooks.md) | Custom hooks (`useContactForm`, `useSeo`, `useBlogViews`/`useBlogView`, `useIdle`, `useAwayTitle`, `useKonamiCode`), the `useToast` context hook, and the react-router hooks used in navigation. |
| [data.md](data.md) | Portfolio content modules, the markdown blog system (frontmatter schema, dates, headings, loading/parsing, sorting, adding posts) and Supabase view counts (client, schema, database runner). |
| [styles.md](styles.md) | Design system: visual language, tokens, shared primitives (`components/ui`), recurring patterns, focus/tap-target rules, motion and reduced motion. |
| [assets.md](assets.md) | Images, public assets, and file organisation. |
| [testing.md](testing.md) | Vitest + React Testing Library setup, PGlite SQL tests, Playwright and axe browser checks, conventions, mocks, and how to run/extend tests. |
| [config.md](config.md) | `package.json`, `vite.config.js` (build stamp, Content-Security-Policy), `eslint.config.js`, `playwright.config.js`, `Makefile`, the validated environment variables, every script in `scripts/`, and hosting files. |
| [deployment.md](deployment.md) | GitHub Pages deployment through GitHub Actions, the post-deploy and daily live smoke, the Cloudflare-fronted domain, the SPA routing workaround, build output, rollback and troubleshooting. |
| [accessibility.md](accessibility.md) | WCAG 2.1 AA as implemented and tested: automated checks, landmarks and headings, keyboard and focus, forms, status messages, contrast, targets, motion. |
| [seo.md](seo.md) | Runtime meta (`useSeo`), build-time generation (sitemap, OG images, RSS feed, blog pre-rendering), JSON-LD, and static SEO files. |
| [analytics.md](analytics.md) | Optional GoatCounter page counts, the first-party `a.js` beacon, the `web_events` schema + RLS, the owner-gated `web_stats()` RPC, and the private `/dashboard`. |
| [homepage.md](homepage.md) | Preserved loader, layout, disclosure, rocket/exhaust and responsive contracts. |
| [audit-2026-09.md](audit-2026-09.md) | Verified fixes, evidence, coverage boundaries and operational follow-up. |
| [audit-2026-11.md](audit-2026-11.md) | Publishing parity, literal metadata, substantive revision dates, archive search, anchor correctness, test gates and operational limits. |
| [../FEATURES.md](../FEATURES.md) | Shipped capabilities, proposed work and deliberate non-goals. |

## Maintenance

Keep these documents in sync with the code. Update them when you:

- add or restructure components, routes, or hooks,
- change the build, test, or deployment pipeline,
- add or remove dependencies,
- change the blog frontmatter schema or design tokens.
