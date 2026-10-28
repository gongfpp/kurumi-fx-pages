// Drafts contain only user prices and already consumed quote evidence.
const empty=Object.freeze({upper:null,lower:null,revision:0});
const positive=n=>Number.isFinite(n)&&n>0;
export const chartDraftIdentity=state=>String(state.runId??`seed:${state.seed}:${state.mode}`);
export function putDraftLine(draft,{price,referencePrice,quoteAt}){
 if(!positive(price)||!positive(referencePrice)||price===referencePrice||!Number.isFinite(quoteAt))return draft??empty;
 const previous=draft??empty,key=price>referencePrice?'upper':'lower',side=key==='upper'?'above':'below';
 return {...previous,[key]:{price,side,referencePrice,quoteAt,crossed:false},revision:(previous.revision||0)+1};
}
export function observeDraftQuote(draft,{price,quoteAt}){
 if(!draft||!positive(price)||!Number.isFinite(quoteAt))return draft??empty;
 let next=draft;
 for(const key of ['upper','lower']){const line=draft[key];if(!line||line.crossed||quoteAt<line.quoteAt)continue;
  if(key==='upper'?price>=line.price:price<=line.price){if(next===draft)next={...draft,revision:(draft.revision||0)+1};next[key]={...line,crossed:true};}
 }
 return next;
}
export function clearDraft(draft){return !draft?.upper&&!draft?.lower?draft??empty:{upper:null,lower:null,revision:(draft.revision||0)+1};}
export function draftForContext(state,{sourceFamily,symbol}){
 const store=state.chartOrderDrafts;
 return store?.version===1&&store.runId===chartDraftIdentity(state)&&store.mode===state.mode&&store.sourceFamily===sourceFamily?store.bySymbol[symbol]??empty:empty;
}
export function saveDraftForContext(state,context,draft){
 const previous=draftForContext(state,context);if(previous===draft)return false;
 const store=state.chartOrderDrafts,matching=store?.runId===chartDraftIdentity(state)&&store.mode===state.mode&&store.sourceFamily===context.sourceFamily;
 state.chartOrderDrafts={version:1,runId:chartDraftIdentity(state),mode:state.mode,sourceFamily:context.sourceFamily,revision:(matching?store.revision:0)+1,bySymbol:{...(matching?store.bySymbol:{}),[context.symbol]:draft}};return true;
}
export function validChartOrderDrafts(state,sourceFamily){
 const store=state.chartOrderDrafts;if(store===undefined)return true;
 if(!store||store.version!==1||store.runId!==chartDraftIdentity(state)||store.mode!==state.mode||store.sourceFamily!==sourceFamily||!Number.isSafeInteger(store.revision)||store.revision<1||!store.bySymbol||typeof store.bySymbol!=='object'||Array.isArray(store.bySymbol)||Object.keys(store.bySymbol).length>3)return false;
 return Object.entries(store.bySymbol).every(([symbol,draft])=>['USD/JPY','AUD/JPY','GBP/JPY'].includes(symbol)&&draft&&Number.isSafeInteger(draft.revision)&&draft.revision>=0&&['upper','lower'].every(key=>{
  const line=draft[key];return line===null||!!line&&positive(line.price)&&positive(line.referencePrice)&&Number.isFinite(line.quoteAt)&&typeof line.crossed==='boolean'&&line.side===(key==='upper'?'above':'below')&&(key==='upper'?line.price>line.referencePrice:line.price<line.referencePrice);
 }));
}
export function draftPriceBrackets(draft,symbol){return draft?.upper||draft?.lower?{version:1,symbol,lowerPrice:draft.lower?.price??null,upperPrice:draft.upper?.price??null}:null;}
