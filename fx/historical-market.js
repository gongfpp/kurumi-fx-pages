import {listImportedResearchPackages,inspectResearchPackage} from './research-import.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {RESEARCH_BUILD} from './research-config.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {ResearchProvider} from './research-provider.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {listImportedHistoricalPackages,inspectHistoricalPackage} from './historical-import.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {HistoricalProvider} from './historical-provider.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {bindHistoricalDay,isHistorical} from './historical-replay.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
export class HistoricalMarketLibrary{
 constructor({baseURL=new URL('./',import.meta.url),fetch=globalThis.fetch}={}){this.baseURL=baseURL;this.fetch=(...args)=>fetch(...args);this.datasets=[];this.providers=new Map();}
 async catalog(){
  if(RESEARCH_BUILD){const root=new URL('/admin/research/',this.baseURL);const res=await this.fetch(new URL('months/catalog.json',root),{credentials:'same-origin',cache:'no-store'});if(!res.ok)throw Error('本人研究行情载入失败');const c=await res.json();if(c.format!=='kurumi-private-research-catalog-v1'||c.researchAudience!=='owner-only'||c.mixSources!==false||!Array.isArray(c.entries))throw Error('研究目录不符');this.datasets=c.entries.filter(e=>e.sourceId==='forexite'&&e.precision==='M1-OHLC').map(e=>({id:'research-'+e.sourceId+'-'+e.month,label:e.month+' · Forexite 分钟研究',manifestURL:new URL(e.manifest,root).href,research:true}));if(this.datasets.some(d=>{const u=new URL(d.manifestURL);return u.origin!==root.origin||!u.pathname.startsWith('/admin/research/months/')||u.search||u.hash;}))throw Error('研究来源必须为本人同站月份');return this.datasets;}
  const url=new URL('historical-catalog.json',this.baseURL);let datasets=[];try{const res=await this.fetch(url,{signal:AbortSignal.timeout(15000)});if(res.ok)datasets=(await res.json()).datasets||[];}catch{}
  // Local research data never becomes a public catalog or a production fallback.
  if(['localhost','127.0.0.1','[::1]'].includes(url.hostname))try{const local=await this.fetch(new URL('historical-local/catalog.json',this.baseURL));if(local.ok)datasets=[...datasets,...(await local.json()).datasets];}catch{}
  this.datasets=datasets.map(d=>({...d,manifestURL:new URL(d.manifestURL,this.baseURL).href})).filter(d=>new URL(d.manifestURL).origin===url.origin);
  const imported=await listImportedHistoricalPackages();
  for(const row of imported){const url='local-package:'+encodeURIComponent(row.key);const inspected=await inspectHistoricalPackage(row.file);this.providers.set(url,inspected.provider);this.datasets.push({id:row.key,label:row.label,manifestURL:url,local:true});}
  for(const row of await listImportedResearchPackages()){const url='local-research:'+encodeURIComponent(row.key);const inspected=await inspectResearchPackage(row.file);this.providers.set(url,inspected.provider);this.datasets.push({id:row.key,label:row.label,manifestURL:url,local:true,research:true});}
  return this.datasets;
 }
 async provider(dataset){
  const url=dataset.manifestURL;if(this.providers.has(url))return this.providers.get(url);
  const res=await this.fetch(url,{credentials:dataset.research?'same-origin':'omit',cache:'no-store',redirect:dataset.research?'error':'follow'});if(!res.ok)throw Error('历史行情载入失败，请重试');
  const manifest=await res.json();const provider=dataset.research?new ResearchProvider(manifest,{fetch:this.fetch,baseURL:url}):new HistoricalProvider(manifest,{fetch:this.fetch,baseURL:url});this.providers.set(url,provider);return provider;
 }
 async options(id,date){const dataset=this.datasets.find(d=>d.id===id);if(!dataset)throw Error('暂时没有可用的历史行情');const p=await this.provider(dataset);return{manifest:p.manifest,dayData:await p.loadDay(date),startDate:date,manifestURL:dataset.manifestURL};}
 async restore(state){if(!isHistorical(state))return;const dataset=this.datasets.find(d=>d.manifestURL===state.historical.manifestURL);if(!dataset)throw Error('此存档的历史行情源暂不可用');const p=await this.provider(dataset);bindHistoricalDay(state,p.manifest,await p.loadDay(state.historical.date));}
}
// Pure chronological batching: all intermediate ticks execute, only paint is coalesced.
export function advanceHistoricalBatch(state,step,{speed=1,maxTicks=256,budgetMs=8,now=()=>performance.now()}={}){
 const start=now(),until=state.historical.lastQuote[0]+7500*speed,exits=[];let result=null,count=0,candleClosed=false;
 while(count<maxTicks&&now()-start<budgetMs){
  if(state.marketPaused||state.historical.status!=='ready')break;
  result=step(state);count++;exits.push(...(result.exits||[]));candleClosed ||= !!result.candleClosed;
  if(result.blocked||result.dayEnded||state.historical.lastQuote[0]>=until||!['decision','playing'].includes(state.phase))break;
 }
 return result?{...result,exits,exit:exits[0]||null,candleClosed,batchTicks:count}:null;
}
