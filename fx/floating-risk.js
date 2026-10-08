import {closeAllModalOpen} from './close-all-control.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';
import {liquidationMeter,renderLiquidationMeter} from './liquidation-meter.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';

// The account meter stays in the document; optional close uses a shared action gate.
// Block complete trading panels as well as controls, so click-through is only a
// second safeguard, never a reason to draw on top of a button or a position.
export const FLOATING_RISK_OBSTACLES=[
  'body > :not(main):not(dialog):not(.floating-risk)',
  'main > :not(.game-grid)', '.game-grid > *',
  '#position-card', '.trade-card', '[data-floating-risk-avoid]',
  'button', 'a[href]', 'input', 'select', 'textarea', 'summary', 'label',
  '[role="button"]', '[role="link"]', '[tabindex]', '[onclick]', '[contenteditable="true"]'
].join(',');

const rect=value=>{
  if(!value)return null;
  const left=value.left??value.x,top=value.top??value.y;
  const right=value.right??left+value.width,bottom=value.bottom??top+value.height;
  if(![left,top,right,bottom].every(Number.isFinite)||right<left||bottom<top)return null;
  return {left,top,right,bottom,width:right-left,height:bottom-top};
};
const overlaps=(a,b,gap=0)=>a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;
const contains=(a,b)=>a.left<=b.left&&a.right>=b.right&&a.top<=b.top&&a.bottom>=b.bottom;

// Pure geometry, in layout-viewport CSS pixels (including visual viewport offsets).
// Null means the inline meter is the only safe location; never force a placement.
export function findFloatingRiskPlacement({viewport,width,height,obstacles=[],gap=12,previous=null}={}) {
  const view=rect(viewport);
  if(!view||![width,height,gap].every(Number.isFinite)||width<=0||height<=0||gap<0)return null;
  const area=rect({left:view.left+gap,top:view.top+gap,right:view.right-gap,bottom:view.bottom-gap});
  if(!area||width>area.width||height>area.height)return null;
  let blocked=[];
  for(const value of obstacles){
    const box=rect(value);if(!box)return null;
    if(box.width>0&&box.height>0&&overlaps(box,view,gap))blocked.push(box);
  }
  // Buttons inside an already protected card do not add candidate boundaries.
  blocked=blocked.filter((box,index)=>!blocked.some((other,i)=>i!==index&&contains(other,box)&&(!contains(box,other)||i<index)));
  const candidate=(left,top)=>rect({left,top,width,height});
  const safe=box=>box&&contains(area,box)&&!blocked.some(other=>overlaps(box,other,gap));
  if(previous&&safe(candidate(previous.left,previous.top)))return candidate(previous.left,previous.top);
  const xs=new Set([area.right-width,area.left]),ys=new Set([area.bottom-height,area.top]);
  for(const box of blocked){xs.add(box.right+gap);xs.add(box.left-gap-width);ys.add(box.bottom+gap);ys.add(box.top-gap-height);}
  // Prefer a low, stable corner. Obstacle edges also find interior blank columns.
  const lefts=[...xs].filter(x=>x>=area.left&&x+width<=area.right).sort((a,b)=>b-a);
  const tops=[...ys].filter(y=>y>=area.top&&y+height<=area.bottom).sort((a,b)=>b-a);
  for(const top of tops)for(const left of lefts){const box=candidate(left,top);if(safe(box))return box;}
  return null;
}

export function createFloatingRisk({root=document,closeControl=null}={}) {
  const win=root.defaultView,panel=root.createElement('aside'),heading=root.createElement('span'),value=root.createElement('p');
  panel.className='floating-risk';panel.hidden=true;panel.style.pointerEvents='none';
  // Duplicate meter text stays silent; the optional native button is accessible.
  if(!closeControl)panel.setAttribute('aria-hidden','true');
  else {panel.setAttribute('aria-label','持仓强平风险');heading.setAttribute('aria-hidden','true');value.setAttribute('aria-hidden','true');}
  panel.dataset.mode='inline';
  heading.className='floating-risk-heading';heading.textContent='持仓强平距离';
  panel.append(heading,value);root.body.append(panel);
  let unbindClose=null;
  if(closeControl){
    const button=root.createElement('button');button.type='button';button.className='floating-risk-close';
    button.textContent='提前全部平仓';button.setAttribute('aria-label','按当前报价提前平掉全部持仓');
    button.title='按当前报价平掉全部持仓，成交结果与仓位区全部平仓相同';
    panel.append(button);
    unbindClose=closeControl.bind(button,{canInteract:()=>!disposed&&active&&!panel.hidden&&panel.dataset.mode==='floating'&&!root.hidden&&!closeAllModalOpen(root)});
  }
  let active=false,disposed=false,frame=null,signature='',previous=null;
  const listeners=[];
  const listen=(target,type,callback,options)=>{
    target?.addEventListener?.(type,callback,options);
    listeners.push(()=>target?.removeEventListener?.(type,callback,options));
  };
  const hide=()=>{panel.hidden=true;panel.style.visibility='hidden';panel.dataset.mode='inline';};
  function layout(){
    if(disposed)return;
    closeControl?.refresh();
    if(!active||root.hidden||closeAllModalOpen(root)||!win?.getComputedStyle){hide();return;}
    const visual=win.visualViewport;
    // Pinch zoom / the on-screen keyboard have no dependable blank gutter.
    if(visual&&visual.scale!==1){hide();return;}
    const width=Math.min(root.documentElement.clientWidth||win.innerWidth,visual?.width??win.innerWidth);
    const height=Math.min(root.documentElement.clientHeight||win.innerHeight,visual?.height??win.innerHeight);
    if(width<700||height<240){hide();return;}
    const viewport={left:visual?.offsetLeft??0,top:visual?.offsetTop??0,width,height};
    try {
      const obstacles=[];
      for(const node of root.querySelectorAll(FLOATING_RISK_OBSTACLES)){
        if(node===panel||panel.contains(node)||!node.getClientRects().length)continue;
        const box=rect(node.getBoundingClientRect());if(!box){hide();return;}
        obstacles.push(box);
      }
      panel.hidden=false;panel.style.left=`${viewport.left+12}px`;panel.style.top=`${viewport.top+12}px`;
      // A missing stylesheet must fall back to inline rather than affect layout.
      const style=win.getComputedStyle(panel);
      if(style.position!=='fixed'||style.pointerEvents!=='none'){hide();return;}
      const insets=['Top','Right','Bottom','Left'].map(side=>parseFloat(style[`margin${side}`])||0);
      const safeViewport={left:viewport.left+insets[3],top:viewport.top+insets[0],width:width-insets[1]-insets[3],height:height-insets[0]-insets[2]};
      let placement=null;
      for(const panelWidth of [248,216]){
        panel.style.width=`${panelWidth}px`;
        const size=panel.getBoundingClientRect();
        placement=findFloatingRiskPlacement({viewport:safeViewport,width:size.width,height:size.height,obstacles,previous});
        if(placement)break;
      }
      if(!placement){hide();previous=null;return;}
      // CSS margins reserve safe-area insets; subtract them from the fixed origin.
      panel.style.left=`${placement.left-insets[3]}px`;panel.style.top=`${placement.top-insets[0]}px`;
      previous=placement;panel.style.visibility='visible';panel.dataset.mode='floating';
    }catch{hide();previous=null;}
  }
  function invalidate(){
    hide();
    if(disposed||frame!==null||!win?.requestAnimationFrame)return;
    frame=win.requestAnimationFrame(()=>{frame=null;layout();});
  }
  // Geometry is rechecked before another paint after scrolling or DOM changes.
  for(const type of ['scroll','resize','orientationchange'])listen(win,type,invalidate,{passive:true});
  listen(root,'scroll',invalidate,{capture:true,passive:true});
  for(const type of ['visibilitychange','beforetoggle','toggle','close','transitionend','animationend'])listen(root,type,invalidate,true);
  // A focus event must not transiently hide its own button and discard focus.
  listen(root,'focusin',layout,true);
  listen(win?.visualViewport,'resize',invalidate,{passive:true});
  listen(win?.visualViewport,'scroll',invalidate,{passive:true});
  listen(root.fonts,'loadingdone',invalidate);
  const mutations=win?.MutationObserver?new win.MutationObserver(records=>{
    // Market renders can happen every frame. Revalidate inside this microtask
    // so repeated quote updates cannot keep the mirror hidden until a quiet frame.
    if(records.some(record=>!panel.contains(record.target)))layout();
  }):null;
  mutations?.observe(root.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,
    attributeFilter:['open','hidden','class','style','aria-hidden','aria-modal','role','tabindex','disabled']});
  const resize=win?.ResizeObserver?new win.ResizeObserver(invalidate):null;
  for(const node of [root.documentElement,root.body,...root.querySelectorAll('main, .game-grid > *')])resize?.observe(node);
  return {
    element:panel,
    update(estimate){
      if(disposed)return;
      const view=liquidationMeter(estimate);active=!view.hidden;
      const next=JSON.stringify(view);
      if(next!==signature){renderLiquidationMeter(value,estimate,{showBar:false});signature=next;}
      if(!active){previous=null;hide();return;}
      // Rendering stays read-only; only the native close click requests a transaction.
      layout();
    },
    refresh:layout,
    destroy(){
      if(disposed)return;disposed=true;hide();
      if(frame!==null)win?.cancelAnimationFrame?.(frame);
      mutations?.disconnect();resize?.disconnect();listeners.forEach(remove=>remove());unbindClose?.();panel.remove();
    }
  };
}
