export function clampOrderAmount(value,cap){
  if(!Number.isFinite(cap)||cap<100)return 0;
  if(!Number.isFinite(value))return NaN;
  return Math.max(100,Math.min(cap,Math.round(value*100)/100));
}
export function sliderOrderAmount(value,cap){
  return clampOrderAmount(value>=cap?cap:Math.round(value/100)*100,cap);
}
// Whole hundreds are easy to read; fees and psychological limits are in cap.
export function randomOrderAmount(cap,random=Math.random){
  if(!Number.isFinite(cap)||cap<100)return 0;
  const count=Math.floor(cap/100),roll=Math.max(0,Math.min(1-Number.EPSILON,random()));
  return (1+Math.floor(roll*count))*100;
}

export const ORDER_RATIOS=Object.freeze([.1,.25,.5,1]);
export function normalizeOrderAmount(value){
 if(!Number.isFinite(value)||value<0||!Number.isSafeInteger(Math.round(value*100)))return NaN;
 return Math.round(value*100)/100;
}
export function draftOrderAmount(state,fallback=10000){const value=normalizeOrderAmount(state?.orderDraftAmount);return Number.isFinite(value)?value:fallback;}
export function orderAmountRatio(amount,availableMargin){
 return Number.isFinite(amount)&&amount>=0&&Number.isFinite(availableMargin)&&availableMargin>0?amount/availableMargin:null;
}
// Highlight only. This function never changes the amount or silently snaps it.
// An exact tie prefers the lower ratio, independent of input array order.
export function nearestOrderRatio(amount,availableMargin,{ratios=ORDER_RATIOS,tolerance=.03}={}){
 const actual=orderAmountRatio(amount,availableMargin);if(actual===null||!Number.isFinite(tolerance)||tolerance<0)return null;
 let winner=null,distance=Infinity;
 for(const ratio of [...new Set(ratios)].filter(value=>Number.isFinite(value)&&value>0&&value<=1).sort((a,b)=>a-b)){
  const diff=Math.abs(actual-ratio);if(diff<distance-1e-12){winner=ratio;distance=diff;}
 }
 return distance<=tolerance+1e-12?winner:null;
}
export function ratioOrderAmount(ratio,availableMargin,cap){
 if(!ORDER_RATIOS.includes(ratio)||!Number.isFinite(availableMargin)||availableMargin<=0||!Number.isFinite(cap)||cap<100)return 0;
 return normalizeOrderAmount(Math.min(cap,availableMargin*ratio));
}
