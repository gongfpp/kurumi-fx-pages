// Display aggregation only. Never reads a script, feed, or unseen source candle.
import {timedCandles,currentTradingTimestamp} from './trading-time.js?v=a3f9eecb8c4bffe5ed12deeae323a4a94c9c180e-23f2a20b7717';
import {quotePackageState,quotePackageOffer,quotePackageName} from './quote-packages.js?v=a3f9eecb8c4bffe5ed12deeae323a4a94c9c180e-23f2a20b7717';
export const CANDLE_PERIODS=Object.freeze([{minutes:15,label:'15分钟',hz:1},{minutes:1440,label:'日K',hz:1},{minutes:5,label:'5分钟',hz:2},{minutes:1,label:'1分钟',hz:4}]);
const MINUTE=60000,JST=9*3600000,LIMIT=8192;
export const requestedCandlePeriod=s=>CANDLE_PERIODS.some(p=>p.minutes===s.candlePeriod)?s.candlePeriod:15;
export const candlePeriod=s=>{const m=requestedCandlePeriod(s),p=CANDLE_PERIODS.find(p=>p.minutes===m);return quotePackageState(s).ownedHz>=p.hz?m:15;};
export const candlePeriodLabel=s=>CANDLE_PERIODS.find(p=>p.minutes===candlePeriod(s)).label;
export const candlePeriodNotice=(s,{includeTimeZone=true}={})=>`${includeTimeZone?'JST · ':''}${candlePeriodLabel(s)}${candlePeriod(s)===1440?'':' K线'}`;
export function recordDisplayQuote(s,timestamp,price){
 if(!Number.isFinite(timestamp)||!Number.isFinite(price)||price<=0)return;
 s.displayMinutes ||= [];const bars=s.displayMinutes,bucket=Math.floor(timestamp/MINUTE)*MINUTE,last=bars.at(-1);
 if(last&&timestamp<last.lastQuoteAt)return;
 if(last&&last.timestamp===bucket&&last.day===s.day){last.close=price;last.high=Math.max(last.high,price);last.low=Math.min(last.low,price);last.lastQuoteAt=timestamp;return;}
 if(last)last.closed=true;
 bars.push({timestamp:bucket,open:price,high:price,low:price,close:price,day:s.day,beat:s.beat||0,closed:false,firstQuoteAt:timestamp,lastQuoteAt:timestamp,timeSource:'observed-quote'});
 if(bars.length>LIMIT){bars.splice(0,bars.length-LIMIT);s.displayMinutesPartial=true;}
}
export function recordDisplaySourceCandle(s,candle){
 s.displayMinutes ||= (s.candles||[]).filter(c=>c.research&&c.timestamp<candle.timestamp).map(c=>({...c}));if(s.displayMinutes.at(-1)?.timestamp===candle.timestamp)return;
 s.displayMinutes.push({...candle});if(s.displayMinutes.length>LIMIT){s.displayMinutes.splice(0,s.displayMinutes.length-LIMIT);s.displayMinutesPartial=true;}
}
export function validCandleDisplay(s){
 if(s.candlePeriod!==undefined&&!CANDLE_PERIODS.some(p=>p.minutes===s.candlePeriod))return false;
 if(s.displayMinutes===undefined)return true;
 const now=currentTradingTimestamp(s);let previous=-Infinity;
 return Array.isArray(s.displayMinutes)&&s.displayMinutes.length<=LIMIT&&s.displayMinutes.every(c=>{const at=c.availableAt??c.lastQuoteAt;const valid=Number.isFinite(c.timestamp)&&c.timestamp>=previous&&Number.isFinite(at)&&at<=now&&[c.open,c.high,c.low,c.close].every(n=>Number.isFinite(n)&&n>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)&&Number.isSafeInteger(c.day)&&c.day>0&&c.day<=s.day;previous=c.timestamp;return valid;});
}
export function aggregateCandles(source,minutes,now){
 const result=[],duration=minutes*MINUTE,offset=minutes===1440?JST:0;
 for(const c of source){if(!Number.isFinite(c.timestamp)||c.timestamp>now||(c.availableAt??c.firstQuoteAt??c.timestamp)>now)continue;
  const bucket=Math.floor((c.timestamp+offset)/duration)*duration-offset,last=result.at(-1);
  if(last&&last.timestamp===bucket){last.day=c.day;last.close=c.close;last.high=Math.max(last.high,c.high);last.low=Math.min(last.low,c.low);last.closed=last.closed&&c.closed;last.lastQuoteAt=c.lastQuoteAt??c.timestamp;}
  else result.push({...c,timestamp:bucket,periodMinutes:minutes,closed:!!c.closed});
 }
 for(const c of result)c.closed=!!c.closed&&c.timestamp+duration<=now;
 return result;
}
export function displayCandles(s){
 const minutes=candlePeriod(s),now=currentTradingTimestamp(s),research=s.historical?.version===2;
 const source=research?(s.displayMinutes?.length?s.displayMinutes:timedCandles(s)):minutes<15?(s.displayMinutes||[]):timedCandles(s);
 // Simulated source bars start on the actual session grid (09:10 etc.).
 if(minutes===15&&!research)return source.map(c=>({...c,periodMinutes:15}));
 return aggregateCandles(source,minutes,now);
}
export function candlePeriodMarkup(s,{availableCash=s.cash,canPurchase=true}={}){
 const packageState=quotePackageState(s),selected=candlePeriod(s);
 return `<div class="candle-period-list" role="group" aria-label="K线时间周期">${CANDLE_PERIODS.map(p=>{
  const offer=quotePackageOffer(s,p.hz,{availableCash,canPurchase}),active=selected===p.minutes;
  const cost=p.hz===1?'免费'+(active?' · 已选':''):active?'已选':offer.owned?'今日可用':`¥${offer.totalPrice.toLocaleString('zh-CN')}/日`;
  const supplement=offer.price>0&&offer.price<offer.totalPrice?`今日补付¥${offer.price.toLocaleString('zh-CN')}`:null;
  const detail=offer.reason||(p.hz===1&&active&&packageState.renewalBlocked?'续租未成功':supplement);
  return `<button type="button" class="candle-period-row" data-candle-period="${p.minutes}" aria-pressed="${active}" ${!offer.valid?'disabled':''}><span class="candle-period-name"><strong>${p.label}</strong>${p.hz>1?`<span>${quotePackageName(p.hz)}</span>`:''}</span><span class="candle-period-price">${cost}</span>${detail?`<small>${detail}</small>`:''}</button>`;
 }).join('')}</div><p class="candle-period-note">升级补差价，降档当天不退费</p>`;
}
