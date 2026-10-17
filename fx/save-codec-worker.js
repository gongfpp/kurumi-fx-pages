import {encodeSaveRaw} from './save-codec.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
