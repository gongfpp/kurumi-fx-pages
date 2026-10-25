import {AI_SCENE_SOURCES} from './ai-scene-source-identities.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {storageKey} from './storage-namespace.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
export {AI_SCENE_SOURCES};
export const AI_SCENE_PREFERENCE_KEY='fx-ai-scene-characters-v1';
const byPath=new Map(AI_SCENE_SOURCES.map(source=>[source.path,source]));
const originalKinds=new Set(['original-manga','original-anime-frame']);
// An exact registry identity plus its caller's role is required. Neither an
// "original-fan-art" label nor a directory name establishes AI provenance.
export function aiSceneVisibility(asset,{usage,showAiSceneCharacters=true}={}){
 const show=reason=>({visible:true,hideWholeNode:false,reason});
 if(usage!=='scene-character')return show('outside-scene-character');
 if(showAiSceneCharacters!==false)return show('preference-show');
 if(originalKinds.has(asset?.kind)||originalKinds.has(asset?.source?.kind))return show('original');
 const source=byPath.get(typeof asset==='string'?asset:asset?.path);
 if(!source||[asset?.sha256,asset?.source?.sha256].some(hash=>hash&&hash!==source.sha256))return show('unverified-source');
 return {visible:false,hideWholeNode:true,reason:'ai-scene-character'};
}
export function createAiScenePreference({storage,eventTarget=globalThis.window}={}){
 let value=true,disposed=false;const subscribers=new Set();
 try{value=storage?.getItem(AI_SCENE_PREFERENCE_KEY)!=='hide';}catch{}
 const emit=()=>{for(const fn of subscribers)fn(value);};
 const change=event=>{
  if(disposed||event.key!==storageKey(AI_SCENE_PREFERENCE_KEY))return;
  // A failed local write is this page's choice until the user changes it.
  if(localOnly)return;
  let next=true;try{next=storage?.getItem(AI_SCENE_PREFERENCE_KEY)!=='hide';}catch{return;}
  if(next!==value){value=next;emit();}
 };
 let localOnly=false;eventTarget?.addEventListener?.('storage',change);
 return {get:()=>value,set(next){
  if(disposed)return false;value=next!==false;let saved=false;
  try{saved=!!storage&&storage.setItem(AI_SCENE_PREFERENCE_KEY,value?'show':'hide')!==false;}catch{}
  localOnly=!saved;emit();return saved;
 },subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn);},dispose(){disposed=true;subscribers.clear();eventTarget?.removeEventListener?.('storage',change);}};
}
let currentPreference={get:()=>true,subscribe:()=>()=>{}};
const bindings=new WeakMap(),groups=new WeakMap();
const paint=binding=>{
 const node=binding.node.deref();if(!node)return false;
 const policy=aiSceneVisibility(binding.identity.asset,{usage:binding.identity.usage,showAiSceneCharacters:binding.preference.get()});
 if(policy.visible)delete node.dataset.aiSceneHidden;else node.dataset.aiSceneHidden='true';
 return true;
};
function groupFor(preference){
 let group=groups.get(preference);if(group)return group;
 group=new Set();groups.set(preference,group);preference.subscribe(()=>{for(const binding of group)if(!paint(binding))group.delete(binding);});return group;
}
// Attribute-only updates leave src, loading/error handlers, scene selection and
// observers intact. Weak node references do not retain closed/replaced scenes.
export function applyAiSceneVisibility(node,identity,preference=currentPreference){
 if(!node?.dataset)return;
 const previous=bindings.get(node);if(previous)groups.get(previous.preference)?.delete(previous);
 const binding={node:new WeakRef(node),identity,preference};bindings.set(node,binding);groupFor(preference).add(binding);paint(binding);
}
export function configureAiSceneVisibility(preference){
 const previous=currentPreference;currentPreference=preference;
 return()=>{if(currentPreference===preference)currentPreference=previous;};
}
