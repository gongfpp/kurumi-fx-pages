import {NEWS_2014} from './news-2014.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';

// Display-only archive. Never reads script tracks, changes prices, or predicts quotes.
const byId=new Map(NEWS_2014.map(e=>[e.id,e]));
const CATALYST_LABELS={monetary_policy:'货币政策',employment:'就业数据',growth:'经济增长',inflation:'通胀数据',asset_purchases:'资产购买',liquidity_support:'流动性措施',policy_minutes:'会议纪要',fx_stability:'汇率政策'};
const DIRECTIONS=['up','down','range'],VOLATILITY=['normal','high'];
const validState=s=>s&&DIRECTIONS.includes(s.direction)&&VOLATILITY.includes(s.volatility);
export function observedNewsState(state){
 const candles=(state.candles||[]).filter(c=>!c.historical&&Number.isFinite(c.open)&&c.open>0&&Number.isFinite(c.close)&&c.close>0).slice(-6);
 const prices=candles.length?[candles[0].open,...candles.map(c=>c.close)]:[state.price];
 const first=prices[0],last=prices.at(-1),change=first>0?last/first-1:0;
 const observedRange=candles.flatMap(c=>[c.open,c.close,...[c.high,c.low].filter(v=>Number.isFinite(v)&&v>0)]);
 const range=observedRange.length?observedRange:prices;
 const amplitude=first>0?(Math.max(...range)-Math.min(...range))/first:0;
 return{direction:change>.0003?'up':change<-.0003?'down':'range',volatility:amplitude>=.002?'high':'normal'};
}
export function matchingNews(marketState){
 if(!validState(marketState))return [];
 return NEWS_2014.filter(e=>e.applicableDirections.includes(marketState.direction)&&e.applicableVolatility.includes(marketState.volatility));
}
function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function shuffled(ids,seed){let n=seed>>>0;const result=[...ids];for(let i=result.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
function ensureMemory(state){
 const raw=state.newsArchive;
 if(!raw||raw.version!==1||!Number.isSafeInteger(raw.serial)||raw.serial<0||!raw.bags||typeof raw.bags!=='object'||Array.isArray(raw.bags)||!Array.isArray(raw.recent))state.newsArchive={version:1,serial:0,bags:{},recent:[],active:null};
 const memory=state.newsArchive;
 memory.recent=memory.recent.filter(id=>byId.has(id)).slice(-NEWS_2014.length);
 return memory;
}
export function selectArchiveNews(state,{slot,marketState=observedNewsState(state)}={}){
 if([1,2].includes(state.historical?.version)||!validState(marketState)||typeof slot!=='string')return null;
 const memory=ensureMemory(state),active=memory.active;
 // Cache by triggered display slot, so repaint and reload cannot reroll a headline.
 if(active?.slot===slot&&byId.has(active.id)&&validState(active.marketState)&&matchingNews(active.marketState).some(e=>e.id===active.id))return{entry:byId.get(active.id),marketState:active.marketState};
 const eligible=matchingNews(marketState);if(!eligible.length)return null;
 const key=marketState.direction+':'+marketState.volatility,ids=eligible.map(e=>e.id);
 let bag=Array.isArray(memory.bags[key])?[...new Set(memory.bags[key].filter(id=>ids.includes(id)))]:[];
 if(!bag.length)bag=shuffled(ids,hash(`${state.seed}:${key}:${memory.serial}`));
 // Respect each state's shuffle bag and avoid recent cross-state repeats when possible.
 const recent=memory.recent.slice(-Math.max(1,Math.floor(ids.length/2)));
 let index=bag.findIndex(id=>!recent.includes(id));if(index<0)index=bag.findIndex(id=>id!==memory.recent.at(-1));if(index<0)index=0;
 const [id]=bag.splice(index,1);memory.bags[key]=bag;
 // A cross-state display also consumes that article from all initialized bags.
 // Otherwise switching regimes can leave the just-seen article as a singleton.
 for(const savedKey of Object.keys(memory.bags))if(Array.isArray(memory.bags[savedKey]))memory.bags[savedKey]=memory.bags[savedKey].filter(value=>value!==id);
 memory.serial++;
 memory.recent.push(id);memory.recent=memory.recent.slice(-NEWS_2014.length);
 memory.active={slot,id,marketState:{...marketState}};
 return{entry:byId.get(id),marketState:memory.active.marketState};
}
export function archiveNewsView(state,event,{flash=false}={}){
 if([1,2].includes(state.historical?.version))return event;
 if(event?.swan)return event;
 const beat=Math.min(state.beat,(state.script?.events?.length||1)-1);
 const revealed=flash||state.lastEvent?.beat===beat||state.pending?.beat===beat&&state.pending.flashShown;
 const selected=selectArchiveNews(state,{slot:`${state.day}:${beat}:${revealed?'reveal':'lead'}`});
 if(!selected)return event;
 const {entry,marketState}=selected;
 return{...event,title:entry.title,copy:entry.summary,source:entry.sourceName,time:entry.date,archiveKind:'2014汇市回顾',archiveId:entry.id,sourceUrl:entry.sourceUrl,marketState,archiveTags:`${entry.currencies.join(' / ')} · ${CATALYST_LABELS[entry.catalyst]||entry.catalyst} · ${{up:'上涨',down:'下跌',range:'横盘'}[marketState.direction]} / ${marketState.volatility==='high'?'高波动':'常态波动'}`};
}
