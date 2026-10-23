import {voiceMixActive} from './bgm-scenes.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
// Production dialogue mix: leave the player's normal music preference intact.
// The quietest retained clip needs more headroom at the maximum music volume.
export const GAMEPLAY_BGM_DUCK_FACTOR=.1;

// One lifecycle and native-audition gate for the existing players. This does
// not change mute preferences, volumes, tracks or explicit voice-play intent.
export function bindAudioControl({effects,voice,bgm,document=globalThis.document,page=globalThis.window,blocked=()=>false}={}){
 let pageActive=true,disposed=false;
 const suspended=()=>disposed||!pageActive||Boolean(document?.hidden)||blocked();
 const auditions=()=>Array.from(document?.querySelectorAll?.('audio[data-voice-id]')||[]);
 const syncVoiceDuck=()=>bgm.setVoiceActive(!suspended()&&voiceMixActive(voice,auditions()));
 const pauseAuditions=(except=null)=>{for(const media of auditions())if(media!==except)media.pause();};
 const silence=()=>{effects.pause();voice.stop({fadeMs:0});pauseAuditions();syncVoiceDuck();};
 const sync=()=>{
  const hidden=suspended();
  // Hide BGM first so pausing native voices cannot briefly restore its volume.
  bgm.setHidden(hidden);
  if(hidden)silence();else{effects.sync();syncVoiceDuck();}
 };
 const hide=()=>{pageActive=false;sync();},show=()=>{pageActive=true;sync();};
 const playback=event=>{
  const media=event.target;if(!media?.matches?.('audio[data-voice-id]'))return;
  if(event.type==='play'){
   const owner=media.closest?.('dialog');
   // Late native play events may arrive after pause/pagehide or dialog close.
   if(suspended()||media.isConnected===false||owner&&!owner.open){media.pause();syncVoiceDuck();return;}
   voice.stop();pauseAuditions(media);
  }
  syncVoiceDuck();
 };
 const events=['play','pause','ended','error'];
 for(const type of events)document?.addEventListener(type,playback,true);
 document?.addEventListener('kurumi-voice-audition-change',syncVoiceDuck);
 document?.addEventListener('visibilitychange',sync);
 page?.addEventListener('pagehide',hide);page?.addEventListener('pageshow',show);sync();
 return {sync,syncVoiceDuck,pauseAuditions,stopTransient:silence,get suspended(){return suspended();},dispose(){
  if(disposed)return;disposed=true;
  for(const type of events)document?.removeEventListener(type,playback,true);
  document?.removeEventListener('kurumi-voice-audition-change',syncVoiceDuck);document?.removeEventListener('visibilitychange',sync);
  page?.removeEventListener('pagehide',hide);page?.removeEventListener('pageshow',show);bgm.setHidden(true);silence();
 }};
}
