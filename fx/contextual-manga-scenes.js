import {CHARACTER_STORY_NODES} from './character-story-content.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
const arcs={
 'profit-fades':['aud-yen-delight','profit-fades','look-away','first-negative-estimate'],
 'holding-loss':['considering-stop','refuse-to-stop','loss-deepens','support-and-margin','unrealized-fear'],
 'walkaway':['manga-fund-plan'],
};
const titles={'profit-fades':'久留美 · 那次消失的浮盈','holding-loss':'久留美 · 那次没等到的反弹',walkaway:'康子 · 把钱用来画漫画'};
const positions=s=>Array.isArray(s.positions)?s.positions:s.position?[s.position]:[];
const closed=t=>t&&['close','half','closing','stop','liquidation'].includes(t.type)&&Number.isFinite(t.pnl)&&Number.isFinite(t.entry)&&Number.isFinite(t.exit)&&[1,-1].includes(t.direction)&&t.positionId!=null&&t.pnlModel!=='legacy-inverse-v5';
function arc(id,evidence){return {id,title:titles[id],evidence:structuredClone(evidence),nodes:structuredClone(arcs[id].map(key=>CHARACTER_STORY_NODES.find(n=>n.id===key)))};}
// These selectors read certified records only. No engine calls or state writes.
export function selectDailyContextualManga(state){
 const outcome=sealedDailyMangaOutcome(state),r=state.dayReport;
 if(!outcome||outcome.net>=0||!Array.isArray(r.trades))return null;
 const trades=r.trades.filter(t=>t.day===r.day&&t.type!=='open');
 if(!trades.length||trades.some(t=>!closed(t)))return null;
 const reversal=(r.moments||[]).find(m=>m.day===r.day&&m.reversal==='profit-to-loss'&&m.direction===1&&m.pnl<0&&trades.some(t=>t.positionId===m.positionId&&t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).every(t=>t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).reduce((sum,t)=>sum+t.pnl,0)<0);
 if(reversal)return arc('profit-fades',{day:r.day,net:r.net,positionId:reversal.positionId});
 const crisis=trades.find(t=>t.pnl<0&&t.nearMiss===true);
 return crisis?arc('holding-loss',{day:r.day,positionId:crisis.positionId,nearMiss:true}):null;
}
export function selectEventContextualManga(state,event){
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
