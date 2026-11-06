import {encodeSaveRaw} from './save-codec.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
