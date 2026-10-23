import {WATCH_POLICY,HOUSING_SLEEP_RECOVERY} from './economy-plan-config.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';

// Optional observations only. No balance, effect, migration, timer or RNG writes.
// A legacy engine can ignore this field; counter mismatches then mark it partial.
const keys=['watch','work','otherSpent','items','rest','otherRecovered'];
const itemSources=new Set(['dailyDrink','noodles','takeaway','energy','chocolate','eyeMask','celebration']);
const restSources=new Set(['sleep','fatigue','friend','relax','noodles-today','quiet-night','dinner-small','dinner-friends','dinner-feast','dinner-banquet']);
const finite=n=>Number.isFinite(n)&&n>=0;
const round=n=>Math.round(n*1e9)/1e9;
const empty=()=>Object.fromEntries(keys.map(key=>[key,0]));
const valid=row=>row?.version===1&&Number.isSafeInteger(row.day)&&row.day>0&&typeof row.complete==='boolean'&&finite(row.lastSpent)&&finite(row.lastRecovered)&&keys.every(key=>finite(row[key]));
const fresh=(row,counters)=>valid(row)&&row.lastSpent===counters.spent&&row.lastRecovered===counters.recovered;
export const staminaUsageCounters=stamina=>({spent:stamina.spent,recovered:stamina.recovered});

export function recordStaminaUsage(state,before,source){
 const stamina=state.stamina,prior=stamina?.usage;
 if(!Number.isSafeInteger(state.day)||state.day<1||!finite(before?.spent)||!finite(before?.recovered)||!finite(stamina?.spent)||!finite(stamina?.recovered))return;
 const spent=round(stamina.spent-before.spent),recovered=round(stamina.recovered-before.recovered);
 if(spent<0||recovered<0)return;
 const continuing=fresh(prior,before)&&prior.day===state.day;
 const newKnownDay=fresh(prior,before)&&prior.day<state.day;
 const row=continuing?{...prior}:{version:1,day:state.day,complete:newKnownDay||state.day===1&&before.spent===0&&before.recovered===0,...empty()};
 row[source==='watch'?'watch':source==='work'?'work':'otherSpent']=round(row[source==='watch'?'watch':source==='work'?'work':'otherSpent']+spent);
 const recoveryKey=itemSources.has(source)?'items':restSources.has(source)?'rest':'otherRecovered';
 row[recoveryKey]=round(row[recoveryKey]+recovered);
 row.lastSpent=stamina.spent;row.lastRecovered=stamina.recovered;
 stamina.usage=row;
}

export function staminaUsageSummary(state={}){
 const stamina=state.stamina,prior=stamina?.usage;
 if(fresh(prior,stamina)&&prior.day===state.day)return{known:true,...prior};
 if(stamina&&((state.day===1&&stamina.spent===0&&stamina.recovered===0)||(fresh(prior,stamina)&&prior.day<state.day)))return{known:true,complete:true,day:state.day,...empty()};
 return{known:false,complete:false,day:state.day};
}
const amount=n=>n>0&&n<.01?'<0.01':String(Math.round(n*100)/100);
export function staminaUsageLines(state={}){
 const row=staminaUsageSummary(state),lines=[];
 if(row.known){
  if(!row.complete)lines.push('继续前的明细未保留，以下只计本次继续后的变化。');
  lines.push(`盯盘消耗 −${amount(row.watch)}`,`工作消耗 −${amount(row.work)}`,`其他消耗 −${amount(row.otherSpent)}`,`道具恢复 +${amount(row.items)}`,`睡眠与休息恢复 +${amount(row.rest)}`,`其他恢复 +${amount(row.otherRecovered)}`);
 }else lines.push('这份进度还没有今日体力明细；从接下来的实际变化开始记录。');
 lines.push(`基础盯盘全天消耗 ${WATCH_POLICY.calmDayCost}，基础睡眠恢复 ${HOUSING_SLEEP_RECOVERY.basic}。`,`实际变化沿用当前压力、道具和睡眠效果；恢复已按体力上限计算。`);
 return lines;
}
