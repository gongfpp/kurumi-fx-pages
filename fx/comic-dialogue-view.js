import {setImage} from './assets.js?v=6bfd369389c86237f67818f1036ff0bf523ac575-23f2a20b7717';
import {artIdentity,dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=6bfd369389c86237f67818f1036ff0bf523ac575-23f2a20b7717';
export const usesPanelArtwork=scene=>!!(scene?.ready&&scene.art&&scene.dialoguePanels?.length===4);
// Shared read-only panel cards. Explicit crop rectangles preserve asymmetric
// four-panel sheets on phones; older 2x2 assets keep their original geometry.
export function mountComicDialogue(host,scene,{root=host.ownerDocument||document}={}){
 host.replaceChildren();
 const panels=scene.dialoguePanels||scene.lines.map(line=>({lines:[line]})),images=[];let stops=[];
 for(const [index,panel] of panels.entries()){
  const item=root.createElement('li'),caption=root.createElement('div');caption.className='comic-panel-caption';item.dataset.panel=String(index+1);
  if(usesPanelArtwork(scene)){
   const crop=root.createElement('div'),image=root.createElement('img'),missing=root.createElement('p');crop.className='comic-panel-art';const rect=scene.art.panelRects?.[index],valid=Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[2]>0&&rect[3]>0&&rect[0]+rect[2]<=scene.art.width&&rect[1]+rect[3]<=scene.art.height;crop.setAttribute('style',`aspect-ratio:${valid?rect[2]:scene.art.width} / ${valid?rect[3]:scene.art.height}`);image.className='comic-panel-crop';image.alt=`${scene.title}，第${index+1}格。${panel.action||''}`;image.width=scene.art.width;image.height=scene.art.height;image.loading='eager';image.decoding='async';image.dataset.comicPanel=String(index+1);
   image.setAttribute('style',valid?`position:absolute;width:${scene.art.width/rect[2]*100}%;height:${scene.art.height/rect[3]*100}%;max-width:none;max-height:none;left:${-rect[0]/rect[2]*100}%;top:${-rect[1]/rect[3]*100}%;object-fit:fill`:`position:absolute;width:200%;height:200%;max-width:none;max-height:none;left:${index%2?-100:0}%;top:${index>1?-100:0}%;object-fit:fill`);
   missing.textContent='这一格暂时没载入';missing.hidden=true;missing.setAttribute('role','status');setImage(image,scene.art.path,{onStatus:status=>{missing.hidden=status!=='unavailable';image.hidden=status==='unavailable';}});crop.append(image);
   if(valid&&rect[2]/rect[3]>2.4){const viewport=root.createElement('div');viewport.className='comic-panel-viewport';viewport.tabIndex=0;viewport.setAttribute('role','group');viewport.setAttribute('aria-label',`${scene.title}，第${index+1}格，可左右浏览`);crop.className+=' comic-panel-panorama';viewport.append(crop);item.append(viewport,missing);}else item.append(crop,missing);
   images.push({image,crop,caption,hasCaption:!!panel.action||panel.lines.length>0});
  }
  if(panel.action){const action=root.createElement('p');action.className='comic-panel-action';action.textContent=panel.action;caption.append(action);}
  for(const [speaker,text] of panel.lines){const line=root.createElement('p');line.className='comic-panel-line';const name=root.createElement('b'),speech=root.createElement('span');name.textContent=speaker;speech.textContent=`：${text}`;line.append(name,speech);caption.append(line);}
  item.append(caption);
  host.append(item);
 }
 const dispose=()=>{for(const stop of stops)stop();stops=[];};
 return {count:panels.length,images,dispose,observe({memory=dailyArtMemory,identities=[artIdentity(scene.art)]}={}){
  dispose();const seen=new Set();stops=images.map(({image,crop,caption,hasCaption},index)=>observeSeenArtwork(image,{memory:{seen(){}},identities:[],visibilityTargets:hasCaption?[crop,caption]:[crop],minVisibleRatio:.9,accumulateVisibility:true,onSeen:()=>{seen.add(index);if(seen.size===4)memory.seen(identities.filter(Boolean));}}));return dispose;
 }};
}
