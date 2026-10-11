import {encodeSaveRaw} from './save-codec.js?v=4f745316754629a1313e6e17e8974c897bc3bf11-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
