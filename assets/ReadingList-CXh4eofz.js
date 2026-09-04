import{a as s,j as t}from"./react-core-CMvrp_gs.js";import{g as i}from"./styled-8lYCUX0A.js";import{e as p,U as m}from"./icons-Bf57NM_i.js";import{j as e,S as r,d as g,N as h}from"./index-BWXZWAZx.js";import{u as x}from"./react-vendor-eCbzqfu8.js";import{m as d}from"./framer-BxTy9W3t.js";import"./vite-preload-BXl3LOEh.js";const v=i.div`
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
`,f=i.div`
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
`,u=i.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;

  @media (max-width: 768px) {
    padding-top: 90px;
  }
`,b=i.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-2xl);

  @media (max-width: 768px) {
    padding: 0 var(--spacing-md) var(--spacing-xl);
  }
`,y=i.div`
  margin-bottom: var(--spacing-md);
`,j=i(d.button)`
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
  min-height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateX(-3px);
  }
`,w=i(d.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
`,k=i.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,L=i.h1`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-4xl);
  color: var(--color-text-primary);
  line-height: 1.2;
  font-weight: 700;

  svg {
    color: var(--color-accent-primary);
    font-size: 0.7em;
  }

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,B=i.p`
  margin-top: var(--spacing-sm);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
`,I=i.div`
  padding: var(--spacing-lg) var(--spacing-xl);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,S=i.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--spacing-2xl);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`,z=i.li`
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--color-border);

  /* No top border for the first row (single item on mobile, two on desktop). */
  &:first-child {
    border-top: none;
  }

  @media (min-width: 721px) {
    &:nth-child(2) {
      border-top: none;
    }
  }
`,E=i.p`
  font-size: var(--text-lg);
  line-height: 1.35;
  color: var(--color-text-primary);
`,N=i.span`
  font-weight: 600;
`,F=i.span`
  color: var(--color-text-muted);
`,O=i.p`
  margin-top: 4px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
`,P=()=>{const a=x(),c=s.useMemo(()=>{const o=`${r}/reading-list`;return JSON.stringify([{"@context":"https://schema.org","@type":"ItemList",name:"From My Shelf — Vanshul Goyal",description:"Favourite books that shaped how Vanshul Goyal thinks.",url:o,numberOfItems:e.length,itemListElement:e.map((n,l)=>({"@type":"ListItem",position:l+1,item:{"@type":"Book",name:n.title,author:{"@type":"Person",name:n.author}}}))},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${r}/`},{"@type":"ListItem",position:2,name:"Blog",item:`${r}/#blog`},{"@type":"ListItem",position:3,name:"Reading List",item:o}]}])},[]);return g({title:"Reading List — Vanshul Goyal",description:"From My Shelf: favourite books that shaped how I think — fiction and non-fiction, with a one-line note on each.",path:"/reading-list",jsonLd:c}),s.useEffect(()=>{window.scrollTo(0,0)},[]),t.jsxs(v,{children:[t.jsx(f,{}),t.jsx(h,{scrollToSection:o=>a(`/#${o}`)}),t.jsx(u,{children:t.jsxs(b,{children:[t.jsx(y,{children:t.jsxs(j,{onClick:()=>a("/#blog"),whileHover:{scale:1.05},children:[t.jsx(p,{})," Back to Blog"]})}),t.jsxs(w,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},children:[t.jsxs(k,{children:[t.jsxs(L,{children:[t.jsx(m,{"aria-hidden":"true"})," From My Shelf"]}),t.jsxs(B,{children:[e.length," books that shaped how I think — fiction and non-fiction alike."]})]}),t.jsx(I,{children:t.jsx(S,{children:e.map(o=>t.jsxs(z,{children:[t.jsxs(E,{children:[t.jsx(N,{children:o.title})," ",t.jsxs(F,{children:["· ",o.author]})]}),t.jsx(O,{children:o.note})]},o.title))})})]})]})})]})};export{P as default};
