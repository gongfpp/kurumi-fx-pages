import {currentLifeSceneReceipt} from './life-scene-consumer.js?v=090ee9cd35db29dce3353f8689f43d8787bd7476-23f2a20b7717';
import {validLifeActions} from './life-actions.js?v=090ee9cd35db29dce3353f8689f43d8787bd7476-23f2a20b7717';
import {DINNER_OPTIONS} from './recap-choices.js?v=090ee9cd35db29dce3353f8689f43d8787bd7476-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=090ee9cd35db29dce3353f8689f43d8787bd7476-23f2a20b7717';
const dinnerReceipt=state=>Array.isArray(state?.recapChoiceLedger)?state.recapChoiceLedger.findLast(row=>row?.day===state.day&&DINNER_OPTIONS.some(option=>option.id===row.id)):null;
const dayKey=state=>state?`${state.runId||state.seed}:${state.day}`:null;
// Only this paid choice and its explicit daily fallback use the meal gate.
// Higher-priority family scenes keep their existing multi-frame read contract.
const paidDinnerScene=(scene,receipt)=>!scene||scene.receipt?.id===receipt?.id&&scene.receipt?.day===receipt?.day||scene.arcIdentity===`daily-fallback:${scene.id}`;
// Bind the actual paid meal and its paired debit, including legacy recap-only
// saves. A scene image alone cannot certify a charge or advance a durable day.
function dinnerBinding(state){
 const receipt=dinnerReceipt(state),option=DINNER_OPTIONS.find(row=>row.id===receipt?.id),outcome=sealedDailyMangaOutcome(state);
 if(state?.mode!=='story'||!receipt||!option||!outcome||outcome.net<option.minGain||receipt.cost!==option.cost||!Number.isFinite(receipt.timestamp))return null;
 const debit=state.consumptionLedger?.find(row=>row.id===`activity:${state.day}:${receipt.id}`&&row.kind==='activity'&&row.day===state.day&&row.amount===receipt.cost&&row.timestamp===receipt.timestamp);
 if(!debit)return null;
 return JSON.stringify({dayKey:dayKey(state),net:outcome.net,receipt,debit,lifeReceipt:currentLifeSceneReceipt(state)});
}
// Rendering may proceed while a game save is pending. New life/paid-dinner
// locks and read acknowledgements become durable only with that exact receipt.
// No storage schema or historical lock/read record is rewritten.
export function createLifeSceneMemory({memory,getState,getContext,getSavedState,isBlocked=()=>false}){
 const records=new Map();
 const current=entry=>!isBlocked()&&entry.context===getContext()&&entry.dayKey===dayKey(getState())&&
  (entry.kind==='dinner'?entry.binding===dinnerBinding(getState()):entry.scene.day===getState()?.day&&JSON.stringify(currentLifeSceneReceipt(getState()))===entry.binding);
 const durable=entry=>{try{const saved=getSavedState();return entry.kind==='dinner'?entry.binding===dinnerBinding(saved):validLifeActions(saved)&&saved.lifeActions?.receipts?.some(r=>r.id===entry.scene.receiptKey&&JSON.stringify(r)===entry.binding);}catch{return false;}};
 const prune=()=>{for(const [key,entry] of records)if(!current(entry))records.delete(key);};
 const bind=(key,scene,kind='life',binding=scene?.receiptBinding)=>{let entry=records.get(key);if(!entry||entry.kind!==kind||entry.scene?.identity!==scene?.identity||entry.binding!==binding||entry.context!==getContext()){
  entry={scene,dayKey:key,kind,binding,context:getContext(),seen:new Set()};records.set(key,entry);
 }return entry;};
 const commit=entry=>{
  if(!current(entry)||!durable(entry))return false;
  // pick preserves every pre-existing lock, including an explicit null.
  if(entry.scene?.receiptDialogue&&memory.day(entry.dayKey).locked&&memory.day(entry.dayKey).identity!==entry.scene.identity)return entry.seen.size?memory.seen([...entry.seen]):true;
  const chosen=memory.pick(entry.dayKey,entry.scene?[entry.scene]:[]);
  if((chosen?.identity||null)!==(entry.scene?.identity||null))return false;
  return entry.seen.size?memory.seen([...entry.seen]):true;
 };
 const has=id=>memory.has(id)||[...records.values()].some(entry=>current(entry)&&entry.seen.has(id));
 const reading=entry=>({has,seen(ids){
  if(!current(entry))return false;
  const allowed=new Set([entry.scene?.identity,entry.scene?.arcIdentity].filter(Boolean));for(const id of ids)if(allowed.has(id))entry.seen.add(id);
  return commit(entry);
 }});
 const wrapper={
  has,seen:ids=>memory.seen(ids),day:key=>memory.day(key),
  peek(key,candidates){
   prune();if(memory.day(key).locked)return memory.peek(key,candidates);
   const pending=records.get(key);return pending?candidates.find(c=>c.identity===pending.scene?.identity&&(pending.kind==='dinner'||c.receiptBinding===pending.binding))||null:memory.peek(key,candidates);
  },
  pick(key,candidates){
   const selected=wrapper.peek(key,candidates),state=getState();
   if(dinnerReceipt(state)&&paidDinnerScene(selected,dinnerReceipt(state))){
    const binding=dinnerBinding(state);if(!binding||key!==dayKey(state))return null;
    const entry=bind(key,selected,'dinner',binding);if(!current(entry))return null;
    // This also stages exhausted null days and honest post-dinner fallback art.
    if(durable(entry))commit(entry);return selected;
   }
   if(!selected?.lifeScene)return memory.day(key).locked||!records.has(key)?memory.pick(key,candidates):null;
   const entry=bind(key,selected);if(!current(entry))return null;
   if(durable(entry)){const chosen=memory.pick(key,candidates);return chosen?.identity===selected.identity?chosen:null;}
   return selected;
  },
  forSelection(scene){
   if(scene?.lifeScene)return reading(bind(scene.dayKey,scene));
   if(dinnerReceipt(getState())&&paidDinnerScene(scene,dinnerReceipt(getState()))){
    const entry=records.get(dayKey(getState()));
    return entry?.kind==='dinner'&&entry.scene?.identity===scene?.identity?reading(entry):{has,seen:()=>false};
   }
   return memory;
  },
  confirm(){prune();for(const entry of records.values())commit(entry);}
 };
 return wrapper;
}
