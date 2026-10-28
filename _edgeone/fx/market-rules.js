// Opt-in is stamped only at creation. Restoring an older save never adds it.
export const APPROVED_MARKET_RULES=Object.freeze({version:1,id:'market-time-sleep-m15-a'});
export const usesApprovedMarketRules=state=>state?.marketRules?.version===1&&state.marketRules.id===APPROVED_MARKET_RULES.id;
export function validMarketRules(state){
 const rules=state?.marketRules;
 return rules===undefined||usesApprovedMarketRules(state)&&Object.keys(rules).length===2;
}
