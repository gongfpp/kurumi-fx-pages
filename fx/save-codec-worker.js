import {encodeSaveRaw} from './save-codec.js?v=b3055da3d740f3dcd2fbd61cba1846712bfec8b6-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
