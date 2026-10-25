import {newsContext,newsDate} from './news-context.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {formatTradingTime,tradingTimestamp,timedCandles} from './trading-time.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {NEWS_MARKET_COPY as COPY} from './copy/news-market.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {rememberDisplayedNews} from './displayed-news-session.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

const positive=value=>Number.isFinite(value)&&value>0;
const fill=(text,values)=>text.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));
export const publicNews=event=>{const view=Object.fromEntries(['id','chain','title','copy','source','time','archiveKind','archiveId','sourceUrl','contentKind','archiveTags','sourceAttribution','sourceLicenseUrl','summaryNotice','swan'].filter(key=>event?.[key]!==undefined).map(key=>[key,event[key]]));if(view.contentKind==='historical_fact'){view.id=view.archiveId;delete view.chain;}return view;};
const pairName=pair=>pair?`${pair.slice(0,3)}/${pair.slice(3)}`:'';

// Inspect only observations already delivered to the selected chart. The save's
// generated script, future outcomes and other instruments never enter a recap.
export function observedMarketRecap(state){
 const context=newsContext(state);if(!context.pair||!Number.isFinite(context.at))return null;
 const research=[2,3].includes(state.historical?.version);
 const observed=timedCandles(state).filter(c=>!c.historical&&c.day===state.day&&
  [c.open,c.close,c.low,c.high].every(positive)&&Number.isFinite(c.timestamp)&&
  (c.availableAt??c.lastQuoteAt??c.timestamp)<=context.at&&c.timestamp<=context.at).slice(-4);
 if(!observed.length)return null;
 const first=observed[0],last=observed.at(-1);
 // Research packages execute at observed closes. Do not pretend that the bar's
 // earlier open/high/low were available as tradable quotes before publication.
 const from=research?first.availableAt??first.firstQuoteAt:first.firstQuoteAt??first.timestamp;
 const to=last.lastQuoteAt??context.at,start=research?first.close:first.open,end=last.close;
 if(!Number.isFinite(from)||!Number.isFinite(to)||from>to||to>context.at)return null;
 const values=research?observed.map(c=>c.close):observed.flatMap(c=>[c.low,c.high]);
 const change=(end/start-1)*100;
 const result={pair:pairName(context.pair),from,to,start,last:end,change,low:Math.min(...values),high:Math.max(...values),count:observed.length};
 const displayed={...result,from:formatTradingTime(from,{date:true}),to:formatTradingTime(to,{date:newsDate(from)!==newsDate(to)})+' JST',
  start:start.toFixed(3),last:end.toFixed(3),change:`${change>=0?'+':''}${change.toFixed(3)}`,low:result.low.toFixed(3),high:result.high.toFixed(3)};
 return {...result,title:COPY.labels.recap,copy:fill(COPY.recap,displayed)};
}

export function visibleSimulation(state,event,{flash,context,recap}){
 const beat=Number.isInteger(event.beat)?event.beat:Math.min(state.beat||0,3+(state.mode==='endless'?0:state.bonusBeats||0));
 const revealAt=tradingTimestamp(state,{day:state.day,beat,candle:1,tick:3});
 const revealed=(flash||state.lastEvent?.beat===beat||state.pending?.beat===beat&&state.pending.flashShown)&&context.at>=revealAt;
 const cursor=event.swan?{beat,candle:event.candle,tick:(event.tick??0)+1}:revealed?{beat,candle:1,tick:3}:{beat,candle:0,tick:0};
 const publishedAt=Number.isFinite(event.publishedAt)?event.publishedAt:tradingTimestamp(state,{day:state.day,...cursor});
 const view={...publicNews(event),archiveId:undefined,sourceUrl:undefined,sourceAttribution:undefined,sourceLicenseUrl:undefined,summaryNotice:undefined,
  contentKind:'fictional_market_event',archiveKind:'新闻',publishedAt,time:formatTradingTime(publishedAt,{full:true})};
 // Cross-pair updates report observations, never hidden bias, future response,
 // variant or invented order-book pressure. Macro facts remain USD/JPY-specific.
 if(context.pair&&context.pair!=='USDJPY'){
  const copy=recap?COPY.crossPair.observed:COPY.crossPair.opening;
  const values=recap?{...recap,pair:pairName(context.pair),start:recap.start.toFixed(3),last:recap.last.toFixed(3),change:`${recap.change>=0?'+':''}${recap.change.toFixed(3)}`,low:recap.low.toFixed(3),high:recap.high.toFixed(3)}:{pair:pairName(context.pair),last:positive(state.price)?state.price.toFixed(3):'—'};
  view.title=fill(copy.title,values);view.copy=fill(copy.copy,values);view.source='汇市报价记录';
 }
 return view;
}

// Before optional archive data arrives, show only the causal event or an
// observed historical quote record. Never initialize/reset the saved archive bag.
export function marketNewsWithoutArchive(state,event,options={}){
 const context=newsContext(state),recap=observedMarketRecap(state);
 if(context.mode==='live')return {...publicNews(event),time:formatTradingTime(context.at,{full:true}),contentKind:'quote_record',recap};
 if(context.mode==='historical')return {title:'历史行情',copy:'按当前报价继续交易。',source:'历史外汇行情',time:formatTradingTime(context.at,{full:true}),archiveKind:'行情记录',contentKind:'quote_record',recap};
 const view={...visibleSimulation(state,event,{...options,context,recap}),recap,background:null};
 rememberDisplayedNews(state,view,context,{pendingBackground:true});return view;
}
