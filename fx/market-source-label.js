import {historicalSourcePresentation} from './history-continuation.js?v=d646c2f56c57fd7702f80200246852039ee3cd77-23f2a20b7717';
import {marketSourceOf} from './live-market-state.js?v=d646c2f56c57fd7702f80200246852039ee3cd77-23f2a20b7717';
// Running copy shares the source identity used by the existing top label.
export function marketRunningLabel(state){
 const label=historicalSourcePresentation(state)?.label||({live:'真实行情','shared-replay':'延迟共享回放'}[marketSourceOf(state)]??'模拟行情');
 return `${label} · 运行中`;
}
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
