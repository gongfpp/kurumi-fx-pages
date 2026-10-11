import {encodeSaveRaw} from './save-codec.js?v=65e2635d8030c8021817a92850bb902eaac3e601-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
