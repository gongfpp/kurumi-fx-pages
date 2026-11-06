import {validateHistoricalM15Source} from './historical-m15-source.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
export const MULTI_M15_SCHEMA='historical-multi-m15-reference-v1';
export const M15_REFERENCE_SYMBOLS=Object.freeze(['USD/JPY','AUD/JPY','GBP/JPY']);
const date=at=>new Date(at+32400000).toISOString().slice(0,10);
const freeze=value=>{if(value&&typeof value==='object'){for(const v of Object.values(value))freeze(v);Object.freeze(value);}return value;};
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)))),b=>b.toString(16).padStart(2,'0')).join('');
const partition=(source,bars,d)=>validateHistoricalM15Source({...source,bars,closures:source.closures.filter(c=>c.from>=bars[0].at&&c.to<=bars.at(-1).at+900000),...(source.sourceBars?{sourceBars:source.sourceBars.filter(b=>date(b.at)===d)}:{})});
// Local research transport plus the exact authorized public game package.
export class HistoricalM15ReferenceProvider{
 #sources;#days;#cache=new Map();
 constructor(manifest,sources,days){this.manifest=freeze(manifest);this.#sources=sources;this.#days=days;}
 static async create(raw,{baseURL}={}){
  const url=new URL(baseURL);
  const loopback=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  const publicPath=url.pathname==='/fx/history-data/2014-reference/manifest.json';
  const publicSite=url.origin==='https://fx.gongfpp.icu'&&publicPath||url.origin==='https://gongfpp.github.io'&&url.pathname==='/kurumi-fx-pages/fx/history-data/2014-reference/manifest.json'||loopback&&publicPath;
  const publicPackage=raw?.format==='kurumi-public-m15-reference-v1'&&raw.id==='kurumi-2014-reference-v1'&&raw.publication?.gamePublicationAuthorized===true&&raw.publication?.upstreamRightsVerified===false&&raw.publication?.scope==='kurumi-existing-public-game-2014-reference-20261106'&&publicSite&&!url.search&&!url.hash&&!url.username&&!url.password&&['http:','https:'].includes(url.protocol);
  if(raw?.format==='kurumi-public-m15-reference-v1'&&!publicPackage)throw Error('Authorized M15 game package required');
  if(!['http:','https:'].includes(url.protocol)||!publicPackage&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||url.username||url.password||!publicPackage&&(raw?.format!=='kurumi-local-m15-reference-v1'||raw.rights?.localResearchOnly!==true)||typeof raw.id!=='string'||!raw.id||!Array.isArray(raw.sources)||raw.sources.length!==3)throw Error('Local M15 reference package required');
  const sources=raw.sources.map(validateHistoricalM15Source),pairs=sources.map(s=>s.pair);
  if(new Set(pairs).size!==3||!M15_REFERENCE_SYMBOLS.every(p=>pairs.includes(p))||sources.some(s=>s.provenance.rights?.localOnly!==true||s.priceUnit!=='JPY per '+s.pair.slice(0,3)))throw Error('Local M15 pair/rights/unit mismatch');
  if(publicPackage&&await hash(sources)!=='9c7ff9c468bfb1d7fcf349d00f0d095667e80b02871a708df9e3b576a4a5a9f2')throw Error('M15 public source identity mismatch');
  const days=new Map();
  for(const source of sources)for(const bar of source.bars){const d=date(bar.at);if(!days.has(d))days.set(d,{});const row=days.get(d);(row[source.pair]??=[]).push(bar);}
  const version=await hash(sources),entries=[];
  for(const [d,bars] of [...days].sort(([a],[b])=>a.localeCompare(b))){
   const all=Object.values(bars).flat(),first=Math.min(...all.map(b=>b.at)),last=Math.max(...all.map(b=>b.at+900000));
   entries.push({date:d,sha256:await hash(bars),count:all.length,first,last,gaps:[],pairs:Object.keys(bars)});
  }
  return new HistoricalM15ReferenceProvider({schemaVersion:MULTI_M15_SCHEMA,id:raw.id,version,symbol:'MULTIJPY',symbols:M15_REFERENCE_SYMBOLS,timeZone:'Asia/Tokyo',quoteType:'reference-ohlc',gapThresholdMs:900000,rights:publicPackage?{localResearchOnly:false,gamePublicationAuthorized:true,upstreamRightsVerified:false}:{localResearchOnly:true},source:{sha256:version,url:publicPackage?url.href:'local-research-only'},sources:sources.map(s=>({pair:s.pair,datasetId:s.datasetId,version:s.version,sourceHash:s.provenance.sourceSha256??null,quoteBasis:s.provenance.quoteBasis??'synthetic-fixture',bindingToken:s.bindingToken,rights:s.provenance.rights})),days:entries},sources,days);
 }
 async loadDay(d){
  if(this.#cache.has(d))return this.#cache.get(d);
  const entry=this.manifest.days.find(e=>e.date===d);if(!entry)throw Error('M15 date outside source coverage');
  const sources={},references={};
  for(const source of this.#sources){
   let lo=0,hi=source.bars.length;while(lo<hi){const mid=(lo+hi)>>>1;if(source.bars[mid].at+900000<=entry.first)lo=mid+1;else hi=mid;}
   const prior=source.bars[lo-1];if(prior){
    const d=date(prior.at),bars=this.#days.get(d)[source.pair],day=this.manifest.days.find(e=>e.date===d),binding=partition(source,bars,d).bindingToken;
    references[source.pair]={at:prior.at+900000,price:prior.close,evidence:{pair:source.pair,date:d,dayHash:day.sha256,datasetId:source.datasetId,sourceVersion:source.version,sourceHash:source.provenance.sourceSha256??null,sourceBinding:binding,cursor:(bars.findIndex(b=>b.at===prior.at)+1)*25,barAt:prior.at,step:24,at:prior.at+900000,price:prior.close}};
   }
  }
  for(const source of this.#sources){const bars=this.#days.get(d)[source.pair];if(!bars)continue;
   // Preserve UTC epochs and OHLC values exactly. Partition by game JST date.
   sources[source.pair]=partition(source,bars,d);
  }
  const result=freeze({schemaVersion:MULTI_M15_SCHEMA,datasetId:this.manifest.id,datasetVersion:this.manifest.version,sha256:entry.sha256,date:d,validated:true,sources,references});
  this.#cache.set(d,result);while(this.#cache.size>2)this.#cache.delete(this.#cache.keys().next().value);return result;
 }
 clear(){this.#cache.clear();}
}
