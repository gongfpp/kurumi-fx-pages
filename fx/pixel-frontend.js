import {createDOMPortals} from './dom-portals.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

// One presentation over the existing controls. This module never owns a game,
// storage session, network source or quotation clock and has no legacy branch.
export function mountPixelFrontend({document=globalThis.document,onLayout=()=>{},onAvailabilityChange=()=>{},loadPixel=()=>import('./pixel-renderer.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717'),startupTimeoutMs=5000,setTimer=globalThis.setTimeout,clearTimer=globalThis.clearTimeout}={}){
 const boot=document.defaultView?.kurumiPixelBoot;
 document.body.dataset.frontend='pixel';
 const portals=createDOMPortals({document});
 const root=document.createElement('div');root.id='pixel-frontend';root.hidden=true;root.tabIndex=-1;root.setAttribute('role','main');document.body.append(root);
 const retryButton=document.getElementById('pixel-boot-retry');
 let instance=null,pending=null,disposed=false,request=0,timer=null,resolveReady,attempted=false,bootTicket=null;
 const ready=new Promise(resolve=>{resolveReady=resolve;});
 const stats={mounts:0,disposes:0,lastError:null};
 const clearDeadline=()=>{if(timer!==null){clearTimer(timer);timer=null;}};
 const cleanup=()=>{
  const previous=instance;instance=null;root.hidden=true;
  try{previous?.dispose?.();}catch(error){stats.lastError=String(error?.message||error);}
  finally{
   if(previous)stats.disposes++;
   portals.restore();
   try{previous?.afterRestore?.();}catch(error){stats.lastError=String(error?.message||error);}
   root.replaceChildren();
  }
 };
 const installRetry=ticket=>{
  const token=request;
  const restart=()=>{if(disposed||token!==request)return;request++;clearDeadline();pending=null;cleanup();void start();};
  if(ticket)ticket.setRetry(restart);else if(retryButton)retryButton.onclick=restart;
 };
 const fail=(reason,error,ticket=bootTicket)=>{
  cleanup();clearDeadline();pending=null;
  stats.lastError=String(error?.message||error||reason);
  if(ticket)ticket.fail(reason);else boot?.fail(reason);installRetry(ticket);onAvailabilityChange(false);
  return {ok:false,frontend:'pixel',reason};
 };
 function start(){
  if(disposed)return Promise.resolve({ok:false,frontend:'pixel',reason:'disposed'});
  if(instance)return Promise.resolve({ok:true,frontend:'pixel',changed:false});
  if(pending)return pending;
  const token=++request;
  bootTicket=attempted?boot?.retrying?.():boot?.current?.();attempted=true;
  const ticket=bootTicket,valid=()=>!disposed&&token===request&&ticket?.isCurrent?.()!==false;
  installRetry(ticket);
  const promise=(async()=>{
   let candidate;
   try{
    const module=await Promise.resolve().then(loadPixel);
    if(!valid())return {ok:false,frontend:'pixel',reason:'superseded'};
    candidate=module.createPixelRenderer({document});
    if(!candidate||typeof candidate.mount!=='function')throw Error('Pixel renderer is invalid');
   }catch(error){if(!valid())return {ok:false,frontend:'pixel',reason:'superseded'};return fail('renderer-load',error,ticket);}
   try{
    instance=candidate;stats.mounts++;
    candidate.mount({root,portals});root.hidden=false;
    candidate.render?.(Object.freeze({frontend:'pixel',reason:'startup'}));
    onLayout();
   }catch(error){if(!valid())return {ok:false,frontend:'pixel',reason:'superseded'};return fail('renderer-mount',error,ticket);}
   if(!valid()){cleanup();return {ok:false,frontend:'pixel',reason:'superseded'};}
   clearDeadline();pending=null;stats.lastError=null;if(ticket)ticket.finish();else boot?.finish();
   const result={ok:true,frontend:'pixel',changed:true};
   if(resolveReady){resolveReady(result);resolveReady=null;}else onAvailabilityChange(true);
   return result;
  })();
  pending=promise;
  timer=setTimer(()=>{
   if(token!==request||disposed||!pending)return;
   timer=null;
   // Elapsed waiting is not evidence of a failed import. Keep this attempt
   // alive, with an explicit retry/reload exit if it never settles.
   ticket?.slow();
  },startupTimeoutMs);
  return promise;
 }
 boot?.claim();
 void start();
 return {
  ready,retry:start,
  get active(){return !!instance&&!disposed;},
  get diagnostics(){return Object.freeze({...stats,frontend:'pixel',pendingMoves:portals.count,disposed});},
  refresh(){
   if(disposed||!instance)return false;
   try{instance.render?.(Object.freeze({frontend:'pixel',reason:'update'}));return true;}
   catch(error){request++;fail('renderer-update',error);return false;}
  },
  dispose(){
   if(disposed)return;disposed=true;request++;clearDeadline();pending=null;cleanup();root.remove();
   if(bootTicket)bootTicket.setRetry(null);else if(retryButton)retryButton.onclick=null;
   if(resolveReady){resolveReady({ok:false,frontend:'pixel',reason:'disposed'});resolveReady=null;}
  }
 };
}
