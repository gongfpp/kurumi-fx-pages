import {encodeSaveRaw} from './save-codec.js?v=312310b759c9c281ed2d9f234cc9c6ec9eec4de2-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
