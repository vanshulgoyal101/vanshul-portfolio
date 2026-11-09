# Deployment Documentation

## Overview
This project deploys to **GitHub Pages** through `.github/workflows/deploy.yml`.
The domain is served through Cloudflare in front of GitHub Pages (see
[DNS and Cloudflare](#dns-and-cloudflare)). Public routes (`/`, `/blog/`, every
post and `/reading-list/`) have generated HTML files. A custom SPA fallback
supports other client-side routes (such as `/dashboard`), but those responses
carry HTTP status 404; it is not a substitute for a generated page.

---

## GitHub Pages Setup

### Repository Configuration
**Repository**: `vanshulgoyal101/vanshul-portfolio`
**Branch**: `main` (source code)
**Deployment Source**: GitHub Actions artifact built from `main`
**Custom Domain**: `vanshul.com`

The Pages API reported `build_type: "workflow"`, `cname: "vanshul.com"` and
`https_enforced: true` when checked on 9 November 2026
(`gh api repos/vanshulgoyal101/vanshul-portfolio/pages`).

### GitHub Settings
1. Navigate to repository **Settings** → **Pages**
2. **Source**: GitHub Actions
3. **Custom domain**: `vanshul.com` (stored in the Pages settings; GitHub
   ignores a `CNAME` file for Actions deployments, so `public/CNAME` only
   matters for the legacy branch deploy)
4. **Enforce HTTPS**: ✅ Enabled

### DNS and Cloudflare
DNS is not managed in this repository. Observed on 9 November 2026:

- `vanshul.com` and `www.vanshul.com` resolve to Cloudflare addresses, and
  responses carry `server: cloudflare`, so Cloudflare proxies the domain in
  front of GitHub Pages.
- `http://vanshul.com/` answers with a 301 to `https://vanshul.com/`.
- The live `/robots.txt` begins with a Cloudflare-managed block
  (`Content-Signal` rules and `Disallow: /` for AI-training and other
  crawlers such as GPTBot, ClaudeBot, Google-Extended and GoogleOther) before
  the repository's own rules. Change that block in Cloudflare, not in
  `public/robots.txt`. It leaves search and AI-answer crawlers alone: Googlebot,
  Bingbot, Applebot, DuckDuckBot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
  Claude-SearchBot and Claude-User match only the `User-agent: *` groups, which
  allow everything. It does disallow Baiduspider and PetalBot (Baidu and
  Huawei Petal search) as well as the training crawlers. Google documents that
  Google-Extended does not affect inclusion or ranking in Google Search.
- HTML was served with `cache-control: max-age=600` and hashed JavaScript with
  `max-age=14400`, both gzip-compressed on request.

GitHub's documented records for an apex domain are the A records below (or
`ALIAS`/`ANAME` to `vanshulgoyal101.github.io`); a `www` subdomain uses a
`CNAME` to `vanshulgoyal101.github.io`
([GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

DNS changes can take time to propagate.

---

## Deployment Process

### Automated Deployment
Push validated changes to `main`. The workflow runs on pushes to `main` and
`feature/theme-improvements` and on manual `workflow_dispatch`:

1. **build** (ubuntu-latest, Node `lts/*`): checkout → `npm ci` →
   `npm audit --audit-level=moderate` → `npm run lint` → `npm test` →
   `npm run build` (with the `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   and `VITE_GOATCOUNTER_CODE` repository secrets) → `npm run verify:build` →
   `npx playwright install --with-deps chromium` → `npm run test:e2e` →
   configure Pages → upload `./dist` as the Pages artifact.
2. **deploy**: runs only for `refs/heads/main`, after `build`, and publishes
   the artifact to the `github-pages` environment with
   `actions/deploy-pages`.

Any failing step stops the run, so nothing is deployed. Runs on other
branches build and test without deploying. The `pages` concurrency group
queues a new run behind one in progress instead of cancelling it. Follow runs
in the Actions tab or with `gh run list --limit 4`.

Local release checks (the same gates CI runs, in order):
```bash
npx playwright install chromium   # once per machine
npm run check
```

`npm run check` runs `npm audit --audit-level=moderate`, `npm run lint`,
`npm test`, `npm run build`, `npm run verify:build` and `npm run test:e2e`, and
stops at the first failure. A local build reads `.env`; the CI build uses the
repository secrets.

The prebuild sitemap generator (`scripts/generate-sitemap.mjs`) is the only
sitemap source. Postbuild creates the page shells and the separate family
sitemap index.

### Legacy Branch Deployment
`npm run deploy` builds (`predeploy`) and pushes `dist/` to the `gh-pages`
branch with the `gh-pages` package. While the Pages source is GitHub Actions,
the live site is not served from that branch, and the command skips the
audit, tests and build verification. Do not use it for releases.

---

## Build Configuration

### Vite Build Output
**Output Directory**: `dist/` (after `npm run build`, including `prebuild` and
`postbuild`)

**Structure**:
```
dist/
├── index.html              # Homepage shell: SPA restore script, homepage JSON-LD, readable content
├── 404.html                # SPA fallback for routes without a shell
├── blog/
│   ├── index.html          # Archive shell
│   └── <slug>/index.html   # One shell per post
├── reading-list/
│   └── index.html          # Shelf shell
├── sitemap.xml             # Generated in prebuild
├── sitemap-index.xml       # Generated in postbuild
├── feed.xml                # Generated in prebuild
├── llms.txt                # Generated in prebuild
├── og/<slug>.png           # Per-post social cards (prebuild)
├── robots.txt, site.webmanifest, CNAME, a.js
├── og-image.png, favicon.ico, panda.svg, panda-*.png
├── fonts/                  # Self-hosted woff2 fonts and their licences
├── images/                 # profile-avatar.webp and projects/
└── assets/
    ├── index-[hash].js     # Entry chunk
    ├── index-[hash].css    # src/index.css
    ├── <vendor>-[hash].js  # Manual vendor chunks (below)
    └── <Name>-[hash].js    # Lazy chunks, e.g. BlogPost, Dashboard, HeroScene
```

### Code Splitting
`manualChunks` in `vite.config.js` creates `vite-preload`, `react-vendor`
(`react-dom`, `react-router-dom`), `react-core` (`react`), `framer`, `styled`,
`icons`, `markdown` (react-markdown and its unified/remark/rehype/micromark
dependencies), `three-core` (`three`), `three-react` (`@react-three/fiber`,
`@react-three/drei`) and `supabase`. Pages, the hero scene and the ambient
decorations are separate lazy chunks. `npm run verify:build` fails if a
published page loads `three-core`, `three-react`, `markdown`, `supabase`,
`Dashboard` or `HeroScene` eagerly. Details in
[config.md](config.md#viteconfigjs).

**Benefits**:
- Smaller main bundle size
- Better caching (vendor code changes less frequently)
- Faster subsequent page loads

### Build Optimization
- **Minification**: JS/CSS minified
- **Tree-shaking**: Unused code removed
- **Asset hashing**: content hashes in `assets/` file names, so a new build
  never reuses an old URL
- **Compression**: responses are gzip-encoded on request (observed above)
- **Code splitting**: manual vendor chunks and lazy routes

Files outside `assets/` keep fixed names. Version their URLs when replacing
them (see [homepage.md](homepage.md#project-media)).

---

## SPA Routing Workaround

### Problem
GitHub Pages serves static files only. A request for a path without a file
gets `404.html` with HTTP status 404. The build emits files for `/`, `/blog/`,
each published post and `/reading-list/`; GitHub Pages answers the slash-less
form of those with a 301 to the trailing-slash URL (see
[seo.md](seo.md#url-and-canonical-policy)). Every other path, such as
`/dashboard`, the `/blogs` aliases and unknown URLs, goes through the
fallback below.

### Solution
Two-script system that intercepts 404s and restores client-side routing:

---

### 1. 404.html (Capture & Redirect)
**Location**: `public/404.html`

**Purpose**: Intercept 404 errors and convert path to query string.

**Process**:
```
User navigates to: vanshul.com/dashboard
        ↓
GitHub Pages: no file for that path
        ↓
Serves: 404.html (HTTP 404)
        ↓
Script runs: Converts path to query string
        ↓
Redirects to: vanshul.com/?/dashboard
```

**Script Logic**:
```javascript
var pathSegmentsToKeep = 0; // 0 for custom domain, 1 for project pages

var l = window.location;
l.replace(
  l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
  l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
  l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
  (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
  l.hash
);
```

**Key Features**:
- Encodes `&` as `~and~` to preserve query strings
- Preserves hash fragments (`#section`), which is how the OAuth result in the
  dashboard sign-in redirect survives the bounce
- Minimal redirect (no page reload after restoration)

---

### 2. index.html Script (Decode & Restore)
**Location**: `index.html` (before React app loads)

**Purpose**: Decode query string and restore clean URL.

**Process**:
```
Page loads: vanshul.com/?/dashboard
        ↓
Script runs: Detects /?/... pattern
        ↓
Decodes: ~and~ → &
        ↓
history.replaceState: Restores clean URL
        ↓
Final URL: vanshul.com/dashboard
        ↓
React Router: Renders correct page
```

**Script**:
```javascript
<script type="text/javascript">
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

**Why Before React**:
- Restores URL before React Router initializes
- Prevents flash of wrong route
- Ensures correct route matches on first render

---

### Configuration for Different Setups

**Custom Domain** (vanshul.com):
```javascript
var pathSegmentsToKeep = 0;
```

**Project Pages** (username.github.io/repo-name):
```javascript
var pathSegmentsToKeep = 1;
```

**Vite Base Path** (must match):
```javascript
// vite.config.js
export default defineConfig({
  base: '/', // Custom domain
  // base: '/repo-name/', // Project pages
});
```

---

## SEO Configuration

### sitemap.xml
**Location**: `public/sitemap.xml` (generated and git-ignored — do not edit by
hand)

**Purpose**: Help search engines discover and index all pages.

**Generation**: [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs)
runs in `prebuild` before every `npm run build`. It lists the home page,
`/blog/`, `/reading-list/` and one entry per post, all with trailing-slash
URLs. Each post entry has its own date as `lastmod` and its social card as an
image entry; the home page and `/blog/` take the newest post's date; the
reading list has no `lastmod`. Adding a post and building regenerates it.

`postbuild` also writes `dist/sitemap-index.xml`, which lists the sitemaps of
the vanshul.com family from `sitemap-sites.json`.

**Submission**: submit `https://vanshul.com/sitemap-index.xml` in Google
Search Console (see [seo.md](seo.md#owner-operations-and-limitations)).

---

### Per-page metadata (runtime)

Every public route is first served from a prerendered file with its own
metadata (next section). After React starts, the
[`useSeo`](../src/hooks/useSeo.js) hook (used by `HomeMetadata` in `App.jsx`
and by every page) updates the document head for the current route and
restores the previous values when the route unmounts. For a post it sets:

- a unique `<title>` and `<meta name="description">`,
- `<link rel="canonical">` to the post URL,
- Open Graph + Twitter tags (title/description/url/image/type=article) and
  `article:*` tags,
- the post's `BlogPosting` and `BreadcrumbList` **JSON-LD** (headline,
  description, `datePublished`, author, publisher, …).

It updates the existing tags from `index.html` in place, so there are never
duplicate `<title>`/description tags.

### Prerendered shells (for non-JS crawlers)

[`scripts/prerender-blog.mjs`](../scripts/prerender-blog.mjs) runs as the
`postbuild` npm script. It reads the built `dist/index.html` and writes:

- `dist/index.html`: the same file plus the homepage JSON-LD;
- `dist/blog/<slug>/index.html`: the post's title, description, canonical,
  Open Graph, Twitter and `article:*` tags and its JSON-LD;
- `dist/blog/index.html` and `dist/reading-list/index.html`: their own
  metadata and JSON-LD.

Every file also gets readable content inside `#root` (see
[seo.md](seo.md#readable-html-and-input-validation)), and these URLs return a
direct `200`. The SPA still boots from them; `useSeo` then sets the same values
at runtime.

### Per-post social cards

- [`scripts/generate-og-images.mjs`](../scripts/generate-og-images.mjs) (run in
  `prebuild`) renders a unique 1200×630 card per post — title + category — into
  `public/og/<slug>.png` (git-ignored, regenerated each build). Posts reference
  it via `og:image`; the home page uses the default `og-image.png`.

---

### robots.txt
**Location**: `public/robots.txt`

**Purpose**: Control search engine crawling behavior.

**Content**:
```
User-agent: *
Allow: /
Sitemap: https://vanshul.com/sitemap.xml
Sitemap: https://vanshul.com/sitemap-index.xml
```

**Rules**:
- `Allow: /` - All pages crawlable
- Points to the sitemap and the family sitemap index

On the live site Cloudflare prepends its own managed rules to this file (see
[DNS and Cloudflare](#dns-and-cloudflare)).

---

### Base meta tags
**Location**: `index.html`

Defaults for the home page (and the template every prerendered file starts
from): title, description, keywords, author, a `robots` directive with
`max-image-preview:large`, canonical, the RSS `alternate` link, the Google
Search Console verification tag, Open Graph tags and Twitter Card tags with
`twitter:site`/`twitter:creator` handles. Open Graph/Twitter image URLs are
**absolute** (`https://vanshul.com/...`), which social scrapers require.

`index.html` carries no JSON-LD. The homepage's `WebSite`, `Person` and
`ProfilePage` graph is added to `dist/index.html` by the prerender step and by
`HomeMetadata` at runtime; blog posts emit a `BreadcrumbList` alongside their
`BlogPosting` data.

### Icons & manifest

- [`public/panda.svg`](../public/panda.svg) is the source of truth for the
  brand mark. [`scripts/generate-icons.mjs`](../scripts/generate-icons.mjs)
  renders the raster set (`panda-32.png`, `panda-apple-touch.png`,
  `panda-192.png`, `panda-512.png`) from it via `sharp` — rerun after changing the
  SVG.
- [`public/site.webmanifest`](../public/site.webmanifest) lists `panda.svg`,
  `panda-192.png` and `panda-512.png` (also as a maskable icon) with the site
  name, description and theme colours. `index.html` links `panda.svg`,
  `panda-32.png` and `panda-apple-touch.png` directly.
- The social preview card [`public/og-image.png`](../public/og-image.png) is
  generated by [`scripts/generate-og-image.mjs`](../scripts/generate-og-image.mjs).

---

## Deployment Checklist

### Before First Deployment
Already done for vanshul.com; listed for a new setup.
- [ ] Set **Settings → Pages → Source** to GitHub Actions
- [ ] Set the custom domain and enable **Enforce HTTPS**
- [ ] Point DNS at GitHub Pages (see [DNS and Cloudflare](#dns-and-cloudflare))
- [ ] Add the `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and (optional)
  `VITE_GOATCOUNTER_CODE` repository secrets
- [ ] Test the build locally: `npm run build && npm run preview`

### Before Each Deployment
- [ ] Test changes locally: `npm run dev`
- [ ] Run the release gate: `npm run check`
- [ ] Commit changes to `main` and push: `git push origin main`
- [ ] Watch the workflow run until the `deploy` job succeeds
- [ ] Test the live site (home page, blog posts, navigation)
- [ ] Check the browser console for errors

### After Deployment
- [ ] Verify the custom domain over https
- [ ] Test direct post URLs with the trailing slash (`vanshul.com/blog/<slug>/`)
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags (View Source)
- [ ] Check that `sitemap.xml` and `sitemap-index.xml` load

---

## Troubleshooting

### A Tab Opened Before a Deploy Shows "This page didn't load"
Each deploy replaces every hashed file in `assets/`, so a tab that loaded the
previous build cannot fetch that build's lazy chunks any more. `RouteError`
reloads such a tab once on its own, which picks up the new build. If the page
still fails within ten seconds (or the visitor is offline), it stays on "This
page didn't load" with **Reload page** and **Back home**. Nothing needs to be
done on the server.

### 404 Errors on Blog Posts
**Symptom**: Direct URLs to blog posts return 404.

**Solutions**:
1. Confirm the slug is published: `dist/blog/<slug>/index.html` must exist after
   `npm run build`, and `npm run verify:build` must pass
2. Remember that `/blog/<slug>` redirects to `/blog/<slug>/` (expected)
3. For client-only routes, check `public/404.html` exists with
   `pathSegmentsToKeep = 0`, and `base: '/'` in `vite.config.js`
4. Check that the latest workflow run on `main` deployed
5. Clear browser cache and test in incognito

---

### Custom Domain Not Working
**Symptom**: Site loads at `username.github.io` but not custom domain.

**Solutions**:
1. Check the custom domain in **Settings → Pages**
2. Check that the DNS records (in Cloudflare) point at GitHub Pages
3. Allow time for DNS changes to propagate
4. Check that **Enforce HTTPS** is still enabled

---

### Build Fails
**Symptom**: `npm run build` errors out.

**Solutions**:
1. Check the Node.js version against `package.json` engines
   (`^22.12.0 || ^24.0.0 || >=26.0.0`)
2. Reinstall the locked dependencies: `rm -rf node_modules dist && npm ci`
3. Read the `prebuild` error: a post with a missing title, an invalid or
   duplicate slug, or an invalid date fails the build on purpose
4. Fix ESLint errors: `npm run lint`
5. Review error stack trace for specific file/line

---

### Site Not Updating After Deploy
**Symptom**: Changes not visible on live site.

**Solutions**:
1. Check that the workflow run finished and its `deploy` job ran (it runs only
   for `main`)
2. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Allow for caching: HTML was served with `max-age=600` and hashed assets with
   `max-age=14400`
4. Files with fixed names (images) need a new URL when their bytes change

---

### Performance Issues
**Symptom**: Slow page loads, large bundle size.

**Solutions**:
1. Check bundle sizes in the `npm run build` output
2. List what the entry HTML loads up front:
   `grep -o 'assets/[a-zA-Z0-9._-]*\.js' dist/index.html | sort -u`
3. Run `npm run verify:build`, which rejects eagerly loaded heavy chunks
4. Lazy load components: `React.lazy()` and `Suspense`
5. Optimize images (compress, use WebP)

---

## Performance

What the build and app already do:
1. **Code splitting**: manual vendor chunks and lazy routes, guarded by
   `verify:build`
2. **Deferred work**: decorative layers and the hero scene load after idle
3. **Images**: WebP, with `loading="lazy"` on project images and the About
   photo
4. **Fonts**: self-hosted variable fonts; the latin Inter and Space Grotesk
   files are preloaded with the document and nothing is fetched from a third
   party (see [styles.md](styles.md#where-styles-live))
5. **Minification and tree-shaking**: Vite production defaults

### Measuring
No Lighthouse run or field monitoring is part of CI. Use PageSpeed Insights or
Lighthouse by hand. Monitoring field Core Web Vitals (LCP, INP, CLS) is listed
as a proposal in [FEATURES.md](../FEATURES.md).

---

## Rollback Procedure

### Revert to Previous Deployment
```bash
git revert <bad-commit>     # creates a new commit that undoes it
git push origin main        # the workflow tests and deploys the reverted state
```

Do not push to the `gh-pages` branch to roll back: the live site is not served
from it.

---

## Best Practices

1. **Test Locally First**: run `npm run check` before pushing to `main`
2. **One Path to Production**: deploy only through the workflow
3. **Monitor Errors**: Check browser console on live site
4. **Cache Awareness**: Hard refresh when testing updates
5. **DNS Changes**: Allow time for propagation
6. **HTTPS Only**: Always use HTTPS (enforced by GitHub Pages)

---

## Related Documentation
- [config.md](config.md) - Configuration files, environment variables and scripts
- [architecture.md](architecture.md) - Project structure and routing
- [seo.md](seo.md) - URL policy, metadata and owner operations
- GitHub Pages docs: https://docs.github.com/en/pages
- spa-github-pages: https://github.com/rafgraph/spa-github-pages
