import {setMangaImage} from './manga-images.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';
import {showMangaPortrait} from './manga-portraits.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';

export function renderMangaSelection(frame,selection,{openSource}={}){
 const document=frame.ownerDocument;
 frame.replaceChildren();frame.hidden=false;frame.className='manga-context-cards';frame.dataset.match=selection.status;
 // Provenance and matching evidence remain in the source action, not the scene.
 if(!selection.cards.length){frame.hidden=true;return;}
 for(const {panel,crop,reason} of selection.cards){
  const figure=document.createElement('figure'),view=document.createElement('div'),img=document.createElement('img'),caption=document.createElement('figcaption'),button=document.createElement('button');
  view.className='manga-card-viewport';view.append(img);
  if(crop){showMangaPortrait(img,{...panel,cropPixels:crop},{loading:'lazy'});img.alt=`原作剧情参考 · ${panel.character} · 第 ${panel.chapter} 话第 ${panel.page} 页`;}else{setMangaImage(img,panel.original);img.alt=`原作参考 · ${panel.character} · 第 ${panel.chapter} 话第 ${panel.page} 页`;}
  caption.textContent='';button.type='button';button.className='secondary manga-card-source';button.textContent='素材出处';button.onclick=()=>openSource?.(panel,reason);
  figure.append(view,caption,button);frame.append(figure);
 }
}
