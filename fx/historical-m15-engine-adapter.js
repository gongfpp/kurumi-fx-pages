import {deriveM15SourceFromTicks} from './historical-m15-from-ticks.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {HistoricalM15Replay} from './historical-m15-replay.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {M15_PATH_MODEL} from './historical-m15-path.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {aggregateCandles} from './candle-period.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
const feeds=new WeakMap(),HASH=/^[a-f0-9]{64}$/;
const SOURCE_HASH='ce78872e7bbdf883c99b32d6d9854dc9f6f564b78d1d4d095a57bf5c8a3caf35';
const BASIS='m15-mid-reference-simulated-path';
const fail=message=>{throw Error('Historical M15 adapter: '+message);};
export const isHistoricalM15=s=>s?.historical?.version===4;
export const hasHistoricalM15Feed=s=>feeds.has(s);
export const historicalM15Feed=s=>feeds.get(s)??null;
export const releaseHistoricalM15Feed=s=>feeds.delete(s);
export function eligibleHistoricalM15(manifest,dayData){return manifest?.id==='histdata-usdjpy-201402'&&manifest?.source?.sha256===SOURCE_HASH&&manifest.symbol==='USDJPY'&&manifest.quoteType==='bid-ask'&&manifest.chartPrice==='mid'&&dayData?.validated===true;}
function syncDisplay(s,feed,{day=s.day,sleepHistory=false}={}){
 const h=s.historical,opening=h.dayOpeningGameDay===s.day?h.dayOpeningAt:null;
 const oldCandles=new Map((s.candles||[]).map(c=>[c.timestamp,c])),oldMinutes=new Map((s.displayMinutes||[]).map(c=>[c.timestamp,c]));
 const decorate=(c,old)=>({...c,day:old&&(old.closed||!Number.isFinite(opening)||c.timestamp<opening)?old.day:day,beat:Math.min(3,Math.floor(new Date(c.availableAt+32400000).getUTCHours()/6)),...(sleepHistory&&c.availableAt>=(feed.sleepFrom??Infinity)?{sleepHistory:true}:{})});
 const retainClosed=(base,updates)=>{const result=new Map(base.map(c=>[c.timestamp,c]));for(const c of updates){const old=oldCandles.get(c.timestamp);result.set(c.timestamp,old?.closed&&old.day<day?old:c);}return [...result.values()].sort((a,b)=>a.timestamp-b.timestamp).slice(-256);};
 const visible=c=>c.timestamp>=feed.displayFrom;
 const options=h.m15DisplayAfter===undefined?{}:{after:h.m15DisplayAfter};
 const candles=feed.replay.candles(15,options).filter(visible).map(c=>decorate(c,oldCandles.get(c.timestamp))),minutes=feed.replay.candles(1,options).filter(visible).map(c=>decorate(c,oldMinutes.get(c.timestamp))),from=feed.source.bars[0].at;
 if(h.m15DisplayAfter!==undefined){
  // Awake recovery extends the already executed sequence, never substitutes
  // the skipped private path. Its first visible point is an executed anchor.
  for(const c of minutes){
   const prior=oldMinutes.get(c.timestamp);
   if(prior&&(prior.availableAt??prior.lastQuoteAt)>c.availableAt)continue;
   oldMinutes.set(c.timestamp,prior?{...c,open:prior.open,high:Math.max(prior.high,c.high),low:Math.min(prior.low,c.low),firstQuoteAt:prior.firstQuoteAt,day:prior.closed?prior.day:c.day,...(prior.sourceKind!==c.sourceKind?{sourceKind:'mixed',sourceBreak:true}:{})}:c);
  }
  s.displayMinutes=[...oldMinutes.values()].sort((a,b)=>a.timestamp-b.timestamp).slice(-8192);
  const actual=aggregateCandles(s.displayMinutes.filter(c=>c.timestamp>=from),15,s.historical.lastQuote[0],{mergeSources:true});
  s.candles=retainClosed((s.candles||[]).filter(c=>c.timestamp<from||c.closed&&c.day<day),actual);
 }else{
  const keep=c=>c.timestamp<from||c.sourceKind!=='m15-simulated';
  s.candles=retainClosed((s.candles||[]).filter(c=>keep(c)||c.closed&&c.day<day),candles);
  s.displayMinutes=[...(s.displayMinutes||[]).filter(keep),...minutes].sort((a,b)=>a.timestamp-b.timestamp).slice(-8192);
 }
 return {candles,displayMinutes:minutes};
}
export function initializeHistoricalM15(s,{manifest,dayData,startDate,manifestURL=null,opening=null,script}={}){
 if(!eligibleHistoricalM15(manifest,dayData))fail('source is not the approved existing tick input');
 const entry=manifest.days.find(d=>d.date===startDate);if(!entry||dayData.date!==startDate)fail('opening day missing');
 s.historical={version:4,datasetId:manifest.id,sourceVersion:String(manifest.version),sourceHash:manifest.source.sha256,manifestURL,priceBasis:BASIS,date:startDate,startDate,dayHash:entry.sha256,cursor:0,status:'loading',lastQuote:null,acceptedGapCursor:null,m15:null};
 s.candles=[];s.displayMinutes=[];s.script=script??{historical:true,tracks:[],events:[]};
 if(opening)s.historical.m15WarmupFrom=opening.warmupFrom;
 bindHistoricalM15(s,manifest,dayData);
 const feed=feeds.get(s),target=opening?Math.floor(opening.at/900000)*900000:feed.source.bars[0].at;
 if(opening&&(!Number.isSafeInteger(opening.at)||!Number.isSafeInteger(opening.warmupFrom)||opening.warmupFrom>opening.at||!dayData.ticks.some(q=>q[0]===opening.at)))fail('invalid opening selection');
 while(feed.replay.peekNextTime()!==null&&feed.replay.peekNextTime()<=target)commitHistoricalM15(s);
 if(!s.historical.lastQuote)fail('opening source bar missing');
 s.startPrice=s.price;s.completedCandles=0;s.historical.dayOpeningAt=s.historical.lastQuote[0];
 s.tradingClock={version:1,epochMs:Math.floor((s.historical.lastQuote[0]+32400000)/86400000)*86400000-32400000,timeZone:manifest.timeZone,candleMinutes:15,source:'historical',lastQuoteAt:s.historical.lastQuote[0],lastQuoteDay:s.day};
 if(opening){for(const c of [...s.candles,...s.displayMinutes])if(c.timestamp<target)c.historyWarmup=true;}
 s.historical.status='ready';return s;
}
export function bindHistoricalM15(s,manifest,data){
 const h=s.historical,entry=manifest.days.find(d=>d.date===h?.date);
 if(!isHistoricalM15(s)||!eligibleHistoricalM15(manifest,data)||!entry||data.date!==h.date||data.sha256!==h.dayHash||entry.sha256!==h.dayHash||manifest.id!==h.datasetId||manifest.source.sha256!==h.sourceHash||String(manifest.version)!==h.sourceVersion)fail('source/save identity mismatch');
 const source=deriveM15SourceFromTicks({manifest,dayData:data}),replay=new HistoricalM15Replay({source,seed:s.seed,progress:h.m15});
 if(replay.cursor!==h.cursor)fail('saved cursor mismatch');
 const last=replay.snapshot().lastSample;
 if(last&&(h.lastQuote?.[0]!==last.at||h.lastQuote?.[1]!==last.price||s.historyContinuation?.origins?.['USD/JPY']!=='simulated'&&s.price!==last.price))fail('saved reference price mismatch');
 if(!last&&h.lastQuote&&h.lastQuote[0]>source.bars[0].at)fail('empty cursor is later than the source opening');
 feeds.set(s,{manifest,dayData:data,source,replay,displayFrom:Math.max(source.bars[0].at,h.m15WarmupFrom??source.bars[0].at)});h.m15=replay.snapshot();if(['ready','loading','error'].includes(h.status))h.status='ready';return s;
}
export function peekHistoricalM15(s){
 const feed=feeds.get(s);if(!feed)fail('source not loaded');if(s.historical.status!=='ready')return {blocked:true};
 const sample=feed.replay.peekNextSample();if(!sample)return {done:true};
 return {quote:[sample.at,sample.price],midpoint:sample.price,sample,barCompleted:sample.step===24,last:feed.replay.cursor===feed.source.bars.length*25-1,gapDurationMs:Math.max(0,sample.at-(s.historical.lastQuote?.[0]??sample.at)-37500)};
}
export function commitHistoricalM15(s,quote=null,displayOptions={}){
 const feed=feeds.get(s);if(!feed)fail('source not loaded');const expected=feed.replay.peekNextSample();
 if(!expected||quote&&(quote[0]!==expected.at||quote[1]!==expected.price))fail('next reference sample mismatch');
 if(displayOptions.sleepHistory&&feed.sleepFrom===undefined)feed.sleepFrom=expected.at;
 const sample=feed.replay.next(),h=s.historical;
 h.m15=feed.replay.snapshot();h.cursor=feed.replay.cursor;h.lastQuote=[sample.at,sample.price];h.acceptedGapCursor=null;s.price=sample.price;
 if(s.tradingClock){s.tradingClock.lastQuoteAt=sample.at;s.tradingClock.lastQuoteDay=s.day;}
 let display;
 if(displayOptions.deferDisplay===true){
  // Sleep still consumes every fixed anchor. Only chart reconstruction is
  // postponed; pending display options remain outside the serialised state.
  feed.pendingDisplayOptions={day:displayOptions.day??s.day,sleepHistory:displayOptions.sleepHistory===true};
  display={displayDeferred:true};
 }else{delete feed.pendingDisplayOptions;display=syncDisplay(s,feed,displayOptions);}
 return {sample,barCompleted:sample.step===24,sourceBar:feed.replay.completedSourceBar(sample),sourceSides:feed.replay.sourceSidesForCompletedBar(sample),...display};
}
export function flushHistoricalM15Display(s,displayOptions={}){
 const feed=feeds.get(s);if(!feed)fail('source not loaded');
 const display=syncDisplay(s,feed,{...feed.pendingDisplayOptions,...displayOptions});delete feed.pendingDisplayOptions;return display;
}
export function skipElapsedHistoricalM15(s,until){
 const feed=feeds.get(s);if(!feed)return 0;let skipped=0,last;
 // Source progress is distinct from execution: no executed mark, chart, risk
 // or account replay while discarding source samples behind simulated time.
 // lastQuoteAt below remains source identity; continuation.at is game time.
 while(feed.replay.peekNextTime()!==null&&feed.replay.peekNextTime()<=until){last=feed.replay.next();skipped++;}
 if(last){
  const h=s.historical;h.m15=feed.replay.snapshot();h.cursor=feed.replay.cursor;h.lastQuote=[last.at,last.price];h.acceptedGapCursor=null;h.m15DisplayAfter=until;
  if(s.tradingClock){s.tradingClock.lastQuoteAt=last.at;s.tradingClock.lastQuoteDay=s.day;}
 }
 return skipped;
}
export function historicalM15DayInfo(s){const feed=feeds.get(s);return feed?{...feed.manifest.days.find(d=>d.date===s.historical.date),first:feed.source.bars[0].at,last:feed.source.bars.at(-1).at+900000}:null;}
export function nextHistoricalM15Date(s){const feed=feeds.get(s),days=feed?.manifest.days;return days?.[days.findIndex(d=>d.date===s.historical.date)+1]?.date??null;}
export function prepareNextHistoricalM15Day(s){
 const feed=feeds.get(s),date=nextHistoricalM15Date(s);if(!date){s.historical.status='exhausted';return false;}
 const entry=feed.manifest.days.find(d=>d.date===date);Object.assign(s.historical,{date,dayHash:entry.sha256,cursor:0,status:'loading',resumeAfterLoad:true,acceptedGapCursor:null,m15:null});delete s.historical.m15WarmupFrom;delete s.historical.m15DisplayAfter;feeds.delete(s);return true;
}
export function validHistoricalM15Save(s){
 const h=s.historical;if(h?.m15DisplayAfter!==undefined&&(!Number.isSafeInteger(h.m15DisplayAfter)||h.m15DisplayAfter<0||!s.historyContinuation||h.m15DisplayAfter>s.historyContinuation.at))return false;if(!isHistoricalM15(s)||h.priceBasis!==BASIS||typeof h.datasetId!=='string'||typeof h.sourceVersion!=='string'||!HASH.test(h.sourceHash)||!HASH.test(h.dayHash)||!/^\d{4}-\d{2}-\d{2}$/.test(h.date)||!/^\d{4}-\d{2}-\d{2}$/.test(h.startDate)||!Number.isSafeInteger(h.cursor)||h.cursor<0||!['ready','loading','error','day-end','exhausted'].includes(h.status)||!Array.isArray(h.lastQuote)||h.lastQuote.length!==2||!Number.isSafeInteger(h.lastQuote[0])||h.lastQuote[0]<0||!Number.isFinite(h.lastQuote[1])||h.lastQuote[1]<=0||s.script?.historical!==true||s.tradingClock?.lastQuoteAt!==h.lastQuote[0])return false;
 if(h.m15===null)return h.cursor===0&&['loading','error','exhausted'].includes(h.status);
 const p=h.m15,last=p?.lastSample;
 if(p?.version===1&&p.pathModel===M15_PATH_MODEL&&/^[a-f0-9]{16}$/.test(p.sourceBinding)&&p.pair==='USD/JPY'&&p.seed===s.seed&&p.nextEvent===0&&h.cursor===0&&p.marketAt===null&&last===null)return true;
 return p?.version===1&&p.pathModel===M15_PATH_MODEL&&/^[a-f0-9]{16}$/.test(p.sourceBinding)&&p.pair==='USD/JPY'&&p.seed===s.seed&&p.nextEvent===h.cursor&&Number.isSafeInteger(p.marketAt)&&p.marketAt===last?.at&&last?.at===h.lastQuote[0]&&last?.price===h.lastQuote[1]&&last?.pathModel===M15_PATH_MODEL&&last?.simulated===true&&Number.isInteger(last.step)&&last.step>=0&&last.step<=24&&last.at===last.barAt+last.step*37500&&(s.historyContinuation?.origins?.['USD/JPY']==='simulated'||s.price===last.price);
}
