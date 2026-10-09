import {settlementPresentation} from './settlement-stage.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

const FATHER_EVENTS=Object.freeze({fatherUnlock:'father-discovery',fatherDiscover:'father-discovery',fatherFound:'father-crisis',repayPartial:'father-relief',repayFull:'father-relief'});
const SOUND=Object.freeze({'father-crisis':['terminal-risk',.16],'father-discovery':['terminal-tap',.14],'father-relief':['terminal-fill',.16],'living-pressure':['terminal-close',.18],'living-relief':['terminal-fill',.14]});
// This is presentation-only. Never infer a payment or advance a story for audio.
// The cabinet is a simultaneous three-panel page: use its opening cue, rather
// than racing three recordings while no actual panel transition has occurred.
export function narrativeAudioContext(state,{dayOpen=false,livingVisible=false,propOpen=false,propKind=null}={}){
 const run=state.runId||state.seed||0;
 if(propOpen&&propKind==='father'&&state.fatherUsed)return{cue:'father-relief',key:`${run}:father-taken`,fresh:true};
 const stage=settlementPresentation(state),n=state.settlementNarrative;
 if(state.mode!=='story'||!dayOpen||stage?.stage!=='story'||n?.day!==state.day)return null;
 const settlement=state.dayReport?.livingSettlement,receipt=settlement?.receipt;
 if(livingVisible&&settlement?.status!=='pending'&&receipt?.day===state.day){
  const cue=receipt.amount>0?'living-pressure':receipt.kind==='friend-treat'?'living-relief':null;
  return cue?{cue,key:`${run}:${receipt.id}:sound`,fresh:!receipt.legacy}:null;
 }
 const cue=n.fatherFrames?.[0]?.audioCue||FATHER_EVENTS[n.event?.key];
 return cue&&SOUND[cue]?{cue,key:`${stage.id}:${n.event?.key||'father-cabinet'}`,fresh:!n.effectsApplied}:null;
}
export function createNarrativeCueGate({play}){
 const seen=new Set();
 return {emit(context,{fresh=context?.fresh}={}){
  if(!context?.key||!SOUND[context.cue]||seen.has(context.key))return false;
  // Mark muted/quiet/restored scenes too. Turning sound on later never bursts
  // into a stale cue; only a genuinely new presentation can make a sound.
  seen.add(context.key);if(!fresh)return false;
  const [kind,level]=SOUND[context.cue];play(kind,{level});return true;
 }};
}
