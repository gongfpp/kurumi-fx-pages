import {encodeSaveRaw} from './save-codec.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
