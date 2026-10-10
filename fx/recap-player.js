import {recapImpact,boundedRecapCues} from './recap-impact.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
import {buildRecapTimeline,recapTimelineFrame} from './recap-timeline.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
import {recapSegments} from './daily-recap.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
import {recapPresentation,recapBeatCue,recapProgress} from './recap-presentation.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
// Cancellable, repeatable presentation. No game state, save or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},onTimeline,enabled=true,reducedMotion=false,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const segments=recapSegments(snapshot),presentation=recapPresentation(snapshot),duration=enabled&&!reducedMotion?presentation.duration:0;
 const tradingTimeline=buildRecapTimeline(snapshot,presentation);
 let frame=null,stopped=false,finalCued=false,started=now();
 const cues=boundedRecapCues(tradingTimeline.scoreBeats.map(b=>Object.freeze({kind:b.step===b.count-1?(b.delta<0?'terminal-close':'terminal-fill'):(b.delta<0?'recap-fall':'recap-rise'),atMs:b.atMs,rate:b.delta<0?1.12-.38*b.strength:.7+.55*b.strength,level:recapImpact(presentation,b).level,beat:b.index,trade:true,final:false})).concat(tradingTimeline.assetBeats.map(b=>Object.freeze({kind:b.delta<0?'recap-fall':'recap-rise',atMs:b.atMs,rate:b.delta<0?1.05-.22*b.strength:.85+.4*b.strength,level:recapImpact(presentation,b).level,assetBeat:b.index,asset:true,final:false}))).concat(tradingTimeline.events.filter(e=>!e.delta).map(e=>Object.freeze({kind:'terminal-tap',atMs:e.atMs+Math.min(80,e.hold/2),rate:.85,level:.25,trade:true,final:false}))).concat(presentation.direction==='flat'?[]:[Object.freeze({...recapBeatCue(presentation,presentation.beats-1,{final:true}),atMs:presentation.countDuration,beat:presentation.beats-1,final:true})]).sort((a,b)=>a.atMs-b.atMs));
 let lastCue=-1;
 const timeline=duration&&typeof onTimeline==='function'?onTimeline(cues,{startedAt:started}):null;
 const draw=(elapsed,{silent=false}={})=>{
  const counting=duration?Math.min(1,Math.max(0,elapsed/presentation.countDuration)):1,progress=duration?recapProgress(presentation,elapsed):1,index=progress===0?0:progress<1?1:segments.length-1,segment=segments[index];
  const beat=duration?presentation.beatTimes.filter(t=>t<=elapsed).length-1:-1,complete=!duration||elapsed>=duration,stage=complete?'complete':counting>=1?'landing':counting>=(presentation.catastrophic?.84:.93)?'anticipation':counting<.09?'opening':'counting';
  const replay=recapTimelineFrame(tradingTimeline,elapsed,{complete});
  render({elapsed,progress,segment,index,...replay,reconciliation:tradingTimeline.residual,value:replay.tradingAssets,intensity:presentation.intensity,complete,candleCount:snapshot.candles.filter(c=>c.timestamp<=replay.timestamp).length,stage,beat,presentation});
  if(!silent&&!timeline&&duration){
   for(let i=lastCue+1;i<cues.length&&cues[i].atMs<=elapsed;i++){lastCue=i;if(elapsed-cues[i].atMs<=80||cues[i].final&&!finalCued){onCue({...cues[i],segment,intensity:presentation.intensity});if(cues[i].final)finalCued=true;}}
  }
 };
 const tick=time=>{frame=null;if(stopped)return;const elapsed=Math.max(0,time-started);draw(elapsed);if(elapsed<duration)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;timeline?.cancel?.();if(frame!==null){cancelFrame(frame);frame=null;}};
 const finish=()=>{cancel();draw(duration,{silent:true});};
 if(duration){draw(0);frame=requestFrame(tick);}else draw(0,{silent:true});
 return{cancel,finish,duration,snapshot,presentation,cues,tradingTimeline};
}
