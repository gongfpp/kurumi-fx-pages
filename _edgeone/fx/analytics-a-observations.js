import {marketSourceOf} from './live-market-state.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {MARKET_SOURCES} from './analytics-a-contract.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
// Analytics eligibility is deliberately separate from ranking/developer rules:
// normal historical play is included; unreadable taint still fails closed.
export const analyticsRunExcluded=({research=false,tainted}={})=>research||tainted!==false;
export function analyticsMarketSource(state){
 if(!state||!['story','endless'].includes(state.mode))return 'none';
 const source=marketSourceOf(state);return MARKET_SOURCES.includes(source)?source:'unknown';
}
// Observe a manual retry without driving a write or delaying the original UI.
// A superseded ticket needs the existing read-only durable barrier, not a guess.
export async function observeManualSave({saved,session,isCurrent,report}){
 const current=()=>{try{return isCurrent();}catch{return false;}};
 const notify=(...args)=>{try{report(...args);}catch{}};
 try{
  let confirmed=saved===true;
  if(!confirmed&&session?.status==='pending')confirmed=await session.whenSettled();
  if(!current())return false;
  notify('save',confirmed?'success':'failure',confirmed?'none':'storage');return confirmed;
 }catch{if(current())notify('save','failure','storage');return false;}
}
