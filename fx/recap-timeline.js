// Read-only replay clock. Receipts move realized P/L; recorded equity moves assets.
const finite=(n,f=0)=>Number.isFinite(n)?n:f;
export function buildRecapTimeline(snapshot,presentation){
 const candles=snapshot.candles||[],trades=(snapshot.trades||[]).filter(t=>Number.isFinite(t.timestamp)).map((t,i)=>({...t,key:t.sequence??i})).sort((a,b)=>a.timestamp-b.timestamp||a.key-b.key);
 const observations=(snapshot.replay?.observations||[]).filter(p=>Number.isFinite(p.timestamp)&&Number.isFinite(p.tradingAssets)&&Number.isFinite(p.unrealized)&&(!Number.isFinite(snapshot.timestamp)||p.timestamp<=snapshot.timestamp)).map(p=>({...p})).sort((a,b)=>a.timestamp-b.timestamp);
 const times=[...observations.map(p=>p.timestamp),...candles.map(c=>c.timestamp),...trades.map(t=>t.timestamp)].filter(Number.isFinite);
 const start=Math.min(...times,finite(snapshot.timestamp,Infinity)),end=Math.max(start+1,...times,finite(snapshot.timestamp),...(Number.isFinite(snapshot.timestamp)?[]:candles.map(c=>c.timestamp+900000)));
 const safeStart=Number.isFinite(start)?start:0,safeEnd=Number.isFinite(end)?end:safeStart+1,clockPower=1.18;
 // Give every receipt a readable scoring window. Later receipts resolve faster;
 // time only advances between receipts. This is presentation, never a new ledger.
 const budget=presentation.countDuration*.52,weights=trades.map((t,i)=>(t.type==='open'?.45:1)*(1-.32*i/Math.max(1,trades.length-1))),weightSum=weights.reduce((a,b)=>a+b,0);
 const holds=weights.map((w,i)=>Math.min(trades[i].type==='open'?600:presentation.catastrophic?1500:1800,budget*w/Math.max(.01,weightSum))),totalHold=holds.reduce((a,b)=>a+b,0);
 const travel=presentation.countDuration*.90-totalHold,hold=holds[0]||0;
 let pnl=0,spent=0;
 const events=trades.map((t,index)=>{const delta=t.type==='open'?0:finite(t.pnl),before=pnl;pnl+=delta;const event={...t,index,delta,before,after:pnl,atMs:travel*((t.timestamp-safeStart)/(safeEnd-safeStart))**(1/clockPower)+spent,hold:holds[index]};spent+=event.hold;return event;});
 // Each monetary beat releases a larger slice of this actual receipt. The audio
 // and amount punch share these exact timestamps, including modest daily gains.
 const scoreBeats=events.flatMap(event=>{
  if(!event.delta)return [];
  const count=Math.max(1,Math.min(6,Math.floor(event.hold/160)));
  return Array.from({length:count},(_,step)=>({eventIndex:event.index,delta:event.delta,step,count,atMs:event.atMs+event.hold*(.12+.76*((step+1)/count)**.72),fraction:((step+1)/count)**1.35}));
 }).map((beat,index,all)=>({...beat,index,strength:.35+.65*(index+1)/Math.max(1,all.length)}));
 // Only observed trading assets can produce market beats. Collapse observations
 // sharing a timestamp to the same last-known value used by the visual clock.
 const unique=observations.filter((p,i)=>observations[i+1]?.timestamp!==p.timestamp);
 let previous=finite(snapshot.daily.openingNominal),lastAssetAt=-Infinity;
 const assetBeats=[];
 for(const point of unique){
  const delta=point.tradingAssets-previous;previous=point.tradingAssets;
  const atMs=travel*((point.timestamp-safeStart)/(safeEnd-safeStart))**(1/clockPower)+events.filter(e=>e.timestamp<point.timestamp).reduce((sum,e)=>sum+e.hold,0);
  // Sampling limits presentation density, never the visible recorded balance.
  if(Math.abs(delta)<.01||atMs<100||atMs-lastAssetAt<[700,560,380,260][presentation.rank]||assetBeats.length>=24||scoreBeats.some(b=>Math.abs(b.atMs-atMs)<110))continue;
  lastAssetAt=atMs;assetBeats.push({index:assetBeats.length,atMs,timestamp:point.timestamp,value:point.tradingAssets,delta,strength:Math.max(.18,Math.min(1,Math.abs(delta)/Math.max(1,Math.abs(snapshot.daily.openingNominal)*.03))),asset:true});
 }
 const known=events.reduce((sum,e)=>sum+e.delta,0),residual=finite(snapshot.daily.tradingNet)-known;
 return {start:safeStart,end:safeEnd,clockPower,travel,hold,events,scoreBeats,assetBeats,known,residual,observations,opening:finite(snapshot.daily.openingNominal),closing: snapshot.sealed ? finite(snapshot.daily.openingNominal)+finite(snapshot.daily.tradingNet) : observations.at(-1)?.tradingAssets,partial:!!snapshot.replay?.partial,finishAt:travel+totalHold};
}
export function recapTimelineFrame(timeline,elapsed,{complete=false}={}){
 let spent=0,active=null,realized=0,seen=0;
 for(const event of timeline.events){if(elapsed<event.atMs)break;active=event;seen++;const local=Math.min(1,Math.max(0,(elapsed-event.atMs)/Math.max(1,event.hold)));const beats=timeline.scoreBeats.filter(b=>b.eventIndex===event.index&&b.atMs<=elapsed),last=beats.at(-1);realized=event.before+event.delta*(local>=1?1:last?.fraction||0);spent+=Math.min(event.hold,Math.max(0,elapsed-event.atMs));}
 const progress=complete?1:Math.min(1,Math.max(0,(elapsed-spent)/Math.max(1,timeline.travel)));
 const timestamp=timeline.start+(timeline.end-timeline.start)*progress**(timeline.clockPower||1.18);
 // Incomplete old ledgers reconcile only at the known closing snapshot, never
 // fabricate execution times or distribute an unknown gain over the candles.
 if(complete||elapsed>=timeline.finishAt)realized=timeline.known+timeline.residual;
 const reconciled=complete||elapsed>=timeline.finishAt,points=timeline.observations||[];
 // Keep gaps in old saves honest: hold the last known observation. In
 // particular, never interpolate toward a future point or reconstruct equity
 // from candle highs/lows, which do not reveal the order of intrabar prices.
 let observed=null;for(const point of points){if(point.timestamp>timestamp)break;observed=point;}
 const tradingAssets=reconciled&&Number.isFinite(timeline.closing)?timeline.closing:observed?.tradingAssets??timeline.opening+realized;
 const unrealized=reconciled&&Number.isFinite(timeline.closing)?finite(points.at(-1)?.unrealized):finite(observed?.unrealized);
 const scoreBeat=timeline.scoreBeats.filter(b=>b.atMs<=elapsed).at(-1)||null;
 const assetBeat=(timeline.assetBeats||[]).filter(b=>b.atMs<=elapsed).at(-1)||null;
 return {scoreBeat,assetBeat,timestamp,realized,unrealized,tradingAssets,observationAvailable:!!observed,observationPartial:timeline.partial,event:active,eventCount:seen,timeProgress:progress,reconciled};
}
