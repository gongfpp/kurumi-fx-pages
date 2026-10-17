import {recoverStamina} from './stamina.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';
import {validLivingService} from './living-services.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';

// Game-balance values for existing actions and items. No new purchases,
// unlocks, story events or fees are introduced here. All values are bounded by
// the stamina policy and apply only after the owning action has committed.
export const LIFE_STAMINA_RECOVERY=Object.freeze({friend:12,relax:18});
export const RECAP_STAMINA_RECOVERY=Object.freeze({
 'noodles-today':6,'quiet-night':18,
 'dinner-small':12,'dinner-friends':20,'dinner-feast':28,'dinner-banquet':36
});
export const PROP_STAMINA_RECOVERY=Object.freeze({dailyDrink:10,noodles:10,takeaway:30,energy:30,chocolate:5,eyeMask:0,celebration:25});
// Fully paid housing determines the sleep benefit; unpaid days use basic rest.
export const SLEEP_STAMINA_RECOVERY=Object.freeze({basic:28,comfortable:40,generous:50,premium:58,penthouse:64});

export function recoverLifeAction(state,category,receiptId,optionId,{catToy=false}={}){
 const amount=category==='friend'&&optionId==='yasuko'&&catToy?16:category==='relax'&&optionId==='onsen'?40:LIFE_STAMINA_RECOVERY[category];
 return amount?recoverStamina(state,{amount,id:`stamina:${receiptId}`,source:category}):null;
}
export function recoverRecapAction(state,id){
 const amount=RECAP_STAMINA_RECOVERY[id];
 return amount?recoverStamina(state,{amount,id:`stamina:activity:${state.day}:${id}`,source:id}):null;
}
export function recoverProp(state,id){
 const amount=PROP_STAMINA_RECOVERY[id];
 return amount?recoverStamina(state,{amount,id:`stamina:item:${state.day}:${id}`,source:id}):null;
}
export function sleepStaminaRecovery(state){
 // Endless trading has no daily housing payment. Legacy receipts without an
 // itemized paid service retain the basic rest benefit, never a guessed bonus.
 if(state.mode==='endless')return SLEEP_STAMINA_RECOVERY.basic;
 const report=state.dayReport,settlement=report?.livingSettlement,receipt=settlement?.receipt,service=receipt?.service;
 if(report?.day!==state.day||settlement?.status!=='finalized'||!service?.fullyPaid||!validLivingService(service,receipt))return SLEEP_STAMINA_RECOVERY.basic;
 return SLEEP_STAMINA_RECOVERY[service.lifestyleId]||SLEEP_STAMINA_RECOVERY.basic;
}
export function recoverLifeSleep(state,{id=`stamina:rest:${state.day}`}={}){
 const bonus=state.dailySupplies?.eyeMaskPending?15:0;
 const result=recoverStamina(state,{amount:sleepStaminaRecovery(state)+bonus,id,source:'sleep'});
 if(result.applied&&bonus)state.dailySupplies.eyeMaskPending=false;
 return result;
}
