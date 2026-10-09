import {buildRecapTimeline,recapTimelineFrame} from './recap-timeline.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {recapSegments} from './daily-recap.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {recapPresentation,recapBeatCue,recapProgress} from './recap-presentation.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
// Cancellable, repeatable presentation. No game state, save or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},onTimeline,enabled=true,reducedMotion=false,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const segments=recapSegments(snapshot),presentation=recapPresentation(snapshot),duration=enabled&&!reducedMotion?presentation.duration:0;
 const tradingTimeline=buildRecapTimeline(snapshot,presentation);
 let frame=null,stopped=false,lastBeat=-1,finalCued=false,started=now();
 const cues=Object.freeze(presentation.beatTimes.map((atMs,beat)=>Object.freeze({...recapBeatCue(presentation,beat),atMs,beat,final:false})).concat(presentation.direction==='flat'?[]:[Object.freeze({...recapBeatCue(presentation,presentation.beats-1,{final:true}),atMs:presentation.countDuration,beat:presentation.beats-1,final:true})]).concat(tradingTimeline.events.map((e,i)=>Object.freeze({kind:e.type==='open'?'terminal-tap':e.delta<0?'terminal-close':'terminal-fill',atMs:e.atMs,rate:.8+.6*(i+1)/Math.max(1,tradingTimeline.events.length),level:.25+presentation.rank*.1,beat:i,trade:true,final:false}))).sort((a,b)=>a.atMs-b.atMs));
 const timeline=duration&&typeof onTimeline==='function'?onTimeline(cues,{startedAt:started}):null;
 const draw=(elapsed,{silent=false}={})=>{
  const counting=duration?Math.min(1,Math.max(0,elapsed/presentation.countDuration)):1,progress=duration?recapProgress(presentation,elapsed):1,index=progress===0?0:progress<1?1:segments.length-1,segment=segments[index];
  const beat=duration?presentation.beatTimes.filter(t=>t<=elapsed).length-1:-1,complete=!duration||elapsed>=duration,stage=complete?'complete':counting>=1?'landing':counting>=.93?'anticipation':counting<.09?'opening':'counting';
  const replay=recapTimelineFrame(tradingTimeline,elapsed,{complete});
  render({progress,segment,index,...replay,reconciliation:tradingTimeline.residual,value:snapshot.daily.openingNominal+replay.realized,intensity:presentation.intensity,complete,candleCount:snapshot.candles.filter(c=>c.timestamp<=replay.timestamp).length,stage,beat,presentation});
  if(!silent&&!timeline&&duration&&counting<1&&beat>lastBeat){lastBeat=beat;if(elapsed-presentation.beatTimes[beat]<=65)onCue({...recapBeatCue(presentation,beat),segment,intensity:presentation.intensity,beat,final:false});}
  if(!silent&&!timeline&&duration&&counting===1&&!finalCued&&presentation.direction!=='flat'){finalCued=true;onCue({...recapBeatCue(presentation,presentation.beats-1,{final:true}),segment,intensity:presentation.intensity,beat,final:true});}
 };
 const tick=time=>{frame=null;if(stopped)return;const elapsed=Math.max(0,time-started);draw(elapsed);if(elapsed<duration)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;timeline?.cancel?.();if(frame!==null){cancelFrame(frame);frame=null;}};
 const finish=()=>{cancel();draw(duration,{silent:true});};
 if(duration){draw(0);frame=requestFrame(tick);}else draw(0,{silent:true});
 return{cancel,finish,duration,snapshot,presentation,cues,tradingTimeline};
}
