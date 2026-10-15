import {sealedDailyTradeEvidence,retainedTimeline,shortProfitEvidence} from './contextual-trade-evidence.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
// Day two after an empty day one is not the first game day. Read-only proof.
export function firstDayBackstoryEvidence(state){
 if(state?.day!==1||!shortProfitEvidence(state))return null;
 const evidence=sealedDailyTradeEvidence(state),orders=retainedTimeline(state,evidence);
 if(!orders?.length||state.runStatistics.trades.some(t=>t.day!==1)||state.history.some(t=>!t||t.day!==1))return null;
 return {day:1,positions:[...evidence.positions]};
}
