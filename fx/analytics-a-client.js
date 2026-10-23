import {PROFILE,LIMITS,isSampledEvent,isNoncritical,sampledSession} from './analytics-a-contract.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {A_KEYS,analyticsSource,validData,validEvent} from './analytics-a-policy.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {KURUMI_ANALYTICS_A_SCHEMA_VERSION,KURUMI_SERVICE_ORIGIN} from './service-config.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {randomUUID} from './uuid.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
const blank=()=>({criticalEligible:0,sampledEligible:0,sampledSelected:0,sent:0,queueDropped:0,expiredDropped:0,quotaDropped:0,sendFailed:0});
const parse=s=>{try{return JSON.parse(s);}catch{return null;}};
const safeStorage=kind=>{try{return kurumiStorage(kind);}catch{return null;}};
const identifier=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{16,80}$/.test(x);
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)).length;

// Completely separate consent, identifiers, queue and request path. The legacy
// client is neither read nor wrapped. No game object or input is serialized.
export function createAnalyticsA(options={}){
 const storage=options.storage??safeStorage('localStorage'),tab=options.sessionStorage??safeStorage('sessionStorage');
 const now=options.now??Date.now,uid=options.uid??randomUUID,fetcher=options.fetch??globalThis.fetch?.bind(globalThis);
 const navigator=options.navigator??globalThis.navigator,window=options.window??globalThis.window;
 const source=analyticsSource(options.location??globalThis.location),build=options.build??'unversioned';
 const gate=(options.schemaVersion??KURUMI_ANALYTICS_A_SCHEMA_VERSION)===1;
 const origin=options.serviceOrigin??KURUMI_SERVICE_ORIGIN;
 const configured=!!source&&origin==='https://kurumi-fx-api.gongfpp.chatgpt.site'&&/^[A-Za-z0-9_.-]{1,64}$/.test(build);
 let queue=[],identity=null,session=null,blocked=false,offLatch=false,serverPrivacy=false,pending=null,controller=null,generation=0,retryAt=0,destroyed=false,restored=false;
 let counters=blank(),lastCoverage=-Infinity;
 const serverTaintedRuns=new Set();
 const read=(store,key)=>{if(!store?.getItem)throw Error('storage');if(store.readItem){const entry=store.readItem(key);if(!entry.available)throw Error('storage');return entry.value;}return store.getItem(key);};
 const write=(store,key,value)=>{if(store.setItem(key,value)===false||read(store,key)!==value)throw Error('storage');};
 const remove=(store,key)=>{if(store?.removeItem(key)===false||read(store,key)!==null)throw Error('storage');};
 const privacy=()=>serverPrivacy||navigator?.globalPrivacyControl===true||navigator?.doNotTrack==='1'||window?.doNotTrack==='1';
 function clear(){
  generation++;controller?.abort();queue=[];identity=session=null;restored=false;counters=blank();lastCoverage=-Infinity;
  for(const [store,key]of [[storage,A_KEYS.visitor],[storage,A_KEYS.budget],[tab,A_KEYS.session],[tab,A_KEYS.queue]])try{remove(store,key);}catch{blocked=true;}
 }
 function reason(){
  if(destroyed)return 'destroyed';if(privacy())return 'browser-privacy';if(offLatch)return 'consent-off';
  try{if(read(tab,A_KEYS.consent)==='off'||read(storage,A_KEYS.consent)!=='on')return 'consent-required';}catch{return 'storage';}
  try{if(options.isTest?.()!==false&&options.isTest!==undefined)return 'developer-test';}catch{return 'developer-test';}
  if(navigator?.webdriver===true||/bot|crawler|spider|headless/i.test(navigator?.userAgent||''))return 'known-automation';
  return blocked?'storage':!gate?'receiver-closed':!configured?'source-unconfigured':null;
 }
 function allowed(){const r=reason();if(r){if(identity||session||queue.length)clear();return false;}return true;}
 function saveQueue(){try{write(tab,A_KEYS.queue,JSON.stringify(queue));if(session)write(tab,A_KEYS.session,JSON.stringify({...session,counts:counters,lastCoverage}));return true;}catch{blocked=true;clear();return false;}}
 function prune(){const t=now();queue=queue.filter(e=>{if(validEvent(e,{source,now:t})&&e.visitor===identity?.id&&e.visitorBornAt===identity?.bornAt)return true;if(Number.isFinite(e?.at)&&e.at<t-LIMITS.queueAgeMs)counters.expiredDropped++;else counters.queueDropped++;return false;});}
 function ensure(){
  if(!allowed())return false;const t=now();if(!Number.isSafeInteger(t)||t<0)return false;
  try{
   let saved=parse(read(storage,A_KEYS.visitor));
   if(!identifier(saved?.id)||!Number.isSafeInteger(saved.bornAt)||saved.bornAt>t||t-saved.bornAt>=LIMITS.visitorAgeMs){
    const returning=!!saved;saved={id:uid(),bornAt:t,returning};write(storage,A_KEYS.visitor,JSON.stringify(saved));queue=[];remove(tab,A_KEYS.queue);remove(tab,A_KEYS.session);remove(storage,A_KEYS.budget);restored=false;
   }
   if(identity&&identity.id!==saved.id){queue=[];restored=false;remove(tab,A_KEYS.queue);remove(tab,A_KEYS.session);}
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
  offLatch=!on;clear();blocked=false;
  try{if(on){write(storage,A_KEYS.consent,'on');remove(tab,A_KEYS.consent);}else{write(tab,A_KEYS.consent,'off');write(storage,A_KEYS.consent,'off');}return true;}
  catch{blocked=true;offLatch=true;try{write(tab,A_KEYS.consent,'off');}catch{}return false;}
 }
 function emit(name,data={},context={}){
  if(!validData(name,data)||serverTaintedRuns.has(context.run)||!ensure())return false;
  const [family,action]=name.split('.'),outside=family==='load'||name==='visit.enter';
  const e={id:uid(),visitor:identity.id,visitorBornAt:identity.bornAt,session:session.id,run:outside?'':context.run??'',game:'fx',site:'fx',channel:source.channel,path:source.path,build,mode:outside?'none':context.mode??'none',at:now(),seq:session.seq+1,day:outside?0:context.day??0,family,action,data:{...data},profile:PROFILE,v:1};
  if(!validEvent(e,{source,build,now:now()}))return false;
  if(isSampledEvent(e)){counters.sampledEligible++;if(!sampledSession(source.channel,session.id))return false;counters.sampledSelected++;}else if(!isNoncritical(e))counters.criticalEligible++;
  if(queue.length>=LIMITS.queueEvents){const index=queue.findIndex(row=>isNoncritical(row));if(index===-1||isNoncritical(e)){counters.queueDropped++;return false;}queue.splice(index,1);counters.queueDropped++;}
  session.seq=e.seq;try{write(tab,A_KEYS.session,JSON.stringify(session));}catch{blocked=true;clear();return false;}
  queue.push(e);return saveQueue();
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
   if(response.status===200&&(body?.ignored==='privacy'||body?.reason==='privacy')){serverPrivacy=true;clear();return false;}
   if(response.status===200&&body?.ignored==='development'){for(const e of events)if(e.run)serverTaintedRuns.add(e.run);queue=queue.filter(e=>!ids.has(e.id)&&!serverTaintedRuns.has(e.run));saveQueue();return false;}
   if(response.ok&&body?.ok===true&&body.count===events.length){queue=queue.filter(e=>!ids.has(e.id));counters.sent+=events.filter(e=>e.session===session?.id).length;saveQueue();retryAt=0;return true;}
   counters.sendFailed++;
   if(response.status===400||response.status===409){queue=queue.filter(e=>!ids.has(e.id));counters.queueDropped+=events.length;saveQueue();}
   const retrySeconds=Number.isFinite(body?.retryAfterSeconds)?Math.max(1,Math.min(3600,body.retryAfterSeconds)):3600;
   retryAt=response.status===429?Math.max((hour+1)*3600000,now()+retrySeconds*1000):now()+60000;return false;
  }catch{if(gen===generation){counters.sendFailed++;retryAt=now()+60000;}return false;}
  finally{clearTimeout(timeout);pending=null;controller=null;}})();return pending;
 }
 const sync=()=>{if(reason())clear();};window?.addEventListener?.('storage',sync);
 if(privacy())clear();
 return {emit:(...args)=>{try{return emit(...args);}catch{return false;}},flush,coverage,setConsent:consent,allowed,source,
  snapshot:()=>({reason:reason(),consent:(()=>{try{return !offLatch&&read(storage,A_KEYS.consent)==='on'&&read(tab,A_KEYS.consent)!=='off';}catch{return false;}})(),queued:queue.length,pending:!!pending,counts:{...counters}}),
  returning:()=>{try{return !!parse(read(storage,A_KEYS.visitor));}catch{return false;}},
  sample:()=>ensure()&&sampledSession(source.channel,session.id),
  interaction(){if(ensure()){session.last=now();try{write(tab,A_KEYS.session,JSON.stringify({...session,counts:counters,lastCoverage}));}catch{blocked=true;clear();}}},
  destroy(){destroyed=true;controller?.abort();window?.removeEventListener?.('storage',sync);},
 };
}
