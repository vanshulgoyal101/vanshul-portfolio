# Project Architecture

## Overview
This is a modern React portfolio website built with Vite, using styled-components for styling and Framer Motion for animations. The project is organized for scalability and maintainability.

## Main Folders
- **src/**: Source code for the application
  - **components/**: All React components, grouped by feature
  - **hooks/**: Custom React hooks
  - **styles/**: Global and shared styles
  - **index.css**: Base CSS
  - **App.jsx**: Main app component
  - **main.jsx**: Entry point
- **public/**: Static assets (images, robots.txt, sitemap, etc.)
- **dist/**: Production build output

## Flow
- `main.jsx` renders `App.jsx` into the root div in `index.html`.
- Routing and navigation are handled within components (no external router).
- State is managed locally within components and hooks.

## Technologies
- React
- Vite
- styled-components
- Framer Motion
- React Icons

## Build & Dev
- Run `npm run dev` for development (Vite server)
- Run `npm run build` for production

## Extensibility
- Add new features by creating new folders in `src/components/`
- Global styles and variables are managed in `src/styles/GlobalStyles.js` and CSS files
