import {historicalSourcePresentation} from './history-continuation.js?v=3e46387a0af3c021f17bee9e9544bf62cd430c32-23f2a20b7717';
// Reuse the existing top label. No new node, popup, confirmation or chart space.
export function renderHistoricalSourceLabel(node,state,{symbol='USD/JPY',onExplain=()=>{}}={}){
 const source=historicalSourcePresentation(state);if(!node)return source;
 if(!source){
  node.removeAttribute('title');node.removeAttribute('role');node.removeAttribute('tabindex');node.removeAttribute('aria-label');node.onclick=null;node.onkeydown=null;node.style.cursor='';return null;
 }
 node.textContent=`${symbol} · ${source.label}`;node.title=source.description;
 node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',`${node.textContent}，点击查看来源说明`);node.style.cursor='help';
 node.onclick=()=>onExplain(source.description);
 node.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onExplain(source.description);}};
 return source;
}
