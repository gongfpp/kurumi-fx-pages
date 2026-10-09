import {HistoricalProvider,validateHistoricalManifest} from './historical-provider.js?v=90af80d63b506a5a375de960fb3ae606348525b5-23f2a20b7717';
const DB='kurumi-fx:historical-data-v1',STORE='packages',MAX_HEADER=1024*1024,MAX_FILE=512*1024*1024;
function database(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('浏览器无法打开历史行情存储'));});}
async function operation(mode,fn){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),request=fn(tx.objectStore(STORE));let result;request.onsuccess=()=>result=request.result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(Error('历史行情未保存，请检查浏览器空间'));tx.onabort=()=>reject(Error('历史行情保存被中断'));});}finally{db.close();}}
export async function inspectHistoricalPackage(file){
 if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>MAX_FILE)throw Error('数据包大小无效');
 const prefix=new Uint8Array(await file.slice(0,MAX_HEADER).arrayBuffer()),newline=prefix.indexOf(10);if(newline<0)throw Error('数据包头部无效');
 let header;try{header=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(prefix.slice(0,newline)));}catch{throw Error('无法识别这个历史行情数据包');}
 if(header.format!=='kurumi-fx-history-v1')throw Error('请选择 .fxhistory 历史行情数据包');
 const manifest=validateHistoricalManifest(header.manifest),slices=new Map();let offset=newline+1;
 for(const day of manifest.days){slices.set(day.date,[offset,offset+day.bytes]);offset+=day.bytes;}
 if(offset!==file.size)throw Error('数据包不完整');
 const fetch=async url=>{const day=manifest.days.find(d=>new URL(d.url,'https://local.invalid/').href===String(url));if(!day)return new Response(null,{status:404});const [start,end]=slices.get(day.date);return new Response(file.slice(start,end),{status:200});};
 return {manifest,provider:new HistoricalProvider(manifest,{baseURL:'https://local.invalid/',fetch})};
}
export async function importHistoricalPackage(file,{onProgress=()=>{}}={}){
 const {manifest,provider}=await inspectHistoricalPackage(file);
 // Validate one chunk at a time; never parse the whole month or upload the Blob.
 for(const [index,day] of manifest.days.entries()){await provider.loadDay(day.date);onProgress(index+1,manifest.days.length);await new Promise(resolve=>setTimeout(resolve,0));}
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(manifest)));
 const fingerprint=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 const key=manifest.id+'@'+manifest.version+':'+fingerprint;
 await operation('readwrite',store=>store.put({key,id:manifest.id,version:manifest.version,label:`本地数据 · USD/JPY · ${manifest.days[0].date} 至 ${manifest.days.at(-1).date}`,file,manifest}));
 provider.clear();return key;
}
export async function listImportedHistoricalPackages(){try{return await operation('readonly',s=>s.getAll());}catch{return[];}}
