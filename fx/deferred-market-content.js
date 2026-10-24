import {createDeferredModule} from './deferred-module.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {marketNewsWithoutArchive} from './news-market-core.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {mobileNewsItems} from './mobile-news-items.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';

export function createDeferredMarketContent({load=()=>import('./news-content.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717')}={}){
 const source=createDeferredModule(load);
 return {
  load:()=>source.load(),get ready(){return !!source.value;},get error(){return source.error;},
  view:(state,event,options)=>source.value?source.value.marketNewsView(state,event,options):marketNewsWithoutArchive(state,event,options),
  items:(state,event)=>source.value?source.value.mobileNewsItems(state,event):mobileNewsItems(state,event)
 };
}
