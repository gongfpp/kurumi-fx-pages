import {settledComicArt} from './settled-comic-art.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {propEventArt,livingEventArt} from './prop-event-art.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {selectFinalPortrait} from './final-portrait.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {prepareDailyNarrative,finishDailyNarrative} from './day-narrative.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {fatherDiscoveryHint,fatherItemIllustration,applyFatherDiscovery} from './father-discovery.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {renderFatherIllustration,renderFatherSequence} from './father-view.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {mountLivingReceipt} from './living-view.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {canRequestWalkaway,walkawayConfirmation,requestWalkaway} from './walkaway.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {buildResultsReport} from './results-report.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {mountResultsReport} from './results-view.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {settlementPresentation,enterSettlementStory,canConfirmSettlementStory,completeSettlementStory} from './settlement-stage.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {buildRecapSnapshot} from './daily-recap.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {mountDailyRecap} from './recap-view.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {timedCandles,timeAxisTicks,formatTradingTime,currentTradingTimestamp,reportTradingTimestamp,TRADING_TIME_NOTICE} from './trading-time.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {setMangaImage} from './manga-images.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {createEmotionOverview} from './emotion-overview.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {tradingTrauma} from './trading-trauma.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {GENERATED_EXTREME_EXPRESSIONS} from './generated-emotion-assets.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {renderLiquidationMeter} from './liquidation-meter.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {investorMessages} from './npc-investors.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {observeNumericLayout} from './numeric-layout.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createVoiceContextSelector} from './voice-timing.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {unlockSafeAudio} from './audio-envelope.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {enhanceDialogs} from './dialogs.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createEmotionControls} from './emotion-controls.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {selectMangaPortrait,showMangaPortrait} from './manga-portraits.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {selectNarrativeManga,selectDailyManga,sealedDailyMangaOutcome} from './manga-context.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {renderMangaSelection} from './manga-render.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {ACHIEVEMENTS,evaluateAchievements,createAchievementToast,renderAchievementBook} from './achievements.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {selectDailyScene} from './daily-scene.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createShareCard} from './share-card.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {buildShareFile,canShareFile,shareReportFile} from './share-export.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createGameStorage} from './storage.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {kurumiStorage, storageEventMatches} from './storage-namespace.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createSaveSession} from './save-session.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {sliderOrderAmount,randomOrderAmount,normalizeOrderAmount,draftOrderAmount,orderAmountRatio,nearestOrderRatio,ratioOrderAmount} from './amount-controls.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {runPerformance} from './performance.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {TERMINAL_HELP,OPENING_STORY} from './copy/terminal-help.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {PROP_LINES} from './copy/items.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {UI_COPY} from './copy/ui.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {formatQuote as quote,formatQuantity,directionLabel,positionQuantity} from './market.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {TRANSITION_COPY,dailyContinueLabel} from './copy/transitions.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {FXLeaderboard,completedLeaderboardScore} from './leaderboard.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {setImage,assetURL} from './assets.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {itemUnlocked,itemDiscovered,itemUnavailableReason} from './item-events.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {createGame, takeAction, advanceTick, nextDay, equity, unrealized, mood, currentEvent, useProp, mentalState, tradingProfit, restoreGame, START, TARGET_PROFIT, settleDay, finishTradingDay, chooseRecapAction, finalizeDayLiving, dailyReturnMetrics, beginRest, finishCampaign, finishEndlessCampaign, endingCondition, pendingStory, chooseStory, restrictions, DEBUFFS, repayFather,beatsPerDay,nearStopOrders,topUpMargin,rescueClose,borrowNetwork,repayNetwork,networkLoanTerms,debtSummary,positionsOf,positionUnrealized,positionNetUnrealized,positionStopLoss,accountMetrics,orderPreview,accountLiquidationEstimate,enableRealtime,advanceMarket,tradingOpen} from './engine.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

import {FXAudio} from './audio.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {MarketClock} from './market-clock.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {bindMarketLifecycle} from './page-lifecycle.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {GameMotion} from './motion.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {MOODS, PROPS} from './content.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {VoicePlayer,availableVoices,VOICE_LINES} from './voice.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {mountVoiceLibrary} from './voice-library.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {FXTelemetry,capitalBucket,pnlBucket} from './telemetry.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {applyDeveloperPatch,developerValues} from './developer.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';
import {comicCaptions,approvedQuote} from './dialogue.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

// Fail closed until the independent service can verify a server-side session.
// This UI gate is not authentication and never embeds a password.
const DEVELOPER_EDITING_AVAILABLE=false;
const DEVELOPER_UNAVAILABLE_MESSAGE='开发者编辑暂未开放，等待独立安全验证服务接通。现有存档与本地导出不受影响。';
const $ = id => document.getElementById(id);
const storage=createGameStorage(()=>kurumiStorage());
const yen = value => `${value<0?'−':''}¥${Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const signed = value => `${value>0?'+':''}${yen(value)}`;
const saveKeyFor=mode=>mode==='endless'?'fx-girl-endless-v1':'fx-girl-campaign-v3';
let selectedMode=storage.getItem('fx-girl-mode')==='endless'?'endless':'story';
let saveKey=saveKeyFor(selectedMode);
const settingsKey = 'fx-girl-settings';
let developerBackupKey=selectedMode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
const fresh = (mode=selectedMode) => createGame(crypto.getRandomValues(new Uint32Array(1))[0],{mode});
const saveSessions=new Map(),modeStates=new Map();
function sessionFor(mode){if(!saveSessions.has(mode))saveSessions.set(mode,createSaveSession({storage,key:saveKeyFor(mode),legacyKey:mode==='story'?'fx-girl-campaign-v2':null,restore:raw=>{const saved=restoreGame(raw);return saved?.mode===mode?saved:null;}}));return saveSessions.get(mode);}
let saveSession=sessionFor(selectedMode);
const initialSave=saveSession.raw;
let state=enableRealtime(restoreGame(initialSave)||fresh());
const firstVisit=!initialSave&&!storage.getItem('fx-girl-mode');
let deferredScene=null;
const sceneKey=()=>`${stateGeneration}:${state.mode}:${state.runId}:${state.day}:${state.phase}`;
let orderAmount=draftOrderAmount(state), shareUrl=null,shareFile=null,shareBusy=false,shareRequest=0,stateGeneration=0;
const achievementKey='fx-jiuliumei-achievements-v1';
let achievementProfile;try{achievementProfile=JSON.parse(storage.getItem(achievementKey)||'{}');}catch{achievementProfile={};}
let leverage=25, stop=.5, stopPips=30, speed=1, actionBusy=false,  shownFlashTimer, toastTimer, propFrame;
let sound = storage.getItem(settingsKey)!=='mute';
let voiceEnabled=storage.getItem('fx-girl-voice')!=='off';
let fullMotion=storage.getItem('fx-girl-motion')!=='reduce';
const telemetry=new FXTelemetry({enabled:storage.getItem('fx-girl-analytics')!=='off',testMode:!!state.developer?.edited,build:'fx-runtime-polish-v6'});
const leaderboard=new FXLeaderboard();
state.runId ||= crypto.randomUUID();let lastMood=null;
const bucket=n=>n<25?'0-24':n<50?'25-49':n<75?'50-74':'75-100';
function track(name,target,detail={},key){if(key)telemetry.emit(name,target,{detail,dedupeKey:state.runId+':'+key});else telemetry.action(name,target,detail);}
function trackExit(t){if(t)track('trade_close',t.type,{direction:t.direction===1?'long':'short',pnlBucket:pnlBucket(t.pnl),leverage:t.leverage},`exit:${state.day}:${t.positionId||t.id||'legacy'}:${t.type}:${t.margin}:${t.pnl}`);}
const audio = new FXAudio();
audio.configure({sound,soundVolume:.5});
const voice=new VoicePlayer({onUpdate:()=>render(),onPlay:line=>track('voice_play',line.id,{mood:mood(state),dialogueId:line.id}),onReject:line=>track('voice_rejected',line.id,{reason:'playback-unavailable',dialogueId:line.id})});
const motion = new GameMotion();motion.configure(fullMotion);document.body.classList.toggle('motion-full',fullMotion);
const moodInfo = MOODS;
const selectVoiceContext=createVoiceContextSelector();
const emotionOverview=createEmotionOverview();
const shouldAnimate=()=>motion.enabled&&fullMotion;
const marketClock=new MarketClock({
  canRun:()=>!saveSession.blocked&&tradingOpen(state)&&!state.marketPaused&&!document.hidden,
  canStep:()=>!actionBusy&&!document.querySelector('dialog[open]'),
  interval:()=>1000/speed,
  step:()=>{if(!guardProgress())return;const result=advanceMarket(state);afterTick(result);if(!tradingOpen(state))continueScenes();},
  onError:error=>{state.marketPaused=true;render();toast('行情暂缓：'+error.message,'loss');}
});
function marketStatus(){
  const paused=state.marketPaused,modal=!!document.querySelector('dialog[open]');
  setText('market-phase',saveSession.blocked?'存档已变更 · 本页暂停':tradingOpen(state)?paused?'点倍速继续行情':document.hidden?'后台暂缓':modal?'查看窗口 · 行情暂缓':'实时行情 · 运行中':state.phase==='closing'?'今日收盘':'休市');
  $('finish-day').hidden=state.mode==='endless';$('finish-day').disabled=state.mode==='endless'||!tradingOpen(state)||actionBusy||saveSession.blocked;
}

function updateSaveStatus(){
  const blocked=saveSession.blocked,saved=saveSession.status==='saved',pending=saveSession.status==='pending';
  $('saved').textContent=blocked?'存档待处理':saved?'✓':pending?'保存中':'进度仅在本页';
  $('saved').title=blocked?'已暂停本页，未覆盖其他页面的进度':saved?'进度已保存':pending?'正在保存，完成前请勿刷新或关闭':'浏览器暂时无法安全保存，刷新或关闭后本页进度会丢失';
  $('storage-warning').hidden=saved||pending;$('storage-warning-panel').hidden=saved||pending;
  setText('storage-warning',blocked?'检测到存档变化。本页已暂停，请先处理存档。':saveSession.reason==='coordination'?'浏览器暂不支持安全的跨页保存。本页仍可游玩，请勿刷新或关闭；可下载本页进度备份。':UI_COPY.storageWarning);
  if(blocked){
    marketClock.stop();audio.pause();voice.stop();marketStatus();
    setText('save-conflict-copy',saveSession.status==='invalid'?'当前存档损坏、模式不匹配，或来自更新版本。为保护原数据，本页不会覆盖它。请先下载备份，修复后再重试载入。':'其他页面已更新此模式的存档。本页已暂停，未覆盖最新进度。你可以先下载本页备份，再载入最新存档；载入会替换本页进度。');
    if(!$('save-conflict-dialog').open)$('save-conflict-dialog').showModal();
  }
}
function guardProgress(){const ok=saveSession.check();if(!ok)updateSaveStatus();return ok;}
function persist(){const session=saveSession,pending=session.save(state);updateSaveStatus();return pending.then(saved=>{if(session===saveSession)updateSaveStatus();return saved;});}
// All state-changing controls, including keyboard-triggered clicks and forms,
// are checked before their handlers. Timer/scene mutations also check explicitly.
for(const type of ['click','submit','input','change','cancel'])document.addEventListener(type,event=>{
  if(event.target.closest?.('#save-conflict-dialog')||event.target.closest?.('[data-save-backup]'))return;
  if(!guardProgress()){event.preventDefault();event.stopImmediatePropagation();}
},true);
const emotionControls=createEmotionControls({getState:()=>state,getLimits:()=>restrictions(state),
  getContext:button=>({hardBlocked:!tradingOpen(state)||actionBusy||saveSession.blocked||accountMetrics(state).availableMargin<100*(1+Number(button?.dataset.leverage??leverage)*.00005),emotion:mood(state),profit:tradingProfit(state),unrealized:currentNetFloating()}),
  canInteract:()=>guardProgress()&&!actionBusy,onChange:()=>render(),audio,motion,motionEnabled:shouldAnimate});
window.addEventListener('storage',event=>{if(storageEventMatches(event.key,saveKey)||storageEventMatches(event.key,saveSession.legacyKey))guardProgress();});
function downloadProgressBackup(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(saveSession.backup(state),null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.dataset.saveBackup='';link.href=url;link.download=`FX-${selectedMode}-进度备份.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
for(const button of document.querySelectorAll('[data-save-backup]'))button.onclick=downloadProgressBackup;
$('save-retry').onclick=()=>void persist();
$('save-conflict-dialog').addEventListener('cancel',event=>event.preventDefault());
$('save-load-latest').onclick=()=>{
  const loaded=saveSession.reload();
  if(!loaded.ok){setText('save-conflict-copy',loaded.reason==='storage'?'浏览器仍无法读取存档。请保留本页，可先下载进度备份，再重试。':'当前存档仍无法识别，未覆盖任何数据。请先下载备份，修复后再重试。');return;}
  stateGeneration++;marketClock.stop();state=enableRealtime(loaded.state||fresh());state.runId||=crypto.randomUUID();
  telemetry.setTestMode(!!state.developer?.edited);voice.stop();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  $('last-trade').textContent='';render();continueScenes();marketClock.start();
};
function currentNetFloating(){return positionsOf(state).reduce((sum,position)=>sum+positionNetUnrealized(state,position),0);}
function currentRisk(){return Math.round(accountMetrics(state).usedMargin/Math.max(accountMetrics(state).tradingEquity,1)*100);}
function selectedOrder(type='long'){return {type,leverage,stop,stopPips,amount:orderAmount};}
function selectedPercentage(){return (orderAmountRatio(orderAmount,accountMetrics(state).availableMargin)||0)*100;}
function setText(id,value){if($(id))$(id).textContent=value;}
function chart(){
  const candles=timedCandles(state,state.candles.slice(-30)), w=660,h=268,left=8,right=70,top=14,bottom=36;
  const max=Math.max(state.price,...candles.map(c=>c.high)),min=Math.min(state.price,...candles.map(c=>c.low));
  const padding=Math.max(.01,(max-min)*.08),hi=max+padding,lo=Math.max(.001,min-padding);
  const y=value=>top+(hi-value)/(hi-lo)*(h-top-bottom),dx=(w-left-right)/candles.length;
  const parts=[`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">`];
  for(let i=0;i<5;i++){const value=hi-(hi-lo)*i/4,Y=y(value);parts.push(`<line x1="${left}" x2="${w-right}" y1="${Y}" y2="${Y}" stroke="#494454" stroke-dasharray="3 5"/><text x="${w-right+9}" y="${Y+4}" fill="#aaa3b7" font-size="11">${quote(value)}</text>`);}
  candles.forEach((c,i)=>{const x=left+dx*(i+.5),color=c.close>=c.open?'#8ae4bf':'#f58cba';
    parts.push(`<g><title>${formatTradingTime(c.timestamp,{full:true})} · 开 ${quote(c.open)} / 高 ${quote(c.high)} / 低 ${quote(c.low)} / 收 ${quote(c.close)}</title><line x1="${x}" x2="${x}" y1="${y(c.high)}" y2="${y(c.low)}" stroke="${color}" stroke-width="1.5"/><rect x="${x-dx*.29}" y="${Math.min(y(c.open),y(c.close))}" width="${dx*.58}" height="${Math.max(1.5,Math.abs(y(c.open)-y(c.close)))}" fill="${color}" rx="1"/></g>`);

  });
  for(const t of timeAxisTicks(candles,{maxTicks:5})){const x=left+dx*(t.index+.5);parts.push(`<text x="${x}" y="${h-9}" text-anchor="${t.index===0?'start':t.index===candles.length-1?'end':'middle'}" fill="#ccc2d0" font-size="10">${t.label}</text>`);}
  const Y=y(state.price);parts.push(`<line x1="${left}" x2="${w-right}" y1="${Y}" y2="${Y}" stroke="#f1b4d3" stroke-dasharray="4 4" opacity=".7"/><rect x="${w-right+4}" y="${Y-10}" width="64" height="20" rx="3" fill="#f2a5c8"/><text x="${w-right+36}" y="${Y+4}" text-anchor="middle" fill="#2b2230" font-size="11">${quote(state.price)}</text></svg>`);
  setText('trading-clock-label',formatTradingTime(currentTradingTimestamp(state),{full:true})+' · K线 15分钟 · '+TRADING_TIME_NOTICE.replace('游戏交易钟 · JST · 每根 K 线 15 分钟 · ',''));
  $('chart').innerHTML=parts.join('');$('chart').setAttribute('aria-label',`USD/JPY 美元兑日元已发生行情，现价 ${quote(state.price)} 日元/美元；绿色为收盘不低于开盘，粉色为收盘低于开盘。${formatTradingTime(currentTradingTimestamp(state),{full:true})}；每根 K 线 15 游戏分钟`);
}
function renderPositions(orders,enabled){
  const box=$('position-list'),ids=new Set(orders.map(p=>p.id));
  for(const row of [...box.children])if(!ids.has(row.dataset.orderId))row.remove();
  for(const p of orders){
    let row=[...box.children].find(el=>el.dataset.orderId===p.id);
    if(!row){
      row=document.createElement('article');row.className='order-row';row.dataset.orderId=p.id;
      const head=document.createElement('div');head.className='order-row-head';
      const title=document.createElement('b'),tag=document.createElement('span'),detail=document.createElement('button');
      title.dataset.orderTitle='';tag.dataset.orderLeverage='';detail.className='help-dot';detail.textContent='?';detail.dataset.positionDetail=p.id;detail.setAttribute('aria-label',`查看订单 ${p.id} 详情`);head.append(title,tag,detail);row.append(head);
      for(const [field,label] of [['pnl','浮动盈亏'],['margin','保证金'],['stop','止损']]){
        const line=document.createElement('div');line.className='order-row-data';const key=document.createElement('span'),val=document.createElement('b');key.textContent=label;val.dataset.orderField=field;if(field==='pnl')line.classList.add('order-live-pnl');line.append(key,val);row.append(line);
      }
      const actions=document.createElement('div');actions.className='order-row-actions';
      for(const [action,label] of [['half','本单减半'],['close','本单平仓']]){const b=document.createElement('button');b.dataset.positionId=p.id;b.dataset.positionAction=action;b.textContent=label;actions.append(b);}row.append(actions);
      const bar=document.createElement('div');bar.className='stop-progress';bar.append(document.createElement('i'));row.append(bar);box.append(row);
    }
    row.querySelector('[data-order-title]').textContent=`#${p.id} · ${p.direction===1?'↗':'↘'} ${directionLabel(p.direction)}${p.pnlModel==='legacy-inverse-v5'?' · 旧版结算':''}`;
    row.querySelector('[data-order-leverage]').textContent=`${Number(p.leverage.toFixed(1))}×`;
    const net=positionUnrealized(state,p),loss=positionStopLoss(p),pnl=row.querySelector('[data-order-field="pnl"]');
    pnl.textContent=signed(net);pnl.className=net>=0?'positive':'negative';
    row.querySelector('[data-order-field="margin"]').textContent=yen(p.margin);
    row.querySelector('[data-order-field="stop"]').textContent=Object.hasOwn(p,'stopPips')&&p.stopPips!==null?`${p.stopPips} 点 · 约 −${yen(loss)}`:p.stop===1?'不预设':`约 −${yen(loss)}`;
    for(const b of row.querySelectorAll('[data-position-action]'))b.disabled=!enabled;
    const bar=row.querySelector('.stop-progress'),hasStop=Number.isFinite(loss)&&loss>0;bar.hidden=!hasStop;
    if(hasStop){const progress=Math.max(0,-net/loss);bar.firstElementChild.style.width=Math.min(100,progress*100)+'%';bar.classList.toggle('danger',progress>=.75);bar.setAttribute('aria-label','止损进度 '+Math.round(progress*100)+'%');}
  }
}
function openDetails(title,lines,source=null,extra=null){
  setText('detail-title',title);const box=$('detail-copy');box.replaceChildren();for(const text of lines){const p=document.createElement('p');p.textContent=text;box.append(p);}if(extra){const copy=extra.cloneNode(true);copy.hidden=false;copy.removeAttribute('id');for(const node of copy.querySelectorAll('[id]'))node.removeAttribute('id');box.append(copy);}if(source){const a=document.createElement('a');a.textContent=source[0]+' ↗';a.href=source[1];a.target='_blank';a.rel='noopener';box.append(a);}$('detail-dialog').showModal();
}
function openPositionDetail(id){
  const p=positionsOf(state).find(p=>p.id===id);if(!p)return;
  const notional=p.notional??p.margin*p.leverage,legacy=p.pnlModel==='legacy-inverse-v5';
  const lines=[`${directionLabel(p.direction)}：${p.direction===1?'买入美元、卖出日元':'卖出美元、买入日元'}。`,`开仓 USD/JPY ${quote(p.entry)}，当前 ${quote(state.price)}，单位为日元/美元。`,`保证金 ${yen(p.margin)}，开仓日元名义仓位 ${yen(notional)}。`];
  if(legacy)lines.push('旧存档持仓：报价和买卖方向已换算为 USD/JPY，此单沿用旧版反向合约结算，保留原有盈亏；不套用新单的美元数量公式。');
  else lines.push(`美元数量 ${formatQuantity(positionQuantity(p))} USD；日元浮动盈亏 = 美元数量 ×（当前价 − 开仓价）× 方向（做多 +1，做空 −1）。`);
  lines.push(`已付开仓费用 ${yen(p.openFee||0)}，预计平仓费用 ${yen(notional*.00005)}。`,Number.isFinite(p.stopPrice)?`止损价 USD/JPY ${quote(p.stopPrice)} 日元/美元。`:'未设置固定止损价。','浮动盈亏尚未扣除预计平仓费用。费用采用简化模型，开平各收开仓日元名义仓位的 0.005%。');
  openDetails('订单 #'+p.id,lines);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-help]');if(!b)return;const key=b.dataset.help,h=TERMINAL_HELP[key];if(h)openDetails(h.title,h.lines,h.source,key==='account'?$('account-details'):key==='order'?$('order-details'):key==='mental'?$('mental-detail'):null);});
let openingPage=0;
function showOpening(){openingPage=0;renderOpening();if(!$('opening-dialog').open)$('opening-dialog').showModal();}
function renderOpening(){const page=OPENING_STORY[openingPage];setText('opening-count',`序章 / ${openingPage+1} · ${OPENING_STORY.length}`);setText('opening-title',page.title);setText('opening-copy',page.text);$('opening-face').hidden=true;renderMangaSelection($('opening-manga'),selectNarrativeManga(state,{kind:'opening',index:openingPage}),{openSource:openMangaSource});setText('opening-next',openingPage===OPENING_STORY.length-1?'打开交易软件':'继续');}
function finishOpening(){if(!guardProgress())return;state.openingSeen=true;$('opening-dialog').close();persist();continueScenes();}
$('opening-next').onclick=()=>{if(++openingPage>=OPENING_STORY.length)finishOpening();else renderOpening();};$('opening-skip').onclick=finishOpening;$('opening-dialog').addEventListener('cancel',e=>{e.preventDefault();finishOpening();});
$('mode-open').onclick=()=>$('mode-dialog').showModal();
function openMangaSource(p,reason){const img=document.createElement('img');setMangaImage(img,p.original,{loading:'eager'});img.alt='未经修改的原作来源图';img.style.width='100%';openDetails(`漫画来源 · 第 ${p.chapter} 话第 ${p.page} 页`,[`${p.character} / ${p.scene} / ${p.expression}`,reason,p.correction||p.meaning,'原图金额、图表与时间只属于漫画，不代表本局账户。'],['用户指定仓库 · 固定版本原文件',p.sourceURL],img);const shown=$('detail-copy').querySelector('img');if(shown)setMangaImage(shown,p.original,{loading:'eager'});}
function scenePortrait(s){return selectFinalPortrait(s,{manga:selectMangaPortrait(s),sealedOutcome:sealedDailyMangaOutcome(s)});}
function showPortraitSource(){const result=scenePortrait(state);if(result.kind==='manga')openMangaSource(result.panel,result.evidence);else{const image=document.createElement('img');setImage(image,result.path);image.style.width='100%';openDetails('素材出处',[result.sourceLabel,'本作角色插画'],null,image);}}
$('portrait-source-open').onclick=showPortraitSource;
for(const b of document.querySelectorAll('[data-play-mode]'))b.onclick=async()=>{
  if(actionBusy||!guardProgress())return;const mode=b.dataset.playMode,generation=stateGeneration,session=saveSession;actionBusy=true;marketClock.stop();await persist();if(generation!==stateGeneration||session!==saveSession)return;actionBusy=false;if(saveSession.blocked)return;stateGeneration++;modeStates.set(selectedMode,state);selectedMode=mode;saveKey=saveKeyFor(mode);saveSession=sessionFor(mode);developerBackupKey=mode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';storage.setItem('fx-girl-mode',mode);state=enableRealtime(modeStates.get(mode)||restoreGame(saveSession.raw)||fresh(mode));state.runId||=crypto.randomUUID();telemetry.setTestMode(!!state.developer?.edited);voice.stop();lastMood=null;leverage=25;stopPips=30;stop=.5;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;$('mode-dialog').close();if(!guardProgress())return;render();if(mode==='story'&&!state.openingSeen)showOpening();else continueScenes();marketClock.start();
};
function checkAchievements(){
  const result=evaluateAchievements(state,achievementProfile);achievementProfile=result.profile;
  if(result.newlyUnlocked.length){try{storage.setItem(achievementKey,JSON.stringify(achievementProfile));}catch{}for(const def of result.newlyUnlocked){createAchievementToast(def);if(sound)soundEffect('gain',{level:.3});}}
  setText('achievement-count',String(Object.keys(achievementProfile.unlocked||{}).length));
  if($('achievements-dialog').open)renderAchievementBook($('achievement-book'),achievementProfile,state);
}
function openAchievements(){renderAchievementBook($('achievement-book'),achievementProfile,state);$('achievements-dialog').showModal();}
async function openShare(variant='report'){
  if(typeof variant!=='string')variant='report';setText('share-title',variant==='ranking'?'我的战绩':'这次的战报');
  if(actionBusy)return;
  const request=++shareRequest;const dialog=$('share-dialog');if(!dialog.open)dialog.showModal();
  shareFile=null;$('share-preview').hidden=true;$('share-actions').hidden=true;$('share-native').hidden=true;setText('share-status','正在制作战报…');
  const snapshot=structuredClone(state),em=mood(snapshot),portrait=scenePortrait(snapshot);
  try{
    const card=await createShareCard(snapshot,{variant,equity:equity(snapshot),tradingProfit:tradingProfit(snapshot),unrealized:unrealized(snapshot),moodLabel:$('emotion-label').textContent||moodInfo[em]?.[0]||'平静',portraitUrl:assetURL(portrait.kind==='manga'?portrait.panel.original:portrait.path),portraitCrop:portrait.kind==='manga'?portrait.panel.cropPixels:null,gameUrl:location.href.split('#')[0],achievementProfile:structuredClone(achievementProfile),report:snapshot.dayReport,recap:dayRecapSnapshot||buildRecapSnapshot(snapshot)});

    if(request!==shareRequest){URL.revokeObjectURL(card.url);return;}if(shareUrl)URL.revokeObjectURL(shareUrl);shareUrl=card.url;
    shareFile=buildShareFile(card);$('share-preview').src=shareUrl;$('share-preview').hidden=false;$('share-download').href=shareUrl;$('share-download').download=card.filename||`FX韭留美-第${snapshot.day}天.png`;$('share-original').href=shareUrl;$('share-actions').hidden=false;$('share-native').hidden=!canShareFile(shareFile);$('share-native').disabled=shareBusy;setText('share-status',snapshot.developer?.edited?'开发测试战报 · 不计入成就':'战报已生成，可保存原图');
  }catch(error){setText('share-status','战报生成失败：'+error.message);}
}
function syncDayReportPresentation(){
 const current=state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase);
 dayRecapSnapshot=current?buildRecapSnapshot(state):null;
 const n=state.settlementNarrative,ready=state.mode==='story'&&n?.day===state.day&&n.fatherDiscovery&&n.effectsApplied&&state.family?.unlocked&&!state.fatherUsed;
 $('father-scene-use').hidden=!ready;$('father-scene-use').disabled=!ready;
 setText('father-scene-use','取用父亲的柜中存款 ¥3,000,000');
 if(dayRecapSnapshot){setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);}
}
function render(){
  if(!guardProgress())return;
  if(deferredScene?.key!==sceneKey())deferredScene=null;
  $('scene-resume').hidden=!deferredScene;
  const mental=mentalState(state),limit=restrictions(state);leverage=Math.max(limit.minLeverage,Math.min(leverage,limit.leverage));if(![5,10,25,50,100].includes(leverage))leverage=leverage<25?10:25;if(limit.forceNoStop){stopPips=null;stop=1;}
  const day=state.day,phase=state.phase,position=state.position,marketPlaying=phase==='playing',end=['day_end','resting','ending'].includes(phase),closing=phase==='closing';
  const account=equity(state),event=currentEvent(state),em=mood(state),info=moodInfo[em]||['平静','calm'];
  const dayNet=account-state.dayOpening-(state.externalFunding-state.dayOpeningFunding)+(state.expenses-state.dayOpeningExpenses);
  const endless=state.mode==='endless',stats=runPerformance(state);
  setText('mode-open',endless?'操盘模式 ▾':'剧情模式 ▾');setText('restart',endless?'重新操盘':'重新开始章节');
  setText('stage-name',`${endless?'操盘':'剧情'} · 第 ${day} 天`);
  setText('mission-title',endless?`已存活 ${stats.daysSurvived} 天`:end?'今日结算':'今日开盘');
  setText('mission-copy',endless?`已平仓 ${stats.closedTrades} 笔`:end?`收盘资产 ${yen(state.dayReport?.day===day?state.dayReport.closing:account)}`:`本日开盘 ${yen(state.dayOpening)} · ${state.beat*4+(state.pending?.candle||0)} / ${beatsPerDay(state)*4} 根 K 线`);
  setText('chapter-target',endless?`总收益率 ${(stats.returnRate*100).toFixed(2)}% · 交易收益 ${signed(stats.totalProfit)}`:`交易净收益 ${signed(tradingProfit(state))} · 首章目标 +${yen(TARGET_PROFIT)}`);
  const sealedDay=sealedDailyMangaOutcome(state),trauma=tradingTrauma(state),portrait=scenePortrait(state);
  setText('emotion-label',trauma.active?trauma.label:sealedDay?sealedDay.label:portrait.label||info[0]);emotionOverview.render(state,portrait.emotion||em);document.body.dataset.trauma=trauma.active?trauma.mood:'';

  const reversal=state.lastReaction?.day===state.day?state.lastReaction?.reversal:null;
  $('portrait').hidden=false;setText('portrait-context','');setText('portrait-source','');$('portrait-source-open').hidden=false;
  if(portrait.kind==='manga'){showMangaPortrait($('portrait'),portrait.panel);$('portrait').dataset.manga=portrait.panel.id;}
  else{$('portrait').removeAttribute('style');$('portrait').parentElement.classList.remove('manga-viewport');$('portrait').parentElement.style.aspectRatio='';delete $('portrait').dataset.manga;setImage($('portrait'),portrait.path);$('portrait').dataset.mood=portrait.emotion;$('portrait').alt=`久留美此刻${portrait.label}`;}
  const voiceContext=selectVoiceContext(state,{floating:currentNetFloating(),hasPositions:positionsOf(state).length>0});
  const voiceReversal=reversal==='profit-to-loss'&&voiceContext.pnl<0||reversal==='loss-to-profit'&&voiceContext.pnl>0?reversal:null;
  const voiceEmotion=voiceReversal||(em==='stunned'?'blank':em);const voiced=$('voice-library-dialog').open?null:voice.sync({enabled:voiceEnabled,emotion:voiceEmotion,speechId:state.speech?.id,run:state.runId,context:voiceContext});
  setText('speech',trauma.active?trauma.line:voiced?.zh||state.speech?.text||'');setText('voice-caption',voiced?`PV 原声 · ${voiced.speaker||'久留美'} · ${voiced.ja||''}`:'');$('voice-caption').hidden=!voiced;
  const voiceStatus=voiceEnabled?(voice.lastError?UI_COPY.voiceState[voice.lastError]:voice.loading?UI_COPY.voiceState.loading:voice.playing?UI_COPY.voiceState.playing:''):'';for(const id of ['voice-state','voice-library-status']){setText(id,voiceStatus);$(id).hidden=!voiceStatus;}
  setText('voice-toggle',voiceEnabled?'动画原声 · 开':'动画原声 · 关');$('voice-toggle').disabled=false;$('voice-toggle').setAttribute('aria-pressed',String(voiceEnabled));$('voice-replay').hidden=!voiceEnabled||!voice.available(voiceEmotion).length;

  setText('mental-detail',`${trauma.active?trauma.explanation+' ':''}累计回撤 ${Math.round(mental.totalDrawdown*100)}% · 近期回撤 ${Math.round(mental.recentDrawdown*100)}% · ${limit.noEntry?'不能新开仓':`新单最多 ${limit.leverage}× · 合计保证金上限 ${Math.round(limit.stake*100)}%`}`);
  setText('sanity-text',`${Math.round(state.sanity)} / 100`);$('sanity-fill').style.width=state.sanity+'%';
  setText('price',quote(state.price));setText('inverse-rate',`1 美元 = ${quote(state.price)} 日元`);const base=state.candles.findLast(c=>c.day!==day)?.close||150;
  const change=(state.price/base-1)*100;setText('change',`${change>=0?'+':''}${change.toFixed(3)}%`);$('change').className=change>=0?'positive':'negative';
  setText('beat-label',end||closing?'今日收盘':`当日 K 线 ${Math.min(state.beat*4+(state.pending?.candle||0)+1,beatsPerDay(state)*4)} / ${beatsPerDay(state)*4}`);
  setText('candle-label',marketPlaying?(state.candles.at(-1)?.closed?'下一根 K 线 · 等待报价':`本根报价 ${state.pending.tick} / 6 · 形成中`):closing||end?state.dayReport?.earlyClose?.day===day?'已提前收盘':'本日 K 线已生成':'开盘中');
  marketStatus();
  setText('news-source',event.source);setText('news-time',`${event.time} JST · 快讯`);setText('news-title',event.title);setText('news-copy',event.copy);
  const metrics=accountMetrics(state),orders=positionsOf(state),canTrade=tradingOpen(state)&&!actionBusy;
  setText('equity',yen(account));setText('net-assets',yen(account-debtSummary(state).total));setText('total-debt',yen(debtSummary(state).total));setText('free-cash',yen(state.cash));setText('used-margin',yen(metrics.usedMargin));setText('reserve-amount',yen(state.reserve));setText('external-funding',yen(debtSummary(state).total));
  setText('available-margin',yen(metrics.availableMargin));setText('fees-paid',yen(metrics.feesPaid));
  setText('margin-level',orders.length?`${(metrics.marginLevel*100).toFixed(1)}%`:'— 无持仓');
  $('margin-meter').value=orders.length?Math.min(200,Math.max(0,metrics.marginLevel*100)):200;
  $('margin-level').className=orders.length&&metrics.marginLevel<=1?'negative':'';
  const todayMetrics=dailyReturnMetrics(state),displayPnl=endless?stats.totalProfit:todayMetrics.tradingNet,displayRate=endless?stats.returnRate:todayMetrics.returnRate;setText('pnl-period',endless?'累计交易收益':todayMetrics.tradingNetPartial?'今日交易 · 留存样本':'今日交易净收益');setText('day-pnl',signed(displayPnl));setText('day-return',displayRate===null?'—':`${displayRate>0?'+':''}${(displayRate*100).toFixed(2)}%`);$('day-pnl').className=displayPnl>=0?'positive':'negative';
  $('position-card').hidden=false;$('position-empty').hidden=!!orders.length;for(const id of ['hold','half','close'])$(id).hidden=!orders.length;
  const actualRatio=orderAmountRatio(orderAmount,metrics.availableMargin),highlightRatio=nearestOrderRatio(orderAmount,metrics.availableMargin);
  setText('stake-value',actualRatio===null?'—':`${Number((actualRatio*100).toFixed(2))}%`);setText('leverage-value',`${leverage}×`);setText('stop-value',stopPips===null?'不预设':`${stopPips} 点`);
  $('emotion-order-rule').hidden=!limit.forceNoStop;setText('emotion-order-rule',`${info[0]}：只能不设止损，杠杆至少 25×`);
  const preview=orderPreview(state,selectedOrder('long')),shortPreview=orderPreview(state,selectedOrder('short'));
  setText('preview-margin',yen(preview.margin||0));setText('preview-notional',yen(preview.notional||0));setText('preview-quantity',`${formatQuantity(preview.quantity??(preview.notional||0)/state.price)} USD`);setText('preview-fee',yen(preview.openFee||0));setText('preview-debit',yen(preview.totalDebit||0));
  setText('risk-amount',stopPips===null?'不预设':yen(preview.stopLossAmount||0));
  const liquidation=p=>Number.isFinite(p.liquidationPrice)&&p.liquidationPrice>0?quote(p.liquidationPrice):'无单一价格线';
  setText('preview-liquidation',`多美元 ${liquidation(preview)} / 空美元 ${liquidation(shortPreview)} 日元/美元`);
  renderLiquidation('liquidation-long',preview.liquidation,preview.valid);renderLiquidation('liquidation-short',shortPreview.liquidation,shortPreview.valid);
  $('account-liquidation').hidden=!orders.length;renderLiquidationMeter($('account-liquidation-value'),accountLiquidationEstimate(state));
  setText('order-validation',!preview.valid&&!shortPreview.valid?(preview.error||'当前不能新开仓'):'');$('order-validation').hidden=preview.valid||shortPreview.valid;
  $('order-validation').classList.toggle('invalid',!preview.valid&&!shortPreview.valid);
  for(const [attr,value] of [['stake',highlightRatio],['leverage',leverage],['stop',stop]])for(const button of document.querySelectorAll(`[data-${attr}]`)){button.setAttribute('aria-pressed',String(Number(button.dataset[attr])===value));button.disabled=!canTrade;}
  for(const id of ['long','short','wait','hold','half','close'])$(id).disabled=!canTrade;for(const b of document.querySelectorAll('[data-stop-pips]')){b.setAttribute('aria-pressed',String(b.dataset.stopPips===(stopPips===null?'none':String(stopPips))));b.disabled=!canTrade||(limit.forceNoStop&&b.dataset.stopPips!=='none');}
  $('long').disabled ||= !preview.valid;$('short').disabled ||= !shortPreview.valid;
  $('position-close-all').disabled=!canTrade||!orders.length;
  $('wait').hidden=true;$('hold').hidden=true;
  setText('position-count',`${orders.length} 笔`);setText('floating',signed(metrics.unrealized));$('floating').className=metrics.unrealized>=0?'positive':'negative';
  renderPositions(orders,canTrade);
  renderTools();const limits=restrictions(state);
  for(const b of document.querySelectorAll('[data-leverage]'))b.disabled ||= (Number(b.dataset.leverage)>limits.leverage||Number(b.dataset.leverage)<limits.minLeverage);
  for(const b of document.querySelectorAll('[data-stake]'))b.disabled ||= Number(b.dataset.stake)>limits.stake;
  emotionControls.render();
  leverage=Math.min(leverage,limits.leverage);
  for(const b of document.querySelectorAll('[data-stop]'))b.disabled ||= Number(b.dataset.stop)>(limits.stop??1);
  const amountCap=Math.max(preview.maxMargin||0,shortPreview.maxMargin||0),canPickAmount=canTrade&&!limits.noEntry&&amountCap>=100;
  for(const b of document.querySelectorAll('[data-amount-preset],#amount-max,#amount-random,#amount-slider')){b.disabled=!canPickAmount||(b.dataset.amountPreset&&Number(b.dataset.amountPreset)>amountCap);if(b.dataset.amountPreset)b.setAttribute('aria-pressed',String(Number(b.dataset.amountPreset)===orderAmount));}
  $('order-amount').disabled=!canPickAmount;
  $('amount-slider').max=Math.max(100,amountCap);$('amount-slider').value=Number.isFinite(orderAmount)?Math.max(100,Math.min(amountCap,orderAmount)):100;$('amount-slider').setAttribute('aria-valuetext',Number.isFinite(orderAmount)?yen(orderAmount):'请输入有效额度');
  setText('amount-slider-max',yen(amountCap));setText('amount-selected',Number.isFinite(orderAmount)?yen(orderAmount):'—');setText('amount-limit',amountCap>=100?`最大 ${yen(amountCap)} · 比例以可用保证金 ${yen(metrics.availableMargin)} 为分母；高亮接近档位，不改金额`:'当前可开仓额度不足 ¥100');
  if(limits.noEntry){$('long').disabled=true;$('short').disabled=true;}
  $('effect-list').replaceChildren();for(const effect of state.effects){const def=DEBUFFS[effect.id]||{name:effect.id,copy:''},row=document.createElement('p');row.textContent=`${def.name}${effect.remaining===null?'':` · 剩 ${effect.remaining} 段`}：${def.copy}`;$('effect-list').append(row);}
  if(state.cash<100){$('long').disabled=true;$('short').disabled=true;}
  setText('motion-toggle',fullMotion?'完整动效 · 开':'低动效 · 点此开启');$('motion-toggle').setAttribute('aria-pressed',String(fullMotion));
  document.body.dataset.heat=String(state.heat);
  $('share-open').disabled=actionBusy;$('mode-open').disabled=actionBusy;
  $('restart').disabled=actionBusy;$('day-review').hidden=!['day_end','resting'].includes(phase);
  $('settle-day').hidden=!closing;$('settle-day').disabled=actionBusy;
  $('retire').hidden=phase==='ending';$('retire').disabled=!canRequestWalkaway(state)||actionBusy||saveSession.blocked;setText('retire',state.walkawayRequested?'离场结算中':'收手离场');
  $('sound').textContent=sound?'♪ 音效开':'♪ 音效关';$('sound').setAttribute('aria-pressed',String(sound));
  $('developer-status').hidden=!state.developer?.edited;$('developer-open').disabled=actionBusy||!DEVELOPER_EDITING_AVAILABLE;$('ending-developer').disabled=!DEVELOPER_EDITING_AVAILABLE;
  setText('privacy-toggle',state.developer?.edited?'测试存档 · 不统计':telemetry.dnt?'浏览器已禁用统计':telemetry.enabled?'匿名统计 · 开':'匿名统计 · 关');$('privacy-toggle').disabled=false;
  telemetry.view({screen:$('story-dialog').open?'story':phase==='playing'?'market':phase==='closing'?'closing':phase==='resting'?'resting':phase==='ending'?'ending':end?'day_end':'trading',run:state.runId,day});
  if(lastMood!==em){track('mood_change',em,{mood:em,previousMood:lastMood||'none',sanityBucket:bucket(state.sanity)});lastMood=em;}
  track('news_seen',event.id,{newsId:event.id,day,beat:state.beat},`news:${day}:${state.beat}:${event.id}`);
  track('day_start','day',{day},`day-start:${day}`);
  chart();renderInvestors();renderRiskAlerts();checkAchievements();syncDayReportPresentation();persist();marketClock.start();
}
function renderInvestors(){
 const box=$('npc-messages'),messages=investorMessages(state),signature=messages.map(row=>row.id).join('|');
 if(box.dataset.signature===signature)return;box.dataset.signature=signature;
 box.replaceChildren();for(const row of messages){const li=document.createElement('li'),actor=document.createElement('b'),copy=document.createElement('p');li.dataset.stance=row.stance;actor.textContent=row.actor;copy.textContent=row.text;li.append(actor,copy);box.append(li);}
}
function soundEffect(kind,opts){audio.effect(kind,opts);}
document.addEventListener('click',e=>{const b=e.target.closest('button:not(:disabled)');if(b&&!['long','short','half','close'].includes(b.id)&&!b.dataset.positionAction&&!b.dataset.riskAction){audio.unlock();soundEffect('click');}},true);
function impact(label,amount,tone='gain'){
  if(['numb','recovering'].includes(tradingTrauma(state).mood))return;
  const heat=state.heat||0,rate=Math.min(1.8,1+heat*.13);
  soundEffect(tone==='loss'?'loss':'gain',{rate:tone==='loss'?.72:rate,level:.85});
  if(!shouldAnimate())return;
  const el=document.createElement('div');el.className=`deal-impact ${tone}`;el.setAttribute('aria-hidden','true');
  const title=document.createElement('small'),value=document.createElement('b');title.textContent=label;value.textContent=amount;el.append(title,value);document.body.append(el);
  motion.animate(el,[{opacity:0,transform:'translate(-50%,-50%) scale(.65) rotate(-8deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.1) rotate(2deg)',offset:.2},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-2deg)',offset:.7},{opacity:0,transform:'translate(-50%,-60%) scale(1.08)'}],{duration:1100-heat*55})?.finished.finally(()=>el.remove()).catch(()=>{});
  const force=2+heat*1.25;
  motion.animate(document.querySelector('main'),[{transform:'none'},{transform:`translate(${-force}px,${force*.4}px) rotate(-.2deg)`},{transform:`translate(${force}px,${-force*.3}px) rotate(.2deg)`},{transform:`translate(${-force*.4}px,0)`},{transform:'none'}],{duration:260+heat*25});
  const color=tone==='loss'?'#f284ba':heat>2?'#ffb84d':'#94eac4';
  motion.animate($('terminal'),[{boxShadow:`inset 0 0 0 3px ${color},0 0 ${24+heat*8}px ${color}99`},{boxShadow:'0 3px 0 #ded5dd'}],{duration:700});
  for(let i=0;i<8+heat*2;i++){
    const spark=document.createElement('i');spark.className='trade-spark';spark.style.background=color;spark.style.left='50%';spark.style.top='38%';document.body.append(spark);
    const angle=(i/(8+heat*2))*Math.PI*2,distance=60+heat*12+(i%3)*18;
    motion.animate(spark,[{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:`translate(calc(-50% + ${Math.cos(angle)*distance}px),calc(-50% + ${Math.sin(angle)*distance}px)) rotate(${i*40}deg) scale(.3)`}],{duration:650+i%3*70})?.finished.finally(()=>spark.remove()).catch(()=>{});
  }
}
function fly(label,from,to){if(!shouldAnimate())return;const a=from?.getBoundingClientRect?from.getBoundingClientRect():from,b=to?.getBoundingClientRect?to.getBoundingClientRect():to;if(!a||!b)return;
 const item=document.createElement('div');item.className='flying-order';item.textContent=label;item.style.left=`${a.x+a.width/2}px`;item.style.top=`${a.y+a.height/2}px`;document.body.append(item);
 motion.animate(item,[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${b.x+b.width/2-a.x-a.width/2}px),calc(-50% + ${b.y+b.height/2-a.y-a.height/2}px)) scale(.72)`,opacity:.1}],{duration:560})?.finished.catch(()=>{}).finally(()=>item.remove());}
function toast(message,kind='neutral'){
 clearTimeout(toastTimer);const el=$('trade-toast');el.hidden=false;el.className=`trade-toast ${kind}`;el.textContent=message;
 motion.animate(el,[{transform:'translate(-50%,-18px)',opacity:0},{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,0)',opacity:1,offset:.7},{transform:'translate(-50%,-10px)',opacity:0}],{duration:2400});
 toastTimer=setTimeout(()=>el.hidden=true,shouldAnimate()?2400:2000);
}
function flash(event){clearTimeout(shownFlashTimer);setText('flash-title',event.title);setText('flash-copy',event.copy);$('news-flash').hidden=false;
 motion.animate($('news-flash'),[{transform:'translateY(-14px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:320});
 shownFlashTimer=setTimeout(()=>$('news-flash').hidden=true,3600);soundEffect('draw',{rate:.9});}
function tradeTotals(trades){const list=(trades||[]).filter(Boolean);return{count:list.length,margin:list.reduce((n,t)=>n+t.margin,0),pnl:list.reduce((n,t)=>n+t.pnl,0),liquidated:list.some(t=>t.type==='liquidation')};}
function afterTick(result){
  if(result.flash){flash(result.flash);if(result.flash.swan)track('black_swan',result.flash.id,{newsId:result.flash.id,day:state.day,beat:result.flash.beat},`swan:${state.day}:${result.flash.id}`);}
  const exits=result.exits||[result.exit],total=tradeTotals(exits);for(const t of exits)trackExit(t);
  if(total.count){const tag=total.liquidated?'强制平仓':'止损已触发';
    toast(`${tag} ${total.count} 笔 · ${signed(total.pnl)}`,total.pnl>=0?'gain':'loss');impact(tag,signed(total.pnl),total.pnl>=0?'gain':'loss');fly('平仓',$('position-card'),$('free-cash'));
    if(total.liquidated)motion.animate($('character-card'),[{transform:'translateX(-6px)'},{transform:'translateX(5px)'},{transform:'translateX(-2px)'},{transform:'none'}],{duration:360});
  }else if(result.candleClosed)soundEffect('rattle',{rate:1+state.heat*.1,level:.12+state.heat*.02});
  render();if(result.candleClosed)motion.animate($('price'),[{transform:'scale(1.04)'},{transform:'none'}],{duration:240});
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sendAction(type,positionId=null,sourceButton=null){
  if(!guardProgress())return;
  if(!tradingOpen(state)||actionBusy)return;
  const button=sourceButton||$(type),buttonRect=button.getBoundingClientRect(),positionRect=$('position-card').getBoundingClientRect();
  actionBusy=true;audio.unlock();render();
  $('restart').disabled=true;for(const b of document.querySelectorAll('[data-prop]'))b.disabled=true;
  motion.animate(button,[{transform:'scale(1)'},{transform:'scale(.9) rotate(-2deg)'},{transform:'scale(1.06) rotate(1deg)'},{transform:'none'}],{duration:210});
  if(['long','short'].includes(type))soundEffect('play',{level:.7});
  try{
    const orderPercent=selectedPercentage();
    track('trade_attempt',type,{direction:type==='short'?'short':'long',stake:orderPercent,leverage,stop:stop*100,equityBucket:capitalBucket(equity(state))});
    const result=takeAction(state,{...selectedOrder(type),...(positionId?{positionId}:{})});if(result.trade?.type==='open')track('trade_open',type,{direction:type==='long'?'long':'short',stake:orderPercent,leverage,stop:stop*100});else for(const t of result.trades||[result.trade])trackExit(t);render();
    if(type==='long'||type==='short'){
      const amount=result.trade.margin,label=directionLabel(type==='long'?1:-1);

      fly(`${label} ${yen(amount)}`,buttonRect,$('position-card'));impact(label,`${leverage}× · ${yen(amount)}`);
    }else if(result.trade){
      const total=tradeTotals(result.trades||[result.trade]),label=positionId?(type==='half'?'本单减半':'本单平仓'):(type==='half'?'全部减半':'全部平仓');

      fly(`${label} ${signed(total.pnl)}`,positionRect,$('free-cash'));impact(label,signed(total.pnl),total.pnl>=0?'gain':'loss');
    }else if(type==='hold'){impact('继续持有',signed(unrealized(state)),'hold');}
    else toast('空仓');
    actionBusy=false;render();marketClock.start();
  }catch(error){actionBusy=false;track('trade_rejected',type,{reason:'unavailable'});toast(error.message,'loss');render();}
}
function renderLiquidation(id,estimate,valid){
 const box=$(id);box.replaceChildren();
 if(!valid){box.textContent='当前设置无法开仓';return;}
 if(!estimate||estimate.reason){box.textContent=estimate?.reason==='hedged'?'多空抵消，无单一强平价':'当前仓位无可达强平价';return;}
 const price=document.createElement('b'),move=document.createElement('b'),loss=document.createElement('b');price.textContent=quote(estimate.price)+' 日元/美元';move.textContent=`${estimate.movePercent<0?'下跌':'上涨'} ${Math.abs(estimate.movePercent).toFixed(2)}%`;loss.textContent=yen(estimate.lossThreshold);
 box.append(price,' · ',move,document.createElement('br'),'账户浮亏达到 ',loss,'，触发强平');
 if(estimate.prices?.length>1)box.append(document.createElement('br'),'混合旧约有双向边界：',estimate.prices.map(p=>quote(p)+' 日元/美元').join(' / '),'；以上显示最近边界。');
}
let dayRecapView=null,dayRecapSnapshot=null,storyConfirmAfter=0,livingView=null,narrativeTimer=null,narrativeRun=0;
function cancelNarrativePresentation(){narrativeRun++;clearTimeout(narrativeTimer);narrativeTimer=null;livingView?.dispose();livingView=null;}
const recapReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');recapReducedMotion.addEventListener?.('change',e=>{if(e.matches)dayRecapView?.finish();});
function renderDayRecap({animate=true}={}){
 dayRecapView?.dispose();dayRecapSnapshot=buildRecapSnapshot(state);setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 生活费 ${yen(dayRecapSnapshot.daily.costs.living)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);
 dayRecapView=mountDailyRecap($('daily-recap'),dayRecapSnapshot,{motion:animate&&shouldAnimate(),reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,onSound:soundEffect,cash:accountMetrics(state).availableMargin,loanUnlocked:state.loan?.unlocked,loanTerms:networkLoanTerms(state),portraitUrl:$('portrait').src,portraitPanel:scenePortrait(state).kind==='manga'?scenePortrait(state).panel:null,moodLabel:$('emotion-label').textContent,usedGroups:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.group),usedChoices:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.id),onChoice:choice=>{
  if(actionBusy||!guardProgress())return;
  if(choice.loan){$('loan-open').click();return;}
  actionBusy=true;try{const receipt=chooseRecapAction(state,choice.id);actionBusy=false;render();renderDayRecap({animate:false});toast(receipt.cost?`${receipt.label} · 支付 ${yen(receipt.cost)}`:'今晚慢一点，先好好休息');}catch(error){toast(error.message,'loss');}finally{actionBusy=false;}
 }});
}
$('day-dialog').addEventListener('close',()=>{cancelNarrativePresentation();dayRecapView?.dispose();dayRecapView=null;dayRecapSnapshot=null;});
$('loan-dialog').addEventListener('close',()=>{if($('day-dialog').open)renderDayRecap({animate:false});});
function settleLivingReceipt(){const result=finalizeDayLiving(state);return{...result,receipt:result.receipt||{amount:0,label:'今日生活费',legacy:true}};}

function displayFatherHint(){
 if(document.querySelector('dialog[open]'))return;
 const hint=fatherDiscoveryHint(state,{reducedMotion:!shouldAnimate()});if(!hint)return;
 const button=document.querySelector(hint.target);if(!button)return;
 button.classList.add('father-discovery-highlight');button.scrollIntoView?.({block:'nearest',behavior:shouldAnimate()?'smooth':'instant'});
 if(shouldAnimate())motion.animate(button,[{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:hint.maxDurationMs});
 applyFatherDiscovery(state,{type:'acknowledge-hint',eventId:hint.eventId});persist();
}
function startNarrativeCompletion({choiceId}={}){
 cancelNarrativePresentation();const run=narrativeRun,day=state.day,token=settlementPresentation(state)?.token;
 $('next-day').disabled=true;storyConfirmAfter=Infinity;
 const current=()=>run===narrativeRun&&state.day===day&&settlementPresentation(state)?.token===token&&$('day-dialog').open;
 const finish=async()=>{
  if(!current()||!guardProgress())return;
  try{
   const result=finishDailyNarrative(state,{choiceId});
   if(!result.ok){
    if(result.reason==='needs-explicit-choice'){$('day-story-choices').replaceChildren();for(const choice of result.event.choices){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=choice.label;b.onclick=()=>startNarrativeCompletion({choiceId:choice.id});$('day-story-choices').append(b);}return;}
    throw Error('剧情状态已变化，请关闭后重新查看');
   }
   $('day-story-choices').replaceChildren();
   if(result.result?.event){const r=result.result;track('story_choice',r.event.id,{storyId:r.event.id,choiceId:r.choice.id});for(const id of r.unlocked||[])track('item_unlocked',id,{itemId:id,storyId:r.event.id});}
   const living=settleLivingReceipt(),saved=await persist();if(!current()||saveSession.blocked)return;
   render();dayRecapSnapshot=buildRecapSnapshot(state);
   const mealArt=livingEventArt({kind:living.receipt.kind==='friend-treat'?'friend':living.receipt.kind,applied:state.dayReport.livingSettlement?.status!=='pending',amount:living.receipt.amount,tradingNet:state.dayReport.net,knownFriend:state.story.seen.includes('friendStudy'),traumaActive:tradingTrauma(state).active});renderFatherIllustration($('living-event-art'),mealArt?{art:mealArt}:null);
   livingView=mountLivingReceipt($('living-receipt'),living.receipt,{motion:living.charged&&shouldAnimate(),reducedMotion:recapReducedMotion.matches,onSound:soundEffect,onReady:()=>{if(current()&&!saveSession.blocked){storyConfirmAfter=performance.now();$('next-day').disabled=false;}}});
   syncDayReportPresentation();
   if(saved&&result.hooks.length)state.pendingFatherHint=true;
  }catch(error){setText('day-story-status',error.message);$('day-story-status').hidden=false;}
 };
 narrativeTimer=setTimeout(finish,state.settlementNarrative?.effectsApplied?0:shouldAnimate()?1100:0);
}
$('father-scene-use').onclick=()=>showProp('father');
function showDaySettlement(){if($('day-dialog').open||$('bankrupt-dialog').open)return;showDayDialog();}
$('day-dialog').addEventListener('cancel',e=>e.preventDefault());
function showDayDialog(){
 const r=state.dayReport;if(!r)return;
 if(state.day===r.day&&state.phase==='day_end'){beginRest(state);render();}
 const stage=settlementPresentation(state),narrative=stage?.stage==='story'?prepareDailyNarrative(state,{accountEquity:equity(state)}):null,scene=selectDailyScene(state),event=narrative?.event||scene?.event;
 const storyVisible=stage?.stage==='story';$('daily-recap').hidden=storyVisible;$('day-story-stage').hidden=!storyVisible;$('recap-next').hidden=storyVisible;$('next-day').hidden=!storyVisible;$('recap-next').dataset.eventToken=stage?.token||'';$('next-day').dataset.eventToken=stage?.token||'';
 setText('day-stage-label',storyVisible?'2 / 2 · 今日小剧场':'1 / 2 · 动态复盘');setText('day-title',!storyVisible?'今日动态复盘':scene?.kind==='story'&&event?event.title:'今日小剧场');setText('day-subtitle',`第 ${r.day} 天 · ${r.earlyClose?'提前收盘':'收盘'} · ${formatTradingTime(reportTradingTimestamp(state,r),{full:true})}`);
 const frame=$('day-story-comic-frame');frame.hidden=true;frame.replaceChildren();$('day-story-lines').replaceChildren();
 $('turnaround-panel').hidden=true;$('homage-panel').hidden=true;
 if(event&&storyVisible)track('story_seen',event.id,{storyId:event.id,mood:mood(state)},`story:${event.id}`);
 if(scene?.kind==='story'&&event){renderStoryFrame(frame,event);for(const [from,text] of [...event.lines,...event.choices[0].lines]){const p=document.createElement('p');p.textContent=`${from}：${text}`;$('day-story-lines').append(p);}}
 renderMangaSelection($('day-result-manga'),selectDailyManga(state),{openSource:openMangaSource});
 renderFatherSequence($('father-discovery-scene'),narrative?.fatherFrames);
 const fallback=$('day-story-fallback');fallback.replaceChildren();fallback.hidden=!storyVisible||!!narrative?.fatherFrames?.length||!$('day-result-manga').hidden||!frame.hidden;
 if(!fallback.hidden){const p=scenePortrait(state),t=tradingTrauma(state),comicMood=['crushed','numb'].includes(t.level)&&['trauma-pain','trauma-frozen'].includes(p.emotion)?'devastated':p.emotion,comic=settledComicArt({net:r.net,settled:!!sealedDailyMangaOutcome(state),mood:comicMood,traumaActive:t.active}),view=document.createElement('div'),image=document.createElement('img'),source=document.createElement('button');view.className=comic?'settled-whole-sheet':'daily-fallback-portrait';view.append(image);if(comic){setImage(image,comic.path);image.alt=comic.alt;}else if(p.kind==='manga')showMangaPortrait(image,p.panel);else{setImage(image,p.path);image.alt='久留美';}source.type='button';source.className='secondary';source.textContent='素材出处';source.onclick=comic?()=>{const original=document.createElement('img');setImage(original,comic.path);original.style.width='100%';openDetails('素材出处',['原创同人','收盘小剧场'],null,original);}:showPortraitSource;fallback.append(view,source);}
 if(!frame.hidden)$('day-result-manga').hidden=true;
 if(narrative?.fatherFrames?.length){frame.hidden=true;$('day-story-lines').hidden=true;$('day-result-manga').hidden=true;}else $('day-story-lines').hidden=false;
 setText('day-total',yen(r.closing));setText('day-net',`今日交易 ${signed(r.net)} · 生活费 ${yen(r.livingCost||0)} · 累计已实现 ${signed(runPerformance(state).totalProfit)}`);
 setText('next-day',state.walkawayRequested?'收手离场':'明天开盘');if(!storyVisible){cancelNarrativePresentation();renderDayRecap();}else dayRecapView?.finish();if(!$('day-dialog').open)$('day-dialog').showModal();if(storyVisible){$('day-story-status').hidden=true;startNarrativeCompletion();persist();}

}
function newChapter(){if(!guardProgress())return;stateGeneration++;actionBusy=false;marketClock.stop();state=enableRealtime(fresh());telemetry.setTestMode(false);voice.stop();state.runId=crypto.randomUUID();lastMood=null;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;leverage=25;stop=.5;stopPips=30;for(const d of document.querySelectorAll('dialog[open]'))d.close();$('last-trade').textContent='';render();if(state.mode==='story')showOpening();marketClock.start();scrollTo({top:0,behavior:fullMotion?'smooth':'instant'});}
function showProp(id,confirmed=false){
  if(actionBusy||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase))return;
  if(id==='father'&&!confirmed){renderFatherIllustration($('father-confirm-art'),fatherItemIllustration(state,{stage:'confirm',accountEquity:equity(state)}));$('father-take-dialog').showModal();return;}
  audio.unlock();let result;
  try{result=useProp(state,id);if(id==='father')applyFatherDiscovery(state,{type:'sync-taken'});}catch(error){toast(error.message,'loss');return;}
  track('item_used',id,{itemId:id,mood:mood(state),equityBucket:capitalBucket(equity(state))});for(const t of result.trades||[result.trade])trackExit(t);for(const e of state.effects)track('debuff_applied',e.id,{debuffId:e.id,itemId:id,duration:e.remaining||0},`effect:${state.day}:${state.beat}:${id}:${e.id}`);
  const spec=PROPS[id];render();const propArt=propEventArt(id,{applied:true});renderFatherIllustration($('father-applied-art'),id==='father'?fatherItemIllustration(state,{stage:'applied',result}):propArt?{art:propArt}:null);$('prop-comic-frame').hidden=true;setText('prop-title',spec.name);setText('prop-line',id==='father'?approvedQuote('V2-E03-05',state)?.text||'':PROP_LINES[id]||'');setText('prop-rule',spec.copy);
  $('prop-dialog').dataset.kind=id;$('prop-dialog').showModal();
  const amount=result.amount||0,started=performance.now(),duration=shouldAnimate()?1500:0;
  if(amount){
    let soundStep=-1;
    const count=now=>{const progress=duration?Math.min(1,(now-started)/duration):1,ease=1-Math.pow(1-progress,3);setText('prop-amount',`+${yen(amount*ease)}`);
      const step=Math.floor(progress*7);if(step!==soundStep){soundStep=step;soundEffect('gain',{rate:Math.min(1.8,.85+step*.12),level:.6});}
      if(progress<1&&$('prop-dialog').open)propFrame=requestAnimationFrame(count);else if(progress===1)soundEffect('win',{rate:1.35});};
    propFrame=requestAnimationFrame(count);

  }else{
    const total=tradeTotals(result.trades||[result.trade]);setText('prop-amount',result.trade?signed(total.pnl):result.cost?`−${yen(result.cost)}`:spec.caption);soundEffect(id==='mochiko'?'defend':'exhaust',{rate:1.1});
  }
  motion.animate($('prop-dialog'),[{opacity:0,transform:'translateY(30px) scale(.85) rotate(-3deg)'},{opacity:1,transform:'translateY(0) scale(1.03) rotate(1deg)'},{opacity:1,transform:'none'}],{duration:600});
  motion.animate(document.querySelector('.prop-envelope'),[{transform:'rotate(-12deg) scale(.6)'},{transform:'rotate(8deg) scale(1.12)'},{transform:'rotate(-5deg) scale(1)'}],{duration:800});
}
function selectOrderAmount(value,{writeInput=true}={}){
 if(actionBusy||!guardProgress())return;
 orderAmount=normalizeOrderAmount(value);
 if(Number.isFinite(orderAmount))state.orderDraftAmount=orderAmount;
 if(writeInput)$('order-amount').value=Number.isFinite(orderAmount)?orderAmount:'';
 render();
}
function maxOrderAmount(){return Math.max(orderPreview(state,selectedOrder('long')).maxMargin||0,orderPreview(state,selectedOrder('short')).maxMargin||0);}
for(const b of document.querySelectorAll('[data-amount-preset]'))b.onclick=()=>selectOrderAmount(Number(b.dataset.amountPreset));
$('amount-max').onclick=()=>selectOrderAmount(maxOrderAmount());
$('amount-slider').oninput=()=>selectOrderAmount(sliderOrderAmount(Number($('amount-slider').value),maxOrderAmount()));
$('amount-random').onclick=()=>{selectOrderAmount(randomOrderAmount(maxOrderAmount()));setText('amount-random-status',`随机选择 ${yen(orderAmount)}`);};
for(const b of document.querySelectorAll('[data-stake],[data-leverage],[data-stop]'))b.addEventListener('click',()=>{if(b.dataset.stake){selectOrderAmount(ratioOrderAmount(Number(b.dataset.stake),accountMetrics(state).availableMargin,maxOrderAmount()));return;}if(b.dataset.leverage)leverage=Number(b.dataset.leverage);if(b.dataset.stop)stop=Number(b.dataset.stop);render();});
$('order-amount').oninput=()=>selectOrderAmount(Number($('order-amount').value),{writeInput:false});
$('order-amount').onchange=()=>selectOrderAmount(Number($('order-amount').value));
$('position-list').onclick=e=>{const detail=e.target.closest('[data-position-detail]');if(detail){openPositionDetail(detail.dataset.positionDetail);return;}const b=e.target.closest('[data-position-action]');if(b&&!b.disabled)sendAction(b.dataset.positionAction,b.dataset.positionId,b);};
for(const b of document.querySelectorAll('[data-stop-pips]'))b.onclick=()=>{stopPips=b.dataset.stopPips==='none'?null:Number(b.dataset.stopPips);stop=stopPips===null?1:.5;render();};
for(const type of ['long','short','wait','hold','half','close'])$(type).addEventListener('click',()=>sendAction(type));
$('position-close-all').addEventListener('click',()=>{if($('position-close-all').disabled||!positionsOf(state).length||actionBusy)return;sendAction('close',null,$('position-close-all'));});
function selectMarketSpeed(value){
 if(actionBusy||!guardProgress()||![1,2,4].includes(value))return;
 speed=value;state.marketPaused=false;
 for(const option of document.querySelectorAll('[data-speed]'))option.setAttribute('aria-pressed',String(Number(option.dataset.speed)===speed));
 render();marketClock.reschedule();
}
for(const b of document.querySelectorAll('[data-speed]'))b.addEventListener('click',()=>selectMarketSpeed(Number(b.dataset.speed)));
$('finish-day').onclick=()=>{if(actionBusy||!guardProgress()||state.mode==='endless'||!tradingOpen(state))return;actionBusy=true;marketClock.stop();try{audio.unlock();finishTradingDay(state);track('settlement_confirm','close',{day:state.day},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);}catch(error){toast(error.message);}finally{actionBusy=false;render();continueScenes();}};
$('tool-list').addEventListener('click',e=>{const b=e.target.closest('[data-prop]');if(b)showProp(b.dataset.prop);});
$('prop-done').onclick=()=>{cancelAnimationFrame(propFrame);$('prop-dialog').close();continueScenes();};
$('prop-dialog').addEventListener('cancel',()=>{cancelAnimationFrame(propFrame);requestAnimationFrame(continueScenes);});
$('motion-toggle').onclick=()=>{dayRecapView?.finish();fullMotion=!fullMotion;storage.setItem('fx-girl-motion',fullMotion?'full':'reduce');motion.configure(fullMotion);document.body.classList.toggle('motion-full',fullMotion);render();};
$('sound').onclick=()=>{sound=!sound;storage.setItem(settingsKey,sound?'sound':'mute');audio.unlock();audio.configure({sound,soundVolume:.5});soundEffect('click');render();};
$('achievements-open').onclick=openAchievements;$('share-open').onclick=openShare;$('day-share').onclick=openShare;
$('share-dialog').addEventListener('close',()=>{shareRequest++;shareFile=null;if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null;}});
$('share-download').onclick=()=>setText('share-status',UI_COPY.shareSaving);
$('share-native').onclick=async()=>{if(shareBusy||!shareFile)return;const request=shareRequest;shareBusy=true;$('share-native').disabled=true;setText('share-status','正在打开系统分享…');const result=await shareReportFile(shareFile);shareBusy=false;if(request!==shareRequest)return;$('share-native').disabled=false;setText('share-status',UI_COPY.shareResult[result]);};
$('help').onclick=()=>$('help-dialog').showModal();for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>{$(b.dataset.close).close();continueScenes();};
$('restart').onclick=()=>$('restart-dialog').showModal();$('confirm-restart').onclick=newChapter;$('new-chapter').onclick=newChapter;
// A daily comic can have no pending one-time story (for example after quietNight).
// Acknowledge the closing screen itself so the dispatcher cannot reopen it.
$('recap-next').onclick=event=>{if(event.detail>1||!$('day-dialog').open||!guardProgress()||!enterSettlementStory(state,$('recap-next').dataset.eventToken))return;dayRecapView?.finish();storyConfirmAfter=performance.now()+550;render();showDayDialog();$('day-dialog').querySelector('.dialog-scroll')?.scrollTo({top:0,behavior:'instant'});};
$('next-day').onclick=event=>{if(event?.detail>1||performance.now()<storyConfirmAfter||!$('day-dialog').open||!guardProgress()||!canConfirmSettlementStory(state,$('next-day').dataset.eventToken))return;try{if(!state.settlementNarrative?.effectsApplied||state.dayReport?.livingSettlement?.status==='pending')return;completeSettlementStory(state,$('next-day').dataset.eventToken);$('day-dialog').close();render();continueScenes();displayFatherHint();}catch(error){toast(error.message);}};
$('settle-day').onclick=()=>{try{audio.unlock();settleDay(state);track('settlement_confirm','close',{day:state.day},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);track('day_end','day',{mood:mood(state),equityBucket:capitalBucket(equity(state)),pnlBucket:pnlBucket(state.dayReport.net)},`day-end:${state.day}`);render();showDaySettlement();}catch(error){toast(error.message);}};
$('retire').onclick=()=>{if(actionBusy||!guardProgress()||!canRequestWalkaway(state))return;const confirmation=walkawayConfirmation(state);setText('walkaway-title',confirmation.title);setText('walkaway-copy',confirmation.copy);setText('walkaway-status','');$('walkaway-dialog').showModal();};
$('walkaway-confirm').onclick=()=>{
 if(actionBusy||!$('walkaway-dialog').open||!guardProgress()||!canRequestWalkaway(state))return;
 actionBusy=true;$('walkaway-confirm').disabled=true;marketClock.stop();
 try{requestWalkaway(state,{finishTradingDay,finishEndlessCampaign});deferredScene=null;$('scene-resume').hidden=true;$('walkaway-dialog').close('confirmed');}
 catch(error){setText('walkaway-status',error.message);}
 finally{actionBusy=false;$('walkaway-confirm').disabled=false;render();if(!$('walkaway-dialog').open)continueScenes();}
};
$('ending-restart').onclick=newChapter;
$('day-review').onclick=()=>{deferredScene=null;$('scene-resume').hidden=true;showDayDialog();};
// Escape is a presentation-only dismissal handled by enhanceDialogs.
function pauseAuditions(){for(const player of $('voice-list').querySelectorAll('audio'))player.pause();}
bindMarketLifecycle({clock:marketClock,
 onSuspend:()=>{persist();audio.pause();voice.stop();pauseAuditions();marketStatus();},
 onResume:()=>{if(!guardProgress())return false;audio.sync();marketStatus();}
});
function replaceDeveloperState(next){
  stateGeneration++;marketClock.stop();state=enableRealtime(next);state.runId=state.developer?.edited?crypto.randomUUID():(state.runId||crypto.randomUUID());telemetry.setTestMode(!!state.developer?.edited);voice.stop();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const d of document.querySelectorAll('dialog[open]'))d.close();
  $('last-trade').textContent='';render();continueScenes();marketClock.start();
}
function openDeveloper(){
  if(!DEVELOPER_EDITING_AVAILABLE){toast(DEVELOPER_UNAVAILABLE_MESSAGE);return;}
  state.marketPaused=true;marketClock.stop();render();
  const values=developerValues(state);for(const [key,value] of Object.entries(values))$('dev-'+key).value=value;
  $('dev-auto-sanity').checked=state.developer?.edited&&state.developer.sanityOverride===null;
  $('dev-sanity').disabled=$('dev-auto-sanity').checked;
  for(const option of $('dev-phase').options)option.disabled=option.hidden=state.mode==='endless'&&option.value!=='decision';
  if(state.mode==='endless')$('dev-phase').value='decision';
  $('developer-restore').disabled=!storage.getItem(developerBackupKey);
  setText('developer-error',state.position?'请先平仓并等行情暂停，再应用数据。':'');$('developer-dialog').showModal();
}
$('developer-open').onclick=openDeveloper;$('ending-developer').onclick=openDeveloper;
$('dev-auto-sanity').onchange=()=>{$('dev-sanity').disabled=$('dev-auto-sanity').checked;};
$('developer-form').onsubmit=e=>{
  e.preventDefault();try{
    if(!DEVELOPER_EDITING_AVAILABLE)throw Error(DEVELOPER_UNAVAILABLE_MESSAGE);
    if(actionBusy)throw Error('请等交易操作完成');
    const patch={};for(const key of ['cash','reserve','profit','debt','day','beat','price','stress','sanity'])patch[key]=Number($('dev-'+key).value);
    if($('dev-auto-sanity').checked)patch.sanity=null;patch.phase=$('dev-phase').value;
    const next=applyDeveloperPatch(state,patch);
    if(!state.developer?.edited&&!storage.setItem(developerBackupKey,JSON.stringify(state)))throw Error('浏览器无法保存原存档备份，暂不能修改开发数据');
    replaceDeveloperState(next);toast('开发测试数据已应用，原存档可恢复');
  }catch(error){setText('developer-error',error.message);}
};
$('developer-restore').onclick=()=>{try{if(!DEVELOPER_EDITING_AVAILABLE)throw Error(DEVELOPER_UNAVAILABLE_MESSAGE);const original=restoreGame(storage.getItem(developerBackupKey));if(!original)throw Error('没有有效的修改前存档');replaceDeveloperState(original);toast('已恢复修改前存档');}catch(error){setText('developer-error',error.message);}};
let disposeAuditions=null;
$('voice-library-open').onclick=()=>{voice.stop();disposeAuditions?.();setText('voice-library-caption','');$('voice-library-status').hidden=true;disposeAuditions=mountVoiceLibrary($('voice-list'),VOICE_LINES,{beforePlay:()=>voice.stop(),onPlay:line=>track('voice_play',line.id,{dialogueId:line.id}),onError:line=>{setText('voice-library-caption','“'+line.zh+'”暂时无法播放，请重试或试听其他片段。');}});$('voice-library-dialog').showModal();};
$('voice-library-dialog').addEventListener('close',()=>{disposeAuditions?.();disposeAuditions=null;voice.stop();render();});
let marginPositionId=null;
function renderRiskAlerts(){
 const box=$('risk-alerts'),risks=nearStopOrders(state),visible=new Set(risks.map(r=>String(r.positionId)));
 for(const row of [...box.children])if(!visible.has(row.dataset.riskId))row.remove();
 for(const risk of risks){let row=[...box.children].find(r=>r.dataset.riskId===String(risk.positionId));
  if(!row){row=document.createElement('div');row.className='risk-alert';row.dataset.riskId=risk.positionId;const text=document.createElement('b');text.className='risk-copy';row.append(text);for(const [action,label] of [['topup','追加保证金'],['exit','提前平仓']]){const b=document.createElement('button');b.dataset.riskAction=action;b.dataset.riskPosition=risk.positionId;b.textContent=label;row.append(b);}box.append(row);}
  row.querySelector('.risk-copy').textContent=`#${risk.positionId} · ${risk.kind==='stop'?'接近止损':'接近账户强平'} ${Math.round(risk.progress*100)}% · 浮亏 ${yen(risk.loss)}`;
  const b=row.querySelector('[data-risk-action="topup"]'),p=positionsOf(state).find(p=>p.id===risk.positionId);b.hidden=risk.kind!=='stop'||Object.hasOwn(p||{},'stopPips');b.disabled=!risk.canTopUp||actionBusy||!['decision','playing'].includes(state.phase);
  row.querySelector('[data-risk-action="exit"]').disabled=actionBusy||!['decision','playing'].includes(state.phase);
 }
 if($('margin-dialog').open&&!positionsOf(state).some(p=>p.id===marginPositionId)){setText('margin-error','该持仓已经平仓，无需追加。');$('margin-confirm').disabled=true;}
}
$('risk-alerts').onclick=e=>{const b=e.target.closest('[data-risk-action]');if(!b||b.disabled)return;const id=b.dataset.riskPosition;
 if(b.dataset.riskAction==='topup'){marginPositionId=id;const p=positionsOf(state).find(p=>p.id===id);if(!p)return;const max=Math.floor(accountMetrics(state).availableMargin);$('margin-amount').max=max;$('margin-amount').value=Math.min(max,1000);$('margin-confirm').disabled=false;setText('margin-error','');setText('margin-description',`#${id} · 可追加 ${yen(max)}。现金转为本单抵押，名义仓位不变，止损容许金额随保证金增加；账户保证金率不变。行情继续播放。`);$('margin-dialog').showModal();}
 else try{const r=rescueClose(state,id);trackExit(r.trade);render();toast(`#${id} 平仓 ${signed(r.trade.pnl)}`,r.trade.pnl>=0?'gain':'loss');}catch(error){toast(error.message,'loss');}
};
$('margin-max').onclick=()=>{$('margin-amount').value=Math.floor(accountMetrics(state).availableMargin);};
$('margin-confirm').onclick=()=>{try{const r=topUpMargin(state,marginPositionId,Number($('margin-amount').value));$('margin-dialog').close();render();toast(`#${marginPositionId} 已追加 ${yen(r.amount)}`);}catch(error){setText('margin-error',error.message);}};
let loanBusy=false;
function renderLoanDialog(){
 const terms=networkLoanTerms(state),loan=state.loan,canBorrow=loan.unlocked&&terms.availableCredit>=terms.minBorrow;
 const rate=(terms.dailyRate*100).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
 setText('loan-summary',`网贷欠款 ${yen(loan.outstanding)} · 总额度 ${yen(terms.limit)} · 可再借 ${yen(terms.availableCredit)} · 当前玩法日利率 ${rate}% · 预计下一次日息 ${yen(terms.estimatedDailyInterest)}。`);
 setText('loan-assets',`名义资产 ${yen(terms.nominalAssets)} · 总欠款 ${yen(terms.totalDebt)} · 净资产（扣债）${yen(terms.netAssets)} · 最多可还 ${yen(terms.maxRepayment)}。还款只用可支配现金，不动持仓保证金或浮盈。借款不计交易利润、成就或排行榜收益。`);
 setText('loan-rules',state.mode==='endless'?'玩法压力机制：资金、负债、借款次数和情绪会影响额度与利率；借还款不会重置行情游标。每16根K线结息一次，届时按当时利率计收全部存量网贷，未付息计入欠款。已入账利息不追改，额度下调不追扣本金。':'完成借钱解围事件后开放；入口不会自动借款。每日收盘结息一次，提前结束也正常结息；未付息计入欠款。');
 $('loan-borrow').disabled=loanBusy||!canBorrow;$('loan-repay').disabled=loanBusy||terms.maxRepayment<=0;
 for(const b of $('loan-dialog').querySelectorAll('[data-loan-action]')){const limit=b.dataset.loanAction==='borrow'?terms.availableCredit:terms.maxRepayment,amount=b.dataset.loanAmount==='max'?limit:Number(b.dataset.loanAmount);b.disabled=loanBusy||amount<=0||amount>limit||(b.dataset.loanAction==='borrow'&&(!canBorrow||amount<terms.minBorrow));}
}
function executeLoanAction(kind,requested){
 if(loanBusy||actionBusy||!$('loan-dialog').open||!guardProgress())return;
 loanBusy=true;
 try{const terms=networkLoanTerms(state),amount=requested==='max'?(kind==='borrow'?terms.availableCredit:terms.maxRepayment):Number(requested);(kind==='borrow'?borrowNetwork:repayNetwork)(state,amount);$('loan-dialog').close();render();toast(`${kind==='borrow'?'借入':'归还'} ${yen(amount)}`);}
 catch(error){setText('loan-error',error.message);}
 finally{loanBusy=false;if($('loan-dialog').open)renderLoanDialog();}
}
$('loan-open').onclick=()=>{if(actionBusy||!guardProgress())return;setText('loan-error','');renderLoanDialog();$('loan-dialog').showModal();};
$('loan-borrow').onclick=()=>executeLoanAction('borrow',$('loan-amount').value);
$('loan-repay').onclick=()=>executeLoanAction('repay',$('loan-amount').value);
$('loan-quick-actions').onclick=e=>{const b=e.target.closest('[data-loan-action]');if(b&&!b.disabled)executeLoanAction(b.dataset.loanAction,b.dataset.loanAmount);};
let rankingMode='total',rankingGameMode=state.mode||'story',rankingSort='survival',rankingRequest=0,rankingBusy=false;
function rankingEligibility(){try{const r=completedLeaderboardScore(state);setText('ranking-eligibility',`${r.gameMode==='endless'?'操盘':'剧情'} · 存活 ${r.daysSurvived} 天 · 可提交本局成绩。`);$('ranking-publish').disabled=rankingBusy;return true;}catch(error){setText('ranking-eligibility',error.message);$('ranking-publish').disabled=true;return false;}}
const percent=value=>Number.isFinite(value)?(value*100).toFixed(2)+'%':'—';
async function readRanking(){const request=++rankingRequest;setText('ranking-status','正在读取…');$('ranking-table').replaceChildren();for(const b of document.querySelectorAll('[data-ranking-game]'))b.setAttribute('aria-pressed',String(b.dataset.rankingGame===rankingGameMode));
 try{const data=await leaderboard.read({mode:rankingMode,gameMode:rankingGameMode,sort:rankingSort,limit:20});if(request!==rankingRequest)return;
  if(!data.rows.length){setText('ranking-status','这个模式还没有提交的成绩。');return;}
  const box=$('ranking-table');for(const r of data.rows){const card=document.createElement('article');card.className='ranking-entry';const header=document.createElement('div');header.className='ranking-entry-head';const name=document.createElement('b');name.textContent=`${r.rank}. ${r.name}`;const days=document.createElement('strong');days.textContent=`存活 ${r.daysSurvived} 天`;header.append(name,days);card.append(header);const hero=document.createElement('div');hero.className='ranking-return';hero.textContent=percent(r.returnRate);const sub=document.createElement('span');sub.textContent='总收益率';hero.prepend(sub);hero.classList.add(r.returnRate>=0?'positive':'negative');card.append(hero);const grid=document.createElement('div');grid.className='ranking-metrics';for(const [label,value] of [['日均收益率',percent(r.dailyReturnRate)],['总收益',signed(r.totalProfit)],['最大盈利',r.maxProfit===null?'—':signed(r.maxProfit)],['最大亏损',r.maxLoss===null?'—':signed(r.maxLoss)],['最大回撤',percent(r.maxDrawdown)]]){const cell=document.createElement('div'),key=document.createElement('span'),val=document.createElement('b');key.textContent=label;val.textContent=value;cell.append(key,val);grid.append(cell);}card.append(grid);box.append(card);}setText('ranking-status',`${rankingGameMode==='endless'?'操盘':'剧情'}模式 · ${data.rows.length} 位玩家`);
 }catch(error){if(request===rankingRequest)setText('ranking-status',error.message+'，可点击重新读取。');}
}
$('leaderboard-open').onclick=()=>{rankingGameMode=state.mode||'story';rankingEligibility();$('leaderboard-dialog').showModal();void readRanking();};
$('leaderboard-dialog').addEventListener('close',()=>{rankingRequest++;continueScenes();});
for(const b of document.querySelectorAll('[data-ranking-game]'))b.onclick=()=>{rankingGameMode=b.dataset.rankingGame;void readRanking();};
$('ranking-sort').onchange=()=>{rankingSort=$('ranking-sort').value;void readRanking();};
$('ranking-share').onclick=()=>openShare('ranking');
$('ranking-retry').onclick=()=>void readRanking();
$('ranking-form').onsubmit=async e=>{e.preventDefault();if(rankingBusy||!rankingEligibility())return;rankingBusy=true;rankingEligibility();setText('ranking-status','正在提交…');try{await leaderboard.publish(structuredClone(state),{alias:$('ranking-name').value.trim()});await readRanking();setText('ranking-status','提交成功。重复提交同一条记录不会重复计分。');}catch(error){setText('ranking-status',error.message);}finally{rankingBusy=false;rankingEligibility();}};

for(const type of ['pointerdown','keydown'])document.addEventListener(type,event=>{if(!event.isTrusted)return;unlockSafeAudio(event);audio.unlock();voice.unlock();},{capture:true});
$('order-amount').value=orderAmount;
setText('storage-warning',UI_COPY.storageWarning);setText('share-hint',UI_COPY.shareHint);
for(const text of UI_COPY.help){const p=document.createElement('p');p.textContent=text;$('help-copy').append(p);}
observeNumericLayout();
enhanceDialogs({onClose:()=>voice.stop(),onDismiss:dialog=>{
  if(['day-dialog','story-dialog','ending-dialog','bankrupt-dialog'].includes(dialog.id)){
    deferredScene={key:sceneKey(),id:dialog.id};$('scene-resume').hidden=false;
  }
}});
$('scene-resume').onclick=()=>{const deferred=deferredScene;deferredScene=null;$('scene-resume').hidden=true;if(deferred?.key===sceneKey()&&deferred.id==='day-dialog')showDayDialog();else continueScenes();};
render();if(guardProgress()){if(firstVisit)$('mode-dialog').showModal();else if(state.mode==='story'&&!state.openingSeen)showOpening();else continueScenes();}
new MutationObserver(()=>{marketStatus();marketClock.reschedule();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});marketClock.start();

function renderTools(){
 const box=$('tool-list');const discovered=Object.entries(PROPS).filter(([id])=>itemDiscovered(state,id));
 $('inventory-empty').hidden=!!discovered.length;setText('inventory-empty',UI_COPY.inventoryEmpty);setText('inventory-count',discovered.length?discovered.length+' 件':'');
 const discoveredIds=new Set(discovered.map(([id])=>id));for(const b of [...box.children])if(!discoveredIds.has(b.dataset.prop))b.remove();
 for(const [id,spec] of discovered){const unlocked=itemUnlocked(state,id),unavailable=itemUnavailableReason(state,id),used=id==='father'?state.fatherUsed:state.itemsUsed?.[id];let b=[...box.children].find(el=>el.dataset.prop===id);if(!b){b=document.createElement('button');b.id=id;b.dataset.prop=id;b.append(document.createElement('b'),document.createElement('small'));box.append(b);}const title=b.firstElementChild,small=b.lastElementChild;title.textContent=spec.name;small.textContent=unavailable||(unlocked?used?'已使用 · ':'':'未解锁 · ')+spec.caption;b.classList.toggle('item-locked',!unlocked);b.title=unavailable||spec.copy;b.disabled=actionBusy||!!unavailable||!unlocked||used||!(id==='father'?(tradingOpen(state)||['day_end','resting'].includes(state.phase)):tradingOpen(state))||accountMetrics(state).availableMargin<(spec.cost||0);box.append(b);}
 $('family-panel').hidden=!state.fatherUsed;setText('family-debt',`父亲的柜中存款 · 欠款 ${yen(state.family.outstanding)} · 已归还 ${yen(state.family.repaid)}`);$('repay-open').disabled=!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||state.family.outstanding<=0||accountMetrics(state).availableMargin<1;

 $('bankrupt-rescue').hidden=!state.family.unlocked||state.fatherUsed;
 const credit=networkLoanTerms(state);$('loan-panel').hidden=!state.loan?.discovered;setText('loan-state',state.loan?.unlocked?'已开放':'未解锁');setText('loan-effect',`当前额度 ${yen(credit.limit)} · 玩法日利率 ${(credit.dailyRate*100).toFixed(3)}% · 当前欠款 ${yen(state.loan?.outstanding||0)}`);$('loan-open').disabled=!state.loan?.unlocked||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||actionBusy;
}
function continueScenes(){
  if(!guardProgress())return;
  if(deferredScene?.key===sceneKey())return;
  if(state.realtime&&state.phase==='closing'){settleDay(state);track('settlement_confirm','close',{day:state.day},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);render();}

 if(['playing','closing'].includes(state.phase)||document.querySelector('dialog[open]')||document.querySelector('.settlement-dialog'))return;
 if(state.mode==='story'&&!state.openingSeen){showOpening();return;}
 if(state.phase==='resting'&&state.dayReport?.day===state.day&&settlementPresentation(state)?.stage!=='complete'){showDayDialog();return;}
 const event=pendingStory(state);if(event){showStory(event);return;}
 if(state.phase==='day_end')showDaySettlement();else if(state.phase==='ending')showEnding();else if(state.phase==='resting'){track('rest_end','night',{day:state.day},`rest-end:${state.day}`);if(state.walkawayRequested){const forced=endingCondition(state);finishCampaign(state,['broke','crisis'].includes(forced)?forced:'walkaway');}else nextDay(state);render();continueScenes();}else telemetry.view({screen:'trading',run:state.runId,day:state.day});
}
function showCaptions(id,lines){$(id).replaceChildren();lines.forEach((line,i)=>{const p=document.createElement('p');if(line)p.textContent=`${i+1} / ${line}`;$(id).append(p);});}
function renderStoryFrame(frame,event){if(event?.key==='friendStudy'){const art=propEventArt('mochiko',{applied:true});renderFatherIllustration(frame,{art});frame.className='story-scene-image';}else renderMangaSelection(frame,selectNarrativeManga(state,{kind:'event',event}),{openSource:openMangaSource});}

function showStory(event){
 telemetry.view({screen:'story',run:state.runId,day:state.day});track('story_seen',event.id,{storyId:event.id,mood:mood(state)},`story:${event.id}`);setText('story-title',event.title);
 renderStoryFrame($('story-comic-frame'),event);$('story-captions').hidden=true;
 $('story-lines').replaceChildren();for(const [from,text] of [...event.lines,...(event.choices.length===1?event.choices[0].lines:[])]){const p=document.createElement('p');p.textContent=`${from}：${text}`;$('story-lines').append(p);}
 const box=$('story-choices');box.replaceChildren();for(const choice of event.choices){const b=document.createElement('button');b.textContent=state.phase==='resting'?TRANSITION_COPY.restContinue:choice.label;b.dataset.storyChoice=choice.id;box.append(b);}$('story-dialog').showModal();
}
$('story-dialog').addEventListener('cancel',e=>e.preventDefault());
$('story-choices').addEventListener('click',e=>{const b=e.target.closest('[data-story-choice]');if(!b)return;try{const result=chooseStory(state,b.dataset.storyChoice);track('story_choice',result.event.id,{storyId:result.event.id,choiceId:result.choice.id});for(const id of result.unlocked)track('item_unlocked',id,{itemId:id,storyId:result.event.id});$('story-dialog').close();render();continueScenes();}catch(error){toast(error.message);}});
$('privacy-toggle').onclick=()=>{setText('privacy-copy',UI_COPY.privacy);setText('privacy-state',telemetry.dnt?'浏览器 DNT / GPC 已关闭统计':state.developer?.edited?'开发测试局不发送统计':telemetry.enabled?'当前：开启':'当前：关闭');setText('privacy-confirm',telemetry.enabled?'关闭匿名统计':'开启匿名统计');$('privacy-confirm').disabled=telemetry.dnt||!!state.developer?.edited;$('privacy-dialog').showModal();};
$('privacy-confirm').onclick=()=>{const next=!telemetry.enabled;storage.setItem('fx-girl-analytics',next?'on':'off');telemetry.setEnabled(next);$('privacy-dialog').close();render();};
$('repay-open').onclick=()=>{const max=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));$('repay-amount').max=max;$('repay-amount').value=Math.min(max,10000);setText('repay-limit',`可归还资金 ${yen(accountMetrics(state).availableMargin)} · 欠款 ${yen(state.family.outstanding)}`);$('repay-dialog').showModal();};
$('repay-all').onclick=()=>{$('repay-amount').value=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));};
$('repay-confirm').onclick=()=>{try{const r=repayFather(state,Number($('repay-amount').value));track('story_choice','repay',{storyId:r.full?'repayFull':'repayPartial',choiceId:'repay',equityBucket:capitalBucket(equity(state))});$('repay-dialog').close();toast(`归还 ${yen(r.amount)}`);render();continueScenes();}catch(e){setText('repay-limit',e.message);}};
$('bankrupt-rescue').onclick=()=>{$('bankrupt-dialog').close();showProp('father');};
$('voice-toggle').onclick=()=>{voiceEnabled=!voiceEnabled;storage.setItem('fx-girl-voice',voiceEnabled?'on':'off');if(voiceEnabled){voice.unlock?.();voice.lastMood=null;render();}else{voice.stop();render();}};
$('father-take-confirm').onclick=()=>{$('father-take-dialog').close();showProp('father',true);};
$('voice-replay').onclick=()=>{voice.unlock();void voice.play(voice.lastMood||(mood(state)==='stunned'?'blank':mood(state)),state.speech?.id);};

function showEnding(){
 const e=state.ending,finalSnapshot=structuredClone(state),finalReport=buildResultsReport(finalSnapshot,{recap:buildRecapSnapshot(finalSnapshot)}),ending=finalReport.ending;
 mountResultsReport($('ending-results'),finalReport);
 track('ending_seen',e.id,{kind:e.id,equityBucket:capitalBucket(e.equity),sanityBucket:bucket(e.sanity)},`ending:${e.id}`);
 setText('ending-title',ending.title);setText('ending-summary',`第 ${e.day} 天 · ${ending.description}`);
 $('ending-comic').hidden=state.mode==='story'||!!ending.variant;
 if(!$('ending-comic').hidden)setImage($('ending-comic'),`./comics/ending-${e.id}.webp`);
 renderMangaSelection($('ending-manga'),selectNarrativeManga({...state,ending:{...e,variant:ending.variant}},{kind:'ending'}),{openSource:openMangaSource});
 $('ending-comic').alt=ending.title;
 $('ending-captions').hidden=!!ending.variant;showCaptions('ending-captions',ending.variant?[]:comicCaptions(e.id,state));
 setText('ending-before','');$('ending-dialog').showModal();
}
