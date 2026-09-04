import{a as l,j as e}from"./react-core-CMvrp_gs.js";import{g as a}from"./styled-8lYCUX0A.js";import{s as x,b as h,e as u,S as o,A as n,d as v,B as f,N as y,h as b,i as B}from"./index-BWXZWAZx.js";import{u as j}from"./react-vendor-eCbzqfu8.js";import{m as w}from"./framer-BxTy9W3t.js";import"./vite-preload-BXl3LOEh.js";import"./icons-Bf57NM_i.js";const r="Essays on AI, robotics, the future of work, and technology by Vanshul Goyal — engineer at United Airlines.",N=a.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`,S=a.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;

  @media (max-width: 768px) {
    padding-top: 90px;
  }
`,E=a.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding) var(--spacing-2xl);
`,I=a.header`
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: var(--text-4xl);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);

    @media (max-width: 768px) {
      font-size: var(--text-3xl);
    }
  }

  p {
    color: var(--color-text-secondary);
    font-size: var(--text-lg);
    max-width: 640px;
  }
`,$=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`,d=s=>{const i=new Date(s);return Number.isNaN(i.getTime())?void 0:i.toISOString()},R=()=>{const s=j(),i=l.useMemo(()=>x(h()),[]),m=u(),g=l.useMemo(()=>JSON.stringify([{"@context":"https://schema.org","@type":"Blog",name:`${n} — Blog`,url:`${o}/blog`,description:r,inLanguage:"en",author:{"@type":"Person",name:n,url:o},blogPost:i.map(t=>({"@type":"BlogPosting",headline:t.title,url:`${o}/blog/${t.slug}`,...d(t.date)?{datePublished:d(t.date)}:{},...t.category?{articleSection:t.category}:{}}))},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${o}/`},{"@type":"ListItem",position:2,name:"Blog",item:`${o}/blog`}]}]),[i]);v({title:`Blog — ${n}`,description:r,path:"/blog",jsonLd:g});const c=t=>s(`/#${t}`);return e.jsxs(N,{children:[e.jsx(f,{}),e.jsx(y,{scrollToSection:c}),e.jsx(S,{children:e.jsxs(E,{children:[e.jsxs(I,{children:[e.jsx("h1",{children:"Writing"}),e.jsx("p",{children:r})]}),e.jsx($,{as:w.div,initial:"hidden",animate:"visible",children:i.map((t,p)=>e.jsx(b,{blog:t,index:p,variants:B,views:m[t.slug]},t.slug))})]})})]})};export{R as default};
