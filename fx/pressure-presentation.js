import {pressureVisual} from './pressure-visuals.js?v=67ec3f8e9248c704ac17a7c1b439280fb0090054-23f2a20b7717';
// Only rendering. This module cannot unlock a control, place an order, or save.
export function pressureMotionPlan(taps,{reduced=false,unlocked=false,target=5}={}){
 const visual=pressureVisual(taps,{reduced,unlocked,target}),pageDisplacement=reduced?0:unlocked?9:taps===0?0:1+Math.floor(visual.intensity*5);
 return{...visual,displacement:reduced?0:unlocked?11:2+8*visual.intensity,pageDisplacement,duration:reduced?0:unlocked?620:160+visual.intensity*130};
}
export function createPressurePresentation({root=document,motion,enabled=()=>true}={}){
 let pageAnimation=null,buttonAnimation=null,timer=null,activeButton=null,disposed=false,layoutRestore=null;
 const win=root.defaultView,media=win?.matchMedia?.('(prefers-reduced-motion: reduce)');
 const blocked=()=>!!root.hidden||!!root.querySelector('dialog[open]');
 const flare=root.createElement('div');flare.className='pressure-page-flare';flare.setAttribute('aria-hidden','true');root.body.append(flare);
 function clear(){pageAnimation?.cancel();buttonAnimation?.cancel();pageAnimation=null;buttonAnimation=null;clearTimeout(timer);layoutRestore?.();layoutRestore=null;activeButton?.classList.remove('pressure-breaking');flare.dataset.active='false';delete root.body.dataset.pressureImpact;}
 // Moving body through its independent layout offset preserves the containing
 // block of fixed overlays. A body transform/translate would relocate those
 // overlays into document coordinates on a scrolled page. Recap owns transform;
 // pressure owns only these short-lived offset animations and restores its styles.
 function acquirePageOffset(){
  const body=root.body,html=root.documentElement,restores=[],hadBodyStyle=body.hasAttribute('style'),hadHtmlStyle=html.hasAttribute('style');
  const own=(node,key,value)=>{const previous=node.style.getPropertyValue(key),priority=node.style.getPropertyPriority(key);node.style.setProperty(key,value);restores.push(()=>{if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key))return;previous?node.style.setProperty(key,previous,priority):node.style.removeProperty(key);});};
  if(!win?.getComputedStyle||win.getComputedStyle(body).position==='static')own(body,'position','relative');
  own(body,'overflow-anchor','none');own(html,'overflow-x','clip');
  layoutRestore=()=>{for(const restore of restores.reverse())restore();if(!hadBodyStyle&&!body.style.length)body.removeAttribute('style');if(!hadHtmlStyle&&!html.style.length)html.removeAttribute('style');};
  const computed=win?.getComputedStyle?.(body);return {left:parseFloat(computed?.left)||0,top:parseFloat(computed?.top)||0};
 }

 const cancelForContext=()=>{if(blocked()||!enabled()||media?.matches)clear();};
 const observer=win?.MutationObserver?new win.MutationObserver(cancelForContext):null;
 observer?.observe(root.body,{subtree:true,attributes:true,attributeFilter:['open']});
 const preferenceObserver=win?.MutationObserver?new win.MutationObserver(cancelForContext):null;
 preferenceObserver?.observe(root.body,{attributes:true,attributeFilter:['class']});media?.addEventListener?.('change',cancelForContext);
 root.addEventListener?.('visibilitychange',cancelForContext);root.addEventListener?.('scroll',clear,true);win?.addEventListener?.('pagehide',clear);

 function play(button,{taps,unlocked=false,target=5}={}){
  if(disposed)return;clear();if(blocked())return;activeButton=button;
  const reduced=!enabled()||!!root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches,plan=pressureMotionPlan(taps,{reduced,unlocked,target});
  button.dataset.pressureStage=plan.stage;
  if(reduced)return plan;
  const x=plan.displacement,page=root.body,p=plan.pageDisplacement;
  buttonAnimation=motion?.animate(button,[{transform:'none'},{transform:`translate(${-x}px,2px) rotate(-1.2deg)`},{transform:`translate(${x}px,-2px) rotate(1.2deg)`},{transform:`translate(${-x*.55}px,1px)`},{transform:'none'}],{duration:plan.duration,easing:'ease-out'});
  if(page&&p>0){const base=acquirePageOffset(),offset=(x,y)=>({left:`${base.left+x}px`,top:`${base.top+y}px`});pageAnimation=motion?.animate(page,[offset(0,0),offset(-p,p*.35),offset(p,-p*.25),offset(-p*.6,0),offset(p*.3,0),offset(0,0)],{duration:plan.duration,easing:'ease-out'});}
  root.body.dataset.pressureImpact=unlocked?'break':plan.stage;flare.dataset.active=String(plan.intensity>=.5);flare.style.setProperty('--pressure-edge',String(.08+plan.intensity*.18));
  if(unlocked)button.classList.add('pressure-breaking');
  timer=setTimeout(clear,unlocked?900:650);
  return plan;
 }
 return{play,clear,dispose(){disposed=true;clear();observer?.disconnect();preferenceObserver?.disconnect();media?.removeEventListener?.('change',cancelForContext);root.removeEventListener?.('visibilitychange',cancelForContext);root.removeEventListener?.('scroll',clear,true);win?.removeEventListener?.('pagehide',clear);flare.remove();}};
}
