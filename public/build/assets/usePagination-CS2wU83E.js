import{c as f}from"./createLucideIcon-Rv2Z6l9n.js";import{r as o}from"./app-B6Hwpu9S.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],x=f("FolderOpen",d);function P(a,r=10){const[t,g]=o.useState(r),[e,s]=o.useState(1),c=o.useMemo(()=>Math.max(1,Math.ceil(a.length/t)),[a.length,t]);o.useEffect(()=>{e>c&&s(1)},[e,c]),o.useEffect(()=>{s(1)},[a.length,t]);const h=o.useMemo(()=>{const n=(e-1)*t;return a.slice(n,n+t)},[a,e,t]),l=a.length===0?0:(e-1)*t+1,u=Math.min(e*t,a.length),p=()=>s(n=>Math.max(1,n-1)),i=()=>s(n=>Math.min(c,n+1));return{page:e,setPage:s,pageSize:t,setPageSize:g,totalPages:c,paginatedItems:h,showingFrom:l,showingTo:u,canPrev:e>1,canNext:e<c,prev:p,next:i,totalCount:a.length}}export{x as F,P as u};
