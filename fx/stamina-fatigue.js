import {STAMINA_FATIGUE,queueStaminaFatigue,beginStaminaFatigue,recoverStaminaFatigue,completeStaminaFatigue,staminaFatigueActive} from './stamina.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
import {currentTradingTimestamp,tradingTimestamp} from './trading-time.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
import {isHistorical,peekHistoricalQuote} from './historical-replay.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
import {isLiveMarket} from './live-market-state.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';
import {hasCanonicalGrid,QUOTE_SUBSTEPS} from './quote-grid.js?v=e96fa64c519b4b67cce1aa222710ddf39572a802-23f2a20b7717';

// A new session cursor can point beyond the last quote actually consumed.
// In particular, endless settlement opens the next day in the same engine call.
function consumedQuoteAt(state){
 if(!isLiveMarket(state)&&!isHistorical(state)&&Number.isFinite(state.tradingClock?.lastQuoteAt))return state.tradingClock.lastQuoteAt;
 return currentTradingTimestamp(state);
}
function nextQuoteAt(state){
 if(isHistorical(state)){const next=peekHistoricalQuote(state);return next.blocked||next.done?null:next.event?.at??next.quote?.[0];}
 const p=state.pending||{beat:state.beat,candle:0,tick:0,subtick:0};
 return tradingTimestamp(state,{day:state.day,...p})+(hasCanonicalGrid(state.script)?((p.subtick||0)+1)/QUOTE_SUBSTEPS:1)*150000;
}
// Skip presentation only. Every intermediate source quote still enters the
// canonical engine, including all stops, margins, fees and day boundaries.
export function advanceStaminaFatigue(state,{advance,canAdvance,maxTicks=64,budgetMs=4,now=()=>performance.now()}={}){
 const event=state.stamina?.fatigue,exits=[];let result=null,count=0,candleClosed=false,flash=null;
 if(!event||event.phase!=='advancing')return null;
 const finish=reason=>completeStaminaFatigue(state,{reason,at:consumedQuoteAt(state)});
 if(isLiveMarket(state)||event.mode==='live'){finish('live');return null;}
 const started=now();
 while(count<maxTicks&&now()-started<budgetMs){
  const at=consumedQuoteAt(state);
  if(at>=event.targetAt){finish('target');break;}
  if(!canAdvance(state)){finish('boundary');break;}
  const nextAt=nextQuoteAt(state);
  // A weekend, session break or the end of the loaded source is a real limit;
  // never stamp a fictional quote at the desired wake-up time.
  if(nextAt===null||!Number.isFinite(nextAt)||nextAt>event.targetAt){finish('boundary');break;}
  const day=state.day;
  result=advance(state);count++;exits.push(...(result?.exits||[]));candleClosed ||= !!result?.candleClosed;flash=result?.flash||flash;
  event.endAt=consumedQuoteAt(state);
  if(state.day!==day||result?.blocked||result?.dayEnded||!['decision','playing'].includes(state.phase)){finish('boundary');break;}
  if(event.endAt<=at){finish('boundary');break;}
 }
 if(event.phase==='advancing'&&consumedQuoteAt(state)>=event.targetAt)finish('target');
 return result?{...result,exits,exit:exits[0]||null,candleClosed,flash,fatigueTicks:count}:null;
}

export function mountStaminaFatigue({root=document,getState,canPresent=()=>true,canAdvance,advance,onTick=()=>{},onChange=()=>{},onComplete=()=>{},onError=()=>{},motionEnabled=()=>true,now=()=>performance.now()}={}){
 const win=root.defaultView,overlay=root.createElement('div'),label=root.createElement('span');
 overlay.className='stamina-exhaustion';overlay.hidden=true;overlay.setAttribute('aria-hidden','true');label.textContent='撑不住了，闭会儿眼。';overlay.append(label);root.body.append(overlay);
 let timer=null,observedState=null,ownedId=null,closing=false,processing=false,disposed=false,pageActive=true,pageFocused=true,lastCheckpoint=0;
 const listeners=[],listen=(node,type,fn,options)=>{node?.addEventListener?.(type,fn,options);listeners.push(()=>node?.removeEventListener?.(type,fn,options));};
 const clear=()=>{if(timer!==null)win.clearTimeout(timer);timer=null;overlay.hidden=true;closing=false;};
 const eligible=state=>!disposed&&pageActive&&pageFocused&&!root.hidden&&!root.querySelector('dialog[open]')&&canPresent(state)&&!state.marketPaused&&['decision','playing'].includes(state.phase);
 const busy=()=>staminaFatigueActive(getState());
 const changed=()=>{lastCheckpoint=now();onChange();};
 function pump(){
  timer=null;const state=getState();if(state!==observedState||!eligible(state)){clear();return;}
  processing=true;
  try{
   const result=advanceStaminaFatigue(state,{advance,canAdvance,now});
   const done=state.stamina?.fatigue?.phase==='done',important=!!(result?.exits?.length||result?.flash||result?.dayEnded);
   // A quote is a risk check, not a full UI update/save. Keep mobile work bounded
   // to 4ms slices, checkpoint at most twice per second, and paint final/critical results.
   if(result&&(important||done))onTick(result);
   if(done||now()-lastCheckpoint>=500)changed();
   if(done){clear();onComplete();}
   else timer=win.setTimeout(pump,16);
  }catch(error){completeStaminaFatigue(state,{reason:'interrupted',at:consumedQuoteAt(state)});clear();changed();onError(error);}
  finally{processing=false;}
 }
 function wake(){
  timer=null;const state=getState();overlay.hidden=true;closing=false;
  if(state!==observedState||!eligible(state))return;
  recoverStaminaFatigue(state);changed();pump();
 }
 function refresh(){
  if(disposed)return false;const state=getState();
  root.body.dataset.staminaLow=String(eligible(state)&&motionEnabled()&&state.stamina?.value>0&&state.stamina.value<20);
  if(state!==observedState){clear();observedState=state;ownedId=null;}
  if(processing)return busy();
  if(!eligible(state)){
   clear();
   if(staminaFatigueActive(state)&&!['decision','playing'].includes(state.phase)){completeStaminaFatigue(state,{reason:'interrupted',at:consumedQuoteAt(state)});changed();}
   return busy();
  }
  let event=state.stamina?.fatigue;
  if(event?.phase==='pending'&&state.stamina.value>0){completeStaminaFatigue(state,{reason:'recovered'});changed();event=null;}
  if(!staminaFatigueActive(state)&&state.stamina?.value===0){event=queueStaminaFatigue(state);changed();}
  if(!event||event.phase==='done')return false;
  if(event.phase==='pending'){
   const at=consumedQuoteAt(state);if(!Number.isFinite(at))return true;
   beginStaminaFatigue(state,{mode:isLiveMarket(state)?'live':isHistorical(state)?'historical':'simulation',at});ownedId=event.id;changed();
   if(!eligible(state))return true;
   overlay.dataset.reduced=String(!motionEnabled());overlay.hidden=false;closing=true;
   timer=win.setTimeout(wake,STAMINA_FATIGUE.durationMs);return true;
  }
  if(event.phase==='closing'){
   if(closing&&ownedId===event.id)return true;
   // Already claimed in a previous tab lifecycle or save. Do not black out again.
   recoverStaminaFatigue(state);changed();
  }
  if(event.phase==='advancing'&&timer===null)timer=win.setTimeout(pump,0);
  return busy();
 }
 const interrupt=()=>{clear();};
 // No focus trap or input interception. Any intent to trade reveals the screen
 // immediately while the single recovery/timeline transaction continues.
 const reveal=()=>{overlay.hidden=true;};
 listen(root,'pointerdown',reveal,true);listen(root,'focusin',reveal,true);
 listen(root,'keydown',reveal,true);
 listen(root,'visibilitychange',()=>{if(root.hidden)interrupt();else refresh();});
 listen(win,'blur',()=>{pageFocused=false;interrupt();refresh();});listen(win,'focus',()=>{pageFocused=true;refresh();});
 listen(win,'pagehide',()=>{pageActive=false;interrupt();});listen(win,'pageshow',()=>{pageActive=true;refresh();});
 listen(root,'beforetoggle',event=>{if(event.target?.tagName==='DIALOG'&&event.newState==='open')interrupt();},true);
 listen(root,'toggle',refresh,true);listen(root,'close',refresh,true);
 return{refresh,get busy(){return busy();},element:overlay,destroy(){disposed=true;clear();listeners.forEach(remove=>remove());delete root.body.dataset.staminaLow;overlay.remove();}};
}
