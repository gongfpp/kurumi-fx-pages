import {selectComicScene} from './comic-scenes.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {recordedComicEvents,createComicReceiptGate} from './event-comic-events.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {createEventComicQueue} from './event-comic-queue.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {setImage} from './assets.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {settlementPresentation} from './settlement-stage.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';

const yen=value=>`¥${Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const BORROWING=new Set(['father-borrow','loan-funded']);
const REPAYING=new Set(['father-repay-part','father-repaid','loan-repay-part','loan-repaid']);
export function comicReceiptText(scene){
 const result=scene.result||{},lines=[];
 if(Number.isFinite(result.amount)&&result.amount>0)lines.push(`${BORROWING.has(scene.id)?'到账':REPAYING.has(scene.id)?'归还':scene.id==='loan-interest'?'利息':'花费'} ${yen(result.amount)}`);
 if(Number.isFinite(result.outstanding))lines.push(`剩余欠款 ${yen(result.outstanding)}`);
 if(Number.isFinite(result.tradingNet))lines.push(`${scene.id.startsWith('settled-')?'今日交易':'本次成交'} ${result.tradingNet>0?'+':result.tradingNet<0?'−':''}${yen(result.tradingNet)}`);
 return lines.join(' · ');
}

export function createEventComicPresenter({root=document,initialState,getContext,isBlocked=()=>false,isPaused=()=>false,onIdle=()=>{}}){
 const make=(tag,className,text)=>{const el=root.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
 const dialog=make('dialog','event-comic-dialog dialog-shell');dialog.id='event-comic-dialog';dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','event-comic-title');
 const toolbar=make('div','dialog-toolbar'),close=make('button','x-close','×');close.type='button';close.setAttribute('aria-label','关闭小剧场');toolbar.append(close);
 const body=make('div','dialog-scroll'),eyebrow=make('p','event-comic-eyebrow','小剧场'),title=make('h2');title.id='event-comic-title';
 const image=make('img','event-comic-sheet'),missing=make('p','event-comic-missing','画面待补'),lines=make('ol','event-comic-lines'),receipt=make('p','event-comic-receipt'),controls=make('div','event-comic-controls'),replay=make('button','secondary','重看'),next=make('button','primary','继续');
 image.decoding='async';image.loading='eager';receipt.setAttribute('role','status');for(const button of [replay,next])button.type='button';controls.append(replay,next);body.append(eyebrow,title,image,missing,lines,receipt,controls);dialog.append(toolbar,body);root.body.append(dialog);
 const launcher=make('button','event-comic-launcher secondary','重看小剧场');launcher.id='event-comic-open';launcher.type='button';launcher.hidden=true;
 (root.getElementById('scene-resume')?.parentElement||root.querySelector('footer')||root.body).append(launcher);
 let showing=null,opener=null,closing=false,disposed=false,queue,deliveryTimer=null,deliveries=[],savedReplay=[];
 const syncRoot=()=>root.documentElement.classList.toggle('dialog-active',!!root.querySelector('dialog[open]'));
 function hide(){if(dialog.open){closing=true;dialog.close();closing=false;}showing=null;syncRoot();}
 function valid(){return !disposed&&!isBlocked();}
 function safe(){return valid()&&!isPaused()&&![...(root.querySelectorAll?.('dialog[open]')||[])].some(open=>open!==dialog);}
 function paint(state){
  launcher.hidden=!safe()||!state.pending.length&&!state.history.length&&!savedReplay.length;
  launcher.textContent=state.pending.length?`继续小剧场 · ${state.pending.length}`:savedReplay.length?'重看今日小剧场':'重看小剧场';
  if(!state.active||!safe()){hide();return;}
  if(showing===state.active.receiptKey&&dialog.open){next.textContent=state.pending.length?'下一幕':'回到游戏';return;}
  const scene=state.active;showing=scene.receiptKey;title.textContent=scene.title;dialog.dataset.scene=scene.id;dialog.dataset.receiptKey=scene.receiptKey;dialog.dataset.artReady=String(scene.ready);
  image.hidden=!scene.ready;missing.hidden=scene.ready;
  if(scene.ready){setImage(image,scene.art.path);image.alt=scene.art.alt||scene.title;image.width=scene.art.width;image.height=scene.art.height;
   const key=scene.receiptKey,failed=image.onerror;image.onerror=()=>{if(showing!==key)return;failed?.();if(image.classList.contains('image-unavailable')){image.hidden=true;missing.hidden=false;missing.textContent='画面暂时没载入';dialog.dataset.artReady='false';}};
  }else{image.removeAttribute('src');image.alt='';missing.textContent='画面待补';}
  lines.replaceChildren();for(const [speaker,text] of scene.lines){const line=make('li'),name=make('b',null,speaker);line.append(name,root.createTextNode(`：${text}`));lines.append(line);}
  receipt.textContent=comicReceiptText(scene);receipt.hidden=!receipt.textContent;next.textContent=state.pending.length?'下一幕':'回到游戏';
  if(!dialog.open){opener=root.activeElement;dialog.showModal();}body.scrollTop=0;syncRoot();next.focus({preventScroll:true});
 }
 const restoredDayBoundary=initialState.phase==='resting'&&settlementPresentation(initialState)?.stage==='complete';
 queue=createEventComicQueue({onChange:paint});
 function flushDeliveries(){
  deliveryTimer=null;
  // A canceled chapter transition is only a presentation pause. Keep certified
  // receipts until that same context is safe; rebase/invalidate discards them.
  if(!safe())return;
  const incoming=deliveries;deliveries=[];
  queue.enqueue(incoming.filter(item=>item.context===getContext()).flatMap(item=>item.scenes));
 }
 function scheduleDelivery(){if(deliveryTimer===null&&deliveries.length&&safe())deliveryTimer=setTimeout(flushDeliveries,0);}
 const gate=createComicReceiptGate({initialState,context:getContext(),select:(state,event)=>selectComicScene(state,event,{assets:COMIC_PRESENTATION_ASSETS}),onScenes:scenes=>{deliveries.push({context:getContext(),scenes});scheduleDelivery();},onReset:()=>{clearTimeout(deliveryTimer);deliveryTimer=null;deliveries=[];savedReplay=[];queue.reset();}});
 // A loaded save is already durable. Rebuild read-only scenes from its own
 // current-day receipts, but never autoplay them or call economic handlers.
 savedReplay=structuredClone(recordedComicEvents(initialState).map(event=>selectComicScene(initialState,event,{assets:COMIC_PRESENTATION_ASSETS})).filter(Boolean));
 paint(queue.state);
 function dismiss(){queue.dismiss();if(opener?.isConnected&&!opener.disabled)opener.focus?.({preventScroll:true});onIdle();}
 close.addEventListener('click',dismiss);
 dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopImmediatePropagation();dismiss();});
 dialog.addEventListener('close',()=>{if(!closing&&queue.state.active)dismiss();syncRoot();});
 dialog.addEventListener('keydown',event=>event.stopPropagation());
 next.addEventListener('click',()=>{queue.next();if(!queue.state.active)onIdle();});
 replay.addEventListener('click',()=>{showing=null;queue.replay(queue.state.active?.receiptKey);});
 launcher.addEventListener('click',()=>{if(!safe())return;if(queue.state.pending.length)queue.resume();else if(savedReplay.length){const scenes=savedReplay;savedReplay=[];queue.enqueue(scenes);queue.resume();}else queue.replay();});
 // Back/Forward and page restore discard only presentation. Re-entering an
 // economic handler is never part of a dismissal, replay, reload or navigation.
 const win=root.defaultView;
 const refreshPresentation=()=>{paint(queue.state);scheduleDelivery();};
 const afterOtherDialogClose=event=>{if(event.target!==dialog)queueMicrotask(()=>{if(!disposed)refreshPresentation();});};
 root.addEventListener?.('close',afterOtherDialogClose,true);
 const dismissNavigation=()=>queue.dismiss();win?.addEventListener('popstate',dismissNavigation);win?.addEventListener('pagehide',dismissNavigation);
 return {
  capture:state=>gate.capture(state,getContext()),
  commit:(ticket,saved)=>gate.commit(ticket,{saved,context:getContext(),blocked:!valid()}),
  invalidate:()=>gate.invalidate(),
  refresh:refreshPresentation,
  presentPending:()=>{if(!safe())return false;clearTimeout(deliveryTimer);deliveryTimer=null;flushDeliveries();return !!queue.state.active||queue.state.pending.length>0||(restoredDayBoundary&&savedReplay.length>0);},
  dispose(){disposed=true;gate.invalidate();root.removeEventListener?.('close',afterOtherDialogClose,true);win?.removeEventListener('popstate',dismissNavigation);win?.removeEventListener('pagehide',dismissNavigation);dialog.remove();launcher.remove();},
  get state(){return queue.state;},
 };
}
