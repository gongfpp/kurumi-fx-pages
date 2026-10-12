import {currentLifeSceneReceipt} from './life-scene-consumer.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
import {validLifeActions} from './life-actions.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
// Only new life-scene locks/read acknowledgements are staged. Rendering never
// waits for disk. A failed game save cannot permanently consume its unsaved
// action's picture or poison that run/day's durable single-scene slot.
export function createLifeSceneMemory({memory,getState,getContext,getSavedState,isBlocked=()=>false}){
 const records=new Map();
 const current=entry=>!isBlocked()&&entry.context===getContext()&&entry.scene.day===getState()?.day&&JSON.stringify(currentLifeSceneReceipt(getState()))===entry.scene.receiptBinding;
 const durable=entry=>{try{const saved=getSavedState();return validLifeActions(saved)&&saved.lifeActions?.receipts?.some(r=>r.id===entry.scene.receiptKey&&JSON.stringify(r)===entry.scene.receiptBinding);}catch{return false;}};
 const prune=()=>{for(const [key,entry] of records)if(!current(entry))records.delete(key);};
 const bind=(dayKey,scene)=>{let entry=records.get(dayKey);if(!entry||entry.scene.identity!==scene.identity||entry.scene.receiptBinding!==scene.receiptBinding||entry.context!==getContext()){
  entry={scene,dayKey,context:getContext(),seen:new Set()};records.set(dayKey,entry);
 }return entry;};
 const commit=entry=>{
  if(!current(entry)||!durable(entry))return false;
  // pick preserves every pre-existing lock, including an explicit null.
  if(entry.scene.receiptDialogue&&memory.day(entry.dayKey).locked&&memory.day(entry.dayKey).identity!==entry.scene.identity)return entry.seen.size?memory.seen([...entry.seen]):true;
  const chosen=memory.pick(entry.dayKey,[entry.scene]);
  if(chosen?.identity!==entry.scene.identity)return false;
  return entry.seen.size?memory.seen([...entry.seen]):true;
 };
 const has=id=>memory.has(id)||[...records.values()].some(entry=>current(entry)&&entry.seen.has(id));
 const wrapper={
  has,seen:ids=>memory.seen(ids),day:key=>memory.day(key),
  peek(dayKey,candidates){
   prune();if(memory.day(dayKey).locked)return memory.peek(dayKey,candidates);
   const pending=records.get(dayKey);return pending?candidates.find(c=>c.identity===pending.scene.identity&&c.receiptBinding===pending.scene.receiptBinding)||null:memory.peek(dayKey,candidates);
  },
  pick(dayKey,candidates){
   const selected=wrapper.peek(dayKey,candidates);
   if(!selected?.lifeScene)return memory.day(dayKey).locked||!records.has(dayKey)?memory.pick(dayKey,candidates):null;
   const entry=bind(dayKey,selected);if(!current(entry))return null;
   if(durable(entry)){const chosen=memory.pick(dayKey,candidates);return chosen?.identity===selected.identity?chosen:null;}
   return selected;
  },
  forSelection(scene){
   if(!scene?.lifeScene)return memory;
   const entry=bind(scene.dayKey,scene);
   return {has,seen(ids){
    if(!current(entry))return false;
    const allowed=new Set([scene.identity,scene.arcIdentity]);for(const id of ids)if(allowed.has(id))entry.seen.add(id);
    return commit(entry);
   }};
  },
  confirm(){prune();for(const entry of records.values())commit(entry);}
 };
 return wrapper;
}
