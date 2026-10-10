// Bounded sample score on the audio clock: overdue beats are dropped, never burst.
export function scheduleAudioTimeline(cues,{context,load,connect,startedAt,now=()=>performance.now(),hidden=()=>false,allowed=()=>true,level=.5,fallback=()=>false,schedule=setTimeout,clear=clearTimeout,onTrace=()=>{}}={}) {
 const score=Object.freeze(cues.slice(0,64).map(c=>Object.freeze({...c})).filter((c,i,a)=>Number.isFinite(c.atMs)&&c.atMs>=0&&c.atMs<=30000&&(i===0||c.atMs-a[i-1].atMs>=65)));
 const sources=new Set(),timers=new Set(),fallbackVoices=new Set(),receipts=[];let cancelled=false,cleanupClock=()=>{},wakeClock=null,clockPromise=null,schedulingDone=false;
 const report=(cue,status,extra={})=>{const r=Object.freeze({cue,status,...extra});receipts.push(r);try{onTrace(r);}catch{}};
 const handle={receipts,cancel(){if(cancelled)return;cancelled=true;wakeClock?.(null);cleanupClock();for(const id of timers)clear(id);timers.clear();for(const voice of fallbackVoices)voice.stop();fallbackVoices.clear();for(const entry of [...sources]){try{entry.gain.gain.cancelScheduledValues(context.currentTime);entry.gain.gain.setValueAtTime(0,context.currentTime);entry.source.stop();}catch{}entry.release();}sources.clear();},ready:null};
 const valid=()=>!cancelled&&!hidden()&&allowed(),began=Number.isFinite(startedAt)?startedAt:now();
 if(!context){
  for(const cue of score){const id=schedule(()=>{timers.delete(id);if(!valid())return;const late=now()-began-cue.atMs;if(late>65){report(cue,'dropped-late',{lateMs:late});return;}const voice=fallback(cue);if(voice&&typeof voice.stop==='function')fallbackVoices.add(voice);report(cue,voice?'fallback-play-requested':'fallback-rejected');},Math.max(0,began+cue.atMs-now()));timers.add(id);}
  handle.ready=Promise.resolve(handle);return handle;
 }
 // A suspended device has no usable audio-clock anchor. Keep the original wall
 // deadline, then map only future cues onto one shared clock when it is ready.
 let anchor=context.state==='running'?context.currentTime+(began-now())/1000:null;
 const stateChanged=()=>{if(context.state!=='running'&&sources.size){handle.cancel();return;}anchor=context.state==='running'?context.currentTime+(began-now())/1000:null;if(!valid()||context.state==='closed')wakeClock?.(null);else if(anchor!==null)wakeClock?.(anchor);};
 context.addEventListener?.('statechange',stateChanged);
 cleanupClock=()=>context.removeEventListener?.('statechange',stateChanged);
 const clock=()=>{
  if(!valid()||context.state==='closed')return Promise.resolve(null);
  if(context.state==='running')return Promise.resolve(anchor??(anchor=context.currentTime+(began-now())/1000));
  if(clockPromise)return clockPromise;
  const expires=began+(score.at(-1)?.atMs??0),remaining=expires-now();
  if(remaining<=0)return Promise.resolve(null);
  clockPromise=new Promise(resolve=>{
   const timer=schedule(()=>{timers.delete(timer);wakeClock?.(null);},remaining);timers.add(timer);
   wakeClock=value=>{clear(timer);timers.delete(timer);wakeClock=null;clockPromise=null;resolve(value);};
  });
  return clockPromise;
 };
 handle.ready=Promise.all(score.map(async cue=>{
  try {
   const buffer=await load(cue.kind);if(!valid())return;
   let base=await clock();if(!valid())return;
   while(base!==null&&context.state!=='running'){base=await clock();if(!valid())return;}
   if(base===null){report(cue,'dropped-not-ready');return;}
   const when=base+cue.atMs/1000,late=Math.max(context.currentTime-when,(now()-began-cue.atMs)/1000);
   if(late>0){report(cue,'dropped-late',{lateMs:late*1000});return;}
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;
   const rate=Math.max(.8,Math.min(1.25,Number.isFinite(cue.rate)?cue.rate:1));source.playbackRate.value=rate;
   const duration=buffer.duration/rate,target=Math.min(.65,Math.max(0,level)*Math.max(0,Math.min(1,cue.level??1)));
   gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(target,when+Math.min(.008,duration/4));
   gain.gain.setValueAtTime(target,when+Math.max(duration/2,duration-.02));gain.gain.linearRampToValueAtTime(0,when+duration);
   source.connect(gain);const disconnect=connect({source,gain,cue,when,target,rate});
   let released=false;const entry={source,gain,release(){if(released)return;released=true;disconnect?.();source.disconnect();gain.disconnect();sources.delete(entry);if(schedulingDone&&!sources.size)cleanupClock();}};
   sources.add(entry);source.onended=()=>entry.release();source.start(when);report(cue,'scheduled',{audioTime:when,duration,rate,target});
  } catch(error){if(valid())report(cue,'error',{error:error?.name||'AudioError'});}
 })).then(()=>{schedulingDone=true;if(!sources.size)cleanupClock();return handle;});
 return handle;
}
