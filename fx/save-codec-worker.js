import {encodeSaveRaw} from './save-codec.js?v=5ffe4858d3c5ee4ea910ecf96c1477745bc1b782-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
