import {recordDisplayQuote,recordDisplaySourceCandle} from './candle-period.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
// Replay identity/cursor only is persisted. Unseen quotes stay outside game state.
const feeds=new WeakMap();
const DAY=86400000,JST=9*3600000;
export const historicalDate=ms=>new Date(ms+JST).toISOString().slice(0,10);
export const isResearch=s=>s?.historical?.version===2;
export const isHistorical=s=>[1,2].includes(s?.historical?.version);
export const hasHistoricalFeed=s=>feeds.has(s);
export const historicalReady=s=>!isHistorical(s)||(s.historical.status==='ready'&&feeds.has(s));
const mid=q=>(q[1]+q[2])/2;
export function historicalScript(){return{historical:true,tracks:[],events:Array.from({length:5},()=>({id:'historical',chain:'历史行情',title:'USD/JPY 历史回放',copy:'按当时的报价继续交易。',source:'历史外汇行情',time:'',flash:'USD/JPY 历史回放',flashCopy:'按当时的报价继续交易。'}))};}
export function initializeHistorical(s,{manifest,dayData,startDate,manifestURL}){
 if(manifest.schemaVersion==='research-m1-close-v1')return initializeResearch(s,{manifest,dayData,startDate,manifestURL});
 const entry=manifest.days.find(d=>d.date===startDate);if(!entry)throw Error('所选日期没有历史行情');
 s.version=s.version===12?12:10;s.historical={version:1,datasetId:manifest.id??manifest.datasetId,sourceVersion:String(manifest.version),sourceHash:manifest.source.sha256,manifestURL:manifestURL||null,priceBasis:'bid-ask-mid',date:startDate,startDate,dayHash:entry.sha256,cursor:0,status:'loading',lastQuote:null,acceptedGapCursor:null};
 bindHistoricalDay(s,manifest,dayData);
 const quote=dayData.ticks[0];if(!quote)throw Error('当日没有报价');
 s.price=mid(quote);s.startPrice=s.price;s.candles=[{open:s.price,close:s.price,high:s.price,low:s.price,closed:false,day:1,beat:0,timestamp:Math.floor(quote[0]/900000)*900000,timeSource:'historical',firstQuoteAt:quote[0],lastQuoteAt:quote[0]}];s.script=historicalScript();
 s.tradingClock={version:1,epochMs:Math.floor((quote[0]+JST)/DAY)*DAY-JST,timeZone:'Asia/Tokyo',candleMinutes:15,source:'historical',lastQuoteAt:quote[0],lastQuoteDay:s.day};
 commitHistoricalQuote(s,quote);recordDisplayQuote(s,quote[0],s.price);s.historical.status='ready';
 return s;
}
export function bindHistoricalDay(s,manifest,dayData){
 if(isResearch(s))return bindResearchDay(s,manifest,dayData);
 const h=s.historical,entry=manifest.days.find(d=>d.date===h.date);
 if(dayData.validated!==true||dayData.sha256!==entry?.sha256||String(dayData.datasetVersion)!==String(manifest.version)||!entry||h.datasetId!==(manifest.id??manifest.datasetId)||h.sourceVersion!==String(manifest.version)||h.sourceHash!==manifest.source.sha256||h.dayHash!==entry.sha256||dayData.date!==h.date||!Array.isArray(dayData.ticks)||dayData.ticks.length!==entry.count)throw Error('历史行情版本与存档不一致');
 if(!Number.isSafeInteger(h.cursor)||h.cursor<0||h.cursor>dayData.ticks.length)throw Error('历史行情游标无效');
 if(h.cursor>0){const q=dayData.ticks[h.cursor-1];if(!h.lastQuote||q.some((v,i)=>v!==h.lastQuote[i])||s.price!==mid(q))throw Error('历史报价与存档不一致');}
 feeds.set(s,{manifest,dayData});
 if(['loading','error','ready'].includes(h.status))h.status='ready';
 return s;
}
export function historicalDayInfo(s){return feeds.get(s)?.manifest.days.find(d=>d.date===s.historical.date)||null;}
export function nextHistoricalDate(s){const days=feeds.get(s)?.manifest.days;if(!days)return null;return days[days.findIndex(d=>d.date===s.historical.date)+1]?.date||null;}
export function prepareNextHistoricalDay(s){
 const feed=feeds.get(s);if(!feed)throw Error('请先载入历史行情');
 const days=feed.manifest.days,index=days.findIndex(d=>d.date===s.historical.date),entry=days[index+1];
 if(!entry){s.historical.status='exhausted';s.marketPaused=true;return false;}
 if(isResearch(s))s.historical.skippedRemainder=feed.dayData.bars.length>s.historical.cursor;
 Object.assign(s.historical,{date:entry.date,dayHash:entry.sha256,cursor:0,status:'loading',resumeAfterLoad:true,acceptedGapCursor:null});
 feeds.delete(s);s.marketPaused=true;return true;
}
export function peekHistoricalQuote(s){
 const h=s.historical,feed=feeds.get(s);if(!feed)throw Error('历史行情尚未载入');
 if(h.status!=='ready')return{blocked:true};
 const bar=isResearch(s)?feed.dayData.bars[h.cursor]:null;
 const q=isResearch(s)?(bar?[bar.availableAt,bar.close]:null):feed.dayData.ticks[h.cursor];if(!q)return{done:true};
 const gap=q[0]-(h.lastQuote?.[0]??q[0]);
 if(gap>feed.manifest.gapThresholdMs&&h.acceptedGapCursor!==h.cursor){
  // A silent interval is not proof of missing data or of a closed exchange.
  const all=[...(feed.dayData.gaps||[]),...(historicalDayInfo(s)?.gaps||[]),...(feed.dayData.gapBefore?[feed.dayData.gapBefore]:[])];
  const known=all.find(g=>g.toMs===q[0]||g.afterMs===q[0]);
  h.gap={fromMs:h.lastQuote[0],toMs:q[0],durationMs:gap,kind:known?.classification==='verified_closure'?'verified_closure':known?.classification==='weekend_closure_candidate'?'weekend_closure_candidate':isResearch(s)&&h.cursor===0&&h.skippedRemainder===true?'player_skipped_remainder':'unknown_observation_gap'};
  h.status='gap';s.marketPaused=true;return{blocked:true,gap:h.gap};
 }
 return{quote:q,bar,last:h.cursor===(isResearch(s)?feed.dayData.bars:feed.dayData.ticks).length-1};
}
export function continueHistoricalGap(s){if(!isHistorical(s)||s.historical.status!=='gap')return false;s.historical.acceptedGapCursor=s.historical.cursor;s.historical.status='ready';s.marketPaused=false;return true;}
export function commitHistoricalQuote(s,q){const h=s.historical;if(h.cursor===0)h.dayOpeningAt=q[0];h.cursor++;h.lastQuote=[...q];h.acceptedGapCursor=null;delete h.gap;delete h.skippedRemainder;s.tradingClock.lastQuoteAt=q[0];s.tradingClock.lastQuoteDay=s.day;}
export function validHistoricalSave(s){
 const h=s.historical;if(!h)return true;
 if(isResearch(s))return validResearchSave(s);
 return [10,12].includes(s.version)&&h.version===1&&typeof h.datasetId==='string'&&h.datasetId.length>0&&typeof h.sourceVersion==='string'&&h.sourceVersion.length>0&&/^[a-f0-9]{64}$/.test(h.sourceHash)&&/^[a-f0-9]{64}$/.test(h.dayHash)&&/^\d{4}-\d\d-\d\d$/.test(h.date)&&/^\d{4}-\d\d-\d\d$/.test(h.startDate)&&Number.isSafeInteger(h.cursor)&&h.cursor>=0&&h.priceBasis==='bid-ask-mid'&&['ready','loading','error','gap','day-end','exhausted'].includes(h.status)&&Array.isArray(h.lastQuote)&&h.lastQuote.length===3&&h.lastQuote.every(Number.isFinite)&&h.lastQuote[1]>0&&h.lastQuote[2]>=h.lastQuote[1]&&s.price===mid(h.lastQuote)&&s.script?.historical===true&&Array.isArray(s.script.tracks)&&s.script.tracks.length===0&&s.tradingClock?.lastQuoteAt===h.lastQuote[0];
}
export function markHistoricalRestored(s){if(isHistorical(s)&&s.historical.status==='ready'){s.historical.resumeAfterLoad=!s.marketPaused;s.historical.status='loading';}}

function initializeResearch(s,{manifest,dayData,startDate,manifestURL}){
 const entry=manifest.days.find(d=>d.date===startDate);if(!entry)throw Error('所选日期没有分钟行情');
 s.version=s.version===12?12:11;s.historical={version:2,datasetId:manifest.id,sourceVersion:String(manifest.version),sourceHash:manifest.source.sha256,manifestURL,priceBasis:'observed-close-only',research:{...manifest.research},date:startDate,startDate,dayHash:entry.sha256,cursor:0,status:'loading',lastQuote:null,acceptedGapCursor:null};
 bindResearchDay(s,manifest,dayData);const bar=dayData.bars[0];s.price=bar.close;s.startPrice=s.price;s.candles=[researchCandle(s,bar)];s.completedCandles=1;s.script=historicalScript();
 s.tradingClock={version:1,epochMs:Math.floor((bar.availableAt+JST)/DAY)*DAY-JST,timeZone:'Asia/Tokyo',candleMinutes:1,source:'historical',lastQuoteAt:bar.availableAt,lastQuoteDay:s.day};
 commitHistoricalQuote(s,[bar.availableAt,bar.close]);recordDisplaySourceCandle(s,s.candles[0]);s.historical.status='ready';return s;
}
export function researchCandle(s,bar){return {open:bar.open,high:bar.high,low:bar.low,close:bar.close,closed:true,day:s.day,beat:Math.min(3,Math.floor(new Date(bar.availableAt+JST).getUTCHours()/6)),timestamp:bar.labelAt,timeSource:'historical',firstQuoteAt:bar.availableAt,lastQuoteAt:bar.availableAt,availableAt:bar.availableAt,research:true};}
function bindResearchDay(s,manifest,data){
 const h=s.historical,entry=manifest.days.find(d=>d.date===h.date);
 if(manifest.schemaVersion!=='research-m1-close-v1'||data.schemaVersion!==manifest.schemaVersion||data.validated!==true||!entry||data.date!==h.date||data.sha256!==h.dayHash||data.sha256!==manifest.source.sha256||h.sourceHash!==manifest.source.sha256||h.datasetId!==manifest.id||h.sourceVersion!==String(manifest.version)||data.datasetVersion!==manifest.version||!researchMetadataEqual(h.research,manifest.research)||!Array.isArray(data.bars)||!data.bars.length)throw Error('分钟行情版本与存档不一致');
 if(!Number.isSafeInteger(h.cursor)||h.cursor<0||h.cursor>data.bars.length)throw Error('分钟行情游标无效');
 if(h.cursor>0){const b=data.bars[h.cursor-1];if(h.lastQuote?.length!==2||h.lastQuote[0]!==b.availableAt||h.lastQuote[1]!==b.close||s.price!==b.close)throw Error('分钟行情存档价格不符');}
 feeds.set(s,{manifest,dayData:data});if(['loading','error','ready'].includes(h.status))h.status='ready';return s;
}
function validResearchSave(s){const h=s.historical;return [11,12].includes(s.version)&&typeof h.datasetId==='string'&&typeof h.sourceVersion==='string'&&/^[a-f0-9]{64}$/.test(h.sourceHash)&&h.dayHash===h.sourceHash&&/^\d{4}-\d\d-\d\d$/.test(h.date)&&/^\d{4}-\d\d-\d\d$/.test(h.startDate)&&Number.isSafeInteger(h.cursor)&&h.cursor>=0&&h.priceBasis==='observed-close-only'&&h.research?.executionModel==='observed-close-only'&&h.research?.availabilityModel==='label-plus-60-seconds'&&h.research?.spreadModel==='none'&&['ready','loading','error','gap','day-end','exhausted'].includes(h.status)&&Array.isArray(h.lastQuote)&&h.lastQuote.length===2&&h.lastQuote.every(Number.isFinite)&&h.lastQuote[1]>0&&s.price===h.lastQuote[1]&&s.script?.historical===true&&s.script.tracks?.length===0&&s.tradingClock?.lastQuoteAt===h.lastQuote[0];}

function researchMetadataEqual(a,b){const keys=['timestampMeaning','quoteSide','availabilityModel','executionModel','spreadModel','feesModel'];return a&&b&&Object.keys(a).length===keys.length&&Object.keys(b).length===keys.length&&keys.every(k=>Object.hasOwn(a,k)&&Object.hasOwn(b,k)&&a[k]===b[k]);}
