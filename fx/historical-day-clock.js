import {WATCH_POLICY} from './economy-plan-config.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';

// A game-day interval, not a source-file date or a promise to skip overnight.
// The same interval owns closing and stamina normalization across transitions.
const minute=60000,day=86400000;
const time=value=>Number.isSafeInteger(value)&&value>=0;
export function validHistoricalDayClock(state){
 const clock=state.historical?.billingDay;
 return clock===undefined||!!clock&&clock.version===1&&Number.isSafeInteger(clock.day)&&clock.day>=1&&clock.day<=state.day&&
  time(clock.from)&&time(clock.to)&&clock.to>clock.from&&clock.to-clock.from<=day&&['source','continuation'].includes(clock.kind)&&
  Object.keys(clock).length===5;
}
export function historicalDayClock(state,sourceDay=null){
 const h=state.historical;if(!h)return null;
 const saved=h.billingDay;
 if(saved?.day===state.day&&validHistoricalDayClock(state))return saved;
 const continuation=state.historyContinuation;
 const continuedOpening=continuation?.progressDay===state.day?continuation.dayOpeningAt:null;
 const sourceOpening=(h.dayOpeningGameDay===state.day||h.cursor>0&&time(h.dayOpeningAt)&&sourceDay&&h.dayOpeningAt>=sourceDay.first&&h.dayOpeningAt<=sourceDay.last)?h.dayOpeningAt:null;
 const observed=continuation?.active?continuation.at:h.lastQuote?.[0];
 const candidate=time(continuedOpening)?continuedOpening:time(sourceOpening)?sourceOpening:observed;
 const from=time(candidate)&&candidate<=observed?candidate:observed;
 if(!time(from))return null;
 // A not-yet-consumed Monday source must not stretch a Saturday continuation.
 // An adjacent, ready source day can continue on its own closing boundary.
 // A distant Monday or an already-running loading clock cannot enlarge it.
 const adjacentStart=h.cursor===0&&!(continuation?.daySamples>0)&&sourceDay?.first<=observed+minute;
 const boundedSource=(h.cursor>0||adjacentStart)&&time(sourceDay?.first)&&time(sourceDay?.last)&&from>=sourceDay.first-minute&&sourceDay.last>from&&sourceDay.last-from<=day;
 return {version:1,day:state.day,from,to:boundedSource?sourceDay.last:from+WATCH_POLICY.simulatedDayMinutes*minute,kind:boundedSource?'source':'continuation'};
}
export function lockHistoricalDayClock(state,sourceDay=null){
 const clock=historicalDayClock(state,sourceDay);
 if(!clock)throw Error('历史行情缺少当天计时起点');
 state.historical.billingDay=clock;state.historical.dayOpeningAt=clock.from;state.historical.dayOpeningGameDay=clock.day;return clock;
}
