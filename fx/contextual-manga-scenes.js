import {shortProfitEvidence,reversalLiquidationEvidence,oppositeDirectionsEvidence} from './contextual-trade-evidence.js?v=b4720c23c50a873116b8cc8838042595dc3956dd-23f2a20b7717';
import {CONTEXTUAL_MANGA_NODES,CONTEXTUAL_MANGA_ARCS} from './contextual-manga-content.js?v=b4720c23c50a873116b8cc8838042595dc3956dd-23f2a20b7717';
import {CHARACTER_STORY_NODES} from './character-story-content.js?v=b4720c23c50a873116b8cc8838042595dc3956dd-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=b4720c23c50a873116b8cc8838042595dc3956dd-23f2a20b7717';
import {priorBorrowedShortLossEvidence} from './contextual-debt-evidence.js?v=b4720c23c50a873116b8cc8838042595dc3956dd-23f2a20b7717';
const arcs={
 ...CONTEXTUAL_MANGA_ARCS,
 'profit-fades':['aud-yen-delight','profit-fades','look-away','first-negative-estimate'],
 'holding-loss':['considering-stop','refuse-to-stop','loss-deepens','support-and-margin','unrealized-fear'],
 'walkaway':['manga-fund-plan'],
};
const titles={'realized-short-profit':'久留美 · 第一次把利润留住','reversal-liquidation':'芽吹 · 没等到的救援','opposite-directions':'久留美与芽吹 · 上涨的两面','borrowed-time':'芽吹 · 借来的钱也在亏','asking-for-more':'芽吹与久留美 · 她还想再借一些','borrowed-recovery':'芽吹 · 想把亏掉的钱赚回来','twenty-seconds':'芽吹 · 满仓后的二十秒','follow-confidence':'久留美与芽吹 · 跟着前辈就能赢吗','profit-fades':'久留美 · 那次消失的浮盈','holding-loss':'久留美 · 那次没等到的反弹',walkaway:'康子 · 把钱用来画漫画'};
const positions=s=>Array.isArray(s.positions)?s.positions:s.position?[s.position]:[];
const closed=t=>t&&['close','half','closing','stop','liquidation'].includes(t.type)&&Number.isFinite(t.pnl)&&Number.isFinite(t.entry)&&Number.isFinite(t.exit)&&[1,-1].includes(t.direction)&&t.positionId!=null&&t.pnlModel!=='legacy-inverse-v5';
function arc(id,evidence){return {id,title:titles[id],...(['borrowed-time','asking-for-more','realized-short-profit','reversal-liquidation','opposite-directions'].includes(id)?{parallelStory:true}:{}),evidence:structuredClone(evidence),nodes:structuredClone(arcs[id].map(key=>[...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES].find(n=>n.id===key)))};}
// These selectors read certified records only. No engine calls or state writes.
function baseDailyContextualManga(state){
 const outcome=sealedDailyMangaOutcome(state),r=state.dayReport;
 if(!outcome||outcome.net>=0||!Array.isArray(r.trades))return null;
 const trades=r.trades.filter(t=>t.day===r.day&&t.type!=='open');
 if(!trades.length||trades.some(t=>!closed(t)))return null;
 const reversal=(r.moments||[]).find(m=>m.day===r.day&&m.reversal==='profit-to-loss'&&m.direction===1&&m.pnl<0&&trades.some(t=>t.positionId===m.positionId&&t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).every(t=>t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).reduce((sum,t)=>sum+t.pnl,0)<0);
 if(reversal)return arc('profit-fades',{day:r.day,net:r.net,positionId:reversal.positionId});
 const crisis=trades.find(t=>t.pnl<0&&t.nearMiss===true);
 return crisis?arc('holding-loss',{day:r.day,positionId:crisis.positionId,nearMiss:true}):null;
}

const positive=n=>Number.isFinite(n)&&n>0;
// A loan unlock, a changed balance, or an unsuccessful click is no receipt.
function borrowedToday(state){
 const r=state.loan?.lastBorrow;
 return r?.day===state.day&&/^network-borrow:[1-9]\d*$/.test(r.id||'')&&positive(r.amount)&&Number.isFinite(r.timestamp)&&positive(r.outstanding)&&r.outstanding>=r.amount&&positive(state.loan.borrowed)&&state.loan.borrowed>=r.amount?r:null;
}
function combine(selections){const choices=selections.filter(Boolean);return choices.length?{...choices[0],related:choices.slice(1)}:null;}
export function selectDailyContextualManga(state){
 const profit=shortProfitEvidence(state),liquidation=reversalLiquidationEvidence(state),opposite=oppositeDirectionsEvidence(state);
 const specific=profit?arc('realized-short-profit',profit):liquidation?arc('reversal-liquidation',liquidation):opposite?arc('opposite-directions',opposite):null;
 // A completed reversal-and-liquidation gets one coherent story, rather than
 // another generic reversal episode competing for the same receipt.
 const base=specific?null:baseDailyContextualManga(state),outcome=sealedDailyMangaOutcome(state),report=state.dayReport;
 const reversal=base?.id==='profit-fades'?arc('twenty-seconds',base.evidence):null;
 const trades=report?.trades?.filter(t=>t.day===state.day&&t.type!=='open')||[],loan=borrowedToday(state);
 const debt=loan&&outcome?.net<0&&trades.length&&trades.every(closed)&&trades.reduce((sum,t)=>sum+t.pnl,0)<0?arc('borrowed-recovery',{day:state.day,receipt:loan.id,amount:loan.amount,net:outcome.net}):null;
 const priorDebt=priorBorrowedShortLossEvidence(state);
 return combine([specific,base,reversal,debt,...(priorDebt?[arc('borrowed-time',priorDebt),arc('asking-for-more',priorDebt)]:[])]);
}
export function selectStoryContextualManga(state,event){
 if(event?.key!=='friendStudy'||state.mode!=='story')return null;
 const r=state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day&&typeof x.choice==='string'&&x.choice);
 return r&&state.story?.seen?.includes('friendStudy')?arc('follow-confidence',{day:r.day,choice:r.choice}):null;
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
 const key=state=>[state.runId,state.day,state.loan?.lastBorrow?.id||'',state.loan?.lastRepayment?.id||'',state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day)?.choice||''].join(':');
 return {
  capture(state){
   const report=state.dayReport;if(!report||!sealedDailyMangaOutcome(state))return null;
   let slot=reports.get(report);if(!slot){slot={captured:new Map(),saved:null,savedRevision:0};reports.set(report,slot);}
   const id=key(state);
   if(!slot.captured.has(id)){
    const daily=selectDailyContextualManga(state),event=state.settlementNarrative?.day===state.day?state.settlementNarrative.event:null;
    const friend=selectStoryContextualManga(state,event);
    slot.captured.set(id,combine([...(daily?[{...daily,related:undefined},...(daily.related||[])]:[]),friend]));
   }
   const ticket={state,report,id,revision:++revision,selection:structuredClone(slot.captured.get(id))};return ticket;
  },
  commit(ticket,{saved,state,blocked=false}={}){
   if(!ticket||!saved||blocked||ticket.state!==state||ticket.report!==state.dayReport||!sealedDailyMangaOutcome(state))return false;
   const slot=reports.get(ticket.report);if(!slot||ticket.revision<=slot.savedRevision)return false;
   slot.saved=structuredClone(ticket.selection);slot.savedRevision=ticket.revision;return true;
  },
  read(state){return sealedDailyMangaOutcome(state)?structuredClone(reports.get(state.dayReport)?.saved||null):null;}
 };
}
