import {PRESSURE_TAPS,emotionControlState,pressEmotion,pressureStatus,pressureFeedback} from './emotion-pressure.js?v=40fc0ad81f85a291b238bbc6b977a7dba778bb1f';

export function createEmotionControls({root=document,getState,getLimits,getContext,canInteract,onChange,audio,motion,motionEnabled=()=>false}) {
  const buttons=[...root.querySelectorAll('[data-stake],[data-leverage]')];
  const original=new Map(buttons.map(button=>[button,{label:button.getAttribute('aria-label'),title:button.getAttribute('title')} ]));
  const panel=root.getElementById('emotion-pressure-panel'),meter=root.getElementById('emotion-pressure-meter'),status=root.getElementById('emotion-pressure-status');
  let animation=null,lastSignature='',disposed=false;
  const target=button=>({kind:button.hasAttribute('data-stake')?'stake':'leverage',value:Number(button.dataset.stake??button.dataset.leverage)});
  const classify=button=>emotionControlState({...target(button),limits:getLimits(),hardBlocked:getContext(button).hardBlocked});
  const caption=p=>p.direction==='despair'?'极度绝望':'极度亢奋';
  function render() {
    const p=pressureStatus(getState());let hasSoft=false;
    for (const button of buttons) {
      const state=classify(button),soft=state==='soft',base=original.get(button);
      button.disabled=state==='hard';button.classList.toggle('emotion-soft-lock',soft);
      button.dataset.emotionLock=soft?'soft':'';
      if (soft) {
        hasSoft=true;button.setAttribute('aria-disabled','true');button.setAttribute('aria-describedby','emotion-pressure-instructions emotion-pressure-status');
        button.setAttribute('aria-label',`${button.textContent.trim()}，情绪锁定。连续按动积累压力，只解锁选择，不会开仓`);
        button.title='情绪锁定：连续按动积累压力。满格只解锁选择，不会开仓';
      } else {
        button.removeAttribute('aria-disabled');button.removeAttribute('aria-describedby');
        for(const [name,value] of [['aria-label',base.label],['title',base.title]])value===null?button.removeAttribute(name):button.setAttribute(name,value);
      }
    }
    panel.hidden=!hasSoft&&!p.taps;
    panel.dataset.stage=p.extreme?'extreme':p.taps>=8?'rising':p.taps>=4?'building':'steady';
    meter.value=p.taps;meter.setAttribute('aria-valuetext',`${p.taps} / ${PRESSURE_TAPS}${p.direction?'，'+caption(p)+'方向':''}`);
    const next=p.extreme?`${caption(p)} · 12 / 12。高风险选择暂时解锁，请再选一次；至少 25×、不能设置新单止损。停止连点后约 10 秒开始冷却。`
      :p.taps?`${p.taps>=8?'快失去分寸了':p.taps>=4?'越来越上头':'执念开始积累'} · ${caption(p)}方向 · ${p.taps} / ${PRESSURE_TAPS}。满格只解锁，已有持仓不变。`
      :'情绪限制中 · 0 / 12。连续按动灰色风险选项会积累压力。';
    if(status.textContent!==next)status.textContent=next;
    lastSignature=`${p.taps}:${p.direction}`;
  }
  function onClick(event) {
    const button=event.target.closest?.('[data-stake],[data-leverage]');
    if(!buttons.includes(button)||classify(button)!=='soft')return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!event.isTrusted||!canInteract()||root.querySelector('dialog[open]'))return;
    const state=getState(),result=pressEmotion(state,{...target(button),limits:getLimits(),...getContext(button)});
    if(!result.accepted)return;
    const feedback=pressureFeedback(result.intensity);
    audio?.unlock();audio?.effect('click',feedback);
    animation?.cancel();
    const reduced=root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(motionEnabled()&&!reduced){
      const x=feedback.displacement;
      animation=motion?.animate(button,[{transform:'none'},{transform:`translateX(${-x}px)`},{transform:`translateX(${x}px)`},{transform:'none'}],{duration:feedback.duration});
    }
    onChange(result);render();
  }
  function onKey(event) {
    const button=event.target.closest?.('[data-stake],[data-leverage]');
    // One intentional key press counts once; OS auto-repeat is not a gesture.
    if(event.repeat&&buttons.includes(button)&&classify(button)==='soft'&&['Enter',' '].includes(event.key))event.preventDefault();
  }
  root.addEventListener('click',onClick,true);root.addEventListener('keydown',onKey,true);
  const interval=setInterval(()=>{
    if(disposed||root.hidden)return;
    const p=pressureStatus(getState()),signature=`${p.taps}:${p.direction}`;
    if(signature!==lastSignature){onChange({cooled:true,...p});render();}
  },500);
  return {render,dispose(){disposed=true;clearInterval(interval);animation?.cancel();root.removeEventListener('click',onClick,true);root.removeEventListener('keydown',onKey,true);}};
}
