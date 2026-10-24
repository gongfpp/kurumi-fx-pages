// Presentation only. Receipts arrive after the existing synchronous game action.
// Nothing here schedules orders, saves, fees, audio, or game time.
export const FEEL=Object.freeze({press:140,result:280,scene:500,dialogIn:160,dialogOut:120,skit:320});
export function createGameFeel({root=document,motion,getContext=()=>'',onClear=()=>{},setTimer=setTimeout,clearTimer=clearTimeout}={}){
 const records=new Map(),win=root.defaultView;let context=getContext(),disposed=false;
 const remove=key=>{const record=records.get(key);if(!record)return;records.delete(key);record.animation?.cancel();clearTimer(record.timer);record.node.remove();};
 const clear=()=>{for(const key of [...records.keys()])remove(key);motion.clear();onClear();};
 const sync=()=>{const next=getContext();if(context!==next){context=next;clear();}return !disposed&&!root.hidden;};
 const cue=(key,anchor,text,{tone='neutral',duration=FEEL.result}={})=>{
  if(!sync()||!anchor?.getBoundingClientRect||anchor.isConnected===false)return;
  remove(key);while(records.size>=4)remove(records.keys().next().value);
  const box=anchor.getBoundingClientRect();if(!box.width||!box.height)return;
  const node=root.createElement('span');node.className='game-feel-cue';node.dataset.tone=tone;node.textContent=text;node.setAttribute('aria-hidden','true');
  node.style.left=Math.max(12,Math.min((win?.innerWidth||1024)-252,box.left))+'px';node.style.top=Math.max(12,Math.min((win?.innerHeight||768)-70,box.bottom+4))+'px';
  (anchor.closest?.('dialog[open]')||root.body).append(node);
  const animation=motion.animate(node,[{opacity:0,transform:'translateY(3px)'},{opacity:1,transform:'none',offset:.2},{opacity:1,transform:'translateY(-3px)',offset:.7},{opacity:0,transform:'translateY(-5px)'}],{duration,fill:'forwards'});
  const record={node,animation,timer:null};records.set(key,record);
  record.timer=setTimer(()=>{if(records.get(key)===record)remove(key);},duration);
 };
 const accent=(target,tone='gain')=>{if(!sync()||!target)return;motion.animate(target,[{outline:`2px solid ${tone==='loss'?'#a03b72':'#177259'}`,outlineOffset:'1px',opacity:.7},{outline:'2px solid transparent',outlineOffset:'3px',opacity:1}],{duration:FEEL.result});};
 const press=button=>{
  if(!sync()||!button||button.disabled||!motion.enabled)return;
  let face=button.querySelector?.('.game-feel-button-face');
  if(!face&&button.childNodes?.length&&[...button.childNodes].every(n=>n.nodeType===3)){
   face=root.createElement('span');face.className='game-feel-button-face';face.textContent=button.textContent;button.replaceChildren(face);
  }
  // The hit box stays still; only the face moves. Complex buttons keep their layout.
  if(face)motion.animate(face,[{transform:'none'},{transform:'translateY(1px) scale(.97)',offset:.3},{transform:'translateY(-.4px) scale(1.01)',offset:.7},{transform:'none'}],{duration:FEEL.press});
  else motion.animate(button,[{filter:'brightness(1)'},{filter:'brightness(.92)',offset:.3},{filter:'brightness(1)'}],{duration:FEEL.press});
 };
 const selector='#long,#short,#half,#close,[data-position-action]';
 const down=e=>{if(e.button!==0)return;press(e.target.closest?.(selector));};
 const key=e=>{if(!e.repeat&&['Enter',' '].includes(e.key))press(e.target.closest?.(selector));};
 const visibility=()=>{if(root.hidden)clear();};
 const closed=e=>{for(const [id,record]of records)if(e.target.contains?.(record.node))remove(id);};
 root.addEventListener?.('pointerdown',down);root.addEventListener?.('keydown',key);root.addEventListener?.('visibilitychange',visibility);root.addEventListener?.('close',closed,true);
 win?.addEventListener?.('pagehide',clear);root.addEventListener?.('scroll',clear,true);
 const present=fn=>(...args)=>{try{return fn(...args);}catch{/* A visual failure cannot turn a committed order into a rejection. */}};
 return {sync,clear,press,accent,
  result:present((anchor,label,tone='gain')=>{cue('receipt',anchor,label,{tone});accent(anchor,tone);}),
  delta:present((anchor,label,tone='gain')=>{cue('money',anchor,label,{tone});}),
  reject:present((anchor,reason)=>{cue('rejection',anchor,reason,{tone:'loss',duration:1600});}),
  item:present((anchor,label)=>{cue('item',anchor,label);accent(anchor);const icon=anchor?.querySelector?.('img,.prop-icon')||anchor?.closest?.('.inventory-card,.inventory-work-item')?.querySelector('.inventory-symbol');if(icon)motion.animate(icon,[{transform:'none'},{transform:'scale(1.08)',offset:.3},{transform:'none'}],{duration:FEEL.result});}),
  dispose(){disposed=true;clear();root.removeEventListener?.('pointerdown',down);root.removeEventListener?.('keydown',key);root.removeEventListener?.('visibilitychange',visibility);root.removeEventListener?.('close',closed,true);win?.removeEventListener?.('pagehide',clear);root.removeEventListener?.('scroll',clear,true);}
 };
}
