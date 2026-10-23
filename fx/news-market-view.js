import {archiveNewsView,NEWS_ARCHIVE} from './news-archive.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {newsContext} from './news-context.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {NEWS_MARKET_COPY as COPY} from './copy/news-market.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {rememberDisplayedNews,completeDisplayedNewsBackground} from './displayed-news-session.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {observedMarketRecap,publicNews,visibleSimulation} from './news-market-core.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
export {observedMarketRecap} from './news-market-core.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';

const archiveById=new Map(NEWS_ARCHIVE.map(entry=>[entry.id,entry]));
export function newsPublicationTime(event){
 const entry=archiveById.get(event?.archiveId);if(!entry)return event?.time??'';
 // availableAfterJst may be a conservative next-day gate, not publication time.
 const at=typeof entry.publishedAt==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(entry.publishedAt)?Date.parse(entry.publishedAt):NaN;
 return Number.isFinite(at)?formatTradingTime(at,{full:true}):`${entry.date} · ${COPY.labels.unknownTime}`;
}

// Archive selection retains its established bag/save contract. In a simulated
// market it is background reading, never a replacement for the causal event.
export function marketNewsView(state,event,options={}){
 const context=newsContext(state),recap=observedMarketRecap(state);
 if(context.mode==='live')return {...publicNews(event),time:formatTradingTime(context.at,{full:true}),contentKind:'quote_record',recap};
 // The archive may spread its input; pass only public fields so even getters on
 // hidden response/variant/bias metadata cannot enter the rendering path.
 const archive=archiveNewsView(state,{...publicNews(event),beat:event.beat},options);
 if(context.mode==='historical')return {...publicNews(archive),time:archive.archiveId?newsPublicationTime(archive):formatTradingTime(context.at,{full:true}),recap};
 const primary=visibleSimulation(state,event,{...options,context,recap});
 const background=archive.archiveId?{...publicNews(archive),time:newsPublicationTime(archive)}:null;
 const view={...primary,recap,background};
 rememberDisplayedNews(state,view,context);
 completeDisplayedNewsBackground(state,view,archiveById.get(background?.archiveId),context);
 return view;
}
