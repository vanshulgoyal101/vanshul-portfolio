import{r as o,j as r}from"./react-core-CPHnqsFW.js";import{d as i}from"./styled-CHfxRgpd.js";import{o as j}from"./icons-BULprNPD.js";import{c as z,m as p}from"./framer-CT4Uel1k.js";import"./markdown-DNQhOqsY.js";const C=i.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 100;
  
  ${({$isMobileOnly:n})=>n&&`
    display: none;
  `}
  
  @media (max-width: 768px) {
    ${({$isDesktopOnly:n})=>n&&`
      display: none !important;
    `}
    
    ${({$isMobileOnly:n})=>n&&`
      display: flex !important;
    `}
    
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    transform: none;
    margin: 60px auto 0 auto;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    width: fit-content;
  }
`,E=i(p.div)`
  cursor: pointer;
  pointer-events: auto;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  will-change: transform;
`,I=i(p.div)`
  font-size: 3rem;
  color: var(--color-accent-primary);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  will-change: transform;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`,F=i(p.div)`
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
  background: linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  filter: blur(2px);
  opacity: 0;
  transform-origin: top center;
  will-change: transform, opacity;
`,H=i(p.div)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 100%);
  border-radius: 50%;
  filter: blur(4px);
  will-change: transform, opacity;
`,S=i(p.div)`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%) !important;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.825rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  pointer-events: none;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-bg-card);
  }
  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 7px solid transparent;
    border-top-color: var(--color-border);
    z-index: -1;
  }
`,L=({isMobileOnly:n=!1,isDesktopOnly:w=!1})=>{const[x,h]=o.useState(!1),[b,s]=o.useState(!1),[t,g]=o.useState(!1),[d,u]=o.useState(0),e=z(),f=o.useRef(null),c=o.useRef(null);o.useEffect(()=>{if(t)return;const l=setInterval(()=>{e.start({scale:[1,1.12,1],transition:{duration:.8,ease:"easeInOut"}})},4500);return()=>clearInterval(l)},[t,e]);const v=async()=>{if(t)return;c.current&&clearTimeout(c.current);const l=d+1;if(u(l),s(!0),l>=3){g(!0),window.dispatchEvent(new CustomEvent("rocket-launch")),await e.start({x:[0,-8,8,-8,8,0],transition:{duration:.2}});let a;const y=()=>{if(f.current){const m=f.current.getBoundingClientRect(),R=m.left+m.width/2,T=m.bottom;window.dispatchEvent(new CustomEvent("rocket-emit-smoke",{detail:{x:R,y:T}}))}a=requestAnimationFrame(y)};y(),await e.start({y:-window.innerHeight-200,transition:{duration:1,ease:[.6,.05,.8,.05]}}),cancelAnimationFrame(a),setTimeout(()=>{e.set({y:0}),g(!1),u(0),s(!1)},700)}else e.start({y:[0,-20,0],transition:{duration:.3}}),c.current=setTimeout(()=>{u(0),s(!1)},3e3)};o.useEffect(()=>()=>{c.current&&clearTimeout(c.current)},[]),o.useEffect(()=>{t||e.start({y:[0,-10,0],transition:{duration:3,repeat:1/0,ease:"easeInOut"}})},[t,e]);const k=d===0?"Tap me to test thrusters! 🚀":d===1?"Ignition checks OK... Tap again! ⚡️":"T-Minus 1s... Ready for launch! 🎆";return r.jsx(C,{$isMobileOnly:n,$isDesktopOnly:w,children:r.jsxs(E,{ref:f,animate:e,onHoverStart:()=>{h(!0),s(!0)},onHoverEnd:()=>{h(!1),d===0&&s(!1)},onClick:v,whileHover:{scale:1.15},whileTap:{scale:.95},children:[r.jsx(I,{animate:{rotate:t?-45:0},transition:{duration:.3},children:r.jsx(j,{})}),r.jsx(F,{animate:{opacity:t?1:0,scaleY:t?[1,1.5,1]:1,rotate:t?45:0,x:t?"-30%":"-50%"},transition:{duration:.2,repeat:t?1/0:0,repeatType:"reverse"}}),t&&r.jsx(r.Fragment,{children:[...Array(3)].map((l,a)=>r.jsx(H,{initial:{opacity:.6,scale:0},animate:{y:[0,60],x:[0,(a-1)*12],opacity:[.6,0],scale:[1,2.5]},transition:{duration:.6,delay:a*.08,repeat:1/0,ease:"easeOut"}},a))}),r.jsx(S,{initial:{opacity:0,y:10,x:"-50%"},animate:{opacity:(b||x)&&!t?1:0,y:(b||x)&&!t?0:10,x:"-50%"},children:k})]})})};export{L as default};
