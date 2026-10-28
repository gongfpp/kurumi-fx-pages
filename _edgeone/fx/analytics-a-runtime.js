import {durationBand} from './analytics-a-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
// Browser lifecycle only. No URL, input value, key, coordinates or error text
// enter an event. Missing metrics remain missing, never zero-filled.
export function mountAnalyticsARuntime({client,game,document=globalThis.document,window=globalThis.window,navigator=globalThis.navigator,performance=globalThis.performance,isActive=()=>false,isTradable=()=>false,autoTimer=true}){
 let last=performance.now(),interaction=-Infinity,active=0,total=0,lastActive=last,run='',visited=false,tradable=false,wasActive=false,observers=[],vitals={},clsSession={start:0,last:0,value:0,max:0},interactions=new Map(),loadEligible=false,policyActive=false;
 const cleanup=[];const listen=(target,event,fn,options)=>{target?.addEventListener(event,fn,options);cleanup.push(()=>target?.removeEventListener(event,fn,options));};
 const emit=(name,data,context)=>client.emit(name,data,context);
 const elapsed=()=>Math.min(600000,Math.max(0,Math.round(performance.now())));
 function visit(){if(visited||!client.allowed())return;const returning=client.returning(),ua=navigator?.userAgent||'';
  const device=/ipad|tablet/i.test(ua)?'tablet':/mobile|iphone|android/i.test(ua)?'mobile':/windows|macintosh|x11|linux/i.test(ua)?'desktop':'unknown';
  visited=emit('visit.enter',{returning,device});
 }
 function startPerformance({buffered=false}={}){
  const Observer=window?.PerformanceObserver;if(!client.allowed()||!client.sample())return;
  const types=Observer?.supportedEntryTypes??[],support={lcp:types.includes('largest-contentful-paint'),inp:types.includes('event')&&Number.isSafeInteger(performance.interactionCount),cls:types.includes('layout-shift')};
  for(const [type,enabled]of [['largest-contentful-paint',support.lcp],['event',support.inp],['layout-shift',support.cls]])if(enabled){
   try{const observer=new Observer(list=>{for(const e of list.getEntries()){
    if(type==='largest-contentful-paint')vitals.lcp=Math.round(e.startTime);
    else if(type==='event'&&e.interactionId){interactions.set(e.interactionId,Math.max(e.duration,interactions.get(e.interactionId)||0));if(interactions.size>10){const smallest=[...interactions].sort((a,b)=>a[1]-b[1])[0];interactions.delete(smallest[0]);}const durations=[...interactions.values()].sort((a,b)=>b-a),index=Math.floor(performance.interactionCount/50);if(index<durations.length)vitals.inp=Math.round(durations[index]);else delete vitals.inp;}
    else if(type==='layout-shift'&&!e.hadRecentInput){if(!clsSession.value||e.startTime-clsSession.last>=1000||e.startTime-clsSession.start>=5000){clsSession.start=e.startTime;clsSession.value=0;}clsSession.last=e.startTime;clsSession.value+=e.value;clsSession.max=Math.max(clsSession.max,clsSession.value);vitals.cls=Math.round(clsSession.max*1000);}
   }});observer.observe({type,buffered,...(type==='event'?{durationThreshold:16}:{})});observers.push(observer);}catch{support[{'largest-contentful-paint':'lcp',event:'inp','layout-shift':'cls'}[type]]=false;}
  }
  emit('load.support',support);
 }
 function sendVitals(){for(const [metric,value]of Object.entries(vitals))if(Number.isInteger(value)&&value>=0&&value<=(metric==='cls'?10000:600000))emit('load.vital',{metric,value,support:'supported'});vitals={};}
 function begin({captureStartup=false}={}){visit();loadEligible=captureStartup;if(!client.allowed())return;
  if(captureStartup){emit('load.start',{elapsedMs:0});const marks=window.kurumiPixelBoot?.marks;for(const action of ['skeleton','ready'])if(Number.isFinite(marks?.[action]))emit('load.'+action,{elapsedMs:Math.min(600000,Math.round(marks[action]))});}
  if(captureStartup)startPerformance({buffered:true});last=performance.now();interaction=-Infinity;wasActive=false;
 }
 function flushActive(context=game.context()){
  if(active>0&&client.allowed()&&context.run)emit('runtime.active',{activeMs:Math.min(60000,Math.floor(active))},context);
  active=0;
 }
 function sample({closing=false}={}){
  const t=performance.now(),delta=t-last;last=t;
  if(!client.allowed()){if(policyActive)resetObservation();policyActive=false;active=total=0;wasActive=false;return;}
  if(!policyActive){resetObservation();policyActive=true;begin();}
  const current=game.context(),eligible=!document.hidden&&document.hasFocus?.()!==false&&isActive(),playing=eligible&&t-interaction<60000;
  if(run&&run!==current.run){flushActive(previous);if(total)emit('runtime.interruption',{reason:'run_replaced',durationBand:durationBand(total)},{...previous});active=total=0;wasActive=false;lastActive=t;}
  run=current.run;previous={...current};
  if(wasActive&&(eligible||closing)&&delta>=0&&delta<=5000){const observed=Math.min(delta,Math.max(0,interaction+60000-(t-delta)));active+=observed;total+=observed;}
  wasActive=playing;
  if(t-lastActive>=60000){flushActive(current);lastActive=t;client.coverage();void client.flush();}
  if(loadEligible&&!tradable&&isTradable()){tradable=true;emit('load.tradable',{elapsedMs:elapsed()});}
 }
 let previous={run:'',mode:'none',day:0,marketSource:'none'};
 const interact=e=>{if(e.isTrusted===false)return;sample();interaction=performance.now();wasActive=!document.hidden&&document.hasFocus?.()!==false&&isActive();client.interaction();};
 for(const type of ['pointerdown','keydown','touchstart','wheel'])listen(document,type,interact,{passive:true});
 const interrupt=reason=>{sample({closing:true});flushActive();wasActive=false;lastActive=performance.now();if(client.allowed()&&run)emit('runtime.interruption',{reason,durationBand:durationBand(total)},game.context());sendVitals();client.coverage();void client.flush();};
 // Normal cadence is one active event per minute. A final partial window is
 // sealed on hide/exit, then reset so visibilitychange+pagehide cannot count it twice.
 listen(document,'visibilitychange',()=>{sample({closing:document.hidden});wasActive=false;if(document.hidden){flushActive();lastActive=performance.now();sendVitals();void client.flush();}});
 listen(window,'blur',()=>{sample({closing:true});wasActive=false;});listen(window,'pagehide',()=>interrupt('pagehide'));listen(window,'pageshow',()=>{last=performance.now();wasActive=false;});
 listen(window,'online',()=>void client.flush());
 listen(window,'error',e=>{const tag=e.target?.tagName?.toLowerCase();if(tag&&tag!=='html'){const resource=({script:'script',link:'style',img:'image',audio:'audio',source:'audio'})[tag]||'other';emit('load.resource_failure',{resource,code:'unknown'});}else emit('runtime.error',{scope:'runtime',code:'runtime_error'},game.context());},true);
 listen(window,'unhandledrejection',()=>emit('runtime.error',{scope:'runtime',code:'unhandled_rejection'},game.context()));
 listen(document,'kurumi-boot-observed',e=>{if(!loadEligible||!client.allowed()||!['ready','skeleton'].includes(e.detail))return;emit('load.'+e.detail,{elapsedMs:elapsed()});});
 const menus={'privacy-dialog':'stats','help-dialog':'help','leaderboard-dialog':'leaderboard','comment-credits-dialog':'comments','save-restore-dialog':'save','save-conflict-dialog':'save','bgm-dialog':'settings','voice-library-dialog':'settings','achievements-dialog':'stats'};
 const menuStates=new WeakMap();
 const observeMenu=e=>{const target=e.target,menu=menus[target?.id]||(target?.matches?.('.pixel-settings')?'settings':null);if(!menu)return;const open=!!target.open;if(menuStates.get(target)===open)return;menuStates.set(target,open);emit('runtime.menu',{menu,action:open?'open':'close'},game.context());};
 for(const id of Object.keys(menus)){const el=document.getElementById(id);if(el)listen(el,'toggle',observeMenu);}
 // Capture also sees the settings drawer created by the lazy pixel renderer.
 // The WeakMap prevents the same native toggle being counted by both listeners.
 listen(document,'toggle',observeMenu,true);
 const buttons=[document.getElementById('analytics-a-confirm'),document.getElementById('analytics-a-quick-toggle')].filter(Boolean),status=document.getElementById('analytics-a-state'),notice=document.getElementById('analytics-a-notice');
 function resetObservation(){visited=false;for(const o of observers)o.disconnect();observers=[];vitals={};interactions.clear();clsSession={start:0,last:0,value:0,max:0};loadEligible=false;active=total=0;last=lastActive=performance.now();interaction=-Infinity;wasActive=false;run='';previous={run:'',mode:'none',day:0,marketSource:'none'};tradable=false;}
 function renderConsent(){
  const s=client.snapshot(),off=s.preference==='off';
  const copy={'consent-off':'统计已关闭','browser-privacy':'浏览器隐私设置已关闭统计','storage':'无法读取统计设置，当前不发送统计','developer-test':'研究与开发测试局不统计','known-automation':'自动化访问不统计','receiver-closed':'统计接收暂未启用','source-unconfigured':'此入口未启用统计'};
  if(status)status.textContent=s.preferenceError==='cleanup'?'统计已关闭，本机统计数据未能清理':s.preferenceError==='storage'?'本页统计已关闭，关闭设置未能保存':copy[s.reason]||(off?'统计已关闭':s.preference==='default'?'统计按默认设置开启':'统计已开启');
  for(const button of buttons){button.textContent=s.preferenceError?'重试关闭统计':off?'恢复统计':'关闭统计';button.disabled=!s.preferenceError&&(s.preference==='unavailable'||off&&s.reason==='browser-privacy');}
  if(notice){notice.hidden=off||s.preference==='unavailable';notice.textContent=s.preference==='default'?'默认记录同站匿名使用情况及行情来源':'同站匿名使用统计（含行情来源）';}
 }
 const changePreference=()=>{const prior=client.snapshot(),next=prior.preference==='off'&&!prior.preferenceError;client.setConsent(next);resetObservation();policyActive=client.allowed();if(policyActive)begin();renderConsent();};
 for(const button of buttons)listen(button,'click',changePreference);
 listen(window,'storage',()=>{const next=client.allowed();if(next!==policyActive){resetObservation();policyActive=next;if(next)begin();}renderConsent();});
 listen(document.getElementById('privacy-dialog'),'toggle',renderConsent);
 renderConsent();policyActive=client.allowed();begin({captureStartup:policyActive});
 const timer=autoTimer?setInterval(sample,1000):null;
 return {sample,interrupt,renderConsent,destroy(){if(timer)clearInterval(timer);for(const off of cleanup)off();for(const o of observers)o.disconnect();client.destroy();}};
}
