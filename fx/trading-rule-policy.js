import {WATCH_POLICY} from './economy-plan-config.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

export const NEW_TRADING_RULES=Object.freeze({version:1,id:'story65-endless-free-v1'});
// An absent marker is the legacy contract. Reading or restoring never opts in.
export function validTradingRules(state={}){
 const rules=state.tradingRules;
 return rules===undefined||!!rules&&!Array.isArray(rules)&&rules.version===NEW_TRADING_RULES.version&&rules.id===NEW_TRADING_RULES.id;
}
export function staminaPolicyForState(state={}){
 if(!validTradingRules(state))throw new TypeError('Invalid trading rules');
 if(state.tradingRules===undefined)return{enabled:true,calmDayCost:WATCH_POLICY.calmDayCost,legacy:true};
 return state.mode==='endless'?{enabled:false,calmDayCost:0,legacy:false}:{enabled:true,calmDayCost:65,legacy:false};
}
