import {tradingTrauma,tradingCapitalSafety} from './trading-trauma.js?v=8d7e5c345e325247dcd7f03ea1c7375ec7d6edb5-fc3a14bb1c49';
const narrative=Object.freeze({'father-crisis':'crisis','father-discovery':'tension','father-relief':'relief','living-pressure':'tension','living-relief':'relief'});
export function voiceMixActive(voice,auditions=[]){
 return Boolean(voice?.playing||Array.from(auditions).some(player=>!player.paused&&!player.ended&&!player.error));
}
export function selectBgmScene(state,{sceneCue=null,accountEquity}={}){
 if(narrative[sceneCue])return narrative[sceneCue];
 const trauma=tradingTrauma(state);
 if(trauma.active)return trauma.mood==='numb'?'numb':trauma.mood==='recovering'?'relief':'crisis';
 const report=state.dayReport;
 if(['day_end','resting','ending'].includes(state.phase)&&report?.day===state.day&&Number.isFinite(report.net)){
  if(report.net>0)return report.net>=5000?'gain':'relief';
  if(report.net<0)return tradingCapitalSafety(state,{accountEquity}).principalIntact?'tension':'loss';
  return 'neutral';
 }
 return state.positions?.length||state.position?'focus':'neutral';
}
