// Game-balance parameters. Time is consumed market time, never render time.
export const STAMINA_RULES=Object.freeze({max:100,warning:20,entryMinimum:0,workCost:20,watchCostPerMinute:.3,maxObservedGapMinutes:15});
export const STAMINA_MOOD_MULTIPLIERS=Object.freeze({despair:2,exhausted:1.5,anxious:1.3,nervous:1.2,regretful:1.2,guilty:1.15,irritated:1.15,stunned:1.1,calm:1,relieved:1,hopeful:.9,smug:.75,ecstatic:.5});
const round=value=>Math.round(value*1e9)/1e9;
const bounded=value=>Number.isFinite(value)&&value>=0&&value<=STAMINA_RULES.max;
const validId=value=>typeof value==='string'&&value.length>0&&value.length<=200;
export function newStamina(){return{version:1,value:STAMINA_RULES.max,watchMinutes:0,spent:0,recovered:0,lastSample:null,recoveryReceipts:[]};}
export function validStamina(value){
 if(value===undefined)return true;
 if(!value||value.version!==1||!bounded(value.value)||!['watchMinutes','spent','recovered'].every(key=>Number.isFinite(value[key])&&value[key]>=0)||value.lastSample!==null&&!validId(value.lastSample)||!Array.isArray(value.recoveryReceipts))return false;
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
export function consumeTradingStamina(state,{minutes,emotion='calm',sampleId,active=true}={}){
 if(!Number.isFinite(minutes)||minutes<0||!validId(sampleId))throw new TypeError('Invalid stamina sample');
 if(!active||state.marketPaused||!['decision','playing'].includes(state.phase))return{applied:false,spent:0,...staminaStatus(state)};
 const stamina=ensureStamina(state);
 if(stamina.lastSample===sampleId)return{applied:false,alreadyApplied:true,spent:0,...staminaStatus(state)};
 const before=stamina.value,spent=Math.min(before,minutes*STAMINA_RULES.watchCostPerMinute*staminaDrainMultiplier(emotion));
 stamina.value=round(Math.max(0,before-spent));stamina.spent=round(stamina.spent+before-stamina.value);stamina.watchMinutes=round(stamina.watchMinutes+minutes);stamina.lastSample=sampleId;
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
