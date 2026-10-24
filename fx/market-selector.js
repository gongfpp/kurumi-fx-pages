import {MARKETS,activeMarket,marketInfo} from './market-book.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
export function mountMarketSelector({select,name,getState,canInteract,onSelect}){
 const doc=select.ownerDocument||globalThis.document;
 select.replaceChildren(...MARKETS.map(m=>{const option=doc.createElement('option');option.value=m.symbol;option.textContent=m.symbol;return option;}));
 function render(){const s=getState(),m=marketInfo(activeMarket(s));select.value=m.symbol;select.disabled=!canInteract();name.textContent=m.label;for(const o of select.options)o.disabled=!!s.historical&&s.historical.version!==3&&o.value!=='USD/JPY';}
 function change(){const s=getState(),symbol=select.value;if(canInteract()&&symbol!==activeMarket(s)&&MARKETS.some(m=>m.symbol===symbol)&&(!s.historical||s.historical.version===3||symbol==='USD/JPY'))onSelect(symbol);render();}
 select.addEventListener('change',change);render();return {render,dispose(){select.removeEventListener('change',change);}};
}
