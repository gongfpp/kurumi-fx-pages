import {encodeSaveRaw} from './save-codec.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
