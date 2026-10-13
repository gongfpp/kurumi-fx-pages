import {encodeSaveRaw} from './save-codec.js?v=e0f3cc62baa3b2ee57b32a2c4d590e858d72a749-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
