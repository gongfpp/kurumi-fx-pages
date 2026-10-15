import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
import {lifeActionDialogueForSource} from './life-action-dialogues.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
const options={friend:['mochiko','yasuko'],work:['convenience','cafe','bookstore'],relax:['shrine','river','park']};
const text=value=>typeof value==='string'&&value.trim().length>0;
const strings=value=>Array.isArray(value)&&value.length>0&&value.every(text)&&new Set(value).size===value.length;
const cropValid=(r,a)=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&r[0]>=0&&r[1]>=0&&r[2]>0&&r[3]>0&&r[0]+r[2]<=a.width&&r[1]+r[3]<=a.height;
function valid(entry,dialogueForSource){
 const a=entry?.art;
 if(!entry||entry.approved!==true||entry.enabled===false||!options[entry.category]?.includes(entry.optionId)||
  !new RegExp(`^life-${entry.category}-${entry.optionId}-[0-9]{2}$`).test(entry.id)||!text(entry.dialogueId)||!entry.dialogueId.endsWith(`:${entry.id}`)||entry.semanticReadKey!==`life-scene:${entry.id}`||
  !Number.isSafeInteger(entry.order)||entry.order<0||!text(entry.title)||!Number.isInteger(entry.fromDay)||!Number.isInteger(entry.toDay)||entry.fromDay<1||entry.toDay<entry.fromDay||entry.toDay>50||
  !strings(entry.outcomes)||entry.outcomes.some(x=>!['flat','profit','loss'].includes(x))||!['any','clear','active'].includes(entry.trauma)||
  !strings(entry.characters)||entry.people!==entry.characters.length||!entry.characters.includes('久留美')||
  !Array.isArray(entry.dialoguePanels)||entry.dialoguePanels.length!==4||!entry.dialoguePanels.every(p=>text(p?.action)&&Array.isArray(p.lines)&&p.lines.every(line=>Array.isArray(line)&&line.length===2&&line.every(text)&&entry.characters.includes(line[0])))||!entry.dialoguePanels.some(p=>p.lines.length)||
  a?.reviewed!==true||a.independentComic!==true||a.panels!==4||a.grid||a.people!==entry.people||a.dialogueId!==entry.dialogueId||
  typeof a.path!=='string'||!/^\.\/generated\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:webp|png|jpg)$/.test(a.path)||!/^([a-f0-9]{64})$/.test(a.sha256)||
  !Number.isFinite(a.width)||a.width<=0||!Number.isFinite(a.height)||a.height<=0||!Array.isArray(a.panelRects)||a.panelRects.length!==4||new Set(a.panelRects.map(r=>JSON.stringify(r))).size!==4||!a.panelRects.every(r=>cropValid(r,a)))return false;
 if(entry.category!=='friend'){
  if(entry.people!==1)return false;
  // Existing unbound catalogs remain compatible; new routine artwork must
  // opt into the exact frozen receipt source, without renaming that source.
  if(entry.receiptDialogueSourceId==null)return true;
  const source=dialogueForSource({category:entry.category,id:entry.optionId},entry.receiptDialogueSourceId);
  return !!source&&JSON.stringify(source.lines)===JSON.stringify(entry.dialoguePanels.flatMap(p=>p.lines.map(([from,text])=>({from,text}))));
 }
 const friend=entry.optionId==='mochiko'?'萌智子':'安子';
 if(entry.people!==2||!entry.characters.includes(friend)||entry.receiptDialogueSourceId!==entry.dialogueId)return false;
 const source=dialogueForSource({category:entry.category,id:entry.optionId},entry.receiptDialogueSourceId);
 // The same complete frozen exchange drives chat, receipt and picture. Never
 // relabel a legacy receipt with new text merely because its friend matches.
 return !!source&&JSON.stringify(source.lines)===JSON.stringify(entry.dialoguePanels.flatMap(p=>p.lines.map(([from,text])=>({from,text}))));
}
export function inspectLifeSceneCatalog(catalog=LIFE_SCENE_CATALOG,{dialogueForSource=lifeActionDialogueForSource}={}){
 const all=Array.isArray(catalog)?catalog:[],good=all.filter(e=>valid(e,dialogueForSource));
 const keys=e=>[e.id,e.dialogueId,e.semanticReadKey,e.art.sha256,JSON.stringify(e.dialoguePanels),JSON.stringify(e.dialoguePanels.map(p=>p.lines)),...(e.receiptDialogueSourceId?[`source:${e.receiptDialogueSourceId}`]:[])];
 const counts=new Map();for(const e of good)keys(e).forEach((value,index)=>{const key=`${index}:${value}`;counts.set(key,(counts.get(key)||0)+1);});
 const accepted=[],rejected=[];
 for(const e of all){if(!good.includes(e)){rejected.push({id:e?.id||null,reason:'incomplete-or-unapproved'});continue;}
  if(keys(e).some((value,index)=>counts.get(`${index}:${value}`)>1)){rejected.push({id:e.id,reason:'duplicate-content'});continue;}accepted.push(e);
 }
 accepted.sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));return {accepted,rejected,readyCount:accepted.length};
}
export const lifeSceneMatches=(entry,{day,outcome,trauma})=>day>=entry.fromDay&&day<=entry.toDay&&entry.outcomes.includes(outcome)&&(entry.trauma==='any'||(entry.trauma==='active')===trauma);
