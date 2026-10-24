import {safeFailure} from './error-reporting.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';

// Next-batch experience counts only. No amounts, positions, dialogue, input,
// device fingerprint, actual URL, or detailed screen/activity history.
export const EXPERIENCE_PROFILE = 'experience-v1';
export const EXPERIENCE_SOURCES = Object.freeze([
 Object.freeze({origin:'https://gongfpp.github.io',host:'gongfpp.github.io',channel:'github-pages',path:'/kurumi-fx-pages/',entries:Object.freeze(['/kurumi-fx-pages/','/kurumi-fx-pages/index.html','/kurumi-fx-pages/fx.html','/kurumi-fx-pages/fx/','/kurumi-fx-pages/fx/index.html'])}),
 Object.freeze({origin:'https://kurumi-fx.pages.dev',host:'kurumi-fx.pages.dev',channel:'cloudflare-pages',path:'/fx/',entries:Object.freeze(['/','/index.html','/fx.html','/fx/','/fx/index.html'])}),
 Object.freeze({origin:'https://kurumi-fx-pwrkxvmu.edgeone.cool',host:'kurumi-fx-pwrkxvmu.edgeone.cool',channel:'edgeone-pages',path:'/fx/',entries:Object.freeze(['/','/index.html','/fx.html','/fx/','/fx/index.html'])}),
]);
export function experienceSource(location){
 return EXPERIENCE_SOURCES.find(source=>source.origin===location?.origin&&source.entries.includes(location?.pathname))||null;
}
const endings=new Set(['million','walkaway','broke','crisis']);
const exits=new Set(['pagehide','bfcache','run-replaced','explicit-exit']);
export function isFirstExperienceTrade(state,trade){
 const stats=state?.runStatistics;
 return trade?.type==='open'&&trade.positionId==='order-1'&&state.nextOrderId===2&&
  stats?.complete===true&&stats.timelinePartial===false&&stats.executions===1;
}
export function experienceEvent(name,target='',extra={},context={}){
 const run=context.run,day=context.day;
 const scoped=typeof run==='string'&&/^[a-zA-Z0-9_-]{8,80}$/.test(run);
 let detail={},dedupeKey;
 if(name==='visit'){target='';dedupeKey=`experience:visit:${context.session||''}`;}
 else if(name==='day_start'&&target==='run'&&scoped){dedupeKey=`experience:start:${run}`;}
 else if(name==='trade_open'&&scoped&&extra.detail?.firstTrade===true){target='first-trade';dedupeKey=`experience:first-trade:${run}`;}
 else if(name==='day_end'&&target==='day'&&scoped&&Number.isSafeInteger(day)&&day>=1){dedupeKey=`experience:day-end:${run}:${day}`;}
 else if(name==='session_end'){
  target='';detail.reason=exits.has(extra.detail?.reason)?extra.detail.reason:'pagehide';
 }else if(name==='ending_seen'&&scoped&&endings.has(target)){dedupeKey=`experience:ending:${run}`;}
 else if(name==='error'){
  const reason=extra.detail?.reason,status=typeof reason==='string'&&/^http-[1-5]\d\d$/.test(reason)?Number(reason.slice(5)):0;
  const failure=safeFailure(target,extra.detail?.code,status);if(!failure)return null;
  detail={code:failure.detail.code,...(failure.detail.reason?{reason:failure.detail.reason}:{})};dedupeKey=extra.dedupeKey;
 }else return null;
 return {name,target,extra:{detail:{...detail,kind:EXPERIENCE_PROFILE},...(dedupeKey?{dedupeKey}:{})}};
}
// Old queues cannot be relabeled as the narrower consent scope. Even same-name
// old trade/day events lack proof of first trade/new run and must be discarded.
export function restoreExperienceEvent(row){
 if(row?.detail?.kind!==EXPERIENCE_PROFILE)return null;
 const event=experienceEvent(row.name,row.target,{detail:{...row.detail,firstTrade:row.name==='trade_open'&&row.target==='first-trade'}},row);
 if(!event||event.target!==row.target)return null;
 return {...row,screen:'game',activeMs:0,foregroundMs:0,engagedMs:0,
  detail:{...event.extra.detail,...(typeof row.detail.build==='string'&&/^[a-zA-Z0-9_:.-]{0,80}$/.test(row.detail.build)?{build:row.detail.build}:{})}};
}
