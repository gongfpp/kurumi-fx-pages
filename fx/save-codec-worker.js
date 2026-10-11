import {encodeSaveRaw} from './save-codec.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
