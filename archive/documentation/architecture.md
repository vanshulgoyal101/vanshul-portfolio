# Project Architecture

## Overview
This is a modern React portfolio website built with Vite, using styled-components for styling and Framer Motion for animations. The project is a Single Page Application (SPA) with client-side routing, optimized for GitHub Pages deployment. The architecture prioritizes accessibility (WCAG 2.1 Level AA), responsive design, and perceived performance through skeleton loading states.

## Main Folders
- **src/**: Source code for the application
  - **components/**: All React components, grouped by feature
    - **Blog/**: Blog listing, cards, and modal
    - **Toast/**: Global toast notification system
    - **Skeleton/**: Loading state placeholders
    - **Navigation/**: Site navigation with scroll-to-section
    - **Contact/**: Contact form with validation
    - **Hero/**: Landing section with 3D canvas
    - **About/**, **Work/**, **Projects/**, **Timeline/**: Content sections
    - **FunElements/**: Decorative animations (airplane trail, rocket, panda cursor)
  - **pages/**: Route-based page components
    - **BlogPost.jsx**: Individual blog post view
  - **blogs/**: Markdown blog post files with frontmatter
  - **hooks/**: Custom React hooks
  - **utils/**: Utility functions (blog loading, markdown parsing)
  - **constants/**: Static data and configuration
  - **styles/**: Global and shared styles
  - **index.css**: Base CSS with global variables
  - **App.jsx**: Main app component with routing
  - **main.jsx**: Entry point
- **public/**: Static assets
  - **404.html**: GitHub Pages SPA routing fallback
  - **images/**: Project images and assets
  - **robots.txt**, **sitemap.xml**: SEO configuration
  - **CNAME**: Custom domain configuration
- **documentation/**: Comprehensive code documentation
- **dist/**: Production build output (generated)

## Routing & Navigation
- **Client-Side Routing**: Uses `react-router-dom` v7.9.6
  - Routes:
    - `/` - Home page (all sections)
    - `/blog/:slug` - Individual blog posts
- **GitHub Pages SPA Workaround**:
  - `public/404.html`: Intercepts 404 errors, converts path to query string, redirects to `index.html`
  - `index.html`: Script detects query string, restores proper URL before React loads
  - Enables direct blog post URLs (e.g., `vanshul.com/blog/health-post-agi`) without 404 errors
- **Scroll Navigation**: 
  - Same-page: Uses `useSmoothScroll` hook with smooth scrolling
  - Cross-page: `Navigation.jsx` uses `useNavigate` + `useLocation` with 500ms delay for DOM rendering
  - Prevents scroll timing issues and double-click requirements

## State Management
- **Local State**: Component-level state with `useState`, `useEffect`, `useCallback`
- **Context API**: 
  - **ToastProvider**: Global toast notification system
    - Manages notification queue, auto-dismiss (5s), manual close
    - Consumed via `useToast` hook in components (e.g., Contact form)
- **URL State**: Route parameters managed by `react-router-dom`

## Technologies
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: react-router-dom 7.9.6
- **Styling**: styled-components 6.1.19 (CSS-in-JS)
- **Animation**: Framer Motion 12.23.9, GSAP 3.13.0
- **3D Graphics**: Three.js 0.178.0, @react-three/fiber 9.2.0, @react-three/drei 10.6.1
- **Markdown**: gray-matter 4.0.3, react-markdown 10.1.0
- **Smooth Scrolling**: @studio-freight/lenis 1.0.42
- **Icons**: react-icons 5.5.0
- **Deployment**: gh-pages 6.3.0
- **Linting**: ESLint 9.30.1

## Data Flow
1. **App Load**: `main.jsx` → `App.jsx` (wrapped with `ToastProvider`)
2. **Routing**: `react-router-dom` determines active route
3. **Blog Posts**: 
   - `import.meta.glob` loads `.md` files from `src/blogs/`
   - `gray-matter` parses frontmatter (title, date, summary, author)
   - `react-markdown` renders blog content
4. **Navigation**:
   - Home page: Scroll to section using `useSmoothScroll`
   - Blog posts: Navigate to `/blog/:slug` route
   - Cross-page: 500ms delay ensures DOM renders before scrolling
5. **Loading States**:
   - Skeleton loaders show during async operations
   - Contact form: Disabled inputs + CSS spinner during submission
6. **Notifications**: Toast system provides non-intrusive feedback

## Build & Dev
- **Development**: `npm run dev` (Vite dev server with hot reload)
- **Production Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview` (preview production build locally)
- **Deploy**: `npm run deploy` (builds and deploys to GitHub Pages)
- **Makefile Shortcuts**:
  - `make dev`, `make build`, `make preview`, `make clean`, `make install`, `make setup`

## Deployment Architecture
- **Platform**: GitHub Pages (static hosting)
- **Custom Domain**: `vanshul.com` (configured via CNAME)
- **Build Process**:
  1. `npm run build` generates optimized production bundle
  2. `gh-pages` package pushes `dist/` to `gh-pages` branch
  3. GitHub Pages serves from `gh-pages` branch
- **SPA Routing**: See "Routing & Navigation" section above
- **SEO**: `sitemap.xml`, `robots.txt`, meta tags in `index.html`

## Accessibility & Design System
- **WCAG 2.1 Level AA Compliance**:
  - Focus-visible states: 3px outline offset for keyboard navigation
  - Touch targets: Minimum 44-48px for mobile
  - Semantic HTML and ARIA labels where needed
- **Design System**:
  - Spacing tokens: `2xl`, `xl`, `lg`, `md` (consistent across sections)
  - Typography scale: Responsive font sizes with mobile breakpoints
  - Color variables: CSS custom properties for theming
- **Text Clamping**: `-webkit-line-clamp` for uniform card heights
- **Animations**: 
  - Hover effects: `translateY(-5px)` with 0.3s transition
  - Skeleton shimmer: Linear gradient animation
  - Toast slide-in: Framer Motion animations

## Extensibility
- **New Components**: Create folder in `src/components/` with feature-based structure
- **New Routes**: Add route in `App.jsx`, create page component in `src/pages/`
- **New Blog Posts**: Add `.md` file to `src/blogs/` with frontmatter
- **Global Styles**: Update `src/styles/GlobalStyles.js` or `src/index.css`
- **Toast Notifications**: Use `useToast()` hook in any component
- **Skeleton Loaders**: Import from `src/components/Skeleton/`
