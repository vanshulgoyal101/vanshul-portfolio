const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FloatingRocket-Cf_K105w.js","assets/react-core-CPHnqsFW.js","assets/markdown-DNQhOqsY.js","assets/styled-CHfxRgpd.js","assets/icons-BULprNPD.js","assets/framer-CT4Uel1k.js","assets/RandomTelemetry-DbvP7-Q5.js","assets/react-vendor-BakkmLcC.js","assets/three-react-B1_UnQfd.js","assets/three-core-DYWvvL_X.js","assets/InteractiveSpaceBackground-UTO0iX6I.js"])))=>i.map(i=>d[i]);
import{r as s,j as e,R as fe}from"./react-core-CPHnqsFW.js";import{u as ve,a as be,b as He,L as Be,B as _e,R as Oe,c as X,d as qe}from"./react-vendor-BakkmLcC.js";import{u as Ve,O as Ne,F as Ge,S as De,_ as $,C as Ye}from"./three-react-B1_UnQfd.js";import{f as Xe,d as t,m as G}from"./styled-CHfxRgpd.js";import{H as Ue,a as Je,F as U,b as Qe,M as we,B as ye,c as Ke,d as J,e as Ze,f as et,g as je,h as ke,i as Se,j as Te,k as tt,l as rt,m as ot,n as Q,o as Ie,p as at,q as it,r as nt,s as st,t as lt,u as ze,v as ct,w as dt,x as K,y as pt,z as ht,A as mt,C as gt,D as ut,E as xt,G as ft,I as vt}from"./icons-BULprNPD.js";import{m as d,u as bt,a as V,A as C,b as Z}from"./framer-CT4Uel1k.js";import{M as wt,g as yt}from"./markdown-DNQhOqsY.js";import{r as jt}from"./three-core-DYWvvL_X.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function i(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(n){if(n.ep)return;n.ep=!0;const c=i(n);fetch(n.href,c)}})();const kt=Xe`
  :root {
    /* Color Palette - Deep blacks with electric blue/purple accents */
    --color-bg-primary: #f6f3eb;
    --color-bg-secondary: #f6f3eb;
    --color-bg-tertiary: #edeae0;
    --color-bg-card: #ffffff;
    
    --color-text-primary: #1e293b;
    --color-text-secondary: #475569;
    --color-text-muted: #94a3b8;
    
    --color-accent-primary: #1d4ed8;
    --color-accent-secondary: #3b82f6;
    --color-accent-glow: rgba(29, 78, 216, 0.08);
    
    --color-gradient-1: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    --color-gradient-2: linear-gradient(135deg, #f6f3eb 0%, #ffffff 100%);
    
    --color-border: rgba(30, 41, 59, 0.08);
    --color-border-hover: rgba(30, 41, 59, 0.15);
    
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
    -webkit-tap-highlight-color: transparent;
    // cursor: none !important;
  }

  html {
    font-size: 100%; /* Respect user's font size preference */
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--color-bg-primary);
  }

  body {
    font-family: var(--font-primary);
    font-size: var(--text-base);
    background-color: var(--color-bg-primary);
    background-image: 
      linear-gradient(to right, rgba(30, 41, 59, 0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(30, 41, 59, 0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    background-attachment: fixed;
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
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(29, 78, 216, 0.2);
    border-radius: 100px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(29, 78, 216, 0.6);
    background-clip: padding-box;
  }
  
  /* Firefox Scrollbar standards */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(29, 78, 216, 0.2) transparent;
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

  section {
    scroll-margin-top: 0px;

    @media (max-width: 768px) {
      scroll-margin-top: 40px;
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
    background: rgba(255, 255, 255, 0.55);
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
`,St=t(d.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  transition: 
    top 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    left 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    right 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    margin 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
    backdrop-filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;

  ${({$scrolled:r})=>r&&`
    top: 1rem;
    left: 1.5rem;
    right: 1.5rem;
    max-width: calc(var(--container-xl) - 3rem);
    margin: 0 auto;
    background: rgba(246, 243, 235, 0.75);
    border: 1px solid rgba(30, 41, 59, 0.06);
    border-radius: 100px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 12px 30px rgba(30, 41, 59, 0.06);
    
    @media (max-width: 768px) {
      top: calc(0.5rem + env(safe-area-inset-top, 0px));
      left: 1rem;
      right: 1rem;
      max-width: calc(100% - 2rem);
    }
  `}
`,Tt=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: ${({$scrolled:r})=>r?"0.75rem 1.75rem":"clamp(1rem, 3vw, 1.5rem) var(--container-padding)"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  @media (max-width: 768px) {
    padding: ${({$scrolled:r})=>r?"0.6rem 1.2rem":"calc(1rem + env(safe-area-inset-top, 0px)) var(--container-padding) 1rem var(--container-padding)"};
  }
`,It=t(d.a)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  z-index: var(--z-fixed);
  text-decoration: none;
`,zt=t.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(30, 41, 59, 0.03);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-accent-primary);
  font-family: var(--font-display);
`,Ct=t.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
`,At=t(d.ul)`
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: min(75vw, 360px);
    background: rgba(246, 243, 235, 0.85);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    transform: translateX(calc(100% + 40px));
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -15px 0 40px rgba(30, 41, 59, 0.05);
    border-left: 1px solid rgba(30, 41, 59, 0.08);
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;

    ${({$isOpen:r})=>r&&`
      transform: translateX(0);
    `}
  }
`,Et=t(d.a)`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-text-primary);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
    color: var(--color-text-primary);
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  @media (min-width: 769px) {
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--color-accent-primary);
      transition: width 0.3s ease;
    }

    &:hover::after,
    &:focus-visible::after {
      width: 100%;
    }

    &.active::after {
      width: 100%;
      background: var(--color-gradient-1);
    }
  }

  @media (max-width: 768px) {
    font-size: var(--text-lg);
    width: 100%;
    padding: 1rem 0;
    
    &.active {
      color: var(--color-accent-primary);
    }
  }
`,Rt=t(d.button)`
  display: none;
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  z-index: var(--z-fixed);
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,Ft=t(d.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(30, 41, 59, 0.35);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: calc(var(--z-fixed) - 1);
    cursor: pointer;
  }
`;t(d.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-gradient-1);
  transform-origin: 0%;
  z-index: var(--z-tooltip); /* Sit above everything, even fixed nav */
`;const N=({scrollToSection:r})=>{const[o,i]=s.useState(!1),[a,n]=s.useState(!1),[c,l]=s.useState("home"),[p,u]=s.useState(!1),m=ve(),h=be();s.useEffect(()=>{const w=()=>u(window.innerWidth<=768);return w(),window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]);const{scrollYProgress:g}=bt(),x=V(g,{stiffness:100,damping:30,restDelta:.001}),f=s.useMemo(()=>[{id:"home",label:"Home"},{id:"about",label:"About"},{id:"work",label:"Work"},{id:"projects",label:"Projects"},{id:"blog",label:"Blog"},{id:"contact",label:"Contact"}],[]),v=h.pathname.startsWith("/blog")?"blog":c;s.useEffect(()=>{const w=()=>{i(window.scrollY>50);const A=f.map(I=>document.getElementById(I.id)),M=window.scrollY+window.innerHeight/3;A.forEach((I,We)=>{if(I){const{offsetTop:Y,offsetHeight:$e}=I;M>=Y&&M<Y+$e&&l(f[We].id)}})};return window.addEventListener("scroll",w),w(),()=>window.removeEventListener("scroll",w)},[f]),s.useEffect(()=>(a?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[a]);const y=s.useCallback((w,A)=>{w.preventDefault(),n(!1),h.pathname==="/"?setTimeout(()=>{r(A)},300):(m("/"),setTimeout(()=>{const I=document.getElementById(A);I&&I.scrollIntoView({behavior:"smooth"})},500))},[r,m,h.pathname]),k={hidden:{y:-100},visible:{y:0,transition:{duration:.6,ease:"easeOut"}}},j={hidden:{opacity:0,y:-20},visible:w=>({opacity:1,y:0,transition:{delay:w*.1+.3,duration:.5,ease:"easeOut"}})},F={closed:{opacity:0,transition:{duration:.2,ease:"easeOut"}},open:{opacity:1,transition:{duration:.3,ease:"easeIn"}}};return e.jsxs(e.Fragment,{children:[e.jsx(St,{variants:k,initial:"hidden",animate:"visible",$scrolled:o,children:e.jsxs(Tt,{$scrolled:o,children:[e.jsx(It,{onClick:w=>y(w,"home"),whileHover:{scale:1.03},whileTap:{scale:.95},children:e.jsxs(zt,{children:["VG",e.jsxs(Ct,{viewBox:"0 0 40 40",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"progress-gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"var(--color-accent-primary)"}),e.jsx("stop",{offset:"100%",stopColor:"var(--color-accent-secondary)"})]})}),e.jsx("circle",{cx:"20",cy:"20",r:"19",fill:"none",stroke:"rgba(30, 41, 59, 0.05)",strokeWidth:"1.2"}),e.jsx(d.circle,{cx:"20",cy:"20",r:"19",fill:"none",stroke:"url(#progress-gradient)",strokeWidth:"1.8",strokeLinecap:"round",pathLength:x})]})]})}),e.jsx(At,{$isOpen:a,children:f.map((w,A)=>e.jsx(d.li,{variants:j,initial:"hidden",animate:"visible",custom:A,children:e.jsx(Et,{onClick:M=>y(M,w.id),className:v===w.id?"active":"",whileHover:{scale:1.05},whileTap:{scale:.92},children:w.label})},w.id))}),e.jsx(Rt,{onClick:()=>n(!a),whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Toggle mobile menu",children:e.jsx(C,{mode:"wait",children:a?e.jsx(d.div,{initial:{rotate:-90,opacity:0},animate:{rotate:0,opacity:1},exit:{rotate:90,opacity:0},transition:{duration:.2},children:e.jsx(Ue,{})},"close"):e.jsx(d.div,{initial:{rotate:90,opacity:0},animate:{rotate:0,opacity:1},exit:{rotate:-90,opacity:0},transition:{duration:.2},children:e.jsx(Je,{})},"menu")})})]})}),e.jsx(C,{children:a&&e.jsx(Ft,{variants:F,initial:"closed",animate:"open",exit:"closed",onClick:()=>n(!1)})})]})},Mt=`---
id: 3
title: "Health in a Post-AGI World"
slug: "health-post-agi"
summary: "In a post-AGI world of abundance, humanity's focus must shifts from work to the holistic pursuit of health and well-being..."
date: "25 Sep, 2024"
readTime: "3 min read"
category: "AI"
---

For all of human history, our lives have been shaped by a single, powerful force: the need to work. We work for food, for shelter, for a living. Our days, our years, and even our societies are built around this central pillar.

But what if that pillar was removed?

Let's try a thought experiment. Imagine a world a few decades from now, where Artificial General Intelligence (AGI), and perhaps even Superintelligence (ASI), has arrived. Imagine it has solved our biggest logistical challenges—energy, production, resource distribution. True abundance becomes the reality. The need to work for survival simply disappears.

When you no longer have to spend eight hours a day earning a living, how do you spend those eight hours? When the primary question of 'How do I survive?' is answered for everyone, what becomes the next question?

It seems plausible that our focus would shift from the external world of tasks and jobs to the internal world of our own being. If this happens, then the pursuit of **Health** might become one of the most important projects of humanity, if not the most important.

But what does 'health' even mean in a world like this? It would likely expand far beyond just the absence of disease. It would become an active, lifelong pursuit of cultivating human potential. We can probably think about it in a few key layers.

## 1. Physical Health: Mastering the Vessel

Without jobs that break our bodies or keep us sedentary, we would have the time and energy to focus on our physical selves. The goal wouldn't just be to live long, but to live well.

- **Strength:** Not just for manual labor, but as a foundation for vitality and resilience.
- **Mobility:** The freedom to move without pain or restriction.
- **Endurance:** The ability to explore, play, and experience the world for longer without tiring.
- **Longevity:** AGI would surely unlock a longer lifespan, but the real goal would become **healthspan**—the number of years we live in a state of high vitality.

## 2. Mental and Emotional Health: Tending the Garden Within

A lot of our modern anxiety comes from work-related stress, deadlines, and financial pressure. When these pressures fade, what do we do with our minds?

The focus might shift to cultivating a state of inner clarity and stability. It would mean developing emotional regulation not as a way to cope with a stressful job, but as a skill for deeper relationships and personal peace. We would have the time to learn for the sake of pure curiosity and to build genuine resilience against life's inherent uncertainties.

## 3. Spiritual Health: The Search for Why

This might be the most interesting layer. When the 'what' (what we do for a living) is no longer our identity, we are left with the 'why.' Why are we here? What gives us a sense of purpose and connection?

For many, this could become the central pursuit of their lives. Whether through philosophy, community, art, nature, or traditional spiritual paths, the search for meaning would no longer be a luxury squeezed in on weekends. It could become the main event.

In a world where AGI provides all the answers to our external problems, we would be left with the freedom—and the challenge—of asking the most fundamental questions about ourselves. For millennia, humanity's project has been to master the world around us. In a post-AGI world, the only project left might be to master ourselves.
`,Lt=`---
id: 5
title: "Meat Without The Animal"
slug: "meat-without-the-animal"
summary: "What if meat wasn't something we harvested, but something we designed? Exploring the world of cultivated meat and how it could change our relationship with food itself."
date: "16 Nov, 2023"
readTime: "3 min read"
category: "Future of Food"
---

I've been thinking about the things we take for granted. We build skyscrapers, we write code that connects billions of people, but when it comes to food, we're still largely running on ancient software. For thousands of years, if you wanted to eat meat, you had one option: raise and kill an animal.

It's a simple, almost primal, equation. But it makes me wonder, is that equation still the right one? What if we re-examined meat from first principles?

What is meat, really? It's a specific collection of proteins, fats, and minerals, arranged in a structure that our bodies find nutritious and our palates find delicious. The animal is just the biological factory that produces it. But what if we could build a better factory?

This is the idea behind cultivated, or lab-grown, meat. It's not a meat *substitute*. It's meat, grown directly from animal cells, without the animal itself. It sounds like science fiction, but it's already happening. And it presents a few fascinating possibilities.

### 1. Designing for Health

An animal's meat is a product of its evolution and its environment. A cow is optimized to be a cow, not to be the perfect food for a human. Its meat has a certain ratio of saturated to unsaturated fats, a certain profile of vitamins and minerals. We can choose the animal, but we can't really change the fundamental product.

Cultivated meat changes this. It turns the product into a design problem. What if we could grow a steak with the fat profile of an avocado? Or increase the concentration of Omega-3s? We could design meat that is perfectly tuned for human nutrition, reducing the risk of heart disease or other health issues associated with conventional meat consumption. The factory becomes a laboratory for ideal food.

### 2. The End of a Moral Compromise

For many people, there's a quiet, internal conflict every time they eat meat. They enjoy it, but they are also aware of the animal welfare and environmental issues tied to industrial farming. It's a compromise we've all implicitly agreed to.

Cultivated meat offers a way out of that compromise. It provides the same end product, but it decouples it from the process of animal suffering and the immense environmental footprint of livestock farming—from land use to methane emissions. It allows us to have what we want without the ethical and ecological cost. It’s a technology that could resolve a global-scale moral tension.

### 3. Food as Software

This might be the most interesting part. When you can grow meat cell by cell, you can control its final form. Why does a steak have to be steak-shaped?

You could, in theory, grow meat in any shape you can imagine. You could create entirely new culinary experiences. Imagine 3D-printing a lattice of muscle and fat cells for a texture that's impossible to find in nature. It sounds strange, but it turns food from something we just *harvest* into something we can *design*. It's the shift from hardware to software.

This isn't to say the path is simple. There are huge challenges in scaling the technology, making it affordable, and navigating regulatory hurdles. But the potential is there.

For all of our history, we've been bound by the limits of the natural world. We found what was edible and figured out how to cook it. Now, we're on the cusp of being able to define what our food is, from the molecule up. It's a new kind of leverage, and it might just change everything.
`,Pt=`---
id: 2
title: "Preserving Stories"
slug: "preserving-stories"
summary: "Using AI to preserve personal stories, while also considering immense privacy challenges..."
date: "26 Dec, 2024"
readTime: "3 min read"
category: "AI"
---

I've been thinking about what a life really is. When you strip everything else away, it feels like we are all just a collection of stories.

Some of these stories are small and intensely **personal**. They exist only inside our own minds—a quiet moment of realization, a private joke with ourselves, the memory of a feeling that we've never spoken aloud. These are the stories that make up the core of our individual consciousness.

Then there are the bigger, more complex stories that involve other people. A family holiday, a difficult project at work, a shared laugh with friends. In these stories, we are a character, a co-author. Our narrative thread is woven together with others.

This brings me to what happens when someone passes away. All of their personal stories, the ones only they knew, vanish in an instant. An entire library of a life, gone. The shared stories, however, remain for a while. They live on as echoes in the minds of the people who were also there.

It seems that the depth of someone's impact on us is tied to how many important stories we shared with them. The more threads that are woven between our life and theirs, the more deeply we feel the tear when one of those threads is cut.

For all of history, this fading of stories has been a simple, unchangeable fact of life. But I wonder, does it have to be?

What if we could build a vessel for these stories? A place where they could be held safely, understood, and preserved long after we're gone. This is where I start thinking about the potential of AI, not as a tool for productivity, but as a **gentle archivist of the human experience.**

Imagine an AI that, over a lifetime, learns your stories. Not by just recording video or audio, but by understanding the context, the emotions, and the connections between them. It would learn your perspective, your sense of humour, and the way your voice changed when you told a story that truly mattered to you.

What would this enable? It leads to a profound possibility. What if I could get to know my grandfather from ten generations ago? Not just his name and the dates he lived, but the texture of his daily life. What if I could ask his preserved consciousness, 'What did a normal afternoon feel like for you?' or 'Tell me about a time you felt truly happy.' It would be a bridge of understanding across centuries.

Of course, this idea is not simple. It brings up some of the most important challenges we would ever face:

- **Privacy:** Who would have the right to access these stories? A person shares different parts of themselves with different people. How could a system respect those intricate boundaries?
- **Security:** This collection of stories would be the most personal data imaginable—the library of a soul. How could we ever be sure it was safe from being stolen, manipulated, or misused?
- **Access:** Who holds the keys? Do we decide before we pass on who can listen to our stories? Is it a legacy we pass down like a family heirloom?

These are not easy questions. But the reason for asking them feels important. Perhaps the greatest gift we could leave for future generations isn't money or property, but our story, shared with honesty and preserved with care. It's a way of saying, 'I was here. This is what it felt like to be me.'

And in a world that can often feel disconnected, that might be the most lasting and meaningful connection of all.
`,Wt=`---
id: 1
title: "Can we create a silicon valley in India?"
slug: "silicon-valley-india"
summary: "Should India copy America's Silicon Valley model or build a unique tech culture rooted in its own traditions..."
date: "10 Jul, 2025"
readTime: "2 min read"
category: "Tech Industry"
---

Everywhere you look in India's tech industry, you hear the ambition: to build our own **Silicon Valley**. It's a powerful idea. But it makes me wonder, what does that actually mean? Is 'Silicon Valley' a blueprint you can copy and paste, or is it something that grows out of a specific place and time?

I've been spending time in places like **Gurgaon**, and I've noticed something interesting. The new office buildings, the cafes, the language used in meetings—they all feel very familiar. They look and sound a lot like the images we see of tech hubs in the United States. This makes sense. A lot of the initial investment and many of the big companies that set up shop here were American. When you have a successful formula, you tend to reuse it.

A walk through a place like Cyberhub is a full immersion in this formula. You see a high density of restaurants, pubs, and coffee shops. The environment is fast-paced, and after work, these places are full of people unwinding. This lifestyle is a core part of the package.

At the same time, I observe the results of this rapid development. The daily commute involves navigating heavy traffic. The air quality is often a topic of conversation. The soundscape is loud and constant. It's a high-energy, high-pressure environment. It makes me curious about the experience of living and working here day-to-day.

This leads to another question. The work culture we've adopted was largely developed in the West, in societies that are highly individualistic. But our society in India is built very differently, with strong ties to family and community. I wonder how these two systems interact. When a work culture from one part of the world is placed in a society with a completely different social structure, what happens? How does it affect how people work, how they collaborate, and how they feel?

I started looking at other countries. **Japan, China and South Korea**, for instance, are major global players in technology. Yet, their work cultures are deeply rooted in their own traditions and social norms. They don't look or feel exactly like Silicon Valley. This suggests that there might be more than one successful path to building a world-class tech industry. They found a way to blend global ambition with their local identity. All these observations circle back to a single, fascinating question.

To build something truly big and sustainable, is it better to adopt a successful global template, or is it necessary to create a new one from local materials? Should the foundation of our tech hubs be based on a model that has worked elsewhere, or should it be built upon the unique social and cultural bricks of India itself?

I don't have the answer, but it feels like an important question to be asking as we build the future.
`,$t=`---
id: 4
title: "The New Leverage"
slug: "the-new-leverage"
summary: "Work feels meaningful when we create value. Historically, this required leverage like capital or labor. Today, Agentic AI and Robotics offer new, exponential leverage to everyone."
date: "27 Aug, 2025"
readTime: "4 min read"
category: "Future of Work"
---

What's the point of all this work we do? If you really sit with that question, past the need for a paycheck, you often land on a simple truth: the most satisfying work comes from creating real value for other people. It's the feeling of making a small dent in the universe.

If you're interested in diving deep on this, the folks at [**80,000 Hours**](https://80000hours.org/) do incredible research on how to build a career around meaningful impact.

Historically, making a big impact has always required one thing: **leverage**. Leverage is the secret sauce that lets one person multiply their effort to achieve something massive. The classic forms of leverage are pretty straightforward:

- **Capital:** Money. The ability to fund big projects and tools.
- **Labor:** People. The ability to coordinate a team to get more done.
- **Code & Media:** Things with no cost to copy. This is the one [**Naval Ravikant**](https://nav.al) famously explained. You write code once or record a podcast once, and it can serve millions of people without extra effort.

But something new is happening. We're in the early days of two new forms of leverage so powerful they're going to completely reshape our world.

## 1. Agentic AI: Your Self-Improving Thought Partner

This isn't just another app. Think of an AI that's not a tool you command, but a collaborator you give a goal to. It can plan, use other software, and even fix its own mistakes to get the job done. This is **Agentic AI**. For a great technical breakdown, check out Lilian Weng's post on [**LLM-powered Autonomous Agents**](https://lilianweng.github.io/posts/2023-06-23-agent/).

What makes this a game-changer is the positive feedback loop. An agent can learn, get better, and even rewrite its own code to be more effective. The more you use it, the more powerful your leverage becomes, almost like it's compounding on its own. It's like having a brilliant partner who costs nothing to replicate and gets smarter every day.

## 2. Robotics: Labor Without Limits

For centuries, 'labor' meant humans. If you wanted to build a thousand houses, you needed thousands of people. That's changing.

When we talk about robotics now, don't picture a simple factory arm. Picture the agile, learning robots from a company like [**Boston Dynamics**](https://bostondynamics.com/). They can handle complex, physical tasks in the real world, not just a controlled assembly line.

The implication is huge. If robots can handle the repetitive, dangerous, and physically draining work, what does that leave for us? It leaves the interesting stuff: the creative, strategic, and deeply human problems. Every person is freed up to focus on high-impact work. Instead of managing people doing simple tasks, you're directing a fleet of tireless robots, giving you near-infinite physical leverage.

## A New Era of Work

When you combine these two, you get a world where any individual with a good idea has access to unprecedented intellectual and physical leverage. The bottleneck is no longer about who has the capital or who can hire the most people. It's about who can ask the most interesting questions.

This doesn't mean we'll stop working. It means the *kind* of work we do will change. It will shift from being a necessity for survival to being a primary source of creativity and fulfillment. We'll get to spend our time making the dents we've always wanted to make.
`,Ht=`---
id: 4
title: "The Two Worlds"
slug: "the-two-worlds"
summary: "Developing nations are fighting for clean water and reliable roads. Developed nations are building AI and racing to Mars. Are we living in two different worlds?"
date: "12 Oct, 2025"
readTime: "3 min read"
category: "Infrastructure"
---

We don't live in one world. We live in two.

In one world, the primary struggle is with the basics. The problems are tangible, immediate. How do we get clean water to this village? How do we build a road that doesn't wash away every monsoon? How do we ensure the lights stay on, the food is safe, and there's a roof over everyone's head?

This is a world wrestling with gravity, with entropy. It's a battle to establish order, to build a foundation. The heroes here are not coders or venture capitalists. They are civil engineers, doctors, and farmers. Their work is a grind against the fundamental forces of nature and scarcity.

Then there is the other world.

In this world, the basics are assumed. The water is clean. The lights are on. The roads are paved. The struggle here is not with scarcity, but with possibility.

The problems are abstract, aimed at the future. How do we build artificial general intelligence? How do we become a multi-planetary species? How do we make transportation autonomous? How do we cure aging?

This is a world wrestling with imagination. It's a battle to transcend limits, to build on top of a stable foundation that is so reliable it has become invisible. The heroes here are scientists, programmers, and thinkers. Their work is a push against the boundaries of what we believe is possible.

The first world is playing on defense. The second is playing on offense.

Technology was supposed to be the bridge. The great equalizer. And in some ways, it has been. A farmer in a developing nation can check crop prices on a cheap smartphone. A student can access the world's library.

But technology also amplifies the divergence. While one world uses AI to optimize crop yields, the other uses it to build autonomous weapons and digital realities. The tools are the same, but the games are different. The gap in outcomes widens.

We are not on the same path. We are not even in the same race. One group is running a marathon just to get to the starting line. The other is already in a spaceship, arguing about the destination.

Understanding this is not about blame or pity. It's about seeing the world clearly. The challenges are different. The mindset is different. The definition of "progress" itself is different.

Until the foundation is built everywhere, we will continue to live in these two separate worlds, operating on two completely different timelines. One looking at the ground, the other at the stars.
`,ee=Object.assign({"../blogs/health-post-agi.md":Mt,"../blogs/meat-without-the-animal.md":Lt,"../blogs/preserving-stories.md":Pt,"../blogs/silicon-valley-india.md":Wt,"../blogs/the-new-leverage.md":$t,"../blogs/the-two-worlds.md":Ht}),Bt=r=>{const o=/^---\n([\s\S]*?)\n---\n([\s\S]*)$/,i=r.match(o);if(!i)return{data:{},content:r};const a=i[1],n=i[2],c={};return a.split(`
`).forEach(p=>{const u=p.indexOf(":");if(u>0){const m=p.substring(0,u).trim();let h=p.substring(u+1).trim();(h.startsWith('"')&&h.endsWith('"')||h.startsWith("'")&&h.endsWith("'"))&&(h=h.slice(1,-1)),!isNaN(h)&&h!==""?c[m]=Number(h):c[m]=h}}),{data:c,content:n.trim()}},Ce=()=>{const r=[];for(const o in ee){const i=o.split("/").pop().replace(".md","");try{const a=ee[o],{data:n,content:c}=Bt(a);r.push({...n,content:c,filename:i})}catch(a){console.error(`Error loading blog post ${i}:`,a)}}return r},_t=r=>Ce().find(i=>i.slug===r)||null,te=t.div`
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
`,re=t.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    opacity: 0.05;
    filter: blur(100px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    opacity: 0.05;
    filter: blur(100px);
  }
`,oe=t.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;
  
  @media (max-width: 768px) {
    padding-top: 90px;
  }
`,ae=t.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md) var(--spacing-lg);
  }
`,ie=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-sm);
  }
`,ne=t(d.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 44px;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateX(-3px);
  }
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    padding: var(--spacing-sm) var(--spacing-lg);
  }
`,Ot=t(d.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 44px;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
  }
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    padding: var(--spacing-sm) var(--spacing-lg);
  }
`,qt=t(d.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`,Vt=t.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,Nt=t.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-accent-primary);
  border-radius: 20px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-md);
`,Gt=t.h1`
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.2;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,Dt=t.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  svg {
    display: inline-block;
    vertical-align: middle;
    color: var(--color-accent-primary);
  }
`,Yt=t.div`
  padding: var(--spacing-lg) var(--spacing-xl);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text-primary);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    line-height: 1.3;
  }
  
  h1 { font-size: var(--text-3xl); }
  h2 { 
    font-size: var(--text-2xl);
    padding-bottom: var(--spacing-xs);
    border-bottom: 2px solid var(--color-border);
  }
  h3 { font-size: var(--text-xl); }
  h4 { font-size: var(--text-lg); }
  h5 { font-size: var(--text-base); }
  h6 { font-size: var(--text-sm); }
  
  p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: var(--spacing-md);
    font-size: var(--text-base);
  }
  
  ul, ol {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }
  
  li {
    margin-bottom: var(--spacing-xs);
  }
  
  a {
    color: var(--color-accent-primary);
    text-decoration: underline;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--color-accent-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-lg) 0;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  
  code {
    background: rgba(99, 102, 241, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    color: var(--color-accent-primary);
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: var(--spacing-md);
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: var(--spacing-md);
    
    code {
      background: none;
      padding: 0;
      color: var(--color-text-primary);
    }
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: var(--spacing-lg) 0;
  }
  
  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-xl) 0;
  }
`,Xt=t.div`
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  
  h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }
`,Ut=()=>{const{slug:r}=He(),o=ve(),i=_t(r);s.useEffect(()=>{window.scrollTo(0,0)},[r]);const a=()=>{o("/#blog")},n=async()=>{const l=window.location.href;if(navigator.share)try{await navigator.share({title:i?.title||"Blog Post",text:i?.summary||"",url:l})}catch(p){console.log("Error sharing:",p)}else navigator.clipboard.writeText(l),alert("Link copied to clipboard!")},c=l=>{o(`/#${l}`)};return i?e.jsxs(te,{children:[e.jsx(re,{}),e.jsx(N,{scrollToSection:c}),e.jsx(oe,{children:e.jsxs(ae,{children:[e.jsxs(ie,{children:[e.jsxs(ne,{onClick:a,whileHover:{scale:1.05},children:[e.jsx(U,{})," Back to Blog"]}),e.jsxs(Ot,{onClick:n,whileHover:{scale:1.05},children:[e.jsx(Qe,{})," Share"]})]}),e.jsxs(qt,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},children:[e.jsxs(Vt,{children:[i.category&&e.jsx(Nt,{children:i.category}),e.jsx(Gt,{children:i.title}),e.jsxs(Dt,{children:[e.jsxs("span",{children:[e.jsx(we,{})," ",i.date]}),e.jsxs("span",{children:[e.jsx(ye,{})," ",i.readTime]})]})]}),e.jsx(Yt,{children:e.jsx(wt,{components:{a:({node:l,...p})=>e.jsx("a",{...p,target:"_blank",rel:"noopener noreferrer"})},children:i.content})})]})]})})]}):e.jsxs(te,{children:[e.jsx(re,{}),e.jsx(N,{scrollToSection:c}),e.jsx(oe,{children:e.jsxs(ae,{children:[e.jsx(ie,{children:e.jsxs(ne,{onClick:a,whileHover:{scale:1.05},children:[e.jsx(U,{})," Back to Blog"]})}),e.jsxs(Xt,{children:[e.jsx("h2",{children:"Blog Post Not Found"}),e.jsx("p",{children:"The blog post you're looking for doesn't exist."})]})]})})]})};var H={exports:{}},B,se;function Jt(){if(se)return B;se=1;var r="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return B=r,B}var _,le;function Qt(){if(le)return _;le=1;var r=Jt();function o(){}function i(){}return i.resetWarningCache=o,_=function(){function a(l,p,u,m,h,g){if(g!==r){var x=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw x.name="Invariant Violation",x}}a.isRequired=a;function n(){return a}var c={array:a,bigint:a,bool:a,func:a,number:a,object:a,string:a,symbol:a,any:a,arrayOf:n,element:a,elementType:a,instanceOf:n,node:a,objectOf:n,oneOf:n,oneOfType:n,shape:n,exact:n,checkPropTypes:i,resetWarningCache:o};return c.PropTypes=c,c},_}var ce;function Kt(){return ce||(ce=1,H.exports=Qt()()),H.exports}var Zt=Kt();const b=yt(Zt),Ae=s.createContext(),er=()=>{const r=s.useContext(Ae);if(!r)throw new Error("useToast must be used within ToastProvider");return r},tr=G`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`,rr=t.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 400px;
  
  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
`,or=t(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  min-width: 300px;
  backdrop-filter: blur(10px);
  animation: ${tr} 0.3s ease-out;
  
  ${r=>{switch(r.$type){case"success":return"border-left: 4px solid #22c55e;";case"error":return"border-left: 4px solid #ef4444;";case"info":return"border-left: 4px solid #3b82f6;";default:return"border-left: 4px solid var(--color-accent-primary);"}}}
  
  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`,ar=t.div`
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
  
  ${r=>{switch(r.$type){case"success":return"color: #22c55e;";case"error":return"color: #ef4444;";case"info":return"color: #3b82f6;";default:return"color: var(--color-accent-primary);"}}}
`,ir=t.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`,nr=t.h4`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`,sr=t.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`,lr=t.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-text-primary);
  }
`,Ee=({id:r,type:o,title:i,message:a,onClose:n})=>{const c=()=>{switch(o){case"success":return e.jsx(et,{});case"error":return e.jsx(Ze,{});case"info":return e.jsx(J,{});default:return e.jsx(J,{})}};return e.jsxs(or,{$type:o,initial:{opacity:0,x:400},animate:{opacity:1,x:0},exit:{opacity:0,x:400},transition:{duration:.3},children:[e.jsx(ar,{$type:o,children:c()}),e.jsxs(ir,{children:[i&&e.jsx(nr,{children:i}),a&&e.jsx(sr,{children:a})]}),e.jsx(lr,{onClick:()=>n(r),"aria-label":"Close notification",children:e.jsx(Ke,{})})]})};Ee.propTypes={id:b.string.isRequired,type:b.oneOf(["success","error","info"]).isRequired,title:b.string,message:b.string,onClose:b.func.isRequired};const Re=({children:r})=>{const[o,i]=s.useState([]),a=s.useCallback(m=>{i(h=>h.filter(g=>g.id!==m))},[]),n=s.useCallback(({type:m="info",title:h,message:g,duration:x=5e3})=>{const f=`toast-${Date.now()}-${Math.random()}`,v={id:f,type:m,title:h,message:g};return i(y=>[...y,v]),x>0&&setTimeout(()=>{a(f)},x),f},[a]),c=s.useCallback((m,h,g)=>n({type:"success",title:m,message:h,duration:g}),[n]),l=s.useCallback((m,h,g)=>n({type:"error",title:m,message:h,duration:g}),[n]),p=s.useCallback((m,h,g)=>n({type:"info",title:m,message:h,duration:g}),[n]),u={showSuccess:c,showError:l,showInfo:p,removeToast:a};return e.jsxs(Ae.Provider,{value:u,children:[r,e.jsx(rr,{children:e.jsx(C,{children:o.map(m=>e.jsx(Ee,{...m,onClose:a},m.id))})})]})};Re.propTypes={children:b.node.isRequired};const cr=t(d.div)`
  position: fixed;
  inset: 0;
  background-color: var(--color-bg-primary);
  background-image:
    linear-gradient(to right, rgba(30, 41, 59, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 41, 59, 0.025) 1px, transparent 1px);
  background-size: 80px 80px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`,dr=t.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* Fixed height prevents layout shift as words change */
  height: 180px;
`,pr=t(d.h1)`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  color: var(--color-accent-primary);
  letter-spacing: -0.03em;
  line-height: 1;
  /* Reserve space so height never jumps */
  margin: 0;
`,hr=t(d.p)`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 1.5rem;
  height: 1.2em; /* fixed height — prevents layout shift */
  display: flex;
  align-items: center;
  gap: 10px;
`,de=t(d.span)`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-accent-secondary);
  flex-shrink: 0;
`,mr=[{word:"Hello",lang:"English"},{word:"Hola",lang:"Spanish"},{word:"Bonjour",lang:"French"},{word:"नमस्ते",lang:"Hindi"},{word:"こんにちは",lang:"Japanese"},{word:"Ciao",lang:"Italian"},{word:"你好",lang:"Chinese"},{word:"Hallo",lang:"German"},{word:"Olá",lang:"Portuguese"},{word:"안녕하세요",lang:"Korean"},{word:"Merhaba",lang:"Turkish"},{word:"Shalom",lang:"Hebrew"},{word:"Sawatdee",lang:"Thai"},{word:"Hej",lang:"Swedish"},{word:"Ahoj",lang:"Czech"},{word:"Привет",lang:"Russian"}],pe=220,gr=8,ur={word:"Welcome",lang:"English"},xr=r=>{const o=[...r];for(let i=o.length-1;i>0;i--){const a=Math.floor(Math.random()*(i+1));[o[i],o[a]]=[o[a],o[i]]}return o},fr=()=>[...xr(mr).slice(0,gr),ur],vr=({onComplete:r})=>{const o=s.useRef(fr()),[i,a]=s.useState(0),[n,c]=s.useState(!1),l=s.useRef(r);s.useEffect(()=>{l.current=r},[r]),s.useEffect(()=>{const u=o.current,h=setInterval(()=>{a(g=>{const x=g+1;return x>=u.length?(setTimeout(()=>c(!0),pe),g):x})},pe);return()=>clearInterval(h)},[]),s.useEffect(()=>{if(!n)return;const u=setTimeout(()=>l.current?.(),500);return()=>clearTimeout(u)},[n]);const p=o.current[i];return e.jsx(C,{children:!n&&e.jsx(cr,{initial:{opacity:1},exit:{opacity:0,scale:.985},transition:{duration:.5,ease:"easeInOut"},children:e.jsx(dr,{children:e.jsx(C,{mode:"wait",children:e.jsxs(d.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},transition:{duration:.13,ease:"easeOut"},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(pr,{children:p.word}),e.jsxs(hr,{children:[e.jsx(de,{animate:{scale:[1,1.6,1],opacity:[.4,1,.4]},transition:{duration:1.1,repeat:1/0,ease:"easeInOut"}}),p.lang,e.jsx(de,{animate:{scale:[1,1.6,1],opacity:[.4,1,.4]},transition:{duration:1.1,repeat:1/0,ease:"easeInOut",delay:.55}})]})]},p?p.word:i)})})},"bootloader")})},br=t.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--container-padding);
  text-align: center;
  background: var(--color-bg-primary);
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  margin: var(--spacing-lg) auto;
  max-width: 600px;
`,wr=t.h3`
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
`,yr=t.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`,jr=t.button`
  padding: 8px 16px;
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;class z extends fe.Component{constructor(o){super(o),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(o,i){console.error("ErrorBoundary caught an error:",o,i)}handleRetry=()=>{this.setState({hasError:!1}),window.location.reload()};render(){return this.state.hasError?e.jsxs(br,{children:[e.jsx(wr,{children:"Something went wrong here"}),e.jsx(yr,{children:"This section failed to load. Please try reloading the page."}),e.jsx(jr,{onClick:this.handleRetry,children:"Reload Page"})]}):this.props.children}}z.propTypes={children:b.node.isRequired};const kr=t(d.div)`
  width: 8px;
  height: 8px;
  background-color: var(--color-accent-primary);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
`,Sr=t(d.div)`
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--color-accent-primary);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  will-change: transform, width, height, background-color;
  background-color: rgba(29, 78, 216, 0);
`,Tr=()=>{const[r,o]=s.useState(!1),[i,a]=s.useState(!1),[n,c]=s.useState(!1),l=Z(0),p=Z(0),u={damping:25,stiffness:220,mass:.6},m=V(l,u),h=V(p,u);s.useEffect(()=>{const x=window.matchMedia("(hover: hover) and (pointer: fine)");c(x.matches);const f=v=>{c(v.matches)};return x.addEventListener("change",f),()=>{x.removeEventListener("change",f)}},[]);const g=s.useRef(null);return s.useEffect(()=>{if(!n)return;const x=k=>{g.current&&cancelAnimationFrame(g.current),g.current=requestAnimationFrame(()=>{l.set(k.clientX),p.set(k.clientY),r||o(!0)})},f=()=>{o(!1)},v=()=>{o(!0)},y=k=>{const j=k.target;if(!j)return;const F=j.tagName==="A"||j.tagName==="BUTTON"||j.closest("a")||j.closest("button")||j.closest(".interactive")||j.closest('[role="button"]')||j.style.cursor==="pointer";a(!!F)};return window.addEventListener("mousemove",x),document.addEventListener("mouseleave",f),document.addEventListener("mouseenter",v),window.addEventListener("mouseover",y),document.body.classList.add("has-custom-cursor"),()=>{g.current&&cancelAnimationFrame(g.current),window.removeEventListener("mousemove",x),document.removeEventListener("mouseleave",f),document.removeEventListener("mouseenter",v),window.removeEventListener("mouseover",y),document.body.classList.remove("has-custom-cursor")}},[n,l,p,r]),!n||!r?null:e.jsxs(e.Fragment,{children:[e.jsx(kr,{style:{x:l,y:p},animate:{scale:i?.5:1},transition:{duration:.2,ease:"easeOut"}}),e.jsx(Sr,{style:{x:m,y:h},animate:{scale:i?1.6:1,backgroundColor:i?"rgba(29, 78, 216, 0.08)":"rgba(29, 78, 216, 0)",borderColor:i?"var(--color-accent-primary)":"rgba(29, 78, 216, 0.4)"},transition:{duration:.2,ease:"easeOut"}})]})},Ir=()=>s.useMemo(()=>{const o=document.createElement("canvas");o.width=256,o.height=256;const i=o.getContext("2d"),a=i.createLinearGradient(0,0,256,256);a.addColorStop(0,"#0b0f19"),a.addColorStop(.3,"#1d4ed8"),a.addColorStop(.7,"#3b82f6"),a.addColorStop(1,"#6366f1"),i.fillStyle=a,i.fillRect(0,0,256,256);const n=new jt(o);return n.needsUpdate=!0,n},[]),zr=()=>{const r=s.useRef(),o=s.useRef(),i=s.useRef(),a=s.useRef(),n=Ir();return Ve(({clock:c})=>{const l=c.elapsedTime;r.current&&(r.current.rotation.y=l*.15,r.current.rotation.x=l*.08),o.current&&(o.current.rotation.y=l*.15,o.current.rotation.x=l*.08),i.current&&(i.current.rotation.y=-l*.25,i.current.rotation.x=l*.12),a.current&&(a.current.rotation.x=-l*.18,a.current.rotation.z=l*.22)}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.4}),e.jsx("directionalLight",{position:[8,8,8],intensity:2.2,color:"#ffffff"}),e.jsx("pointLight",{position:[-6,4,-4],intensity:3,color:"#3b82f6"}),e.jsx("pointLight",{position:[4,-6,-6],intensity:2,color:"#6366f1"}),e.jsx(Ne,{enableZoom:!1,enablePan:!1,autoRotate:!1,minPolarAngle:Math.PI/4,maxPolarAngle:Math.PI/1.5,rotateSpeed:.5}),e.jsx(Ge,{speed:1.5,rotationIntensity:.3,floatIntensity:1.2,floatingRange:[-.15,.15],children:e.jsxs("group",{children:[e.jsxs("mesh",{ref:r,scale:1.25,children:[e.jsx("torusKnotGeometry",{args:[.9,.26,120,16]}),e.jsx("meshStandardMaterial",{map:n,color:"#3b82f6",emissive:"#1e3a8a",emissiveIntensity:.25,roughness:.12,metalness:.9})]}),e.jsxs("mesh",{ref:o,scale:1.26,children:[e.jsx("torusKnotGeometry",{args:[.9,.26,120,16]}),e.jsx("meshBasicMaterial",{color:"#60a5fa",wireframe:!0,transparent:!0,opacity:.15})]}),e.jsxs("mesh",{ref:i,scale:1.85,children:[e.jsx("torusGeometry",{args:[1,.015,12,64]}),e.jsx("meshStandardMaterial",{color:"#60a5fa",emissive:"#3b82f6",emissiveIntensity:.8,transparent:!0,opacity:.6})]}),e.jsxs("mesh",{ref:a,scale:2.15,children:[e.jsx("torusGeometry",{args:[1,.012,12,64]}),e.jsx("meshStandardMaterial",{color:"#818cf8",emissive:"#6366f1",emissiveIntensity:.5,transparent:!0,opacity:.4})]})]})}),e.jsx(De,{count:25,scale:6,size:1.2,speed:.15,opacity:.35,color:"#93c5fd"})]})},T=({children:r,range:o=60})=>{const i=s.useRef(null),[a,n]=s.useState({x:0,y:0}),[c,l]=s.useState(!1);s.useEffect(()=>{const m=window.matchMedia("(hover: hover) and (pointer: fine)");l(m.matches)},[]);const p=m=>{if(!c||!i.current)return;const{clientX:h,clientY:g}=m,{left:x,top:f,width:v,height:y}=i.current.getBoundingClientRect(),k=x+v/2,j=f+y/2,F=h-k,w=g-j;n({x:F*.35,y:w*.35})},u=()=>{n({x:0,y:0})};return c?e.jsx(d.div,{ref:i,onMouseMove:p,onMouseLeave:u,animate:{x:a.x,y:a.y},transition:{type:"spring",stiffness:150,damping:15,mass:.1},style:{display:"inline-block"},children:r}):e.jsx(e.Fragment,{children:r})};T.propTypes={children:b.node.isRequired,range:b.number};const Cr=s.lazy(()=>$(()=>import("./FloatingRocket-Cf_K105w.js"),__vite__mapDeps([0,1,2,3,4,5]))),Ar=t.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: var(--spacing-2xl) var(--container-padding);
  
  @media (max-width: 768px) {
    min-height: 100svh;
    padding: 40px var(--container-padding) 40px var(--container-padding);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`,Er=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`,Rr=t(d.div)`
  max-width: 600px;

  @media (max-width: 1024px) {
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`,Fr=t(d.span)`
  display: inline-block;
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
`,Mr=t(d.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-xs);
  }
`,Lr=t(d.p)`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-xs);
  }
`,Pr=t(d.p)`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-md);
  }
`,Wr=t(d.div)`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 0.75rem;
    margin-bottom: var(--spacing-md);
    
    a {
      width: 280px;
      max-width: 100%;
    }
  }
`,$r=t(d.a)`
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 4vw, 2.5rem);
  background: var(--color-gradient-1);
  color: var(--color-bg-primary);
  font-weight: 600;
  border-radius: 50px;
  font-size: var(--text-base);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: translateX(0);
  }
  
  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: var(--text-sm);
  }
`,Hr=t(d.a)`
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 4vw, 2.5rem);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
  font-weight: 600;
  border-radius: 50px;
  font-size: var(--text-base);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: var(--text-sm);
  }
  
  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
`,Br=t(d.div)`
  display: flex;
  gap: var(--spacing-md);

  @media (max-width: 1024px) {
    justify-content: center;
  }
`,P=t(d.a)`
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-3px);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }
`,_r=t.div`
  width: 100%;
  height: 600px;
  position: relative;

  @media (max-width: 1024px) {
    height: 400px;
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    z-index: -1;
  }
`,Or=t.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`,qr=t(d.button)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-muted);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.5rem;
  z-index: 3;

  &:hover {
    color: var(--color-accent-primary);
  }

  @media (max-width: 1024px) {
    display: none;
  }
`,Vr=t.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: var(--font-mono);
`,Nr=()=>{const r={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},o={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}};return e.jsxs(Ar,{children:[e.jsxs(Er,{children:[e.jsxs(Rr,{variants:r,initial:"hidden",animate:"visible",children:[e.jsx(Fr,{variants:o,children:"Hello, I'm"}),e.jsx(Mr,{variants:o,children:"Vanshul Goyal"}),e.jsxs(Lr,{variants:o,children:["Associate Analyst at ",e.jsx("a",{href:"https://www.united.com/en/us/fly/company/company-info/about-united.html",target:"_blank",rel:"noopener noreferrer",children:"United Airlines"})," | NASA ",e.jsx("a",{href:"https://www.spaceappschallenge.org/collective/",target:"_blank",rel:"noopener noreferrer",children:" SpaceApps Collective"}),", ",e.jsx("a",{href:"https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge",target:"_blank",rel:"noopener noreferrer",children:" HERC 2023"})]}),e.jsx(Pr,{variants:o,children:"Driven by a deep curiosity for how things work. I enjoy getting my hands dirty with engineering and building new things from the ground up."}),e.jsxs(Wr,{variants:o,children:[e.jsx(T,{range:80,children:e.jsx($r,{href:"#work",whileHover:{scale:1.05},whileTap:{scale:.95},children:"Explore My Work"})}),e.jsx(T,{range:80,children:e.jsx(Hr,{href:"#contact",whileHover:{scale:1.05},whileTap:{scale:.95},children:"Get In Touch"})})]}),e.jsxs(Br,{variants:o,children:[e.jsx(T,{range:35,children:e.jsx(P,{href:"https://x.com/goyal_vanshul",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Twitter",children:e.jsx(je,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://www.linkedin.com/in/vanshul-goyal00/",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"LinkedIn",children:e.jsx(ke,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://www.instagram.com/vanshul_goyal/",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Instagram",children:e.jsx(Se,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://github.com/vanshulgoyal101",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"GitHub",children:e.jsx(Te,{})})})]}),e.jsx(s.Suspense,{fallback:null,children:e.jsx(Cr,{isMobileOnly:!0})})]}),e.jsx(_r,{children:e.jsx(s.Suspense,{fallback:e.jsx(Or,{children:e.jsxs("svg",{width:"80",height:"80",viewBox:"0 0 80 80",style:{opacity:.25},children:[e.jsx("circle",{cx:"40",cy:"40",r:"30",fill:"none",stroke:"#1d4ed8",strokeWidth:"1",strokeDasharray:"6 4"}),e.jsx("circle",{cx:"40",cy:"40",r:"18",fill:"none",stroke:"#3b82f6",strokeWidth:"0.8"}),e.jsx("polygon",{points:"40,20 55,50 25,50",fill:"none",stroke:"#1d4ed8",strokeWidth:"0.8"})]})}),children:e.jsx(Ye,{camera:{position:[0,0,6],fov:55},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},dpr:Math.min(window.devicePixelRatio,1.5),children:e.jsx(zr,{})})})})]}),e.jsxs(qr,{onClick:()=>{const i=document.getElementById("about");i&&i.scrollIntoView({behavior:"smooth"})},initial:{opacity:0,y:-10},animate:{opacity:1,y:0},transition:{delay:1.2,duration:.5},whileHover:{scale:1.1},"aria-label":"Scroll to About",children:[e.jsx(Vr,{children:"Scroll"}),e.jsx(d.div,{animate:{y:[0,6,0]},transition:{duration:1.4,repeat:1/0,ease:"easeInOut"},children:e.jsx(tt,{size:20})})]})]})},Gr=t.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,Dr=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,Yr=t.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-lg);
  }
`,Xr=t.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,Ur=t.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,Jr=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
`,Qr=t.div`
  order: 1;

  @media (max-width: 1024px) {
    order: 2;
  }
`,Kr=t.div`
  order: 2;
  position: relative;

  @media (max-width: 1024px) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`,Zr=t.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/5;
  background: var(--color-gradient-1);
  padding: 3px;

  @media (max-width: 768px) {
    aspect-ratio: 1/1;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-gradient-1);
    opacity: 0.5;
    filter: blur(20px);
    transform: scale(1.1);
    z-index: -1;
  }
`,eo=t.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
  display: block;
`,to=t.div`
  width: 100%;
  height: 100%;
  background: var(--color-bg-card);
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-6xl);
  color: var(--color-accent-primary);
`,ro=t.div`
  h3 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }

  p {
    font-size: var(--text-base);
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }

  a {
    color: var(--color-accent-primary);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`,L=t.span`
  color: var(--color-accent-primary);
  font-weight: 500;
`,oo=t.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }
`,ao=t(d.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: default;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-gradient-1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`,io=t.div`
  font-size: var(--text-3xl);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-sm);
`,no=t.h4`
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
`,so=t.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`,lo=t.div`
  margin-top: var(--spacing-2xl);
`,co=t.h3`
  font-size: var(--text-2xl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
`,po=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,ho=t(d.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--color-accent-primary);
  }
`,mo=t.h4`
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-accent-primary);
`,go=t.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`,uo=t.li`
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-text-primary);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: var(--text-sm);
  border: 1px solid rgba(99, 102, 241, 0.18);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.18);
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
  }
`,xo=[{icon:e.jsx(ot,{}),number:"2025",label:"B.Tech — Electronics & Communication Engineering"},{icon:e.jsx(Q,{}),number:"Sports",label:"State Level Cricket, Baseball & Softball"},{icon:e.jsx(Ie,{}),number:"Top 20",label:"NASA HERC 2023 Global Ranking"},{icon:e.jsx(Q,{}),number:"98.6%",label:"JEE Mains Percentile"}],fo=[{category:"Languages",icon:e.jsx(at,{}),list:["Java","Python","JavaScript","SQL"]},{category:"Frontend",icon:e.jsx(it,{}),list:["React","HTML/CSS","Framer Motion","Styled Components"]},{category:"Backend",icon:e.jsx(nt,{}),list:["Spring Boot","Node.js","Express","REST APIs"]},{category:"Tools",icon:e.jsx(st,{}),list:["Git","Docker","MySQL","Postman","Power BI","Tableau"]}],he={hidden:{opacity:0,y:24},visible:r=>({opacity:1,y:0,transition:{duration:.5,delay:r*.1,ease:"easeOut"}})},vo=()=>{const[r,o]=s.useState(!1),[i,a]=s.useState(!1);return e.jsx(Gr,{id:"about",children:e.jsxs(Dr,{children:[e.jsx(Yr,{children:e.jsxs(d.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.15},transition:{duration:.6},children:[e.jsx(Xr,{children:"About Me"}),e.jsx(Ur,{children:"Engineer and a passionate learner."})]})}),e.jsxs(Jr,{children:[e.jsx(Qr,{children:e.jsx(d.div,{initial:{opacity:0,x:-24},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.15},transition:{duration:.6,delay:.15},children:e.jsxs(ro,{children:[e.jsx("h3",{children:"Hey There!"}),e.jsxs("p",{children:["I'm ",e.jsx(L,{children:"Vanshul Goyal"}),", a recent graduate from Punjab Engineering College with a B.Tech in ",e.jsx(L,{children:"Electronics and Communication Engineering"})," and a minor in Computer Science."]}),e.jsxs("p",{children:["Currently, I work as an ",e.jsxs(L,{children:["Associate Analyst at"," ",e.jsx("a",{href:"https://www.united.com",target:"_blank",rel:"noopener noreferrer",children:"United Airlines"})]})," in the Airport Operations department."]}),e.jsxs("p",{children:["My journey has been shaped by incredible experiences — from leading a team to"," ",e.jsx(L,{children:"NASA's Human Exploration Rover Challenge"})," to being selected among ",e.jsx(L,{children:"30 global space leaders"})," for the NASA Space Apps Collective. Innovation happens at the intersection of technology, teamwork, and purpose."]}),e.jsx("p",{children:"When I'm not coding or optimizing business operations, you'll find me lost in books or playing cricket in the park."})]})})}),e.jsx(Kr,{children:e.jsx(d.div,{initial:{opacity:0,x:24},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.15},transition:{duration:.6,delay:.25},children:e.jsxs(Zr,{children:[!i&&e.jsx(eo,{src:"/images/projects/profile2.webp",alt:"Vanshul Goyal — Associate Analyst",loading:"lazy",onLoad:()=>o(!0),onError:()=>a(!0),style:{opacity:r?1:0,transition:"opacity 0.4s ease"}}),(i||!r)&&e.jsx(to,{style:{position:r?"absolute":"relative",opacity:r?0:1},children:e.jsx(rt,{})})]})})})]}),e.jsx("div",{children:e.jsx(oo,{children:xo.map((n,c)=>e.jsxs(ao,{custom:c,variants:he,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},whileHover:{y:-4},children:[e.jsx(io,{children:n.icon}),e.jsx(no,{children:n.number}),e.jsx(so,{children:n.label})]},c))})}),e.jsxs(lo,{children:[e.jsx(co,{children:"Technical Skills"}),e.jsx(po,{children:fo.map(({category:n,icon:c,list:l},p)=>e.jsxs(ho,{custom:p,variants:he,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsxs(mo,{children:[c,n]}),e.jsx(go,{children:l.map(u=>e.jsx(uo,{children:u},u))})]},n))})]})]})})},bo=t.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,wo=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,yo=t(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-md);
`,jo=t.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,ko=t.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`,So=t.div`
  display: grid;
  gap: var(--spacing-md);
  max-width: 900px;
  margin: 0 auto;
`,Fe=t(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 3px solid transparent;
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              border-left-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    border-left-color: var(--color-accent-primary);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,To=t.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
`,Io=t.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.1rem;
  transition: background 0.3s ease;

  ${Fe}:hover & {
    background: rgba(99, 102, 241, 0.18);
  }
`,zo=t.div`
  flex: 1;
`,Co=t.h3`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`,Ao=t.h4`
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`,Eo=t.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  align-items: center;

  svg {
    font-size: 0.75rem;
    opacity: 0.7;
  }
`,me=t.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,Ro=t.p`
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`,Fo=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`,Mo=t.span`
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-accent-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  border: 1px solid rgba(99, 102, 241, 0.18);
`,Lo=t.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  min-height: 44px;
  transition: gap 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    text-decoration: underline;
    
    svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 768px) {
    min-height: 48px;
  }
`,Po=[{id:1,icon:e.jsx(ct,{}),title:"Associate Analyst",company:"United Airlines",department:"Airport Operations",duration:"Jul 2025 – Present",location:"Gurugram, India",description:"Contributing to airport operations systems and processes at one of the world's leading airlines. Working on optimising critical aviation systems and improving operational efficiency.",tech:["Power BI","MS Excel","Tableau","Data Analysis"],link:"https://www.united.com"},{id:2,icon:e.jsx(dt,{}),title:"Software Development Engineer Intern",company:"zHealth",department:"Engineering",duration:"2023 – 2024",location:"San Francisco, US (Remote)",description:"Developed and automated end-to-end sign-up process for healthcare providers. Engineered custom interfaces for 100+ Healthcare Organisations to securely manage Patient Health Records in compliance with healthcare standards.",tech:["Java","Spring Boot","JavaScript","SQL"],link:"https://www.zhealthehr.com/"}],Wo={hidden:{opacity:0,x:-24},visible:r=>({opacity:1,x:0,transition:{duration:.5,delay:r*.12,ease:"easeOut"}})},$o=()=>e.jsx(bo,{id:"work",children:e.jsxs(wo,{children:[e.jsxs(yo,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.6},children:[e.jsx(jo,{children:"Work Experience"}),e.jsx(ko,{children:"Building impactful solutions across aviation and healthcare"})]}),e.jsx(So,{children:Po.map((r,o)=>e.jsxs(Fe,{custom:o,variants:Wo,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},whileHover:{x:4},children:[e.jsxs(To,{children:[e.jsx(Io,{children:r.icon}),e.jsxs(zo,{children:[e.jsx(Co,{children:r.title}),e.jsxs(Ao,{children:[r.company,r.department&&` • ${r.department}`]}),e.jsxs(Eo,{children:[e.jsx(me,{children:r.duration}),e.jsxs(me,{children:[e.jsx(lt,{}),r.location]})]})]})]}),e.jsx(Ro,{children:r.description}),e.jsx(Fo,{children:r.tech.map(i=>e.jsx(Mo,{children:i},i))}),r.link&&e.jsxs(Lo,{href:r.link,target:"_blank",rel:"noopener noreferrer",children:["Visit Website",e.jsx(ze,{size:11})]})]},r.id))})]})}),Ho=t.section`
  position: relative;
  background: transparent;
  padding: var(--spacing-2xl) 0;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,Bo=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,_o=t(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`,Oo=t.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,qo=t.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,Vo=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`,Me=t(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08), 
                0 0 0 1px rgba(29, 78, 216, 0.05);
    transform: translateY(-6px);
  }
`,No=t.div`
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  position: relative;

  @media (max-width: 768px) {
    height: 160px;
  }
`,Go=t.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;

  ${Me}:hover & {
    transform: scale(1.04);
  }
`,Do=t.div`
  width: 100%;
  height: 100%;
  background: var(--color-gradient-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  opacity: 0.7;
`,Yo=t.div`
  padding: var(--spacing-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,Xo=t.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`,Uo=t.p`
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
`,Jo=t.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  font-size: var(--text-base);

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-sm);
  }
`,Qo=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
`,Ko=t.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);

  svg {
    color: var(--color-accent-primary);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: var(--text-xs);
  }
`,Zo=t.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--spacing-xs) 0;
  min-height: 44px;
  transition: gap 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    text-decoration: underline;
    
    svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 768px) {
    min-height: 48px;
  }
`,ea=[{id:1,title:"NASA Human Exploration Rover Challenge",role:"Team Lead",description:"Led a team of 6 to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking and engaged 12,000+ students in STEM activities.",image:"/images/projects/nasa-herc.webp",fallbackIcon:"🚀",stats:[{icon:e.jsx(K,{}),text:"12k+ students reached for STEM"},{icon:e.jsx(pt,{}),text:"$30,000 raised via govt & private sources"}],link:"https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/"},{id:2,title:"NASA Space Apps Collective",role:"Global Community Member",description:"Selected among 30 global space leaders. Developed weather visualisation tools for Zimbabwean farmers using open-source NASA data.",image:"/images/projects/spaceapps.webp",fallbackIcon:"🌍",stats:[{icon:e.jsx(K,{}),text:"Diverse global team"},{icon:e.jsx(Ie,{}),text:"NASA open-source data"}],link:"https://www.spaceappschallenge.org/collective/"}],ta={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}},ra={hidden:{opacity:0,y:30},visible:r=>({opacity:1,y:0,transition:{duration:.55,delay:r*.12,ease:"easeOut"}})},oa=({src:r,alt:o,fallback:i})=>{const[a,n]=s.useState(!1);return e.jsx(No,{children:a?e.jsx(Do,{children:i}):e.jsx(Go,{src:r,alt:o,loading:"lazy",onError:()=>n(!0)})})},aa=()=>e.jsx(Ho,{id:"projects",children:e.jsxs(Bo,{children:[e.jsxs(_o,{variants:ta,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},children:[e.jsx(Oo,{children:"Featured Projects"}),e.jsx(qo,{children:"From space exploration to software development — projects that define my journey"})]}),e.jsx(Vo,{children:ea.map((r,o)=>e.jsxs(Me,{custom:o,variants:ra,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},whileHover:{y:-5},children:[e.jsx(oa,{src:r.image,alt:r.title,fallback:r.fallbackIcon}),e.jsxs(Yo,{children:[e.jsx(Xo,{children:r.title}),e.jsx(Uo,{children:r.role}),e.jsx(Jo,{children:r.description}),e.jsx(Qo,{children:r.stats.map((i,a)=>e.jsxs(Ko,{children:[i.icon,e.jsx("span",{children:i.text})]},a))}),r.link&&r.link!=="#"&&e.jsxs(Zo,{href:r.link,target:"_blank",rel:"noopener noreferrer",children:["Visit Website",e.jsx(ze,{size:12})]})]})]},r.id))})]})}),D=t(d.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
  
  @media (max-width: 768px) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`,ia=t(Be)`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
  
  &:focus-visible ${D} {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
`,na=t.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);

  svg {
    display: inline-block;
    vertical-align: middle;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
`,sa=t.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
`,la=t.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.8em;
`,ca=t.span`
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${D}:hover & svg {
    transform: translateX(5px);
  }
`,Le=({blog:r,index:o,variants:i})=>{if(!r)return null;const a=typeof window<"u"&&window.innerWidth<=768;return e.jsx(ia,{to:`/blog/${r.slug}`,children:e.jsxs(D,{variants:i,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},transition:{delay:o*.1},whileHover:a?{}:{scale:1.02},role:"article","aria-label":`Blog post: ${r.title}`,children:[e.jsxs(na,{children:[e.jsxs("span",{children:[e.jsx(we,{"aria-label":"Publication date"})," ",r.date]}),e.jsxs("span",{children:[e.jsx(ye,{"aria-label":"Reading time"})," ",r.readTime]})]}),e.jsx(sa,{children:r.title}),e.jsx(la,{children:r.summary}),e.jsxs(ca,{children:["Read More ",e.jsx(ht,{})]})]})})};Le.propTypes={blog:b.shape({id:b.number.isRequired,title:b.string.isRequired,summary:b.string.isRequired,date:b.string.isRequired,readTime:b.string.isRequired,slug:b.string.isRequired,category:b.string}).isRequired,index:b.number.isRequired,variants:b.object.isRequired};const da=G`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`,pa=t.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: ${r=>r.$minHeight||"300px"};
  
  @media (max-width: 768px) {
    min-height: ${r=>r.$mobileMinHeight||"250px"};
  }
`,S=t.div`
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(99, 102, 241, 0.1) 50%,
    rgba(99, 102, 241, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: ${da} 2s infinite linear;
  border-radius: ${r=>r.$radius||"8px"};
  height: ${r=>r.$height||"20px"};
  width: ${r=>r.$width||"100%"};
`,ha=t.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
`,ma=t.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
`,ga=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`,ua=()=>e.jsxs(pa,{$minHeight:"400px",$mobileMinHeight:"350px",children:[e.jsxs(ha,{children:[e.jsx(S,{$width:"80px",$height:"24px",$radius:"12px"}),e.jsx(S,{$width:"100px",$height:"18px"})]}),e.jsxs(ma,{children:[e.jsx(S,{$width:"90%",$height:"32px",$radius:"4px"}),e.jsx(S,{$width:"100%",$height:"20px"}),e.jsx(S,{$width:"95%",$height:"20px"}),e.jsx(S,{$width:"85%",$height:"20px"})]}),e.jsxs(ga,{children:[e.jsx(S,{$width:"120px",$height:"18px"}),e.jsx(S,{$width:"80px",$height:"18px"})]})]});b.string,b.string,b.node;const xa=r=>Array.isArray(r)?[...r].sort((o,i)=>{const a=new Date(o.date);return new Date(i.date)-a}):[],W={container:{hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},item:{hidden:{opacity:0,y:30},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}}},E={sectionTitle:"Writings",sectionSubtitle:"A collection of thoughts and insights (More coming soon...)",emptyStateTitle:"Coming Soon",emptyStateMessage:"I'm currently crafting my thoughts into words. Check back soon for insights and stories from my journey.",quote:{text:"Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.",author:"Naval Ravikant"}},fa=t.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;
`,va=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,ba=t(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`,wa=t.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,ya=t.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,ge=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`,ja=t.div`
  text-align: center;
  padding: var(--spacing-2xl);
  
  svg {
    font-size: 4rem;
    color: var(--color-accent-primary);
    opacity: 0.3;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    max-width: 400px;
    margin: 0 auto;
  }
`,ka=t(d.div)`
  max-width: 700px;
  margin: var(--spacing-2xl) auto;
  text-align: center;
  position: relative;
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
`,Sa=t.div`
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.2;
  margin-bottom: var(--spacing-md);
`,Ta=t.blockquote`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`,Ia=t.cite`
  font-size: var(--text-base);
  color: var(--color-accent-primary);
  font-style: normal;
  
  &::before {
    content: '— ';
  }
`,za=()=>{const r=s.useMemo(()=>{try{return Ce()}catch(a){return console.error("Error loading blog posts:",a),[]}},[]),o=s.useMemo(()=>xa(r),[r]),[i]=s.useState(!1);return e.jsx(fa,{id:"blog",children:e.jsxs(va,{children:[e.jsx(ba,{variants:W.container,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(d.div,{variants:W.item,children:[e.jsx(wa,{children:E.sectionTitle}),e.jsx(ya,{children:E.sectionSubtitle})]})}),i?e.jsx(ge,{children:[...Array(3)].map((a,n)=>e.jsx(ua,{},`skeleton-${n}`))}):o&&o.length>0?e.jsx(ge,{children:o.map((a,n)=>e.jsx(Le,{blog:a,index:n,variants:W.item},a.id))}):e.jsxs(ja,{children:[e.jsx(mt,{}),e.jsx("h3",{children:E.emptyStateTitle}),e.jsx("p",{children:E.emptyStateMessage})]}),e.jsxs(ka,{variants:W.item,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsx(Sa,{children:e.jsx(gt,{})}),e.jsx(Ta,{children:E.quote.text}),e.jsx(Ia,{children:E.quote.author})]})]})})},Ca=(r={name:"",email:"",message:""})=>{const{showSuccess:o,showError:i}=er(),[a,n]=s.useState(r),[c,l]=s.useState(!1),[p,u]=s.useState("");return{formState:a,isSubmitting:c,emailError:p,handleChange:g=>{const{name:x,value:f}=g.target;if(n(v=>({...v,[x]:f})),x==="email"){const v=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f);u(f&&!v?"Please enter a valid email address.":"")}},handleSubmit:async g=>{if(g.preventDefault(),!p){l(!0);try{(await fetch("https://formspree.io/f/xgvzkqob",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...a,_replyto:a.email,_subject:`Portfolio Contact: ${a.name}`})})).ok?(o("Message Sent!","Thank you for reaching out. I'll get back to you soon!"),n(r)):i("Oops! Something went wrong","Failed to send your message. Please try again or email me directly.")}catch{i("Network Error","Unable to send message. Please check your connection and try again.")}finally{l(!1)}}}}},Aa=t.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;
  min-height: 80vh;
`,Ea=t.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,Ra=t(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`,Fa=t.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,Ma=t.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`,La=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,Pa=t(d.div)`
  padding: var(--spacing-lg);
`,Wa=t.h3`
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`,ue=t.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
`,$a=t(d.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateX(10px);
  }
`,Ha=t.div`
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.25rem;
`,Ba=t.div`
  flex: 1;
`,_a=t.p`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 2px;
`,Oa=t.p`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: 500;
`,qa=t(d.div)`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`,Va=t(d.a)`
  width: 48px;
  height: 48px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }
`,Na=G`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ga=t.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${Na} 0.8s linear infinite;
`,Da=t(d.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-xl);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: var(--color-gradient-1);
    opacity: 0.05;
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`,Ya=t.form`
  position: relative;
  z-index: 2;
`,O=t.div`
  margin-bottom: var(--spacing-md);
`,q=t.label`
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
`,xe=t.input`
  width: 100%;
  padding: 12px 20px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--color-bg-primary);
  }
`,Xa=t.textarea`
  width: 100%;
  padding: 12px 20px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--color-bg-primary);
  }
`,Ua=t(d.button)`
  width: 100%;
  padding: 14px 28px;
  background: var(--color-gradient-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: all 0.3s ease;
  min-height: 48px;
  position: relative;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.6) 100%);
  }
  
  @media (max-width: 768px) {
    min-height: 52px;
  }
`,Ja=t.p`
  font-size: var(--text-xs);
  color: #ef4444;
  margin-top: 4px;
`,Qa=()=>{const{formState:r,isSubmitting:o,emailError:i,handleChange:a,handleSubmit:n}=Ca(),c={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},l={hidden:{opacity:0,y:30},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}},p=[{icon:e.jsx(xt,{}),label:"Location",value:"India"},{icon:e.jsx(ft,{}),label:"Current Position",value:"United Airlines"},{icon:e.jsx(vt,{}),label:"Languages",value:"English, Hindi"}],u=[{icon:e.jsx(je,{}),url:"https://x.com/goyal_vanshul",label:"Twitter"},{icon:e.jsx(ke,{}),url:"https://www.linkedin.com/in/vanshul-goyal00/",label:"LinkedIn"},{icon:e.jsx(Se,{}),url:"https://www.instagram.com/vanshul_goyal/",label:"Instagram"},{icon:e.jsx(Te,{}),url:"https://github.com/vanshulgoyal101",label:"GitHub"}];return e.jsx(Aa,{children:e.jsxs(Ea,{children:[e.jsx(Ra,{variants:c,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(d.div,{variants:l,children:[e.jsx(Fa,{children:"Get In Touch"}),e.jsx(Ma,{children:"Let's connect and build something amazing together"})]})}),e.jsxs(La,{children:[e.jsxs(Pa,{variants:c,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsxs(d.div,{variants:l,children:[e.jsx(Wa,{children:"Let's Connect"}),e.jsx(ue,{children:"Whether you want to discuss technology, engineering, or just say hello, I'd love to hear from you. Feel free to reach out through the form or connect on social media."})]}),p.map((m,h)=>e.jsxs($a,{variants:l,whileHover:{scale:1.02},children:[e.jsx(Ha,{children:m.icon}),e.jsxs(Ba,{children:[e.jsx(_a,{children:m.label}),e.jsx(Oa,{children:m.value})]})]},h)),e.jsxs(d.div,{variants:l,children:[e.jsx(ue,{children:"Connect with me on social media:"}),e.jsx(qa,{children:u.map((m,h)=>e.jsx(T,{range:35,children:e.jsx(Va,{href:m.url,target:"_blank",rel:"noopener noreferrer","aria-label":m.label,whileHover:{scale:1.1},whileTap:{scale:.9},children:m.icon})},h))})]})]}),e.jsx(Da,{variants:l,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(Ya,{onSubmit:n,children:[e.jsxs(O,{children:[e.jsx(q,{htmlFor:"name",children:"Your Name"}),e.jsx(xe,{type:"text",id:"name",name:"name",value:r.name,onChange:a,placeholder:"John Doe",required:!0,disabled:o})]}),e.jsxs(O,{children:[e.jsx(q,{htmlFor:"email",children:"Email Address"}),e.jsx(xe,{type:"email",id:"email",name:"email",value:r.email,onChange:a,placeholder:"john@example.com",required:!0,disabled:o,style:i?{borderColor:"#ef4444"}:{}}),i&&e.jsx(Ja,{children:i})]}),e.jsxs(O,{children:[e.jsx(q,{htmlFor:"message",children:"Message"}),e.jsx(Xa,{id:"message",name:"message",value:r.message,onChange:a,placeholder:"Tell me about your project or just say hi!",rows:"5",required:!0,disabled:o})]}),e.jsx(Ua,{type:"submit",disabled:o,whileHover:o?{}:{scale:1.02},whileTap:o?{}:{scale:.98},children:o?e.jsxs(e.Fragment,{children:[e.jsx(Ga,{}),"Sending..."]}):e.jsxs(e.Fragment,{children:[e.jsx(ut,{}),"Send Message"]})})]})})]})]})})},Ka=t.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
`;class Za{constructor(){this.pool=[],this.active=[]}obtain(o,i){let a;return this.pool.length>0?(a=this.pool.pop(),a.reset(o,i)):a=new oi(o,i),this.active.push(a),a}recycle(o){const i=this.active[o];this.active.splice(o,1),this.pool.push(i)}clear(){this.active=[]}}const Pe=(r,o,i)=>{const n=document.createElement("canvas");n.width=128,n.height=128;const c=n.getContext("2d"),l=128/2,p=c.createRadialGradient(l,l,1,l,l,l);return p.addColorStop(0,`rgba(${r}, ${o}, ${i}, 1)`),p.addColorStop(.25,`rgba(${r}, ${o}, ${i}, 0.4)`),p.addColorStop(1,`rgba(${r}, ${o}, ${i}, 0)`),c.fillStyle=p,c.beginPath(),c.arc(l,l,l,0,Math.PI*2),c.fill(),n},ei=[{r:6,g:182,b:212},{r:236,g:72,b:153},{r:139,g:92,b:246},{r:148,g:163,b:184}],ti=ei.map(r=>Pe(r.r,r.g,r.b)),ri=Pe(246,243,235);class oi{constructor(o,i){this.reset(o,i),this.maxSize=Math.max(window.innerWidth,window.innerHeight)*.95}reset(o,i){this.x=o,this.y=i,this.size=Math.random()*6+3,this.speedX=(Math.random()-.5)*6,this.speedY=Math.random()*3+1.5,this.opacity=.95,this.growth=Math.random()*5+4;const a=Math.random();a<.25?this.colorIndex=0:a<.5?this.colorIndex=1:a<.75?this.colorIndex=2:this.colorIndex=3}update(){this.x+=this.speedX,this.y+=this.speedY,this.size+=this.growth,this.speedX*=.96,this.speedY*=.96,this.opacity-=.015}draw(o){if(this.opacity<=0)return;o.save();const i=Math.min(1,(.95-this.opacity)/.7),a=ti[this.colorIndex];o.globalAlpha=this.opacity*(1-i*.65),o.drawImage(a,this.x-this.size,this.y-this.size,this.size*2,this.size*2),o.globalAlpha=this.opacity*i*.65,o.drawImage(ri,this.x-this.size,this.y-this.size,this.size*2,this.size*2),o.restore()}}const ai=()=>{const r=s.useRef(null),o=s.useRef(new Za),i=s.useRef(null),a=s.useRef(0),n=s.useRef(!1),c=s.useRef(!1);return s.useEffect(()=>{const l=r.current;if(!l)return;const p=l.getContext("2d",{alpha:!0});if(!p)return;const u=()=>{l.width=window.innerWidth,l.height=window.innerHeight};u(),window.addEventListener("resize",u);const m=x=>{if(!n.current)return;const{x:f,y:v}=x.detail;for(let y=0;y<2;y++)o.current.obtain(f+(Math.random()-.5)*10,v+(Math.random()-.5)*6)};window.addEventListener("rocket-emit-smoke",m);const h=()=>{if(!n.current)return;p.clearRect(0,0,l.width,l.height);const x=Date.now()-a.current,f=o.current;for(let v=f.active.length-1;v>=0;v--){const y=f.active[v];y.update(),y.draw(p),(y.opacity<=0||y.size>y.maxSize)&&f.recycle(v)}if(x>550&&!c.current){c.current=!0;const v=document.getElementById("about");v&&v.scrollIntoView({behavior:"smooth"})}x>800&&f.active.length===0?(n.current=!1,p.clearRect(0,0,l.width,l.height)):i.current=requestAnimationFrame(h)},g=()=>{o.current.clear(),p.clearRect(0,0,l.width,l.height),a.current=Date.now(),c.current=!1,n.current||(n.current=!0,i.current&&cancelAnimationFrame(i.current),i.current=requestAnimationFrame(h))};return window.addEventListener("rocket-launch",g),()=>{window.removeEventListener("resize",u),window.removeEventListener("rocket-emit-smoke",m),window.removeEventListener("rocket-launch",g),i.current&&cancelAnimationFrame(i.current)}},[]),e.jsx(Ka,{ref:r})},ii=(r=1500)=>{const[o,i]=s.useState(!1);return s.useEffect(()=>{let a;return"requestIdleCallback"in window?a=requestIdleCallback(()=>i(!0),{timeout:r}):a=setTimeout(()=>i(!0),r),()=>{"cancelIdleCallback"in window?cancelIdleCallback(a):clearTimeout(a)}},[r]),o},ni=t.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`,si=t.main`
  position: relative;
  z-index: 2;
`,li=t.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  /* Gradient orbs for ambience */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    filter: blur(100px);
    animation: float 25s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    filter: blur(100px);
    animation: float 30s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.02;
    }
    33% {
      transform: translate(80px, -80px) scale(1.15);
      opacity: 0.06;
    }
    66% {
      transform: translate(-50px, 50px) scale(0.9);
      opacity: 0.015;
    }
  }
`,R=t(d.section)`
  width: 100%;
  position: relative;
`;t.div`
  min-height: 200px;
`;const ci=s.lazy(()=>$(()=>import("./FloatingRocket-Cf_K105w.js"),__vite__mapDeps([0,1,2,3,4,5]))),di=s.lazy(()=>$(()=>import("./RandomTelemetry-DbvP7-Q5.js"),__vite__mapDeps([6,1,2,3,5,7,8,9,4]))),pi=s.lazy(()=>$(()=>import("./InteractiveSpaceBackground-UTO0iX6I.js"),__vite__mapDeps([10,1,2,3]))),hi=({isBooting:r})=>{const o=be();return s.useEffect(()=>{if(!r&&o.hash){const i=o.hash.replace("#",""),a=document.getElementById(i);if(a){const n=setTimeout(()=>{a.scrollIntoView({behavior:"smooth"})},100);return()=>clearTimeout(n)}}},[o,r]),null},mi=()=>ii(1200)?e.jsxs(s.Suspense,{fallback:null,children:[e.jsx(ci,{isDesktopOnly:!0}),e.jsx(di,{}),e.jsx(pi,{})]}):null;function gi(){const[r,o]=s.useState(!0),i=n=>{const c=document.getElementById(n);c&&c.scrollIntoView({behavior:"smooth"})},a={initial:{opacity:0},animate:{opacity:1,transition:{duration:.6,ease:"easeOut"}},exit:{opacity:0,transition:{duration:.3}}};return e.jsxs(_e,{children:[e.jsx(hi,{isBooting:r}),e.jsxs(Re,{children:[e.jsx(kt,{}),e.jsx(C,{mode:"wait",children:r&&e.jsx(vr,{onComplete:()=>o(!1)})}),e.jsxs(ni,{children:[e.jsx(Tr,{}),e.jsx(li,{}),e.jsx(mi,{}),e.jsx(ai,{}),e.jsxs(Oe,{children:[e.jsx(X,{path:"/",element:e.jsxs(e.Fragment,{children:[e.jsx(N,{scrollToSection:i}),e.jsx(C,{mode:"wait",children:e.jsxs(si,{children:[e.jsx(z,{children:e.jsx(R,{id:"home",children:e.jsx(Nr,{})})}),e.jsx(z,{children:e.jsx(R,{id:"about",variants:a,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(vo,{})})}),e.jsx(z,{children:e.jsx(R,{id:"work",variants:a,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx($o,{})})}),e.jsx(z,{children:e.jsx(R,{id:"projects",variants:a,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(aa,{})})}),e.jsx(z,{children:e.jsx(R,{id:"blog",variants:a,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(za,{})})}),e.jsx(z,{children:e.jsx(R,{id:"contact",variants:a,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(Qa,{})})})]})})]})}),e.jsx(X,{path:"/blog/:slug",element:e.jsx(Ut,{})})]})]})]})]})}qe.createRoot(document.getElementById("root")).render(e.jsx(fe.StrictMode,{children:e.jsx(gi,{})}));export{b as P};
