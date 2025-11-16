# Configuration Documentation

## Overview
Configuration files manage build processes, development environment, linting rules, and deployment settings. Located at the project root, these files define how the application is developed, built, and deployed.

---

## Main Config Files

### package.json
**Purpose**: Project metadata, dependencies, and npm scripts.

**Key Sections**:

**Dependencies** (Production):
```json
{
  "@react-three/drei": "^10.6.1",
  "@react-three/fiber": "^9.2.0",
  "@studio-freight/lenis": "^1.0.42",
  "framer-motion": "^12.23.9",
  "gray-matter": "^4.0.3",
  "gsap": "^3.13.0",
  "prop-types": "^15.8.1",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-icons": "^5.5.0",
  "react-markdown": "^10.1.0",
  "react-router-dom": "^7.9.6",
  "styled-components": "^6.1.19",
  "three": "^0.178.0"
}
```

**DevDependencies**:
```json
{
  "@eslint/js": "^9.30.1",
  "@types/react": "^19.1.8",
  "@types/react-dom": "^19.1.6",
  "@vitejs/plugin-react": "^4.6.0",
  "eslint": "^9.30.1",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "gh-pages": "^6.3.0",
  "globals": "^16.3.0",
  "vite": "^7.0.4"
}
```

**Scripts**:
- `dev`: Start Vite dev server (`vite`)
- `build`: Create production build (`vite build`)
- `lint`: Run ESLint on all files (`eslint .`)
- `preview`: Preview production build locally (`vite preview`)
- `predeploy`: Auto-run before deploy (runs `build`)
- `deploy`: Deploy to GitHub Pages (`gh-pages -d dist`)

**Homepage**: `https://vanshul.com` - Custom domain for GitHub Pages

---

### vite.config.js
**Purpose**: Vite build tool configuration.

**Configuration**:
```javascript
export default defineConfig({
  plugins: [react()], // React plugin for JSX/Fast Refresh
  base: '/',          // Base public path (root for custom domain)
  
  build: {
    outDir: 'dist',      // Output directory
    assetsDir: 'assets', // Assets subdirectory
    
    // Code splitting for optimal loading
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
```

**Features**:
- **Code Splitting**: Separate vendor bundles for better caching
- **React Plugin**: JSX transformation, Fast Refresh
- **Optimized Dependencies**: Pre-bundled for faster dev server startup

**Build Output**:
- `dist/index.html` - Entry point
- `dist/assets/` - JS, CSS, images
- Vendor chunks: `react-vendor.js`, `animation-vendor.js`, `three-vendor.js`

---

### eslint.config.js
**Purpose**: JavaScript linting rules and code quality enforcement.

**Configuration**:
- ESLint v9.30.1 (flat config format)
- React-specific rules via `eslint-plugin-react-hooks`
- Enforces React Hooks rules
- Warns on unused variables, console statements (in production)

**Usage**:
```bash
npm run lint
```

**IDE Integration**: VS Code ESLint extension auto-lints on save

---

### Makefile
**Purpose**: Convenient command shortcuts for development workflow.

**Available Commands**:
- `make dev` - Start development server (`npm run dev`)
- `make build` - Build for production (`npm run build`)
- `make preview` - Preview production build (`npm run preview`)
- `make clean` - Clean build artifacts (`rm -rf dist node_modules`)
- `make install` - Install dependencies (`npm install`)
- `make setup` - Install dependencies and start dev server

**Usage**:
```bash
make dev    # Faster than typing npm run dev
make build  # Production build
```

---

## GitHub Pages Configuration

### 404.html
**Location**: `public/404.html`

**Purpose**: Enable SPA routing on GitHub Pages by intercepting 404 errors.

**How It Works**:
1. User navigates to `vanshul.com/blog/health-post-agi`
2. GitHub Pages returns 404 (no physical file at that path)
3. **404.html script runs**:
   - Captures current path (`/blog/health-post-agi`)
   - Converts to query string (`/?/blog/health-post-agi`)
   - Redirects to `index.html` with encoded path
4. `index.html` script (see below) decodes and restores proper URL
5. React Router takes over and renders correct page

**Script Logic**:
- Converts `/path/to/page` → `/?/path/to/page`
- Encodes `&` as `~and~` to preserve query strings
- Preserves hash fragments (`#section`)

**Configuration**:
- `pathSegmentsToKeep = 0` - For custom domain (vanshul.com)
- Set to `1` for project pages (username.github.io/repo-name)

**Byte Requirement**: Must be >512 bytes for IE compatibility (currently met)

### index.html Script
**Location**: `index.html` (before `<div id="root">`)

**Purpose**: Decode query string from 404.html and restore clean URL.

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

**Process**:
- Checks for `/?/...` pattern in URL
- Decodes `~and~` back to `&`
- Uses `history.replaceState` to restore clean URL without page reload
- Runs before React loads, ensuring correct initial route

### CNAME
**Location**: `public/CNAME`

**Purpose**: Configure custom domain for GitHub Pages.

**Content**:
```
vanshul.com
```

**Requirements**:
- DNS A/CNAME records point to GitHub Pages servers
- File must be in `public/` to be copied to `dist/` during build
- One domain per line (no protocol, no www unless intentional)

**DNS Setup** (External):
- A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Or CNAME: `vanshulgoyal101.github.io`

### robots.txt
**Location**: `public/robots.txt`

**Purpose**: Control search engine crawling behavior.

**Example Content**:
```
User-agent: *
Allow: /

Sitemap: https://vanshul.com/sitemap.xml
```

**Rules**:
- `Allow: /` - All pages are crawlable
- Points to sitemap for better indexing

### sitemap.xml
**Location**: `public/sitemap.xml`

**Purpose**: Help search engines discover and index all pages.

**Example Content**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vanshul.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vanshul.com/blog/health-post-agi</loc>
    <priority>0.8</priority>
  </url>
  <!-- More blog posts -->
</urlset>
```

**Maintenance**: Update when adding new blog posts or pages

---

## Environment Variables

### .env Support
Vite supports `.env` files for environment-specific configuration.

**File Types**:
- `.env` - All environments
- `.env.local` - Local overrides (gitignored)
- `.env.production` - Production only
- `.env.development` - Development only

**Usage**:
```bash
# .env
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-123456
```

**Access in Code**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Rules**:
- Must prefix with `VITE_` to be exposed to client
- Never commit `.env.local` with secrets
- Public values only (exposed in client bundle)

**Current Project**: No `.env` file currently used (static site)

---

## Deployment

### GitHub Pages Deployment
**Platform**: GitHub Pages (static hosting)

**Deployment Process**:
1. Run `npm run deploy` (or `make deploy`)
2. `predeploy` script runs `npm run build` automatically
3. `gh-pages` package pushes `dist/` to `gh-pages` branch
4. GitHub Pages serves from `gh-pages` branch
5. Site live at `https://vanshul.com` within 1-2 minutes

**Branch Structure**:
- `main` - Source code
- `gh-pages` - Built static files (auto-generated, don't edit manually)

**Configuration**:
- Repository Settings → Pages → Source: `gh-pages` branch
- Custom domain: `vanshul.com` (configured via CNAME)

### Build Process
```bash
# Manual build
npm run build

# Output
dist/
  index.html
  404.html
  CNAME
  robots.txt
  sitemap.xml
  assets/
    index-[hash].js
    index-[hash].css
    react-vendor-[hash].js
    animation-vendor-[hash].js
    three-vendor-[hash].js
  images/
```

**Optimization**:
- Minified JS/CSS
- Tree-shaking (unused code removal)
- Code splitting (vendor chunks)
- Asset hashing for cache busting
- Gzip compression

---

## Extending

### Adding New Dependencies
```bash
# Production dependency
npm install package-name

# Dev dependency
npm install -D package-name
```

**Update package.json**: Automatically updated by npm

### Modifying Build Configuration
1. Edit `vite.config.js`
2. Add plugins, change output directory, adjust code splitting
3. Test with `npm run build && npm run preview`

### Updating ESLint Rules
1. Edit `eslint.config.js`
2. Add new rules, plugins, or overrides
3. Run `npm run lint` to verify

### Custom Make Commands
Add to `Makefile`:
```makefile
.PHONY: test
test:
	npm test
```

### Environment-Specific Config
Create `.env.production` or `.env.development`:
```bash
VITE_API_URL=https://production-api.com
```

---

## Troubleshooting

### Build Fails
- Check Node.js version (requires 16+)
- Clear `node_modules` and reinstall: `make clean && make install`
- Check for ESLint errors: `npm run lint`

### GitHub Pages 404
- Ensure `404.html` is in `public/` directory
- Verify CNAME file exists and is correct
- Check DNS settings for custom domain
- Wait 1-2 minutes after deployment for cache refresh

### Custom Domain Not Working
- Verify DNS records point to GitHub Pages IPs
- Check CNAME file in `public/` directory
- Ensure "Enforce HTTPS" is enabled in GitHub Settings

### Deployment Issues
- Check `gh-pages` branch exists in repository
- Verify GitHub Actions permissions (if using Actions)
- Ensure `homepage` in package.json matches domain
