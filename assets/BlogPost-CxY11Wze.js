import{a as c,j as r}from"./react-core-CMvrp_gs.js";import{g as o}from"./styled-8lYCUX0A.js";import{e as b,$ as E,Q as L,R as N,S as P}from"./icons-Bf57NM_i.js";import{u as A,l as C,a as I,g as O,b as H,S as i,D,A as n,c as _,d as F,B as u,N as y,f as U}from"./index-BWXZWAZx.js";import{c as G,u as q,L as V}from"./react-vendor-eCbzqfu8.js";import{M as W}from"./markdown-H7SjL4p3.js";import{m as l}from"./framer-BxTy9W3t.js";import"./vite-preload-BXl3LOEh.js";const f=o.div`
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
`,j=o.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;
  
  @media (max-width: 768px) {
    padding-top: 90px;
  }
`,w=o.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md) var(--spacing-lg);
  }
`,k=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-sm);
  }
`,B=o(l.button)`
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
`,J=o(l.button)`
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
`,Q=o(l.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`,X=o.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`,Y=o.span`
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
`,K=o.h1`
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.2;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`,Z=o.div`
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
`,rr=o.div`
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
`,ar=o.div`
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
`,er=o.section`
  margin-top: var(--spacing-xl);
`,or=o.h2`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md);
`,tr=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
`,ir=o(V)`
  display: block;
  text-decoration: none;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-md);
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-3px);
  }
`,nr=o.span`
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-xs);
`,sr=o.h3`
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs);
  line-height: 1.3;
`,cr=o.span`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`,br=()=>{const{slug:s}=G(),d=q(),{showSuccess:T,showError:z}=A(),a=C(s),g=I(a?s:null),p=c.useMemo(()=>a?O(H(),a,3):[],[a]),S=c.useMemo(()=>{if(!a)return;const e=Number.isNaN(new Date(a.date).getTime())?void 0:new Date(a.date).toISOString(),t=`${i}/blog/${a.slug}`,R=`${i}/og/${a.slug}.png`,v=parseInt(a.readTime,10),h=a.content?a.content.trim().split(/\s+/).length:void 0;return JSON.stringify([{"@context":"https://schema.org","@type":"BlogPosting",headline:a.title,description:a.summary,image:[R],inLanguage:"en",...e?{datePublished:e,dateModified:e}:{},...Number.isFinite(v)?{timeRequired:`PT${v}M`}:{},...h?{wordCount:h}:{},...a.category?{articleSection:a.category,keywords:a.category}:{},author:{"@type":"Person",name:n,url:i,sameAs:_},publisher:{"@type":"Person",name:n,url:i,image:D},mainEntityOfPage:t,url:t},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${i}/`},{"@type":"ListItem",position:2,name:"Blog",item:`${i}/#blog`},{"@type":"ListItem",position:3,name:a.title,item:t}]}])},[a]),M=c.useMemo(()=>{if(!a)return;const e=Number.isNaN(new Date(a.date).getTime())?void 0:new Date(a.date).toISOString();return{publishedTime:e,modifiedTime:e,author:n,section:a.category}},[a]);F({title:a?`${a.title} — ${n}`:`Post not found — ${n}`,description:a?.summary,path:a?`/blog/${a.slug}`:`/blog/${s??""}`,image:a?`${i}/og/${a.slug}.png`:void 0,type:"article",jsonLd:S,article:M}),c.useEffect(()=>{window.scrollTo(0,0)},[s]);const m=()=>{d("/#blog")},$=async()=>{const e=window.location.href;if(navigator.share){try{await navigator.share({title:a?.title||"Blog Post",text:a?.summary||"",url:e})}catch(t){t?.name!=="AbortError"&&console.error("Error sharing:",t)}return}try{await navigator.clipboard.writeText(e),T("Link copied","The post link is now on your clipboard.")}catch{z("Could not copy link","Copy the URL from your browser address bar instead.")}},x=e=>{d(`/#${e}`)};return a?r.jsxs(f,{children:[r.jsx(u,{}),r.jsx(y,{scrollToSection:x}),r.jsx(j,{children:r.jsxs(w,{children:[r.jsxs(k,{children:[r.jsxs(B,{onClick:m,whileHover:{scale:1.05},children:[r.jsx(b,{})," Back to Blog"]}),r.jsxs(J,{onClick:$,whileHover:{scale:1.05},children:[r.jsx(E,{})," Share"]})]}),r.jsxs(Q,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6,ease:"easeOut"},children:[r.jsxs(X,{children:[a.category&&r.jsx(Y,{children:a.category}),r.jsx(K,{children:a.title}),r.jsxs(Z,{children:[r.jsxs("span",{children:[r.jsx(L,{})," ",a.date]}),r.jsxs("span",{children:[r.jsx(N,{})," ",a.readTime]}),g!=null&&r.jsxs("span",{children:[r.jsx(P,{})," ",U(g)," views"]})]})]}),r.jsx(rr,{children:r.jsx(W,{components:{a:({node:e,...t})=>r.jsx("a",{...t,target:"_blank",rel:"noopener noreferrer"})},children:a.content})})]}),p.length>0&&r.jsxs(er,{"aria-label":"More writing",children:[r.jsx(or,{children:"More writing"}),r.jsx(tr,{children:p.map(e=>r.jsxs(ir,{to:`/blog/${e.slug}`,children:[e.category&&r.jsx(nr,{children:e.category}),r.jsx(sr,{children:e.title}),e.readTime&&r.jsx(cr,{children:e.readTime})]},e.slug))})]})]})})]}):r.jsxs(f,{children:[r.jsx(u,{}),r.jsx(y,{scrollToSection:x}),r.jsx(j,{children:r.jsxs(w,{children:[r.jsx(k,{children:r.jsxs(B,{onClick:m,whileHover:{scale:1.05},children:[r.jsx(b,{})," Back to Blog"]})}),r.jsxs(ar,{children:[r.jsx("h2",{children:"Blog Post Not Found"}),r.jsx("p",{children:"The blog post you're looking for doesn't exist."})]})]})})]})};export{br as default};
