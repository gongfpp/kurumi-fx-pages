import {availableNews,newsAvailableAt,newsContext,newsDate} from './news-context.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {NEWS_MARKET_COPY as COPY} from './copy/news-market.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {displayedNewsItems} from './displayed-news-session.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';

// Compact labels use the viewed market date only as a comparison. The item's
// own publication instant supplies its JST day/time; availability is not a clock.
export function mobileNewsListTime(item,referenceDate){
 const date=newsDate(item?.publishedAt);
 if(!date||typeof referenceDate!=='string'||!/^\d{4}-\d\d-\d\d$/.test(referenceDate))return item?.time||'';
 const day=date===referenceDate?'':date.slice(0,4)===referenceDate.slice(0,4)?date.slice(5):date;
 return [day,formatTradingTime(item.publishedAt)].filter(Boolean).join(' ');
}

// Read-only publication list. Eligibility is the archive's existing pair/date/
// review gate; neither future script events nor archive bag mutations are read.
export function mobileNewsItems(state,current,{archive=[]}={}){
 const context=newsContext(state),rows=archive.filter(entry=>availableNews(entry,context)).map(entry=>{
  const at=typeof entry.publishedAt==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(entry.publishedAt)?Date.parse(entry.publishedAt):NaN;
  const publishedAt=Number.isFinite(at)?at:null;
  return {id:entry.id,archiveId:entry.id,title:entry.title,copy:entry.summary,source:entry.sourceName,
   // Availability is a conservative visibility gate, not a publication timestamp.
   time:publishedAt===null?`${entry.date} · ${COPY.labels.unknownTime}`:formatTradingTime(publishedAt,{full:true}),
   publishedAt,publicationDate:publishedAt===null?entry.date:newsDate(publishedAt),availableAt:newsAvailableAt(entry),
   sourceUrl:entry.sourceUrl,sourceAttribution:entry.sourceAttribution,sourceLicenseUrl:entry.sourceLicenseUrl,
   summaryNotice:entry.summaryNotice,contentKind:'historical_fact'};
 }).filter(item=>item.publishedAt===null||item.publishedAt<=context.at).sort((a,b)=>
  b.publicationDate.localeCompare(a.publicationDate)||(b.publishedAt??-Infinity)-(a.publishedAt??-Infinity)||a.id.localeCompare(b.id));
 const displayed=displayedNewsItems(state);
 rows.unshift(...displayed);
 if(current?.title&&current.contentKind!=='historical_fact'&&current.contentKind!=='fictional_market_event'&&(!Number.isFinite(current.publishedAt)||current.publishedAt<=context.at))rows.unshift({...current,id:`current:${context.mode}:${context.pair}:${current.id??''}:${current.publishedAt??context.at}:${current.title}`});
 return rows.map(item=>({...item,listTime:mobileNewsListTime(item,context.date)}));
}

