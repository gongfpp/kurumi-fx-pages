export function canRequestWalkaway(state={}){return ['decision','playing','closing','day_end','resting'].includes(state.phase)&&!state.walkawayRequested;}
export function walkawayConfirmation(state={}){
 const openPositions=state.positions?.length||(state.position?1:0);
 return {title:'收手离场，结束这一局？',copy:`${openPositions?`现有 ${openPositions} 笔持仓会按当前报价全部平仓，正常计入交易手续费。`:'当前没有未平仓持仓。'}${state.mode==='endless'?'确认后结束本局；不额外推进游戏时间或多收一天利息。':'确认后先完成今天的结算、生活费与必需剧情，再结束本局。'}这会终止整局，和“今天不玩了”仅结束当日不同。存档与最终战绩会保留，可下载 JSON。`};
}
// The app supplies engine operations so there is one authoritative accounting
// path. Confirmation itself never directly changes phase, balances or orders.
export function requestWalkaway(state,{finishTradingDay,finishEndlessCampaign}={}){
 if(state?.phase==='ending'||state?.walkawayRequested)return {alreadyRequested:true,ending:state?.ending||null};
 if(!canRequestWalkaway(state))throw Error('当前暂不能离场，请先完成正在进行的步骤');
 if(state.mode==='endless'){
  if(typeof finishEndlessCampaign!=='function')throw Error('当前版本暂不能完成操盘离场，请保留存档并重试');
  const ending=finishEndlessCampaign(state);return {alreadyRequested:false,ending};
 }
 if(['decision','playing','closing'].includes(state.phase)){
  if(typeof finishTradingDay!=='function')throw Error('日结功能尚未就绪，请重试');
  finishTradingDay(state);
 }
 state.walkawayRequested=true;
 return {alreadyRequested:false,ending:null};
}
