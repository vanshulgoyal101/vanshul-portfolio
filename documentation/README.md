# Vanshul Portfolio Documentation

This folder contains comprehensive documentation for the entire codebase, including architecture, components, hooks, styles, assets, configuration, deployment, and accessibility. Use these documents for context engineering, onboarding, and future development.

## Structure
- **`architecture.md`**: High-level overview of project structure, routing (react-router-dom), GitHub Pages SPA setup, state management (Context API), data flow, and technologies.
- **`components.md`**: Detailed documentation of all React components including Toast system, Skeleton loaders, Blog components (BlogCard with text clamping, BlogModal), Navigation (cross-page routing), Contact (loading states), and all section components.
- **`hooks.md`**: Custom hooks including useSmoothScroll (Lenis integration), useToast (notification system), and React Router hooks (useNavigate, useLocation) with navigation patterns.
- **`styles.md`**: Design system (spacing tokens, typography scale, color palette), accessibility features (focus-visible states, WCAG compliance), text clamping patterns, animation patterns (shimmer, slide-in), responsive breakpoints, and styled-components usage.
- **`config.md`**: Configuration files (package.json, vite.config.js, eslint.config.js, Makefile), GitHub Pages setup (404.html, CNAME, robots.txt, sitemap.xml), build optimization, and deployment scripts.
- **`deployment.md`**: GitHub Pages deployment workflow, SPA routing workaround (404.html redirect system), build process, code splitting, SEO configuration, troubleshooting, and rollback procedures.
- **`accessibility.md`**: WCAG 2.1 Level AA compliance, keyboard navigation, focus management, touch targets (44-48px minimum), color contrast, screen reader optimization, ARIA patterns, and testing procedures.
- **`assets.md`**: Images, public assets, and file organization.
- **`data.md`**: Static data, JSON files, and blog post structure.
- **`blog-refactor.md`**: Blog system refactoring history and markdown integration.

## Recent Updates
All documentation has been updated to reflect:
- **Routing**: react-router-dom v7.9.6 with GitHub Pages SPA workaround (404.html redirect system)
- **State Management**: Context API for global Toast notification system
- **Components**: Toast notifications, Skeleton loaders (BlogSkeletonCard, ProjectSkeletonCard, WorkSkeletonCard), BlogCard with uniform heights (text clamping), Navigation with cross-page routing logic
- **Accessibility**: WCAG 2.1 Level AA compliance with focus-visible states (3px outline), touch targets (44-48px), keyboard navigation, screen reader optimization
- **Design System**: Spacing tokens (2xl, xl, lg, md), fluid typography with clamp(), text clamping patterns (-webkit-line-clamp), animation patterns (shimmer, slide-in)
- **Deployment**: GitHub Pages with custom domain (vanshul.com), automated deployment via gh-pages package, code splitting for optimal loading

## Usage
Each document is designed to be self-contained and exhaustive for its topic. Start with `architecture.md` for project overview, then dive into specific areas as needed.

## Maintenance
Update documentation when:
- Adding new components or features
- Modifying routing or state management
- Changing build or deployment process
- Updating accessibility patterns
- Refactoring existing code

Keep documentation in sync with code to ensure accuracy and usefulness for future development.

