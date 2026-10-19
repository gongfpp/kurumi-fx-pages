import {sealedDailyTradeEvidence,retainedTimeline,shortProfitEvidence} from './contextual-trade-evidence.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717';
// Day two after an empty day one is not the first game day. Read-only proof.
export function firstDayBackstoryEvidence(state){
 if(state?.day!==1||!shortProfitEvidence(state))return null;
 const evidence=sealedDailyTradeEvidence(state),orders=retainedTimeline(state,evidence);
 if(!orders?.length||state.runStatistics.trades.some(t=>t.day!==1)||state.history.some(t=>!t||t.day!==1))return null;
 return {day:1,positions:[...evidence.positions]};
}
