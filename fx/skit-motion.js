import {systemReducedMotion} from './motion-preference.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
// A line actually entering view or selected by the reader. No text/audio/game
// progression is controlled here, and unseen lines are not acknowledged.
export function mountSkitMotion(host,{root=host.ownerDocument}={}){
 const lines=[...(host.querySelectorAll?.('.skit-dialogue-line')||[])];
 if(systemReducedMotion(root)||!lines.some(line=>line.querySelector?.('.skit-dialogue-speech')?.animate))return {dispose(){}};
 const win=root.defaultView,seen=new WeakSet(),dialog=host.closest?.('dialog');let disposed=false,animations=[];
 const clear=()=>{for(const animation of animations)animation.cancel();animations=[];};
 const show=line=>{
  if(disposed||root.hidden||systemReducedMotion(root)||host.isConnected===false||dialog&&!dialog.open||!line||seen.has(line))return;
  seen.add(line);clear();
  for(const target of [line.querySelector?.('.skit-dialogue-avatar'),line.querySelector?.('.skit-dialogue-speech')]){
   const animation=target?.animate?.([{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
   if(animation){animations.push(animation);animation.finished?.catch(()=>{});}
  }
 };
 const observer=win?.IntersectionObserver?new win.IntersectionObserver(entries=>{const visible=entries.find(entry=>entry.isIntersecting&&entry.intersectionRatio>=.6);if(visible)show(visible.target);},{threshold:[.6]}):null;
 for(const line of lines)observer?.observe(line);
 if(!observer){const line=lines.find(line=>{const r=line.getBoundingClientRect?.();return r&&r.width>0&&r.height>0&&r.top>=0&&r.bottom<=(win?.innerHeight||0);});if(line)show(line);}
 const select=e=>{const line=e.target.closest?.('.skit-dialogue-line');if(line&&host.contains(line))show(line);};
 const visibility=()=>{if(root.hidden)clear();};
 const preference=win?.matchMedia?.('(prefers-reduced-motion: reduce)');preference?.addEventListener?.('change',clear);
 const dispose=()=>{if(disposed)return;disposed=true;clear();observer?.disconnect();host.removeEventListener?.('pointerdown',select);host.removeEventListener?.('focusin',select);root.removeEventListener?.('visibilitychange',visibility);win?.removeEventListener?.('pagehide',clear);dialog?.removeEventListener?.('close',dispose);preference?.removeEventListener?.('change',clear);};
 host.addEventListener?.('pointerdown',select);host.addEventListener?.('focusin',select);root.addEventListener?.('visibilitychange',visibility);win?.addEventListener?.('pagehide',clear);dialog?.addEventListener?.('close',dispose);
 return {dispose};
}
