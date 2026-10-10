import {setImage} from './assets.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {artIdentity,dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
export const usesPanelArtwork=scene=>!!(scene?.ready&&scene.art&&scene.dialoguePanels?.length===4);
// Shared read-only panel cards. The original 2x2 file remains untouched.
export function mountComicDialogue(host,scene,{root=host.ownerDocument||document}={}){
 host.replaceChildren();
 const panels=scene.dialoguePanels||scene.lines.map(line=>({lines:[line]})),images=[];let stops=[];
 for(const [index,panel] of panels.entries()){
  const item=root.createElement('li'),caption=root.createElement('div');caption.className='comic-panel-caption';item.dataset.panel=String(index+1);
  if(usesPanelArtwork(scene)){
   const crop=root.createElement('div'),image=root.createElement('img'),missing=root.createElement('p');crop.className='comic-panel-art';crop.setAttribute('style',`aspect-ratio:${scene.art.width} / ${scene.art.height}`);image.className='comic-panel-crop';image.alt=`${scene.title}，第${index+1}格。${panel.action||''}`;image.width=scene.art.width;image.height=scene.art.height;image.loading='eager';image.decoding='async';image.dataset.comicPanel=String(index+1);
   image.setAttribute('style',`position:absolute;width:200%;height:200%;max-width:none;max-height:none;left:${index%2?-100:0}%;top:${index>1?-100:0}%;object-fit:fill`);
   missing.textContent='这一格暂时没载入';missing.hidden=true;missing.setAttribute('role','status');setImage(image,scene.art.path,{onStatus:status=>{missing.hidden=status!=='unavailable';image.hidden=status==='unavailable';}});crop.append(image);item.append(crop,missing);images.push({image,crop,caption});
  }
  if(panel.action){const action=root.createElement('p');action.className='comic-panel-action';action.textContent=panel.action;caption.append(action);}
  for(const [speaker,text] of panel.lines){const line=root.createElement('p');line.className='comic-panel-line';const name=root.createElement('b'),speech=root.createElement('span');name.textContent=speaker;speech.textContent=`：${text}`;line.append(name,speech);caption.append(line);}
  item.append(caption);
  host.append(item);
 }
 const dispose=()=>{for(const stop of stops)stop();stops=[];};
 return {count:panels.length,images,dispose,observe({memory=dailyArtMemory,identities=[artIdentity(scene.art)]}={}){
  dispose();const seen=new Set();stops=images.map(({image,crop,caption},index)=>observeSeenArtwork(image,{memory:{seen(){}},identities:[],visibilityTargets:[crop,caption],minVisibleRatio:.9,accumulateVisibility:true,onSeen:()=>{seen.add(index);if(seen.size===4)memory.seen(identities.filter(Boolean));}}));return dispose;
 }};
}
