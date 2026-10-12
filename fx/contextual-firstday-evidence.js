import {sealedDailyTradeEvidence,retainedTimeline,shortProfitEvidence} from './contextual-trade-evidence.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
// Day two after an empty day one is not the first game day. Read-only proof.
export function firstDayBackstoryEvidence(state){
 if(state?.day!==1||!shortProfitEvidence(state))return null;
 const evidence=sealedDailyTradeEvidence(state),orders=retainedTimeline(state,evidence);
 if(!orders?.length||state.runStatistics.trades.some(t=>t.day!==1)||state.history.some(t=>!t||t.day!==1))return null;
 return {day:1,positions:[...evidence.positions]};
}
