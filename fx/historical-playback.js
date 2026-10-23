import {isResearch} from './historical-replay.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {historicalSimulationActive} from './history-continuation.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {advanceHistoricalBatch} from './historical-market.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {isHistoricalM15,hasHistoricalM15Feed,peekHistoricalM15} from './historical-m15-engine-adapter.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {currentTradingTimestamp} from './trading-time.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
const multiplier=speed=>[1,2,4].includes(speed)?speed:1;
// One observed minute every 400ms at 1x: 15 market minutes in six wall seconds.
// This is independent of chart period and daily display rental.
export function historicalStepMilliseconds(state,speed=1){
 if(isHistoricalM15(state)&&!historicalSimulationActive(state)&&hasHistoricalM15Feed(state)&&state.historical.status==='ready'){
  const at=peekHistoricalM15(state).quote?.[0],delta=Number.isFinite(at)?Math.min(60000,Math.max(0,at-currentTradingTimestamp(state))):60000;
  return delta/60000*400/multiplier(speed);
 }
 return isHistoricalM15(state)||isResearch(state)||historicalSimulationActive(state)?400/multiplier(speed):50;
}
export function advanceHistoricalPlayback(state,step,{speed=1,...options}={}){
 if(isHistoricalM15(state)){
  if(state.marketPaused)return null;
  let result=step(state);const exits=[...(result?.exits||[])];let candleClosed=!!result?.candleClosed;
  // Adjacent bar close then open share a source timestamp. Execute both risk
  // passes in that order without charging another wall-time interval.
  while(!result?.dayEnded&&!result?.sourceBoundary&&['decision','playing'].includes(state.phase)&&!state.marketPaused&&hasHistoricalM15Feed(state)&&state.historical.status==='ready'&&peekHistoricalM15(state).quote?.[0]<=currentTradingTimestamp(state)){
   result=step(state);exits.push(...(result?.exits||[]));candleClosed ||= !!result?.candleClosed;
  }
  return result?{...result,exits,exit:exits[0]||null,candleClosed}:null;
 }
 return isResearch(state)?step(state):advanceHistoricalBatch(state,step,{...options,speed:multiplier(speed)});
}
