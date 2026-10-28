import {PROFILE,LIMITS,MARKET_SOURCES,isSampledEvent,isNoncritical,sampledSession} from './analytics-a-contract.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {A_KEYS,analyticsSource,validData,validEvent} from './analytics-a-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {KURUMI_ANALYTICS_A_SCHEMA_VERSION,KURUMI_SERVICE_ORIGIN} from './service-config.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717';
import {randomUUID} from './uuid.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
const blank=()=>({criticalEligible:0,sampledEligible:0,sampledSelected:0,sent:0,queueDropped:0,expiredDropped:0,quotaDropped:0,sendFailed:0});
const parse=s=>{try{return JSON.parse(s);}catch{return null;}};
const safeStorage=kind=>{try{return kurumiStorage(kind);}catch{return null;}};
const identifier=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{16,80}$/.test(x);
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;

// Separate A preference, identifiers and queue. Legacy refusals are read-only
// default vetoes; no legacy identity, outbox or opt-in is inherited.
export function createAnalyticsA(options={}){
 const storage=options.storage??safeStorage('localStorage'),tab=options.sessionStorage??safeStorage('sessionStorage');
 const now=options.now??Date.now,uid=options.uid??randomUUID,fetcher=options.fetch??globalThis.fetch?.bind(globalThis);
 const navigator=options.navigator??globalThis.navigator,window=options.window??globalThis.window;
 const source=analyticsSource(options.location??globalThis.location),build=options.build??'unversioned';
 const gate=(options.schemaVersion??KURUMI_ANALYTICS_A_SCHEMA_VERSION)===1;
 const origin=options.serviceOrigin??KURUMI_SERVICE_ORIGIN;
 const configured=!!source&&origin==='https://kurumi-fx-api.gongfpp.chatgpt.site'&&/^[A-Za-z0-9_.-]{1,64}$/.test(build);
 let queue=[],identity=null,session=null,blocked=false,offLatch=false,serverPrivacy=false,pending=null,controller=null,generation=0,retryAt=0,destroyed=false,restored=false,preferenceError=null;
 let counters=blank(),lastCoverage=-Infinity;
 const serverTaintedRuns=new Set();
 const newlyQueued=new Set();
 const read=(store,key)=>{if(!store?.getItem)throw Error('storage');if(store.readItem){const entry=store.readItem(key);if(!entry.available)throw Error('storage');return entry.value;}return store.getItem(key);};
 const write=(store,key,value)=>{if(store.setItem(key,value)===false||read(store,key)!==value)throw Error('storage');};
 const remove=(store,key)=>{if(store?.removeItem(key)===false||read(store,key)!==null)throw Error('storage');};
 const privacy=()=>{try{return serverPrivacy||navigator?.globalPrivacyControl===true||navigator?.doNotTrack==='1'||window?.doNotTrack==='1';}catch{return true;}};
 function preference(){
  try{
   const local=read(storage,A_KEYS.consent),current=read(tab,A_KEYS.consent);
   if([local,current].some(value=>value!==null&&!['on','off'].includes(value)))return 'unavailable';
   if(local==='off'||current==='off')return 'off';
   // A real independent A choice remains independent. Only the product default
   // inherits older explicit refusals, including the failed-write tab guard.
   if(local==='on')return 'on';
   const main=read(storage,'fx-girl-analytics'),telemetry=read(storage,'fx-telemetry-enabled'),guard=read(tab,'fx-api-v1-telemetry-consent');
   return main==='off'||telemetry==='false'||guard==='off'?'off':'default';
  }catch{return 'unavailable';}
 }
 function clear(){
  generation++;controller?.abort();queue=[];newlyQueued.clear();identity=session=null;restored=false;counters=blank();lastCoverage=-Infinity;
  let cleaned=true;for(const [store,key]of [[storage,A_KEYS.visitor],[storage,A_KEYS.budget],[tab,A_KEYS.session],[tab,A_KEYS.queue]])try{remove(store,key);}catch{blocked=true;cleaned=false;}
  try{options.onPolicyReset?.();}catch{}return cleaned;
 }
 function reason(){
  if(destroyed)return 'destroyed';if(privacy())return 'browser-privacy';if(offLatch)return 'consent-off';
  const choice=preference();if(choice==='unavailable')return 'storage';if(choice==='off')return 'consent-off';
  try{if(options.isTest?.()!==false&&options.isTest!==undefined)return 'developer-test';}catch{return 'developer-test';}
  try{if(navigator?.webdriver===true||/bot|crawler|spider|headless/i.test(navigator?.userAgent||''))return 'known-automation';}catch{return 'known-automation';}
  return blocked?'storage':!gate?'receiver-closed':!configured?'source-unconfigured':null;
 }
 function allowed(){const r=reason();if(r){if(identity||session||queue.length)clear();return false;}return true;}
 function saveQueue(){try{write(tab,A_KEYS.queue,JSON.stringify(queue));if(session)write(tab,A_KEYS.session,JSON.stringify({...session,counts:counters,lastCoverage}));return true;}catch{blocked=true;clear();return false;}}
 function prune(){const t=now();queue=queue.filter(e=>{if(validEvent(e,{source,now:t})&&e.visitor===identity?.id&&e.visitorBornAt===identity?.bornAt)return true;newlyQueued.delete(e?.id);if(Number.isFinite(e?.at)&&e.at<t-LIMITS.queueAgeMs)counters.expiredDropped++;else counters.queueDropped++;return false;});}
 function ensure(){
  if(!allowed())return false;const t=now();if(!Number.isSafeInteger(t)||t<0)return false;
  try{
   let saved=parse(read(storage,A_KEYS.visitor));
   if(!identifier(saved?.id)||!Number.isSafeInteger(saved.bornAt)||saved.bornAt>t||t-saved.bornAt>=LIMITS.visitorAgeMs){
    const returning=!!saved;saved={id:uid(),bornAt:t,returning};write(storage,A_KEYS.visitor,JSON.stringify(saved));queue=[];newlyQueued.clear();remove(tab,A_KEYS.queue);remove(tab,A_KEYS.session);remove(storage,A_KEYS.budget);restored=false;
   }
   if(identity&&identity.id!==saved.id){queue=[];newlyQueued.clear();restored=false;remove(tab,A_KEYS.queue);remove(tab,A_KEYS.session);}
   identity=saved;
   let current=parse(read(tab,A_KEYS.session));
   if(!identifier(current?.id)||current.visitor!==identity.id||!Number.isSafeInteger(current.last)||t<current.last||t-current.last>=LIMITS.sessionIdleMs||!Number.isSafeInteger(current.seq)||current.seq<0||current.seq>=1e9){current={id:uid(),visitor:identity.id,last:t,seq:0};counters=blank();lastCoverage=-Infinity;}
   if(!session||session.id!==current.id){counters=blank();lastCoverage=-Infinity;if(current.counts&&Object.keys(counters).every(k=>Number.isSafeInteger(current.counts[k])&&current.counts[k]>=0)){counters={...current.counts};lastCoverage=Number.isFinite(current.lastCoverage)?current.lastCoverage:-Infinity;}}
   session=current;write(tab,A_KEYS.session,JSON.stringify({...session,counts:counters,lastCoverage}));
   if(!restored){const rows=parse(read(tab,A_KEYS.queue));queue=Array.isArray(rows)?rows.slice(-LIMITS.queueEvents):[];restored=true;}
   const priorLength=queue.length;prune();return queue.length===priorLength||saveQueue();
  }catch{blocked=true;clear();return false;}
 }
 function consent(on){
  offLatch=!on;blocked=false;preferenceError=null;
  if(!clear()){offLatch=true;preferenceError='cleanup';try{write(tab,A_KEYS.consent,'off');write(storage,A_KEYS.consent,'off');}catch{}return false;}
  try{if(on){write(storage,A_KEYS.consent,'on');remove(tab,A_KEYS.consent);}else{write(tab,A_KEYS.consent,'off');write(storage,A_KEYS.consent,'off');}return true;}
  catch{blocked=true;offLatch=true;preferenceError='storage';try{write(tab,A_KEYS.consent,'off');}catch{}return false;}
 }
 function emit(name,data={},context={}){
  if(!validData(name,data)||serverTaintedRuns.has(context.run)||!ensure())return false;
  const [family,action]=name.split('.'),outside=family==='load'||name==='visit.enter';
  const marketSource=outside||!context.mode||context.mode==='none'?'none':MARKET_SOURCES.includes(context.marketSource)&&context.marketSource!=='none'?context.marketSource:'unknown';
  const e={id:uid(),visitor:identity.id,visitorBornAt:identity.bornAt,session:session.id,run:outside?'':context.run??'',game:'fx',site:'fx',channel:source.channel,path:source.path,build,mode:outside?'none':context.mode??'none',at:now(),seq:session.seq+1,day:outside?0:context.day??0,family,action,data:{...data},profile:PROFILE,v:1,marketSource};
  if(!validEvent(e,{source,build,now:now()}))return false;
  if(isSampledEvent(e)){counters.sampledEligible++;if(!sampledSession(source.channel,session.id))return false;counters.sampledSelected++;}else if(!isNoncritical(e))counters.criticalEligible++;
  if(queue.length>=LIMITS.queueEvents){const index=queue.findIndex(row=>isNoncritical(row));if(index===-1||isNoncritical(e)){counters.queueDropped++;return false;}newlyQueued.delete(queue[index].id);queue.splice(index,1);counters.queueDropped++;}
  session.seq=e.seq;try{write(tab,A_KEYS.session,JSON.stringify(session));}catch{blocked=true;clear();return false;}
  queue.push(e);if(!saveQueue())return false;
  // 入队通知只保留原始页面顺序，不代表服务端已接受业务。
  if(typeof options.onAcceptedEvent==='function')newlyQueued.add(e.id);
  try{options.onQueuedEvent?.(Object.freeze({...e,data:Object.freeze({...e.data})}));}catch{}
  return true;
 }
 function coverage(){if(!ensure()||now()-lastCoverage<60000)return false;lastCoverage=now();return emit('runtime.coverage',Object.fromEntries(Object.entries(counters).map(([k,v])=>[k,Math.min(1e6,v)])));}
 async function flush(){
  if(pending||now()<retryAt||!ensure()||!queue.length||!fetcher)return false;
  let budget;try{budget=parse(read(storage,A_KEYS.budget));}catch{blocked=true;return false;}
  const hour=Math.floor(now()/3600000);if(budget?.hour!==hour||budget?.visitor!==identity.id)budget={hour,visitor:identity.id,total:0,noncritical:0};
  if(!Number.isInteger(budget.total)||budget.total<0||!Number.isInteger(budget.noncritical)||budget.noncritical<0)return false;
  const ordered=queue.map((e,i)=>({e,i})).sort((a,b)=>Number(isNoncritical(a.e))-Number(isNoncritical(b.e))||a.i-b.i),events=[];
  let noncritical=0;for(const {e}of ordered){
   if(events.length&&e.session!==events[0].session)continue;
   if(events.length>=LIMITS.batchEvents||budget.total+events.length>=LIMITS.eventsPerVisitorHour)break;
   if(isNoncritical(e)&&budget.noncritical+noncritical>=LIMITS.noncriticalPerVisitorHour)continue;
   if(bytes({events:[...events,e]})>LIMITS.batchBytes)break;
   events.push(e);if(isNoncritical(e))noncritical++;
  }
  if(!events.length){retryAt=(hour+1)*3600000;return false;}
  // Reserve before sending; ambiguous failures never refund budget locally.
  try{write(storage,A_KEYS.budget,JSON.stringify({...budget,total:budget.total+events.length,noncritical:budget.noncritical+noncritical}));}catch{blocked=true;return false;}
  const gen=generation,ids=new Set(events.map(e=>e.id));controller=new AbortController();
  const timeout=setTimeout(()=>controller?.abort(),10000),signal=controller.signal;
  pending=(async()=>{try{
   const response=await Promise.resolve().then(()=>fetcher(origin+'/api/fx/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({events}),signal,credentials:'omit',referrerPolicy:'no-referrer',keepalive:true}));
   if(gen!==generation||!allowed())return false;
   let body;try{body=await response.json();}catch{body=null;}
   if(gen!==generation||!allowed())return false;
   if(response.status===200&&(body?.ignored==='privacy'||body?.reason==='privacy')){serverPrivacy=true;clear();return false;}
   if(response.status===200&&body?.ignored==='development'){for(const e of events)if(e.run)serverTaintedRuns.add(e.run);queue=queue.filter(e=>{const keep=!ids.has(e.id)&&!serverTaintedRuns.has(e.run);if(!keep)newlyQueued.delete(e.id);return keep;});saveQueue();return false;}
   if(response.ok&&body?.ok===true&&body.count===events.length){const fresh=events.filter(e=>newlyQueued.delete(e.id));queue=queue.filter(e=>!ids.has(e.id));counters.sent+=events.filter(e=>e.session===session?.id).length;const saved=saveQueue();retryAt=0;
    // 只有原 v22 完整成功 ACK 后发布本页新事件；忽略/部分/迟到 ACK、
    // 恢复旧队列都不成为独立业务源。回调失败不改变原成功语义。
    if(saved)for(const e of fresh){if(gen!==generation||!allowed())break;try{options.onAcceptedEvent?.(Object.freeze({...e,data:Object.freeze({...e.data})}));}catch{}}
    return true;}
   counters.sendFailed++;
   if(response.status===400||response.status===409){queue=queue.filter(e=>!ids.has(e.id));for(const id of ids)newlyQueued.delete(id);counters.queueDropped+=events.length;saveQueue();}
   const retrySeconds=Number.isFinite(body?.retryAfterSeconds)?Math.max(1,Math.min(3600,body.retryAfterSeconds)):3600;
   retryAt=response.status===429?Math.max((hour+1)*3600000,now()+retrySeconds*1000):now()+60000;return false;
  }catch{if(gen===generation){counters.sendFailed++;retryAt=now()+60000;}return false;}
  finally{clearTimeout(timeout);pending=null;controller=null;}})();return pending;
 }
 const sync=()=>{if(reason())clear();};window?.addEventListener?.('storage',sync);
 if(privacy())clear();
 return {emit:(...args)=>{try{return emit(...args);}catch{return false;}},flush,coverage,setConsent:consent,allowed,source,
  observationContext(){try{if(!ensure())return null;return{visitor:identity.id,visitorBornAt:identity.bornAt,session:session.id,channel:source.channel,path:source.path,build,origin:source.origin,hostname:source.host};}catch{return null;}},
  // A local observer cannot migrate an in-flight operation across opt-out and
  // a later re-enable. This closure is not part of the event payload.
  capture(){const eligible=allowed(),gen=generation;return(...args)=>{try{return eligible&&gen===generation&&emit(...args);}catch{return false;}};},
  // "consent" remains the old explicit-on fact, never inferred from the new
  // product default. enabled/preference describe the current product setting.
  snapshot:()=>({reason:reason(),preference:offLatch?'off':preference(),preferenceError,enabled:!reason(),consent:!offLatch&&preference()==='on',queued:queue.length,pending:!!pending,counts:{...counters}}),
  returning:()=>{try{return !!parse(read(storage,A_KEYS.visitor));}catch{return false;}},
  sample:()=>ensure()&&sampledSession(source.channel,session.id),
  interaction(){if(ensure()){session.last=now();try{write(tab,A_KEYS.session,JSON.stringify({...session,counts:counters,lastCoverage}));}catch{blocked=true;clear();}}},
  destroy(){destroyed=true;newlyQueued.clear();controller?.abort();window?.removeEventListener?.('storage',sync);},
 };
}
