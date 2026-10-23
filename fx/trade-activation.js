// One intentional activation, with no trading cooldown or clock changes.
export const repeatedTradeClick=event=>event.defaultPrevented||event.detail>1;
export function suppressTradeKeyRepeat(event){
 if(event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();return true;}
 return false;
}
export function bindTradeActivation(button,action,{getToken=()=>'',canInteract=()=>true}={}){
 let armed,pending=false,disposed=false;
 const down=event=>{if(event.button===0)armed=getToken();};
 const key=event=>{if(!['Enter',' '].includes(event.key))return;armed=suppressTradeKeyRepeat(event)?null:getToken();};
 const cancel=()=>{armed=null;};
 const click=event=>{
  const token=armed===undefined?getToken():armed;armed=undefined;
  if(disposed||pending||button.disabled||repeatedTradeClick(event)||!canInteract()||token===null||token!==getToken())return;
  pending=true;try{action(event);}finally{queueMicrotask(()=>{pending=false;});}
 };
 for(const [type,fn]of [['pointerdown',down],['keydown',key],['pointercancel',cancel],['click',click]])button.addEventListener(type,fn);
 return()=>{disposed=true;for(const [type,fn]of [['pointerdown',down],['keydown',key],['pointercancel',cancel],['click',click]])button.removeEventListener(type,fn);};
}
