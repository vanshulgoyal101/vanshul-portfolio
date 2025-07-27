// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Palette - Deep blacks with electric blue/purple accents */
    --color-bg-primary: #0a0a0a;
    --color-bg-secondary: #0f0f0f;
    --color-bg-tertiary: #141414;
    --color-bg-card: #1a1a1a;
    
    --color-text-primary: #ffffff;
    --color-text-secondary: #a0a0a0;
    --color-text-muted: #666666;
    
    --color-accent-primary: #6366f1;
    --color-accent-secondary: #8b5cf6;
    --color-accent-glow: #818cf8;
    
    --color-gradient-1: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    --color-gradient-2: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    
    --color-border: rgba(255, 255, 255, 0.1);
    --color-border-hover: rgba(255, 255, 255, 0.2);
    
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
    --container-xl: 1280px;
    --container-2xl: 1536px;
    
    /* Fluid container padding */
    --container-padding: clamp(1rem, 5vw, 3rem);
    
    /* Typography - Fluid font sizes */
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-display: 'Space Grotesk', 'Inter', sans-serif;
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
    --text-6xl: clamp(3.75rem, 10vw, 6rem);
    
    /* Animations */
    --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Z-index layers */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal: 400;
    --z-tooltip: 500;
    
    /* Breakpoints for JS usage */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }

  /* CSS Reset with smooth defaults */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    // cursor: none !important;
  }

  html {
    font-size: 100%; /* Respect user's font size preference */
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    
    /* Noise texture overlay for depth */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.02;
      z-index: 1;
      pointer-events: none;
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.02) 35px, rgba(255,255,255,.02) 70px);
    }
  }

  /* Fluid Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  h1 { font-size: var(--text-6xl); }
  h2 { font-size: var(--text-5xl); }
  h3 { font-size: var(--text-4xl); }
  h4 { font-size: var(--text-3xl); }
  h5 { font-size: var(--text-2xl); }
  h6 { font-size: var(--text-xl); }

  p {
    color: var(--color-text-secondary);
    line-height: 1.8;
    font-size: var(--text-base);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: var(--transition-base);
  }

  /* Selection */
  ::selection {
    background-color: var(--color-accent-primary);
    color: var(--color-bg-primary);
  }

  /* Fluid Scrollbar */
  ::-webkit-scrollbar {
    width: clamp(0.5rem, 1vw, 0.75rem);
  }

  ::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-accent-primary);
    border-radius: 0.25rem;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-glow);
  }

  /* Responsive Container */
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 var(--container-padding);
    
    @media (min-width: 640px) {
      max-width: var(--container-sm);
    }
    
    @media (min-width: 768px) {
      max-width: var(--container-md);
    }
    
    @media (min-width: 1024px) {
      max-width: var(--container-lg);
    }
    
    @media (min-width: 1280px) {
      max-width: var(--container-xl);
    }
  }

  /* Fluid Section Spacing */
  .section {
    will-change: auto; /* Only use will-change when needed */
    padding: var(--spacing-2xl) 0;
    overflow: visible !important;
    position: relative !important;
    z-index: 2 !important;
  }

  /* Responsive Grid System */
  .grid {
    display: grid;
    gap: var(--spacing-md);
    
    &.cols-2 {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    }
    
    &.cols-3 {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    }
    
    &.cols-4 {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
    }
  }

  /* Glow effect for interactive elements */
  .glow {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: var(--color-gradient-1);
      border-radius: inherit;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
      filter: blur(clamp(0.5rem, 1vw, 1rem));
    }
    
    &:hover::before {
      opacity: 0.6;
    }
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
  }

  /* Responsive images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  /* Responsive button styles */
  .btn {
    padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
    font-size: var(--text-sm);
    border-radius: 0.25rem;
    transition: var(--transition-base);
  }

  /* Hide elements accessibly */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Touch-friendly tap targets */
  button, a, input, textarea, select {
    min-height: 44px; /* iOS recommendation */
    min-width: 44px;
  }

  /* Media query for reduced motion */
 @media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Hide scrollbar for mobile but keep functionality */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      display: none;
    }
    
    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

      /* Fix sections not showing */
  section {
    min-height: auto !important;
    padding: var(--spacing-lg) 0 !important;
  }
  
    /* Fix container padding */
    .container {
        padding: 0 1rem !important;
    }
    /* Fix font sizes */
    h1 { font-size: var(--text-4xl) !important; }
    h2 { font-size: var(--text-3xl) !important; }
    h3 { font-size: var(--text-2xl) !important; }
    
    /* Fix grid layouts */
    .grid {
        grid-template-columns: 1fr !important;
    }
  }
`;

export default GlobalStyles;