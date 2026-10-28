import {validEvent} from './analytics-a-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717';
import {randomUUID} from './uuid.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

const KEY='fx-api-v1-journey-outbox';
const MAX_EVENTS=240,MAX_AGE=86400000,HEARTBEAT=30000;
const SURFACES=new Set(['landing','game','settings','help','stats','leaderboard','comments','save','other']);
const COMMON=['version','project','stream','source_origin','hostname','channel','event_id','source_event_id','source_at','source_sequence','session_id','visitor_id','visitor_born_at','visit_id','visit_sequence','path','build','kind'];
const identifier=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{16,80}$/.test(x);
const technical=e=>e.family==='load'||e.family==='visit'||e.family==='runtime'&&['active','interruption','coverage','menu','error'].includes(e.action)||e.family==='state'&&e.action==='levels'||e.family==='trade'&&e.action==='risk';
const copy=value=>JSON.parse(JSON.stringify(value));

// 独立接收端尚未接入：不默认启用、不内置 URL，不改 A/v22 请求与旧队列。
// transport 必须返回 {ok:true,accepted:[全部本批 event_id]}；仅此回执可移除 outbox。
export function createAnalyticsJourney({client,enabled=false,transport,storage,now=Date.now,uid=randomUUID,document=globalThis.document,window=globalThis.window,performance=globalThis.performance,getSurface=()=>null,autoTimer=true,acceptedNormalizedSource}={}){
 const noop={prepareA:()=>false,acceptA:()=>false,reset:()=>false,sample:()=>false,flush:async()=>false,destroy(){},snapshot:()=>({enabled:false,queued:0,dropped:0})};
 if(!enabled||typeof transport!=='function'||!client||client.source?.origin!=='https://fx.gongfpp.icu'||client.source?.host!=='fx.gongfpp.icu')return noop;
 try{storage??=kurumiStorage('sessionStorage');}catch{return noop;}
 let queue=[],loaded=false,scope='',context=null,visit='',sequence=0,pending=null,controller=null,generation=0,destroyed=false,departed=false,dropped=0;
 let last=performance.now(),activity=-Infinity,visibleMs=0,activeMs=0,surface='other',visible=document?.visibilityState!=='hidden';
 const prepared=new Map();
 const cleanup=[];
 const listen=(target,name,fn,options)=>{target?.addEventListener?.(name,fn,options);cleanup.push(()=>target?.removeEventListener?.(name,fn,options));};
 const clear=()=>{generation++;controller?.abort();queue=[];prepared.clear();context=null;visit='';scope='';loaded=true;try{storage.removeItem(KEY);}catch{};};
 const allowed=()=>{if(destroyed)return false;if(!client.allowed()){clear();return false;}return true;};
 function persist(){try{const value=JSON.stringify(queue);if(storage.setItem(KEY,value)===false||storage.getItem(KEY)!==value)throw Error('storage');return true;}catch{clear();return false;}}
 function valid(row){
  if(!row||row.version!==1||row.project!=='kurumi-fx'||!['kurumi-a','kurumi-page-v1'].includes(row.stream)||row.source_origin!==client.source?.origin||row.hostname!==client.source?.host||row.channel!==client.source?.channel||row.path!==client.source?.path||typeof row.build!=='string'||!/^[A-Za-z0-9_.-]{1,64}$/.test(row.build)||typeof row.event_id!=='string'||row.event_id.length>120||!Number.isSafeInteger(row.source_at)||row.source_at<now()-MAX_AGE||row.source_at>now()+300000||row.visitor_id!==context?.visitor||row.visitor_born_at!==context?.visitorBornAt||!identifier(row.session_id)||!identifier(row.visit_id)||!identifier(row.source_event_id)||!['source_sequence','visit_sequence'].every(k=>Number.isSafeInteger(row[k])&&row[k]>0))return false;
  const keys=[...COMMON,...(row.stream==='kurumi-a'?['event']:['name','data'])];
  if(keys.some(k=>!Object.hasOwn(row,k))||Object.keys(row).some(k=>!keys.includes(k)))return false;
  if(row.stream==='kurumi-a')return row.source_event_id===row.event?.id&&row.event_id==='a:'+row.event.id&&row.source_at===row.event.at&&row.source_sequence===row.event.seq&&row.session_id===row.event.session&&row.visitor_id===row.event.visitor&&row.visitor_born_at===row.event.visitorBornAt&&row.build===row.event.build&&row.kind===(technical(row.event)?'technical':'business')&&validEvent(row.event,{source:client.source,now:now()});
  const data=row.data;
  return row.kind==='technical'&&row.event_id==='page:'+row.source_event_id&&['arrival','snapshot','hidden','resume','departure','surface','session-end'].includes(row.name)&&SURFACES.has(data?.surface)&&['visible_ms','active_ms'].every(k=>Number.isSafeInteger(data[k])&&data[k]>=0)&&data.active_ms<=data.visible_ms&&Object.keys(data).every(k=>['surface','visible_ms','active_ms'].includes(k)||k==='persisted'&&row.name==='departure'&&typeof data[k]==='boolean');
 }
 function load(){if(loaded)return;loaded=true;try{const rows=JSON.parse(storage.getItem(KEY)||'[]');if(Array.isArray(rows))queue=rows.slice(-MAX_EVENTS).filter(valid);}catch{queue=[];}}
 function enqueue(row){
  if(!allowed())return false;
  queue=queue.filter(valid);
  if(queue.some(e=>e.event_id===row.event_id))return true;
  if(queue.length>=MAX_EVENTS){const index=queue.findIndex(e=>e.stream==='kurumi-page-v1'&&e.name==='snapshot');queue.splice(index<0?0:index,1);dropped++;}
  queue.push(row);return persist();
 }
 function base(stream,id,at){return{version:1,project:'kurumi-fx',stream,source_origin:context.origin,hostname:context.hostname,channel:context.channel,event_id:(stream==='kurumi-a'?'a:':'page:')+id,source_event_id:id,source_at:at,session_id:context.session,visitor_id:context.visitor,visitor_born_at:context.visitorBornAt,visit_id:visit,visit_sequence:++sequence,source_sequence:sequence,path:context.path,build:context.build};}
 function currentSurface(){try{const value=getSurface();if(SURFACES.has(value))return value;}catch{}return surface;}
 function tick(){const t=performance.now(),delta=Math.max(0,t-last);if(visible&&!departed){visibleMs+=delta;if(document?.hasFocus?.()!==false)activeMs+=Math.max(0,Math.min(t,activity+30000)-last);}last=t;}
 function page(name,extra={}){if(!context||!visit)return false;tick();const id=uid();return enqueue({...base('kurumi-page-v1',id,now()),kind:'technical',name,data:{surface,visible_ms:Math.round(visibleMs),active_ms:Math.round(activeMs),...extra}});}
 function begin(next){context=next;scope=next.visitor;visit=uid();sequence=0;last=performance.now();visibleMs=activeMs=0;activity=-Infinity;departed=false;visible=document?.visibilityState!=='hidden';surface=currentSurface();page('arrival');}
 function sync(){
  if(!allowed())return false;
  const next=client.observationContext();if(!next)return false;
  if(scope&&scope!==next.visitor)clear();
  if(!context){context=next;scope=next.visitor;load();begin(next);}
  else if(context.session!==next.session){page('session-end');begin(next);}
  return !!context;
 }
 function prepareA(event){
  if(!allowed()||!validEvent(event,{source:client.source,now:now()})||!sync()||event.visitor!==context.visitor)return false;
  if(prepared.has(event.id))return true;
  const row={...base('kurumi-a',event.id,event.at),source_sequence:event.seq,session_id:event.session,kind:technical(event)?'technical':'business',event:copy(event)};
  for(const [id,value]of prepared)if(value.source_at<now()-MAX_AGE)prepared.delete(id);
  if(prepared.size>=MAX_EVENTS)prepared.delete(prepared.keys().next().value);
  prepared.set(event.id,row);return true;
 }
 function acceptA(event){
  if(!allowed())return false;const row=prepared.get(event?.id);
  if(!row||!valid(row)||JSON.stringify(row.event)!==JSON.stringify(event))return false;
  prepared.delete(event.id);const ok=enqueue(row);if(ok&&departed)void flush();return ok;
 }
 function sample(){if(!context||departed||!sync())return false;const next=currentSurface();if(next!==surface){page('snapshot');surface=next;page('surface');}return page('snapshot');}
 async function flush(){
  if(pending||!context||!allowed()||(!departed&&!sync())||!queue.length)return false;
  queue=queue.filter(valid);const events=copy(queue.slice(0,40));if(!events.length)return false;
  const gen=generation;controller=new AbortController();let timeout;
  pending=(async()=>{try{const receipt=await Promise.race([Promise.resolve().then(()=>transport({version:1,events},{signal:controller.signal})),new Promise(resolve=>{timeout=setTimeout(()=>{controller?.abort();resolve(null);},10000);})]);if(gen!==generation||!allowed())return false;
   const ids=receipt?.accepted,expected=new Set(events.map(e=>e.event_id));
   if(receipt?.ok!==true||!Array.isArray(ids)||ids.length!==expected.size||new Set(ids).size!==expected.size||ids.some(id=>!expected.has(id)))return false;
   queue=queue.filter(e=>!expected.has(e.event_id));return persist();
  }catch{return false;}finally{clearTimeout(timeout);pending=null;controller=null;}})();return pending;
 }
 const interact=e=>{if(e.isTrusted===false||!context||departed||!sync())return;tick();activity=performance.now();};
 for(const name of ['pointerdown','keydown','touchstart','wheel'])listen(document,name,interact);
 listen(document,'visibilitychange',()=>{if(!context||departed||!sync())return;tick();visible=document.visibilityState!=='hidden';page(visible?'resume':'hidden');if(!visible)void flush();});
 listen(document,'toggle',()=>{if(context)sample();},true);
 listen(window,'pagehide',e=>{if(!context||departed||!sync())return;page('departure',{persisted:e.persisted===true});departed=true;void flush();});
 listen(window,'pageshow',e=>{if(e.persisted&&departed&&allowed()){const next=client.observationContext();if(next)begin(next);}});
 listen(window,'storage',()=>{if(context)sync();else allowed();});
 listen(window,'online',()=>void flush());
 const timer=autoTimer?setInterval(()=>{sample();void flush();},HEARTBEAT):null;
 // 未来可信、已归一化且已通过自身接收门禁的源可显式注入；本轮应用未接线此能力。
 // 不暴露一个把原始 A 入队事件直接当作已接受业务的默认捷径。
 if(typeof acceptedNormalizedSource==='function')try{const off=acceptedNormalizedSource(row=>allowed()&&!!context&&valid(row)&&row.stream==='kurumi-a'&&enqueue(copy(row)));if(typeof off==='function')cleanup.push(off);}catch{}
 allowed();
 return{prepareA,acceptA,reset:()=>{if(destroyed)return false;clear();return true;},sample,flush,snapshot:()=>({enabled:true,queued:queue.length,awaitingSourceAck:prepared.size,dropped}),destroy(){if(timer)clearInterval(timer);for(const off of cleanup)off();destroyed=true;prepared.clear();generation++;controller?.abort();}};
}
