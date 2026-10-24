import {currentTradingTimestamp,tradingTimestamp,formatTradingTime} from './trading-time.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {historicalBillingDay} from './historical-replay.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {tradingDayDurationMinutes} from './stamina.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {isLiveMarket,isOrdinaryLive,liveTimestamp} from './live-market-state.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
// Display existing session boundaries. This never creates a trading session,
// infers an FX exchange opening time, or advances an unknown sleeping cursor.
export function marketClosingTimestamp(state={}){
 if(['day_end','resting','ending'].includes(state.phase)&&state.dayReport?.day===state.day&&Number.isFinite(state.dayReport.closedAt))return state.dayReport.closedAt;
 if(state.historical){if(state.historical.sleepTransition)return null;const clock=historicalBillingDay(state);return clock?.day===state.day?clock.to:null;}
 if(isLiveMarket(state)){const from=state.liveMarket.openingAt,duration=tradingDayDurationMinutes(state);return Number.isFinite(from)&&Number.isFinite(duration)?from+duration*60000:null;}
 return tradingTimestamp(state,{day:state.day,beat:3+(state.mode==='endless'?0:Math.max(0,state.bonusBeats||0)),candle:3,tick:6});
}
export function marketClockSummary(state,{speed=1,paused=false,periodNotice=''}={}){
 const ordinaryLive=isOrdinaryLive(state),current=formatTradingTime(ordinaryLive?liveTimestamp(state):currentTradingTimestamp(state),{full:true}),close=marketClosingTimestamp(state),rate=isLiveMarket(state)?'实时行情':`${[1,2,4].includes(speed)?speed:1}×`;
 return [ordinaryLive?'最后报价时间 '+current:current,periodNotice,rate,...(paused||state.marketPaused?['已暂停']:[]),...(Number.isFinite(close)?[`${ordinaryLive?'本局收盘':'收盘'} ${formatTradingTime(close,{date:true})}`]:[])].filter(Boolean).join(' · ');
}
