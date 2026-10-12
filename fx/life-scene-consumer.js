import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {inspectLifeSceneCatalog,lifeSceneMatches} from './life-scene-schema.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {validLifeActions,lifeActionReceipt,lifeFriendKnown,lifeActionRunId} from './life-actions.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {isDailyFamilyNarrative} from './daily-family-art.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {artIdentity} from './daily-art-memory.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
export function currentLifeSceneReceipt(state){
 if(state?.mode!=='story'||state.position||state.positions!==undefined&&!Array.isArray(state.positions)||!sealedDailyMangaOutcome(state)||!validLifeActions(state))return null;
 const receipt=lifeActionReceipt(state);
 return receipt&&receipt.id===`life:${lifeActionRunId(state)}:${state.day}`&&JSON.stringify(receipt)===JSON.stringify(state.dayReport.lifeAction)?receipt:null;
}
export function lifeSceneCandidates(state,narrative,{catalog=LIFE_SCENE_CATALOG,...inspection}={}){
 if(narrative?.day!==undefined&&narrative.day!==state?.day||isDailyFamilyNarrative(narrative)||narrative?.event?.key&&narrative.event.key!=='quietNight'||(state?.recapChoiceLedger||[]).some(r=>r.day===state.day))return [];
 const receipt=currentLifeSceneReceipt(state);if(!receipt||receipt.category==='dinner'||receipt.category==='friend'&&!lifeFriendKnown(state,receipt.optionId))return [];
 const context={day:state.day,outcome:sealedDailyMangaOutcome(state).kind,trauma:tradingTrauma(state).active};
 return inspectLifeSceneCatalog(catalog,inspection).accepted.filter(e=>e.category===receipt.category&&e.optionId===receipt.optionId&&lifeSceneMatches(e,context)&&
  (e.category!=='friend'||e.receiptDialogueSourceId===receipt.dialogue?.sourceId)
 ).map(e=>({id:e.id,title:e.title,ready:true,art:structuredClone(e.art),dialoguePanels:structuredClone(e.dialoguePanels),lines:e.dialoguePanels.flatMap(p=>structuredClone(p.lines)),
  identity:artIdentity(e.art),arcIdentity:e.semanticReadKey,receiptKey:receipt.id,lifeScene:true,receiptBinding:JSON.stringify(receipt),day:state.day,runId:lifeActionRunId(state),dayKey:`${state.runId||state.seed}:${state.day}`}));
}
