import {mountContextualManga} from './contextual-manga-view.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {realizedProfitComicPresentation} from './profit-comic-presentation.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {ensureComicAutoplay,chooseAutomaticComic,markAutomaticComicShown} from './comic-autoplay.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {selectComicScene} from './comic-scenes.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {recordedComicScenes,createComicReceiptGate} from './event-comic-events.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {createEventComicQueue} from './event-comic-queue.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {setImage} from './assets.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';

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

export function createEventComicPresenter({root=document,initialState,getContext,isBlocked=()=>false,isPaused=()=>false,onIdle=()=>{},onAutoShown=()=>{}}){
 const make=(tag,className,text)=>{const el=root.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
 const dialog=make('dialog','event-comic-dialog dialog-shell');dialog.id='event-comic-dialog';dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','event-comic-title');
 const toolbar=make('div','dialog-toolbar'),close=make('button','x-close','×');close.type='button';close.setAttribute('aria-label','关闭小剧场');toolbar.append(close);
 const body=make('div','dialog-scroll'),eyebrow=make('p','event-comic-eyebrow','小剧场'),title=make('h2');title.id='event-comic-title';
 const contextual=make('div');
 const image=make('img','event-comic-sheet'),missing=make('p','event-comic-missing','画面待补'),lines=make('ol','event-comic-lines'),receipt=make('p','event-comic-receipt'),controls=make('div','event-comic-controls'),replay=make('button','secondary','重看'),next=make('button','primary','继续');
 image.decoding='async';image.loading='eager';receipt.setAttribute('role','status');for(const button of [replay,next])button.type='button';controls.append(replay,next);body.append(eyebrow,title,image,missing,lines,receipt,contextual,controls);dialog.append(toolbar,body);root.body.append(dialog);
 const launcher=make('button','event-comic-launcher secondary','重看小剧场');launcher.id='event-comic-open';launcher.type='button';launcher.hidden=true;
 (root.getElementById('scene-resume')?.parentElement||root.querySelector('footer')||root.body).append(launcher);
 let showing=null,opener=null,closing=false,disposed=false,queue,deliveryTimer=null,deliveries=[],savedReplay=[],currentState=initialState,autoShown=new Set();
 ensureComicAutoplay(currentState);
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
  mountContextualManga(contextual,scene.contextualManga,{manual:true,root});
  receipt.textContent=comicReceiptText(scene);receipt.hidden=!receipt.textContent;next.textContent=state.pending.length?'下一幕':'回到游戏';
  if(!dialog.open){opener=root.activeElement;dialog.showModal();}body.scrollTop=0;syncRoot();next.focus({preventScroll:true});
  if(scene.automatic&&!autoShown.has(scene.receiptKey)){autoShown.add(scene.receiptKey);markAutomaticComicShown(currentState,scene);onAutoShown();}
 }
 queue=createEventComicQueue({onChange:paint});
 function flushDeliveries(){
  deliveryTimer=null;
  // A canceled chapter transition is only a presentation pause. Keep certified
  // receipts until that same context is safe; rebase/invalidate discards them.
  if(!safe())return;
  const incoming=deliveries;deliveries=[];
  const scenes=incoming.filter(item=>item.context===getContext()).flatMap(item=>item.scenes);
  // One visible interruption for this delivery turn. All other receipts remain
  // in the replay archive, never in an automatic 'next scene' backlog.
  if(!queue.state.active){const selected=chooseAutomaticComic(currentState,scenes);if(selected){const presented=realizedProfitComicPresentation(selected,{traumaActive:tradingTrauma(currentState).active});queue.enqueue([{...presented,automatic:true,result:['closed-profit','half-profit','stop-loss','liquidation'].includes(selected.id)?{...selected.result,tradingNet:selected.batchTradingNet}:selected.result}]);queue.resume();}}
 }
 function scheduleDelivery(){if(deliveryTimer===null&&deliveries.length&&safe())deliveryTimer=setTimeout(flushDeliveries,0);}
 const gate=createComicReceiptGate({initialState,context:getContext(),select:(state,event)=>selectComicScene(state,event,{assets:COMIC_PRESENTATION_ASSETS}),onScenes:scenes=>{savedReplay.push(...scenes);const automatic=scenes.filter(scene=>!scene.manualOnly);if(automatic.length)deliveries.push({context:getContext(),scenes:automatic});paint(queue.state);scheduleDelivery();},onReset:()=>{clearTimeout(deliveryTimer);deliveryTimer=null;deliveries=[];savedReplay=[];autoShown.clear();queue.reset();}});
 // A loaded save is already durable. Rebuild read-only scenes from its own
 // current-day receipts, but never autoplay them or call economic handlers.
 savedReplay=structuredClone(recordedComicScenes(initialState,(state,event)=>selectComicScene(state,event,{assets:COMIC_PRESENTATION_ASSETS})));
 paint(queue.state);
 function dismiss(){queue.cancel();if(opener?.isConnected&&!opener.disabled)opener.focus?.({preventScroll:true});onIdle();}
 close.addEventListener('click',dismiss);
 dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopImmediatePropagation();dismiss();});
 dialog.addEventListener('close',()=>{if(!closing&&queue.state.active)dismiss();syncRoot();});
 dialog.addEventListener('keydown',event=>event.stopPropagation());
 next.addEventListener('click',()=>{queue.next();if(!queue.state.active)onIdle();});
 replay.addEventListener('click',()=>{showing=null;queue.replay(queue.state.active?.receiptKey);});
 launcher.addEventListener('click',()=>{if(!safe())return;if(queue.state.pending.length)queue.resume();else if(savedReplay.length){queue.play(savedReplay.map(scene=>({...scene,automatic:false})));}else queue.replay();});
 // Back/Forward and page restore discard only presentation. Re-entering an
 // economic handler is never part of a dismissal, replay, reload or navigation.
 const win=root.defaultView;
 const refreshPresentation=()=>{paint(queue.state);scheduleDelivery();};
 const afterOtherDialogClose=event=>{if(event.target!==dialog)queueMicrotask(()=>{if(!disposed)refreshPresentation();});};
 root.addEventListener?.('close',afterOtherDialogClose,true);
 const dismissNavigation=()=>queue.cancel();win?.addEventListener('popstate',dismissNavigation);win?.addEventListener('pagehide',dismissNavigation);
 return {
  capture:state=>{currentState=state;ensureComicAutoplay(state);return gate.capture(state,getContext());},
  commit:(ticket,saved)=>gate.commit(ticket,{saved,context:getContext(),blocked:!valid()}),
  invalidate:()=>gate.invalidate(),
  refresh:refreshPresentation,
  presentPending:()=>{if(!safe())return false;clearTimeout(deliveryTimer);deliveryTimer=null;flushDeliveries();return !!queue.state.active||queue.state.pending.length>0;},
  dispose(){disposed=true;gate.invalidate();root.removeEventListener?.('close',afterOtherDialogClose,true);win?.removeEventListener('popstate',dismissNavigation);win?.removeEventListener('pagehide',dismissNavigation);dialog.remove();launcher.remove();},
  get state(){return queue.state;},
 };
}
