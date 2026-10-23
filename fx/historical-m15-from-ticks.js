import {M15_DURATION_MS,M15_SOURCE_SCHEMA,validateHistoricalM15Source} from './historical-m15-source.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
const HASH=/^[a-f0-9]{64}$/;
const fail=message=>{throw Error('Historical M15 derivation: '+message);};
const ohlc=price=>({open:price,high:price,low:price,close:price});
const update=(bar,price)=>{bar.high=Math.max(bar.high,price);bar.low=Math.min(bar.low,price);bar.close=price;};
export const M15_TICK_DERIVATION='observed-bid-ask-ticks-to-m15-mid-v1';
export const M15_APPROVED_USE=Object.freeze({decisionDate:'2026-10-23',scope:'Existing Kurumi anonymous game and existing audience only; deterministic USDJPY M15 derivation and simulated intrabar reference path.',sourceRightsUnchanged:true,newAudienceOrUnrestrictedRedistributionApproved:false});

// Consumes already byte-validated game-package days. No file I/O, downloads,
// tick repair, calendar inference, volume reconstruction or bid/ask simulation.
// Mid OHLC is accumulated from each actual midpoint, never by averaging the
// separately accumulated Bid and Ask extrema (which may occur at other times).
export function deriveM15SourceFromTicks({manifest,dayData,approvedUse=M15_APPROVED_USE}={}){
 if(!manifest||manifest.schemaVersion!==1||manifest.symbol!=='USDJPY'||manifest.quoteType!=='bid-ask'||manifest.chartPrice!=='mid'||manifest.timeZone!=='Asia/Tokyo'||typeof manifest.sourceTimeZone!=='string'||!manifest.sourceTimeZone||!HASH.test(manifest.source?.sha256)||typeof manifest.id!=='string'||typeof manifest.version!=='string'||!Number.isSafeInteger(manifest.gapThresholdMs)||manifest.gapThresholdMs<=0||!Array.isArray(manifest.days)||!manifest.rights||typeof manifest.rights.redistribution!=='string'||typeof manifest.rights.localOnly!=='boolean')fail('explicit validated USDJPY bid/ask source metadata required');
 const days=Array.isArray(dayData)?dayData:[dayData],bars=[],sourceBars=[],observationGaps=[];let previous=-Infinity,observations=0;
 for(const data of days){
  const entry=manifest.days.find(d=>d.date===data?.date);
  if(!data||data.validated!==true||!entry||data.datasetId!==manifest.id||String(data.datasetVersion)!==manifest.version||data.timeZone!==manifest.timeZone||data.sha256!==entry.sha256||!HASH.test(data.sha256)||!Array.isArray(data.ticks)||!data.ticks.length||data.ticks.length!==entry.count)fail('day identity/count mismatch');
  if(data.ticks[0][0]!==entry.first||data.ticks.at(-1)[0]!==entry.last)fail('day range mismatch');
  const actualGaps=[];let localPrevious=null;
  for(const q of data.ticks){
   if(!Array.isArray(q)||q.length!==3||!Number.isSafeInteger(q[0])||q[0]<0||q[0]<previous||!Number.isFinite(q[1])||q[1]<=0||!Number.isFinite(q[2])||q[2]<q[1]||new Date(q[0]+32400000).toISOString().slice(0,10)!==data.date)fail('invalid or unordered canonical bid/ask tick');
   if(localPrevious!==null&&q[0]-localPrevious>manifest.gapThresholdMs)actualGaps.push([localPrevious,q[0]]);
   const at=Math.floor(q[0]/M15_DURATION_MS)*M15_DURATION_MS,mid=q[1]/2+q[2]/2;let bar=bars.at(-1),sides=sourceBars.at(-1);
   if(!bar||bar.at!==at){bar={at,...ohlc(mid)};bars.push(bar);sides={at,bid:ohlc(q[1]),ask:ohlc(q[2]),firstObservedAt:q[0],lastObservedAt:q[0],count:1};sourceBars.push(sides);}
   else{update(bar,mid);update(sides.bid,q[1]);update(sides.ask,q[2]);sides.lastObservedAt=q[0];sides.count++;}
   previous=q[0];localPrevious=q[0];observations++;
  }
  if(!Array.isArray(entry.gaps)||actualGaps.length!==entry.gaps.length||actualGaps.some((g,i)=>g[0]!==entry.gaps[i].fromMs||g[1]!==entry.gaps[i].toMs))fail('observed gap metadata mismatch');
  for(const g of [entry.gapBefore,...entry.gaps].filter(Boolean))observationGaps.push({from:g.fromMs,to:g.toMs,classification:g.classification,classificationBasis:g.classificationBasis,...(g.calendarSource?{calendarSource:g.calendarSource}:{})});
 }
 if(!bars.length)fail('no observed bars');
 return validateHistoricalM15Source({schemaVersion:M15_SOURCE_SCHEMA,datasetId:manifest.id+':m15-mid:'+days[0].date+':'+days.at(-1).date,version:M15_TICK_DERIVATION+':'+manifest.version,pair:'USD/JPY',timeZone:manifest.timeZone,timeUnit:'milliseconds',timestampMeaning:'bar-open',priceBasis:'game-reference-price',priceUnit:'JPY per USD',provenance:{kind:manifest.fixture===true?'synthetic-fixture':'historical-ohlc',sourceId:manifest.id,quoteBasis:'bid-ask-mid',sourceQuoteType:'bid-ask',sourceTimeZone:manifest.sourceTimeZone,sourceTimestampFormat:manifest.source.timestampFormat,canonicalTimestampUnit:'milliseconds-since-unix-epoch',sourceSha256:manifest.source.sha256,sourceVersion:manifest.version,dayHashes:days.map(d=>({date:d.date,sha256:d.sha256})),derivationModel:M15_TICK_DERIVATION,observations,observationsOnly:true,rights:{...manifest.rights}},bars,sourceBars,observationGaps,closures:[],approvedUse});
}
