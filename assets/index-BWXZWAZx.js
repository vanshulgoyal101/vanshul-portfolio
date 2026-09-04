const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FloatingRocket-DL08I0aN.js","assets/react-core-CMvrp_gs.js","assets/styled-8lYCUX0A.js","assets/icons-Bf57NM_i.js","assets/framer-BxTy9W3t.js","assets/HeroScene-D1kmK2x4.js","assets/three-react-BmMCy_OC.js","assets/three-core-BaNDelAs.js","assets/react-vendor-eCbzqfu8.js","assets/BlogPost-CxY11Wze.js","assets/markdown-H7SjL4p3.js","assets/vite-preload-BXl3LOEh.js","assets/BlogIndex-DJCiitTR.js","assets/ReadingList-CXh4eofz.js","assets/RandomTelemetry-iVrZ9gAB.js","assets/InteractiveSpaceBackground-C4lApiqt.js","assets/Dashboard-mL7Hc0Qo.js"])))=>i.map(i=>d[i]);
import{g as nt,a as s,j as e,R as Me}from"./react-core-CMvrp_gs.js";import{u as Le,a as V,L as ne,B as rt,R as it,b as I,N as Re,c as st,d as lt}from"./react-vendor-eCbzqfu8.js";import{_ as S}from"./vite-preload-BXl3LOEh.js";import{S as ct,g as a,E as re}from"./styled-8lYCUX0A.js";import{H as dt,a as ht,F as pt,b as de,c as mt,d as gt,e as ut,f as _e,g as Fe,h as Pe,i as ie,I as se,j as xt,k as Z,l as ft,m as he,n as N,o as vt,p as bt,q as yt,r as $e,s as wt,t as ee,u as kt,v as jt,w as Tt,M as St,B as It,x as zt,y as Ct,z as At,A as Et,C as Mt,D as Lt,E as Rt,G as _t,J as Ft,K as Pt,L as pe,N as $t,O as Ot,P as Wt,Q as Bt,R as Ht,S as Nt,T as Oe,U as Vt,V as qt,W as Dt,X as Gt,Y as Yt,Z as Xt,_ as Jt}from"./icons-Bf57NM_i.js";import{m as d,u as Ut,a as te,A as R,b as me}from"./framer-BxTy9W3t.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();var q={exports:{}},D,ge;function Qt(){if(ge)return D;ge=1;var t="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return D=t,D}var G,ue;function Kt(){if(ue)return G;ue=1;var t=Qt();function o(){}function n(){}return n.resetWarningCache=o,G=function(){function r(c,h,x,g,m,p){if(p!==t){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}r.isRequired=r;function i(){return r}var l={array:r,bigint:r,bool:r,func:r,number:r,object:r,string:r,symbol:r,any:r,arrayOf:i,element:r,elementType:r,instanceOf:i,node:r,objectOf:i,oneOf:i,oneOfType:i,shape:i,exact:i,checkPropTypes:n,resetWarningCache:o};return l.PropTypes=l,l},G}var xe;function Zt(){return xe||(xe=1,q.exports=Kt()()),q.exports}var ea=Zt();const y=nt(ea),ta=ct`
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
    --header-offset: clamp(5rem, 8vw, 7rem);
    font-size: 100%; /* Respect user's font size preference */
    scroll-behavior: smooth;
    scroll-padding-top: var(--header-offset);
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
    scroll-margin-top: var(--header-offset);

    @media (max-width: 768px) {
      scroll-margin-top: calc(var(--header-offset) - 0.5rem);
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
  html {
    scroll-behavior: auto;
  }

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
`,aa=(t=1500)=>{const[o,n]=s.useState(!1);return s.useEffect(()=>{let r;return"requestIdleCallback"in window?r=requestIdleCallback(()=>n(!0),{timeout:t}):r=setTimeout(()=>n(!0),t),()=>{"cancelIdleCallback"in window?cancelIdleCallback(r):clearTimeout(r)}},[t]),o},fe={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},_={hidden:{opacity:0,y:30},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}},F={initial:{opacity:0},animate:{opacity:1,transition:{duration:.6,ease:"easeOut"}},exit:{opacity:0,transition:{duration:.3}}},oa=(t,o={})=>{if(!t)return 0;const{gap:n=20,navSelector:r="nav"}=o,i=document.querySelector(r),l=i&&(i.offsetHeight||i.getBoundingClientRect().height)||0,c=typeof t.offsetTop=="number"?t.offsetTop:t.getBoundingClientRect().top+window.scrollY;return Math.max(c-l-n,0)},We=(t,o={})=>{if(!t)return!1;const n=typeof t=="string"?document.getElementById(t):t;if(!n)return!1;const r=oa(n,o);return window.scrollTo({top:r,behavior:o.behavior??"smooth"}),!0},na=a(d.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  will-change: top, left, right, max-width, margin, background-color, border-color, border-radius, box-shadow, backdrop-filter, transform;
  transform: translate3d(0, 0, 0);
  transition:
    top 1s cubic-bezier(0.19, 1, 0.22, 1),
    left 1s cubic-bezier(0.19, 1, 0.22, 1),
    right 1s cubic-bezier(0.19, 1, 0.22, 1),
    max-width 1s cubic-bezier(0.19, 1, 0.22, 1),
    margin 1s cubic-bezier(0.19, 1, 0.22, 1),
    background-color 1s cubic-bezier(0.19, 1, 0.22, 1),
    border-color 1s cubic-bezier(0.19, 1, 0.22, 1),
    border-radius 1s cubic-bezier(0.19, 1, 0.22, 1),
    box-shadow 1s cubic-bezier(0.19, 1, 0.22, 1),
    backdrop-filter 1s cubic-bezier(0.19, 1, 0.22, 1),
    -webkit-backdrop-filter 1s cubic-bezier(0.19, 1, 0.22, 1);
  background: transparent;

  ${({$scrolled:t})=>t&&`
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
`,ra=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: ${({$scrolled:t})=>t?"0.75rem 1.75rem":"clamp(1rem, 3vw, 1.5rem) var(--container-padding)"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: padding 1s cubic-bezier(0.19, 1, 0.22, 1), transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: padding, transform;

  @media (max-width: 768px) {
    padding: ${({$scrolled:t})=>t?"0.6rem 1.2rem":"calc(1rem + env(safe-area-inset-top, 0px)) var(--container-padding) 1rem var(--container-padding)"};
  }
`,ia=a(d.a)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  z-index: var(--z-fixed);
  text-decoration: none;
`,sa=a.div`
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
`,la=a.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
`,ca=a(d.ul)`
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

    ${({$isOpen:t})=>t&&`
      transform: translateX(0);
    `}
  }
`,da=a(d.a)`
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
`,ha=a(d.button)`
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
`,pa=a(d.div)`
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
`,Be=({scrollToSection:t})=>{const[o,n]=s.useState(!1),[r,i]=s.useState(!1),[l,c]=s.useState("home"),h=Le(),x=V(),{scrollYProgress:g}=Ut(),m=te(g,{stiffness:100,damping:30,restDelta:.001}),p=s.useMemo(()=>[{id:"home",label:"Home"},{id:"about",label:"About"},{id:"work",label:"Work"},{id:"projects",label:"Projects"},{id:"blog",label:"Blog"},{id:"contact",label:"Contact"}],[]),u=x.pathname.startsWith("/blog")?"blog":l;s.useEffect(()=>{const b=()=>{const j=document.querySelector("nav"),C=j?j.offsetHeight+20:96;document.documentElement.style.setProperty("--header-offset",`${C}px`)};return b(),window.addEventListener("resize",b),()=>window.removeEventListener("resize",b)},[]),s.useEffect(()=>{const b=()=>{n(window.scrollY>50);const j=p.map(B=>document.getElementById(B.id)),C=window.scrollY+window.innerHeight/3;j.forEach((B,at)=>{if(B){const{offsetTop:ce,offsetHeight:ot}=B;C>=ce&&C<ce+ot&&c(p[at].id)}})};return window.addEventListener("scroll",b),b(),()=>window.removeEventListener("scroll",b)},[p]),s.useEffect(()=>(r?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[r]);const v=s.useCallback((b,j)=>{b.preventDefault(),i(!1),x.pathname==="/"?setTimeout(()=>{t(j)},300):(h("/"),setTimeout(()=>{t(j)},500))},[t,h,x.pathname]),f={hidden:{y:-100},visible:{y:0,transition:{duration:.6,ease:"easeOut"}}},w={hidden:{opacity:0,y:-20},visible:b=>({opacity:1,y:0,transition:{delay:b*.1+.3,duration:.5,ease:"easeOut"}})},E={closed:{opacity:0,transition:{duration:.2,ease:"easeOut"}},open:{opacity:1,transition:{duration:.3,ease:"easeIn"}}};return e.jsxs(e.Fragment,{children:[e.jsx(na,{variants:f,initial:"hidden",animate:"visible",$scrolled:o,transition:{duration:.75,ease:[.22,1,.36,1],type:"tween"},children:e.jsxs(ra,{$scrolled:o,children:[e.jsx(ia,{onClick:b=>v(b,"home"),whileHover:{scale:1.03},whileTap:{scale:.95},children:e.jsxs(sa,{children:["VG",e.jsxs(la,{viewBox:"0 0 40 40",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"progress-gradient",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"var(--color-accent-primary)"}),e.jsx("stop",{offset:"100%",stopColor:"var(--color-accent-secondary)"})]})}),e.jsx("circle",{cx:"20",cy:"20",r:"19",fill:"none",stroke:"rgba(30, 41, 59, 0.05)",strokeWidth:"1.2"}),e.jsx(d.circle,{cx:"20",cy:"20",r:"19",fill:"none",stroke:"url(#progress-gradient)",strokeWidth:"1.8",strokeLinecap:"round",pathLength:m})]})]})}),e.jsx(ca,{$isOpen:r,children:p.map((b,j)=>e.jsx(d.li,{variants:w,initial:"hidden",animate:"visible",custom:j,children:e.jsx(da,{href:`#${b.id}`,onClick:C=>v(C,b.id),className:u===b.id?"active":"","aria-current":u===b.id?"true":void 0,whileHover:{scale:1.05},whileTap:{scale:.92},children:b.label})},b.id))}),e.jsx(ha,{onClick:()=>i(!r),whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Toggle mobile menu",children:e.jsx(R,{mode:"wait",children:r?e.jsx(d.div,{initial:{rotate:-90,opacity:0},animate:{rotate:0,opacity:1},exit:{rotate:90,opacity:0},transition:{duration:.2},children:e.jsx(dt,{})},"close"):e.jsx(d.div,{initial:{rotate:90,opacity:0},animate:{rotate:0,opacity:1},exit:{rotate:-90,opacity:0},transition:{duration:.2},children:e.jsx(ht,{})},"menu")})})]})}),e.jsx(R,{children:r&&e.jsx(pa,{variants:E,initial:"closed",animate:"open",exit:"closed",onClick:()=>i(!1)})})]})},ma=a.div`
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
`,ga=a.h3`
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
`,ua=a.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`,xa=a.button`
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
`;class A extends Me.Component{constructor(o){super(o),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(o,n){console.error("ErrorBoundary caught an error:",o,n)}handleRetry=()=>{this.setState({hasError:!1}),window.location.reload()};render(){return this.state.hasError?e.jsxs(ma,{children:[e.jsx(ga,{children:"Something went wrong here"}),e.jsx(ua,{children:"This section failed to load. Please try reloading the page."}),e.jsx(xa,{onClick:this.handleRetry,children:"Reload Page"})]}):this.props.children}}A.propTypes={children:y.node.isRequired};const He=s.createContext(),fa=()=>{const t=s.useContext(He);if(!t)throw new Error("useToast must be used within ToastProvider");return t},va=re`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`,ba=a.div`
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
`,ya=a(d.div)`
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
  animation: ${va} 0.3s ease-out;
  
  ${t=>{switch(t.$type){case"success":return"border-left: 4px solid #22c55e;";case"error":return"border-left: 4px solid #ef4444;";case"info":return"border-left: 4px solid #3b82f6;";default:return"border-left: 4px solid var(--color-accent-primary);"}}}
  
  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`,wa=a.div`
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
  
  ${t=>{switch(t.$type){case"success":return"color: #22c55e;";case"error":return"color: #ef4444;";case"info":return"color: #3b82f6;";default:return"color: var(--color-accent-primary);"}}}
`,ka=a.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`,ja=a.h4`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`,Ta=a.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`,Sa=a.button`
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
`,Ne=({id:t,type:o,title:n,message:r,onClose:i})=>{const l=()=>{switch(o){case"success":return e.jsx(gt,{});case"error":return e.jsx(mt,{});case"info":return e.jsx(de,{});default:return e.jsx(de,{})}};return e.jsxs(ya,{$type:o,initial:{opacity:0,x:400},animate:{opacity:1,x:0},exit:{opacity:0,x:400},transition:{duration:.3},children:[e.jsx(wa,{$type:o,children:l()}),e.jsxs(ka,{children:[n&&e.jsx(ja,{children:n}),r&&e.jsx(Ta,{children:r})]}),e.jsx(Sa,{onClick:()=>i(t),"aria-label":"Close notification",children:e.jsx(pt,{})})]})};Ne.propTypes={id:y.string.isRequired,type:y.oneOf(["success","error","info"]).isRequired,title:y.string,message:y.string,onClose:y.func.isRequired};const Ve=({children:t})=>{const[o,n]=s.useState([]),r=s.useCallback(g=>{n(m=>m.filter(p=>p.id!==g))},[]),i=s.useCallback(({type:g="info",title:m,message:p,duration:u=5e3})=>{const v=`toast-${Date.now()}-${Math.random()}`,f={id:v,type:g,title:m,message:p};return n(w=>[...w,f]),u>0&&setTimeout(()=>{r(v)},u),v},[r]),l=s.useCallback((g,m,p)=>i({type:"success",title:g,message:m,duration:p}),[i]),c=s.useCallback((g,m,p)=>i({type:"error",title:g,message:m,duration:p}),[i]),h=s.useCallback((g,m,p)=>i({type:"info",title:g,message:m,duration:p}),[i]),x={showSuccess:l,showError:c,showInfo:h,removeToast:r};return e.jsxs(He.Provider,{value:x,children:[t,e.jsx(ba,{children:e.jsx(R,{children:o.map(g=>e.jsx(Ne,{...g,onClose:r},g.id))})})]})};Ve.propTypes={children:y.node.isRequired};const Ia=a.div.attrs({"aria-hidden":"true"})`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${t=>t.$animated?1:0};

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(100px);
  }

  &::before {
    top: -50%;
    right: -50%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    ${t=>t.$animated?"animation: bg-float 25s ease-in-out infinite;":"opacity: 0.05;"}
  }

  &::after {
    bottom: -50%;
    left: -50%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    ${t=>t.$animated?"animation: bg-float 30s ease-in-out infinite reverse;":"opacity: 0.05;"}
  }

  @keyframes bg-float {
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

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
      opacity: 0.04;
    }
  }
`,qe="https://vanshul.com",Vi="Vanshul Goyal",za=`${qe}/og-image.png`,H={twitter:"https://x.com/goyal_vanshul",linkedin:"https://www.linkedin.com/in/vanshul-goyal00/",instagram:"https://www.instagram.com/vanshul_goyal/",github:"https://github.com/vanshulgoyal101",games:"https://games.vanshul.com"},qi=[H.github,H.linkedin,H.twitter,H.instagram],k=(t,o,n)=>{const r=`meta[${t}="${o}"]`;let i=document.head.querySelector(r);const l=!i,c=i?i.getAttribute("content"):null;return i||(i=document.createElement("meta"),i.setAttribute(t,o),document.head.appendChild(i)),i.setAttribute("content",n),()=>{l?i.remove():c!=null&&i.setAttribute("content",c)}},Ca=(t,o)=>{let n=document.head.querySelector(`link[rel="${t}"]`);const r=!n,i=n?n.getAttribute("href"):null;return n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",o),()=>{r?n.remove():i!=null&&n.setAttribute("href",i)}},Aa=({title:t,description:o,path:n="/",image:r=za,type:i="website",jsonLd:l,robots:c,article:h}={})=>{s.useEffect(()=>{const x=`${qe}${n}`,g=document.title,m=[];t&&(document.title=t,m.push(k("property","og:title",t)),m.push(k("name","twitter:title",t))),o&&(m.push(k("name","description",o)),m.push(k("property","og:description",o)),m.push(k("name","twitter:description",o))),m.push(k("property","og:type",i)),m.push(k("property","og:url",x)),m.push(k("property","og:image",r)),m.push(k("property","og:image:width","1200")),m.push(k("property","og:image:height","630")),t&&m.push(k("property","og:image:alt",t)),m.push(k("name","twitter:image",r)),m.push(Ca("canonical",x)),c&&m.push(k("name","robots",c)),i==="article"&&h&&(h.publishedTime&&m.push(k("property","article:published_time",h.publishedTime)),h.modifiedTime&&m.push(k("property","article:modified_time",h.modifiedTime)),h.author&&m.push(k("property","article:author",h.author)),h.section&&m.push(k("property","article:section",h.section)));let p;return l&&(p=document.createElement("script"),p.type="application/ld+json",p.textContent=l,document.head.appendChild(p)),()=>{document.title=g,m.forEach(u=>u()),p&&p.remove()}},[t,o,n,r,i,l,c,h])},Ea=a.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`,Ma=a(d.main)`
  position: relative;
  z-index: 2;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  padding: 160px var(--spacing-lg) var(--spacing-2xl);

  @media (max-width: 768px) {
    padding-top: 120px;
  }
`,La=a.p`
  font-size: clamp(4rem, 14vw, 9rem);
  font-weight: 800;
  line-height: 1;
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Ra=a.h1`
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin: var(--spacing-md) 0 var(--spacing-sm);
`,_a=a.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
`,Fa=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
`,Pa=a(d.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px 24px;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: var(--color-gradient-1);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`,ve=a(ne)`
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-accent-primary);
  }
`,$a=()=>{const t=Le(),{pathname:o}=V();return Aa({title:"Page not found — Vanshul Goyal",description:"That page doesn't exist. Head back home or explore the writing and projects.",path:o,robots:"noindex, follow"}),e.jsxs(Ea,{children:[e.jsx(Be,{scrollToSection:n=>t(`/#${n}`)}),e.jsxs(Ma,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:[e.jsx(La,{children:"404"}),e.jsx(Ra,{children:"This page wandered off."}),e.jsx(_a,{children:"The link may be broken or the page may have moved. Let's get you back on track."}),e.jsxs(Fa,{children:[e.jsxs(Pa,{onClick:()=>t("/"),whileHover:{scale:1.03},whileTap:{scale:.97},children:[e.jsx(ut,{})," Back home"]}),e.jsx(ve,{to:"/blog",children:"Read the blog"}),e.jsx(ve,{to:"/reading-list",children:"Reading list"})]})]})]})},ae="vg.cursor",W="vg:cursorpref",Oa=()=>{try{const t=localStorage.getItem(ae);return t==="on"||t==="off"?t:"auto"}catch{return"auto"}},Wa=t=>{try{t==="auto"?localStorage.removeItem(ae):localStorage.setItem(ae,t)}catch{}typeof window<"u"&&window.dispatchEvent(new Event(W))},De=()=>typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(hover: hover) and (pointer: fine)").matches,Ba=()=>{if(typeof navigator>"u")return!1;const t=navigator.userAgent||"",o=!/chrome|chromium|crios|android|edg|edga|edgios|fxios|opr/i.test(t),n=/safari/i.test(t)&&o,r=(navigator.vendor||"").includes("Apple");return n&&r},Ha=()=>{if(typeof navigator>"u")return!1;const t=navigator.hardwareConcurrency,o=navigator.deviceMemory;return typeof t=="number"&&t<=4||typeof o=="number"&&o<=4},Na=()=>{if(typeof navigator>"u")return!1;const t=navigator.deviceMemory;if(typeof t=="number")return t>=8;const o=navigator.hardwareConcurrency;return typeof o=="number"&&o>=8},Va=()=>!(!De()||window.matchMedia("(prefers-reduced-motion: reduce)").matches||Ha()||Ba()&&!Na()),Ge=()=>{const t=Oa();return t==="on"?!0:t==="off"?!1:Va()},qa=a.button`
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s ease;

  &:hover { color: var(--color-accent-primary); }
  &:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 2px;
  }
`,Da=()=>{const[t,o]=s.useState(!1),[n,r]=s.useState(!1);return s.useEffect(()=>{r(De());const i=()=>o(Ge());return i(),window.addEventListener(W,i),()=>window.removeEventListener(W,i)},[]),n?e.jsxs(qa,{type:"button",onClick:()=>Wa(t?"off":"on"),"aria-pressed":t,children:["Custom cursor: ",t?"On":"Off"]}):null},Y=.15,Ga=(t,o,n)=>{const r=t*Y,i=o*Y,l=Math.hypot(r,i),c=Math.abs(n)*Y;if(l<=c||l===0)return{x:r,y:i};const h=c/l;return{x:r*h,y:i*h}},T=({children:t,range:o=40})=>{const n=s.useRef(null),[r,i]=s.useState({x:0,y:0}),[l,c]=s.useState(!1);s.useEffect(()=>{const g=window.matchMedia("(hover: hover) and (pointer: fine)"),m=window.matchMedia("(prefers-reduced-motion: reduce)"),p=()=>c(g.matches&&!m.matches);return p(),g.addEventListener("change",p),m.addEventListener("change",p),()=>{g.removeEventListener("change",p),m.removeEventListener("change",p)}},[]);const h=g=>{if(!l||!n.current)return;const{left:m,top:p,width:u,height:v}=n.current.getBoundingClientRect();i(Ga(g.clientX-(m+u/2),g.clientY-(p+v/2),o))},x=()=>{i({x:0,y:0})};return l?e.jsx(d.div,{ref:n,onMouseMove:h,onMouseLeave:x,animate:{x:r.x,y:r.y},transition:{type:"spring",stiffness:180,damping:22,mass:.1},style:{display:"inline-block"},children:t}):e.jsx(e.Fragment,{children:t})};T.propTypes={children:y.node.isRequired,range:y.number};const Ya=s.lazy(()=>S(()=>import("./FloatingRocket-DL08I0aN.js"),__vite__mapDeps([0,1,2,3,4]))),Xa=s.lazy(()=>S(()=>import("./HeroScene-D1kmK2x4.js"),__vite__mapDeps([5,1,6,7,8]))),Ja=a.section`
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
`,Ua=a.div`
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
`,Qa=a(d.div)`
  max-width: 600px;

  @media (max-width: 1024px) {
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-top: 40px;
  }
`,Ka=a(d.span)`
  display: inline-block;
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
`,Za=a(d.h1)`
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
`,eo=a(d.p)`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-xs);
  }
`,to=a(d.p)`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-md);
  }
`,ao=a(d.div)`
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
`,oo=a(d.a)`
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
`,no=a(d.a)`
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
`,ro=a(d.div)`
  display: flex;
  gap: var(--spacing-md);

  @media (max-width: 1024px) {
    justify-content: center;
  }
`,P=a(d.a)`
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
`,io=a.div`
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
`,so=a.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`,lo=a(d.button)`
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
`,co=a.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: var(--font-mono);
`,be=()=>e.jsx(so,{children:e.jsxs("svg",{width:"80",height:"80",viewBox:"0 0 80 80",style:{opacity:.25},"aria-hidden":"true",children:[e.jsx("circle",{cx:"40",cy:"40",r:"30",fill:"none",stroke:"#1d4ed8",strokeWidth:"1",strokeDasharray:"6 4"}),e.jsx("circle",{cx:"40",cy:"40",r:"18",fill:"none",stroke:"#3b82f6",strokeWidth:"0.8"}),e.jsx("polygon",{points:"40,20 55,50 25,50",fill:"none",stroke:"#1d4ed8",strokeWidth:"0.8"})]})}),ho=()=>{const[t,o]=s.useState(!1);s.useEffect(()=>{o(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)},[]);const n={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},r={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}};return e.jsxs(Ja,{children:[e.jsxs(Ua,{children:[e.jsxs(Qa,{variants:n,initial:"hidden",animate:"visible",children:[e.jsx(Ka,{variants:r,children:"Hello, I'm"}),e.jsx(Za,{variants:r,children:"Vanshul Goyal"}),e.jsxs(eo,{variants:r,children:["Associate Analyst at ",e.jsx("a",{href:"https://www.united.com/en/us/fly/company/company-info/about-united.html",target:"_blank",rel:"noopener noreferrer",children:"United Airlines"})," | NASA ",e.jsx("a",{href:"https://www.spaceappschallenge.org/collective/",target:"_blank",rel:"noopener noreferrer",children:" SpaceApps Collective"}),", ",e.jsx("a",{href:"https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge",target:"_blank",rel:"noopener noreferrer",children:" HERC 2023"})]}),e.jsx(to,{variants:r,children:"Driven by a deep curiosity for how things work. I enjoy getting my hands dirty with engineering and building new things from the ground up."}),e.jsxs(ao,{variants:r,children:[e.jsx(T,{range:80,children:e.jsx(oo,{href:"#work",whileHover:{scale:1.05},whileTap:{scale:.95},children:"Explore My Work"})}),e.jsx(T,{range:80,children:e.jsx(no,{href:"#contact",whileHover:{scale:1.05},whileTap:{scale:.95},children:"Get In Touch"})})]}),e.jsxs(ro,{variants:r,children:[e.jsx(T,{range:35,children:e.jsx(P,{href:"https://x.com/goyal_vanshul",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Twitter",children:e.jsx(_e,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://www.linkedin.com/in/vanshul-goyal00/",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"LinkedIn",children:e.jsx(Fe,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://www.instagram.com/vanshul_goyal/",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Instagram",children:e.jsx(Pe,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://github.com/vanshulgoyal101",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"GitHub",children:e.jsx(ie,{})})}),e.jsx(T,{range:35,children:e.jsx(P,{href:"https://games.vanshul.com",target:"_blank",rel:"noopener noreferrer",whileHover:{scale:1.1},whileTap:{scale:.9},"aria-label":"Games",children:e.jsx(se,{})})})]}),e.jsx(s.Suspense,{fallback:null,children:e.jsx(Ya,{isMobileOnly:!0})})]}),e.jsx(io,{children:t?e.jsx(s.Suspense,{fallback:e.jsx(be,{}),children:e.jsx(Xa,{})}):e.jsx(be,{})})]}),e.jsxs(lo,{onClick:()=>{const i=document.getElementById("about");i&&i.scrollIntoView({behavior:"smooth"})},initial:{opacity:0,y:-10},animate:{opacity:1,y:0},transition:{delay:1.2,duration:.5},whileHover:{scale:1.1},"aria-label":"Scroll to About",children:[e.jsx(co,{children:"Scroll"}),e.jsx(d.div,{animate:{y:[0,6,0]},transition:{duration:1.4,repeat:1/0,ease:"easeInOut"},children:e.jsx(xt,{size:20})})]})]})},po=a.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,mo=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,go=a.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-lg);
  }
`,uo=a.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,xo=a.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,fo=a.div`
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
`,vo=a.div`
  order: 1;

  @media (max-width: 1024px) {
    order: 2;
  }
`,bo=a.div`
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
`,yo=a.div`
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
`,wo=a.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
  display: block;
`,ko=a.div`
  width: 100%;
  height: 100%;
  background: var(--color-bg-card);
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-6xl);
  color: var(--color-accent-primary);
`,jo=a.div`
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
`,$=a.span`
  color: var(--color-accent-primary);
  font-weight: 500;
`,To=a.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }
`,So=a(d.div)`
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
`,Io=a.div`
  font-size: var(--text-3xl);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-sm);
`,zo=a.h4`
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
`,Co=a.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`,Ao=a.div`
  margin-top: var(--spacing-2xl);
`,Eo=a.h3`
  font-size: var(--text-2xl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
`,Mo=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,Lo=a(d.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--color-accent-primary);
  }
`,Ro=a.h4`
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-accent-primary);
`,_o=a.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`,Fo=a.li`
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
`,Po=[{icon:e.jsx(ft,{}),number:"2025",label:"B.Tech — Electronics & Communication Engineering"},{icon:e.jsx(he,{}),number:"Sports",label:"State Level Cricket, Baseball & Softball"},{icon:e.jsx(N,{}),number:"Top 20",label:"NASA HERC 2023 Global Ranking"},{icon:e.jsx(he,{}),number:"98.6%",label:"JEE Mains Percentile"}],$o=[{category:"Languages",icon:e.jsx(vt,{}),list:["Java","Python","JavaScript","SQL"]},{category:"Frontend",icon:e.jsx(bt,{}),list:["React","HTML/CSS","Framer Motion","Styled Components"]},{category:"Backend",icon:e.jsx(yt,{}),list:["Spring Boot","Node.js","Express","REST APIs"]},{category:"Tools",icon:e.jsx($e,{}),list:["Git","Docker","MySQL","Postman","Power BI","Tableau"]}],ye={hidden:{opacity:0,y:24},visible:t=>({opacity:1,y:0,transition:{duration:.5,delay:t*.1,ease:"easeOut"}})},Oo=()=>{const[t,o]=s.useState(!1),[n,r]=s.useState(!1);return e.jsx(po,{id:"about",children:e.jsxs(mo,{children:[e.jsx(go,{children:e.jsxs(d.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.15},transition:{duration:.6},children:[e.jsx(uo,{children:"About Me"}),e.jsx(xo,{children:"Engineer and a passionate learner."})]})}),e.jsxs(fo,{children:[e.jsx(vo,{children:e.jsx(d.div,{initial:{opacity:0,x:-24},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.15},transition:{duration:.6,delay:.15},children:e.jsxs(jo,{children:[e.jsx("h3",{children:"Hey There!"}),e.jsxs("p",{children:["I'm ",e.jsx($,{children:"Vanshul Goyal"}),", a recent graduate from Punjab Engineering College with a B.Tech in ",e.jsx($,{children:"Electronics and Communication Engineering"})," and a minor in Computer Science."]}),e.jsxs("p",{children:["Currently, I work as an ",e.jsxs($,{children:["Associate Analyst at"," ",e.jsx("a",{href:"https://www.united.com",target:"_blank",rel:"noopener noreferrer",children:"United Airlines"})]})," in the Airport Operations department."]}),e.jsxs("p",{children:["My journey has been shaped by incredible experiences — from leading a team to"," ",e.jsx($,{children:"NASA's Human Exploration Rover Challenge"})," to being selected among ",e.jsx($,{children:"30 global space leaders"})," for the NASA Space Apps Collective. Innovation happens at the intersection of technology, teamwork, and purpose."]}),e.jsx("p",{children:"When I'm not coding or optimizing business operations, you'll find me lost in books or playing cricket in the park."})]})})}),e.jsx(bo,{children:e.jsx(d.div,{initial:{opacity:0,x:24},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.15},transition:{duration:.6,delay:.25},children:e.jsxs(yo,{children:[!n&&e.jsx(wo,{src:"/images/projects/profile2.webp",alt:"Vanshul Goyal — Associate Analyst",loading:"lazy",onLoad:()=>o(!0),onError:()=>r(!0),style:{opacity:t?1:0,transition:"opacity 0.4s ease"}}),(n||!t)&&e.jsx(ko,{style:{position:t?"absolute":"relative",opacity:t?0:1},children:e.jsx(Z,{})})]})})})]}),e.jsx("div",{children:e.jsx(To,{children:Po.map((i,l)=>e.jsxs(So,{custom:l,variants:ye,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},whileHover:{y:-4},children:[e.jsx(Io,{children:i.icon}),e.jsx(zo,{children:i.number}),e.jsx(Co,{children:i.label})]},l))})}),e.jsxs(Ao,{children:[e.jsx(Eo,{children:"Technical Skills"}),e.jsx(Mo,{children:$o.map(({category:i,icon:l,list:c},h)=>e.jsxs(Lo,{custom:h,variants:ye,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsxs(Ro,{children:[l,i]}),e.jsx(_o,{children:c.map(x=>e.jsx(Fo,{children:x},x))})]},i))})]})]})})},Wo=a.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,Bo=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,Ho=a(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-md);
`,No=a.h2`
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
`,Vo=a.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`,qo=a.div`
  display: grid;
  gap: var(--spacing-md);
  max-width: 900px;
  margin: 0 auto;
`,Ye=a(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 3px solid transparent;
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              border-left-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    border-left-color: var(--color-accent-primary);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,Do=a.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
`,Go=a.div`
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

  ${Ye}:hover & {
    background: rgba(99, 102, 241, 0.18);
  }
`,Yo=a.div`
  flex: 1;
`,Xo=a.h3`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`,Jo=a.h4`
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`,Uo=a.div`
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
`,we=a.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,Qo=a.p`
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`,Ko=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`,Zo=a.span`
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-accent-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  border: 1px solid rgba(99, 102, 241, 0.18);
`,en=a.a`
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
`,tn=[{id:1,icon:e.jsx(kt,{}),title:"Associate Analyst",company:"United Airlines",department:"Airport Operations",duration:"Jul 2025 – Present",location:"Gurugram, India",description:"Building internal tools for airport operations — automating ground-staff management and attendance-compliance monitoring across US hub airports, so hub-by-hub manual audits become one consistent source of truth.",tech:["Python","SQL","Power BI","Tableau"],link:"https://www.united.com"},{id:2,icon:e.jsx(jt,{}),title:"Software Development Engineer Intern",company:"zHealth",department:"Engineering",duration:"Jan 2024 – Dec 2024",location:"San Francisco, US (Remote)",description:"Automated the end-to-end sign-up process for healthcare providers, and built a drag-and-drop email editor used by 1,500+ healthcare organisations to reach over 2M patients.",tech:["Java","Spring Boot","JavaScript","SQL"],link:"https://www.zhealthehr.com/"}],an={hidden:{opacity:0,x:-24},visible:t=>({opacity:1,x:0,transition:{duration:.5,delay:t*.12,ease:"easeOut"}})},on=()=>e.jsx(Wo,{id:"work",children:e.jsxs(Bo,{children:[e.jsxs(Ho,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.6},children:[e.jsx(No,{children:"Work Experience"}),e.jsx(Vo,{children:"Building impactful solutions across aviation and healthcare"})]}),e.jsx(qo,{children:tn.map((t,o)=>e.jsxs(Ye,{custom:o,variants:an,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},whileHover:{x:4},children:[e.jsxs(Do,{children:[e.jsx(Go,{children:t.icon}),e.jsxs(Yo,{children:[e.jsx(Xo,{children:t.title}),e.jsxs(Jo,{children:[t.company,t.department&&` • ${t.department}`]}),e.jsxs(Uo,{children:[e.jsx(we,{children:t.duration}),e.jsxs(we,{children:[e.jsx(wt,{}),t.location]})]})]})]}),e.jsx(Qo,{children:t.description}),e.jsx(Ko,{children:t.tech.map(n=>e.jsx(Zo,{children:n},n))}),t.link&&e.jsxs(en,{href:t.link,target:"_blank",rel:"noopener noreferrer",children:["Visit Website",e.jsx(ee,{size:11})]})]},t.id))})]})}),nn=a.section`
  position: relative;
  background: transparent;
  padding: var(--spacing-2xl) 0;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`,rn=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,sn=a(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`,ln=a.h2`
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
`,cn=a.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,dn=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`,Xe=a(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08), 
                0 0 0 1px rgba(29, 78, 216, 0.05);
    transform: translateY(-6px);
  }
`,hn=a.div`
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  position: relative;

  @media (max-width: 768px) {
    height: 160px;
  }
`,pn=a.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;

  ${Xe}:hover & {
    transform: scale(1.04);
  }
`,mn=a.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(54, 217, 138, 0.2), rgba(54, 217, 138, 0.06));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #36d98a;
  font-size: 2.5rem;
  opacity: 0.7;
`,gn=a.div`
  padding: var(--spacing-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,un=a.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`,xn=a.p`
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
`,fn=a.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  font-size: var(--text-base);

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-sm);
  }
`,vn=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
`,bn=a.div`
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
`,yn=a.a`
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
`,wn=a.div`
  margin-top: var(--spacing-2xl);
`,kn=a(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-md);
`,jn=a.h3`
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);

  @media (max-width: 768px) {
    font-size: var(--text-xl);
  }
`,Tn=a.p`
  color: var(--color-text-secondary);
  font-size: var(--text-base);
`,Sn=a.div`
  margin-top: var(--spacing-lg);
`,In=a.h4`
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`,zn=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`,Cn=a(d.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(29, 78, 216, 0.06);
  }
`,An=a.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`,En=a.span`
  width: 2.35rem;
  height: 2.35rem;
  flex: 0 0 2.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${t=>t.$color||"#36d98a"};
  background: color-mix(in srgb, ${t=>t.$color||"#36d98a"} 10%, transparent);
  border: 1px solid color-mix(in srgb, ${t=>t.$color||"#36d98a"} 36%, transparent);
  border-radius: 10px;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`,Mn=()=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"}),e.jsx("path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"}),e.jsx("path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"}),e.jsx("path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516M19.967 17.484A4 4 0 0 1 18 18"})]}),Ln=a.h5`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
`,Rn=a.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  color: #22c55e;
  font-weight: 500;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  }
`,_n=a.p`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.55;
  margin: 0;
`,Fn=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: var(--spacing-xs);
`,Pn=a.span`
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: ${t=>t.$mono?"var(--font-mono, ui-monospace, monospace)":"inherit"};
`,$n=a.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
`,ke=a.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  color: var(--color-accent-primary);
  font-weight: 500;
  min-height: 36px;

  svg { transition: transform 0.2s ease; }

  &:hover {
    text-decoration: underline;
    svg { transform: translateX(3px); }
  }
`,On=[{id:1,title:"AdBrain",role:"Founder & Solo Developer",description:'An AI ad-creative generator and manager for local businesses — fill a "brand brain", set a goal, and get on-brand ad variants (image + copy) ready to launch on Meta. Built as a real product, with a live solar business as customer zero.',image:"/images/projects/adbrain.webp",fallbackIcon:e.jsx(Tt,{}),stats:[{icon:e.jsx(N,{}),text:"Live SaaS · adbrain.vanshul.com"},{icon:e.jsx(Z,{}),text:"Next.js 16 · React 19 · Supabase"}],link:"https://adbrain.vanshul.com"},{id:2,title:"Tiny Arcade — 10 Browser Games",role:"Solo Developer",description:"Ten instant-play browser games — reflex, memory, typing, mental maths, ear training, Wordle and more — built in TypeScript + Vite with a shared model/view architecture, cloud leaderboards and full SEO. No frameworks, no backend.",image:"/images/projects/tiny-arcade.webp",fallbackIcon:e.jsx(se,{}),stats:[{icon:e.jsx(N,{}),text:"10 instant-play games"},{icon:e.jsx(Z,{}),text:"TypeScript + Vite"}],link:"https://games.vanshul.com"},{id:3,title:"NASA Human Exploration Rover Challenge",role:"Team Lead",description:"Led a team of 6 to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking and engaged 12,000+ students in STEM activities.",image:"/images/projects/nasa-herc.webp",fallbackIcon:e.jsx(N,{}),stats:[{icon:e.jsx(St,{}),text:"12k+ students reached for STEM"},{icon:e.jsx(It,{}),text:"$30,000 raised via govt & private sources"}],link:"https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/"}],Wn=[{category:"Live products & tools",items:[{icon:e.jsx(zt,{}),color:"#f2ae68",title:"Solaride",desc:"A rooftop-solar business site with a savings calculator, lead capture and full local SEO — a real business I help run.",tags:["Business","SEO"],live:"https://solaride.in"},{icon:e.jsx(Ct,{}),color:"#82b7ff",title:"ctx",desc:"An MCP server that turns any GitHub repo into agent-ready context — pack or search a whole repo for the lines that matter.",tags:["MCP","Cloudflare"],live:"https://ctx.vanshul.com",repo:"https://github.com/vanshulgoyal101/ctx"},{icon:e.jsx($e,{}),color:"#72d7c0",title:"Dev Tools",desc:"A privacy-first offline developer toolbox — JSON, JWT, hashing, encoding and formatters — plus a Smart Paste box that works out what you pasted.",tags:["PWA","Offline"],live:"https://tools.vanshul.com",repo:"https://github.com/vanshulgoyal101/tools"}]},{category:"Open source & packages",items:[{icon:e.jsx(At,{}),color:"#c3a6ff",title:"SemCache",desc:"A zero-cost, tiered semantic cache for LLMs using local ONNX embeddings — sub-30ms matches at $0.",tags:["npm i semcache"],repo:"https://github.com/vanshulgoyal101/semCache"},{icon:e.jsx(Et,{}),color:"#ff8c7a",title:"Agent Vault",desc:"A cryptographic policy firewall that vets an AI DeFi agent's transactions before signing.",tags:["pip install agent-vault-py"],repo:"https://github.com/vanshulgoyal101/agent-vault"},{icon:e.jsx(Mt,{}),color:"#f095c8",title:"Agent Mailroom",desc:"Machine-to-machine identity and micro-payments for AI agents — DIDs and off-chain channels.",tags:["pip install agent-mailroom"],repo:"https://github.com/vanshulgoyal101/agent-mailroom"},{icon:e.jsx(Lt,{}),color:"#f4c95d",title:"depshift",desc:"Detects breaking API changes between Python package versions and auto-suggests migration patches.",tags:["pip install depshift"],repo:"https://github.com/vanshulgoyal101/autopatch"},{icon:e.jsx(Rt,{}),color:"#72d7c0",title:"AgentWatch",desc:"Local-first observability and step-by-step trace replay for multi-agent LLM systems.",tags:["Python","SQLite"],repo:"https://github.com/vanshulgoyal101/agentwatch"},{icon:e.jsx(_t,{}),color:"#8fd3ff",title:"Lego",desc:"Zero-dependency, copy-paste code blocks — 327 crash-proof components across 23 categories.",tags:["CLI","Zero-dep"],repo:"https://github.com/vanshulgoyal101/lego"},{icon:e.jsx(Ft,{}),color:"#82b7ff",title:"Agent Team",desc:"An autonomous AI software-engineering team that plans, writes and tests code from GitHub Actions.",tags:["Agents","CI"],repo:"https://github.com/vanshulgoyal101/agent-team"},{icon:e.jsx(Mn,{}),color:"#36d98a",title:"vbrain",desc:"An AI-queryable second-brain engine — turns Markdown notes into full-text search, a knowledge graph and an MCP server for agents. Open engine, private notes.",tags:["MCP","Cloudflare"],live:"https://vbrain.vanshul.com",repo:"https://github.com/vanshulgoyal101/vbrain"}]},{category:"Interactive experiments",items:[{icon:e.jsx(Pt,{}),color:"#c3a6ff",title:"The Dialectic",desc:"Two AI personas debate any topic while a live D3 graph maps their concepts and where they clash.",tags:["React","D3","Gemini"],repo:"https://github.com/vanshulgoyal101/the-dialectic"},{icon:e.jsx(pe,{}),color:"#82b7ff",title:"Cosmic Zoom",desc:'A "powers of ten" physics sandbox — zoom across 44 orders of magnitude with real Matter.js physics.',tags:["React","Matter.js"],repo:"https://github.com/vanshulgoyal101/cosmic-zoom"},{icon:e.jsx($t,{}),color:"#f4c95d",title:"Lexis",desc:"Typography and readability analytics for long-form Markdown — Flesch, Kincaid and Gunning Fog scoring.",tags:["React","TypeScript"],repo:"https://github.com/vanshulgoyal101/lexis"},{icon:e.jsx(Ot,{}),color:"#72d7c0",title:"Memova",desc:"Ask multiple databases questions in plain English via Gemini. FastAPI + React.",tags:["FastAPI","React"],repo:"https://github.com/vanshulgoyal101/memova"}]},{category:"Space & earlier",items:[{icon:e.jsx(pe,{}),color:"#72d7c0",title:"NASA Space Apps Collective",desc:"Selected among 30 global space leaders; built weather-visualisation tools for Zimbabwean farmers from open NASA data.",tags:["NASA","Data"],live:"https://www.spaceappschallenge.org/collective/"},{icon:e.jsx(Wt,{}),color:"#ff8c7a",title:"GoRemote",desc:"My B.Tech major project — a virtual-office platform for remote teams (Phaser, React, Redux, PeerJS, Colyseus).",tags:["MERN","Phaser"],repo:"https://github.com/vanshulgoyal101/GoRemote"}]}],je={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}},Te={hidden:{opacity:0,y:30},visible:t=>({opacity:1,y:0,transition:{duration:.55,delay:t*.12,ease:"easeOut"}})},Bn=({src:t,alt:o,fallback:n})=>{const[r,i]=s.useState(!1);return e.jsx(hn,{children:r?e.jsx(mn,{children:n}):e.jsx(pn,{src:t,alt:o,loading:"lazy",onError:()=>i(!0)})})},Hn=()=>e.jsx(nn,{id:"projects",children:e.jsxs(rn,{children:[e.jsxs(sn,{variants:je,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},children:[e.jsx(ln,{children:"Featured Projects"}),e.jsx(cn,{children:"From space exploration to software development — projects that define my journey"})]}),e.jsx(dn,{children:On.map((t,o)=>e.jsxs(Xe,{custom:o,variants:Te,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},whileHover:{y:-5},children:[e.jsx(Bn,{src:t.image,alt:t.title,fallback:t.fallbackIcon}),e.jsxs(gn,{children:[e.jsx(un,{children:t.title}),e.jsx(xn,{children:t.role}),e.jsx(fn,{children:t.description}),e.jsx(vn,{children:t.stats.map((n,r)=>e.jsxs(bn,{children:[n.icon,e.jsx("span",{children:n.text})]},r))}),t.link&&t.link!=="#"&&e.jsxs(yn,{href:t.link,target:"_blank",rel:"noopener noreferrer",children:["Visit Website",e.jsx(ee,{size:12})]})]})]},t.id))}),e.jsxs(wn,{children:[e.jsxs(kn,{variants:je,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},children:[e.jsx(jn,{children:"More things I've built"}),e.jsx(Tn,{children:"Live products, open-source packages and interactive experiments."})]}),Wn.map(t=>e.jsxs(Sn,{children:[e.jsx(In,{children:t.category}),e.jsx(zn,{children:t.items.map((o,n)=>e.jsxs(Cn,{custom:n,variants:Te,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.1},children:[e.jsxs(An,{children:[e.jsx(En,{$color:o.color,"aria-hidden":"true",children:o.icon}),e.jsx(Ln,{children:o.title}),o.live&&e.jsx(Rn,{children:"Live"})]}),e.jsx(_n,{children:o.desc}),o.tags&&o.tags.length>0&&e.jsx(Fn,{children:o.tags.map(r=>e.jsx(Pn,{$mono:/\s|install/.test(r),children:r},r))}),(o.live||o.repo)&&e.jsxs($n,{children:[o.live&&e.jsxs(ke,{href:o.live,target:"_blank",rel:"noopener noreferrer",children:["Visit ",e.jsx(ee,{size:10})]}),o.repo&&e.jsxs(ke,{href:o.repo,target:"_blank",rel:"noopener noreferrer",children:[e.jsx(ie,{size:13})," Code"]})]})]},o.title))})]},t.category))]})]})}),Nn=async t=>null,Vn=async()=>({}),qn=t=>t==null||Number.isNaN(t)?null:new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:1}).format(t).toLowerCase(),le=a(d.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
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
`,Dn=a(ne)`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
  
  &:focus-visible ${le} {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
`,Gn=a.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin-bottom: var(--spacing-sm);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  /* Views read as secondary, quieter than date/read-time */
  span.views {
    opacity: 0.7;
  }

  svg {
    flex-shrink: 0;
    font-size: 0.95em;
    opacity: 0.7;
  }
`,Yn=a.h3`
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
`,Xn=a.p`
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
`,Jn=a.span`
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${le}:hover & svg {
    transform: translateX(5px);
  }
`,Je=({blog:t,index:o,variants:n,views:r})=>{if(!t)return null;const i=typeof window<"u"&&window.innerWidth<=768;return e.jsx(Dn,{to:`/blog/${t.slug}`,children:e.jsxs(le,{variants:n,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},transition:{delay:o*.1},whileHover:i?{}:{scale:1.02},role:"article","aria-label":`Blog post: ${t.title}`,children:[e.jsxs(Gn,{children:[e.jsxs("span",{children:[e.jsx(Bt,{"aria-label":"Publication date"})," ",t.date]}),e.jsxs("span",{children:[e.jsx(Ht,{"aria-label":"Reading time"})," ",t.readTime]}),r!=null&&e.jsxs("span",{className:"views",children:[e.jsx(Nt,{"aria-label":"Views"})," ",qn(r)]})]}),e.jsx(Yn,{children:t.title}),e.jsx(Xn,{children:t.summary}),e.jsxs(Jn,{children:["Read More ",e.jsx(Oe,{})]})]})})};Je.propTypes={blog:y.shape({id:y.number.isRequired,title:y.string.isRequired,summary:y.string.isRequired,date:y.string.isRequired,readTime:y.string.isRequired,slug:y.string.isRequired,category:y.string}).isRequired,index:y.number.isRequired,variants:y.object.isRequired,views:y.number};const Un=[{title:"The Almanack of Naval Ravikant",author:"Eric Jorgenson",note:"Wealth, health and peace aren't luck — they're skills. The closest thing to a manual for all three."},{title:"Exhalation",author:"Ted Chiang",note:"Science fiction for people who actually think. Each story is a quiet thought experiment that rearranges you."},{title:"The Lifecycle of Software Objects",author:"Ted Chiang",note:"What do we owe the minds we build? Chiang takes his time, and the question stays with you for years."},{title:"The Prophet",author:"Kahlil Gibran",note:"Old wisdom in plain clothes. Read one page, close the book, and think for an hour."},{title:"The Alchemist",author:"Paulo Coelho",note:"One simple idea that is hard to live: commit fully, and the world starts conspiring to help you."},{title:"The Midnight Library",author:"Matt Haig",note:"Every regret is a door to a life you didn't live. The work is learning to close them and stay."},{title:"The Three-Body Problem",author:"Liu Cixin",note:"Physics as horror. It keeps stretching your sense of scale until the present feels small."},{title:"Macbeth",author:"William Shakespeare",note:"Ambition with no floor. A good man talks himself into ruin, one rationalisation at a time."},{title:"Sapiens",author:"Yuval Noah Harari",note:"We run the planet because we can believe in things that don't exist — money, nations, gods, all stories."},{title:"1984",author:"George Orwell",note:"Control the words and you control the thoughts. Worth rereading whenever you feel too comfortable."},{title:"80,000 Hours",author:"Benjamin Todd",note:"You'll work about 80,000 hours in a life. Spend them like they matter, because they do."},{title:"The Daily Stoic",author:"Ryan Holiday",note:"One page a day. Not to sound wise — to actually be a little calmer tomorrow."}],Qn=a(ne)`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
`,Ue=a(d.article)`
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
`,Kn=a.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin-bottom: var(--spacing-sm);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
    font-size: 0.95em;
    opacity: 0.85;
    color: var(--color-accent-primary);
  }
`,Zn=a.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
`,er=a.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
`,tr=a.div`
  flex: 1;
`,ar=a.span`
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);

  svg {
    transition: transform 0.3s ease;
  }

  ${Ue}:hover & svg {
    transform: translateX(5px);
  }
`,Qe=({variants:t})=>e.jsx(Qn,{to:"/reading-list","aria-label":"Reading list: From My Shelf",children:e.jsxs(Ue,{variants:t,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.15},whileHover:{scale:1.02},role:"article",children:[e.jsxs(Kn,{children:[e.jsxs("span",{children:[e.jsx(Vt,{"aria-hidden":"true"})," Reading list"]}),e.jsxs("span",{children:[Un.length," books"]})]}),e.jsx(Zn,{children:"From My Shelf"}),e.jsx(er,{children:"Books that shaped how I think — fiction and non-fiction alike."}),e.jsx(tr,{}),e.jsxs(ar,{children:["Read More ",e.jsx(Oe,{})]})]})});Qe.propTypes={variants:y.object};const or=re`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`,nr=a.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: ${t=>t.$minHeight||"300px"};
  
  @media (max-width: 768px) {
    min-height: ${t=>t.$mobileMinHeight||"250px"};
  }
`,z=a.div`
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(99, 102, 241, 0.1) 50%,
    rgba(99, 102, 241, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: ${or} 2s infinite linear;
  border-radius: ${t=>t.$radius||"8px"};
  height: ${t=>t.$height||"20px"};
  width: ${t=>t.$width||"100%"};
`,rr=a.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
`,ir=a.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
`,sr=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`,lr=()=>e.jsxs(nr,{$minHeight:"400px",$mobileMinHeight:"350px",children:[e.jsxs(rr,{children:[e.jsx(z,{$width:"80px",$height:"24px",$radius:"12px"}),e.jsx(z,{$width:"100px",$height:"18px"})]}),e.jsxs(ir,{children:[e.jsx(z,{$width:"90%",$height:"32px",$radius:"4px"}),e.jsx(z,{$width:"100%",$height:"20px"}),e.jsx(z,{$width:"95%",$height:"20px"}),e.jsx(z,{$width:"85%",$height:"20px"})]}),e.jsxs(sr,{children:[e.jsx(z,{$width:"120px",$height:"18px"}),e.jsx(z,{$width:"80px",$height:"18px"})]})]});y.string,y.string,y.node;const oe=t=>Array.isArray(t)?[...t].sort((o,n)=>new Date(n.date)-new Date(o.date)):[],Di=(t,o,n=3)=>{if(!Array.isArray(t)||!o)return[];const r=t.filter(c=>c.slug&&c.slug!==o.slug),i=o.category?r.filter(c=>c.category===o.category):[],l=r.filter(c=>!i.includes(c));return[...oe(i),...oe(l)].slice(0,Math.max(0,n))},cr=`---
id: 2
title: "Health in a Post-AGI World"
slug: "health-post-agi"
summary: "In a post-AGI world of abundance, humanity's focus shifts from work to the holistic pursuit of health and well-being."
date: "25 Sep, 2024"
readTime: "3 min read"
category: "AI"
---

For all of history, one force has shaped our lives: the need to work. We work for food, for shelter, for a living. Our days, our years, and our societies are all built around it.

Remove that pillar. What happens?

A thought experiment. It's a few decades from now. Artificial general intelligence — perhaps superintelligence — has arrived. It has solved our hardest logistical problems: energy, production, distribution. Abundance is real, and the need to work to survive simply disappears.

When you no longer owe eight hours a day to earning a living, what do you do with them? Once "How do I survive?" is answered for everyone, what is the next question?

I think the focus turns inward — from the world of tasks and jobs to the state of our own being. If it does, the pursuit of **health** becomes humanity's central project. Maybe the most important one we've ever had.

But health would mean far more than the absence of disease. It becomes the active, lifelong cultivation of human potential. Think of it in three layers.

## Physical: mastering the vessel

No job breaks your body or chains you to a chair. You have the time and energy to build:

- **Strength** — the foundation of vitality, not just a tool for labor.
- **Mobility** — the freedom to move without pain.
- **Endurance** — the capacity to explore and play for longer.
- **Longevity** — and beyond lifespan, *healthspan*: the years lived in a state of real vitality.

## Mental: tending the garden within

Most modern anxiety comes from work — deadlines, money, status. Take those away and the mind is free, but idle. What fills it?

Inner clarity and stability. Emotional regulation not as a way to survive a stressful job, but as a skill for deeper relationships and personal peace. You learn for the sake of curiosity. You build resilience against the uncertainty that never fully leaves.

## Spiritual: the search for why

This may be the interesting one. When what you do for a living no longer defines you, you are left with *why*. Why are we here? What gives us purpose and connection?

For many, that becomes the main pursuit — through philosophy, community, art, nature, or older spiritual paths. The search for meaning stops being a luxury squeezed into weekends and becomes the main event.

For millennia, our project has been to master the world around us. In a post-AGI world, the only project left might be to master ourselves.
`,dr=`---
id: 1
title: "Meat Without The Animal"
slug: "meat-without-the-animal"
summary: "What if meat wasn't something we harvested, but something we designed? Exploring the world of cultivated meat and how it could change our relationship with food itself."
date: "16 Nov, 2023"
readTime: "3 min read"
category: "Future of Food"
---

We take our own progress for granted. We build skyscrapers and write code that connects billions of people. But our food still runs on ancient software. For thousands of years, eating meat has meant one thing: raise an animal and kill it.

It's a simple, almost primal equation. Is it still the right one? What happens if we look at meat from first principles?

What is meat, really? A specific arrangement of proteins, fats, and minerals that our bodies find nourishing and our palates find delicious. The animal is just the factory that produces it. So the question becomes: can we build a better factory?

That is cultivated meat — grown directly from animal cells, without the animal. Not a substitute. Meat. It sounds like science fiction, and it's already happening. Three things follow.

## You can design for health

An animal's meat is a product of its own evolution, not of our nutrition. A cow is optimized to be a cow. Its ratio of saturated to unsaturated fat, its profile of vitamins and minerals — these come as a package you can't edit.

Grow the meat directly and it becomes a design problem. A steak with the fat profile of an avocado. More Omega-3s. Meat tuned for the human body instead of the animal's. The factory turns into a laboratory.

## You can end a quiet compromise

Many people feel a small conflict every time they eat meat. They enjoy it, and they know the cost — the animal welfare, the land, the methane. It's a trade we've all silently agreed to.

Cultivated meat breaks the trade. The same end product, minus the suffering and most of the environmental footprint. You get what you want without the ethical and ecological bill. A technology that could dissolve a global-scale moral tension.

## Food becomes software

This is the strangest part. When you grow meat cell by cell, you control its final form. Why does a steak have to be steak-shaped?

You could grow it in any structure you can imagine — a printed lattice of muscle and fat with a texture nature never made. Food stops being something we *harvest* and becomes something we *design*. Hardware to software.

None of this is easy. Scaling is hard, cost is high, and regulation is slow. But the direction is clear.

For all of history, we ate what the natural world happened to offer. Now we're learning to define what our food is, from the molecule up. It's a new kind of leverage, and it might just change everything.
`,hr=`---
id: 3
title: "Preserving Stories"
slug: "preserving-stories"
summary: "Using AI to preserve personal stories, while also considering immense privacy challenges..."
date: "26 Dec, 2024"
readTime: "3 min read"
category: "AI"
---

What is a life, really? Strip everything else away and we are a collection of stories.

Some are small and entirely personal. They live only inside your own mind — a quiet realization, a private joke, the memory of a feeling you never said aloud. These are the core of who you are.

Others involve people. A family holiday, a hard project, a shared laugh. In those, you are a character and a co-author. Your thread is woven into theirs.

Then someone dies. The personal stories — the ones only they knew — vanish in an instant. An entire library of a life, gone. The shared ones linger a little longer, as echoes in the people who were there.

How deeply someone marks us seems tied to how many stories we shared with them. The more threads between two lives, the sharper the tear when one is cut.

For all of history, this fading has been a simple, unchangeable fact. Does it have to be?

What if we could build a vessel for these stories — a place to hold them safely, understand them, and keep them long after we're gone? Not AI as a tool for productivity, but AI as a **gentle archivist of a human life**.

Imagine an AI that learns your stories over a lifetime. Not by recording video or audio, but by grasping the context, the emotion, and the connections between them. It learns your perspective, your sense of humor, the way your voice changed when a story truly mattered to you.

Follow that far enough and something profound appears. What if I could know my grandfather from ten generations back — not just his name and dates, but the texture of his days? What if I could ask, "What did an ordinary afternoon feel like?" or "When were you truly happy?" A bridge of understanding across centuries.

It isn't simple. It raises some of the hardest questions we have:

- **Privacy.** Who gets access? We show different parts of ourselves to different people. How could a system honor those boundaries?
- **Security.** This would be the most personal data imaginable — the library of a soul. How could we ever keep it from being stolen, twisted, or misused?
- **Access.** Who holds the keys? Do we decide, before we go, who may listen? Is it a legacy we hand down like an heirloom?

Hard questions. But the reason to ask them feels important. Maybe the greatest thing we can leave the future isn't money or property. It's our story — told honestly and kept with care. A way of saying: I was here. This is what it felt like to be me.

In a world that often feels disconnected, that might be the most lasting connection of all.
`,pr=`---
id: 4
title: "Can we create a silicon valley in India?"
slug: "silicon-valley-india"
summary: "Should India copy America's Silicon Valley model or build a unique tech culture rooted in its own traditions..."
date: "10 Jul, 2025"
readTime: "2 min read"
category: "Tech Industry"
---

Everywhere in Indian tech you hear the same ambition: build our own **Silicon Valley**. It's a powerful idea. But what does it actually mean? Is Silicon Valley a blueprint you can copy and paste, or something that grew out of one particular place and time?

I've spent time in places like **Gurgaon**, and something stands out. The office towers, the cafes, the language used in meetings — it all feels familiar. It looks and sounds like the American tech hubs we see in pictures. That makes sense: much of the early money and many of the big companies came from America, and a working formula tends to get reused.

Walk through Cyberhub and you're fully inside that formula — a dense grid of restaurants, pubs, and coffee shops, fast-paced by day and full of people unwinding by night. The lifestyle is part of the package.

But the package has a cost. The commute is heavy traffic. The air is a regular topic of conversation. The noise is loud and constant. It's a high-energy, high-pressure environment, and it makes me wonder what it does to people day to day.

There's a deeper mismatch too. The work culture we imported was built in the West, in highly individualistic societies. India is built differently — around strong ties to family and community. What happens when you drop one society's work culture into another's social structure? How does it change the way people collaborate, and how they feel?

Look elsewhere and the picture gets interesting. **Japan, China, and South Korea** are all major players in technology. None of them feel exactly like Silicon Valley. They blended global ambition with their own local identity. So there is clearly more than one path to a world-class tech industry.

Which leaves the real question. To build something big and lasting, do you adopt a template that worked somewhere else, or build a new one from local materials? Should our tech hubs stand on an imported model, or on the unique social and cultural bricks of India itself?

I don't have the answer. But it feels like the right question to be asking while we're still building.
`,mr=`---
id: 8
title: "Taste Is the Last Moat"
slug: "taste-is-the-last-moat"
summary: "When anyone can generate code, art, and writing for free, producing stops being rare. The scarce skill becomes taste and judgment — knowing what's worth making, and what's true."
date: "29 Jul, 2026"
readTime: "4 min read"
category: "Future of Work"
---

For most of history, the hard part was making the thing.

Writing was slow. Code was slow. A painting took weeks, a film took years, a product took a team. Because production was expensive, the ability to produce was itself valuable. If you could write clean code, or draw well, or turn a phrase, you had a moat. The skill was the scarcity.

That moat is draining.

When an AI can generate a thousand lines of working code, a hundred images, or a dozen drafts of an essay in the time it takes to describe what you want, the ability to *produce* stops being rare. Everyone has the same infinite factory now. The cost of making things is falling toward zero.

So what's left? When anyone can make anything, the scarce thing is knowing what's worth making.

## The bottleneck moves from making to choosing

Give ten people the same AI and ask each for an essay. You'll get ten thousand words in a minute. Nine of those essays will be forgettable, and the difference won't be the tool — it'll be the person holding it. One of them knew which sentence to keep and which to cut. Knew the idea was a cliché before writing it down. Knew when the piece was actually good, and when it merely looked good.

That's taste. Taste is knowing what's worth making; judgment is knowing what's true and what to do. As production gets free, both become the whole game. The work shifts from *can you make it* to *should you, and is it any good* — and those questions don't have an autocomplete.

## Why judgment gets more valuable, not less

[Naval Ravikant](https://nav.al) makes a point that lands harder every year: leverage is a force multiplier for your judgment. Code, capital, media — and now AI — all multiply whatever decision you make. And multiplication cuts both ways.

Good judgment times a little leverage is a good outcome. Good judgment times enormous leverage is a fortune. But bad judgment times enormous leverage is a disaster at scale. When leverage was scarce, a bad call cost you a little. Now that anyone can point near-infinite leverage at a problem with a single sentence, the quality of the sentence is everything.

So the more powerful the tools get, the more the outcome depends on the judgment aiming them. We aren't automating away the need to decide well. We're amplifying it.

## Taste is compressed experience

The frustrating thing about taste is that you can't download it. It's the residue of thousands of small judgments — things you made, shipped, and watched either fail or land. It's knowing something is off before you can explain why. You can't prompt your way to it, because it's exactly the part that isn't written down anywhere.

Which is good news. In a world where every explicit skill can be copied instantly, the things that can't be copied become priceless: taste, judgment, a point of view. They're earned, not generated. They compound quietly over a career, and they can't be handed to a competitor.

## What to do about it

If production is free and judgment is scarce, the move is obvious: stop optimizing for output, start optimizing for discernment.

Make a lot of things — but pay attention to which ones were actually good, and why. Develop opinions. Study the work you admire until you can feel the gap between fine and excellent. Learn to kill your own darlings quickly. The goal isn't to produce more; the machines win that race. The goal is to become the person who knows what's worth producing.

In an age where everyone can make anything, the last moat is knowing what's worth making. Everything else is a commodity.
`,gr=`---
id: 5
title: "The New Leverage"
slug: "the-new-leverage"
summary: "Work feels meaningful when we create value. Historically, this required leverage like capital or labor. Today, Agentic AI and Robotics offer new, exponential leverage to everyone."
date: "27 Aug, 2025"
readTime: "4 min read"
category: "Future of Work"
---

Why do we work?

Strip away the paycheck and you find something simple: the best work creates value for other people. It's the feeling of making a small dent in the universe. If you want to go deep on this, [**80,000 Hours**](https://80000hours.org/) does excellent research on building a career around impact.

Big dents have always needed leverage. Leverage is what lets one person multiply their effort into something large. The old forms are familiar:

- **Capital.** Money to fund tools and projects.
- **Labor.** People to coordinate.
- **Code and media.** Things that copy for free. This is the one [**Naval Ravikant**](https://nav.al) made famous: write the code once, record the podcast once, and it serves millions at no extra cost.

Now two new forms of leverage are arriving. Both compound. And both are being handed to individuals.

## Agentic AI

An agent isn't a tool you command. It's a collaborator you give a goal. It plans, uses other software, and fixes its own mistakes to get the job done. For a good technical breakdown, read Lilian Weng on [**LLM-powered autonomous agents**](https://lilianweng.github.io/posts/2023-06-23-agent/).

The interesting part is the feedback loop. An agent can learn, improve, and even rewrite its own code to work better. The more you use it, the more leverage you have. It's a partner that costs nothing to copy and gets smarter every day.

## Robotics

For centuries, "labor" meant humans. A thousand houses needed thousands of people. Not for much longer.

Don't picture a factory arm. Picture the agile, learning machines from [**Boston Dynamics**](https://bostondynamics.com/), or Tesla's **Optimus** — general-purpose humanoids designed to walk into a space built for people and do the work, instead of sitting bolted to an assembly line.

The reason this matters is economics. A human hour of labor costs roughly $20, and more once you add benefits, training, and overhead. Tesla is targeting a production cost of around $20,000–$30,000 per Optimus at scale. Amortize that over a few years of near-continuous work, add electricity and maintenance, and a robot-hour drops to a few dollars — plausibly around $2. These are projections, not receipts, and robotics has a long history of optimistic timelines. But even if the estimate is off by half, the direction is unmistakable: the price of physical labor is sliding from about $20 an hour toward about $2.

Hand these machines the repetitive, dangerous, draining tasks and what's left is the interesting part: the creative, the strategic, the human. You stop managing people doing simple things and start directing tireless machines. Physical leverage approaches infinity.

## The bottleneck moves

Put the two together and any individual with a good idea gets the intellectual and physical leverage that used to belong to institutions.

The constraint is no longer who has the capital or who can hire the most people. It's who can ask the most interesting questions.

We won't stop working. The work will change. It shifts from something we do to survive into something we do to create — and we finally get to make the dents we always wanted to make.
`,ur=`---
id: 6
title: "The Two Worlds"
slug: "the-two-worlds"
summary: "Developing nations are fighting for clean water and reliable roads. Developed nations are building AI and racing to Mars. Are we living in two different worlds?"
date: "12 Oct, 2025"
readTime: "3 min read"
category: "Infrastructure"
---

We don't live in one world. We live in two.

In the first, the struggle is with the basics. How do you get clean water to a village? Build a road that survives the monsoon? Keep the lights on, the food safe, a roof over everyone's head?

This is a fight against gravity and entropy — the slow work of building a foundation. Its heroes aren't coders or venture capitalists. They're civil engineers, doctors, farmers. Their opponent is nature itself.

In the second world, the basics are assumed. The water is clean. The lights are on. The roads are paved. The struggle isn't scarcity. It's possibility.

The questions turn abstract, aimed at the future. How do we build artificial general intelligence? Become a multi-planetary species? Make transport autonomous? Cure aging?

This is a fight against imagination, waged on top of a foundation so reliable it has become invisible. Its heroes are scientists, programmers, thinkers. Their opponent is the limit of what we believe is possible.

The first world plays defense. The second plays offense.

Technology was supposed to be the bridge — the great equalizer. Sometimes it is. A farmer checks crop prices on a cheap phone. A student reads the world's library.

But technology also widens the gap. One world uses AI to raise crop yields; the other uses it to build autonomous weapons and digital realities. Same tools, different games. The outcomes diverge.

We aren't on the same path. We aren't even in the same race. One group is running a marathon just to reach the starting line. The other is already in a spaceship, arguing about the destination.

Seeing this clearly isn't about blame or pity. The challenges differ. The mindsets differ. Even the meaning of the word "progress" differs.

Until the foundation is built everywhere, we'll keep living in two worlds on two timelines. One looking at the ground. The other at the stars.
`,xr=`---
id: 7
title: "Will Money Ever Become Obsolete?"
slug: "will-money-become-obsolete"
summary: "One camp says extreme abundance — robots plus limitless solar energy — will make money pointless. The other says scarcity is permanent, and so is the tool built to manage it. The disagreement is really about what money is for."
date: "8 Feb, 2026"
readTime: "6 min read"
category: "Economics"
---

The question splits into two camps, and both are serious.

One says extreme abundance is coming: robots do the work, the sun supplies the energy, and everything gets so cheap that money loses its point. The other says scarcity is permanent, and so is the thing built to manage it. The disagreement isn't really about technology. It's about what money is for.

## What money does

Money does three jobs. It's a medium of exchange, so trade doesn't require two people who each want exactly what the other has. It's a unit of account, a shared yardstick for comparing a house to a haircut. And it's a store of value, a way to carry purchasing power across time.

None of those is wealth. Money is the accounting layer on top of wealth — the way scarcity keeps score.

## The abundance case

Every product hides two costs: labor and energy. Everything else is those two in disguise.

Robots that build robots push the cost of labor toward zero. Solar — on rooftops, in deserts, eventually in orbit where the sun never sets — pushes the cost of energy the same way. Free labor plus free energy collapses the marginal cost of anything you can manufacture.

Follow that to its end and one conclusion is hard to avoid: for goods you can copy and mass-produce, prices fall toward the floor. Survival stops being expensive. Working to eat stops being necessary. In that world, a currency built on the scarcity of human labor loses most of its reason to exist.

## The counter-force

The same pattern keeps repeating: whatever becomes abundant stops being where value lives. Cheapen one thing and value moves to whatever's still finite.

So the sharper question is what stays scarce even inside abundance.

**Energy.** The sun is vast, not infinite, and never free — someone builds the panels and owns the orbit. And cheap energy has always increased demand for it, not reduced it; that's the [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox). Computation adds a hard floor: by [Landauer's principle](https://en.wikipedia.org/wiki/Landauer%27s_principle), every calculation costs a minimum amount of energy, permanently. As machines consume more of it, energy stays scarce no matter how much supply grows.

**Time and attention.** Twenty-four hours in a day, one of any given person. No machine mass-produces a specific human's hour.

**Status.** Some goods are valuable only because others lack them — the front-row seat, the original, being first. These [positional goods](https://en.wikipedia.org/wiki/Positional_good) are zero-sum by arithmetic. You cannot make everyone above average, so abundance can't reach them.

As long as anything is scarce, it has to be rationed — by prices, queues, lotteries, connections, or force. Removing money doesn't remove that problem. It only changes which of those five does the rationing.

## The allocation problem

There's a deeper reason prices are hard to replace, and it's older than computers.

To allocate anything well, you have to know what people actually want — not what they say, but what they'd give something up for. Wanting only becomes measurable when it costs something. A price is that cost made visible.

This was Hayek's point in the [socialist calculation debate](https://en.wikipedia.org/wiki/Socialist_calculation_debate): the knowledge an economy runs on is scattered across billions of people, much of it tacit and changing constantly. No central mind holds it. Prices carry it — a signal that tells everyone what to do without anyone knowing the whole picture. A more powerful planner, human or machine, still faces the same gap: the information isn't stored anywhere to be read. It only exists in the act of people choosing under constraint.

[Comparative advantage](https://en.wikipedia.org/wiki/Comparative_advantage) adds one more layer. Even an agent better at every task has finite time, so trading still beats doing everything alone. Trade requires a unit. That unit is money.

## Three questions people merge into one

Most disagreement comes from collapsing three separate questions.

Will physical cash disappear? Across history money has shifted form constantly — shells, metal, paper, fiat, tokens — while its function never changed. Form and function aren't the same thing.

Will a specific currency end? Currencies collapse and get replaced routinely. Replacement isn't absence.

Will prices themselves become unnecessary? That requires the total disappearance of scarcity — energy, time, and status included.

One scenario sits between the extremes: dollars, tied to labor scarcity, fade, while money re-denominates into whatever stays scarce underneath — energy, or the compute it buys. Under that path the unit changes and the function survives, and money grows so automated it stops being visible, without ceasing to exist.

Which camp is right turns on a single variable: whether scarcity can ever fully end. Everything above the survival line — energy, attention, status, a specific person's time — suggests the parts that are easy to make abundant were never the parts money was really about.
`,Se=Object.assign({"../blogs/health-post-agi.md":cr,"../blogs/meat-without-the-animal.md":dr,"../blogs/preserving-stories.md":hr,"../blogs/silicon-valley-india.md":pr,"../blogs/taste-is-the-last-moat.md":mr,"../blogs/the-new-leverage.md":gr,"../blogs/the-two-worlds.md":ur,"../blogs/will-money-become-obsolete.md":xr}),fr=t=>{const o=t.replace(/\r\n/g,`
`),n=/^---\n([\s\S]*?)\n---\n([\s\S]*)$/,r=o.match(n);if(!r)return{data:{},content:o};const i=r[1],l=r[2],c={};return i.split(`
`).forEach(x=>{const g=x.indexOf(":");if(g>0){const m=x.substring(0,g).trim();let p=x.substring(g+1).trim();(p.startsWith('"')&&p.endsWith('"')||p.startsWith("'")&&p.endsWith("'"))&&(p=p.slice(1,-1)),!isNaN(p)&&p!==""?c[m]=Number(p):c[m]=p}}),{data:c,content:l.trim()}};let X=null;const Ke=()=>{if(X)return X;const t=[];for(const o in Se){const n=o.split("/").pop().replace(".md","");try{const r=Se[o],{data:i,content:l}=fr(r);t.push({...i,content:l,filename:n})}catch(r){console.error(`Error loading blog post ${n}:`,r)}}return X=t,t},Gi=t=>Ke().find(n=>n.slug===t)||null,vr=()=>{const[t,o]=s.useState({});return s.useEffect(()=>{let n=!0;return Vn().then(r=>{n&&o(r)}),()=>{n=!1}},[]),t},Yi=t=>{const[o,n]=s.useState(null);return s.useEffect(()=>{if(!t)return;let r=!0;return n(null),Nn().then(i=>{r&&i!=null&&n(i)}),()=>{r=!1}},[t]),o},O={container:{hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2,delayChildren:.3}}},item:{hidden:{opacity:0,y:30},visible:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}}}},M={sectionTitle:"Writings",sectionSubtitle:"A collection of thoughts and insights",emptyStateTitle:"Coming Soon",emptyStateMessage:"I'm currently crafting my thoughts into words. Check back soon for insights and stories from my journey.",quote:{text:"Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.",author:"Naval Ravikant"}},br=a.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;
`,yr=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,wr=a(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`,kr=a.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,jr=a.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`,Ie=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`,Tr=a.div`
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
`,Sr=a(d.div)`
  max-width: 700px;
  margin: var(--spacing-2xl) auto;
  text-align: center;
  position: relative;
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
`,Ir=a.div`
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.2;
  margin-bottom: var(--spacing-md);
`,zr=a.blockquote`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`,Cr=a.cite`
  font-size: var(--text-base);
  color: var(--color-accent-primary);
  font-style: normal;
  
  &::before {
    content: '— ';
  }
`,Ar=()=>{const t=s.useMemo(()=>{try{return Ke()}catch(i){return console.error("Error loading blog posts:",i),[]}},[]),o=s.useMemo(()=>oe(t),[t]),n=vr(),[r]=s.useState(!1);return e.jsx(br,{id:"blog",children:e.jsxs(yr,{children:[e.jsx(wr,{variants:O.container,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(d.div,{variants:O.item,children:[e.jsx(kr,{children:M.sectionTitle}),e.jsx(jr,{children:M.sectionSubtitle})]})}),r?e.jsx(Ie,{children:[...Array(3)].map((i,l)=>e.jsx(lr,{},`skeleton-${l}`))}):o&&o.length>0?e.jsxs(Ie,{children:[e.jsx(Qe,{variants:O.item}),o.map((i,l)=>e.jsx(Je,{blog:i,index:l,variants:O.item,views:n[i.slug]},i.id))]}):e.jsxs(Tr,{children:[e.jsx(qt,{}),e.jsx("h3",{children:M.emptyStateTitle}),e.jsx("p",{children:M.emptyStateMessage})]}),e.jsxs(Sr,{variants:O.item,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsx(Ir,{children:e.jsx(Dt,{})}),e.jsx(zr,{children:M.quote.text}),e.jsx(Cr,{children:M.quote.author})]})]})})},Er="https://formspree.io/f/xgvzkqob",Ze=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,J=(t,o)=>{const n=o.trim();return t==="name"?n?"":"Please enter your name.":t==="email"?n?Ze.test(n)?"":"Please enter a valid email address.":"Please enter your email address.":t==="message"?n?"":"Please enter a message.":""},Mr=(t={name:"",email:"",message:""})=>{const{showSuccess:o,showError:n}=fa(),[r,i]=s.useState(t),[l,c]=s.useState(!1),[h,x]=s.useState({}),g=p=>{const{name:u,value:v}=p.target;if(i(f=>({...f,[u]:v})),u==="email"){const f=!v||Ze.test(v);x(w=>({...w,email:f?"":"Please enter a valid email address."}))}else x(f=>f[u]?{...f,[u]:""}:f)},m=async p=>{p.preventDefault();const u={name:J("name",r.name),email:J("email",r.email),message:J("message",r.message)};if(x(u),u.name||u.email||u.message){n("Missing details","Please add your name, a valid email, and a message.");return}c(!0);try{(await fetch(Er,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...r,_replyto:r.email,_subject:`Portfolio Contact: ${r.name}`})})).ok?(o("Message Sent!","Thank you for reaching out. I'll get back to you soon!"),i(t),x({})):n("Oops! Something went wrong","Failed to send your message. Please try again or email me directly.")}catch{n("Network Error","Unable to send message. Please check your connection and try again.")}finally{c(!1)}};return{formState:r,isSubmitting:l,errors:h,emailError:h.email||"",handleChange:g,handleSubmit:m}},Lr=a.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;
  min-height: 80vh;
`,Rr=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`,_r=a(d.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`,Fr=a.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,Pr=a.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`,$r=a.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,Or=a(d.div)`
  padding: var(--spacing-lg);
`,Wr=a.h3`
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`,ze=a.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
`,Br=a(d.div)`
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
`,Hr=a.div`
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.25rem;
`,Nr=a.div`
  flex: 1;
`,Vr=a.p`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 2px;
`,qr=a.p`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: 500;
`,Dr=a(d.div)`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`,Gr=a(d.a)`
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
`,Yr=re`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Xr=a.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${Yr} 0.8s linear infinite;
`,Jr=a(d.div)`
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
`,Ur=a.form`
  position: relative;
  z-index: 2;
`,U=a.div`
  margin-bottom: var(--spacing-md);
`,Q=a.label`
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
`,Ce=a.input`
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
`,Qr=a.textarea`
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
`,Kr=a(d.button)`
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
`,K=a.p`
  font-size: var(--text-xs);
  color: #ef4444;
  margin-top: 4px;
`,Zr=()=>{const{formState:t,isSubmitting:o,errors:n,handleChange:r,handleSubmit:i}=Mr(),l=[{icon:e.jsx(Yt,{}),label:"Location",value:"India"},{icon:e.jsx(Xt,{}),label:"Current Position",value:"United Airlines"},{icon:e.jsx(Jt,{}),label:"Languages",value:"English, Hindi"}],c=[{icon:e.jsx(_e,{}),url:"https://x.com/goyal_vanshul",label:"Twitter"},{icon:e.jsx(Fe,{}),url:"https://www.linkedin.com/in/vanshul-goyal00/",label:"LinkedIn"},{icon:e.jsx(Pe,{}),url:"https://www.instagram.com/vanshul_goyal/",label:"Instagram"},{icon:e.jsx(ie,{}),url:"https://github.com/vanshulgoyal101",label:"GitHub"},{icon:e.jsx(se,{}),url:"https://games.vanshul.com",label:"Games"}];return e.jsx(Lr,{children:e.jsxs(Rr,{children:[e.jsx(_r,{variants:fe,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(d.div,{variants:_,children:[e.jsx(Fr,{children:"Get In Touch"}),e.jsx(Pr,{children:"Let's connect and build something amazing together"})]})}),e.jsxs($r,{children:[e.jsxs(Or,{variants:fe,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:[e.jsxs(d.div,{variants:_,children:[e.jsx(Wr,{children:"Let's Connect"}),e.jsx(ze,{children:"Whether you want to discuss technology, engineering, or just say hello, I'd love to hear from you. Feel free to reach out through the form or connect on social media."})]}),l.map(h=>e.jsxs(Br,{variants:_,whileHover:{scale:1.02},children:[e.jsx(Hr,{children:h.icon}),e.jsxs(Nr,{children:[e.jsx(Vr,{children:h.label}),e.jsx(qr,{children:h.value})]})]},h.label)),e.jsxs(d.div,{variants:_,children:[e.jsx(ze,{children:"Connect with me on social media:"}),e.jsx(Dr,{children:c.map(h=>e.jsx(T,{range:35,children:e.jsx(Gr,{href:h.url,target:"_blank",rel:"noopener noreferrer","aria-label":h.label,whileHover:{scale:1.1},whileTap:{scale:.9},children:h.icon})},h.label))})]})]}),e.jsx(Jr,{variants:_,initial:"hidden",whileInView:"visible",viewport:{once:!0,amount:.2},children:e.jsxs(Ur,{onSubmit:i,children:[e.jsxs(U,{children:[e.jsx(Q,{htmlFor:"name",children:"Your Name"}),e.jsx(Ce,{type:"text",id:"name",name:"name",value:t.name,onChange:r,placeholder:"John Doe",required:!0,disabled:o,"aria-invalid":n.name?"true":void 0,"aria-describedby":n.name?"name-error":void 0,style:n.name?{borderColor:"#ef4444"}:{}}),n.name&&e.jsx(K,{id:"name-error",children:n.name})]}),e.jsxs(U,{children:[e.jsx(Q,{htmlFor:"email",children:"Email Address"}),e.jsx(Ce,{type:"email",id:"email",name:"email",value:t.email,onChange:r,placeholder:"john@example.com",required:!0,disabled:o,"aria-invalid":n.email?"true":void 0,"aria-describedby":n.email?"email-error":void 0,style:n.email?{borderColor:"#ef4444"}:{}}),n.email&&e.jsx(K,{id:"email-error",children:n.email})]}),e.jsxs(U,{children:[e.jsx(Q,{htmlFor:"message",children:"Message"}),e.jsx(Qr,{id:"message",name:"message",value:t.message,onChange:r,placeholder:"Tell me about your project or just say hi!",rows:"5",required:!0,disabled:o,"aria-invalid":n.message?"true":void 0,"aria-describedby":n.message?"message-error":void 0,style:n.message?{borderColor:"#ef4444"}:{}}),n.message&&e.jsx(K,{id:"message-error",children:n.message})]}),e.jsx(Kr,{type:"submit",disabled:o,whileHover:o?{}:{scale:1.02},whileTap:o?{}:{scale:.98},children:o?e.jsxs(e.Fragment,{children:[e.jsx(Xr,{}),"Sending..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Gt,{}),"Send Message"]})})]})})]})]})})},ei=a(d.div)`
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
`,ti=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* Fixed height prevents layout shift as words change */
  height: 180px;
`,ai=a(d.h1)`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  color: var(--color-accent-primary);
  letter-spacing: -0.03em;
  line-height: 1;
  /* Reserve space so height never jumps */
  margin: 0;
`,oi=a(d.p)`
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
`,Ae=a(d.span)`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-accent-secondary);
  flex-shrink: 0;
`,ni=[{word:"Hello",lang:"English"},{word:"Hola",lang:"Spanish"},{word:"Bonjour",lang:"French"},{word:"नमस्ते",lang:"Hindi"},{word:"こんにちは",lang:"Japanese"},{word:"Ciao",lang:"Italian"},{word:"你好",lang:"Chinese"},{word:"Hallo",lang:"German"},{word:"Olá",lang:"Portuguese"},{word:"안녕하세요",lang:"Korean"},{word:"Merhaba",lang:"Turkish"},{word:"Shalom",lang:"Hebrew"},{word:"Sawatdee",lang:"Thai"},{word:"Hej",lang:"Swedish"},{word:"Ahoj",lang:"Czech"},{word:"Привет",lang:"Russian"}],Ee=220,ri=8,ii={word:"Welcome",lang:"English"},si=t=>{const o=[...t];for(let n=o.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[o[n],o[r]]=[o[r],o[n]]}return o},li=()=>[...si(ni).slice(0,ri),ii],ci=({onComplete:t})=>{const o=s.useRef(li()),[n,r]=s.useState(0),[i,l]=s.useState(!1),c=s.useRef(t);s.useEffect(()=>{c.current=t},[t]),s.useEffect(()=>{const x=o.current;if(typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){c.current?.();return}const p=setInterval(()=>{r(u=>{const v=u+1;return v>=x.length?(setTimeout(()=>l(!0),Ee),u):v})},Ee);return()=>clearInterval(p)},[]),s.useEffect(()=>{if(!i)return;const x=setTimeout(()=>c.current?.(),500);return()=>clearTimeout(x)},[i]);const h=o.current[n];return e.jsx(R,{children:!i&&e.jsx(ei,{initial:{opacity:1},exit:{opacity:0,scale:.985},transition:{duration:.5,ease:"easeInOut"},children:e.jsx(ti,{children:e.jsx(R,{mode:"wait",children:e.jsxs(d.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},transition:{duration:.13,ease:"easeOut"},style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx(ai,{children:h.word}),e.jsxs(oi,{children:[e.jsx(Ae,{animate:{scale:[1,1.6,1],opacity:[.4,1,.4]},transition:{duration:1.1,repeat:1/0,ease:"easeInOut"}}),h.lang,e.jsx(Ae,{animate:{scale:[1,1.6,1],opacity:[.4,1,.4]},transition:{duration:1.1,repeat:1/0,ease:"easeInOut",delay:.55}})]})]},h?h.word:n)})})},"bootloader")})},di=a(d.div)`
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
`,hi=a(d.div)`
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
`,pi=()=>{const[t,o]=s.useState(!1),[n,r]=s.useState(!1),[i,l]=s.useState(!1),c=me(0),h=me(0),x={damping:25,stiffness:220,mass:.6},g=te(c,x),m=te(h,x);s.useEffect(()=>{const u=window.matchMedia("(hover: hover) and (pointer: fine)"),v=window.matchMedia("(prefers-reduced-motion: reduce)"),f=()=>l(Ge());return f(),u.addEventListener("change",f),v.addEventListener("change",f),window.addEventListener(W,f),()=>{u.removeEventListener("change",f),v.removeEventListener("change",f),window.removeEventListener(W,f)}},[]);const p=s.useRef(null);return s.useEffect(()=>{if(!i)return;const u=E=>{p.current&&cancelAnimationFrame(p.current),p.current=requestAnimationFrame(()=>{c.set(E.clientX),h.set(E.clientY),o(!0)})},v=()=>{o(!1)},f=()=>{o(!0)},w=E=>{const b=E.target;if(!b)return;const j=b.tagName==="A"||b.tagName==="BUTTON"||b.closest("a")||b.closest("button")||b.closest(".interactive")||b.closest('[role="button"]')||b.style.cursor==="pointer";r(!!j)};return window.addEventListener("mousemove",u),document.addEventListener("mouseleave",v),document.addEventListener("mouseenter",f),window.addEventListener("mouseover",w),document.body.classList.add("has-custom-cursor"),()=>{p.current&&cancelAnimationFrame(p.current),window.removeEventListener("mousemove",u),document.removeEventListener("mouseleave",v),document.removeEventListener("mouseenter",f),window.removeEventListener("mouseover",w),document.body.classList.remove("has-custom-cursor")}},[i,c,h]),!i||!t?null:e.jsxs(e.Fragment,{children:[e.jsx(di,{style:{x:c,y:h},animate:{scale:n?.5:1},transition:{duration:.2,ease:"easeOut"}}),e.jsx(hi,{style:{x:g,y:m},animate:{scale:n?1.6:1,backgroundColor:n?"rgba(29, 78, 216, 0.08)":"rgba(29, 78, 216, 0)",borderColor:n?"var(--color-accent-primary)":"rgba(29, 78, 216, 0.4)"},transition:{duration:.2,ease:"easeOut"}})]})},mi=a.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
`;class gi{constructor(){this.pool=[],this.active=[]}obtain(o,n){let r;return this.pool.length>0?(r=this.pool.pop(),r.reset(o,n)):r=new vi(o,n),this.active.push(r),r}recycle(o){const n=this.active[o];this.active.splice(o,1),this.pool.push(n)}clear(){this.active=[]}}const et=(t,o,n)=>{const i=document.createElement("canvas");i.width=128,i.height=128;const l=i.getContext("2d"),c=128/2,h=l.createRadialGradient(c,c,1,c,c,c);return h.addColorStop(0,`rgba(${t}, ${o}, ${n}, 1)`),h.addColorStop(.25,`rgba(${t}, ${o}, ${n}, 0.4)`),h.addColorStop(1,`rgba(${t}, ${o}, ${n}, 0)`),l.fillStyle=h,l.beginPath(),l.arc(c,c,c,0,Math.PI*2),l.fill(),i},ui=[{r:6,g:182,b:212},{r:236,g:72,b:153},{r:139,g:92,b:246},{r:148,g:163,b:184}],xi=ui.map(t=>et(t.r,t.g,t.b)),fi=et(246,243,235);class vi{constructor(o,n){this.reset(o,n),this.maxSize=Math.max(window.innerWidth,window.innerHeight)*.95}reset(o,n){this.x=o,this.y=n,this.size=Math.random()*6+3,this.speedX=(Math.random()-.5)*6,this.speedY=Math.random()*3+1.5,this.opacity=.95,this.growth=Math.random()*5+4;const r=Math.random();r<.25?this.colorIndex=0:r<.5?this.colorIndex=1:r<.75?this.colorIndex=2:this.colorIndex=3}update(){this.x+=this.speedX,this.y+=this.speedY,this.size+=this.growth,this.speedX*=.96,this.speedY*=.96,this.opacity-=.015}draw(o){if(this.opacity<=0)return;o.save();const n=Math.min(1,(.95-this.opacity)/.7),r=xi[this.colorIndex];o.globalAlpha=this.opacity*(1-n*.65),o.drawImage(r,this.x-this.size,this.y-this.size,this.size*2,this.size*2),o.globalAlpha=this.opacity*n*.65,o.drawImage(fi,this.x-this.size,this.y-this.size,this.size*2,this.size*2),o.restore()}}const bi=()=>{const t=s.useRef(null),o=s.useRef(new gi),n=s.useRef(null),r=s.useRef(0),i=s.useRef(!1),l=s.useRef(!1);return s.useEffect(()=>{const c=t.current;if(!c)return;const h=c.getContext("2d",{alpha:!0});if(!h)return;const x=()=>{c.width=window.innerWidth,c.height=window.innerHeight};x(),window.addEventListener("resize",x);const g=u=>{if(!i.current)return;const{x:v,y:f}=u.detail;for(let w=0;w<2;w++)o.current.obtain(v+(Math.random()-.5)*10,f+(Math.random()-.5)*6)};window.addEventListener("rocket-emit-smoke",g);const m=()=>{if(!i.current)return;h.clearRect(0,0,c.width,c.height);const u=Date.now()-r.current,v=o.current;for(let f=v.active.length-1;f>=0;f--){const w=v.active[f];w.update(),w.draw(h),(w.opacity<=0||w.size>w.maxSize)&&v.recycle(f)}if(u>550&&!l.current){l.current=!0;const f=document.getElementById("about");f&&f.scrollIntoView({behavior:"smooth"})}u>800&&v.active.length===0?(i.current=!1,h.clearRect(0,0,c.width,c.height)):n.current=requestAnimationFrame(m)},p=()=>{o.current.clear(),h.clearRect(0,0,c.width,c.height),r.current=Date.now(),l.current=!1,i.current||(i.current=!0,n.current&&cancelAnimationFrame(n.current),n.current=requestAnimationFrame(m))};return window.addEventListener("rocket-launch",p),()=>{window.removeEventListener("resize",x),window.removeEventListener("rocket-emit-smoke",g),window.removeEventListener("rocket-launch",p),n.current&&cancelAnimationFrame(n.current)}},[]),e.jsx(mi,{ref:t})},yi=()=>{const t=V();return s.useRef(!0),s.useEffect(()=>{},[]),s.useEffect(()=>{},[t.pathname]),null},wi=s.lazy(()=>S(()=>import("./BlogPost-CxY11Wze.js"),__vite__mapDeps([9,1,2,3,8,10,4,11]))),ki=s.lazy(()=>S(()=>import("./BlogIndex-DJCiitTR.js"),__vite__mapDeps([12,1,2,8,4,11,3]))),ji=s.lazy(()=>S(()=>import("./ReadingList-CXh4eofz.js"),__vite__mapDeps([13,1,2,3,8,4,11]))),Ti=s.lazy(()=>S(()=>import("./FloatingRocket-DL08I0aN.js"),__vite__mapDeps([0,1,2,3,4]))),Si=s.lazy(()=>S(()=>import("./RandomTelemetry-iVrZ9gAB.js"),__vite__mapDeps([14,1,2,4,8,11,3]))),Ii=s.lazy(()=>S(()=>import("./InteractiveSpaceBackground-C4lApiqt.js"),__vite__mapDeps([15,1,2]))),zi=s.lazy(()=>S(()=>import("./Dashboard-mL7Hc0Qo.js"),__vite__mapDeps([16,1,2,3,8,11,4]))),Ci=a.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`,Ai=a.main`
  position: relative;
  z-index: 2;
`,Ei=a.a`
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 1000;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-accent-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  /* Fully off-screen (size-independent) until keyboard focus reveals it. */
  transform: translateY(calc(-100% - 16px));
  transition: transform 0.15s ease;

  &:focus {
    transform: translateY(0);
  }
`,L=a(d.section)`
  width: 100%;
  position: relative;
`,Mi=a.footer`
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) var(--container-padding);
  text-align: center;
  color: var(--color-text-secondary);
`,Li=a.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);

  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-accent-primary);
    }
  }
`,Ri=a.p`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
`,tt=({isBooting:t})=>{const o=V();return s.useEffect(()=>{if(!t&&o.hash){const n=o.hash.replace("#",""),r=setTimeout(()=>{We(n,{behavior:"smooth"})},100);return()=>clearTimeout(r)}},[o,t]),null};tt.propTypes={isBooting:y.bool.isRequired};const _i=()=>aa(1200)?e.jsxs(s.Suspense,{fallback:null,children:[e.jsx(Ti,{isDesktopOnly:!0}),e.jsx(Si,{}),e.jsx(Ii,{})]}):null,Fi=()=>{const{slug:t}=st();return e.jsx(Re,{to:`/blog/${t}`,replace:!0})};function Pi(){const[t,o]=s.useState(!0),n=r=>{We(r,{behavior:"smooth"})};return e.jsxs(rt,{children:[e.jsx(tt,{isBooting:t}),e.jsx(yi,{}),e.jsxs(Ve,{children:[e.jsx(ta,{}),e.jsx(R,{mode:"wait",children:t&&e.jsx(ci,{onComplete:()=>o(!1)})}),e.jsxs(Ci,{children:[e.jsx(Ei,{href:"#main-content",children:"Skip to content"}),e.jsx(pi,{}),e.jsx(Ia,{$animated:!0}),e.jsx(_i,{}),e.jsx(bi,{}),e.jsx(s.Suspense,{fallback:null,children:e.jsxs(it,{children:[e.jsx(I,{path:"/",element:e.jsxs(e.Fragment,{children:[e.jsx(Be,{scrollToSection:n}),e.jsxs(Ai,{id:"main-content",tabIndex:-1,children:[e.jsx(A,{children:e.jsx(L,{id:"home",children:e.jsx(ho,{})})}),e.jsx(A,{children:e.jsx(L,{id:"about",variants:F,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(Oo,{})})}),e.jsx(A,{children:e.jsx(L,{id:"work",variants:F,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(on,{})})}),e.jsx(A,{children:e.jsx(L,{id:"projects",variants:F,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(Hn,{})})}),e.jsx(A,{children:e.jsx(L,{id:"blog",variants:F,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(Ar,{})})}),e.jsx(A,{children:e.jsx(L,{id:"contact",variants:F,initial:"initial",whileInView:"animate",viewport:{once:!0,amount:.1},children:e.jsx(Zr,{})})})]}),e.jsxs(Mi,{children:[e.jsxs(Li,{"aria-label":"Vanshul Goyal network",children:[e.jsx("a",{href:"/#blog",children:"Blog"}),e.jsx("a",{href:"https://games.vanshul.com",target:"_blank",rel:"noopener noreferrer",children:"Games"}),e.jsx("a",{href:"https://links.vanshul.com",target:"_blank",rel:"noopener noreferrer",children:"Links"}),e.jsx("a",{href:"https://github.com/vanshulgoyal101",target:"_blank",rel:"noopener noreferrer",children:"GitHub"})]}),e.jsxs(Ri,{children:["© ",new Date().getFullYear()," Vanshul Goyal · vanshul.com"]}),e.jsx(Da,{})]})]})}),e.jsx(I,{path:"/reading-list",element:e.jsx(ji,{})}),e.jsx(I,{path:"/blog/:slug",element:e.jsx(wi,{})}),e.jsx(I,{path:"/blog",element:e.jsx(ki,{})}),e.jsx(I,{path:"/blogs",element:e.jsx(Re,{to:"/blog",replace:!0})}),e.jsx(I,{path:"/blogs/:slug",element:e.jsx(Fi,{})}),e.jsx(I,{path:"/dashboard",element:e.jsx(s.Suspense,{fallback:null,children:e.jsx(zi,{})})}),e.jsx(I,{path:"*",element:e.jsx($a,{})})]})})]})]})]})}lt.createRoot(document.getElementById("root")).render(e.jsx(Me.StrictMode,{children:e.jsx(Pi,{})}));export{Vi as A,Ia as B,za as D,Be as N,y as P,qe as S,Yi as a,Ke as b,qi as c,Aa as d,vr as e,qn as f,Di as g,Je as h,_ as i,Un as j,H as k,Gi as l,oe as s,fa as u};
