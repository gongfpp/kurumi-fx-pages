import {encodeSaveRaw,inspectSave,SAVE_COMPRESSION_THRESHOLD} from './save-codec.js?v=7295dd97231ffa03bc87b361540e8dbf099adc8a-23f2a20b7717';
let worker=null,nextId=0;const pending=new Map();
function failWorker(){for(const task of pending.values()){clearTimeout(task.timer);task.reject(new Error('Save encoder unavailable'));}pending.clear();worker?.terminate();worker=null;}
export function encodeProgress(currentRaw,previousRaw=null,{replacement=false}={}){
 // Plain small saves preserve existing scheduling and compatibility.
 if(![15,16,17].includes(JSON.parse(currentRaw)?.version)&&!replacement&&currentRaw.length<SAVE_COMPRESSION_THRESHOLD&&!(previousRaw!==null&&inspectSave(previousRaw).compressed))return currentRaw;
 if(typeof globalThis.Worker!=='function')return encodeSaveRaw(currentRaw,previousRaw,{replacement});
 if(!worker){
  const url=new URL('./save-codec-worker.js',import.meta.url);url.search=new URL(import.meta.url).search;
  worker=new Worker(url,{type:'module'});
  worker.onmessage=event=>{const task=pending.get(event.data?.id);if(!task)return;pending.delete(event.data.id);clearTimeout(task.timer);event.data.error?task.reject(new Error('Save encoding failed')):task.resolve(event.data.raw);};
  worker.onerror=failWorker;worker.onmessageerror=failWorker;
 }
 return new Promise((resolve,reject)=>{const id=++nextId;const timer=setTimeout(failWorker,30000);pending.set(id,{resolve,reject,timer});try{worker.postMessage({id,currentRaw,previousRaw,replacement});}catch{failWorker();}});
}
