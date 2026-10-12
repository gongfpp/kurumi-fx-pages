import {createFrontendHost} from './frontend-host.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';

// Loaded once by the original application after its controls and chart exist.
// Loading the optional skin is isolated: failure leaves the original UI usable.
export function mountFrontendSwitcher({document=globalThis.document,onLayout=()=>{},loadPixel=()=>import('./pixel-renderer.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717')}={}){
 const nav=document.getElementById('frontend-switch');
 if(!nav)return null;
 const status=document.getElementById('frontend-switch-status');
 const host=createFrontendHost({document,onLayout,renderers:{pixel:async()=>{
  const module=await loadPixel();return module.createPixelRenderer({document});
 }}});
 let request=0;
 const sync=()=>{
  for(const button of nav.querySelectorAll('[data-frontend-target]'))button.setAttribute('aria-pressed',String(button.dataset.frontendTarget===host.active));
 };
 async function select(id){
  const token=++request;nav.setAttribute('aria-busy','true');
  const result=await host.switchTo(id);if(token!==request)return result;
  nav.removeAttribute('aria-busy');sync();
  if(status)status.textContent=result.ok?'':result.reason==='superseded'?'':'界面未能切换，可以继续使用当前界面。';
  return result;
 }
 const click=event=>{const button=event.target.closest('[data-frontend-target]');if(button&&nav.contains(button))void select(button.dataset.frontendTarget);};
 nav.addEventListener('click',click);sync();
 // The approved default is pixel; an explicit legacy entry still selects only
 // presentation, never a mode or save slot. A load error retains the old UI.
 let requested;try{requested=new URL(document.defaultView.location.href).searchParams.get('frontend');}catch{}
 if(requested!=='legacy')void select('pixel');
 return {host,select,refresh(){const ok=host.refresh();sync();if(!ok&&status)status.textContent='界面显示中断，已切回原版。';return ok;},dispose(){request++;nav.removeEventListener('click',click);host.dispose();}};
}
