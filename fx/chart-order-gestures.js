// Mounted on the persistent chart container, independent of SVG replacement.
// pan-y and pinch-zoom stay native; only an established horizontal pan/draw is captured.
export function mountChartOrderGestures({element,getPlot,getDraft=()=>null,getContext=()=>'',onPutLine,onClear,onPan=()=>{},onPreview=()=>{},canInteract=()=>true,now=()=>Date.now(),setTimer=setTimeout,clearTimer=clearTimeout,longPressMs=350,tolerance=8}){
 const doc=element.ownerDocument,win=doc?.defaultView,listeners=[];let active=null,timer=null,suppressClick=false,disposed=false;
 const listen=(node,type,fn,options)=>{node?.addEventListener?.(type,fn,options);listeners.push(()=>node?.removeEventListener?.(type,fn,options));};
 const interactive=target=>target!==element&&!!target?.closest?.('button,a,input,select,textarea,label,[role="button"],[data-chart-order-label],text');
 const inPlot=(p,x,y)=>p&&x>=p.left&&x<=p.right&&y>=p.top&&y<=p.bottom;
 const clearTimerNow=()=>{if(timer!==null)clearTimer(timer);timer=null;};
 const cancel=()=>{clearTimerNow();const gesture=active;active=null;if(gesture){suppressClick=true;gesture.releaseTouch?.();try{element.releasePointerCapture?.(gesture.id);}catch{}}onPreview(null);};
 const ready=()=>!disposed&&canInteract()&&!doc?.hidden;
 const same=()=>active&&active.context===getContext()&&ready();
 const capture=()=>{try{element.setPointerCapture?.(active.id);}catch{}};
 const draw=()=>{timer=null;if(!same()||active.mode!=='pending'){cancel();return;}active.mode='draw';suppressClick=true;capture();onPreview(active.plot.priceAt(active.y));};
 // Touch events keep their original hit target, even after a chart quote or
 // preview replaces the SVG. Listen on that target for this gesture's lifetime:
 // pointer capture redirects PointerEvents, but does not redirect TouchEvents.
 const bindTouchTarget=(gesture,target)=>{
  if(!target?.addEventListener)return;
  const multi=event=>{if(active===gesture&&event.touches?.length>1)cancel();};
  const move=event=>{
   if(active!==gesture)return;if(!same()){cancel();return;}
   if(event.touches?.length>1){cancel();return;}
   if(event.touches?.length===1&&['draw','pan'].includes(gesture.mode))event.preventDefault();
  };
  const cancelled=()=>{if(active===gesture)cancel();};
  target.addEventListener('touchstart',multi,{passive:true});
  target.addEventListener('touchmove',move,{passive:false});
  target.addEventListener('touchcancel',cancelled,{passive:true});
  gesture.releaseTouch=()=>{target.removeEventListener('touchstart',multi);target.removeEventListener('touchmove',move);target.removeEventListener('touchcancel',cancelled);};
 };

 listen(element,'pointerdown',event=>{
  if(active){cancel();return;}if(!ready()||event.button!==0||event.isPrimary===false||interactive(event.target))return;
  const plot=getPlot();if(!inPlot(plot,event.clientX,event.clientY))return;suppressClick=false;
  active={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,at:now(),mode:'pending',context:getContext(),plot,draft:getDraft(),pan:0};
  if(event.pointerType==='touch')bindTouchTarget(active,event.target);
  timer=setTimer(draw,longPressMs);
 });
 listen(element,'pointermove',event=>{
  if(!active||event.pointerId!==active.id)return;if(!same()){cancel();return;}
  const dx=event.clientX-active.startX,dy=event.clientY-active.startY;active.x=event.clientX;active.y=event.clientY;
  if(active.mode==='pending'&&Math.hypot(dx,dy)>tolerance){clearTimerNow();if(Math.abs(dy)>=Math.abs(dx)){cancel();return;}active.mode='pan';suppressClick=true;capture();}
  if(active.mode==='draw'){event.preventDefault?.();onPreview(active.plot.priceAt(Math.max(active.plot.top,Math.min(active.plot.bottom,active.y))));}
  if(active.mode==='pan'){event.preventDefault?.();const steps=Math.trunc(dx/(active.plot.candleWidth||10)),delta=steps-active.pan;if(delta){active.pan=steps;onPan(delta);}}
 },{passive:false});
 listen(element,'pointerup',event=>{
  if(!active||event.pointerId!==active.id)return;if(!same()){cancel();return;}
  const gesture=active;clearTimerNow();active=null;gesture.releaseTouch?.();
  try{element.releasePointerCapture?.(gesture.id);}catch{}
  if(gesture.mode==='draw'){suppressClick=true;const y=Math.max(gesture.plot.top,Math.min(gesture.plot.bottom,event.clientY));onPutLine(gesture.plot.priceAt(y));}
  else if(gesture.mode==='pan'){suppressClick=true;const steps=Math.trunc((event.clientX-gesture.startX)/(gesture.plot.candleWidth||10)),delta=steps-gesture.pan;if(delta)onPan(delta);}
  else if(Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY)<=tolerance&&inPlot(gesture.plot,event.clientX,event.clientY)&&!interactive(event.target)){suppressClick=true;onClear();}
  onPreview(null);
 });
 listen(element,'click',event=>{if(suppressClick){suppressClick=false;event.preventDefault?.();event.stopPropagation?.();}});
 listen(element,'pointercancel',cancel);listen(element,'lostpointercapture',()=>{if(active)cancel();});
 listen(doc,'pointerdown',event=>{if(active&&event.pointerId!==active.id)cancel();},true);
 listen(win,'blur',cancel);listen(win,'resize',cancel);listen(win,'pagehide',cancel);listen(doc,'visibilitychange',()=>{if(doc.hidden)cancel();});
 return {dispose(){disposed=true;cancel();listeners.forEach(remove=>remove());}};
}
