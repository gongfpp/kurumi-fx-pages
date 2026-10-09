import {terminalRankingEligibility} from './auto-leaderboard.js?v=90af80d63b506a5a375de960fb3ae606348525b5-23f2a20b7717';
const counts=['closedOrders','winningOrders','losingOrders','breakevenOrders','liquidatedOrders','stopLossOrders','partialCloseExecutions','maxWinningStreak','maxLosingStreak','profitGivebackOrders'];
const knownRequired=['closedOrders','winningOrders','losingOrders','breakevenOrders','maxOrderLoss','maxOrderProfit'];
function finite(value,label,min=-1e10,max=1e10){if(!Number.isFinite(value)||value<min||value>max)throw Error('终局成绩字段无效：'+label);return value;}
function integer(value,label,min=0,max=10000000){finite(value,label,min,max);if(!Number.isSafeInteger(value))throw Error('终局成绩字段必须为整数：'+label);return value;}
const nullable=(value,check)=>value===null||value===undefined?null:check(value);
const cents=n=>Math.round((n+Number.EPSILON)*100)/100;
// Fixed score projection, never the full JSON export, names, transactions,
// accounting journal, open-position details, seed, or browser storage.
export function finishedLeaderboardScore(state,report,{storage}={}){
 const eligible=terminalRankingEligibility(state,report,storage);
 if(!eligible.eligible)throw Object.assign(Error(eligible.reason==='developer'?'开发测试局不能自动上榜':'本局尚不可自动上榜'),{code:eligible.reason});
 if(report.schemaVersion!=='1.0.0'||!['story','endless'].includes(report.mode)||report.mode!==state.mode)throw Error('终局成绩版本或模式不正确');
 if((state.positions?.length||state.position)||report.account?.openPositions?.length)throw Error('尚有未平仓订单，不能提交终局成绩');
 const p=report.performance,a=report.account;
 if(!p||!a||typeof p.complete!=='boolean')throw Error('终局统计完整性未知');
 const day=integer(report.day,'day',1,10000);if(day!==state.day)throw Error('终局成绩不是当前日期');
 const initialEquity=finite(p.initialCapital,'initialCapital',100000,100000),rawTotalProfit=finite(p.realizedNetTradingPnl,'realizedNetTradingPnl'),totalProfit=cents(rawTotalProfit);
 const daysSurvived=integer(p.daysSurvived,'daysSurvived',0,day),elapsedDays=Math.max(1,finite(p.elapsedSimulatedDays,'elapsedSimulatedDays',0,day));
 if(daysSurvived>elapsedDays)throw Error('存活天数大于模拟时间');
 const rawReturnRate=rawTotalProfit/initialEquity,rawDailyReturnRate=rawReturnRate/elapsedDays;
 const returnRate=totalProfit/initialEquity,dailyReturnRate=returnRate/elapsedDays;
 if(Math.abs(finite(p.returnRate,'returnRate')-rawReturnRate)>1e-8||Math.abs(finite(p.dailyReturnRate,'dailyReturnRate')-rawDailyReturnRate)>1e-8)throw Error('终局收益率与净交易账本不一致');
 const score={schemaVersion:'1.0.0',gameFinished:true,completionReason:report.completionReason,developmentTaint:false,statisticsComplete:p.complete,gameMode:report.mode,day,initialEquity,daysSurvived,elapsedDays,returnRate,dailyReturnRate,totalProfit,closedTrades:integer(p.closeExecutions,'closeExecutions'),maxDrawdown:nullable(p.maxDrawdown,v=>finite(v,'maxDrawdown',0,1))};
 for(const key of counts)score[key]=nullable(p[key],v=>integer(v,key));
 score.winRate=nullable(p.winRate,v=>finite(v,'winRate',0,1));
 score.maxOrderLoss=nullable(p.maxOrderLoss,v=>cents(finite(v,'maxOrderLoss',-1e10,0)));
 score.maxOrderProfit=nullable(p.maxOrderProfit,v=>cents(finite(v,'maxOrderProfit',0,1e10)));
 score.maxLeverage=nullable(p.maxLeverage,v=>finite(v,'maxLeverage',0,100));
 for(const key of ['fatherDebt','networkDebt','totalDebt'])score[key]=nullable(a[key],v=>cents(finite(v,key,0,1e10)));
 score.netAssets=nullable(a.netAssets,v=>cents(finite(v,'netAssets')));
 if(p.complete&&knownRequired.some(k=>score[k]===null))throw Error('完整统计缺少订单指标');
 if(score.closedOrders!==null&&[score.winningOrders,score.losingOrders,score.breakevenOrders].every(v=>v!==null)&&score.closedOrders!==score.winningOrders+score.losingOrders+score.breakevenOrders)throw Error('完整订单胜负数量不一致');
 if(score.closedOrders===0&&score.winRate!==null)throw Error('没有完整订单时胜率必须未知');
 if(score.closedOrders>0&&score.winningOrders!==null&&(score.winRate===null||Math.abs(score.winRate-score.winningOrders/score.closedOrders)>1e-8))throw Error('胜率与完整订单数不一致');
 if([score.fatherDebt,score.networkDebt,score.totalDebt].every(v=>v!==null)&&Math.abs(score.fatherDebt+score.networkDebt-score.totalDebt)>.01)throw Error('总欠款与两项债务不一致');
 return score;
}
