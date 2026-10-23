import {newsContext,newsDate,availableNews} from './news-context.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';

// View-only memory of messages actually returned for display in this page.
// Never reconstruct missed publications from a saved script or quote history.
// A restored/replaced state starts a new observation session, even with the
// same seed/runId; ordinary play and modeStates retain the existing object.
const sessions=new WeakMap();
// Only archive-pending publications may receive one later background. This
// metadata belongs to the view snapshot, never to a saved game or public item.
const pendingBackgrounds=new WeakMap();
export const DISPLAYED_NEWS_LIMIT=256;
const fields=['id','chain','title','copy','source','time','archiveKind','archiveId','sourceUrl','contentKind','archiveTags','sourceAttribution','sourceLicenseUrl','summaryNotice','swan','publishedAt','publicationDate'];
const recapFields=['pair','from','to','start','last','change','low','high','count','title','copy'];
const pick=(value,keys)=>Object.fromEntries(keys.filter(key=>['string','number','boolean'].includes(typeof value?.[key])).map(key=>[key,value[key]]));
const snapshot=item=>({...pick(item,fields),recap:item.recap?pick(item.recap,recapFields):null,background:item.background?pick(item.background,fields):null});
const displayedId=(item,context)=>`displayed:${context.pair}:${item.id??''}:${item.publishedAt}:${item.title}`;

function session(state,context){
 if(!state||typeof state!=='object')return null;
 if(context.mode!=='simulated'||!context.pair||!Number.isFinite(context.at)){sessions.delete(state);return null;}
 let memory=sessions.get(state);
 if(!memory||memory.runId!==state.runId||memory.seed!==state.seed||memory.mode!==state.mode||context.at<memory.at){
  memory={runId:state.runId,seed:state.seed,mode:state.mode,at:context.at,pairs:new Map()};sessions.set(state,memory);
 }
 memory.at=context.at;return memory;
}

export function rememberDisplayedNews(state,item,context=newsContext(state),{pendingBackground=false}={}){
 const memory=session(state,context);
 if(!memory||item?.contentKind!=='fictional_market_event'||!item.title||!Number.isFinite(item.publishedAt)||item.publishedAt>context.at)return;
 const id=displayedId(item,context);
 let rows=memory.pairs.get(context.pair);if(!rows){rows=new Map();memory.pairs.set(context.pair,rows);}
 // First publication wins: later recaps/background selections never rewrite it.
 if(rows.has(id))return;
 const record=snapshot({...item,id,publicationDate:newsDate(item.publishedAt)});
 rows.set(id,record);
 if(pendingBackground&&!record.background)pendingBackgrounds.set(record,{...context,runId:state.runId,seed:state.seed,gameMode:state.mode});
 while(rows.size>DISPLAYED_NEWS_LIMIT)rows.delete(rows.keys().next().value);
}

// The full selector calls this synchronously after rechecking the current
// state. Primary copy, timestamps, recap and insertion order remain immutable.
export function completeDisplayedNewsBackground(state,item,entry,context=newsContext(state)){
 const current=newsContext(state),memory=sessions.get(state);
 if(current.mode!=='simulated'||context.mode!==current.mode||context.pair!==current.pair||context.at!==current.at||!memory||
  memory.runId!==state.runId||memory.seed!==state.seed||memory.mode!==state.mode||memory.at!==current.at)return false;
 const record=memory.pairs.get(current.pair)?.get(displayedId(item,current)),pending=record&&pendingBackgrounds.get(record);
 if(!pending||record.background||pending.runId!==state.runId||pending.seed!==state.seed||pending.gameMode!==state.mode||pending.pair!==current.pair||pending.at>current.at)return false;
 if(item?.background?.contentKind!=='historical_fact'||entry?.id!==item.background.archiveId||!availableNews(entry,current)||!availableNews(entry,pending))return false;
 record.background=pick(item.background,fields);pendingBackgrounds.delete(record);return true;
}

export function displayedNewsItems(state){
 const context=newsContext(state),memory=session(state,context);
 return [...(memory?.pairs.get(context.pair)?.values()||[])].reverse().sort((a,b)=>b.publishedAt-a.publishedAt).map(snapshot);
}
