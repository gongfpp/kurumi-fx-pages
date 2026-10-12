import {encodeSaveRaw} from './save-codec.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
