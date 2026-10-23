import {createDeferredModule} from './deferred-module.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
import {marketNewsWithoutArchive} from './news-market-core.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
import {mobileNewsItems} from './mobile-news-items.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';

export function createDeferredMarketContent({load=()=>import('./news-content.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717')}={}){
 const source=createDeferredModule(load);
 return {
  load:()=>source.load(),get ready(){return !!source.value;},get error(){return source.error;},
  view:(state,event,options)=>source.value?source.value.marketNewsView(state,event,options):marketNewsWithoutArchive(state,event,options),
  items:(state,event)=>source.value?source.value.mobileNewsItems(state,event):mobileNewsItems(state,event)
 };
}
