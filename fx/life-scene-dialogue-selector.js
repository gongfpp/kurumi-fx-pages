import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {inspectLifeSceneCatalog,lifeSceneMatches} from './life-scene-schema.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {lifeActionDialogueForSource} from './life-action-dialogues.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
// Called only by the existing synchronous commit after the report is sealed.
// The action payload cannot inject a source ID, lines, money or scene catalog.
export function selectLifeSceneDialogue(option,state,{catalog=LIFE_SCENE_CATALOG,dialogueForSource=lifeActionDialogueForSource}={}){
 if(option?.category!=='friend'||state?.mode!=='story'||state.dayReport?.day!==state.day||!Number.isFinite(state.dayReport.net))return null;
 const used=new Set((state.lifeActions?.receipts||[]).map(r=>r.dialogue?.sourceId));
 const net=state.dayReport.net,context={day:state.day,outcome:net<0?'loss':net>0?'profit':'flat',trauma:tradingTrauma(state).active};
 const entry=inspectLifeSceneCatalog(catalog,{dialogueForSource}).accepted.find(e=>e.category===option.category&&e.optionId===option.id&&!used.has(e.receiptDialogueSourceId)&&lifeSceneMatches(e,context));
 return entry?dialogueForSource(option,entry.receiptDialogueSourceId):null;
}
