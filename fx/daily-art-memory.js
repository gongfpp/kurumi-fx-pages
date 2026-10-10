import {createGameStorage} from './storage.js?v=0fc415893c3cc501cee23f4ea0ff3604041d1337-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=0fc415893c3cc501cee23f4ea0ff3604041d1337-23f2a20b7717';
export const DAILY_ART_MEMORY_KEY='fx-daily-art-memory-v1';
// Content identity is independent of day, event receipt, and file cache query.
export function artIdentity(art){return art?.sha256?'sha256:'+art.sha256:art?.path?'path:'+art.path.split('?')[0]:null;}
export function createDailyArtMemory(storage=createGameStorage(()=>kurumiStorage()),recoveryStorage=null){
 const parse=raw=>{try{const x=JSON.parse(raw);return x?.version===1&&Array.isArray(x.seen)&&x.seen.every(id=>typeof id==='string')&&x.days&&typeof x.days==='object'&&!Array.isArray(x.days)?x:{version:1,seen:[],days:{}};}catch{return {version:1,seen:[],days:{}};}};
 const read=()=>{const main=parse(storage.getItem(DAILY_ART_MEMORY_KEY)),recovery=parse(recoveryStorage?.getItem(DAILY_ART_MEMORY_KEY));return {version:1,seen:[...new Set([...main.seen,...recovery.seen])],days:{...main.days,...recovery.days}};};
 const save=x=>{const value=JSON.stringify(x),saved=storage.setItem(DAILY_ART_MEMORY_KEY,value);if(saved)recoveryStorage?.removeItem(DAILY_ART_MEMORY_KEY);else recoveryStorage?.setItem(DAILY_ART_MEMORY_KEY,value);return saved;};
 return {
  has(id){return !!id&&read().seen.includes(id);},
  seen(ids){const x=read();x.seen=[...new Set([...x.seen,...ids.filter(id=>typeof id==='string'&&id.length<256)])].slice(-2000);return save(x);},
  pick(dayKey,candidates){const x=read();if(Object.hasOwn(x.days,dayKey)){save(x);return candidates.find(c=>c.identity===x.days[dayKey])||null;}
   const chosen=candidates.find(c=>!x.seen.includes(c.identity)&&(!c.arcIdentity||!x.seen.includes(c.arcIdentity)))||null;
   x.days[dayKey]=chosen?.identity||null;const keys=Object.keys(x.days);for(const key of keys.slice(0,-256))delete x.days[key];save(x);return chosen;
  }
 };
}
export const dailyArtMemory=createDailyArtMemory(createGameStorage(()=>kurumiStorage()),createGameStorage(()=>kurumiStorage('sessionStorage')));
// A selected/queued image is not seen. Record only a decoded image actually in
// the viewport; an expanded offscreen story remains eligible until scrolled to.
export function observeSeenArtwork(image,{identities=[],memory=dailyArtMemory,onSeen=()=>{},visibilityTarget=image,visibilityTargets=[visibilityTarget],minVisibleRatio=0}={}){
 if(!image.ownerDocument?.defaultView||!image.getBoundingClientRect)return()=>{};
 const targets=[...new Set(visibilityTargets)],visibility=new Map(targets.map(target=>[target,false]));
 let loaded=image.complete&&image.naturalWidth>0,done=false,observer=null;
 const win=image.ownerDocument.defaultView;
 const finish=()=>{if(done||!loaded||!targets.every(target=>visibility.get(target))||image.isConnected===false||image.ownerDocument.hidden)return;done=true;memory.seen(identities);onSeen();observer?.disconnect();};
 // Older browsers must account for scroll containers too, not just the window.
 const check=()=>{for(const target of targets){
  const r=target.getBoundingClientRect(),area=r.width*r.height;let left=Math.max(r.left,0),right=Math.min(r.right,win.innerWidth||0),top=Math.max(r.top,0),bottom=Math.min(r.bottom,win.innerHeight||0),hidden=false;
  for(let node=target;node;node=node.parentElement){const style=win.getComputedStyle?.(node);if(node.hidden||style?.display==='none'||style?.visibility==='hidden'){hidden=true;break;}if(node===target||!style)continue;const box=node.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(style.overflowX)){left=Math.max(left,box.left+node.clientLeft);right=Math.min(right,box.left+node.clientLeft+node.clientWidth);}if(/auto|scroll|hidden|clip/.test(style.overflowY)){top=Math.max(top,box.top+node.clientTop);bottom=Math.min(bottom,box.top+node.clientTop+node.clientHeight);}}
  const shown=Math.max(0,right-left)*Math.max(0,bottom-top);visibility.set(target,!hidden&&area>0&&shown>0&&shown/area>=minVisibleRatio);
 }finish();};
 const load=()=>{loaded=image.naturalWidth>0;if(observer)finish();else check();};image.addEventListener('load',load);
 if(win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{for(const e of entries){const target=e.target||(targets.length===1?targets[0]:null);if(visibility.has(target))visibility.set(target,e.isIntersecting&&e.intersectionRatio>0&&e.intersectionRatio>=minVisibleRatio);}finish();},{threshold:[0,.01,...(minVisibleRatio?[minVisibleRatio]:[])]});targets.forEach(target=>observer.observe(target));}else{win?.addEventListener('scroll',check,true);win?.addEventListener('resize',check);check();}
 return()=>{done=true;observer?.disconnect();image.removeEventListener('load',load);win?.removeEventListener('scroll',check,true);win?.removeEventListener('resize',check);};
}
