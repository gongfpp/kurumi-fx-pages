// Time is consumed market time, never render time. A simulated day observes
// 16 x 15 minutes: calm watching spends 48 points. Historical/live minutes
// retain their source duration and prior rate (1.8 points per observed hour);
// a one-second provider update is 1/60 minute, not a simulated quote step.
export const STAMINA_RULES=Object.freeze({max:100,warning:20,entryMinimum:0,workCost:20,watchCostPerMinute:.20,observedWatchCostPerMinute:.03,maxObservedGapMinutes:15});
export const STAMINA_MOOD_MULTIPLIERS=Object.freeze({despair:1.6,exhausted:1.5,anxious:1.3,nervous:1.2,regretful:1.2,guilty:1.15,irritated:1.15,stunned:1.1,calm:1,relieved:1,hopeful:.9,smug:.75,ecstatic:.7});
const round=value=>Math.round(value*1e9)/1e9;
const bounded=value=>Number.isFinite(value)&&value>=0&&value<=STAMINA_RULES.max;
const validId=value=>typeof value==='string'&&value.length>0&&value.length<=200;
export function newStamina(){return{version:1,value:STAMINA_RULES.max,watchMinutes:0,spent:0,recovered:0,lastSample:null,recoveryReceipts:[]};}
export function validStamina(value){
 if(value===undefined)return true;
 if(!value||![1,2,3].includes(value.version)||!bounded(value.value)||!['watchMinutes','spent','recovered'].every(key=>Number.isFinite(value[key])&&value[key]>=0)||value.lastSample!==null&&!validId(value.lastSample)||!Array.isArray(value.recoveryReceipts))return false;
 if(!validFatigue(value.fatigue)||value.fatigue!==undefined&&![2,3].includes(value.version))return false;
 const ids=new Set();
 return value.recoveryReceipts.every(row=>{
  if(!row||!validId(row.id)||ids.has(row.id)||!validId(row.source)||!bounded(row.before)||!bounded(row.after)||!Number.isFinite(row.amount)||row.amount<0||row.amount>STAMINA_RULES.max||!Number.isFinite(row.delta)||Math.abs(row.delta)>STAMINA_RULES.max||Math.abs(row.after-row.before-row.delta)>1e-7)return false;
  ids.add(row.id);return true;
 });
}
export function ensureStamina(state){if(state.stamina===undefined)state.stamina=newStamina();if(!validStamina(state.stamina))throw new TypeError('Invalid stamina state');return state.stamina;}
// Read-only: merely opening a menu or switching UI never upgrades a save.
export function staminaStatus(state={}){
 const value=state.stamina?.value??STAMINA_RULES.max;
 return{value,max:STAMINA_RULES.max,low:value<=STAMINA_RULES.warning,exhausted:value<=0,canOpen:value>STAMINA_RULES.entryMinimum,canWork:value>=STAMINA_RULES.workCost,canRest:true};
}
export function staminaDrainMultiplier(emotion){return STAMINA_MOOD_MULTIPLIERS[emotion]??1;}
export function staminaWatchCostPerMinute(state={}){
 return state.liveMarket?.version===1||[1,2,3].includes(state.historical?.version)?STAMINA_RULES.observedWatchCostPerMinute:STAMINA_RULES.watchCostPerMinute;
}
export function consumeTradingStamina(state,{minutes,emotion='calm',sampleId,active=true}={}){
 if(!Number.isFinite(minutes)||minutes<0||!validId(sampleId))throw new TypeError('Invalid stamina sample');
 if(!active||state.marketPaused||!['decision','playing'].includes(state.phase))return{applied:false,spent:0,...staminaStatus(state)};
 const stamina=ensureStamina(state);
 if(staminaFatigueActive(state))return{applied:false,spent:0,...staminaStatus(state)};
 if(stamina.lastSample===sampleId)return{applied:false,alreadyApplied:true,spent:0,...staminaStatus(state)};
 const before=stamina.value,spent=Math.min(before,minutes*staminaWatchCostPerMinute(state)*staminaDrainMultiplier(emotion));
 stamina.value=round(Math.max(0,before-spent));stamina.spent=round(stamina.spent+before-stamina.value);stamina.watchMinutes=round(stamina.watchMinutes+minutes);stamina.lastSample=sampleId;
 if(before>0&&stamina.value===0)queueStaminaFatigue(state);
 return{applied:true,spent:before-stamina.value,...staminaStatus(state)};
}
function changeStamina(state,{amount,id,source},direction){
 if(!Number.isFinite(amount)||amount<0||amount>STAMINA_RULES.max||!validId(id)||!validId(source))throw new TypeError('Invalid stamina change');
 const stamina=ensureStamina(state),prior=stamina.recoveryReceipts.find(row=>row.id===id);
 if(prior)return{...prior,applied:false,alreadyApplied:true};
 if(direction<0&&stamina.value<amount)return{applied:false,alreadyApplied:false,reason:'insufficient-stamina',before:stamina.value,after:stamina.value,amount:0};
 const before=stamina.value,after=round(Math.max(0,Math.min(STAMINA_RULES.max,before+direction*amount))),delta=round(after-before);
 const receipt={id,source,amount,before,after,delta};stamina.value=after;
 if(direction>0)stamina.recovered=round(stamina.recovered+delta);else stamina.spent=round(stamina.spent-delta);
 stamina.recoveryReceipts.push(receipt);return{...receipt,applied:true,alreadyApplied:false};
}
export function recoverStamina(state,options={}){return changeStamina(state,options,1);}
export function consumeStamina(state,options={}){return changeStamina(state,options,-1);}

// One bounded, persisted episode. The UI claims it before the eyelids close;
// reloads resume its remaining work rather than replaying or rewarding it twice.
export const STAMINA_FATIGUE=Object.freeze({durationMs:2500,recovery:15,minHours:1,maxHours:3});
const fatiguePhases=['pending','closing','advancing','done'];
function validFatigue(event){
 if(event===undefined)return true;
 return !!event&&event.version===1&&Number.isSafeInteger(event.sequence)&&event.sequence>0&&validId(event.id)&&fatiguePhases.includes(event.phase)&&[60,120,180].includes(event.minutes)&&typeof event.recovered==='boolean'&&[null,'simulation','historical','live'].includes(event.mode)&&['startAt','targetAt','endAt'].every(key=>event[key]===null||Number.isFinite(event[key])&&Math.abs(event[key])<8e15)&&['pending','target','boundary','live','interrupted','recovered'].includes(event.reason)&&
  (event.phase==='pending'?event.mode===null&&event.startAt===null&&event.targetAt===null&&!event.recovered:event.mode!==null&&event.startAt!==null&&event.targetAt===event.startAt+(event.mode==='live'?0:event.minutes*60000))&&
  (!event.recovered||['advancing','done'].includes(event.phase));
}
export function staminaFatigueActive(state){return !!state.stamina?.fatigue&&state.stamina.fatigue.phase!=='done';}
export function queueStaminaFatigue(state){
 const stamina=ensureStamina(state);
 if(stamina.value>0||staminaFatigueActive(state))return stamina.fatigue||null;
 const sequence=(stamina.fatigue?.sequence||0)+1;
 // Only a real fatigue episode upgrades this optional component. Previous
 // engines reject version 2 rather than overwrite an unfinished transaction.
 stamina.version=Math.max(2,stamina.version);
 // Seeded episode randomness is stable across saves and does not consume the
 // market generator, so exhaustion can never alter the price sequence.
 let hash=2166136261;for(const char of `${state.seed}:${state.runId||''}:${sequence}:${stamina.lastSample||'legacy'}`)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 return stamina.fatigue={version:1,sequence,id:`fatigue:${sequence}:${hash}`,phase:'pending',minutes:60*(1+hash%3),recovered:false,mode:null,startAt:null,targetAt:null,endAt:null,reason:'pending'};
}
export function beginStaminaFatigue(state,{mode,at}={}){
 const event=state.stamina?.fatigue;
 if(!event||event.phase!=='pending')return false;
 if(!['simulation','historical','live'].includes(mode)||!Number.isFinite(at))throw new TypeError('Invalid fatigue timeline');
 Object.assign(event,{phase:'closing',mode,startAt:at,targetAt:at+(mode==='live'?0:event.minutes*60000),endAt:at});return true;
}
export function recoverStaminaFatigue(state){
 const stamina=ensureStamina(state),event=stamina.fatigue;
 if(!event||event.phase!=='closing'||event.recovered)return false;
 // Preserve an explicit recovery (food/rest) made during this episode.
 const before=stamina.value;stamina.value=Math.max(before,STAMINA_FATIGUE.recovery);stamina.recovered=round(stamina.recovered+stamina.value-before);
 event.recovered=true;event.phase='advancing';return true;
}
export function completeStaminaFatigue(state,{reason='target',at}={}){
 const event=state.stamina?.fatigue;if(!event||event.phase==='done')return false;
 if(!['target','boundary','live','interrupted','recovered'].includes(reason))throw new TypeError('Invalid fatigue completion');
 // A recovered pending episode has no claimed timeline and can simply disappear.
 if(event.phase==='pending'){delete state.stamina.fatigue;return true;}
 event.phase='done';event.reason=reason;event.endAt=Number.isFinite(at)?at:event.endAt;return true;
}
