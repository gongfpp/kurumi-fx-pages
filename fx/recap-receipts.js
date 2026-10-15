import {buildRecapTimeline,recapTimelineFrame,recapUpperBound} from './recap-timeline.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';
import {recapPresentation} from './recap-presentation.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';

// Explicit opt-in only. The app keeps its existing presentation until acceptance.
export const RECEIPT_RECAP_CANDIDATE='trade-receipts-v1';
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const clamp=value=>Math.max(0,Math.min(1,value));

// A 150ms slice of the original replay becomes 250ms of continuous motion.
// Speed falls linearly from 1 to .2. Only the presentation clock is remapped;
// receipts, timestamps and amounts remain the already settled facts.
export function receiptSourceTime(timeline,elapsed){
 const windows=timeline.slowdowns,index=recapUpperBound(windows,elapsed,w=>w.start)-1;
 if(index<0)return elapsed;
 const window=windows[index];
 if(elapsed>=window.end)return elapsed-window.addedAfter;
 const p=clamp((elapsed-window.start)/250);
 return window.sourceStart+250*(p-.4*p*p);
}
function receiptDeadline(windows,sourceTime){
 const index=recapUpperBound(windows,sourceTime,w=>w.sourceStart)-1;
 if(index<0)return sourceTime;
 const window=windows[index];
 if(sourceTime>=window.sourceEnd)return sourceTime+window.addedAfter;
 const distance=(sourceTime-window.sourceStart)/250;
 return window.start+250*(1-Math.sqrt(Math.max(0,1-1.6*distance)))/.8;
}

export function buildReceiptRecap(snapshot){
 const daily=snapshot.daily,net=finite(daily.tradingNet),opening=finite(daily.openingNominal);
 const rate=Number.isFinite(daily.returnRate)?daily.returnRate:daily.returnDenominator>0?net/daily.returnDenominator:0;
 // Reuse the existing receipt reconciliation, simultaneous groups and audio
 // planner. Quote candles and floating equity do not define earned P/L bars.
 const receiptSnapshot={...snapshot,primary:{...snapshot.primary,scope:'today',profit:net,returnRate:rate},trades:(snapshot.trades||[]).filter(trade=>trade.type==='open'||Number.isFinite(trade.pnl)),candles:[],replay:{observations:[],partial:!!snapshot.replay?.partial}};
 const basePresentation=recapPresentation(receiptSnapshot),source=buildRecapTimeline(receiptSnapshot,basePresentation);
 source.closing=opening+net;
 const slowdowns=[];
 let added=0,previousEnd=0;
 const threshold=Math.min(10000,Math.max(1,finite(daily.returnDenominator,Math.abs(opening))*.05));
 for(const beat of source.scoreBeats){
  // Dense receipts share their uninterrupted scan. Never stack overlapping
  // slowdowns or extend a replay in proportion to the number of fills.
  if(Math.abs(beat.delta)<threshold||beat.atMs-150<previousEnd)continue;
  const sourceStart=beat.atMs-150,start=sourceStart+added;
  added+=100;slowdowns.push({sourceStart,sourceEnd:beat.atMs,start,end:start+250,addedAfter:added});previousEnd=beat.atMs;
 }
 const at=sourceTime=>receiptDeadline(slowdowns,sourceTime);
 const scoreBeats=source.scoreBeats.map(beat=>({...beat,atMs:at(beat.atMs)}));
 const events=source.events.map(event=>({...event,sourceAtMs:event.atMs,atMs:at(event.atMs),beats:event.beats.map(beat=>scoreBeats[beat.index])}));
 const groups=new Map();
 for(const event of events){
  if(event.type==='open'||event.summary)continue;
  const group=groups.get(event.atMs)||{count:0,delta:0};group.count++;group.delta+=event.delta;group.lastEventIndex=event.index;groups.set(event.atMs,group);
 }
 const timeline={...source,source,slowdowns,events,scoreBeats,groups,assetBeats:[],observationTimes:[],finishAt:at(source.finishAt)};
 const presentation={...basePresentation,countDuration:timeline.finishAt,duration:timeline.finishAt+basePresentation.landingDuration,beatTimes:basePresentation.beatTimes.map(at)};
 return {timeline,presentation};
}

export function receiptRecapFrame(timeline,elapsed,options={}){
 const sourceTime=receiptSourceTime(timeline,elapsed),frame=recapTimelineFrame(timeline.source,sourceTime,options);
 const seen=options.complete?timeline.events.length:recapUpperBound(timeline.events,elapsed,e=>e.atMs),active=timeline.events[seen-1]||null;
 const receiptGroup=active&&!active.summary?timeline.groups.get(active.atMs):null,event=receiptGroup?timeline.events[receiptGroup.lastEventIndex]:active;
 const scoreBeat=timeline.scoreBeats[recapUpperBound(timeline.scoreBeats,elapsed,b=>b.atMs)-1]||null;
 const slowdown=timeline.slowdowns[recapUpperBound(timeline.slowdowns,elapsed,w=>w.start)-1];
 return {...frame,event,eventCount:seen,scoreBeat,assetBeat:null,receiptGroup,
  receiptScanProgress:options.complete?1:clamp(sourceTime/Math.max(1,timeline.source.finishAt)),
  slowing:!!slowdown&&elapsed<slowdown.end};
}

// All positions participate, including opposite directions and same-time fills.
// A missing legacy remainder is labelled separately, never invented as a trade.
export function receiptRecapBars(timeline){
 let receipt=0;
 return timeline.events.filter(event=>event.type!=='open').map(event=>({
  eventIndex:event.index,value:event.delta,timestamp:event.timestamp,atMs:event.atMs,
  progress:event.sourceAtMs/Math.max(1,timeline.source.finishAt),summary:!!event.summary,
  label:event.summary?'收盘汇总':`第${++receipt}笔`,
 }));
}
