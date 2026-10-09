// Read-only score: only realized P/L and its recorded return affect spectacle.
const clamp=n=>Math.max(0,Math.min(1,n));
export function recapPresentation(snapshot){
 const profit=Number.isFinite(snapshot.primary?.profit)?snapshot.primary.profit:0;
 const rate=Math.abs(Number.isFinite(snapshot.primary?.returnRate)?snapshot.primary.returnRate:0),amount=Math.abs(profit);
 const weight=Math.max(clamp(rate/.5),clamp(Math.log10(1+amount/1000)/3));
 const rank=profit===0?0:rate>=.2||amount>=100000?3:rate>=.05||amount>=10000?2:1;
 const tier=['flat','small','medium','large'][rank],direction=profit>0?'profit':profit<0?'loss':'flat';
 const intensity=rank?Math.min(1,[0,.16,.38,.7][rank]+weight*.3):0;
 const duration=[3000,7600,12800,19200][rank],countDuration=duration-[400,900,1600,2600][rank],beats=[0,8,16,26][rank];
 const amountTier=amount>=20000000?'twenty-million':amount>=100000?'hundred-thousand':amount>=1000?'thousand':'small';
 // Two held beats, then a fast final run and an anticipation pause before impact.
 const stops=[[0,0],[.09,.015],[.34,.33],[.41,.33],[.69,.76],[.77,.76],[.93,.96],[.98,.96],[1,1]];
 const beatTimes=Array.from({length:beats},(_,i)=>Math.round((countDuration-320)*(.1+.9*((i+1)/beats)**.7)));
 return{amountTier,tier,rank,direction,duration,countDuration,beats,beatTimes,stops,intensity,particles:direction==='profit'?[0,8,26,64][rank]:0,shards:direction==='loss'?[0,0,7,15][rank]:0,shake:rank===3?Math.round((direction==='loss'?19:10)*intensity):rank===2?5:1};
}
export function recapProgress(presentation,elapsed){
 const t=clamp(elapsed/presentation.countDuration),stops=presentation.stops;
 for(let i=1;i<stops.length;i++){const [end,to]=stops[i],[start,from]=stops[i-1];if(t<=end){const p=(t-start)/(end-start);return from+(to-from)*(1-(1-p)**2);}}
 return 1;
}
export function recapBeatCue(presentation,index,{final=false}={}){
 const fraction=presentation.beats?Math.min(1,(index+1)/presentation.beats):0;
 return{kind:final?(presentation.rank===3?`outcome-${presentation.direction}`:presentation.direction==='profit'?'terminal-fill':'terminal-close'):'terminal-tap',rate:presentation.direction==='loss'?1.2-.4*fraction:.78+.47*fraction,level:final?.45+presentation.rank*.12:.15+fraction*(.2+presentation.rank*.09)};
}
