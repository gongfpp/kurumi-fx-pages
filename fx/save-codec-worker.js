import {encodeSaveRaw} from './save-codec.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
