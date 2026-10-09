import {displayCandles,candlePeriodNotice} from './candle-period.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {readRunStatistics} from './run-statistics.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {consumptionStatement} from './consumption-ledger.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {movingAverageSeries} from './moving-average.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {dailyReturnMetrics} from './daily-performance.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {runPerformance} from './performance.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {accountingValues,dayOpeningPoint} from './accounting-journal.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
import {timedCandles,reportTradingTimestamp,currentTradingTimestamp,tradingTimestamp,tradingTimeNotice} from './trading-time.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const amount=n=>Math.round(n*100)/100;
const ratio=(n,d)=>Number.isFinite(n)&&Number.isFinite(d)&&d>0?n/d:null;
export function buildRecapSnapshot(state={},options={}){
 const current=accountingValues(state),p=runPerformance(state),candidate=options.report===null?null:options.report||state.dayReport;
 const report=['day_end','resting','ending'].includes(state.phase)&&candidate?.day===state.day?candidate:null;
 const recorded=report?.accounting?.version===1?report.accounting:null,currentValues=recorded&&Number.isFinite(recorded.netAssets)&&Number.isFinite(recorded.debt)?recorded:current;
 const dailyTrades=(report?.trades||state.history||[]).filter(t=>t.day===state.day&&t.type!=='open'&&Number.isFinite(t.pnl));
 const dayMetrics=dailyReturnMetrics(state,{report:report||null}),tradingNet=dayMetrics.tradingNet;
 const expensesToday=(state.expenseLedger||[]).filter(e=>e.day===state.day),living=finite(report?.livingCost,expensesToday.reduce((n,e)=>n+finite(e.living),0)),interest=finite(report?.interest,expensesToday.reduce((n,e)=>n+finite(e.interest),0)),costs=finite(report?.costs,finite(state.expenses)-finite(state.dayOpeningExpenses)),consumption=Math.max(0,costs-living-interest);
 const opening=finite(report?.opening,finite(state.dayOpening)),funding=finite(report?.funding,finite(state.externalFunding)-finite(state.dayOpeningFunding)),interestAccrued=finite(report?.interestAccrued,expensesToday.reduce((n,e)=>n+finite(e.interestAccrued),0));
 const points=(Array.isArray(recorded?.points)?recorded.points:state.accountingJournal?.points?.filter(x=>x.day===state.day)||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets));
 const today=points.map(x=>({...x}));
 if(!today.length||today[0].timestamp>tradingTimestamp(state,{day:state.day}))today.unshift(dayOpeningPoint(state,{day:state.day,opening}));
 const closing=finite(report?.closing,currentValues.nominalAssets),closeTime=report?reportTradingTimestamp(state,report):currentTradingTimestamp(state);
 if(!today.length||today.at(-1).nominalAssets!==closing||today.at(-1).timestamp!==closeTime)today.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'closing'});
 const cumulative=(state.accountingJournal?.days||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets)).map(x=>({...x}));
 const hasEarlierGap=!!cumulative.length&&cumulative[0].day>1;
 cumulative.unshift({day:1,timestamp:tradingTimestamp(state,{day:1}),nominalAssets:p.startEquity,netAssets:p.startEquity,kind:'start'});
 if(cumulative.at(-1).timestamp!==closeTime||cumulative.at(-1).nominalAssets!==closing)cumulative.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'current'});
 // Presentation curves remove every non-trading cash flow, while the journal
 // and account balances above retain the actual assets and liabilities.
 const tradingPoint=(point,{daily=false}={})=>{
  const raw=Number.isFinite(point.tradingAssets)?point.tradingAssets:Number.isFinite(point.netFunding)&&Number.isFinite(point.expenses)?point.nominalAssets-point.netFunding+point.expenses-finite(state.developer?.profitOffset):point.kind==='start'?point.nominalAssets:point.kind==='opening'?opening-finite(state.dayOpeningFunding)+finite(state.dayOpeningExpenses)-finite(state.developer?.profitOffset):null;
  if(raw===null)return null;
  return {...point,originalNominalAssets:point.nominalAssets,originalNetAssets:point.netAssets,nominalAssets:raw+(daily?finite(state.dayOpeningFunding)-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset):0),netAssets:null};
 };
 const closingTrading={day:state.day,timestamp:closeTime,kind:'trading-close',...currentValues};
 today.push(closingTrading);cumulative.push(closingTrading);
 const tradingToday=today.map(point=>tradingPoint(point,{daily:true})).filter(Boolean),tradingCumulative=cumulative.map(point=>tradingPoint(point)).filter(Boolean);
 // Only persisted, already observed account points participate in the replay.
 // The adjusted asset path removes borrowing, repayments and spending, while
 // unrealized remains an independent observation rather than invented profit.
 const observations=points.filter(x=>x.timestamp<=closeTime&&Number.isFinite(x.unrealized)&&Number.isFinite(x.tradingAssets)).map(x=>({timestamp:x.timestamp,tradingAssets:x.tradingAssets+finite(state.dayOpeningFunding)-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset),unrealized:x.unrealized}));
 const observedClosing=closingTrading.tradingAssets+finite(state.dayOpeningFunding)-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset);
 if(Number.isFinite(observedClosing))observations.push({timestamp:closeTime,tradingAssets:observedClosing,unrealized:finite(currentValues.unrealized)});
 const cumulativeDenominator=finite(state.startEquity,p.startEquity),totalProfit=finite(report?.performance?.totalProfit,p.totalProfit),totalReturn=ratio(totalProfit,cumulativeDenominator),dayReturn=dayMetrics.returnRate;
 const primary=state.mode==='endless'?{scope:'cumulative',label:'累计已实现交易收益',profit:totalProfit,returnRate:totalReturn}:{scope:'today',label:dayMetrics.tradingNetPartial?'今日交易盈亏 · 留存样本':report?'今日交易净盈亏':'今日已实现交易盈亏',profit:tradingNet,returnRate:dayReturn};
 const allCandles=displayCandles(state),dayCandleStart=allCandles.findIndex(c=>c.day===state.day),dayCandleEnd=allCandles.findLastIndex(c=>c.day===state.day)+1,candleMovingAverages=dayCandleStart<0?[]:movingAverageSeries(allCandles,{start:dayCandleStart,end:dayCandleEnd});
 const snapshot={version:1,id:`${state.runId||state.seed||0}:${state.day}:${closeTime}:${tradingNet}:${costs}`,day:state.day||1,mode:state.mode||'story',sealed:!!report,timestamp:closeTime,
  primary,daily:{tradingNet,tradingNetPartial:dayMetrics.tradingNetPartial,returnRate:dayReturn,returnDenominator:dayMetrics.denominator,returnDenominatorSource:dayMetrics.source,returnBasis:'今日收益率 = 今日已实现净盈亏 ÷ 开盘净资产',openingNominal:opening,closingNominal:closing,nominalChange:amount(closing-opening),costs:{total:costs,living,interest,consumption},netResult:amount(tradingNet-costs),fundingIncludingAccruedInterest:funding,fundingPrincipal:amount(funding-interestAccrued),interestAccrued,returnUnavailable:dayMetrics.returnUnavailable,noodlesUsed:!!state.itemsUsed?.noodles,livingStatus:report?.livingSettlement?.status||(report?'legacy-paid':'not-due'),pendingLivingCost:finite(report?.pendingLivingCost)},
  cumulative:{realizedProfit:totalProfit,returnRate:totalReturn,returnDenominator:cumulativeDenominator,returnBasis:'累计收益率 = 累计已实现净盈亏 ÷ 初始本金'},
  account:{nominalAssets:closing,netAssets:currentValues.netAssets,debt:currentValues.debt,unrealized:currentValues.unrealized},
  consumption:consumptionStatement(state,report),
  curves:{basis:'trading',today:tradingToday,cumulative:tradingCumulative,todayPartial:recorded?!!recorded.partial:!state.accountingJournal||!!state.accountingJournal.legacyPartial&&state.accountingJournal.startedDay===state.day||state.accountingJournal?.truncatedDays?.includes(state.day),cumulativePartial:!!state.accountingJournal?.legacyPartial||!state.accountingJournal||hasEarlierGap,unit:'日元 / ¥',timeUnit:'游戏交易时间 · JST'},
  replay:{observations,partial:points.some(x=>!Number.isFinite(x.unrealized)||!Number.isFinite(x.tradingAssets))||(recorded?!!recorded.partial:!state.accountingJournal||!!state.accountingJournal.legacyPartial&&state.accountingJournal.startedDay===state.day||!!state.accountingJournal?.truncatedDays?.includes(state.day))},
  trades:readRunStatistics(state).trades.filter(t=>t.day===state.day).map(t=>({...t})),
  candles:allCandles.filter(c=>c.day===state.day),candleMovingAverages,timeNotice:candlePeriodNotice(state),
  note:dayMetrics.returnUnavailable||null};
 return JSON.parse(JSON.stringify(snapshot));
}
export function recapSegments(snapshot){
 const d=snapshot.daily,opening=d.openingNominal,closing=amount(opening+d.tradingNet);
 return [{id:'opening',label:'开盘交易资产',delta:0,from:opening,to:opening},
 {id:'trading',label:'已实现交易净盈亏',delta:d.tradingNet,from:opening,to:closing},
 {id:'closing',label:'交易收盘资产',delta:0,from:closing,to:closing}];
}
export function recapIntensity(snapshot){
 const magnitude=Math.abs(snapshot.primary.profit),relative=Math.abs(snapshot.primary.returnRate||0);
 return Math.min(1,Math.max(Math.log10(1+magnitude)/7,Math.min(1,relative/2)));
}
export {recapChoices} from './recap-choices.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
