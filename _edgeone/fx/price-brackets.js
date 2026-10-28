import {PIP_SIZE} from './market.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
export const CROSSED_DRAFT_MESSAGE='价格已触及或越过待用线，请重画。';
export function resolvePriceBrackets({draft,entry,direction,fallbackStopPips,forceNoStop=false}){
 const result={valid:false,reason:CROSSED_DRAFT_MESSAGE,stopPrice:null,takeProfitPrice:null,ignoredDrawnStop:false};
 if(!Number.isFinite(entry)||entry<=0||![1,-1].includes(direction))return result;
 for(const key of ['upper','lower']){const line=draft?.[key];if(line&&(line.crossed||!Number.isFinite(line.price)||line.price<=0||(key==='upper'?line.price<=entry:line.price>=entry)))return result;}
 const stop=draft?.[direction===1?'lower':'upper'],profit=draft?.[direction===1?'upper':'lower'];
 const fallback=[10,30,50].includes(fallbackStopPips)?entry-direction*fallbackStopPips*PIP_SIZE:null;
 return {...result,valid:true,reason:null,stopPrice:forceNoStop?null:stop?.price??(fallback>0?fallback:null),takeProfitPrice:profit?.price??null,ignoredDrawnStop:!!stop&&forceNoStop};
}
export function priceBracketExit(position,price){
 if(position.priceBracketVersion!==1||!Number.isFinite(price)||price<=0)return null;
 if(Number.isFinite(position.stopPrice)&&(price-position.stopPrice)*position.direction<=0)return 'stop';
 if(Number.isFinite(position.takeProfitPrice)&&(price-position.takeProfitPrice)*position.direction>=0)return 'take-profit';
 return null;
}
export function validPositionPriceBrackets(position){
 if(position.priceBracketVersion===undefined)return position.stopKind===undefined&&position.takeProfitPrice===undefined;
 if(position.priceBracketVersion!==1||!['chart-price','pip','none'].includes(position.stopKind)||position.takeProfitPrice!==null&&(!Number.isFinite(position.takeProfitPrice)||position.takeProfitPrice<=0||(position.takeProfitPrice-position.entry)*position.direction<=0))return false;
 if(position.stopKind==='none')return position.stopPrice===null&&position.stopPips===null;
 if(!Number.isFinite(position.stopPrice)||position.stopPrice<=0||(position.stopPrice-position.entry)*position.direction>=0)return false;
 return position.stopKind==='chart-price'?position.stopPips===null:[10,30,50].includes(position.stopPips);
}
