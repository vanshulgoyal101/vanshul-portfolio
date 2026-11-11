# Agent Guidelines

Personal site and blog for vanshul.com: a React 19 + Vite SPA, prerendered for
crawlers and deployed to GitHub Pages. Start with [README.md](README.md),
[FEATURES.md](FEATURES.md) and [documentation/](documentation/README.md).

## Build and test

Use Node `^22.22.2 || ^24.15.0 || >=26` (older 22.x fails the unit suite).

```bash
npm ci
npm run lint
npm test                      # Vitest: unit, SQL (PGlite) and doc-fact tests
npm run build                 # prebuild generators + Vite + prerender
npm run verify:build          # every published route, reference and policy in dist/
npm run test:e2e              # Playwright desktop + mobile (npx playwright install chromium)
npm run check                 # full release gate, the same steps CI runs
node scripts/smoke-live.mjs   # read-only check of production (no install needed)
```

Pushing to `main` deploys production after CI passes; `.github/workflows/live-smoke.yml`
then verifies the live site. See [deployment.md](documentation/deployment.md).

## Repository invariants

- Published URLs end in `/`; a new public page needs its sitemap entry,
  prerendered shell and canonical. `verify:build` fails on any mismatch.
- Every built page carries a `<meta>` Content-Security-Policy. A new
  third-party origin goes through `src/lib/runtimeConfig.js` and
  `scripts/lib/securityPolicy.mjs`; never loosen `script-src`. Editing the
  inline script in `public/404.html` requires updating its hash (unit-tested).
- Read `VITE_*` values only through `parseRuntimeConfig`; invalid values fail
  the production build.
- three.js, markdown, Supabase and the dashboard stay lazy (`LAZY_ONLY_CHUNKS`).
- Decorative motion respects `prefers-reduced-motion` and the ambient switch.
- Docs that quote versions or counts are tested against `package.json` and the
  content registries; update them in the same change.
- Preserve design intent: refactors keep existing features, motion and content
  collections unless the owner asks otherwise.
- Others may be editing this checkout. Commit only your own hunks; never reset,
  stash or reformat someone else's changes.

## Engineering skills

Lessons from real incidents, many from this repo, live in
[vanshulgoyal101/skills](https://github.com/vanshulgoyal101/skills/blob/main/CATALOG.md).
Read the matching skill before changing that surface:

| Surface | Skills |
|---|---|
| Any release | [verification-gates](https://github.com/vanshulgoyal101/skills/blob/main/skills/verification-gates.md), [post-deploy-production-guard](https://github.com/vanshulgoyal101/skills/blob/main/skills/post-deploy-production-guard.md), [rendered-ui-evidence](https://github.com/vanshulgoyal101/skills/blob/main/skills/rendered-ui-evidence.md) |
| SEO, routes, generated files | [crawlable-metadata-contracts](https://github.com/vanshulgoyal101/skills/blob/main/skills/crawlable-metadata-contracts.md), [public-indexing-hygiene](https://github.com/vanshulgoyal101/skills/blob/main/skills/public-indexing-hygiene.md), [build-artifact-parity](https://github.com/vanshulgoyal101/skills/blob/main/skills/build-artifact-parity.md), [reference-integrity-checks](https://github.com/vanshulgoyal101/skills/blob/main/skills/reference-integrity-checks.md), [rasterized-social-preview](https://github.com/vanshulgoyal101/skills/blob/main/skills/rasterized-social-preview.md) |
| UI, motion, accessibility | [design-intent-preservation](https://github.com/vanshulgoyal101/skills/blob/main/skills/design-intent-preservation.md), [visual-motion-constraints](https://github.com/vanshulgoyal101/skills/blob/main/skills/visual-motion-constraints.md), [header-offset-scroll-guards](https://github.com/vanshulgoyal101/skills/blob/main/skills/header-offset-scroll-guards.md), [accessible-interaction-contracts](https://github.com/vanshulgoyal101/skills/blob/main/skills/accessible-interaction-contracts.md), [async-lifecycle-guards](https://github.com/vanshulgoyal101/skills/blob/main/skills/async-lifecycle-guards.md) |
| Bundles and dependencies | [lazy-bundle-boundaries](https://github.com/vanshulgoyal101/skills/blob/main/skills/lazy-bundle-boundaries.md), [dependency-refresh-contracts](https://github.com/vanshulgoyal101/skills/blob/main/skills/dependency-refresh-contracts.md) |
| Security, config, data | [security-response-headers](https://github.com/vanshulgoyal101/skills/blob/main/skills/security-response-headers.md), [env-validation-schema](https://github.com/vanshulgoyal101/skills/blob/main/skills/env-validation-schema.md), [supabase-rls-complete](https://github.com/vanshulgoyal101/skills/blob/main/skills/supabase-rls-complete.md), [runtime-storage-boundaries](https://github.com/vanshulgoyal101/skills/blob/main/skills/runtime-storage-boundaries.md) |
| Docs and copy | [documented-fact-parity](https://github.com/vanshulgoyal101/skills/blob/main/skills/documented-fact-parity.md), [multi-encoding-literal-rotation](https://github.com/vanshulgoyal101/skills/blob/main/skills/multi-encoding-literal-rotation.md) |
| Several agents at once | [multi-worker-delivery](https://github.com/vanshulgoyal101/skills/blob/main/skills/multi-worker-delivery.md) |
