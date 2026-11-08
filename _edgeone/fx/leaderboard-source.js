import {marketSourceOf} from './live-market-state.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
import {RESEARCH_BUILD} from './research-config.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';

export const LEADERBOARD_MARKET_SOURCES=Object.freeze(['simulated','historical','live']);
const labels=Object.freeze({simulated:'模拟盘',historical:'历史真实',live:'实时真实'});
export const leaderboardSourceLabel=source=>Object.hasOwn(labels,source)?labels[source]:'来源未记录';
const PUBLIC_REFERENCE_HASH='9c7ff9c468bfb1d7fcf349d00f0d095667e80b02871a708df9e3b576a4a5a9f2';
// Only the already published game package can become an ordinary historical
// ranking source. Private research data and local mirrors do not gain access.
export function isPublicM15ReferenceRun(state){
 const h=state?.historical;
 if(RESEARCH_BUILD||h?.version!==5||h.datasetId!=='kurumi-2014-reference-v1'||h.sourceHash!==PUBLIC_REFERENCE_HASH||h.sourceVersion!==PUBLIC_REFERENCE_HASH||h.priceBasis!=='m15-reference-simulated-path')return false;
 try{
  const u=new URL(h.manifestURL);
  return !u.search&&!u.hash&&!u.username&&!u.password&&(
   u.origin==='https://fx.gongfpp.icu'&&u.pathname==='/fx/history-data/2014-reference/manifest.json'||
   u.origin==='https://gongfpp.github.io'&&u.pathname==='/kurumi-fx-pages/fx/history-data/2014-reference/manifest.json');
 }catch{return false;}
}
export const privateHistoricalRankingRun=state=>[2,3,4,5].includes(state?.historical?.version)&&!isPublicM15ReferenceRun(state);
// The public game's category follows its opening data mode, including its
// approved simulated path/continuation. It never claims every quote is real.
export function leaderboardMarketSource(state){
 if(isPublicM15ReferenceRun(state))return 'historical';
 const source=marketSourceOf(state);
 return LEADERBOARD_MARKET_SOURCES.includes(source)?source:null;
}
