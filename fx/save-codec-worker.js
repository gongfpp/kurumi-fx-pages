import {encodeSaveRaw} from './save-codec.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
self.onmessage=event=>{
 const {id,currentRaw,previousRaw,replacement}=event.data;
 try{self.postMessage({id,raw:encodeSaveRaw(currentRaw,previousRaw,{replacement})});}
 catch{self.postMessage({id,error:'encoding'});}
};
