import {HistoricalM15Replay} from './historical-m15-replay.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {M15_PATH_MODEL} from './historical-m15-path.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {syncHistoricalM15Display} from './historical-m15-engine-adapter.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {MULTI_M15_SCHEMA,M15_REFERENCE_SYMBOLS as SYMBOLS} from './historical-m15-reference-provider.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {startHistoricalContinuation,simulateHistoricalMarks,recordHistoricalSource,historicalMarkIsSimulated} from './history-continuation.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {recordDisplaySourceCandle,validCandleDisplay} from './candle-period.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
const feeds=new WeakMap(),HASH=/^[a-f0-9]{64}$/,fields=['price','script','candles','displayMinutes','displayMinutesPartial','lastEvent','swanSeen','dayOpeningPrice'];
const fail=message=>{throw Error('Multi M15: '+message);};
const clone=value=>JSON.parse(JSON.stringify(value));
export const isMultiM15=s=>s?.historical?.version===5;
export const multiM15Feed=s=>feeds.get(s);
export const releaseMultiM15=s=>feeds.delete(s);
const active=s=>s.marketBook.active;
const price=(s,pair)=>pair===active(s)?s.price:s.marketBook.markets[pair].price;
function capture(s){const book=s.marketBook.markets[active(s)];for(const key of fields){if(s[key]===undefined)delete book[key];else book[key]=s[key];}}
function restore(s){const book=s.marketBook.markets[active(s)];for(const key of fields){if(book[key]===undefined)delete s[key];else s[key]=book[key];}if(s.historical.lastQuote)s.historical.lastQuote[1]=s.price;}
function clock(s,at){s.historical.lastQuote=[at,s.marketBook.markets[active(s)].price];if(s.tradingClock){s.tradingClock.lastQuoteAt=at;s.tradingClock.lastQuoteDay=s.day;}}
function sync(s,pair,options={}){
 const f=feeds.get(s).pairs[pair];if(!f)return;
 const m=s.marketBook.markets[pair],h=s.historical.markets[pair],view={...m,seed:s.seed,day:s.day,historical:{...h,m15DisplayAfter:h.displayAfter,dayOpeningAt:s.historical.dayOpeningAt,dayOpeningGameDay:s.historical.dayOpeningGameDay}};
 // Do not supply an undefined display cutoff (the v4 helper checks presence).
 if(h.displayAfter===undefined)delete view.historical.m15DisplayAfter;
 syncHistoricalM15Display(view,f,options);
 m.candles=view.candles;m.displayMinutes=view.displayMinutes;
 // Source changes remain explicit even when history resumes after a hole.
 for(const rows of [m.candles,m.displayMinutes]){
  let previous=null;for(const c of rows){const kind=c.sourceKind==='simulated'?'simulated':'historical';const changed=previous&&previous.kind!==kind;c.sourceSegment=previous?previous.segment+(changed?1:0):c.sourceSegment??0;c.sourceBreak=!!changed;previous={kind,segment:c.sourceSegment};}
 }
}
export function initializeMultiM15(s,{manifest,dayData,startDate,manifestURL=null,opening=null,script}={}){
 if(manifest?.schemaVersion!==MULTI_M15_SCHEMA||dayData?.date!==startDate||dayData.validated!==true)fail('invalid opening');
 const entry=manifest.days.find(d=>d.date===startDate);if(!entry)fail('opening day missing');
 s.historical={version:5,datasetId:manifest.id,sourceVersion:manifest.version,sourceHash:manifest.source.sha256,manifestURL,priceBasis:'m15-reference-simulated-path',date:startDate,startDate,dayHash:entry.sha256,cursor:0,status:'loading',lastQuote:null,markets:{},acceptedGapCursor:null};
 s.marketBook={version:1,source:'historical-m15-reference',active:'USD/JPY',markets:{}};
 for(const pair of SYMBOLS)s.marketBook.markets[pair]={price:1,script:clone(script),candles:[],displayMinutes:[],lastEvent:null,swanSeen:false};
 bindMultiM15(s,manifest,dayData,{initial:true});
 const f=feeds.get(s),target=opening?.at??Math.max(...Object.values(f.pairs).map(p=>p.source.bars[0].at));
 if(!Number.isSafeInteger(target)||opening&&(!Number.isSafeInteger(opening.warmupFrom)||opening.warmupFrom>target))fail('invalid opening time');
 for(const pair of SYMBOLS){
  const feed=f.pairs[pair];
  if(!feed){
   const reference=dayData.references?.[pair];if(!reference||reference.at>target||!Number.isFinite(reference.price)||reference.price<=0)fail('opening has no prior reference for pair');
   Object.assign(s.historical.markets[pair],{lastQuote:[reference.at,reference.price],simulationAt:target,markAt:reference.at,lastReference:clone(reference.evidence)});s.marketBook.markets[pair].price=reference.price;s.marketBook.markets[pair].dayOpeningPrice=reference.price;continue;
  }
  if(opening){feed.displayFrom=opening.warmupFrom;s.historical.markets[pair].displayFrom=opening.warmupFrom;}
  while(feed.replay.peekNextTime()!==null&&feed.replay.peekNextTime()<=target)consumeReference(s,pair,feed.replay.peekNextSample(),{deferDisplay:true});
  if(!s.historical.markets[pair].lastQuote)fail('pair reference is later than opening');
  sync(s,pair);s.marketBook.markets[pair].dayOpeningPrice=s.marketBook.markets[pair].price;
  for(const c of [...s.marketBook.markets[pair].candles,...s.marketBook.markets[pair].displayMinutes])if(c.timestamp<target)c.historyWarmup=true;
 }
 s.historical.cursor=Object.values(s.historical.markets).reduce((n,p)=>n+p.cursor,0);
 clock(s,target);restore(s);s.startPrice=s.price;s.completedCandles=0;s.historical.status='ready';s.historical.dayOpeningAt=target;
 s.tradingClock={version:1,epochMs:Math.floor((target+32400000)/86400000)*86400000-32400000,timeZone:'Asia/Tokyo',candleMinutes:15,source:'historical',lastQuoteAt:target,lastQuoteDay:s.day};
 return s;
}
export function bindMultiM15(s,manifest,data,{initial=false}={}){
 const h=s.historical,entry=manifest.days.find(d=>d.date===h.date);
 if(!isMultiM15(s)||manifest.schemaVersion!==MULTI_M15_SCHEMA||data.schemaVersion!==MULTI_M15_SCHEMA||!entry||entry.sha256!==h.dayHash||data.sha256!==h.dayHash||data.validated!==true||data.date!==h.date||data.datasetId!==h.datasetId||manifest.id!==h.datasetId||data.datasetVersion!==h.sourceVersion||manifest.version!==h.sourceVersion||manifest.source.sha256!==h.sourceHash)fail('source/save identity mismatch');
 if(Object.values(h.markets).reduce((n,p)=>n+p.cursor,0)!==h.cursor)fail('global cursor mismatch');
 const pairs={};
 for(const pair of SYMBOLS){
  const source=data.sources[pair],identity=manifest.sources.find(e=>e.pair===pair);if(!identity)fail('pair identity missing');
  let p=h.markets[pair];
  if(!p){if(!initial&&h.cursor!==0)fail('pair cursor missing');p=h.markets[pair]={datasetId:identity.datasetId,sourceVersion:identity.version,sourceHash:identity.sourceHash,dayHash:entry.sha256,cursor:0,m15:null,lastQuote:null,simulationAt:null,lastReference:null,markAt:null};}
  if(p.datasetId!==identity.datasetId||p.sourceVersion!==identity.version||p.sourceHash!==identity.sourceHash||p.dayHash!==h.dayHash)fail('pair/source identity mismatch');
  const carried=data.references?.[pair];
  if(!p.lastReference&&carried?.evidence&&carried.at===p.lastQuote?.[0]&&carried.price===p.lastQuote?.[1])p.lastReference=clone(carried.evidence);
  if(!source){if(p.cursor!==0||p.m15!==null)fail('missing source has progress');p.simulationAt??=h.lastQuote?.[0]??null;continue;}
  if(source.pair!==pair||source.datasetId!==p.datasetId||source.version!==p.sourceVersion||(source.provenance.sourceSha256??null)!==p.sourceHash)fail('source pair mismatch');
  const replay=new HistoricalM15Replay({source,seed:s.seed,progress:p.m15});
  if(replay.cursor!==p.cursor)fail('pair cursor mismatch');
  const last=replay.snapshot().lastSample;
  if(last&&(p.lastQuote?.[0]!==last.at||p.lastQuote?.[1]!==last.price||!historicalMarkIsSimulated(s,pair)&&price(s,pair)!==last.price))fail('pair saved price mismatch');
  // Loading continuation has already executed its own marks. Discard elapsed
  // source anchors without execution, fees, risk or chart backfill.
  // Another pair's continuation must not discard this pair's pending same-time
  // close/open. Only this pair's already executed simulated interval is skipped.
  const until=historicalMarkIsSimulated(s,pair)?Math.max(p.simulationAt??-1,s.historyContinuation.at-1):null;
  if(until!==null&&replay.peekNextTime()!==null&&replay.peekNextTime()<=until){
   let skipped=0,sample;while(replay.peekNextTime()!==null&&replay.peekNextTime()<=until){sample=replay.next();skipped++;}
   if(sample){p.m15=replay.snapshot();p.cursor=replay.cursor;p.lastQuote=[sample.at,sample.price];p.displayAfter=until;s.historyContinuation.skippedRealQuotes+=skipped;}
  }
  pairs[pair]={source,replay,displayFrom:p.displayFrom??source.bars[0].at};
 }
 h.cursor=Object.values(h.markets).reduce((n,p)=>n+p.cursor,0);
 feeds.set(s,{manifest,dayData:data,pairs});if(['loading','error','ready'].includes(h.status))h.status='ready';
 if(s.historyContinuation)s.historyContinuation.active=Object.values(s.historyContinuation.origins).includes('simulated');
 return s;
}
// The next one-minute continuation event is independent for each missing pair.
// Historical anchors in another market never reset this timer.
export function peekMultiM15(s,{historyOnly=false}={}){
 const f=feeds.get(s),h=s.historical;
 if(h.sleepTransition&&!historyOnly||!['ready','exhausted','loading','error'].includes(h.status))return {blocked:true};
 if(historyOnly&&!f)return {blocked:true};
 const candidates=[];
 for(const pair of SYMBOLS){
  const p=h.markets[pair],next=f?.pairs[pair]?.replay.peekNextSample();
  if(next)candidates.push({pair,at:next.at,sample:next});
  if(!historyOnly){
   const last=p.m15?.lastSample;
   const from=p.simulationAt??last?.at??h.lastQuote?.[0];
   if(Number.isSafeInteger(from)&&(!f||!last||last.step===24)&&(!next||next.at>from+60000))candidates.push({pair,at:from+60000,simulated:true});
  }
 }
 if(!candidates.length)return {done:true};
 const at=Math.min(...candidates.map(c=>c.at)),sameTime=candidates.filter(c=>c.at===at);
 // Apply every pair's closing/update mark together, then every opening mark
 // together. A close never disappears into the following open at the same UTC.
 const rank=e=>e.sample?.step===0?1:0,phase=Math.min(...sameTime.map(rank)),events=sameTime.filter(e=>rank(e)===phase);
 const last=historyOnly&&Object.values(f.pairs).every(p=>p.replay.peekNextTime()===null||p.replay.cursor===p.source.bars.length*25-1&&p.replay.peekNextTime()===at);
 return {quote:[at,events.find(e=>e.pair===active(s))?.sample?.price??s.price],events,last:!!last};
}
function consumeReference(s,pair,sample,options={}){
 const feed=feeds.get(s).pairs[pair],p=s.historical.markets[pair],m=s.marketBook.markets[pair];
 const actual=feed.replay.next();if(JSON.stringify(actual)!==JSON.stringify(sample))fail('reference event mismatch');
 p.m15=feed.replay.snapshot();p.cursor=feed.replay.cursor;p.lastQuote=[sample.at,sample.price];p.simulationAt=null;m.price=sample.price;
 p.markAt=sample.at;p.lastReference={pair,date:s.historical.date,dayHash:p.dayHash,datasetId:p.datasetId,sourceVersion:p.sourceVersion,sourceHash:p.sourceHash,sourceBinding:p.m15.sourceBinding,cursor:p.cursor,barAt:sample.barAt,step:sample.step,at:sample.at,price:sample.price};
 if(options.sleepHistory&&feed.sleepFrom===undefined)feed.sleepFrom=sample.at;
 if(!options.deferDisplay)sync(s,pair,options);
}
export function commitMultiM15(s,next,options={}){
 const expected=peekMultiM15(s,{historyOnly:options.historyOnly===true});if(!expected.events||JSON.stringify(expected.events)!==JSON.stringify(next.events))fail('next event mismatch');
 capture(s);const refs=next.events.filter(e=>!e.simulated),missing=next.events.filter(e=>e.simulated).map(e=>e.pair),at=next.quote[0];
 for(const e of refs)consumeReference(s,e.pair,e.sample,options);
 restore(s);if(refs.length)recordHistoricalSource(s,at,refs.map(e=>e.pair));
 if(missing.length){
  restore(s);const feed=feeds.get(s),reason=!feed?'loading':Object.values(feed.pairs).every(p=>p.replay.exhausted)?'exhausted':'missing-market',sample=simulateHistoricalMarks(s,{at,reason,symbols:missing});
  for(const [pair,mark] of Object.entries(sample.marks)){
   const m=s.marketBook.markets[pair],prior=m.price,last=m.candles.at(-1),changed=last?.sourceKind!=='simulated';
   const c={open:prior,high:Math.max(prior,mark),low:Math.min(prior,mark),close:mark,closed:true,timestamp:at-60000,availableAt:at,firstQuoteAt:at,lastQuoteAt:at,periodMinutes:1,timeSource:'historical-simulation',sourceKind:'simulated',sourceSegment:(last?.sourceSegment??0)+(changed?1:0),sourceBreak:changed,research:true,day:s.day,beat:Math.min(3,Math.floor(new Date(at+32400000).getUTCHours()/6))};
   m.price=mark;m.candles.push(c);m.candles=m.candles.slice(-256);recordDisplaySourceCandle(m,c);s.historical.markets[pair].simulationAt=at;s.historical.markets[pair].markAt=at;
  }
 }
 s.historical.cursor=Object.values(s.historical.markets).reduce((n,p)=>n+p.cursor,0);clock(s,at);restore(s);
 if(options.opening)for(const pair of SYMBOLS)if(s.historical.markets[pair].m15===null)s.historical.markets[pair].simulationAt=at;
 if(s.historyContinuation){s.historyContinuation.at=at;s.historyContinuation.active=Object.values(s.historyContinuation.origins).includes('simulated');}
 return {barCompleted:refs.some(e=>e.pair===active(s)&&e.sample.step===24)||missing.includes(active(s)),events:next.events};
}
export function flushMultiM15(s,options={}){capture(s);for(const pair of SYMBOLS)sync(s,pair,options);restore(s);}
export function switchMultiM15(s,pair){if(!SYMBOLS.includes(pair))fail('unknown pair');if(pair===active(s))return false;capture(s);s.marketBook.active=pair;restore(s);if(s.pending)s.pending.startPrice=s.price;return true;}
export function multiM15DayInfo(s){const f=feeds.get(s);return f?.manifest.days.find(d=>d.date===s.historical.date)??null;}
export function nextMultiM15Date(s){const days=feeds.get(s)?.manifest.days;return days?.[days.findIndex(d=>d.date===s.historical.date)+1]?.date??null;}
export function prepareNextMultiM15Day(s,{sleep=false}={}){
 const f=feeds.get(s),date=nextMultiM15Date(s);if(!date){s.historical.status='exhausted';if(!sleep)startHistoricalContinuation(s,'exhausted');return false;}
 const entry=f.manifest.days.find(d=>d.date===date),h=s.historical;
 Object.assign(h,{date,dayHash:entry.sha256,cursor:0,status:'loading',resumeAfterLoad:true});
 for(const p of Object.values(h.markets)){p.dayHash=entry.sha256;p.cursor=0;p.m15=null;p.simulationAt=h.lastQuote[0];delete p.displayAfter;delete p.displayFrom;}
 feeds.delete(s);return true;
}
export function multiM15TradeEvidence(s,pair){
 const p=s.historical.markets[pair],sample=p?.m15?.lastSample,reference=sample?{date:s.historical.date,cursor:p.cursor,sourceVersion:p.sourceVersion,sourceHash:p.sourceHash,sourceBinding:p.m15.sourceBinding,at:sample.at,barAt:sample.barAt,step:sample.step}:p?.lastReference;
 return reference?{date:reference.date,cursor:reference.cursor,sourceVersion:reference.sourceVersion,priceBasis:s.historical.priceBasis,sourceHash:reference.sourceHash,sourceBinding:reference.sourceBinding,symbol:pair,sourceTimestamp:reference.at,executionTimestamp:s.historical.lastQuote[0],pathModel:M15_PATH_MODEL,barAt:reference.barAt,step:reference.step,...(!sample?{referenceKind:'carried-reference'}:{})}:null;
}
export function validMultiM15Book(s){
 const b=s.marketBook;if(!isMultiM15(s)||b?.version!==1||b.source!=='historical-m15-reference'||!SYMBOLS.includes(b.active)||Object.keys(b.markets??{}).length!==3)return false;
 return SYMBOLS.every(pair=>{const m=b.markets[pair];return m&&Number.isFinite(m.price)&&m.price>0&&m.script?.historical===true&&m.script.tracks?.length===0&&Array.isArray(m.candles)&&(m.candles.length>0||s.historical.markets[pair]?.m15===null)&&m.candles.every(c=>[c.open,c.high,c.low,c.close].every(n=>Number.isFinite(n)&&n>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)&&c.availableAt<=s.historical.lastQuote[0])&&validCandleDisplay({...s,displayMinutes:m.displayMinutes});})&&s.price===b.markets[b.active].price&&(s.positions||[]).every(p=>SYMBOLS.includes(p.symbol||'USD/JPY'));
}
export function validMultiM15Save(s){
 const h=s.historical;if(!isMultiM15(s)||h.priceBasis!=='m15-reference-simulated-path'||!HASH.test(h.sourceHash)||!HASH.test(h.dayHash)||h.sourceVersion!==h.sourceHash||typeof h.datasetId!=='string'||!/^\d{4}-\d\d-\d\d$/.test(h.date)||!/^\d{4}-\d\d-\d\d$/.test(h.startDate)||!['ready','loading','error','day-end','exhausted'].includes(h.status)||!Array.isArray(h.lastQuote)||h.lastQuote.length!==2||!Number.isSafeInteger(h.lastQuote[0])||h.lastQuote[1]!==s.price||s.tradingClock?.lastQuoteAt!==h.lastQuote[0]||!Number.isSafeInteger(h.cursor)||h.cursor<0||Object.keys(h.markets??{}).length!==3||!validMultiM15Book(s))return false;
 return Object.values(h.markets).reduce((n,p)=>n+p.cursor,0)===h.cursor&&SYMBOLS.every(pair=>{
  const p=h.markets[pair],v=p?.m15,last=v?.lastSample;
  if(!p||typeof p.datasetId!=='string'||typeof p.sourceVersion!=='string'||p.sourceHash!==null&&!HASH.test(p.sourceHash)||p.dayHash!==h.dayHash||!Number.isSafeInteger(p.cursor)||p.cursor<0||p.simulationAt!==null&&(!Number.isSafeInteger(p.simulationAt)||p.simulationAt>h.lastQuote[0]))return false;
  const r=p.lastReference;
  if(r&&(!Number.isSafeInteger(r.at)||r.at<0||r.at>h.lastQuote[0]||!Number.isFinite(r.price)||r.price<=0||r.pair!==pair||r.datasetId!==p.datasetId||r.sourceVersion!==p.sourceVersion||r.sourceHash!==p.sourceHash||!HASH.test(r.dayHash)||!/^\d{4}-\d\d-\d\d$/.test(r.date)||!/^[a-f0-9]{16}$/.test(r.sourceBinding)||!Number.isSafeInteger(r.cursor)||r.cursor<1||!Number.isSafeInteger(r.barAt)||r.barAt<0||r.barAt%900000!==0||!Number.isInteger(r.step)||r.step<0||r.step>24||r.at!==r.barAt+r.step*37500))return false;
  if(p.markAt!==undefined&&p.markAt!==null&&(!Number.isSafeInteger(p.markAt)||p.markAt<0||p.markAt>h.lastQuote[0]))return false;
  if(v===null)return p.cursor===0&&p.lastQuote?.[0]<=h.lastQuote[0];
  return v?.version===1&&v.pathModel===M15_PATH_MODEL&&/^[a-f0-9]{16}$/.test(v.sourceBinding)&&v.pair===pair&&v.seed===s.seed&&v.nextEvent===p.cursor&&last&&v.marketAt===last.at&&p.lastQuote?.[0]===last.at&&p.lastQuote[1]===last.price&&last.at<=h.lastQuote[0]&&Number.isInteger(last.step)&&last.step>=0&&last.step<=24&&Number.isSafeInteger(last.barAt)&&last.barAt%900000===0&&last.at===last.barAt+last.step*37500&&last.pathModel===M15_PATH_MODEL&&last.simulated===true&&(historicalMarkIsSimulated(s,pair)||s.marketBook.markets[pair].price===last.price);
 });
}
