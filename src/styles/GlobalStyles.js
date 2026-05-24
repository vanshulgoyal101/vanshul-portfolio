// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Palette - Cosmic Obsidian & Solar Amber/Celestial Blue */
    --color-bg-primary: #070a13;
    --color-bg-secondary: #0c0f1a;
    --color-bg-tertiary: #111624;
    --color-bg-card: #161d2e;
    
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    
    --color-accent-primary: #f59e0b; /* Solar Gold/Amber */
    --color-accent-secondary: #38bdf8; /* Celestial Sky Blue */
    --color-accent-glow: #fbbf24;
    
    --color-gradient-1: linear-gradient(135deg, #f59e0b 0%, #38bdf8 100%);
    --color-gradient-2: linear-gradient(135deg, #0c1527 0%, #1e293b 100%);
    
    --color-border: rgba(255, 255, 255, 0.06);
    --color-border-hover: rgba(255, 255, 255, 0.12);
    
    /* Fluid Spacing - scales with viewport */
    --spacing-xs: clamp(0.25rem, 0.5vw, 0.5rem);
    --spacing-sm: clamp(0.5rem, 1vw, 1rem);
    --spacing-md: clamp(1rem, 2vw, 2rem);
    --spacing-lg: clamp(1.5rem, 3vw, 3rem);
    --spacing-xl: clamp(2.5rem, 5vw, 5rem);
    --spacing-2xl: clamp(4rem, 8vw, 8rem);
    
    /* Container widths */
    --container-xs: 100%;
    --container-sm: 640px;
    --container-md: 768px;
    --container-lg: 1024px;
    --container-xl: 1200px;
    
    /* Fluid container padding */
    --container-padding: clamp(1.5rem, 5vw, 4rem);
    
    /* Typography - Fluid font sizes */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-display: 'Space Grotesk', 'Inter', sans-serif;
    --font-serif: 'Lora', 'Georgia', serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    
    --text-xs: clamp(0.75rem, 1.5vw, 0.875rem);
    --text-sm: clamp(0.875rem, 2vw, 1rem);
    --text-base: clamp(1rem, 2.5vw, 1.125rem);
    --text-lg: clamp(1.125rem, 3vw, 1.25rem);
    --text-xl: clamp(1.25rem, 3.5vw, 1.5rem);
    --text-2xl: clamp(1.5rem, 4vw, 1.875rem);
    --text-3xl: clamp(1.875rem, 5vw, 2.25rem);
    --text-4xl: clamp(2.25rem, 6vw, 3rem);
    --text-5xl: clamp(3rem, 8vw, 4rem);
    --text-6xl: clamp(3.75rem, 10vw, 5.5rem);
    
    /* Animations */
    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Z-index layers */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal: 400;
    --z-tooltip: 500;
  }

  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-bg-primary);
  }

  body {
    font-family: var(--font-primary);
    font-size: var(--text-base);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  /* Headings - clean and classy geometric */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
  }

  h1 { font-size: var(--text-6xl); }
  h2 { font-size: var(--text-5xl); }
  h3 { font-size: var(--text-3xl); }
  h4 { font-size: var(--text-2xl); }
  h5 { font-size: var(--text-xl); }
  h6 { font-size: var(--text-lg); }

  p {
    color: var(--color-text-secondary);
    line-height: 1.75;
    font-size: var(--text-base);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: var(--transition-base);
    
    &:hover {
      color: var(--color-accent-primary);
    }
  }

  /* Custom Selection */
  ::selection {
    background-color: rgba(245, 158, 11, 0.2);
    color: var(--color-text-primary);
  }

  /* Custom Scrollbar - Minimal & Thin */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-bg-card);
    border-radius: 3px;
    border: 1px solid var(--color-bg-primary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-primary);
  }

  /* Layout Utilities */
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 var(--container-padding);
    max-width: var(--container-xl);
  }

  .section {
    padding: var(--spacing-2xl) 0;
    position: relative;
    z-index: 2;
  }

  /* High-end glassmorphism border card */
  .editorial-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: var(--spacing-lg);
    transition: var(--transition-base);
    
    &:hover {
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  }

  /* WCAG Accessible Focus Rings */
  *:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  /* Print Styles */
  @media print {
    body {
      background: white;
      color: black;
    }
    .no-print {
      display: none !important;
    }
  }

  /* Media query for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;