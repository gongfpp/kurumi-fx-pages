import {tradingExpressionCandidates} from './asset-usage-catalog.js?v=b39a790857a9b07859ddbae35501a27b30daae44-23f2a20b7717';

// Original bytes stay unchanged. These face-only viewports were pixel-reviewed;
// they inherit the full panel's event/direction/account gates, never its dialogue.
// Coordinates are in the source image. No generated portrait fallback is allowed.
export const ORIGINAL_EXPRESSION_CROPS=Object.freeze({
 31:Object.freeze([305,240,260,230]),
 37:Object.freeze([456,218,188,154]),
 54:Object.freeze([387,105,195,166]),
 64:Object.freeze([328,149,240,224]),
 98:Object.freeze([363,173,144,129]),
});
export function selectOriginalTradingExpression(context={}){
 const {maxDisplayWidth,maxDisplayHeight,...facts}=context;
 if([maxDisplayWidth,maxDisplayHeight].some(n=>n!==undefined&&!Number.isFinite(n)))return null;
 if(maxDisplayWidth!==undefined&&maxDisplayWidth<48||maxDisplayHeight!==undefined&&maxDisplayHeight<76)return null;
 const pool=tradingExpressionCandidates(facts).filter(a=>a.source.kind==='original-manga'&&Object.hasOwn(ORIGINAL_EXPRESSION_CROPS,a.source.record));
 if(!pool.length)return null;
 const seed=Number.isSafeInteger(context.seed)?context.seed:0;
 const eligible=pool.filter(a=>{const [,,w,h]=ORIGINAL_EXPRESSION_CROPS[a.source.record],scale=Math.min((maxDisplayWidth??Infinity)/w,((maxDisplayHeight??Infinity)-28)/h);return Math.min(w,h)*scale>=48;});
 if(!eligible.length)return null;
 const asset=eligible[((seed%eligible.length)+eligible.length)%eligible.length];
 return {...asset,hasEmbeddedText:false,textOriginal:null,originalHasEmbeddedText:asset.hasEmbeddedText,expressionCrop:ORIGINAL_EXPRESSION_CROPS[asset.source.record]};
}
