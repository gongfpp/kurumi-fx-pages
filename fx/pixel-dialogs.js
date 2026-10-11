import {mountPixelReaders} from './pixel-reader.js?v=fde8b066cd90352731088a2dc5be6b259e507266-23f2a20b7717';
import {mountPixelSettlement} from './pixel-settlement.js?v=fde8b066cd90352731088a2dc5be6b259e507266-23f2a20b7717';
import {captureFocus,restoreFocus} from './frontend-host.js?v=fde8b066cd90352731088a2dc5be6b259e507266-23f2a20b7717';

// These views never own a game action, snapshot, clock or save lifecycle.
export function mountPixelDialogs({document=globalThis.document,getSettlement=()=>null}={}){
 const readers=mountPixelReaders({root:document});
 let settlement=null,disposed=false;
 function refreshSettlement(){
  if(disposed)return false;
  const focus=captureFocus(document);
  try{
   const model=document.body.dataset.frontend==='pixel'?getSettlement():null;
   if(!model?.snapshot){settlement?.dispose();settlement=null;return true;}
   settlement||=mountPixelSettlement({root:document});
   settlement.update(model.snapshot,{livingReceipt:model.livingReceipt});return true;
  }finally{restoreFocus(focus,document);}
 }
 return {
  refreshSettlement,
  refreshLayout(){if(disposed)return false;const focus=captureFocus(document);try{readers.refresh();return refreshSettlement();}finally{restoreFocus(focus,document);}},
  dispose(){if(disposed)return;disposed=true;const focus=captureFocus(document);try{settlement?.dispose();settlement=null;readers.dispose();}finally{restoreFocus(focus,document);}}
 };
}
