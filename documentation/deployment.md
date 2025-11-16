# Deployment Documentation

## Overview
This project deploys to **GitHub Pages**, a free static hosting platform for GitHub repositories. The deployment leverages the `gh-pages` package to automate the process, and implements a custom SPA (Single Page Application) routing solution to support client-side routing with `react-router-dom`.

---

## GitHub Pages Setup

### Repository Configuration
**Repository**: `vanshulgoyal101/vanshul-portfolio`
**Branch**: `main` (source code)
**Deployment Branch**: `gh-pages` (auto-generated)
**Custom Domain**: `vanshul.com`

### GitHub Settings
1. Navigate to repository **Settings** → **Pages**
2. **Source**: Deploy from branch `gh-pages`
3. **Folder**: `/` (root)
4. **Custom domain**: `vanshul.com`
5. **Enforce HTTPS**: ✅ Enabled

### DNS Configuration
External DNS provider must point to GitHub Pages:

**A Records**:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Or CNAME Record**:
```
vanshulgoyal101.github.io
```

**Verification**: Takes 24-48 hours for DNS propagation

---

## Deployment Process

### Automated Deployment
**Command**: `npm run deploy` or `make deploy`

**Steps**:
1. **Pre-deploy Hook**: Runs `npm run build` automatically (via `predeploy` script)
2. **Build Process**: Vite generates optimized production bundle in `dist/`
3. **Deploy**: `gh-pages` package pushes `dist/` contents to `gh-pages` branch
4. **GitHub Pages**: Detects new commit on `gh-pages` branch, rebuilds site
5. **Live**: Site updated at `https://vanshul.com` within 1-2 minutes

**Full Workflow**:
```bash
# Make changes to code
git add .
git commit -m "Your changes"
git push origin main

# Deploy to GitHub Pages
npm run deploy
```

### Manual Deployment
```bash
# Step 1: Build production bundle
npm run build

# Step 2: Deploy dist/ to gh-pages branch
npx gh-pages -d dist
```

---

## Build Configuration

### Vite Build Output
**Output Directory**: `dist/`

**Structure**:
```
dist/
├── index.html              # Entry point with SPA routing script
├── 404.html                # SPA routing fallback for GitHub Pages
├── CNAME                   # Custom domain configuration
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # Site structure for SEO
├── assets/
│   ├── index-[hash].js     # Main application bundle
│   ├── index-[hash].css    # Compiled styles
│   ├── react-vendor-[hash].js        # React dependencies
│   ├── animation-vendor-[hash].js    # Animation libraries
│   └── three-vendor-[hash].js        # 3D graphics libraries
└── images/
    └── projects/           # Project images
```

### Code Splitting
Optimized vendor bundles for better caching:

**react-vendor.js**:
- `react`
- `react-dom`
- `react-router-dom`

**animation-vendor.js**:
- `framer-motion`
- `gsap`

**three-vendor.js**:
- `three`
- `@react-three/fiber`
- `@react-three/drei`

**Benefits**:
- Smaller main bundle size
- Better caching (vendor code changes less frequently)
- Faster subsequent page loads

### Build Optimization
- **Minification**: JS/CSS minified
- **Tree-shaking**: Unused code removed
- **Asset hashing**: Cache busting with content-based hashes
- **Gzip compression**: Automatic on GitHub Pages
- **Code splitting**: Manual chunks for optimal loading

---

## SPA Routing Workaround

### Problem
GitHub Pages serves static files only. When a user navigates directly to `vanshul.com/blog/health-post-agi`, GitHub Pages looks for a physical file at that path, finds nothing, and returns a 404 error.

### Solution
Two-script system that intercepts 404s and restores client-side routing:

---

### 1. 404.html (Capture & Redirect)
**Location**: `public/404.html`

**Purpose**: Intercept 404 errors and convert path to query string.

**Process**:
```
User navigates to: vanshul.com/blog/health-post-agi
        ↓
GitHub Pages: "404 - No file found"
        ↓
Serves: 404.html
        ↓
Script runs: Converts path to query string
        ↓
Redirects to: vanshul.com/?/blog/health-post-agi
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
- Preserves hash fragments (`#section`)
- Minimal redirect (no page reload after restoration)

---

### 2. index.html Script (Decode & Restore)
**Location**: `index.html` (before React app loads)

**Purpose**: Decode query string and restore clean URL.

**Process**:
```
Page loads: vanshul.com/?/blog/health-post-agi
        ↓
Script runs: Detects /?/... pattern
        ↓
Decodes: ~and~ → &
        ↓
history.replaceState: Restores clean URL
        ↓
Final URL: vanshul.com/blog/health-post-agi
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
**Location**: `public/sitemap.xml`

**Purpose**: Help search engines discover and index all pages.

**Example**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vanshul.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vanshul.com/blog/health-post-agi</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Additional blog posts -->
</urlset>
```

**Maintenance**: Update manually when adding new blog posts or pages.

**Submission**: Submit to Google Search Console for faster indexing.

---

### robots.txt
**Location**: `public/robots.txt`

**Purpose**: Control search engine crawling behavior.

**Content**:
```
User-agent: *
Allow: /

Sitemap: https://vanshul.com/sitemap.xml
```

**Rules**:
- `Allow: /` - All pages crawlable
- Points to sitemap for discovery

---

### Meta Tags
**Location**: `index.html`

**SEO Optimization**:
```html
<meta name="description" content="Vanshul Goyal's portfolio - Software Engineer specializing in React, Web3, and AI">
<meta name="keywords" content="Vanshul Goyal, Portfolio, React, Web Development, AI">
<meta name="author" content="Vanshul Goyal">

<!-- Open Graph (Social Sharing) -->
<meta property="og:title" content="Vanshul Goyal - Portfolio">
<meta property="og:description" content="Software Engineer Portfolio">
<meta property="og:image" content="https://vanshul.com/images/og-image.png">
<meta property="og:url" content="https://vanshul.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Vanshul Goyal - Portfolio">
<meta name="twitter:description" content="Software Engineer Portfolio">
<meta name="twitter:image" content="https://vanshul.com/images/twitter-card.png">
```

---

## Deployment Checklist

### Before First Deployment
- [ ] Configure DNS records (A or CNAME)
- [ ] Add CNAME file to `public/` directory
- [ ] Create 404.html in `public/` directory
- [ ] Add SPA routing script to index.html
- [ ] Update sitemap.xml with all pages
- [ ] Configure GitHub Pages settings (branch, custom domain)
- [ ] Test build locally: `npm run build && npm run preview`

### Before Each Deployment
- [ ] Test changes locally: `npm run dev`
- [ ] Run linter: `npm run lint`
- [ ] Build and preview: `npm run build && npm run preview`
- [ ] Commit changes to `main` branch
- [ ] Push to GitHub: `git push origin main`
- [ ] Deploy: `npm run deploy`
- [ ] Wait 1-2 minutes for GitHub Pages rebuild
- [ ] Test live site (home page, blog posts, navigation)
- [ ] Check browser console for errors

### After Deployment
- [ ] Verify custom domain works (http and https)
- [ ] Test direct blog post URLs (e.g., vanshul.com/blog/slug)
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags (View Source)
- [ ] Test performance (Lighthouse)
- [ ] Check sitemap.xml accessibility

---

## Troubleshooting

### 404 Errors on Blog Posts
**Symptom**: Direct URLs to blog posts return 404.

**Solutions**:
1. Verify `404.html` exists in `public/` directory
2. Check `pathSegmentsToKeep = 0` in 404.html script
3. Ensure `base: '/'` in vite.config.js
4. Redeploy: `npm run deploy`
5. Clear browser cache and test in incognito

---

### Custom Domain Not Working
**Symptom**: Site loads at `username.github.io` but not custom domain.

**Solutions**:
1. Check CNAME file exists in `public/CNAME` with correct domain
2. Verify DNS records point to GitHub Pages IPs
3. Wait 24-48 hours for DNS propagation
4. Check GitHub Pages settings (custom domain field)
5. Enable "Enforce HTTPS" (may take up to 1 hour)

---

### Build Fails
**Symptom**: `npm run build` errors out.

**Solutions**:
1. Check Node.js version (requires 16+)
2. Clear cache: `rm -rf node_modules dist && npm install`
3. Fix ESLint errors: `npm run lint`
4. Check for missing dependencies
5. Review error stack trace for specific file/line

---

### Site Not Updating After Deploy
**Symptom**: Changes not visible on live site.

**Solutions**:
1. Wait 1-2 minutes (GitHub Pages rebuild time)
2. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Clear browser cache
4. Check `gh-pages` branch has new commit
5. Verify build succeeded (check GitHub Actions tab)

---

### Performance Issues
**Symptom**: Slow page loads, large bundle size.

**Solutions**:
1. Check bundle size: `npm run build` (review output)
2. Analyze bundle: `npx vite-bundle-visualizer`
3. Lazy load components: `React.lazy()` and `Suspense`
4. Optimize images (compress, use WebP)
5. Review code splitting in vite.config.js

---

## Continuous Deployment (Optional)

### GitHub Actions Workflow
Automate deployment on every push to `main`:

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: vanshul.com
```

**Benefits**:
- Automatic deployment on every commit
- No manual `npm run deploy` needed
- Consistent build environment

---

## Performance Optimization

### Lighthouse Targets
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### Optimization Strategies
1. **Code Splitting**: Vendor chunks (react, animations, three.js)
2. **Image Optimization**: WebP format, lazy loading
3. **Caching**: Asset hashing, long cache times
4. **Minification**: Vite auto-minifies JS/CSS
5. **Tree-shaking**: Dead code elimination
6. **Gzip**: GitHub Pages auto-compresses

### Monitoring
- Google PageSpeed Insights
- Lighthouse CI (optional)
- Web Vitals (CLS, FID, LCP)

---

## Rollback Procedure

### Revert to Previous Deployment
```bash
# Method 1: Redeploy specific commit
git checkout <previous-commit-hash>
npm run deploy

# Method 2: Force push old gh-pages
git push -f origin <old-commit>:gh-pages
```

### Emergency Rollback
1. Identify working commit in `gh-pages` branch
2. Reset `gh-pages` to that commit
3. GitHub Pages auto-rebuilds from reset commit

---

## Best Practices

1. **Test Locally First**: Always run `npm run preview` before deploying
2. **Commit Before Deploy**: Ensure `main` branch is up to date
3. **Update Sitemap**: Add new blog posts to sitemap.xml
4. **Monitor Errors**: Check browser console on live site
5. **Cache Awareness**: Hard refresh when testing updates
6. **DNS Changes**: Allow 24-48 hours for propagation
7. **HTTPS Only**: Always use HTTPS (enforced by GitHub Pages)
8. **Version Control**: Tag releases with `git tag v1.0.0`

---

## Related Documentation
- `config.md` - Configuration files and build settings
- `architecture.md` - Project structure and routing
- GitHub Pages docs: https://docs.github.com/en/pages
- spa-github-pages: https://github.com/rafgraph/spa-github-pages
