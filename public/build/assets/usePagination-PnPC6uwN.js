import{c as r}from"./createLucideIcon-DlJ9m5aM.js";import{r as o}from"./app-BpbR7eq-.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],k=r("FolderOpen",M);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],P=r("TriangleAlert",f);function v(a,h=10){const[t,l]=o.useState(h),[e,s]=o.useState(1),c=o.useMemo(()=>Math.max(1,Math.ceil(a.length/t)),[a.length,t]);o.useEffect(()=>{e>c&&s(1)},[e,c]),o.useEffect(()=>{s(1)},[a.length,t]);const g=o.useMemo(()=>{const n=(e-1)*t;return a.slice(n,n+t)},[a,e,t]),p=a.length===0?0:(e-1)*t+1,u=Math.min(e*t,a.length),i=()=>s(n=>Math.max(1,n-1)),d=()=>s(n=>Math.min(c,n+1));return{page:e,setPage:s,pageSize:t,setPageSize:l,totalPages:c,paginatedItems:g,showingFrom:p,showingTo:u,canPrev:e>1,canNext:e<c,prev:i,next:d,totalCount:a.length}}export{k as F,P as T,v as u};
