import {FIRSTDAY_BACKSTORY_NODES,OPPOSITE_IMAGINATION_PANEL} from './contextual-manga-firstday-backstory.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {firstDayBackstoryEvidence} from './contextual-firstday-evidence.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {BORROWING_CONTINUATION_NODES} from './contextual-manga-borrowing-continuation.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {LINK_DAILY_NODES,LINK_DAILY_PANELS} from './contextual-manga-links-content.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {longLossThenShortEvidence} from './contextual-reversal-evidence.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {REVERSAL_DAILY_NODES} from './contextual-manga-reversal-content.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {VERIFIED_DAILY_NODES,VERIFIED_DAILY_PANELS} from './contextual-manga-verified-daily.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {DAILY_EXTENSION_NODES} from './contextual-manga-daily-extension.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {pauseAndReturnEvidence,averagingDownEvidence,friendsLedgersEvidence,floatingCautionEvidence,activityPresentationIdentity} from './contextual-restraint-evidence.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {sealedDailyTradeEvidence,longProfitEvidence,shortProfitEvidence,reversalLiquidationEvidence,oppositeDirectionsEvidence} from './contextual-trade-evidence.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {CONTEXTUAL_MANGA_NODES,CONTEXTUAL_MANGA_ARCS} from './contextual-manga-content.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {CHARACTER_STORY_NODES} from './character-story-content.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {priorBorrowedShortLossEvidence} from './contextual-debt-evidence.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
const arcs={
 ...CONTEXTUAL_MANGA_ARCS,
 'profit-fades':['aud-yen-delight','profit-fades','look-away','first-negative-estimate'],
 'holding-loss':['considering-stop','refuse-to-stop','loss-deepens','support-and-margin','unrealized-fear'],
 'walkaway':['manga-fund-plan'],
};
const titles={'pause-and-return':'久留美 · 她说过要放弃','averaging-down-prayer':'久留美 · 直到只剩下祈求','friends-different-ledgers':'她们 · 与此同时','floating-profit-caution':'久留美 · 浮盈之后的警惕','realized-short-profit':'久留美 · 第一次把利润留住','reversal-liquidation':'芽吹 · 与此同时','opposite-directions':'久留美与芽吹 · 与此同时','borrowed-time':'芽吹 · 与此同时','asking-for-more':'芽吹与久留美 · 与此同时','borrowed-recovery':'芽吹 · 与此同时','twenty-seconds':'芽吹 · 与此同时','follow-confidence':'久留美与芽吹 · 与此同时','profit-fades':'久留美 · 那次消失的浮盈','holding-loss':'久留美 · 那次没等到的反弹',walkaway:'康子 · 与此同时'};
// Extend only the sealed daily reader; independent event readers keep their
// original lists. Amounts in these nodes remain the manga characters' facts.
function dailyArc(id,evidence){
 if(id==='long-loss-then-short')return {id,title:'康子 · 与此同时',parallelStory:true,evidence:structuredClone(evidence),nodes:structuredClone(REVERSAL_DAILY_NODES.filter(n=>n.id==='kangzi-loss-and-turn'))};
 const result=id==='realized-long-profit'?{id,title:'久留美 · 确定下来的利润',parallelStory:true,evidence:structuredClone(evidence),nodes:[]}:arc(id,evidence);
 const node=key=>structuredClone([...CHARACTER_STORY_NODES,...DAILY_EXTENSION_NODES,...VERIFIED_DAILY_NODES,...REVERSAL_DAILY_NODES,...LINK_DAILY_NODES].find(n=>n.id===key));
 if(id==='profit-fades'){result.nodes.unshift(node('entry-expectation'));result.nodes.splice(2,0,node('shop-profit-dream'));}
 if(id==='friends-different-ledgers')result.nodes.unshift(node('friends-earlier-invitation'));
 if(id==='holding-loss')result.nodes.unshift(node('heavy-position'));
 if(id==='follow-confidence'){
  const intro=node('admiring-senpai'),chart=result.nodes[0],follow=result.nodes[1],later=node('message-from-mebuki'),confidence=result.nodes[2];
  intro.panels.push(structuredClone(LINK_DAILY_PANELS[89]));intro.after='久留美觉得，懂得越多，就越有机会赢。';
  chart.title='先看这张图';chart.before='话题转到图表，K线上已经走出一段下跌。久留美认真起来：“投资是自负盈亏的。”';
  chart.panels.unshift(...[94,95].map(r=>structuredClone(LINK_DAILY_PANELS[r])));
  later.title='后来的消息';later.panels.push(...confidence.panels);later.after=confidence.after;
  result.nodes=[intro,node('imagined-life-and-accounts'),chart,follow,later];
 }
 if(id==='realized-short-profit')result.nodes.unshift(node('first-trade-beginning'));
 if(id==='borrowed-time')result.nodes.splice(2,0,node('policy-surge-conversation'));
 if(id==='asking-for-more'){result.title='芽吹 · 与此同时';result.nodes.push(node('promise-and-doubt'),node('mochiko-responsibility'),...structuredClone(BORROWING_CONTINUATION_NODES));}
 if(id==='borrowed-recovery')result.nodes.splice(2,0,node('short-plan-drawdown'));
 if(id==='realized-long-profit')result.nodes=['long-profit-realized','later-overseas-profit'].map(node);
 const before=(record,key)=>{const index=result.nodes.findIndex(n=>n.panels.some(p=>p.record===record));if(index<0)throw Error('Missing daily story anchor: '+record);result.nodes.splice(index,0,node(key));};
 if(id==='profit-fades'){before(25,'funding-refusal');before(28,'prompted-purchase');before(31,'carefree-walk');before(35,'weight-of-loss');}
 if(id==='holding-loss'){before(45,'furious-at-loss');result.nodes.push(node('another-funding-idea'));}
 if(id==='averaging-down-prayer')result.nodes.push(node('savings-fear'));
 if(id==='realized-long-profit'){before(75,'profit-confirmation');result.nodes.push(node('tax-return-worry'));}
 if(id==='borrowed-recovery'){
  before(157,'news-and-more-shorts');before(161,'tuition-distance');before(166,'scholarship-fantasy');
  const end=result.nodes.find(n=>n.panels.some(p=>p.record===169));end.panels.splice(end.panels.findIndex(p=>p.record===169),0,structuredClone(VERIFIED_DAILY_PANELS[168]));
 }
 if(id==='opposite-directions'){
  const opening=result.nodes.find(n=>n.id==='opposite-open-opinions');
  opening.panels.splice(opening.panels.findIndex(p=>p.record===182)+1,0,structuredClone(OPPOSITE_IMAGINATION_PANEL));
  opening.before+=' 芽吹心里却不以为然：在这个位置做多，她觉得久留美是上当了。';
  const debate=result.nodes.find(n=>n.panels.some(p=>p.record===187));debate.panels.splice(debate.panels.findIndex(p=>p.record===187),0,...[185,186].map(r=>structuredClone(VERIFIED_DAILY_PANELS[r])));
 }
 return result;
}
const positions=s=>Array.isArray(s.positions)?s.positions:s.position?[s.position]:[];
const closed=t=>t&&['close','half','closing','stop','liquidation'].includes(t.type)&&Number.isFinite(t.pnl)&&Number.isFinite(t.entry)&&Number.isFinite(t.exit)&&[1,-1].includes(t.direction)&&t.positionId!=null&&t.pnlModel!=='legacy-inverse-v5';
function arc(id,evidence){return {id,title:titles[id],...(['pause-and-return','averaging-down-prayer','friends-different-ledgers','floating-profit-caution','borrowed-time','asking-for-more','realized-short-profit','reversal-liquidation','opposite-directions'].includes(id)?{parallelStory:true}:{}),evidence:structuredClone(evidence),nodes:structuredClone(arcs[id].map(key=>[...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES].find(n=>n.id===key)))};}
// These selectors read certified records only. No engine calls or state writes.
function baseDailyContextualManga(state){
 const outcome=sealedDailyMangaOutcome(state),r=state.dayReport;
 if(!outcome||outcome.net>=0||!Array.isArray(r.trades))return null;
 const trades=r.trades.filter(t=>t.day===r.day&&t.type!=='open');
 if(!trades.length||trades.some(t=>!closed(t)))return null;
 const reversal=(r.moments||[]).find(m=>m.day===r.day&&m.reversal==='profit-to-loss'&&m.direction===1&&m.pnl<0&&trades.some(t=>t.positionId===m.positionId&&t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).every(t=>t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).reduce((sum,t)=>sum+t.pnl,0)<0);
 if(reversal)return (sealedDailyTradeEvidence(state)?dailyArc:arc)('profit-fades',{day:r.day,net:r.net,positionId:reversal.positionId});
 const crisis=trades.find(t=>t.pnl<0&&t.nearMiss===true);
 return crisis?(sealedDailyTradeEvidence(state)?dailyArc:arc)('holding-loss',{day:r.day,positionId:crisis.positionId,nearMiss:true}):null;
}

const positive=n=>Number.isFinite(n)&&n>0;
// A loan unlock, a changed balance, or an unsuccessful click is no receipt.
function borrowedToday(state){
 const r=state.loan?.lastBorrow;
 return r?.day===state.day&&/^network-borrow:[1-9]\d*$/.test(r.id||'')&&positive(r.amount)&&Number.isFinite(r.timestamp)&&positive(r.outstanding)&&r.outstanding>=r.amount&&positive(state.loan.borrowed)&&state.loan.borrowed>=r.amount?r:null;
}
function combine(selections){const choices=selections.filter(Boolean).slice(0,4);return choices.length?{...choices[0],related:choices.slice(1)}:null;}
export function selectDailyContextualManga(state){
 const directionChange=longLossThenShortEvidence(state);
 const longProfit=longProfitEvidence(state),profit=shortProfitEvidence(state),liquidation=reversalLiquidationEvidence(state),opposite=oppositeDirectionsEvidence(state);
 const specific=longProfit?dailyArc('realized-long-profit',longProfit):profit?dailyArc('realized-short-profit',profit):liquidation?arc('reversal-liquidation',liquidation):opposite?dailyArc('opposite-directions',opposite):null;
 if(specific?.id==='realized-short-profit'&&firstDayBackstoryEvidence(state)){
  specific.nodes.unshift(...structuredClone(FIRSTDAY_BACKSTORY_NODES));
  const adult=specific.nodes.find(n=>n.id==='first-trade-beginning');
  adult.before='时间到了2014年2月14日。二十岁的久留美，终于坐到了交易屏幕前。';
 }
 // A completed reversal-and-liquidation gets one coherent story, rather than
 // another generic reversal episode competing for the same receipt.
 const averaging=liquidation?null:averagingDownEvidence(state),pause=averaging?null:pauseAndReturnEvidence(state),friends=friendsLedgersEvidence(state),caution=floatingCautionEvidence(state);
 const base=specific||directionChange||averaging||pause?null:baseDailyContextualManga(state),outcome=sealedDailyMangaOutcome(state),report=state.dayReport;
 const reversal=base?.id==='profit-fades'?arc('twenty-seconds',base.evidence):null;
 const trades=report?.trades?.filter(t=>t.day===state.day&&t.type!=='open')||[],loan=borrowedToday(state);
 const certified=loan?sealedDailyTradeEvidence(state):null;
 // Loan receipts have no execution sequence: equal timestamps cannot prove
 // whether borrowing preceded closing. Keep those cases on the original arc.
 const shortLoss=certified&&certified.net<0&&certified.trades.every(t=>t.direction===-1&&t.exit>t.entry&&t.grossPnl<0&&t.pnl<0&&t.timestamp>loan.timestamp)&&positive(state.loan.outstanding)&&Number.isFinite(state.loan.repaid)&&state.loan.repaid>=0&&Math.abs(state.loan.borrowed+(state.loan.interestAccrued??0)-state.loan.repaid-state.loan.outstanding)<=.02;
 const debt=loan&&outcome?.net<0&&trades.length&&trades.every(closed)&&trades.reduce((sum,t)=>sum+t.pnl,0)<0?(shortLoss?dailyArc:arc)('borrowed-recovery',{day:state.day,receipt:loan.id,amount:loan.amount,net:outcome.net}):null;
 const priorDebt=priorBorrowedShortLossEvidence(state);
 return combine([specific,directionChange?dailyArc('long-loss-then-short',directionChange):null,averaging?dailyArc('averaging-down-prayer',averaging):null,friends?dailyArc('friends-different-ledgers',friends):null,caution?arc('floating-profit-caution',caution):null,pause?arc('pause-and-return',pause):null,base,reversal,pause&&priorDebt?null:debt,...(priorDebt?[dailyArc('borrowed-time',priorDebt),dailyArc('asking-for-more',priorDebt)]:[])]);
}
export function selectStoryContextualManga(state,event){
 if(event?.key!=='friendStudy'||state.mode!=='story')return null;
 const r=state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day&&typeof x.choice==='string'&&x.choice);
 const current=sealedDailyMangaOutcome(state)&&(!Object.hasOwn(state.dayReport,'runId')||state.dayReport.runId===state.runId)&&r?.choice.trim();
 return r&&state.story?.seen?.includes('friendStudy')?(current?dailyArc:arc)('follow-confidence',{day:r.day,choice:r.choice}):null;
}
export function selectEventContextualManga(state,event){
 if(event.type==='loan-borrow'){
  const r=borrowedToday(state);
  return r&&state.loan.outstanding===r.outstanding&&event.result?.amount===r.amount&&event.result?.outstanding===r.outstanding?arc('borrowed-recovery',{day:r.day,receipt:r.id,amount:r.amount}):null;
 }
 if(event.type==='item'&&event.id==='mochiko'&&event.result?.id==='mochiko'){
  const r=state.consumptionLedger?.find(x=>x.id===`item:${state.day}:mochiko`&&x.day===state.day&&x.kind==='item'&&positive(x.amount)&&x.amount===event.result.cost);
  return r?arc('follow-confidence',{day:r.day,receipt:r.id,amount:r.amount}):null;
 }

 if(event.type==='walkaway'&&state.phase==='ending'&&state.ending?.id==='walkaway'&&!positions(state).length)return arc('walkaway',{day:state.day});
 if(event.type==='day-close')return selectDailyContextualManga(state);
 if(event.type!=='trade'||!sealedDailyMangaOutcome(state)||state.dayReport.net>=0)return null;
 const r=event.receipt;
 const found=(state.history||[]).find(t=>t.day===state.day&&closed(t)&&t.pnl<0&&t.nearMiss===true&&['day','beat','type','positionId','pnl','entry','exit'].every(k=>t[k]===r?.[k]));
 return found?arc('holding-loss',{day:found.day,positionId:found.positionId,nearMiss:true}):null;
}
// A sealed report owns its presentation snapshot. Rendering or later expenses
// cannot select another arc. Replacing the save/report creates a fresh context.
export function createDailyContextualMangaCache(){
 const snapshots=new WeakMap();
 return state=>{const report=state.dayReport;if(!report||typeof report!=='object'||!sealedDailyMangaOutcome(state))return null;if(!snapshots.has(report))snapshots.set(report,structuredClone(selectDailyContextualManga(state)));return structuredClone(snapshots.get(report));};
}

// Only durable saves publish new daily/lesson evidence. Capture owns the frozen
// nodes; commit never consults mutable game data. A replaced state cannot reuse it.
export function createSavedContextualManga(){
 const reports=new WeakMap();let revision=0;
 const key=state=>[state.runId,state.day,state.loan?.lastBorrow?.id||'',state.loan?.lastRepayment?.id||'',state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day)?.choice||'',activityPresentationIdentity(state)].map(v=>JSON.stringify(v)).join(':');
 return {
  capture(state){
   const report=state.dayReport;if(!report||!sealedDailyMangaOutcome(state))return null;
   let slot=reports.get(report);if(!slot||slot.owner!==state||slot.runId!==state.runId||slot.day!==state.day){slot={owner:state,runId:state.runId,day:state.day,captured:new Map(),saved:null,savedRevision:0};reports.set(report,slot);}
   const id=key(state);
   if(!slot.captured.has(id)){
    const daily=selectDailyContextualManga(state),event=state.settlementNarrative?.day===state.day?state.settlementNarrative.event:null;
    const friend=selectStoryContextualManga(state,event);
    slot.captured.set(id,combine([...(daily?[{...daily,related:undefined},...(daily.related||[])]:[]),friend]));
   }
   const ticket={state,report,id,revision:++revision,selection:structuredClone(slot.captured.get(id))};return ticket;
  },
  commit(ticket,{saved,state,blocked=false}={}){
   if(!ticket||!saved||blocked||ticket.state!==state||ticket.report!==state.dayReport||ticket.id!==key(state)||!sealedDailyMangaOutcome(state))return false;
   const slot=reports.get(ticket.report);if(!slot||slot.owner!==state||slot.runId!==state.runId||slot.day!==state.day||ticket.revision<=slot.savedRevision)return false;
   slot.saved=structuredClone(ticket.selection);slot.savedRevision=ticket.revision;return true;
  },
  read(state){const slot=reports.get(state.dayReport);return sealedDailyMangaOutcome(state)&&slot?.owner===state&&slot.runId===state.runId&&slot.day===state.day?structuredClone(slot.saved||null):null;}
 };
}
