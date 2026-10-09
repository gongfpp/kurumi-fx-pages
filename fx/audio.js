import {TERMINAL_SOUND_CUES} from './terminal-cues.js?v=877675b645f0124cb91b0289bd3aed82e848654c-23f2a20b7717';
import {scheduleAudioTimeline} from './audio-timeline.js?v=877675b645f0124cb91b0289bd3aed82e848654c-23f2a20b7717';
import {AudioEnvelope,getSafeAudioContext,connectScheduledAudio} from './audio-envelope.js?v=877675b645f0124cb91b0289bd3aed82e848654c-23f2a20b7717';
import {assetURL} from './assets.js?v=877675b645f0124cb91b0289bd3aed82e848654c-23f2a20b7717';

function volume(value,fallback){return Number.isFinite(Number(value))?Math.max(0,Math.min(1,Number(value))):fallback;}

// Original, gently enveloped electronic cues inspired by the anime's trading
// terminal scenes. These are not extracted anime recordings; see sfx/SOURCES.json.
export const FX_SOUND_FILES=Object.freeze({click:'terminal-tap',gain:'profit-notice',loss:'risk-notice',draw:'news-notice',win:'success-notice',defend:'order-confirm',exhaust:'order-close',rattle:'quote-tick',play:'order-confirm',unlock:'success-notice',power:'order-confirm',dividend:'profit-notice',upgrade:'success-notice'});
const COOLDOWN={click:100,gain:350,loss:950,draw:650,win:900,defend:250,exhaust:250};

export class FXAudio{
 constructor({createAudio=()=>document.createElement('audio'),hidden=()=>document.hidden,onError=()=>{},now=()=>performance.now()}={}){
  this.envelope=new AudioEnvelope({now});this.createAudio=createAudio;this.hidden=hidden;this.onError=onError;this.now=now;this.pool=new Map();this.unlocked=false;this.prefs={sound:false};this.reported=new Set();this.lastPlayed=new Map();this.lastAny=-Infinity;this.timelines=new Set();this.buffers=new Map();this.visibility=()=>this.sync();globalThis.document?.addEventListener('visibilitychange',this.visibility);
 }
 make(file,label){
  const a=this.createAudio();a.src=assetURL(`./sfx/${file}.mp3`);a.preload='none';a.dataset.audio=`fx-${label}`;a.hidden=true;
  if(typeof document!=='undefined')document.body.append(a);
  a.addEventListener('error',()=>this.report(label));return a;
 }
 report(label){if(!this.reported.has(label)){this.reported.add(label);this.onError(label);}}
 configure(prefs){this.prefs={...this.prefs,...prefs};this.sync();if(!this.prefs.sound)this.stopEffects();}
 unlock(){this.unlocked=true;this.preloadTimeline();}
 preloadTimeline(){if(getSafeAudioContext())for(const kind of ['terminal-tap','terminal-fill','terminal-close','outcome-profit','outcome-loss'])void this.loadBuffer(kind).catch(()=>{});}
 loadBuffer(kind){const spec=TERMINAL_SOUND_CUES[kind];if(!spec)return Promise.reject(new Error('Unknown sample'));const file=spec.file;if(!this.buffers.has(file)){const context=getSafeAudioContext();const pending=fetch(assetURL(`./sfx/${file}.mp3`)).then(r=>{if(!r.ok)throw new Error('Sample unavailable');return r.arrayBuffer();}).then(bytes=>context.decodeAudioData(bytes));this.buffers.set(file,pending);pending.catch(()=>this.buffers.delete(file));}return this.buffers.get(file);}
 scheduleTimeline(cues,{startedAt=this.now(),onTrace=()=>{}}={}){
  if(!this.unlocked||!this.prefs.sound||this.hidden())return {cancel(){},ready:Promise.resolve(),receipts:[]};
  for(const previous of [...this.timelines])previous.cancel();
  const handle=scheduleAudioTimeline(cues,{context:getSafeAudioContext(),load:kind=>this.loadBuffer(kind),connect:entry=>connectScheduledAudio(entry,assetURL(`./sfx/${TERMINAL_SOUND_CUES[entry.cue.kind].file}.mp3`)),startedAt,now:this.now,hidden:this.hidden,allowed:()=>this.unlocked&&this.prefs.sound,level:volume(this.prefs.soundVolume,.5),fallback:cue=>this.effect(cue.kind,cue),onTrace});
  this.timelines.add(handle);const cancel=handle.cancel.bind(handle);handle.cancel=()=>{cancel();this.timelines.delete(handle);};return handle;
 }
 sync(){if(this.hidden())this.stopEffects();}
 effect(kind,{rate=1,stretch=false,level=1,preview=false}={}){
  // Continuous prices stay quiet. quote-tick exists only for explicit audition.
  if(!this.unlocked||!this.prefs.sound||this.hidden()||(kind==='rattle'&&!preview))return false;
  const amplitude=volume(this.prefs.soundVolume,.5)*volume(level,1);if(amplitude===0)return false;
  const spec=TERMINAL_SOUND_CUES[kind];
  const file=spec?.file||FX_SOUND_FILES[kind]||FX_SOUND_FILES.click,label=spec||FX_SOUND_FILES[kind]?kind:'click',time=this.now();
  if(time-(this.lastPlayed.get(file)??-Infinity)<(spec?.cooldownMs??COOLDOWN[label]??350)||time-this.lastAny<65)return false;
  let voices=this.pool.get(file);if(!voices){voices=[this.make(file,label),this.make(file,label)];this.pool.set(file,voices);}
  const a=voices.find(x=>x.paused||x.ended);if(!a)return false;
  // At most two short cues overlap, even when news and settlement arrive together.
  const active=[...this.pool.values()].flat().filter(x=>!x.paused&&!x.ended);
  if(active.length>=2)return false;
  this.lastPlayed.set(file,time);this.lastAny=time;a.currentTime=0;
  const envelope=this.envelope.prepare(a,{target:amplitude,leadInSeconds:spec?0:.04,coldMs:spec?8:180,warmMs:spec?8:75,tailMs:spec?20:120});
  a.playbackRate=Math.max(.8,Math.min(1.25,Number.isFinite(rate)?rate:1));a.preservesPitch=stretch;a.webkitPreservesPitch=stretch;
  try{const playing=a.play();if(playing?.then)playing.then(()=>this.envelope.start(a,envelope)).catch(error=>{if(this.envelope.records.get(a)!==envelope)return;this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);});else this.envelope.start(a,envelope);}
  catch(error){this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);return false;}
  return true;
 }
 stopEffects(){for(const timeline of [...this.timelines])timeline.cancel();for(const voices of this.pool.values())for(const a of voices){this.envelope.stop(a);a.pause();}}
 pause(){this.stopEffects();}
 dispose(){this.stopEffects();globalThis.document?.removeEventListener('visibilitychange',this.visibility);for(const voices of this.pool.values())for(const a of voices){this.envelope.dispose(a);a.remove?.();}this.pool.clear();this.buffers.clear();}
}
