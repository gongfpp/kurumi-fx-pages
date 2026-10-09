import {isDailyFamilyNarrative,selectDailyFamilyLines} from './daily-family-art.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {acquireOwnerHistory} from './history-direct.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountMarketSourcePicker} from './market-source-picker.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {KURUMI_SERVICE_ORIGIN} from './service-config.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {importResearchPackage} from './research-import.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountTradingExpression} from './trading-expression-overlay.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountFatherAmountControls} from './father-amount-controls.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {historicalStepMilliseconds,advanceHistoricalPlayback} from './historical-playback.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {displayCandles,candlePeriodLabel,candlePeriodNotice,candlePeriodMarkup} from './candle-period.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {RESEARCH_BUILD} from './research-config.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {eveningReceiptScenes,mountEveningReceipts} from './evening-receipts-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {preserveScroll} from './preserve-scroll.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {importHistoricalPackage} from './historical-import.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {HistoricalMarketLibrary,advanceHistoricalBatch} from './historical-market.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {isResearch,isHistorical,historicalReady,hasHistoricalFeed,continueHistoricalGap} from './historical-replay.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createSavedContextualManga} from './contextual-manga-scenes.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountContextualManga} from './contextual-manga-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
const contextualMangaDelivery=createSavedContextualManga();
import {selectDailyArtwork,mountDailyArtwork} from './daily-stage-one-art.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {orderLossView} from './order-loss-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountCharacterStoryReader} from './character-story-reader.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createEventComicPresenter} from './event-comic-presenter.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountConsumptionStatement} from './consumption-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {positionRiskView,renderPositionRisk} from './position-risk-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {candlePlot,createChartViewport} from './chart-viewport.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {showGeneratedPortrait} from './portrait-display.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createCloseAllControl,closeAllToken,closeAllModalOpen} from './close-all-control.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createFloatingRisk} from './floating-risk.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {narrativeAudioContext,createNarrativeCueGate} from './narrative-audio.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {quoteStepMilliseconds,visibleQuoteStep,hasCanonicalGrid} from './quote-grid.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {quotePackageMarkup,quotePackagePresentation} from './quote-package-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {movingAverageSeries,movingAverageSettings,movingAveragePath} from './moving-average.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {settledComicArt,isSevereSettledLoss} from './settled-comic-art.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {propEventArt,livingEventArt} from './prop-event-art.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {selectFinalPortrait} from './final-portrait.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createFloatingReaction} from './floating-reaction.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {prepareDailyNarrative,finishDailyNarrative} from './day-narrative.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {fatherDiscoveryHint,fatherItemIllustration,applyFatherDiscovery} from './father-discovery.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {renderFatherIllustration,renderFatherSequence} from './father-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountLivingReceipt} from './living-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {canRequestWalkaway,walkawayConfirmation,requestWalkaway} from './walkaway.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {buildResultsReport} from './results-report.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountResultsReport} from './results-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {settlementPresentation,enterSettlementStory,canConfirmSettlementStory,completeSettlementStory} from './settlement-stage.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {buildRecapSnapshot} from './daily-recap.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountDailyRecap} from './recap-view.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {timedCandles,timeAxisTicks,formatTradingTime,currentTradingTimestamp,reportTradingTimestamp,TRADING_TIME_NOTICE} from './trading-time.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {BgmPlayer} from './bgm-player.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {bindBgmPreferences} from './bgm-preferences.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountBgmPanel} from './bgm-panel.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {selectBgmScene,voiceMixActive} from './bgm-scenes.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createEmotionOverview} from './emotion-overview.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {terminalCueForEvent} from './terminal-cues.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {GENERATED_EXTREME_EXPRESSIONS} from './generated-emotion-assets.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';


import {createInvestorDanmaku,mountCommentCredits} from './investor-danmaku.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {quotePackageName} from './quote-packages.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {observeNumericLayout} from './numeric-layout.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createVoiceContextSelector} from './voice-timing.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {unlockSafeAudio} from './audio-envelope.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {enhanceDialogs} from './dialogs.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createEmotionControls} from './emotion-controls.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {selectMangaPortrait,showMangaPortrait} from './manga-portraits.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {selectNarrativeManga,selectDailyManga,sealedDailyMangaOutcome} from './manga-context.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {renderMangaSelection} from './manga-render.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {ACHIEVEMENTS,evaluateAchievements,createAchievementToast,renderAchievementBook} from './achievements.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {selectDailyScene} from './daily-scene.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createShareCard} from './share-card.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {buildShareFile,canShareFile,shareReportFile} from './share-export.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createGameStorage} from './storage.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {kurumiStorage, storageEventMatches} from './storage-namespace.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createSaveSession} from './save-session.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {sliderOrderAmount,randomOrderAmount,normalizeOrderAmount,draftOrderAmount,orderAmountRatio,nearestOrderRatio,ratioOrderAmount,orderDraftIntent,orderIntentAction} from './amount-controls.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {runPerformance} from './performance.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {readRunStatistics} from './run-statistics.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {TERMINAL_HELP} from './copy/terminal-help.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountOpeningReader} from './opening-reader.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {PROP_LINES} from './copy/items.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {UI_COPY} from './copy/ui.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {formatQuote as quote,formatQuantity,directionLabel,positionQuantity} from './market.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {TRANSITION_COPY,dailyContinueLabel} from './copy/transitions.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {FXLeaderboard} from './leaderboard.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {AutomaticLeaderboard} from './auto-leaderboard.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {RankingLifecycle} from './ranking-lifecycle.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {setImage,assetURL} from './assets.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {itemUnlocked,itemDiscovered,itemUnavailableReason} from './item-events.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {createGame, takeAction, advanceTick, nextDay, equity, unrealized, mood, currentEvent, useProp, mentalState, mentalReadout, selectCandlePeriod, purchaseQuoteRefresh, quotePackageState, tradingProfit, restoreGame, START, TARGET_PROFIT, settleDay, finishTradingDay, chooseRecapAction, finalizeDayLiving, selectLifestyle, consumptionStatement, dailyReturnMetrics, beginRest, finishCampaign, finishEndlessCampaign, endingCondition, pendingStory, chooseStory, restrictions, dailyLeverageUnlocked, DEBUFFS, repayFather,beatsPerDay,nearStopOrders,topUpMargin,rescueClose,borrowNetwork,repayNetwork,networkLoanTerms,debtSummary,positionsOf,positionUnrealized,positionNetUnrealized,positionStopLoss,accountMetrics,orderPreview,accountLiquidationEstimate,enableRealtime,advanceMarket,advanceQuote,tradingOpen,canCloseAtKnownQuote} from './engine.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

import {FXAudio} from './audio.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {MarketClock} from './market-clock.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {bindMarketLifecycle} from './page-lifecycle.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {GameMotion} from './motion.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {MOODS, PROPS} from './content.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {VoicePlayer,VOICE_LINES} from './voice.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountVoiceLibrary} from './voice-library.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {FXTelemetry,capitalBucket,pnlBucket} from './telemetry.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {mountDeveloperUI} from './developer-ui.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';
import {comicCaptions,approvedQuote} from './dialogue.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

// Every edit is verified by the independent service; Pages never receives a password.
const $ = id => document.getElementById(id);
const storage=createGameStorage(()=>kurumiStorage());
const yen = value => `${value<0?'−':''}¥${Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const signed = value => `${value>0?'+':''}${yen(value)}`;
let selectedMarket=storage.getItem('fx-girl-market-source')==='historical'?'historical':'simulated';
const slot=(mode,market=selectedMarket)=>`${mode}:${market}`;
const saveKeyFor=(mode,market=selectedMarket)=>market==='historical'?`fx-girl-historical-${mode}-v1`:mode==='endless'?'fx-girl-endless-v1':'fx-girl-campaign-v3';
let selectedMode=storage.getItem('fx-girl-mode')==='endless'?'endless':'story';
if(selectedMarket==='historical'&&!storage.getItem(saveKeyFor(selectedMode)))selectedMarket='simulated';
let saveKey=saveKeyFor(selectedMode);
const settingsKey = 'fx-girl-settings';
let developerBackupKey=selectedMode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
const fresh = (mode=selectedMode,historical=null) => createGame(crypto.getRandomValues(new Uint32Array(1))[0],{mode,historical});
const historicalLibrary=new HistoricalMarketLibrary();
let marketSourcePicker;
let historyAcquireController;
let historicalLoad=null;
const saveSessions=new Map(),modeStates=new Map();
function sessionFor(mode,market=selectedMarket){const key=slot(mode,market);if(!saveSessions.has(key))saveSessions.set(key,createSaveSession({storage,key:saveKeyFor(mode,market),legacyKey:market==='simulated'&&mode==='story'?'fx-girl-campaign-v2':null,restore:raw=>{const saved=restoreGame(raw);return saved?.mode===mode&&isHistorical(saved)===(market==='historical')?saved:null;}}));return saveSessions.get(key);}
let saveSession=sessionFor(selectedMode);
const initialSave=saveSession.raw;
let state=enableRealtime(restoreGame(initialSave)||fresh());
const firstVisit=!initialSave&&!storage.getItem('fx-girl-mode');
let deferredScene=null;
const sceneKey=()=>`${stateGeneration}:${state.mode}:${state.runId}:${state.day}:${state.phase}`;
let orderAmount=draftOrderAmount(state), shareUrl=null,shareFile=null,shareBusy=false,shareRequest=0,stateGeneration=0;
const achievementKey='fx-jiuliumei-achievements-v1';
let achievementProfile;try{achievementProfile=JSON.parse(storage.getItem(achievementKey)||'{}');}catch{achievementProfile={};}
let maSettings;try{maSettings=movingAverageSettings(JSON.parse(storage.getItem('fx-moving-averages')||'null'));}catch{maSettings=movingAverageSettings(null);}
let quoteBusyGeneration=-1;
let leverage=25, stop=.5, stopPips=30, speed=1, actionBusy=false,  shownFlashTimer, toastTimer, propFrame,propPresentationRun=0;
let sound = storage.getItem(settingsKey)!=='mute';
// Legacy voice preferences do not opt users into playback. Every clip needs its button.
let fullMotion=storage.getItem('fx-girl-motion')==='full'||(storage.getItem('fx-girl-motion')!=='reduce'&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
state.runId ||= crypto.randomUUID();
// null means temporarily unreadable: pause dynamic telemetry, never mark permanent test mode.
function isDevelopmentTainted(){try{const tainted=hasDevelopmentTaint(state,{getItem:key=>{if(!storage.readItem)return storage.getItem(key);const entry=storage.readItem(key);if(!entry.available)throw Error('privacy-unavailable');return entry.value;}});if(tainted)state.developmentTaint=true;return tainted;}catch{return null;}}
function isDevelopmentRun(){return state.historical?.version===2||isDevelopmentTainted();}
const telemetry=new FXTelemetry({enabled:!RESEARCH_BUILD&&storage.getItem('fx-girl-analytics')!=='off',testMode:isDevelopmentRun(),getTestMode:isDevelopmentRun,getMetrics:run=>{if(run!==state.runId)return {};const p=runPerformance(state);return {realizedPnl:p.totalProfit,initialCapital:p.initialEquity,closedTrades:p.closedTrades,metricsComplete:readRunStatistics(state).complete};},build:new URL(import.meta.url).searchParams.get('v')||'local-unversioned'});
const leaderboard=new FXLeaderboard();
const automaticLeaderboard=new AutomaticLeaderboard({client:leaderboard,storage});
const rankingLifecycle=new RankingLifecycle({getState:()=>state,getGeneration:()=>stateGeneration,isBlocked:()=>saveSession.blocked,persist,report:s=>buildResultsReport(s,{recap:buildRecapSnapshot(s)}),automatic:automaticLeaderboard,onStatus:updateAutomaticRankingStatus});
let lastMood=null;
const bucket=n=>n<25?'0-24':n<50?'25-49':n<75?'50-74':'75-100';
function track(name,target,detail={},key){try{if(key)telemetry.emit(name,target,{detail,dedupeKey:state.runId+':'+key});else telemetry.action(name,target,detail);}catch{/* Statistics never block game progress. */}}
function trackExit(t){if(t)track('trade_close',t.type,{direction:t.direction===1?'long':'short',pnlBucket:pnlBucket(t.pnl),leverage:t.leverage},`exit:${state.day}:${t.positionId||t.id||'legacy'}:${t.type}:${t.margin}:${t.pnl}`);}
const bgm=new BgmPlayer({onUpdate:state=>setText('music-open',state.playing?'音乐 · 开':state.loading?'音乐 · 载入':'背景音乐')});
const audio = new FXAudio();
audio.configure({sound,soundVolume:.5});
const narrativeCues=createNarrativeCueGate({play:(kind,opts)=>audio.effect(kind,opts)});
const voice=new VoicePlayer({onUpdate:()=>render(),onPlay:line=>track('voice_play',line.id,{mood:mood(state),dialogueId:line.id}),onReject:line=>track('voice_rejected',line.id,{reason:'playback-unavailable',dialogueId:line.id})});
const motion = new GameMotion();motion.configure(fullMotion);document.body.classList.toggle('motion-full',fullMotion);
const moodInfo = MOODS;
const selectVoiceContext=createVoiceContextSelector();
const floatingReaction=createFloatingReaction();
const tradingExpression=mountTradingExpression({portrait:$('portrait').parentElement,speech:$('speech'),getState:()=>state,canEnter:()=>!actionBusy&&!saveSession.blocked&&tradingOpen(state)});
for(const direction of ['long','short'])tradingExpression.bind($(direction),direction);
const emotionOverview=createEmotionOverview();
const closeAllControl=createCloseAllControl({getContext:()=>({
  token:closeAllToken({generation:stateGeneration,mode:state.mode,runId:state.runId,day:state.day,positions:positionsOf(state)}),
  canClose:canCloseAtKnownQuote(state)&&!actionBusy&&!saveSession.blocked&&!document.hidden&&!closeAllModalOpen(document)
}),guard:guardProgress,close:button=>sendAction('close',null,button)});
closeAllControl.bind($('position-close-all'));
const floatingRisk=createFloatingRisk({closeControl:closeAllControl});
const shouldAnimate=()=>motion.enabled&&fullMotion;
const eventComics=createEventComicPresenter({initialState:state,getContext:()=>`${stateGeneration}:${state.mode}:${state.runId}`,isBlocked:()=>saveSession.blocked,onReceipts:()=>syncEveningReceipts(),onAutoShown:()=>{void persist();},onIdle:()=>{marketClock.reschedule();continueScenes();}});
const investorDanmaku=createInvestorDanmaku($('investor-danmaku'));
const commentMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
commentMotionPreference.addEventListener('change',()=>{if(!storage.getItem('fx-girl-motion')){fullMotion=!commentMotionPreference.matches;motion.configure(fullMotion);document.body.classList.toggle('motion-full',fullMotion);render();}else renderInvestors();});
document.addEventListener('visibilitychange',()=>renderInvestors());
const marketClock=new MarketClock({
  canRun:()=>!saveSession.blocked&&tradingOpen(state)&&!state.marketPaused&&!document.hidden,
  canStep:()=>!actionBusy&&!document.querySelector('dialog[open]'),
  interval:()=>isHistorical(state)?historicalStepMilliseconds(state,speed):quoteStepMilliseconds(state.script,speed),
  step:()=>{if(!guardProgress())return;const result=isHistorical(state)?advanceHistoricalPlayback(state,advanceQuote,{speed}):advanceQuote(state);if(!result)return;if(result.logicalSecondEnded||result.exits?.length||result.flash)afterTick(result);else if(visibleQuoteStep({script:state.script,subtick:result.subtick,hz:quotePackageState(state).selectedHz}))renderQuoteFrame();if(!tradingOpen(state)){continueScenes();void ensureHistoricalLoaded();}},
  onError:error=>{state.marketPaused=true;render();toast('行情暂缓：'+error.message,'loss');}
});
function marketStatus(){
  const paused=state.marketPaused,modal=!!document.querySelector('dialog[open]');
  setText('market-phase',saveSession.blocked?'存档已变更 · 本页暂停':tradingOpen(state)?paused?'点倍速继续行情':document.hidden?'后台暂缓':modal?'查看窗口 · 行情暂缓':'实时行情 · 运行中':state.phase==='closing'?'今日收盘':'休市');
  renderHistoricalStatus();
  setText('quote-package-open',candlePeriodLabel(state));$('quote-package-open').title=candlePeriodNotice(state);$('quote-package-open').disabled=actionBusy;$('quote-package-open').setAttribute('aria-label','K线时间周期，当前 '+candlePeriodLabel(state));
  $('finish-day').hidden=state.mode==='endless';$('finish-day').disabled=state.mode==='endless'||!canCloseAtKnownQuote(state)||actionBusy||saveSession.blocked;
}

function updateSaveStatus(){
  const blocked=saveSession.blocked,saved=saveSession.status==='saved',pending=saveSession.status==='pending';
  $('saved').textContent=blocked?'存档待处理':saved?'✓':pending?'保存中':'进度仅在本页';
  $('saved').title=blocked?'已暂停本页，未覆盖其他页面的进度':saved?'进度已保存':pending?'正在保存，完成前请勿刷新或关闭':'浏览器暂时无法安全保存，刷新或关闭后本页进度会丢失';
  $('storage-warning').hidden=saved||pending;$('storage-warning-panel').hidden=saved||pending;
  setText('storage-warning',blocked?'检测到存档变化。本页已暂停，请先处理存档。':saveSession.reason==='coordination'?'浏览器暂不支持安全的跨页保存。本页仍可游玩，请勿刷新或关闭；可下载本页进度备份。':UI_COPY.storageWarning);
  closeAllControl.refresh();
  if(blocked){
    eventComics.invalidate();marketClock.stop();audio.pause();voice.stop();bgm.pause({remember:false});marketStatus();
    setText('save-conflict-copy',saveSession.status==='invalid'?'当前存档损坏、模式不匹配，或来自更新版本。为保护原数据，本页不会覆盖它。请先下载备份，修复后再重试载入。':'其他页面已更新此模式的存档。本页已暂停，未覆盖最新进度。你可以先下载本页备份，再载入最新存档；载入会替换本页进度。');
    if(!$('save-conflict-dialog').open)$('save-conflict-dialog').showModal();
  }
}
function guardProgress(){const ok=saveSession.check();if(!ok){updateSaveStatus();}return ok;}
function persist(){const session=saveSession,generation=stateGeneration,comicTicket=eventComics.capture(state),contextualTicket=contextualMangaDelivery.capture(state),pending=session.save(state);updateSaveStatus();return pending.then(saved=>{if(session===saveSession){updateSaveStatus();if(generation===stateGeneration){eventComics.commit(comicTicket,saved);if(contextualMangaDelivery.commit(contextualTicket,{saved,state,blocked:saveSession.blocked}))syncContextualDaily();}}return saved;});}
// All state-changing controls, including keyboard-triggered clicks and forms,
// are checked before their handlers. Timer/scene mutations also check explicitly.
for(const type of ['click','submit','input','change','cancel'])document.addEventListener(type,event=>{
  if(event.target.closest?.('#save-conflict-dialog')||event.target.closest?.('[data-save-backup]'))return;
  if(!guardProgress()){event.preventDefault();event.stopImmediatePropagation();}
},true);
const emotionControls=createEmotionControls({getState:()=>state,getLimits:()=>restrictions(state),
  getContext:button=>({hardBlocked:!tradingOpen(state)||actionBusy||saveSession.blocked||accountMetrics(state).availableMargin<100*(1+Number(button?.dataset.leverage??leverage)*.00005),emotion:mood(state),profit:tradingProfit(state),unrealized:currentNetFloating()}),
  canInteract:()=>guardProgress()&&!actionBusy,onChange:result=>{if(result.accepted)mentalState(state);render();},audio,motion,motionEnabled:shouldAnimate});
window.addEventListener('storage',event=>{if(storageEventMatches(event.key,saveKey)||storageEventMatches(event.key,saveSession.legacyKey))guardProgress();});
function downloadProgressBackup(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(saveSession.backup(state),null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.dataset.saveBackup='';link.href=url;link.download=`FX-${selectedMode}-进度备份.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
for(const button of document.querySelectorAll('[data-save-backup]'))button.onclick=downloadProgressBackup;
$('save-retry').onclick=async()=>{const generation=stateGeneration,saved=await persist();if(saved&&generation===stateGeneration&&state.phase==='ending'&&!saveSession.blocked)void rankingLifecycle.submit();};
$('save-conflict-dialog').addEventListener('cancel',event=>event.preventDefault());
$('save-load-latest').onclick=()=>{
  const loaded=saveSession.reload();
  if(!loaded.ok){setText('save-conflict-copy',loaded.reason==='storage'?'浏览器仍无法读取存档。请保留本页，可先下载进度备份，再重试。':'当前存档仍无法识别，未覆盖任何数据。请先下载备份，修复后再重试。');return;}
  stateGeneration++;marketClock.stop();state=enableRealtime(loaded.state||fresh());state.runId||=crypto.randomUUID();
  telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  $('last-trade').textContent='';render();continueScenes();void ensureHistoricalLoaded();marketClock.start();
};
function currentNarrativeAudio(){return narrativeAudioContext(state,{dayOpen:$('day-dialog').open,livingVisible:!$('living-receipt').hidden,propOpen:$('prop-dialog').open,propKind:$('prop-dialog').dataset.kind});}
function syncSceneMusic(){const sceneCue=currentNarrativeAudio()?.cue;void bgm.setScene(selectBgmScene(state,{sceneCue,accountEquity:equity(state),netFloating:currentNetFloating()}),{stabilize:!sceneCue&&['decision','playing'].includes(state.phase)});}
function syncVoiceDuck(){bgm.setVoiceActive(voiceMixActive(voice,$('voice-list').querySelectorAll('audio')));}
function currentNetFloating(){return positionsOf(state).reduce((sum,position)=>sum+positionNetUnrealized(state,position),0);}
function currentRisk(){return Math.round(accountMetrics(state).usedMargin/Math.max(accountMetrics(state).tradingEquity,1)*100);}
function selectedOrder(type='long'){return {type,leverage,stop,stopPips,...orderIntentAction(state,orderAmount)};}
function refreshOrderIntent(){if(!orderDraftIntent(state))return;orderAmount=orderPreview(state,selectedOrder()).margin;$('order-amount').value=Number.isFinite(orderAmount)?orderAmount:'';}
function renderLiveOrderTicket(){refreshOrderIntent();const long=orderPreview(state,selectedOrder('long')),short=orderPreview(state,selectedOrder('short')),blocked=!tradingOpen(state)||actionBusy||saveSession.blocked;$('long').disabled=blocked||!long.valid;$('short').disabled=blocked||!short.valid;setText('order-validation',!long.valid&&!short.valid?long.error:'');$('order-validation').hidden=long.valid||short.valid;setText('preview-margin',yen(long.margin||0));setText('preview-notional',yen(long.notional||0));setText('preview-quantity',`${formatQuantity(long.quantity||0)} USD`);setText('preview-fee',yen(long.openFee||0));setText('preview-debit',yen(long.totalDebit||0));setText('amount-selected',yen(orderAmount||0));}
function selectedPercentage(){return (orderAmountRatio(orderAmount,accountMetrics(state).availableMargin)||0)*100;}
function setText(id,value){if($(id))$(id).textContent=value;}
let marketViewport;
function chart(){
  if(!marketViewport){marketViewport=createChartViewport(document,{onChange:()=>chart()});$('chart').before(marketViewport.root);marketViewport.root.prepend($('quote-package-open'));}
  const candles=displayCandles(state),averages=movingAverageSeries(candles);
  marketViewport.update(candles.length);
  for(const average of averages){const button=$('ma-'+average.period);button.setAttribute('aria-pressed',String(maSettings[average.period]));button.style.setProperty('--ma-color',average.color);setText('ma-value-'+average.period,average.latest===null?'—':quote(average.latest));}
  const view=candlePlot(candles,averages.filter(a=>maSettings[a.period]),{...marketViewport.state,width:$('chart').clientWidth,currentPrice:state.price,id:'market'});
  $('chart').innerHTML=view.html;$('chart').style.height=marketViewport.state.height+'px';
  $('chart').setAttribute('aria-label',`USD/JPY 已发生行情，现价 ${quote(state.price)} 日元/美元；绿色为收盘不低于开盘，粉色为收盘低于开盘。${view.notice}`);
  setText('trading-clock-label',formatTradingTime(currentTradingTimestamp(state),{full:true})+' · '+candlePeriodNotice(state,{includeTimeZone:false}));
}
function renderQuoteFrame(){
  if(saveSession.blocked)return;
  const metrics=accountMetrics(state),orders=positionsOf(state),enabled=canCloseAtKnownQuote(state)&&!actionBusy,account=equity(state);
  setText('price',quote(state.price));setText('inverse-rate',`1 美元 = ${quote(state.price)} 日元`);
  const base=state.candles.findLast(c=>c.day!==state.day)?.close||150,change=(state.price/base-1)*100;
  setText('change',`${change>=0?'+':''}${change.toFixed(3)}%`);$('change').className=change>=0?'positive':'negative';
  setText('equity',yen(account));setText('net-assets',yen(account-debtSummary(state).total));setText('available-margin',yen(metrics.availableMargin));
  setText('floating',signed(metrics.unrealized));$('floating').className=metrics.unrealized>=0?'positive':'negative';
  setText('margin-level',orders.length?`${(metrics.marginLevel*100).toFixed(1)}%`:'— 无持仓');
  renderLiveOrderTicket();const actualRatio=orderAmountRatio(orderAmount,metrics.availableMargin),highlightRatio=nearestOrderRatio(orderAmount,metrics.availableMargin);
  setText('stake-value',actualRatio===null?'—':`${Number((actualRatio*100).toFixed(2))}%`);for(const button of document.querySelectorAll('[data-stake]'))button.setAttribute('aria-pressed',String(Number(button.dataset.stake)===highlightRatio));
  renderCharacter();renderPositions(orders,enabled);floatingRisk.update(accountLiquidationEstimate(state));renderRiskAlerts();chart();
}
function renderPositions(orders,enabled){
  const box=$('position-list'),ids=new Set(orders.map(p=>p.id)),accountRisk=accountLiquidationEstimate(state);
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
    renderPositionRisk(row.querySelector('.stop-progress'),positionRiskView(p,{price:state.price,grossPnl:net,stopLoss:loss,accountEstimate:accountRisk}));
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
const openingReader=mountOpeningReader({frame:$('opening-manga'),getState:()=>state,guard:guardProgress,save:persist,
  startingCapital:START,targetProfit:TARGET_PROFIT,
  openSource:(panel,note)=>panel?openMangaSource(panel,note):openDetails('关于这一页',[note],['原作背景 · 官方简介','https://fxkurumi-info.com/#introduction']),
  onFinish:({replay})=>{continueScenes();if(!replay&&!document.querySelector('dialog[open]'))queueMicrotask(()=>$('order-amount').focus({preventScroll:true}));}
});
function showOpening(options){if(state.mode==='endless')return;voice.stop();openingReader.open(options);}
$('opening-replay').onclick=()=>{$('help-dialog').close();showOpening({replay:true});};
$('mode-open').onclick=()=>{syncMarketSelectors('mode',selectedMarket);$('mode-dialog').showModal();};
function openMangaSource(p,reason){const img=document.createElement('img');setMangaImage(img,p.original,{loading:'eager'});img.alt='未经修改的原作来源图';img.style.width='100%';openDetails(`漫画来源 · 第 ${p.chapter} 话第 ${p.page} 页`,[`${p.character} / ${p.scene} / ${p.expression}`,reason,p.correction||p.meaning,'原图金额、图表与时间只属于漫画，不代表本局账户。'],['用户指定仓库 · 固定版本原文件',p.sourceURL],img);const shown=$('detail-copy').querySelector('img');if(shown)setMangaImage(shown,p.original,{loading:'eager'});}
function scenePortrait(s){return selectFinalPortrait(s,{sealedOutcome:sealedDailyMangaOutcome(s),floatingReaction:floatingReaction.observe(s)});}
function showPortraitSource(){const result=scenePortrait(state);if(result.kind==='manga')openMangaSource(result.panel,result.evidence);else{const image=document.createElement('img');setImage(image,result.path);image.style.width='100%';openDetails('素材出处',[result.sourceLabel,'本作角色插画'],null,image);}}

for(const b of document.querySelectorAll('[data-play-mode]'))b.onclick=async()=>{
 if(actionBusy||!guardProgress())return;
 const mode=b.dataset.playMode,market=$('mode-market').value,generation=stateGeneration,session=saveSession;let switched=false;
 actionBusy=true;marketClock.stop();
 try{
  const targetSession=sessionFor(mode,market),existing=modeStates.get(slot(mode,market))||restoreGame(targetSession.raw);
  if(targetSession.blocked)throw Error('此模式的存档待处理，请先保留备份');
  const candidate=existing||fresh(mode,market==='historical'?await selectedHistoricalOptions('mode',mode):null);
  if(isHistorical(candidate))await historicalLibrary.restore(candidate);
  await persist();if(generation!==stateGeneration||session!==saveSession||saveSession.blocked)return;
  modeStates.set(slot(selectedMode),state);selectedMode=mode;selectedMarket=market;saveKey=saveKeyFor(mode);saveSession=targetSession;stateGeneration++;switched=true;
  developerBackupKey=mode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
  storage.setItem('fx-girl-mode',mode);storage.setItem('fx-girl-market-source',market);state=enableRealtime(candidate);state.runId||=crypto.randomUUID();
  telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;leverage=25;stopPips=30;stop=.5;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  $('mode-dialog').close();if(mode==='story'&&!state.openingSeen)showOpening();else continueScenes();
 }catch(error){setText('history-choice-status',error.message);}
 finally{if(switched||generation===stateGeneration&&session===saveSession){actionBusy=false;render();marketClock.start();}}
};
function checkAchievements(){
  const result=evaluateAchievements(state,achievementProfile);achievementProfile=result.profile;
  if(result.newlyUnlocked.length){try{storage.setItem(achievementKey,JSON.stringify(achievementProfile));}catch{}for(const def of result.newlyUnlocked){createAchievementToast(def);if(sound)soundEffect('terminal-fill',{level:.25});}}
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
    shareFile=buildShareFile(card);$('share-preview').src=shareUrl;$('share-preview').hidden=false;$('share-download').href=shareUrl;$('share-download').download=card.filename||`FX韭留美-第${snapshot.day}天.png`;$('share-original').href=shareUrl;$('share-actions').hidden=false;$('share-native').hidden=!canShareFile(shareFile);$('share-native').disabled=shareBusy;setText('share-status',(snapshot.developmentTaint||snapshot.developer?.edited)?'开发测试战报 · 不计入成就':'战报已生成，可保存原图');telemetry.hook('export_preview',{dedupeKey:String(request)});
  }catch(error){telemetry.hook('export_failed');setText('share-status','战报生成失败：'+error.message);}
}
function syncDayReportPresentation(){
 const current=state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase);
 dayRecapSnapshot=current?buildRecapSnapshot(state):null;
 const n=state.settlementNarrative,ready=state.mode==='story'&&n?.day===state.day&&n.fatherDiscovery&&n.effectsApplied&&state.family?.unlocked&&!state.fatherUsed;
 $('father-scene-use').hidden=!ready;$('father-scene-use').disabled=!ready;
 setText('father-scene-use','取用父亲的柜中存款 · 金额自选');
 if(dayRecapSnapshot){setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);}
}
function renderCharacter(){
  const trauma=tradingTrauma(state),portrait=scenePortrait(state),em=portrait.emotion||mood(state);
  setText('emotion-label',trauma.active?trauma.label:portrait.label||moodInfo[em]?.[0]||'平静');
  emotionOverview.render(state,em);document.body.dataset.trauma=trauma.active?trauma.mood:'';
  showGeneratedPortrait($('portrait'),portrait);
  const voiceContext=selectVoiceContext(state,{floating:currentNetFloating(),hasPositions:positionsOf(state).length>0});
  const voiced=voice.sync({enabled:!document.hidden&&!$('voice-library-dialog').open,emotion:em,speechId:state.speech?.id,run:state.runId,context:voiceContext});
  syncVoiceDuck();syncSceneMusic();
  const speech=trauma.active?trauma.line:voiced?.zh||portrait.line||state.speech?.text||'';setText('speech-content',speech);$('speech').hidden=!speech.trim();
  setText('voice-caption',voiced?`PV 原声 · ${voiced.speaker||'久留美'} · ${voiced.ja||''}`:'');$('voice-caption').hidden=!voiced;
  const available=voice.available(em),active=voice.loading||voice.playing;
  const voiceStatus=voice.lastError?UI_COPY.voiceState[voice.lastError]:voice.loading?UI_COPY.voiceState.loading:voice.playing?UI_COPY.voiceState.playing:available.length?'仅手动播放':'当前没有适配台词';
  setText('voice-state',voiceStatus);$('voice-state').hidden=false;
  setText('voice-toggle',active?'停止原声':available.length?'播放当前原声':'暂无适配台词');
  $('voice-toggle').disabled=!active&&!available.length;$('voice-toggle').setAttribute('aria-pressed',String(active));
  $('voice-toggle').title=active?'停止本段原声':available[0]?.zh||'当前情境没有匹配的原声';
  $('voice-replay').hidden=true;
}
function render(){
  if(!guardProgress())return;
  if(deferredScene?.key!==sceneKey())deferredScene=null;
  $('scene-resume').hidden=!deferredScene;
  const mental=mentalReadout(state),limit=restrictions(state);leverage=Math.max(limit.minLeverage,Math.min(leverage,limit.leverage));if(![5,10,25,50,100].includes(leverage))leverage=leverage<25?10:25;if(limit.forceNoStop){stopPips=null;stop=1;}
  const day=state.day,phase=state.phase,position=state.position,marketPlaying=phase==='playing',end=['day_end','resting','ending'].includes(phase),closing=phase==='closing';
  const account=equity(state),event=currentEvent(state),em=mood(state),info=moodInfo[em]||['平静','calm'];
  const dayNet=account-state.dayOpening-(state.externalFunding-state.dayOpeningFunding)+(state.expenses-state.dayOpeningExpenses);
  const endless=state.mode==='endless',stats=runPerformance(state);
  $('opening-replay').hidden=endless;
  setText('mode-open',endless?'操盘模式 ▾':'剧情模式 ▾');setText('restart','重开韭菜人生');
  setText('stage-name',`${endless?'操盘':'剧情'} · 第 ${day} 天`);
  setText('mission-title',endless?`已存活 ${stats.daysSurvived} 天`:end?'今日结算':'今日开盘');
  setText('mission-copy',endless?`已平仓 ${stats.closedTrades} 笔`:end?`收盘资产 ${yen(state.dayReport?.day===day?state.dayReport.closing:account)}`:`本日开盘 ${yen(state.dayOpening)} · ${state.beat*4+(state.pending?.candle||0)} / ${beatsPerDay(state)*4} 根 K 线`);
  setText('chapter-target',endless?`平仓收益率 ${stats.returnRate===null?'—':(stats.returnRate*100).toFixed(2)+'%'} · 累计平仓 ${signed(stats.totalProfit)}`:`交易净收益 ${signed(tradingProfit(state))} · 首章目标 +${yen(TARGET_PROFIT)}`);
  const trauma=tradingTrauma(state);
  renderCharacter();

  setText('mental-detail',`${trauma.active?trauma.explanation+' ':''}累计回撤 ${Math.round(mental.totalDrawdown*100)}% · 近期回撤 ${Math.round(mental.recentDrawdown*100)}% · ${limit.noEntry?'不能新开仓':`新单最多 ${limit.leverage}× · 合计保证金上限 ${Math.round(limit.stake*100)}%`}`);
  setText('sanity-text',`${Math.round(state.sanity)} / 100`);$('sanity-fill').style.width=state.sanity+'%';
  setText('price',quote(state.price));setText('inverse-rate',`1 美元 = ${quote(state.price)} 日元`);const base=state.candles.findLast(c=>c.day!==day)?.close||state.startPrice||150;
  const change=(state.price/base-1)*100;setText('change',`${change>=0?'+':''}${change.toFixed(3)}%`);$('change').className=change>=0?'positive':'negative';
  setText('beat-label',end||closing?'今日收盘':`当日行情 ${Math.min(state.beat*4+(state.pending?.candle||0)+1,beatsPerDay(state)*4)} / ${beatsPerDay(state)*4}`);
  setText('candle-label',marketPlaying?(state.candles.at(-1)?.closed?'下一根 K 线 · 等待报价':`当前行情报价 ${state.pending.tick} / 6 · 进行中`):closing||end?state.dayReport?.earlyClose?.day===day?'已提前收盘':'本日 K 线已生成':'开盘中');
  if(isHistorical(state)){setText('mission-copy',`${state.historical.date} · 本日开盘 ${yen(state.dayOpening)}`);setText('beat-label','USD/JPY · 历史行情');setText('candle-label',`${state.historical.date} · ${candlePeriodLabel(state)+' K线'}`);}
  marketStatus();
  setText('news-source',event.source);setText('market-news-kind',isHistorical(state)?'行情记录':'汇市快讯');setText('news-time',`${event.time} JST · ${isHistorical(state)?'历史报价':'快讯'}`);setText('news-title',isResearch(state)?'USD/JPY · 历史行情':event.title);setText('news-copy',isResearch(state)?`${formatTradingTime(currentTradingTimestamp(state),{full:true})} · ${{gap:'等待继续',loading:'正在载入',error:'载入中断','day-end':'本日已结束',exhausted:'行情已结束'}[state.historical.status]||(state.marketPaused?'已暂停':'回放中')}`:event.copy);
  const metrics=accountMetrics(state),orders=positionsOf(state),canTrade=tradingOpen(state)&&!actionBusy,canClose=canCloseAtKnownQuote(state)&&!actionBusy;
  setText('equity',yen(account));setText('net-assets',yen(account-debtSummary(state).total));setText('total-debt',yen(debtSummary(state).total));setText('free-cash',yen(state.cash));setText('used-margin',yen(metrics.usedMargin));setText('reserve-amount',yen(state.reserve));setText('external-funding',yen(debtSummary(state).total));
  setText('available-margin',yen(metrics.availableMargin));setText('fees-paid',yen(metrics.feesPaid));
  setText('margin-level',orders.length?`${(metrics.marginLevel*100).toFixed(1)}%`:'— 无持仓');
  $('margin-level').className=orders.length&&metrics.marginLevel<=1?'negative':'';
  const todayMetrics=dailyReturnMetrics(state),displayPnl=endless?stats.totalProfit:todayMetrics.tradingNet,displayRate=endless?stats.returnRate:todayMetrics.returnRate;setText('pnl-period',endless?'累计平仓盈亏':todayMetrics.tradingNetPartial?'今日平仓 · 留存样本':'今日平仓盈亏');setText('day-pnl',signed(displayPnl));setText('day-return',displayRate===null?'—':`${displayRate>0?'+':''}${(displayRate*100).toFixed(2)}%`);$('day-pnl').className=displayPnl>=0?'positive':'negative';
  $('position-card').hidden=false;$('position-empty').hidden=!!orders.length;for(const id of ['hold','half','close'])$(id).hidden=!orders.length;
  renderLiveOrderTicket();const actualRatio=orderAmountRatio(orderAmount,metrics.availableMargin),highlightRatio=nearestOrderRatio(orderAmount,metrics.availableMargin);
  setText('stake-value',actualRatio===null?'—':`${Number((actualRatio*100).toFixed(2))}%`);setText('leverage-value',`${leverage}×${dailyLeverageUnlocked(state)?' · 今日免连点':''}`);setText('stop-value',stopPips===null?'不预设':`${stopPips} 点`);
  $('emotion-order-rule').hidden=!limit.forceNoStop;setText('emotion-order-rule',`${info[0]}：只能不设止损，杠杆至少 25×`);
  const preview=orderPreview(state,selectedOrder('long')),shortPreview=orderPreview(state,selectedOrder('short'));
  setText('preview-margin',yen(preview.margin||0));setText('preview-notional',yen(preview.notional||0));setText('preview-quantity',`${formatQuantity(preview.quantity??(preview.notional||0)/state.price)} USD`);setText('preview-fee',yen(preview.openFee||0));setText('preview-debit',yen(preview.totalDebit||0));
  const lossView=orderLossView(stopPips,preview,shortPreview,yen);
  setText('risk-label',lossView.label);setText('risk-amount',lossView.amount);setText('risk-note',lossView.note);$('risk-note').hidden=!lossView.note;
  const liquidation=p=>Number.isFinite(p.liquidationPrice)&&p.liquidationPrice>0?quote(p.liquidationPrice):'无单一价格线';
  setText('preview-liquidation',`多美元 ${liquidation(preview)} / 空美元 ${liquidation(shortPreview)} 日元/美元`);
  renderLiquidation('liquidation-long',preview.liquidation,preview.valid);renderLiquidation('liquidation-short',shortPreview.liquidation,shortPreview.valid);
  floatingRisk.update(accountLiquidationEstimate(state));
  setText('order-validation',!preview.valid&&!shortPreview.valid?(preview.error||'当前不能新开仓'):'');$('order-validation').hidden=preview.valid||shortPreview.valid;
  $('order-validation').classList.toggle('invalid',!preview.valid&&!shortPreview.valid);
  for(const [attr,value] of [['stake',highlightRatio],['leverage',leverage],['stop',stop]])for(const button of document.querySelectorAll(`[data-${attr}]`)){button.setAttribute('aria-pressed',String(Number(button.dataset[attr])===value));button.disabled=!canTrade;}
  for(const id of ['long','short','wait','hold','half','close'])$(id).disabled=!(['half','close'].includes(id)?canClose:canTrade);for(const b of document.querySelectorAll('[data-stop-pips]')){b.setAttribute('aria-pressed',String(b.dataset.stopPips===(stopPips===null?'none':String(stopPips))));b.disabled=!canTrade||(limit.forceNoStop&&b.dataset.stopPips!=='none');}
  $('long').disabled ||= !preview.valid;$('short').disabled ||= !shortPreview.valid;
  closeAllControl.refresh();
  $('wait').hidden=true;$('hold').hidden=true;
  setText('position-count',`${orders.length} 笔`);setText('floating',signed(metrics.unrealized));$('floating').className=metrics.unrealized>=0?'positive':'negative';
  renderPositions(orders,canClose);
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
  setText('amount-slider-max',yen(amountCap));setText('amount-selected',Number.isFinite(orderAmount)?yen(orderAmount):'—');setText('amount-limit',amountCap>=100?`本单上限 ${yen(amountCap)} · 可用 ${yen(metrics.availableMargin)}`:'当前可开仓额度不足 ¥100');
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
  $('developer-status').hidden=!isDevelopmentTainted();$('developer-open').disabled=actionBusy||!developerUI.available();$('ending-developer').disabled=actionBusy||!developerUI.available();
  setText('privacy-toggle',isDevelopmentTainted()?'测试存档 · 不统计':state.historical?.version===2?'历史行情 · 不统计':telemetry.dnt?'浏览器已禁用统计':telemetry.enabled?'匿名统计 · 开':'匿名统计 · 关');$('privacy-toggle').disabled=false;
  telemetry.view({screen:$('story-dialog').open?'story':phase==='playing'?'market':phase==='closing'?'closing':phase==='resting'?'resting':phase==='ending'?'ending':end?'day_end':'trading',run:state.runId,day});
  if(lastMood!==em){track('mood_change',em,{mood:em,previousMood:lastMood||'none',sanityBucket:bucket(state.sanity)});lastMood=em;}
  track('news_seen',event.id,{newsId:event.id,day,beat:state.beat},`news:${day}:${state.beat}:${event.id}`);
  track('day_start','day',{day},`day-start:${day}`);
  chart();renderInvestors();renderRiskAlerts();checkAchievements();tradingExpression.refresh();syncDayReportPresentation();persist();marketClock.start();
}
function renderInvestors(){
 investorDanmaku.update(state,{paused:document.hidden||saveSession.blocked||!tradingOpen(state)||!!state.marketPaused||!!document.querySelector('dialog[open]'),reducedMotion:!fullMotion});
}
// The comment clock is independent of candle renders, and pauses with the game.
setInterval(renderInvestors,250);
$('comment-credits-open').onclick=()=>{mountCommentCredits($('comment-credits'));$('comment-credits-dialog').showModal();};
function soundEffect(kind,opts){audio.effect(kind,opts);}
function terminalFeedback(event){const cue=terminalCueForEvent({...event,quiet:['numb','recovering'].includes(tradingTrauma(state).mood)});soundEffect(cue.kind,{level:cue.level});}
document.addEventListener('click',e=>{const b=e.target.closest('button:not(:disabled)');if(b&&!['long','short','half','close'].includes(b.id)&&!b.dataset.positionAction&&!b.dataset.riskAction){audio.unlock();soundEffect('terminal-tap',{level:.3});}},true);
function impact(label,amount,tone='gain'){
  if(['numb','recovering'].includes(tradingTrauma(state).mood))return;
  const heat=state.heat||0,rate=Math.min(1.8,1+heat*.13);
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
 shownFlashTimer=setTimeout(()=>$('news-flash').hidden=true,3600);terminalFeedback({type:'news'});}
function tradeTotals(trades){const list=(trades||[]).filter(Boolean);return{count:list.length,margin:list.reduce((n,t)=>n+t.margin,0),pnl:list.reduce((n,t)=>n+t.pnl,0),liquidated:list.some(t=>t.type==='liquidation')};}
function afterTick(result){
  if(result.flash){flash(result.flash);if(result.flash.swan)track('black_swan',result.flash.id,{newsId:result.flash.id,day:state.day,beat:result.flash.beat},`swan:${state.day}:${result.flash.id}`);}
  const exits=result.exits||[result.exit],total=tradeTotals(exits);for(const t of exits)trackExit(t);
  if(total.count){const tag=total.liquidated?'强制平仓':'止损已触发';
    terminalFeedback({type:'close',...total});toast(`${tag} ${total.count} 笔 · ${signed(total.pnl)}`,total.pnl>=0?'gain':'loss');impact(tag,signed(total.pnl),total.pnl>=0?'gain':'loss');fly('平仓',$('position-card'),$('free-cash'));
    if(total.liquidated)motion.animate($('character-card'),[{transform:'translateX(-6px)'},{transform:'translateX(5px)'},{transform:'translateX(-2px)'},{transform:'none'}],{duration:360});
  }else if(result.candleClosed)soundEffect('rattle',{rate:1+state.heat*.1,level:.12+state.heat*.02});
  render();if(total.count)tradingExpression.trade(exits);if(result.candleClosed)motion.animate($('price'),[{transform:'scale(1.04)'},{transform:'none'}],{duration:240});
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sendAction(type,positionId=null,sourceButton=null){
  if(!guardProgress())return;
  if(actionBusy||!tradingOpen(state)&&!(['half','close'].includes(type)&&canCloseAtKnownQuote(state)))return;
  const button=sourceButton||$(type),buttonRect=button.getBoundingClientRect(),positionRect=$('position-card').getBoundingClientRect();
  actionBusy=true;audio.unlock();render();
  $('restart').disabled=true;for(const b of document.querySelectorAll('[data-prop]'))b.disabled=true;
  motion.animate(button,[{transform:'scale(1)'},{transform:'scale(.9) rotate(-2deg)'},{transform:'scale(1.06) rotate(1deg)'},{transform:'none'}],{duration:210});
  try{
    const orderPercent=selectedPercentage();
    track('trade_attempt',type,{direction:type==='short'?'short':'long',stake:orderPercent,leverage,stop:stop*100,equityBucket:capitalBucket(equity(state))});
    const result=takeAction(state,{...selectedOrder(type),...(positionId?{positionId}:{})});if(result.trade?.type==='open')track('trade_open',type,{direction:type==='long'?'long':'short',stake:orderPercent,leverage,stop:stop*100});else for(const t of result.trades||[result.trade])trackExit(t);render();
    if(type==='long'||type==='short'){
      const amount=result.trade.margin,label=directionLabel(type==='long'?1:-1);

      terminalFeedback({type:'open'});fly(`${label} ${yen(amount)}`,buttonRect,$('position-card'));impact(label,`${leverage}× · ${yen(amount)}`);
    }else if(result.trade){
      const total=tradeTotals(result.trades||[result.trade]),label=positionId?(type==='half'?'本单减半':'本单平仓'):(type==='half'?'全部减半':'全部平仓');

      terminalFeedback({type:'close',...total});fly(`${label} ${signed(total.pnl)}`,positionRect,$('free-cash'));impact(label,signed(total.pnl),total.pnl>=0?'gain':'loss');
    }else if(type==='hold'){impact('继续持有',signed(unrealized(state)),'hold');}
    else toast('空仓');
    actionBusy=false;render();tradingExpression.trade(result.trades||[result.trade]);marketClock.start();
  }catch(error){actionBusy=false;terminalFeedback({type:'reject'});track('trade_rejected',type,{reason:'unavailable'});toast(error.message,'loss');render();}
}
function renderLiquidation(id,estimate,valid){
 const box=$(id);box.replaceChildren();
 if(!valid){box.textContent='当前设置无法开仓';return;}
 if(!estimate||estimate.reason){box.textContent=estimate?.reason==='hedged'?'多空抵消，无单一强平价':'当前仓位无可达强平价';return;}
 const price=document.createElement('b'),move=document.createElement('b'),loss=document.createElement('b');price.textContent=quote(estimate.price)+' 日元/美元';move.textContent=`${estimate.movePercent<0?'下跌':'上涨'} ${Math.abs(estimate.movePercent).toFixed(2)}%`;loss.textContent=yen(estimate.lossThreshold);
 box.append(price,' · ',move,document.createElement('br'),'账户浮亏达到 ',loss,'，触发强平');
 if(estimate.prices?.length>1)box.append(document.createElement('br'),'混合旧约有双向边界：',estimate.prices.map(p=>quote(p)+' 日元/美元').join(' / '),'；以上显示最近边界。');
}
let dailyArtworkView=null,dailyArtworkSnapshot=null,dayRecapView=null,dayRecapSnapshot=null,storyConfirmAfter=0,livingView=null,narrativeTimer=null,narrativeRun=0;
function cancelNarrativePresentation(){narrativeRun++;clearTimeout(narrativeTimer);narrativeTimer=null;livingView?.dispose();livingView=null;}
const recapReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');recapReducedMotion.addEventListener?.('change',e=>{if(e.matches)dayRecapView?.finish();});
function renderDayRecap({animate=true}={}){
 dayRecapView?.dispose();dayRecapSnapshot=buildRecapSnapshot(state);setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);
 dayRecapView=mountDailyRecap($('daily-recap'),dayRecapSnapshot,{motion:animate&&shouldAnimate(),replayMotion:shouldAnimate,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,onSound:soundEffect,onTimeline:(cues,options)=>audio.scheduleTimeline(cues,options),cash:accountMetrics(state).availableMargin,loanUnlocked:state.loan?.unlocked,loanTerms:networkLoanTerms(state),portraitUrl:assetURL(scenePortrait(state).path),moodLabel:$('emotion-label').textContent,usedGroups:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.group),usedChoices:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.id),onChoice:choice=>{
  if(actionBusy||!guardProgress())return;
  if(choice.loan){$('loan-open').click();return;}
  actionBusy=true;try{const receipt=chooseRecapAction(state,choice.id);actionBusy=false;preserveScroll($('daily-recap'),()=>{render();renderDayRecap({animate:false});},{focusSelector:'.recap-choices button:not(:disabled)',focusFallback:$('recap-next')});toast(receipt.cost?`${receipt.label} · 支付 ${yen(receipt.cost)}`:'今晚慢一点，先好好休息');}catch(error){toast(error.message,'loss');}finally{actionBusy=false;}
 }});
}
$('day-dialog').addEventListener('close',()=>{dailyArtworkView?.dispose();dailyArtworkView=null;cancelNarrativePresentation();dayRecapView?.dispose();dayRecapView=null;dayRecapSnapshot=null;});
$('loan-dialog').addEventListener('close',()=>{if($('day-dialog').open)preserveScroll($('daily-recap'),()=>renderDayRecap({animate:false}));});
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
   if(living.charged&&saved)track('settlement_confirm','living-cost',{kind:'living-cost',reason:'applied'},`living:${state.day}`);
   render();dayRecapSnapshot=buildRecapSnapshot(state);
   $('living-event-art').hidden=true;$('living-event-art').replaceChildren();
   livingView=mountLivingReceipt($('living-receipt'),living.receipt,{motion:living.charged&&shouldAnimate(),reducedMotion:recapReducedMotion.matches,onSound:()=>narrativeCues.emit(currentNarrativeAudio(),{fresh:living.charged}),onReady:()=>{if(current()&&!saveSession.blocked){storyConfirmAfter=performance.now();$('next-day').disabled=false;}}});
   mountConsumptionChoices();
   syncSceneMusic();syncDayReportPresentation();
   if(saved&&result.hooks.length)state.pendingFatherHint=true;
  }catch(error){track('error','daily-settlement',{kind:'settlement',reason:'failed'});setText('day-story-status',error.message);$('day-story-status').hidden=false;}
 };
 narrativeTimer=setTimeout(finish,state.settlementNarrative?.effectsApplied?0:shouldAnimate()?1100:0);
}
$('father-scene-use').onclick=()=>showProp('father');
function showDaySettlement(){if($('day-dialog').open||$('bankrupt-dialog').open)return;showDayDialog();}
$('day-dialog').addEventListener('cancel',e=>e.preventDefault());
function syncEveningReceipts(){
 // Receipt amounts stay in the consumption statement. Daily art has one owner.
 const host=$('day-evening-receipts');host?.replaceChildren();if(host)host.hidden=true;
}
function syncContextualDaily(){return false;}
function showDayDialog(){
 if(state.mode==='endless')return;
 const r=state.dayReport;if(!r)return;
 // A new/reopened story must not show the previous day's paid receipt while
 // its own narrative and durable settlement are still pending.
 for(const id of ['living-receipt','living-event-art']){const view=$(id);view.hidden=true;view.replaceChildren();}
 if(state.day===r.day&&state.phase==='day_end'){beginRest(state);render();}
 const stage=settlementPresentation(state),narrative=stage?.stage==='story'?prepareDailyNarrative(state,{accountEquity:equity(state)}):null,scene=selectDailyScene(state),event=narrative?.event||scene?.event;
 const storyVisible=stage?.stage==='story';$('daily-recap').hidden=storyVisible;$('day-story-stage').hidden=!storyVisible;$('recap-next').hidden=storyVisible;$('next-day').hidden=!storyVisible;$('recap-next').dataset.eventToken=stage?.token||'';$('next-day').dataset.eventToken=stage?.token||'';
 setText('day-stage-label',storyVisible?'2 / 2 · 今日小剧场':'1 / 2 · 动态复盘');setText('day-title',!storyVisible?'今日动态复盘':scene?.kind==='story'&&event?event.title:'今日小剧场');setText('day-subtitle',`第 ${r.day} 天 · ${r.earlyClose?'提前收盘':'收盘'} · ${formatTradingTime(reportTradingTimestamp(state,r),{full:true})}`);
 const frame=$('day-story-comic-frame');frame.hidden=true;frame.replaceChildren();$('day-story-lines').replaceChildren();
 $('turnaround-panel').hidden=true;$('homage-panel').hidden=true;
 if(event&&storyVisible)track('story_seen',event.id,{storyId:event.id,mood:mood(state)},`story:${event.id}`);
 for(const id of ['day-result-manga','day-contextual-manga','father-discovery-scene','day-story-fallback','day-evening-receipts']){const host=$(id);host.replaceChildren();host.hidden=true;}
 $('day-story-lines').hidden=true;
 if(storyVisible){
  dailyArtworkSnapshot=selectDailyArtwork(state,narrative);
  dailyArtworkView?.dispose();dailyArtworkView=mountDailyArtwork(frame,dailyArtworkSnapshot);
  // Only a selected narrative scene owns dialogue. Unrelated trading dialogue
  // must not be appended underneath a dinner or a distinct manga story.
  const family=isDailyFamilyNarrative(narrative);
  if(family){$('day-story-lines').hidden=false;for(const [from,text] of selectDailyFamilyLines(state,narrative)){const p=document.createElement('p');p.textContent=`${from}：${text}`;$('day-story-lines').append(p);}}
  else if(!dailyArtworkSnapshot&&event){$('day-story-lines').hidden=false;for(const [from,text] of [...(event.lines||[]),...(event.choices?.[0]?.lines||[])]){const p=document.createElement('p');p.textContent=`${from}：${text}`;$('day-story-lines').append(p);}}
  if(dailyArtworkSnapshot)setText('day-title',dailyArtworkSnapshot.title);
 }
 setText('day-total',yen(r.closing));setText('day-net',`今日交易 ${signed(r.net)} · 累计已实现 ${signed(runPerformance(state).totalProfit)}`);
 setText('next-day',state.walkawayRequested?'收手离场':'明天开盘');if(!storyVisible){cancelNarrativePresentation();renderDayRecap();}else dayRecapView?.finish();if(!$('day-dialog').open)$('day-dialog').showModal();track('screen_view',storyVisible?'daily-family':'daily-summary',{kind:'settlement',reason:storyVisible?'family':'summary'},`settlement-stage:${state.day}:${storyVisible?'story':'recap'}`);if(storyVisible&&narrative?.fatherFrames?.length)track('story_seen','father-discovery',{kind:'family-funds',reason:'discovered'},`father-discovery:${state.day}`);if(storyVisible){$('day-story-status').hidden=true;narrativeCues.emit(currentNarrativeAudio(),{fresh:!state.settlementNarrative?.effectsApplied});syncSceneMusic();startNarrativeCompletion();persist();}

}
function mountConsumptionChoices(){mountConsumptionStatement($('living-receipt'),consumptionStatement(state),{onLifestyle:plan=>{if(!guardProgress())return;try{selectLifestyle(state,plan.id);persist();preserveScroll($('living-receipt'),()=>{$('living-receipt').querySelector('.consumption-statement')?.remove();mountConsumptionChoices();$('living-receipt').querySelector('.living-adjustment').open=true;},{focusSelector:'.living-plan-choices button:not(:disabled)'});}catch(error){toast(error.message,'loss');}}});}
async function newChapter(){
 if(!guardProgress())return;if(actionBusy)return;actionBusy=true;marketClock.stop();const generation=stateGeneration;let replaced=false;
 try{
  const market=$('restart-market').value,candidate=fresh(selectedMode,market==='historical'?await selectedHistoricalOptions('restart',selectedMode):null);
  if(generation!==stateGeneration||!guardProgress())return;
  const targetSession=sessionFor(selectedMode,market);if(targetSession.blocked)throw Error('目标存档待处理，未开始新局');
  modeStates.set(slot(selectedMode),state);selectedMarket=market;saveKey=saveKeyFor(selectedMode);saveSession=targetSession;storage.setItem('fx-girl-market-source',market);
  stateGeneration++;replaced=true;rankingLifecycle.clear();state=enableRealtime(candidate);modeStates.set(slot(selectedMode),state);state.runId=crypto.randomUUID();telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;leverage=25;stop=.5;stopPips=30;
  for(const d of document.querySelectorAll('dialog[open]'))d.close();$('last-trade').textContent='';if(state.mode==='story')showOpening();scrollTo({top:0,behavior:fullMotion?'smooth':'instant'});
 }catch(error){setText('history-choice-status',error.message);}
 finally{if(replaced||generation===stateGeneration){actionBusy=false;render();marketClock.start();}}
}
async function showProp(id,confirmed=false){
  if(actionBusy||!guardProgress()||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase))return;
  if(id==='father'&&!confirmed){fatherAmountControls.refresh();renderFatherIllustration($('father-confirm-art'),fatherItemIllustration(state,{stage:'confirm',accountEquity:equity(state)}));$('father-take-dialog').showModal();return;}
  audio.unlock();let result;const generation=stateGeneration;
  try{result=useProp(state,id,id==='father'?{amount:Number($('father-take-amount').value)}:{});if(id==='father'||id==='dailyDrink'){if(id==='father')applyFatherDiscovery(state,{type:'sync-taken'});actionBusy=true;const saved=await persist();if(generation!==stateGeneration)return;actionBusy=false;if(saveSession.blocked)return;if(!saved){render();toast(id==='father'?'取款已保留在本页，存档未成功。请先重试保存。':'饮料效果已保留在本页，存档未成功。请先重试保存，刷新可能丢失本次使用。','loss');return;}}}catch(error){if(generation!==stateGeneration)return;actionBusy=false;toast(error.message,'loss');return;}
  if(id==='father')track('item_used','father',{kind:'family-funds',reason:'taken'},'father-taken');else track('item_used',id,{itemId:id,mood:mood(state),equityBucket:capitalBucket(equity(state))});for(const t of result.trades||[result.trade])trackExit(t);for(const e of state.effects)track('debuff_applied',e.id,{debuffId:e.id,itemId:id,duration:e.remaining||0},`effect:${state.day}:${state.beat}:${id}:${e.id}`);
  const spec=PROPS[id];render();
  if(id!=='father'||state.mode==='endless'){soundEffect(id==='mochiko'?'terminal-fill':'terminal-close',{level:.3});toast(id==='father'?`到账 ${yen(result.amount)}`:`${spec.name}${result.cost?' · −'+yen(result.cost):''}`);return;}
  const propArt=propEventArt(id,{applied:true});renderFatherIllustration($('father-applied-art'),id==='father'?fatherItemIllustration(state,{stage:'applied',result}):propArt?{art:propArt}:null);$('prop-comic-frame').hidden=true;setText('prop-title',spec.name);setText('prop-line',id==='father'?approvedQuote('V2-E03-05',state)?.text||'':PROP_LINES[id]||'');setText('prop-rule',spec.copy);
  $('prop-dialog').dataset.kind=id;$('prop-dialog').showModal();narrativeCues.emit(currentNarrativeAudio());syncSceneMusic();
  const propRun=++propPresentationRun;
  const amount=result.amount||0,started=performance.now(),duration=shouldAnimate()?1500:0;
  if(amount){
    let soundStep=-1;
    const count=now=>{if(propRun!==propPresentationRun||generation!==stateGeneration||!$('prop-dialog').open)return;const progress=duration?Math.min(1,(now-started)/duration):1,ease=1-Math.pow(1-progress,3);setText('prop-amount',`+${yen(amount*ease)}`);
      const step=Math.floor(progress*7);if(step!==soundStep){soundStep=step;soundEffect('terminal-tap',{rate:Math.min(1.25,.9+step*.05),level:.25});}
      if(progress<1&&$('prop-dialog').open)propFrame=requestAnimationFrame(count);else if(progress===1)soundEffect('terminal-fill',{level:.4});};
    propFrame=requestAnimationFrame(count);

  }else{
    const total=tradeTotals(result.trades||[result.trade]);setText('prop-amount',result.trade?signed(total.pnl):result.cost?`−${yen(result.cost)}`:spec.caption);soundEffect(id==='mochiko'?'terminal-fill':'terminal-close',{level:.3});
  }
  motion.animate($('prop-dialog'),[{opacity:0,transform:'translateY(30px) scale(.85) rotate(-3deg)'},{opacity:1,transform:'translateY(0) scale(1.03) rotate(1deg)'},{opacity:1,transform:'none'}],{duration:600});
  motion.animate(document.querySelector('.prop-envelope'),[{transform:'rotate(-12deg) scale(.6)'},{transform:'rotate(8deg) scale(1.12)'},{transform:'rotate(-5deg) scale(1)'}],{duration:800});
}
function selectOrderAmount(value,{writeInput=true,intent=null}={}){
 if(actionBusy||!guardProgress())return;
 orderAmount=normalizeOrderAmount(value);
 if(intent)state.orderDraftIntent=intent;else delete state.orderDraftIntent;
 if(Number.isFinite(orderAmount))state.orderDraftAmount=orderAmount;
 if(writeInput)$('order-amount').value=Number.isFinite(orderAmount)?orderAmount:'';
 render();
}
function maxOrderAmount(){return Math.max(orderPreview(state,selectedOrder('long')).maxMargin||0,orderPreview(state,selectedOrder('short')).maxMargin||0);}
for(const b of document.querySelectorAll('[data-amount-preset]'))b.onclick=()=>selectOrderAmount(Number(b.dataset.amountPreset));
$('amount-max').onclick=()=>selectOrderAmount(maxOrderAmount(),{intent:{mode:'max'}});
$('amount-slider').oninput=()=>selectOrderAmount(sliderOrderAmount(Number($('amount-slider').value),maxOrderAmount()));
$('amount-random').onclick=()=>{selectOrderAmount(randomOrderAmount(maxOrderAmount()));setText('amount-random-status',`随机选择 ${yen(orderAmount)}`);};
for(const b of document.querySelectorAll('[data-stake],[data-leverage],[data-stop]'))b.addEventListener('click',()=>{if(b.dataset.stake){selectOrderAmount(ratioOrderAmount(Number(b.dataset.stake),accountMetrics(state).availableMargin,maxOrderAmount()),{intent:{mode:'ratio',ratio:Number(b.dataset.stake)}});return;}if(b.dataset.leverage)leverage=Number(b.dataset.leverage);if(b.dataset.stop)stop=Number(b.dataset.stop);render();});
$('order-amount').oninput=()=>selectOrderAmount(Number($('order-amount').value),{writeInput:false});
$('order-amount').onchange=()=>selectOrderAmount(Number($('order-amount').value));
$('position-list').onclick=e=>{const detail=e.target.closest('[data-position-detail]');if(detail){openPositionDetail(detail.dataset.positionDetail);return;}const b=e.target.closest('[data-position-action]');if(b&&!b.disabled)sendAction(b.dataset.positionAction,b.dataset.positionId,b);};
for(const b of document.querySelectorAll('[data-stop-pips]'))b.onclick=()=>{stopPips=b.dataset.stopPips==='none'?null:Number(b.dataset.stopPips);stop=stopPips===null?1:.5;render();};
for(const type of ['long','short','wait','hold','half','close'])$(type).addEventListener('click',()=>sendAction(type));
// Both close-all buttons are bound once through closeAllControl above.
function selectMarketSpeed(value){
 if(actionBusy||!guardProgress()||![1,2,4].includes(value))return;
 if(isHistorical(state)&&!historicalReady(state)){toast('请先处理历史行情提示');return;}
 speed=value;state.marketPaused=false;
 for(const option of document.querySelectorAll('[data-speed]'))option.setAttribute('aria-pressed',String(Number(option.dataset.speed)===speed));
 render();marketClock.reschedule();
}
for(const b of document.querySelectorAll('[data-speed]'))b.addEventListener('click',()=>selectMarketSpeed(Number(b.dataset.speed)));
$('finish-day').onclick=()=>{if(actionBusy||!guardProgress()||state.mode==='endless'||!canCloseAtKnownQuote(state))return;actionBusy=true;marketClock.stop();try{audio.unlock();finishTradingDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);}catch(error){toast(error.message);}finally{actionBusy=false;render();continueScenes();}};
$('tool-list').addEventListener('click',e=>{const b=e.target.closest('[data-prop]');if(b)showProp(b.dataset.prop);});
$('prop-done').onclick=()=>{cancelAnimationFrame(propFrame);$('prop-dialog').close();continueScenes();};
$('prop-dialog').addEventListener('close',()=>{propPresentationRun++;cancelAnimationFrame(propFrame);syncSceneMusic();});
$('prop-dialog').addEventListener('cancel',()=>{cancelAnimationFrame(propFrame);requestAnimationFrame(continueScenes);});
$('motion-toggle').onclick=()=>{dayRecapView?.finish();fullMotion=!fullMotion;storage.setItem('fx-girl-motion',fullMotion?'full':'reduce');motion.configure(fullMotion);document.body.classList.toggle('motion-full',fullMotion);render();};
$('sound').onclick=()=>{sound=!sound;storage.setItem(settingsKey,sound?'sound':'mute');audio.unlock();audio.configure({sound,soundVolume:.5});soundEffect('terminal-tap',{level:.3});render();};
$('achievements-open').onclick=openAchievements;$('share-open').onclick=openShare;$('day-share').onclick=openShare;
$('share-dialog').addEventListener('close',()=>{shareRequest++;shareFile=null;if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null;}});
$('share-download').onclick=()=>{telemetry.hook('export_download');setText('share-status',UI_COPY.shareSaving);};
$('share-native').onclick=async()=>{if(shareBusy||!shareFile)return;const request=shareRequest;shareBusy=true;$('share-native').disabled=true;setText('share-status','正在打开系统分享…');const result=await shareReportFile(shareFile);shareBusy=false;if(request!==shareRequest)return;$('share-native').disabled=false;setText('share-status',UI_COPY.shareResult[result]);if(['shared','cancelled','failed'].includes(result))telemetry.hook('export_'+result);};
$('help').onclick=()=>$('help-dialog').showModal();for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>{$(b.dataset.close).close();continueScenes();};
function showNewChapter(){syncMarketSelectors('restart',selectedMarket);$('restart-dialog').showModal();}
$('restart').onclick=showNewChapter;$('confirm-restart').onclick=newChapter;$('new-chapter').onclick=showNewChapter;
// A daily comic can have no pending one-time story (for example after quietNight).
// Acknowledge the closing screen itself so the dispatcher cannot reopen it.
$('recap-next').onclick=event=>{if(event.detail>1||!$('day-dialog').open||!guardProgress()||!enterSettlementStory(state,$('recap-next').dataset.eventToken))return;dayRecapView?.finish();storyConfirmAfter=performance.now()+550;render();showDayDialog();$('day-dialog').querySelector('.dialog-scroll')?.scrollTo({top:0,behavior:'instant'});};
$('next-day').onclick=event=>{if(event?.detail>1||performance.now()<storyConfirmAfter||!$('day-dialog').open||!guardProgress()||!canConfirmSettlementStory(state,$('next-day').dataset.eventToken))return;try{if(!state.settlementNarrative?.effectsApplied||state.dayReport?.livingSettlement?.status==='pending')return;completeSettlementStory(state,$('next-day').dataset.eventToken);track('settlement_confirm','daily-settlement',{kind:'settlement',reason:'complete'},`settle-complete:${state.day}`);$('day-dialog').close();render();continueScenes();displayFatherHint();}catch(error){toast(error.message);}};
$('settle-day').onclick=()=>{try{audio.unlock();settleDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);track('day_end','day',{mood:mood(state),equityBucket:capitalBucket(equity(state)),pnlBucket:pnlBucket(state.dayReport.net)},`day-end:${state.day}`);render();showDaySettlement();}catch(error){toast(error.message);}};
function openWalkaway(){if(actionBusy||!guardProgress()||!canRequestWalkaway(state))return false;const confirmation=walkawayConfirmation(state);setText('walkaway-title',confirmation.title);setText('walkaway-copy',confirmation.copy);setText('walkaway-status','');$('walkaway-dialog').returnValue='';$('walkaway-dialog').showModal();$('walkaway-dialog').querySelector('[data-close]').focus({preventScroll:true});return true;}
$('retire').onclick=openWalkaway;
$('walkaway-confirm').onclick=()=>{
 if(actionBusy||!$('walkaway-dialog').open||!guardProgress()||!canRequestWalkaway(state))return;
 actionBusy=true;$('walkaway-confirm').disabled=true;marketClock.stop();
 try{requestWalkaway(state,{finishTradingDay,finishEndlessCampaign});deferredScene=null;$('scene-resume').hidden=true;$('walkaway-dialog').close('confirmed');}
 catch(error){setText('walkaway-status',error.message);}
 finally{actionBusy=false;$('walkaway-confirm').disabled=false;render();if(!$('walkaway-dialog').open)continueScenes();}
};
$('ending-restart').onclick=showNewChapter;
$('day-review').onclick=()=>{deferredScene=null;$('scene-resume').hidden=true;showDayDialog();};
// Escape is a presentation-only dismissal handled by enhanceDialogs.
function pauseAuditions(){for(const player of $('voice-list').querySelectorAll('audio'))player.pause();}
bindMarketLifecycle({clock:marketClock,
 onSuspend:()=>{persist();audio.pause();voice.stop();floatingReaction.reset();pauseAuditions();syncVoiceDuck();marketStatus();},
 onResume:()=>{if(!guardProgress())return false;audio.sync();renderCharacter();marketStatus();}
});
function replaceDeveloperState(next){
  stateGeneration++;marketClock.stop();state=enableRealtime(next);state.runId||=crypto.randomUUID();telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const d of document.querySelectorAll('dialog[open]'))d.close();
  $('last-trade').textContent='';render();continueScenes();marketClock.start();
}
const developerUI=mountDeveloperUI({leaderboard,storage,getState:()=>state,getGeneration:()=>stateGeneration,guard:guardProgress,canEdit:()=>!actionBusy&&!isHistorical(state),
 backupKey:()=>developerBackupKey,restore:restoreGame,replace:replaceDeveloperState,
 pause:()=>{state.marketPaused=true;marketClock.stop();},onTaint:()=>{telemetry.setTestMode(isDevelopmentRun());void persist();},notify:toast,render});
let disposeAuditions=null;
$('voice-library-open').onclick=()=>{voice.stop();disposeAuditions?.();syncVoiceDuck();setText('voice-library-caption','');$('voice-library-status').hidden=true;disposeAuditions=mountVoiceLibrary($('voice-list'),VOICE_LINES,{beforePlay:()=>voice.stop(),onPlay:line=>track('voice_play',line.id,{dialogueId:line.id}),onError:line=>{setText('voice-library-caption','“'+line.zh+'”暂时无法播放，请重试或试听其他片段。');}});$('voice-library-dialog').showModal();};
$('voice-library-dialog').addEventListener('close',()=>{disposeAuditions?.();disposeAuditions=null;voice.stop();render();});
let marginPositionId=null;
function renderRiskAlerts(){
 const box=$('risk-alerts'),risks=nearStopOrders(state),visible=new Set(risks.map(r=>String(r.positionId)));
 for(const row of [...box.children])if(!visible.has(row.dataset.riskId))row.remove();
 for(const risk of risks){telemetry.hook('warning_margin',{dedupeKey:`${state.runId}:${state.day}:${risk.positionId}`});let row=[...box.children].find(r=>r.dataset.riskId===String(risk.positionId));
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
 setText('loan-summary',`网贷欠款 ${yen(loan.outstanding)} · 总额度 ${yen(terms.limit)} · 可再借 ${yen(terms.availableCredit)} · 日利率 ${rate}% · 预计下次利息 ${yen(terms.estimatedDailyInterest)}。`);
 setText('loan-assets',`账户总资产 ${yen(terms.nominalAssets)} · 欠款 ${yen(terms.totalDebt)} · 净资产 ${yen(terms.netAssets)} · 可还 ${yen(terms.maxRepayment)}`);
 setText('loan-rules',state.mode==='endless'?'每16根K线按当时利率结息，未付利息计入欠款。额度与利率随资产、债务、借款次数和情绪调整。':'每日收盘结息，提前结束同样结息；未付利息计入欠款。');
 $('loan-borrow').disabled=loanBusy||!canBorrow;$('loan-repay').disabled=loanBusy||terms.maxRepayment<=0;
 for(const b of $('loan-dialog').querySelectorAll('[data-loan-action]')){const limit=b.dataset.loanAction==='borrow'?terms.availableCredit:terms.maxRepayment,amount=b.dataset.loanAmount==='max'?limit:Number(b.dataset.loanAmount);b.disabled=loanBusy||amount<=0||amount>limit||(b.dataset.loanAction==='borrow'&&(!canBorrow||amount<terms.minBorrow));}
}
function renderQuotePackageDialog(){
 const canPurchase=tradingOpen(state);
 $('quote-package-options').innerHTML=candlePeriodMarkup(state,{availableCash:Math.min(Math.max(0,state.cash),accountMetrics(state).availableMargin),canPurchase});
 if(quoteBusyGeneration===stateGeneration)for(const b of $('quote-package-options').querySelectorAll('button'))b.disabled=true;
}
async function executeQuotePackage(minutes){
 if(quoteBusyGeneration===stateGeneration||actionBusy||!guardProgress())return;
 const generation=stateGeneration,session=saveSession;quoteBusyGeneration=generation;actionBusy=true;setText('quote-package-error','');
 try{const result=selectCandlePeriod(state,minutes);if(marketViewport)marketViewport.state.offset=0;renderQuotePackageDialog();const saved=await persist();if(generation!==stateGeneration||session!==saveSession)return;if(saved)toast(result.charged?`${result.receipt.label} · ${yen(result.amount)}`:`已切换${candlePeriodLabel(state)} K线`);}
 catch(error){setText('quote-package-error',error.message);}
 finally{if(generation===stateGeneration&&session===saveSession){quoteBusyGeneration=-1;actionBusy=false;renderQuotePackageDialog();render();marketClock.reschedule();}}
}
$('quote-package-open').onclick=()=>{if(actionBusy||!guardProgress())return;setText('quote-package-error','');renderQuotePackageDialog();$('quote-package-dialog').showModal();};
$('quote-package-options').onclick=e=>{const b=e.target.closest('[data-candle-period]');if(b&&!b.disabled)executeQuotePackage(Number(b.dataset.candlePeriod));};
for(const b of document.querySelectorAll('[data-ma-toggle]'))b.addEventListener('click',()=>{const period=Number(b.dataset.maToggle);maSettings[period]=!maSettings[period];storage.setItem('fx-moving-averages',JSON.stringify(maSettings));chart();});
function executeLoanAction(kind,requested){
 if(loanBusy||actionBusy||!$('loan-dialog').open||!guardProgress())return;
 loanBusy=true;
 try{const terms=networkLoanTerms(state),amount=requested==='max'?(kind==='borrow'?terms.availableCredit:terms.maxRepayment):Number(requested);(kind==='borrow'?borrowNetwork:repayNetwork)(state,amount);track(kind==='borrow'?'item_used':'story_choice',kind==='borrow'?'quick-borrow':'quick-repay',{kind:'loan',reason:kind==='borrow'?'borrowed':'repaid'});$('loan-dialog').close();render();toast(`${kind==='borrow'?'借入':'归还'} ${yen(amount)}`);}
 catch(error){setText('loan-error',error.message);}
 finally{loanBusy=false;if($('loan-dialog').open)renderLoanDialog();}
}
$('loan-open').onclick=()=>{if(actionBusy||!guardProgress())return;setText('loan-error','');renderLoanDialog();$('loan-dialog').showModal();};
$('loan-borrow').onclick=()=>executeLoanAction('borrow',$('loan-amount').value);
$('loan-repay').onclick=()=>executeLoanAction('repay',$('loan-amount').value);
$('loan-quick-actions').onclick=e=>{const b=e.target.closest('[data-loan-action]');if(b&&!b.disabled)executeLoanAction(b.dataset.loanAction,b.dataset.loanAmount);};
let rankingMode='total',rankingGameMode=state.mode||'story',rankingSort='survival',rankingRequest=0,rankingBusy=false;
function rankingEligibility(){
 let submitted=false;try{submitted=state.phase==='ending'&&!hasDevelopmentTaint(state,storage)&&(automaticLeaderboard.completed.has(state.runId)||storage.getItem('fx-api-v1-finished-score-'+state.runId)==='1');}catch{}
 setText('ranking-eligibility',isDevelopmentTainted()?'开发测试局不进入排行榜':state.historical?.version===2?'历史行情不进入排行榜':submitted?'本局成绩已自动上榜，仅可修改显示姓名。':state.phase==='ending'?'终局成绩会在保存成功且联网后自动提交，默认匿名。':'真正结束本局后自动上榜；每日收盘不会提交。');
 const sameMode=rankingGameMode===(state.mode||'story'),terminal=state.phase==='ending';
 $('ranking-walkaway').hidden=terminal||!sameMode;
 $('ranking-walkaway').disabled=actionBusy||saveSession.blocked||isDevelopmentRun()!==false||!canRequestWalkaway(state);
 setText('ranking-walkaway-note',!sameMode?'正在浏览另一模式的榜单；切回本局模式后可收手。':terminal?'':isDevelopmentTainted()?'开发测试局不能公开上榜。':state.historical?.version===2?'历史行情不进入排行榜。':state.walkawayRequested?'正在离场结算，完成后自动上榜。':'结束当前'+(state.mode==='endless'?'操盘':'剧情')+'局，按当前报价平仓；结算保存成功后自动上榜。');
 $('ranking-submit-retry').hidden=!terminal||submitted||isDevelopmentRun()!==false;
 $('ranking-submit-retry').disabled=saveSession.blocked;
 $('ranking-publish').disabled=rankingBusy||!submitted;return submitted;
}
function updateAutomaticRankingStatus(result){
 const labels={submitting:'正在自动提交匿名终局成绩…',submitted:'本局成绩已自动上榜，可在排行榜修改显示姓名。','retry-pending':'成绩暂未确认，联网后会自动重试。',unconfigured:'独立排行榜尚未接通，成绩仍保存在本机。','not-submitted':result.reason==='developer'?'开发测试局不会进入正式排行榜。':'成绩暂未提交，请先确保本页进度已保存。'};
 const text=labels[result.state]||'成绩保存在本机。';setText('automatic-score-status',text);setText('ranking-auto-status',text);rankingEligibility();
}
window.addEventListener('online',()=>{if(state.phase==='ending')void rankingLifecycle.submit();});
const percent=value=>Number.isFinite(value)?(value*100).toFixed(2)+'%':'—';
async function readRanking(){const request=++rankingRequest;setText('ranking-status','正在读取…');$('ranking-table').replaceChildren();for(const b of document.querySelectorAll('[data-ranking-game]'))b.setAttribute('aria-pressed',String(b.dataset.rankingGame===rankingGameMode));
 try{const data=await leaderboard.read({mode:rankingMode,gameMode:rankingGameMode,sort:rankingSort,limit:20});if(request!==rankingRequest)return;
  if(!data.rows.length){setText('ranking-status','这个模式还没有提交的成绩。');return;}
  const box=$('ranking-table');for(const r of data.rows){const card=document.createElement('article');card.className='ranking-entry';const header=document.createElement('div');header.className='ranking-entry-head';const name=document.createElement('b');name.textContent=`${r.rank}. ${r.name}`;const days=document.createElement('strong');days.textContent=`存活 ${r.daysSurvived} 天`;header.append(name,days);card.append(header);const hero=document.createElement('div');hero.className='ranking-return';hero.textContent=percent(r.returnRate);const sub=document.createElement('span');sub.textContent='总收益率';hero.prepend(sub);hero.classList.add(r.returnRate>=0?'positive':'negative');card.append(hero);const grid=document.createElement('div');grid.className='ranking-metrics';for(const [label,value] of [['日均收益率',percent(r.dailyReturnRate)],['总收益',signed(r.totalProfit)],['完整订单胜率',percent(r.winRate)],['最大整单盈利',r.maxOrderProfit==null?'—':signed(r.maxOrderProfit)],['最大整单亏损',r.maxOrderLoss==null?'—':signed(r.maxOrderLoss)],['最大回撤',percent(r.maxDrawdown)],['欠父亲',r.fatherDebt==null?'—':yen(r.fatherDebt)],['欠网贷',r.networkDebt==null?'—':yen(r.networkDebt)],['强平订单',r.liquidatedOrders??'—'],['止损订单',r.stopLossOrders??'—'],['最多连亏',r.maxLosingStreak??'—'],['盈利回吐订单',r.profitGivebackOrders??'—']]){const cell=document.createElement('div'),key=document.createElement('span'),val=document.createElement('b');key.textContent=label;val.textContent=value;cell.append(key,val);grid.append(cell);}card.append(grid);box.append(card);}setText('ranking-status',`${rankingGameMode==='endless'?'操盘':'剧情'}模式 · ${data.rows.length} 位玩家`);
 }catch(error){if(request===rankingRequest)setText('ranking-status',error.message+'，可点击重新读取。');}
}
$('leaderboard-open').onclick=()=>{rankingGameMode=state.mode||'story';rankingEligibility();$('leaderboard-dialog').showModal();void readRanking();};
$('leaderboard-dialog').addEventListener('close',()=>{rankingRequest++;continueScenes();});
for(const b of document.querySelectorAll('[data-ranking-game]'))b.onclick=()=>{rankingGameMode=b.dataset.rankingGame;rankingEligibility();void readRanking();};
$('ranking-sort').onchange=()=>{rankingSort=$('ranking-sort').value;void readRanking();};
$('ranking-walkaway').onclick=()=>{if(rankingGameMode!==(state.mode||'story')||isDevelopmentRun()!==false)return;openWalkaway();};
$('walkaway-dialog').addEventListener('close',()=>{if($('walkaway-dialog').returnValue==='confirmed'&&$('leaderboard-dialog').open)$('leaderboard-dialog').close();else if($('leaderboard-dialog').open){rankingEligibility();$('ranking-walkaway').focus({preventScroll:true});}});
$('ranking-submit-retry').onclick=async()=>{if(state.phase!=='ending')return;$('ranking-submit-retry').disabled=true;await rankingLifecycle.submit();rankingEligibility();};
$('ranking-share').onclick=()=>openShare('ranking');
$('ranking-retry').onclick=()=>void readRanking();
$('ranking-form').onsubmit=async e=>{e.preventDefault();if(rankingBusy||!rankingEligibility())return;rankingBusy=true;rankingEligibility();setText('ranking-status','正在更新显示姓名…');try{await leaderboard.rename(state.runId,$('ranking-name').value.trim());await readRanking();setText('ranking-status','显示姓名已更新，成绩与排名记录未重复创建。');}catch(error){setText('ranking-status',error.message);}finally{rankingBusy=false;rankingEligibility();}};

for(const type of ['pointerdown','keydown'])document.addEventListener(type,event=>{if(!event.isTrusted)return;unlockSafeAudio(event);audio.unlock();},{capture:true});
$('order-amount').value=orderAmount;
setText('storage-warning',UI_COPY.storageWarning);setText('share-hint',UI_COPY.shareHint);
for(const text of UI_COPY.help){const p=document.createElement('p');p.textContent=text;$('help-copy').append(p);}
mountBgmPanel($('bgm-panel'),bgm);
bindBgmPreferences(bgm,{storage,document});
$('music-open').onclick=()=>$('bgm-dialog').showModal();
for(const type of ['play','pause','ended','error'])$('voice-list').addEventListener(type,syncVoiceDuck,true);
observeNumericLayout();
const characterReader=mountCharacterStoryReader({getState:()=>state,getContext:()=>`${stateGeneration}:${state.mode}:${state.runId}`,canOpen:()=>!actionBusy&&!saveSession.blocked&&!document.querySelector('dialog[open]')&&!document.querySelector('.settlement-dialog')});
enhanceDialogs({onClose:()=>{voice.stop();syncVoiceDuck();syncSceneMusic();},onDismiss:dialog=>{
  if(['day-dialog','story-dialog','ending-dialog','bankrupt-dialog'].includes(dialog.id)){
    deferredScene={key:sceneKey(),id:dialog.id};$('scene-resume').hidden=false;
  }
}});
$('scene-resume').onclick=()=>{const deferred=deferredScene;deferredScene=null;$('scene-resume').hidden=true;if(deferred?.key===sceneKey()&&deferred.id==='day-dialog')showDayDialog();else continueScenes();};
void initializeHistoricalUI();
render();if(guardProgress()){if(firstVisit)$('mode-dialog').showModal();else if(state.mode==='story'&&!state.openingSeen)showOpening();else continueScenes();}
new MutationObserver(()=>{marketStatus();renderInvestors();marketClock.reschedule();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});renderInvestors();marketClock.start();

function renderTools(){
 characterReader.refresh();
 const box=$('tool-list');const discovered=Object.entries(PROPS).filter(([id])=>itemDiscovered(state,id));
 $('inventory-empty').hidden=!!discovered.length;setText('inventory-empty',UI_COPY.inventoryEmpty);setText('inventory-count',discovered.length?discovered.length+' 件':'');
 const discoveredIds=new Set(discovered.map(([id])=>id));for(const b of [...box.children])if(!discoveredIds.has(b.dataset.prop))b.remove();
 for(const [id,spec] of discovered){const unlocked=itemUnlocked(state,id),unavailable=itemUnavailableReason(state,id),used=id==='father'?state.fatherUsed:state.itemsUsed?.[id];let b=[...box.children].find(el=>el.dataset.prop===id);if(!b){b=document.createElement('button');b.id=id;b.dataset.prop=id;b.append(document.createElement('b'),document.createElement('small'));box.append(b);}const title=b.firstElementChild,small=b.lastElementChild;title.textContent=spec.name;small.textContent=unavailable||(unlocked?used?id==='dailyDrink'?'今日生效 · ':'已使用 · ':'':'未解锁 · ')+spec.caption;b.classList.toggle('item-locked',!unlocked);b.title=unavailable||spec.copy;b.disabled=actionBusy||!!unavailable||!unlocked||used||!(id==='father'?(tradingOpen(state)||['day_end','resting'].includes(state.phase)):tradingOpen(state))||accountMetrics(state).availableMargin<(spec.cost||0);}
 $('family-panel').hidden=!state.fatherUsed;setText('family-debt',`父亲的柜中存款 · 欠款 ${yen(state.family.outstanding)} · 已归还 ${yen(state.family.repaid)}`);$('repay-open').disabled=!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||state.family.outstanding<=0||accountMetrics(state).availableMargin<1;

 $('bankrupt-rescue').hidden=!state.family.unlocked||state.fatherUsed;
 const credit=networkLoanTerms(state);$('loan-panel').hidden=!state.loan?.discovered;setText('loan-state',state.loan?.unlocked?'已开放':'未解锁');setText('loan-effect',`当前额度 ${yen(credit.limit)} · 日利率 ${(credit.dailyRate*100).toFixed(3)}% · 当前欠款 ${yen(state.loan?.outstanding||0)}`);$('loan-open').disabled=!state.loan?.unlocked||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||actionBusy;
}
function continueScenes(){
  if(!guardProgress())return;
  if(deferredScene?.key===sceneKey())return;
  if(state.mode==='endless'){if(state.phase==='ending'&&!document.querySelector('dialog[open]')&&!document.querySelector('.settlement-dialog'))showEnding();return;}
  if(state.realtime&&state.phase==='closing'){settleDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);render();}

 if(['playing','closing'].includes(state.phase)||document.querySelector('dialog[open]')||document.querySelector('.settlement-dialog'))return;
 if(eventComics.presentPending())return;
 if(state.mode==='story'&&!state.openingSeen){showOpening();return;}
 if(state.phase==='resting'&&state.dayReport?.day===state.day&&settlementPresentation(state)?.stage!=='complete'){showDayDialog();return;}
 const event=pendingStory(state);if(event){showStory(event);return;}
 if(state.phase==='day_end')showDaySettlement();else if(state.phase==='ending')showEnding();else if(state.phase==='resting'){track('rest_end','night',{day:state.day},`rest-end:${state.day}`);if(state.walkawayRequested){const forced=endingCondition(state);finishCampaign(state,['broke','crisis'].includes(forced)?forced:'walkaway');}else {if(isHistorical(state)&&!hasHistoricalFeed(state)){void ensureHistoricalLoaded();return;}try{nextDay(state);}catch(error){toast(error.message);return;}}render();void ensureHistoricalLoaded();continueScenes();}else telemetry.view({screen:'trading',run:state.runId,day:state.day});
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
$('story-choices').addEventListener('click',e=>{const b=e.target.closest('[data-story-choice]');if(!b)return;try{const result=chooseStory(state,b.dataset.storyChoice);mentalState(state);track('story_choice',result.event.id,{storyId:result.event.id,choiceId:result.choice.id});for(const id of result.unlocked)track('item_unlocked',id,{itemId:id,storyId:result.event.id});$('story-dialog').close();render();continueScenes();}catch(error){toast(error.message);}});
$('privacy-toggle').onclick=()=>{setText('privacy-copy',UI_COPY.privacy);setText('privacy-state',telemetry.dnt?'浏览器 DNT / GPC 已关闭统计':isDevelopmentTainted()?'开发测试局不发送统计':state.historical?.version===2?'历史行情不发送统计':telemetry.enabled?'当前：开启':'当前：关闭');setText('privacy-confirm',telemetry.enabled?'关闭匿名统计':'开启匿名统计');$('privacy-confirm').disabled=telemetry.dnt||isDevelopmentRun();$('privacy-dialog').showModal();renderTelemetryDiagnostics();};
$('privacy-confirm').onclick=()=>{const next=!telemetry.enabled;storage.setItem('fx-girl-analytics',next?'on':'off');telemetry.setEnabled(next);$('privacy-dialog').close();render();};
$('repay-open').onclick=()=>{const max=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));$('repay-amount').max=max;$('repay-amount').value=Math.min(max,10000);setText('repay-limit',`可归还资金 ${yen(accountMetrics(state).availableMargin)} · 欠款 ${yen(state.family.outstanding)}`);$('repay-dialog').showModal();};
$('repay-all').onclick=()=>{$('repay-amount').value=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));};
$('repay-confirm').onclick=()=>{try{const r=repayFather(state,Number($('repay-amount').value));track('story_choice','father-repay',{kind:'family-funds',reason:'repaid'});$('repay-dialog').close();toast(`归还 ${yen(r.amount)}`);render();continueScenes();}catch(e){setText('repay-limit',e.message);}};
$('bankrupt-rescue').onclick=()=>{$('bankrupt-dialog').close();showProp('father');};
$('voice-toggle').onclick=()=>{
 if(document.hidden||document.querySelector('dialog[open]'))return;
 if(voice.playing||voice.loading){voice.stop();renderCharacter();return;}
 pauseAuditions();renderCharacter();voice.unlock();void voice.play(voice.lastMood,state.speech?.id);
};
const fatherAmountControls=mountFatherAmountControls($('father-take-dialog'),()=>state);
$('father-take-confirm').onclick=()=>{if(!$('father-take-amount').reportValidity())return;$('father-take-dialog').close();void showProp('father',true);};


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
 setText('ending-before','');$('ending-dialog').showModal();void rankingLifecycle.submit();
}

function renderTelemetryDiagnostics(){const d=telemetry.snapshot();setText('privacy-diagnostics',`我的匿名编号：${telemetry.identity()||'未采集'}\n同一浏览器保留编号；清理存储或关闭统计后会重置。\n构建：${d.build}\n接收端：${d.endpoint||'未配置'}\n当前状态：${d.reason}\n待发送 ${d.queued} · 已确认 ${d.sent} · 失败尝试 ${d.failed}\n已过滤 ${d.filteredCount} · 最近原因 ${d.lastFilterReason||'无'}\n最近HTTP ${d.lastStatus||'无'} · 最近确认 ${d.lastSent?new Date(d.lastSent).toLocaleTimeString():'无'}`);}
telemetry.onStatus=()=>{if($('privacy-dialog').open)renderTelemetryDiagnostics();};

async function initializeHistoricalUI(){
 marketSourcePicker=mountMarketSourcePicker({document,library:historicalLibrary,availableYears:['2008','2014'],getMode:prefix=>prefix==='restart'?selectedMode:null,acquireHistory:({datasets})=>{historyAcquireController=new AbortController();return acquireOwnerHistory({datasets,signal:AbortSignal.any([historyAcquireController.signal,AbortSignal.timeout(120000)])});},cancelAcquire:()=>historyAcquireController?.abort(),onSelect:(prefix,market)=>{if(prefix==='mode')refreshModeResumeLabels(market);},importFile:async(file,options)=>{if(file.name?.toLowerCase().endsWith('.fxresearch'))return importResearchPackage(file,options);return importHistoricalPackage(file,options);}});
 for(const prefix of ['mode','restart'])syncMarketSelectors(prefix,selectedMarket);
 $('historical-resume').onclick=()=>{if(!guardProgress())return;if(continueHistoricalGap(state)){render();marketClock.start();}else void ensureHistoricalLoaded(true);};
 try{await marketSourcePicker.load();}catch(error){setText('history-choice-status',error.message||'历史行情暂时无法读取，请重试。');}await ensureHistoricalLoaded();
}
function syncMarketSelectors(prefix,market){if(marketSourcePicker)marketSourcePicker.select(prefix,market);else $(prefix+'-market').value=market;}
function selectedHistoricalOptions(prefix,mode){return marketSourcePicker.options(prefix,mode);}
async function ensureHistoricalLoaded(retry=false){
 if(!isHistorical(state)||historicalLoad||(!retry&&hasHistoricalFeed(state)))return;
 const target=state,generation=stateGeneration;historicalLoad=target;target.marketPaused=true;
 try{await historicalLibrary.restore(target);if(target!==state||generation!==stateGeneration)return;target.marketPaused=target.historical.status!=='ready'||target.historical.resumeAfterLoad===false;delete target.historical.resumeAfterLoad;render();continueScenes();marketClock.start();}
 catch(error){if(target!==state||generation!==stateGeneration)return;target.historical.status='error';target.historical.error=error.message;target.marketPaused=true;render();}
 finally{historicalLoad=null;if(isHistorical(state)&&!hasHistoricalFeed(state)&&(state.historical.status==='loading'||target!==state&&state.historical.status!=='error'))queueMicrotask(()=>ensureHistoricalLoaded());}
}
function renderHistoricalStatus(){
 const h=state.historical,box=$('historical-status');box.hidden=!isHistorical(state)||['ready','day-end'].includes(h?.status);setText('market-disclosure',isHistorical(state)?'原创同人小游戏 · 非官方作品':'原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议');if(!h)return;
 const text=h.status==='gap'?h.gap?.kind==='player_skipped_remainder'?'已跳过前一交易日剩余行情，可继续下一交易日。':h.gap?.kind==='verified_closure'?'休市区间结束，可继续下一条报价。':h.gap?.kind==='weekend_closure_candidate'?'周末区间没有报价，可继续下一条实际报价。':'这段时间没有报价记录，可继续下一条实际报价。':h.status==='exhausted'?'历史行情已播放完。':h.status==='error'?'历史行情载入失败，请重试或重新导入数据包。':h.status==='loading'?'正在载入历史行情…':`历史行情 · ${h.date}`;
 setText('historical-status-copy',text);$('historical-resume').hidden=!['gap','error'].includes(h.status);$('historical-resume').textContent=h.status==='gap'?(h.gap?.kind==='player_skipped_remainder'?'继续下一交易日':'继续下一条报价'):'重试载入';
 if(!['ready','day-end'].includes(h.status))setText('market-phase',text);
 setText('market-disclosure',isHistorical(state)?'原创同人小游戏 · 非官方作品':'原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议');
}

function refreshModeResumeLabels(market){
 let any=false;
 for(const button of document.querySelectorAll('[data-play-mode]')){
  const mode=button.dataset.playMode,saved=modeStates.get(slot(mode,market))||restoreGame(sessionFor(mode,market).raw);any ||= !!saved;
  button.querySelector('b').textContent=saved?(mode==='story'?'继续剧情模式':'继续操盘'):(mode==='story'?'剧情模式':'操盘 · 无尽');
  button.querySelector('small').textContent=saved?(isHistorical(saved)?`已存到 ${saved.historical.date} · 保留原进度`:'保留当前进度 · 原版行情'):(mode==='story'?'人物故事 · 生活费 · 每日收盘':'连续持仓 · 无收盘结算 · 独立排行榜');
 }
 $('mode-resume-note').hidden=!any;
}

addEventListener('resize',()=>chart());
