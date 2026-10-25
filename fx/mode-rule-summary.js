import {staminaPolicyForState} from './trading-rule-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {eligibleHistoricalM15} from './historical-m15-engine-adapter.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {hasHistoricalSimulation,historicalSimulationActive} from './history-continuation.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

const modes={
 story:['每日收盘结算，可安排生活。','每日小剧场和剧情选择。','新局基础日耗体65，心理状态会影响交易。'],
 endless:['无每日结算打断。','无每日小剧场。','新局无体力、心理开仓限制。'],
};
const markets={
 simulated:['价格由游戏模型生成。','可按游戏速度播放。','不是真实市场报价。'],
 live:['当前真实指示汇率。','报价可能延迟。','休市时不能交易。'],
};
const history={
 m15:['K线采用历史15分钟数据。','段内及1/5分钟线含模拟。','缺口或数据结束可能模拟续盘。'],
 m1:['K线采用历史1分钟数据。','交易采用分钟收盘价。','缺口或数据结束可能模拟续盘。'],
 ticks:['按历史逐笔买卖报价推进。','K线由逐笔报价汇总。','缺口或数据结束可能模拟续盘。'],
};
export const modeOptionLines=mode=>[...(modes[mode]||[])];
export const marketOptionLines=({sourceFamily,historicalKind='m15'})=>[...(sourceFamily==='historical'?history[historicalKind]||history.m15:markets[sourceFamily]||[])];
export function historicalKindForManifest(manifest){
 if(['research-m1-close-v1','research-multi-m1-close-v1'].includes(manifest?.schemaVersion))return 'm1';
 // Preview the new-run adapter from verified provider metadata, without loading
 // any price rows. The provider still validates its day data before game creation.
 return eligibleHistoricalM15(manifest,{validated:true})?'m15':'ticks';
}
export function historicalKindForState(state){
 return ({1:'ticks',2:'m1',3:'m1',4:'m15'})[state?.historical?.version]??null;
}
export function resumeRuleNote({state,readable=true}){
 if(!readable)return '原存档暂时无法读取，不能确认本局规则。';
 if(!state)return null;
 const policy=staminaPolicyForState(state);
 let text=state.mode==='endless'
  ?policy.enabled?'继续已有操盘档：本档仍消耗体力，心理数值不限制开仓。':'继续已有操盘档：本档无体力、心理开仓限制。'
  :`继续已有剧情档：完整日基础耗体${policy.calmDayCost}，${policy.legacy?'保留原规则':'心理状态会影响交易'}。`;
 const kind=historicalKindForState(state);
 if(kind){
  text+=`历史进度 ${state.historical.date}。`;
  text+=kind==='m15'?'历史15分钟数据，段内及1/5分钟线含模拟。':kind==='m1'?'历史1分钟数据，按分钟收盘价交易。':'历史逐笔买卖报价，K线按报价汇总。';
  if(hasHistoricalSimulation(state))text+='本档用过模拟补接。';
  if(historicalSimulationActive(state))text+=state.historyContinuation.reason==='exhausted'?'历史数据已结束，当前模拟续盘。':'当前使用模拟补接。';
 }
 return text;
}
