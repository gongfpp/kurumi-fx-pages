import {LIFE_SCENE_DIALOGUE_SOURCES} from './life-scene-dialogue-sources.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';
// Append-only receipt dialogue sources. Existing source IDs, scope and exact text
// are a save-format contract, independent of the current action selector.
// These two legacy snapshots intentionally preserve the original v17 bytes.
const source=(category,optionId,sourceId,origin,lines)=>Object.freeze({category,optionId,dialogue:Object.freeze({sourceId,origin,lines:Object.freeze(lines.map(([from,text])=>Object.freeze({from,text})))})});
export const LIFE_ACTION_DIALOGUE_SOURCES=Object.freeze([
 source("friend","mochiko","O-F-TALK-01","existing-game-dialogue",[["久留美","我想找一份坐着就能发财的工作。"],["萌智子","售票窗口也能坐。"],["久留美","我说的是发财，不是找零。"],["萌智子","那你先把“工作”两个字划掉。"],["久留美","不要，这样听起来比较有志气。"]]),
 source("friend","yasuko","O-C-HIDE-02","existing-game-dialogue",[["久留美","今天我先当个省话的人。"],["安子","行，那我少问两句。"],["久留美","但不是不能理我。"]]),
 ...LIFE_SCENE_DIALOGUE_SOURCES,
]);
// No fallback to today's selector or untrusted save text for an unknown identity.
export function lifeActionDialogueForSource(option,sourceId){
 const row=LIFE_ACTION_DIALOGUE_SOURCES.find(row=>row.category===option?.category&&row.optionId===option?.id&&row.dialogue.sourceId===sourceId);
 return row?structuredClone(row.dialogue):null;
}
export function validLifeActionDialogue(option,dialogue){
 // Null was the exact legacy payload for these options; keep it valid forever.
 if(dialogue===null)return ['dinner','work','relax'].includes(option.category);
 const expected=lifeActionDialogueForSource(option,dialogue?.sourceId);
 return expected!==null&&JSON.stringify(dialogue)===JSON.stringify(expected);
}
