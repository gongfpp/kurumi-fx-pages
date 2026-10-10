import {sealedDailyTradeEvidence,retainedTimeline,shortProfitEvidence} from './contextual-trade-evidence.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
// Day two after an empty day one is not the first game day. Read-only proof.
export function firstDayBackstoryEvidence(state){
 if(state?.day!==1||!shortProfitEvidence(state))return null;
 const evidence=sealedDailyTradeEvidence(state),orders=retainedTimeline(state,evidence);
 if(!orders?.length||state.runStatistics.trades.some(t=>t.day!==1)||state.history.some(t=>!t||t.day!==1))return null;
 return {day:1,positions:[...evidence.positions]};
}
