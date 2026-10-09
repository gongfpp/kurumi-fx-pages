import {createPressurePresentation} from './pressure-presentation.js?v=5ea391d39ec5a53cc38a2a8201466b7d2981bd06-23f2a20b7717';
import {pressureTarget,emotionControlState,pressEmotion,pressureStatus,pressureFeedback} from './emotion-pressure.js?v=5ea391d39ec5a53cc38a2a8201466b7d2981bd06-23f2a20b7717';
import {PRESSURE_TOOLTIP,PRESSURE_CRACKS,pressureVisual} from './pressure-visuals.js?v=5ea391d39ec5a53cc38a2a8201466b7d2981bd06-23f2a20b7717';

export function createEmotionControls({root=document,getState,getLimits,getContext,canInteract,onChange,audio,motion,motionEnabled=()=>false}) {
  const buttons=[...root.querySelectorAll('[data-stake],[data-leverage]')];
  const original=new Map(buttons.map(button=>[button,{label:button.getAttribute('aria-label'),title:button.getAttribute('title'),text:button.textContent.trim()}]));
  const panel=root.getElementById('emotion-pressure-panel'),meter=root.getElementById('emotion-pressure-meter'),status=root.getElementById('emotion-pressure-status'),instructions=root.getElementById('emotion-pressure-instructions');
  panel.hidden=true;instructions.textContent=PRESSURE_TOOLTIP;instructions.className='sr-only';status.className='sr-only';root.body.append(instructions,status);
  const tooltip=root.createElement('div');tooltip.id='emotion-pressure-tooltip';tooltip.className='pressure-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;root.body.append(tooltip);
  const decorations=new Map();
  for(const button of buttons){
    const svg=root.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 64');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('pressure-fracture');
    const paths=PRESSURE_CRACKS.map(spec=>{const path=root.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',spec.path);svg.append(path);return {path,at:spec.at};});
    const count=root.createElement('span');count.className='pressure-count';count.setAttribute('aria-hidden','true');count.hidden=true;button.append(svg,count);button.dataset.pressureLabel=original.get(button).text;decorations.set(button,{svg,paths,count});
  }
  const presentation=createPressurePresentation({root,motion,enabled:motionEnabled});
  let animation=null,lastSignature='',lastStateKey='',disposed=false,hintTimer,breakTimer;
  const target=button=>({kind:button.hasAttribute('data-stake')?'stake':'leverage',value:Number(button.dataset.stake??button.dataset.leverage)});
  const classify=button=>emotionControlState({...target(button),limits:getLimits(),hardBlocked:getContext(button).hardBlocked});
  const reduced=()=>!motionEnabled()||!!root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function hideHint(){clearTimeout(hintTimer);tooltip.hidden=true;}
  function showHint(button,text,timeout=2600){
    tooltip.textContent=text;tooltip.hidden=false;
    const box=button.getBoundingClientRect(),width=Math.min(340,(root.defaultView?.innerWidth||root.documentElement.clientWidth)-24);
    tooltip.style.width=width+'px';tooltip.style.left=Math.max(12,Math.min(box.left,(root.defaultView?.innerWidth||root.documentElement.clientWidth)-width-12))+'px';
    const height=tooltip.offsetHeight,viewHeight=root.defaultView?.innerHeight||root.documentElement.clientHeight;
    tooltip.style.top=Math.max(12,box.top>height+16?box.top-height-10:Math.min(viewHeight-height-12,box.bottom+10))+'px';
    clearTimeout(hintTimer);hintTimer=setTimeout(hideHint,timeout);
  }
  function render() {
    const state=getState(),stateKey=`${state.mode}:${state.runId||state.seed}:${state.day}`;
    if(lastStateKey&&lastStateKey!==stateKey){presentation.clear();animation?.cancel();hideHint();clearTimeout(breakTimer);for(const b of buttons)b.classList.remove('pressure-breaking');}
    lastStateKey=stateKey;
    const p=pressureStatus(state),visual=pressureVisual(p.taps,{reduced:reduced(),unlocked:p.extreme,target:p.target||5});
    for(const button of buttons){
      const classification=classify(button),soft=classification==='soft',base=original.get(button),decoration=decorations.get(button);
      button.disabled=classification==='hard';button.classList.toggle('emotion-soft-lock',soft);button.dataset.emotionLock=soft?'soft':'';
      button.dataset.pressureStage=visual.stage;button.style.setProperty('--pressure-progress',String(p.intensity));
      for(const {path,at} of decoration.paths)path.style.opacity=p.intensity*12>=at?'1':'0';
      decoration.count.textContent=`${p.taps}/${p.target||5}`;decoration.count.hidden=!p.taps||(!soft&&!p.extreme)||target(button).value<(target(button).kind==='stake'?.5:50);
      if(soft){
        button.setAttribute('aria-disabled','true');button.setAttribute('aria-describedby','emotion-pressure-instructions emotion-pressure-status');
        button.setAttribute('aria-label',`${base.text}，暂未开放。连续按动仅积累压力，不会开仓`);button.removeAttribute('title');
      }else{
        button.removeAttribute('aria-disabled');button.removeAttribute('aria-describedby');
        for(const [name,value] of [['aria-label',base.label],['title',base.title]])value===null?button.removeAttribute(name):button.setAttribute(name,value);
      }
    }
    panel.hidden=true;meter.max=p.target||5;meter.value=p.taps;meter.setAttribute('aria-valuetext',`${p.taps} / ${p.target||5}`);
    const next=p.extreme?'已突破，再选一次。至少25×，新单不设止损。':p.taps?`突破进度 ${p.taps}/${p.target||5}。${p.direction==='despair'?'绝望':'亢奋'}压力正在积累。`:'连续点击可突破限制。';
    if(status.textContent!==next)status.textContent=next;
    lastSignature=`${stateKey}:${p.taps}:${p.direction}`;
  }
  function onClick(event){
    const button=event.target.closest?.('[data-stake],[data-leverage]');if(!buttons.includes(button)||classify(button)!=='soft')return;
    event.preventDefault();event.stopImmediatePropagation();if(!event.isTrusted||!canInteract()||root.querySelector('dialog[open]'))return;
    const result=pressEmotion(getState(),{...target(button),limits:getLimits(),...getContext(button)});if(!result.accepted)return;
    const feedback=pressureFeedback(result.intensity),visual=pressureVisual(result.taps,{reduced:reduced(),unlocked:result.unlocked,target:result.target});
    audio?.unlock();audio?.effect(result.unlocked?'pressure-break':'pressure-hit',feedback);animation?.cancel();
    onChange(result);render();showHint(button,visual.hint,result.unlocked?3200:2600);
    presentation.play(button,{taps:result.taps,unlocked:result.unlocked,target:result.target});
  }
  function onKey(event){const button=event.target.closest?.('[data-stake],[data-leverage]');if(event.repeat&&buttons.includes(button)&&classify(button)==='soft'&&['Enter',' '].includes(event.key))event.preventDefault();}
  function onHint(event){const button=event.target.closest?.('[data-stake],[data-leverage]');if(button&&buttons.includes(button)&&classify(button)==='soft')showHint(button,pressureVisual(pressureStatus(getState()).taps,{target:pressureStatus(getState()).target||pressureTarget(getState(),{...target(button),limits:getLimits(),...getContext(button)})}).hint,5000);}
  root.addEventListener('click',onClick,true);root.addEventListener('keydown',onKey,true);root.addEventListener('pointerover',onHint);root.addEventListener('focusin',onHint);root.addEventListener('scroll',hideHint,true);
  const interval=setInterval(()=>{if(disposed||root.hidden)return;const state=getState(),p=pressureStatus(state),signature=`${state.mode}:${state.runId||state.seed}:${state.day}:${p.taps}:${p.direction}`;if(signature!==lastSignature){onChange({cooled:true,...p});render();}},500);
  return {render,dispose(){disposed=true;presentation.dispose();clearInterval(interval);clearTimeout(breakTimer);hideHint();animation?.cancel();tooltip.remove();root.removeEventListener('click',onClick,true);root.removeEventListener('keydown',onKey,true);root.removeEventListener('pointerover',onHint);root.removeEventListener('focusin',onHint);root.removeEventListener('scroll',hideHint,true);}};
}
