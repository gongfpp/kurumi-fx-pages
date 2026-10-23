import {createDeferredModule} from './deferred-module.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {marketNewsWithoutArchive} from './news-market-core.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {mobileNewsItems} from './mobile-news-items.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';

export function createDeferredMarketContent({load=()=>import('./news-content.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717')}={}){
 const source=createDeferredModule(load);
 return {
  load:()=>source.load(),get ready(){return !!source.value;},get error(){return source.error;},
  view:(state,event,options)=>source.value?source.value.marketNewsView(state,event,options):marketNewsWithoutArchive(state,event,options),
  items:(state,event)=>source.value?source.value.mobileNewsItems(state,event):mobileNewsItems(state,event)
 };
}
