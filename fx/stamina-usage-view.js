import {staminaUsageLines} from './stamina-usage.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {staminaDrainMultiplier,staminaWatchCostPerMinute,tradingDayProgress} from './stamina.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {energyStageStatus} from './energy-stage.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {sleepStaminaRecovery,PROP_STAMINA_RECOVERY} from './life-recovery.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {LIFE_WORK_JOBS,effectiveWorkTerms} from './life-work.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {PROPS} from './content.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
const number=n=>Number(n.toFixed(4)).toString();
// Help is read-only. Actual counters own the totals; current contracts own the
// explanatory rates. Neither viewing nor re-opening this panel applies effects.
export function staminaDetailsLines(state={}){
 const progress=tradingDayProgress(state),pressure=staminaDrainMultiplier('calm',Math.max(0,state.stress||0)/40),energy=energyStageStatus(state,progress);
 const rate=staminaWatchCostPerMinute(state)*pressure*energy.multiplier;
 const lines=staminaUsageLines(state);
 lines.push(progress>=1?'今天盯盘体力已按完整交易区间计满。':`当前盯盘费率约 ${number(rate)} 体力/行情分钟；压力 ×${number(pressure)}，提神阶段 ×${number(energy.multiplier)}。`);
 lines.push(`当前住房对应睡眠恢复 ${sleepStaminaRecovery(state)}${state.dailySupplies?.eyeMaskPending?'，另有已用眼罩的恢复效果':''}；实际恢复受体力上限限制。`);
 lines.push('当前完整工作消耗（已计入拥有的工作道具）：');
 for(const job of LIFE_WORK_JOBS)lines.push(`${job.label}：${effectiveWorkTerms(state,job).staminaCost} 体力`);
 lines.push('道具的名义体力恢复（实际以使用回执为准）：');
 for(const [id,value]of Object.entries(PROP_STAMINA_RECOVERY))if(value>0&&PROPS[id])lines.push(`${PROPS[id].name}：+${value}`);
 return lines;
}
