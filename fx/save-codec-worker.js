import {encodeSaveRaw} from './save-codec.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
