import {encodeSaveRaw} from './save-codec.js?v=92aaa7e8239f22d516747842f9d9a2ca0292ec1f-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
