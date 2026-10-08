import {recapSegments} from './daily-recap.js?v=8d7e5c345e325247dcd7f03ea1c7375ec7d6edb5-fc3a14bb1c49';
import {recapPresentation,recapBeatCue,recapProgress} from './recap-presentation.js?v=8d7e5c345e325247dcd7f03ea1c7375ec7d6edb5-fc3a14bb1c49';
// Cancellable, repeatable presentation. No game state, save or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},onTimeline,enabled=true,reducedMotion=false,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const segments=recapSegments(snapshot),presentation=recapPresentation(snapshot),duration=enabled&&!reducedMotion?presentation.duration:0;
 let frame=null,stopped=false,lastBeat=-1,finalCued=false,started=now();
 const cues=Object.freeze(presentation.beatTimes.map((atMs,beat)=>Object.freeze({...recapBeatCue(presentation,beat),atMs,beat,final:false})).concat(presentation.direction==='flat'?[]:[Object.freeze({...recapBeatCue(presentation,presentation.beats-1,{final:true}),atMs:presentation.countDuration,beat:presentation.beats-1,final:true})]));
 const timeline=duration&&typeof onTimeline==='function'?onTimeline(cues,{startedAt:started}):null;
 const draw=(elapsed,{silent=false}={})=>{
  const counting=duration?Math.min(1,Math.max(0,elapsed/presentation.countDuration)):1,progress=duration?recapProgress(presentation,elapsed):1,index=progress===0?0:progress<1?1:segments.length-1,segment=segments[index];
  const beat=duration?presentation.beatTimes.filter(t=>t<=elapsed).length-1:-1,complete=!duration||elapsed>=duration,stage=complete?'complete':counting>=1?'landing':counting>=.93?'anticipation':counting<.09?'opening':'counting';
  render({progress,segment,index,value:snapshot.daily.openingNominal+snapshot.daily.tradingNet*progress,intensity:presentation.intensity,complete,candleCount:Math.ceil(progress*snapshot.candles.length),stage,beat,presentation});
  if(!silent&&!timeline&&duration&&counting<1&&beat>lastBeat){lastBeat=beat;if(elapsed-presentation.beatTimes[beat]<=65)onCue({...recapBeatCue(presentation,beat),segment,intensity:presentation.intensity,beat,final:false});}
  if(!silent&&!timeline&&duration&&counting===1&&!finalCued&&presentation.direction!=='flat'){finalCued=true;onCue({...recapBeatCue(presentation,presentation.beats-1,{final:true}),segment,intensity:presentation.intensity,beat,final:true});}
 };
 const tick=time=>{frame=null;if(stopped)return;const elapsed=Math.max(0,time-started);draw(elapsed);if(elapsed<duration)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;timeline?.cancel?.();if(frame!==null){cancelFrame(frame);frame=null;}};
 const finish=()=>{cancel();draw(duration,{silent:true});};
 if(duration){draw(0);frame=requestFrame(tick);}else draw(0,{silent:true});
 return{cancel,finish,duration,snapshot,presentation,cues};
}
