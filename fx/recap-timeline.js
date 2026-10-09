// Read-only replay clock. Receipts move realized P/L; recorded equity moves assets.
const finite=(n,f=0)=>Number.isFinite(n)?n:f;
export function buildRecapTimeline(snapshot,presentation){
 const candles=snapshot.candles||[],trades=(snapshot.trades||[]).filter(t=>Number.isFinite(t.timestamp)).map((t,i)=>({...t,key:t.sequence??i})).sort((a,b)=>a.timestamp-b.timestamp||a.key-b.key);
 const observations=(snapshot.replay?.observations||[]).filter(p=>Number.isFinite(p.timestamp)&&Number.isFinite(p.tradingAssets)&&Number.isFinite(p.unrealized)&&(!Number.isFinite(snapshot.timestamp)||p.timestamp<=snapshot.timestamp)).map(p=>({...p})).sort((a,b)=>a.timestamp-b.timestamp);
 const times=[...observations.map(p=>p.timestamp),...candles.map(c=>c.timestamp),...trades.map(t=>t.timestamp)].filter(Number.isFinite);
 const start=Math.min(...times,finite(snapshot.timestamp,Infinity)),end=Math.max(start+1,...times,finite(snapshot.timestamp),...(Number.isFinite(snapshot.timestamp)?[]:candles.map(c=>c.timestamp+900000)));
 const safeStart=Number.isFinite(start)?start:0,safeEnd=Number.isFinite(end)?end:safeStart+1;
 const travel=presentation.countDuration*.70,hold=Math.min(presentation.catastrophic?1500:850,presentation.countDuration*.20/Math.max(1,trades.length));
 let pnl=0;
 const events=trades.map((t,index)=>{const delta=t.type==='open'?0:finite(t.pnl),before=pnl;pnl+=delta;return {...t,index,delta,before,after:pnl,atMs:travel*((t.timestamp-safeStart)/(safeEnd-safeStart))**(1/1.7)+index*hold,hold};});
 const known=events.reduce((sum,e)=>sum+e.delta,0),residual=finite(snapshot.daily.tradingNet)-known;
 return {start:safeStart,end:safeEnd,travel,hold,events,known,residual,observations,opening:finite(snapshot.daily.openingNominal),closing: snapshot.sealed ? finite(snapshot.daily.openingNominal)+finite(snapshot.daily.tradingNet) : observations.at(-1)?.tradingAssets,partial:!!snapshot.replay?.partial,finishAt:travel+events.length*hold};
}
export function recapTimelineFrame(timeline,elapsed,{complete=false}={}){
 let spent=0,active=null,realized=0,seen=0;
 for(const event of timeline.events){if(elapsed<event.atMs)break;active=event;seen++;const local=Math.min(1,Math.max(0,(elapsed-event.atMs)/Math.max(1,event.hold)));realized=event.before+event.delta*(1-(1-local)**3);spent+=Math.min(event.hold,Math.max(0,elapsed-event.atMs));}
 const progress=complete?1:Math.min(1,Math.max(0,(elapsed-spent)/Math.max(1,timeline.travel)));
 const timestamp=timeline.start+(timeline.end-timeline.start)*progress**1.7;
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
 return {timestamp,realized,unrealized,tradingAssets,observationAvailable:!!observed,observationPartial:timeline.partial,event:active,eventCount:seen,timeProgress:progress,reconciled};
}
