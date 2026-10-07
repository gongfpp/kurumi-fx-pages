import {recapSegments,recapIntensity} from './daily-recap.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
// A cancellable presentation clock; it has no game state or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},enabled=true,reducedMotion=false,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const segments=recapSegments(snapshot),intensity=recapIntensity(snapshot),duration=enabled&&!reducedMotion?Math.min(7200,2800+intensity*4400):0;
 let frame=null,stopped=false,lastSegment=-1,started=now();
 const draw=progress=>{const position=progress*(segments.length-1),index=Math.min(segments.length-1,Math.floor(position)),segment=segments[index],local=progress===1?1:position-index,eased=1-(1-local)**3;
  render({progress,segment,index,value:segment.from+(segment.to-segment.from)*eased,intensity,complete:progress===1,candleCount:Math.ceil(progress*snapshot.candles.length)});
  if(index!==lastSegment){lastSegment=index;if(duration&&index>0)onCue({segment,intensity,rate:.9+index*.08});}
 };
 const tick=time=>{frame=null;if(stopped)return;const progress=duration?Math.min(1,Math.max(0,(time-started)/duration)):1;draw(progress);if(progress<1)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;if(frame!==null){cancelFrame(frame);frame=null;}};
 const finish=()=>{cancel();draw(1);};
 if(duration){draw(0);frame=requestFrame(tick);}else draw(1);
 return{cancel,finish,duration,snapshot};
}
