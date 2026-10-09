import {createGameStorage} from './storage.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
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
export function observeSeenArtwork(image,{identities=[],memory=dailyArtMemory,onSeen=()=>{}}={}){
 if(!image.ownerDocument?.defaultView||!image.getBoundingClientRect)return()=>{};
 let loaded=image.complete&&image.naturalWidth>0,visible=false,done=false,observer=null;
 const finish=()=>{if(done||!loaded||!visible||image.isConnected===false||image.ownerDocument.hidden)return;done=true;memory.seen(identities);onSeen();observer?.disconnect();};
 const win=image.ownerDocument.defaultView;
 const check=()=>{const r=image.getBoundingClientRect();visible=r.width>0&&r.height>0&&r.bottom>0&&r.top<(win.innerHeight||0)&&r.right>0&&r.left<(win.innerWidth||0);finish();};
 const load=()=>{loaded=image.naturalWidth>0;check();};image.addEventListener('load',load);
 if(win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting&&e.intersectionRatio>0);finish();},{threshold:[0,.01]});observer.observe(image);}else{win?.addEventListener('scroll',check,true);win?.addEventListener('resize',check);}
 check();return()=>{observer?.disconnect();image.removeEventListener('load',load);win?.removeEventListener('scroll',check,true);win?.removeEventListener('resize',check);};
}
