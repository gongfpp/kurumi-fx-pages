import {liquidationMeter,renderLiquidationMeter} from './liquidation-meter.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';

// A presentation-only mirror: the original account meter stays in the document.
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

export function createFloatingRisk({root=document}={}) {
  const win=root.defaultView,panel=root.createElement('aside'),heading=root.createElement('span'),value=root.createElement('p');
  panel.className='floating-risk';panel.hidden=true;panel.style.pointerEvents='none';
  // This duplicates the accessible inline meter, so it must not add live chatter.
  panel.setAttribute('aria-hidden','true');panel.dataset.mode='inline';
  heading.className='floating-risk-heading';heading.textContent='持仓强平距离';
  panel.append(heading,value);root.body.append(panel);
  let active=false,disposed=false,frame=null,signature='',previous=null;
  const listeners=[];
  const listen=(target,type,callback,options)=>{
    target?.addEventListener?.(type,callback,options);
    listeners.push(()=>target?.removeEventListener?.(type,callback,options));
  };
  const hide=()=>{panel.hidden=true;panel.style.visibility='hidden';panel.dataset.mode='inline';};
  const modalOpen=()=>root.documentElement.classList.contains('dialog-active')||root.querySelector('dialog[open]')||
    [...root.querySelectorAll('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]')]
      .some(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true'&&node.getClientRects().length>0);
  function layout(){
    if(disposed)return;
    hide();
    if(!active||root.hidden||modalOpen()||!win?.getComputedStyle)return;
    const visual=win.visualViewport;
    // Pinch zoom / the on-screen keyboard have no dependable blank gutter.
    if(visual&&visual.scale!==1)return;
    const width=Math.min(root.documentElement.clientWidth||win.innerWidth,visual?.width??win.innerWidth);
    const height=Math.min(root.documentElement.clientHeight||win.innerHeight,visual?.height??win.innerHeight);
    if(width<700||height<240)return;
    const viewport={left:visual?.offsetLeft??0,top:visual?.offsetTop??0,width,height};
    try {
      const obstacles=[];
      for(const node of root.querySelectorAll(FLOATING_RISK_OBSTACLES)){
        if(node===panel||panel.contains(node)||!node.getClientRects().length)continue;
        const box=rect(node.getBoundingClientRect());if(!box)return;
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
  for(const type of ['visibilitychange','beforetoggle','toggle','close','focusin','transitionend','animationend'])listen(root,type,invalidate,true);
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
      if(next!==signature){renderLiquidationMeter(value,estimate);signature=next;}
      if(!active){previous=null;hide();return;}
      // Called alongside the existing inline render, never reads or writes state.
      layout();
    },
    refresh:layout,
    destroy(){
      if(disposed)return;disposed=true;hide();
      if(frame!==null)win?.cancelAnimationFrame?.(frame);
      mutations?.disconnect();resize?.disconnect();listeners.forEach(remove=>remove());panel.remove();
    }
  };
}
