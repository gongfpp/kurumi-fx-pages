import {mangaCollectionProgress} from './manga-collection-model.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';
import {dailyArtMemory} from './daily-art-memory.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';
import {assetURL} from './assets.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';

const mounts=new WeakMap();
const put=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
export function mountMangaCollection({root=globalThis.document,getProfile=()=>({}),memory=dailyArtMemory}={}){
 if(!root?.body)return {refresh(){},dispose(){}};
 if(mounts.has(root))return mounts.get(root);
 const book=root.getElementById('achievement-book'),dialog=root.getElementById('achievements-dialog');
 if(!book||!dialog)return {refresh(){},dispose(){}};
 let ownedStyle=null;
 if(!root.getElementById('manga-collection-style')){ownedStyle=root.createElement('link');ownedStyle.id='manga-collection-style';ownedStyle.rel='stylesheet';ownedStyle.href=assetURL('./manga-collection.css');root.head.append(ownedStyle);}
 const make=(tag,css,text)=>{const n=root.createElement(tag);n.className=css;if(text!==undefined)n.textContent=text;return n;};
 const button=(css,text)=>{const n=make('button',css,text);n.type='button';return n;};
 const removers=[];const listen=(n,event,fn)=>{n.addEventListener(event,fn);removers.push(()=>n.removeEventListener(event,fn));};
 const lock=()=>{const n=make('span','manga-collection-lock');n.setAttribute('aria-hidden','true');return n;};
 const tabs=make('div','manga-collection-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','成就与漫画');
 const trophyTab=button('manga-collection-tab','🏆 成就档案'),mangaTab=button('manga-collection-tab','📖 原作漫画收集');
 trophyTab.id='manga-collection-trophy-tab';mangaTab.id='manga-collection-manga-tab';
 for(const [tab,controls]of [[trophyTab,'achievement-book'],[mangaTab,'manga-collection-panel']]){tab.setAttribute('role','tab');tab.setAttribute('aria-controls',controls);}
 tabs.append(trophyTab,mangaTab);book.insertAdjacentElement('beforebegin',tabs);
 const view=make('section','manga-collection-panel');view.id='manga-collection-panel';view.hidden=true;view.setAttribute('role','tabpanel');view.setAttribute('aria-labelledby',mangaTab.id);book.insertAdjacentElement('afterend',view);
 const catalog=make('section','manga-collection-catalog'),header=make('header','manga-collection-header');
 const count=make('span','manga-collection-count'),progress=make('progress','manga-collection-progress'),percent=make('span','manga-collection-percent');progress.setAttribute('aria-label','原作漫画收集进度');
 header.append(make('h3','','原作漫画收集'),count,progress,percent);
 const filters=make('div','manga-collection-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','漫画筛选');
 const grid=make('div','manga-collection-grid'),empty=make('p','manga-collection-empty','还没有符合筛选条件的漫画。');empty.setAttribute('role','status');
 const listNav=make('nav','manga-collection-list-nav'),listBack=button('','‹'),listPosition=make('span',''),listNext=button('','›');listBack.setAttribute('aria-label','上一组漫画');listNext.setAttribute('aria-label','下一组漫画');listNav.setAttribute('aria-label','漫画目录翻页');listNav.append(listBack,listPosition,listNext);
 const detail=make('section','manga-collection-detail'),detailThumb=make('div','manga-collection-detail-thumb'),detailCopy=make('div','manga-collection-detail-copy'),detailTitle=make('h4',''),detailStatus=make('span','manga-collection-status'),condition=make('p','manga-collection-condition');
 detailCopy.append(detailTitle,detailStatus,make('h5','','解锁条件'),condition);detail.append(detailThumb,detailCopy);catalog.append(header,filters,grid,empty,listNav,detail);
 const reader=make('section','manga-collection-reader'),readerHeader=make('header','manga-collection-reader-header'),choice=make('select','manga-collection-choice');choice.setAttribute('aria-label','选择原作漫画');readerHeader.append(make('h3','','📖 原作漫画'),choice);
 const page=make('div','manga-collection-page'),caption=make('p','manga-collection-caption'),nav=make('nav','manga-collection-reader-nav'),back=button('','‹ 上一页'),position=make('span',''),next=button('','下一页 ›');nav.setAttribute('aria-label','原作漫画翻页');position.setAttribute('aria-live','polite');nav.append(back,position,next);reader.append(readerHeader,page,caption,nav);view.append(catalog,reader);
 let active='achievements',filter='all',entries=[],selectedId=null,listPage=0,disposed=false,signature='',pictureSignature='';
 const filterButtons=new Map();
 const available=()=>entries.filter(e=>filter==='all'||(filter==='unlocked'?e.unlocked:!e.unlocked));
 function applyTab(){
  const collection=active==='manga';dialog.dataset.collectionTab=active;book.hidden=collection;view.hidden=!collection;
  for(const [tab,on]of [[trophyTab,!collection],[mangaTab,collection]]){tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;}
  // The existing pixel achievement renderer remains mounted and owns its UI.
  // CSS also guards its next async refresh, so it cannot cover this tab.
  const pixel=dialog.querySelector('.pixel-ach-browser');if(pixel)pixel.inert=collection;
 }
 function selectTab(tab,{focus=false}={}){
  if(disposed)return;active=tab;applyTab();if(active==='manga')refresh();if(focus)(active==='manga'?mangaTab:trophyTab).focus({preventScroll:true});
 }
 function art(frame,entry,{thumbnail=false}={}){
  frame.replaceChildren();
  if(!entry?.unlocked){frame.append(lock());return;}
  const img=make('img',thumbnail?'manga-collection-thumbnail':'manga-collection-original');img.alt=thumbnail?'':entry.alt;
  if(thumbnail)img.setAttribute('aria-hidden','true');
  const [width,height]=entry.dimensions||[];if(width&&height){img.width=width;img.height=height;}
  frame.append(img);setMangaImage(img,entry.path,{loading:thumbnail?'lazy':'eager'});
 }
 function paintSelection({resetScroll=false}={}){
  const items=available();if(!items.some(e=>e.id===selectedId))selectedId=(items.find(e=>e.unlocked)||items[0])?.id||null;
  const selected=items.find(e=>e.id===selectedId),index=items.findIndex(e=>e.id===selectedId);
  if(selected&&(index<listPage*4||index>=listPage*4+4))listPage=Math.floor(index/4);
  for(const [key,b]of filterButtons)b.setAttribute('aria-pressed',String(key===filter));
  empty.hidden=items.length>0;grid.replaceChildren();
  for(const entry of items.slice(listPage*4,listPage*4+4)){
   const card=button('manga-collection-card'+(entry.unlocked?' collected':' locked'),''),thumb=make('span','manga-collection-thumb');card.dataset.collectionId=entry.id;card.setAttribute('aria-pressed',String(entry.id===selectedId));card.setAttribute('aria-label',`${entry.title}，${entry.unlocked?'已收集':'未解锁'}`);
   art(thumb,entry,{thumbnail:true});card.append(thumb,make('strong','',entry.title),make('span','manga-collection-card-status',entry.unlocked?'📖 已收集':entry.condition));card.addEventListener('click',()=>select(entry.id));grid.append(card);
  }
  const pages=Math.ceil(items.length/4);put(listPosition,pages?`${listPage+1} / ${pages}`:'0 / 0');listBack.disabled=listPage<=0;listNext.disabled=listPage>=pages-1;listNav.hidden=pages<2;
  detail.hidden=!selected;reader.hidden=!selected;
  choice.replaceChildren(...items.map(e=>{const option=make('option','',`${e.unlocked?'':'🔒 '}${e.sourceLabel} · ${e.title}`);option.value=e.id;return option;}));choice.value=selectedId||'';
  if(!selected){page.replaceChildren();detailThumb.replaceChildren();pictureSignature='';return;}
  put(detailTitle,selected.title);put(detailStatus,selected.unlocked?'已解锁 · 可重看':'尚未解锁');detailStatus.dataset.unlocked=String(selected.unlocked);put(condition,selected.condition);
  const key=selected.id+':'+selected.unlocked;
  if(key!==pictureSignature){
   art(page,selected);art(detailThumb,selected,{thumbnail:true});
   if(!selected.unlocked)page.append(make('h4','','这页漫画还未解锁'),make('p','',selected.condition));
   pictureSignature=key;
  }
  page.dataset.locked=String(!selected.unlocked);put(caption,selected.unlocked?`${selected.sourceLabel} · ${selected.title}`:'触发后，这页原作漫画会留在这里。');
  back.disabled=index<=0;next.disabled=index>=items.length-1;put(position,`${index+1} / ${items.length}`);if(resetScroll)page.scrollTop=0;
 }
 function select(id){if(disposed||active!=='manga'||!available().some(e=>e.id===id))return;selectedId=id;paintSelection({resetScroll:true});}
 function move(delta,event){if(event?.repeat||event?.detail>1||active!=='manga')return;const items=available(),index=items.findIndex(e=>e.id===selectedId);if(items[index+delta])select(items[index+delta].id);}
 for(const [key,label]of [['all','全部'],['unlocked','已收集'],['locked','未解锁']]){const b=button('manga-collection-filter',label);filterButtons.set(key,b);filters.append(b);listen(b,'click',()=>{if(disposed||active!=='manga')return;filter=key;listPage=0;selectedId=null;paintSelection({resetScroll:true});});}
 listen(trophyTab,'click',()=>selectTab('achievements'));listen(mangaTab,'click',()=>selectTab('manga'));
 listen(tabs,'keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||event.repeat)return;event.preventDefault();selectTab(event.key==='Home'?'achievements':event.key==='End'?'manga':active==='manga'?'achievements':'manga',{focus:true});});
 listen(back,'click',event=>move(-1,event));listen(next,'click',event=>move(1,event));listen(choice,'change',()=>select(choice.value));
 listen(listBack,'click',event=>{if(event.detail>1)return;const e=available()[(listPage-1)*4];if(e)select(e.id);});listen(listNext,'click',event=>{if(event.detail>1)return;const e=available()[(listPage+1)*4];if(e)select(e.id);});
 function refresh(){
  if(disposed)return false;applyTab();if(active!=='manga')return true;
  const current=mangaCollectionProgress({achievementProfile:getProfile(),memory}),nextSignature=JSON.stringify(current.map(e=>[e.id,e.unlocked]));
  if(nextSignature===signature)return true;entries=current;signature=nextSignature;
  const total=entries.length,collected=entries.filter(e=>e.unlocked).length;put(count,`已收集 ${collected} / ${total}`);progress.max=total||1;progress.value=collected;put(percent,`${total?Math.round(collected/total*100):0}%`);paintSelection();return true;
 }
 const Observer=root.defaultView?.MutationObserver;const observer=Observer?new Observer(refresh):null;observer?.observe(book,{childList:true});
 listen(dialog,'close',()=>{if(view.contains(root.activeElement))mangaTab.focus({preventScroll:true});});
 const api={refresh,dispose(){if(disposed)return;disposed=true;observer?.disconnect();removers.forEach(fn=>fn());const focused=view.contains(root.activeElement)||tabs.contains(root.activeElement);tabs.remove();view.remove();book.hidden=false;delete dialog.dataset.collectionTab;const pixel=dialog.querySelector('.pixel-ach-browser');if(pixel)pixel.inert=false;ownedStyle?.remove();if(focused)dialog.querySelector('.x-close')?.focus({preventScroll:true});mounts.delete(root);}};
 mounts.set(root,api);refresh();return api;
}
