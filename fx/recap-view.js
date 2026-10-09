import {createRecapStageChart} from './recap-stage-chart.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {setImage} from './assets.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {candlePlot,createChartViewport,spacedTimeTicks} from './chart-viewport.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {recapPresentation} from './recap-presentation.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {buildCurveScale} from './share-card.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {recapChoices} from './daily-recap.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {createRecapPlayer} from './recap-player.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=7fd8cf8f1b94a0ba94cf7477cd37c1a5ede993c9-23f2a20b7717';
const money=n=>(n<0?'−':'')+'¥'+Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
const signed=n=>(n>0?'+':'')+money(n);
const pct=n=>n===null?'—':(n>0?'+':'')+(n*100).toFixed(2)+'%';
const el=(doc,tag,cls,text)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const svgEl=(doc,tag,attrs={})=>{const e=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
export function drawRecapCurve(doc,points,{label='资金曲线',partial=false,basis=null}={}){
 const chart=svgEl(doc,'svg',{viewBox:'0 0 620 215',role:'img','aria-label':label+'；纵轴日元，横轴游戏交易时间 JST'}),left=92,right=600,top=20,bottom=166;
 const series=points.filter(p=>Number.isFinite(p.nominalAssets)),values=series.flatMap(p=>[p.nominalAssets,...(basis!=='trading'&&Number.isFinite(p.netAssets)?[p.netAssets]:[])]),scale=buildCurveScale(values);
 const start=series[0]?.timestamp||0,range=Math.max(1,(series.at(-1)?.timestamp||start)-start),x=p=>left+(p.timestamp-start)/range*(right-left),y=v=>bottom-(v-scale.min)/(scale.max-scale.min)*(bottom-top);
 for(const value of scale.ticks){const Y=y(value),line=svgEl(doc,'line',{x1:left,x2:right,y1:Y,y2:Y,stroke:'#ddcbd7','stroke-dasharray':'3 4'});chart.append(line);const text=svgEl(doc,'text',{x:left-7,y:Y+4,'text-anchor':'end','font-size':11,fill:'#755e70'});text.textContent=money(value);chart.append(text);}
 for(const [key,color,dash]of (basis==='trading'?[['nominalAssets','#be417c','']]:[['nominalAssets','#be417c',''],['netAssets','#326c84','5 4']])){const ps=series.filter(p=>Number.isFinite(p[key]));if(ps.length){const line=svgEl(doc,'polyline',{points:ps.map(p=>`${x(p)},${y(p[key])}`).join(' '),fill:'none',stroke:color,'stroke-width':2.5,'stroke-dasharray':dash});chart.append(line);}}
 for(const p of series){const dot=svgEl(doc,'circle',{cx:x(p),cy:y(p.nominalAssets),r:4,fill:'#be417c',tabindex:0}),title=svgEl(doc,'title');title.textContent=`${formatTradingTime(p.timestamp,{full:true})}；${basis==='trading'?'交易资产':'账户总资产'} ${money(p.nominalAssets)}${basis!=='trading'&&Number.isFinite(p.netAssets)?'；扣债净资产 '+money(p.netAssets):''}`;dot.setAttribute('aria-label',title.textContent);dot.append(title);chart.append(dot);}
 for(const t of spacedTimeTicks(series,x,{maxTicks:4,gap:90})){const text=svgEl(doc,'text',{x:x(t),y:188,'text-anchor':t.index===0?'start':t.index===series.length-1?'end':'middle','font-size':11,fill:'#755e70'});text.textContent=t.label;chart.append(text);}
 const caption=svgEl(doc,'text',{x:left,y:210,'font-size':11,fill:'#755e70'});caption.textContent=partial?'部分历史未记录，仅展示已知点；连线不代表完整盘中路径':basis==='trading'?'交易资产 · 日元 / JST':'账户总资产（粉） / 净资产（蓝虚线） · 日元 / JST';chart.append(caption);return chart;
}
function candleReplay(doc,candles,averages=[]){
 const box=el(doc,'div','recap-candles');if(!candles.length){box.textContent='今天未生成 K 线，按实际早收结果结算。';return{root:box,update(){}};}
 const plot=el(doc,'div','recap-candle-plot'),notice=el(doc,'p','candle-view-notice'),maLegend=el(doc,'div','recap-ma-legend'),active=new Set(averages.map(a=>a.period));let visibleCount=Infinity;
 const viewport=createChartViewport(doc,{count:0,onChange:()=>draw()});
 function draw(){viewport.update(candles.length);const view=candlePlot(candles,averages.filter(a=>active.has(a.period)).map(a=>({...a,color:({5:'#92630d',10:'#137488',20:'#8054ac'})[a.period]||a.color})),{...viewport.state,dark:false,id:'recap',visibleCount});plot.innerHTML=view.html;plot.style.height=viewport.state.height+'px';notice.textContent=view.notice;}
 for(const average of averages){const button=el(doc,'button','',`MA${average.period} ${average.latest===null?'—':average.latest.toFixed(3)}`);button.type='button';button.setAttribute('aria-pressed','true');button.onclick=()=>{if(active.has(average.period))active.delete(average.period);else active.add(average.period);button.setAttribute('aria-pressed',String(active.has(average.period)));draw();};maLegend.append(button);}
 box.append(maLegend,viewport.root,plot,notice);draw();return{root:box,update(count){visibleCount=count;for(const c of plot.querySelectorAll('[data-recap-candle]'))c.style.opacity=Number(c.dataset.recapCandle)<count?'1':'.12';}};
}
export function mountDailyRecap(container,snapshot,{motion=true,replayMotion=motion,reducedMotion=false,onSound=()=>{},onTimeline,onChoice=()=>{},cash=0,loanUnlocked=false,loanTerms=null,usedChoices=[],usedGroups=[],portraitUrl='',moodLabel='今日心情',outcomeArtwork=null,playerOptions={}}={}){
 const doc=container.ownerDocument,presentation=recapPresentation(snapshot);container.replaceChildren();container.dataset.tier=presentation.tier;container.dataset.amountTier=presentation.amountTier;container.className='daily-recap';container.dataset.direction=snapshot.primary.profit>0?'profit':snapshot.primary.profit<0?'loss':'flat';container.style.setProperty('--recap-intensity',presentation.intensity);container.style.setProperty('--recap-shake',presentation.shake+'px');
 const heading=el(doc,'div','recap-heading'),primary=el(doc,'div','recap-primary'),profitCounter=el(doc,'strong','recap-profit',signed(snapshot.primary.profit));const rateCounter=el(doc,'b','recap-rate',pct(snapshot.primary.returnRate));primary.append(el(doc,'span','recap-label',snapshot.primary.label),profitCounter,rateCounter);if(portraitUrl){const image=el(doc,'img','recap-portrait');image.alt=moodLabel;setImage(image,portraitUrl);heading.append(image);}heading.append(primary);container.append(heading);
 const total=el(doc,'p','recap-cumulative',`累计已实现交易 ${signed(snapshot.cumulative.realizedProfit)} · ${pct(snapshot.cumulative.returnRate)}`);container.append(total);
 const stats=el(doc,'dl','recap-stats');for(const [label,value]of [['开盘交易资产',money(snapshot.daily.openingNominal)],['交易收盘资产',money(Math.round((snapshot.daily.openingNominal+snapshot.daily.tradingNet)*100)/100)]]){stats.append(el(doc,'dt','',label),el(doc,'dd','',value));}container.append(stats);
 if(snapshot.note&&snapshot.curves.basis!=='trading')container.append(el(doc,'p','recap-note',snapshot.note));
 const playback=el(doc,'section','recap-playback'),running=el(doc,'strong','recap-counter',money(snapshot.daily.openingNominal)),step=el(doc,'span','recap-step','开盘交易资产'),controls=el(doc,'div','recap-playback-controls'),skip=el(doc,'button','recap-skip','跳过动画'),replay=el(doc,'button','recap-replay','↻ 重播');skip.type='button';replay.type='button';replay.title='只重播画面和声音，不重复结算';controls.append(skip,replay);playback.append(step,running,controls);
 const burst=el(doc,'div','recap-burst');burst.setAttribute('aria-hidden','true');for(let i=0;i<presentation.particles;i++){const spark=el(doc,'i','recap-spark');spark.style.setProperty('--spark-x',((i*47)%100)+'%');spark.style.setProperty('--spark-angle',((i*137)%360)+'deg');spark.style.setProperty('--spark-delay',(i%4)*35+'ms');burst.append(spark);}playback.append(burst);
 // Viewport-sized layer stays inside the dialog's top layer, with no pointer capture.
 const screen=el(doc,'div','recap-screen');screen.setAttribute('aria-hidden','true');screen.dataset.direction=presentation.direction;screen.dataset.tier=presentation.tier;
 const halo=el(doc,'div','recap-screen-halo'),ring=el(doc,'div','recap-screen-ring');screen.append(halo,ring);
 if(outcomeArtwork?.src){const art=el(doc,'img','recap-outcome-art');art.alt=outcomeArtwork.alt||'';setImage(art,outcomeArtwork.src);if(outcomeArtwork.objectPosition)art.style.objectPosition=outcomeArtwork.objectPosition;playback.append(art);}
 for(let i=0;i<presentation.particles+presentation.shards;i++){const particle=el(doc,'i',presentation.direction==='profit'?'recap-screen-coin':'recap-screen-shard');particle.style.setProperty('--x',((i*47+13)%100)+'vw');particle.style.setProperty('--y',((i*31+11)%85)+'vh');particle.style.setProperty('--drift',((i%2?-1:1)*(35+i%6*18))+'px');particle.style.setProperty('--turn',((i*137)%360)+'deg');particle.style.setProperty('--delay',(i%7)*40+'ms');screen.append(particle);}
 const screenHost=doc.body||container;screen.setAttribute('popover','manual');screenHost.append(screen);
 const stageProfit=el(doc,'strong','recap-stage-profit'),clock=el(doc,'span','recap-replay-clock'),eventCard=el(doc,'div','recap-event-card','沿当天 K 线回看'),eventDelta=el(doc,'strong','recap-event-delta'),phaseLabel=el(doc,'span','recap-phase-label','开盘'),progressTrack=el(doc,'div','recap-progress-track'),progressBar=el(doc,'i');progressTrack.append(progressBar);eventCard.append(eventDelta);
 const candles=createRecapStageChart(doc,snapshot);playback.append(phaseLabel,clock,stageProfit,candles.root,eventCard,progressTrack);container.append(playback);
 // Keep the detailed chart controls available after the central performance.
 const chartDetails=el(doc,'details','recap-chart-details');chartDetails.append(el(doc,'summary','','查看完整 K 线 / 均线'),candleReplay(doc,snapshot.candles,snapshot.candleMovingAverages||[]).root);container.append(chartDetails);
 const tabs=el(doc,'div','recap-tabs'),curve=el(doc,'div','recap-curve');for(const [scope,label]of [['today',snapshot.curves.basis==='trading'?'今日交易资产曲线':'今日资金曲线'],['cumulative',snapshot.curves.basis==='trading'?'累计交易资产曲线':'累计资金曲线']]){const b=el(doc,'button','',label);b.type='button';b.onclick=()=>{for(const child of tabs.children)child.setAttribute('aria-pressed',String(child===b));curve.replaceChildren(drawRecapCurve(doc,snapshot.curves[scope],{label,partial:snapshot.curves[scope+'Partial'],basis:snapshot.curves.basis}));};tabs.append(b);}container.append(tabs,curve);tabs.firstElementChild.click();
 container.append(el(doc,'p','recap-clock',snapshot.timeNotice));const basis=el(doc,'details','recap-basis');basis.append(el(doc,'summary','','收益率和资金口径'),el(doc,'p','',snapshot.daily.returnBasis),el(doc,'p','',snapshot.cumulative.returnBasis),el(doc,'p','','净资产 = 账户总资产 − 全部欠款。'));container.append(basis);
 const choiceBox=el(doc,'div','recap-choices');for(const choice of recapChoices(snapshot,{cash,loanUnlocked,loanTerms})){const b=el(doc,'button',choice.loan?'recap-loan':'recap-choice');b.type='button';b.dataset.choice=choice.id;b.dataset.selected=String(usedChoices.includes(choice.id));b.disabled=!choice.enabled||usedChoices.includes(choice.id)||!!choice.group&&usedGroups.includes(choice.group);const choiceHeading=el(doc,'b','recap-choice-heading');choiceHeading.append(el(doc,'span','recap-choice-label',choice.label));if(choice.cost)choiceHeading.append(el(doc,'span','recap-choice-cost',money(choice.cost)));b.append(choiceHeading);const detail=usedChoices.includes(choice.id)?'今天已选择':choice.group&&usedGroups.includes(choice.group)?'今晚已选过同类活动':choice.copy;if(detail)b.append(el(doc,'small','',detail));b.onclick=()=>onChoice(choice);choiceBox.append(b);}if(choiceBox.children.length){container.append(el(doc,'p','recap-choice-hint','今晚怎么过？'),choiceBox);}
 let player=null,disposed=false,lastEvent=-1,lastBeat=-1,lastStage='',animations=[],screenOpen=false,popoverUsable=typeof screen.showPopover==='function';
 const clearEffects=()=>{for(const animation of animations)animation.cancel();animations=[];if(screenOpen){try{screen.hidePopover?.();}catch{}screenOpen=false;}screen.dataset.active='false';screen.dataset.stage='complete';container.dataset.animate='false';playback.dataset.stage='complete';};
 const showScreen=()=>{if(screenOpen)return;if(!popoverUsable){screen.removeAttribute?.('popover');return;}try{screen.showPopover();screenOpen=true;}catch{popoverUsable=false;screen.removeAttribute?.('popover');}};
 const animate=(target,frames,options)=>{const animation=target?.animate?.(frames,options);if(animation)animations.push(animation);};
 let digitNodes=[];
 const rollAmount=(value,moving)=>{const chars=money(Math.round(value*100)/100).split('');if(chars.length!==digitNodes.length){digitNodes=chars.map(c=>el(doc,'span',/\d/.test(c)?'recap-digit':'recap-punctuation',c));running.replaceChildren(...digitNodes);}else for(let i=0;i<chars.length;i++){const n=digitNodes[i];if(n.textContent!==chars[i]){n.textContent=chars[i];if(moving&&/\d/.test(chars[i]))animate(n,[{transform:'translateY(-.32em) scaleY(1.3)',opacity:.25},{transform:'translateY(.08em) scaleY(.93)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:140,easing:'ease-out'});}}};
 const start=({initial=false}={})=>{
  if(disposed)return;
  const activeMotion=initial?motion:typeof replayMotion==='function'?replayMotion():replayMotion,systemReduced=reducedMotion||!!doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  player?.cancel();clearEffects();lastBeat=-1;lastEvent=-1;lastStage='';
  player=createRecapPlayer(snapshot,{...playerOptions,onTimeline,enabled:activeMotion,reducedMotion:systemReduced,render:f=>{
   const primaryValue=snapshot.primary.scope==='cumulative'?snapshot.primary.profit-snapshot.daily.tradingNet+f.realized:f.realized;
   profitCounter.textContent=signed(Math.round(primaryValue*100)/100);rollAmount(f.value,activeMotion&&!systemReduced&&!f.complete);step.textContent=f.complete?'交易收盘资产':'交易资产 · 已实现';
   const denominator=snapshot.primary.scope==='cumulative'?snapshot.cumulative.returnDenominator:snapshot.daily.returnDenominator;rateCounter.textContent=pct(f.complete?snapshot.primary.returnRate:snapshot.primary.returnRate===null?null:denominator>0?primaryValue/denominator:snapshot.primary.profit?primaryValue/snapshot.primary.profit*snapshot.primary.returnRate:0);
   stageProfit.textContent='净盈亏 '+signed(Math.round(f.realized*100)/100);clock.textContent=formatTradingTime(f.timestamp)+' JST';progressBar.style.width=(f.timeProgress*100)+'%';phaseLabel.textContent=f.complete?'收盘':f.stage==='anticipation'?'收盘前一拍':f.stage==='landing'?(presentation.direction==='loss'?'亏损落账':'收益落账'):'当天回放';
   playback.dataset.eventDirection=f.event?.delta<0?'loss':f.event?.delta>0?'profit':'flat';
   if(f.event&&f.event.index!==lastEvent){lastEvent=f.event.index;eventCard.firstChild && (eventCard.firstChild.textContent='');eventCard.replaceChildren(el(doc,'span','recap-event-label',formatTradingTime(f.event.timestamp)+' · '+({open:'开仓',half:'部分平仓',stop:'止损',liquidation:'强制平仓',closing:'收盘平仓'}[f.event.type]||'平仓')),eventDelta);eventDelta.textContent=f.event.type==='open'?'持仓入场':signed(f.event.delta);
    if(activeMotion&&!systemReduced&&!f.complete){const loss=f.event.delta<0;animate(eventCard,[{opacity:.2,transform:'translateY(34px) rotate(-3deg) scale(.85)'},{opacity:1,transform:'translateY(-6px) rotate(1deg) scale(1.06)',offset:.55},{opacity:1,transform:'none'}],{duration:550,easing:'cubic-bezier(.2,.8,.2,1)'});animate(running,[{transform:'translateY(0) scale(1)'},{transform:`translateY(${loss?12:-16}px) scale(${1.1+presentation.intensity*.14})`,offset:.35},{transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});}
   }skip.hidden=f.complete;playback.dataset.complete=String(f.complete);playback.dataset.stage=f.stage;container.dataset.animate=String(activeMotion&&!systemReduced&&!f.complete);
   const screenActive=activeMotion&&!systemReduced&&!f.complete&&['anticipation','landing'].includes(f.stage);screen.dataset.active=String(screenActive);screen.dataset.stage=f.stage;if(screenActive)showScreen();
   if(f.reconciled&&Math.abs(f.reconciliation)>.005){eventCard.replaceChildren(el(doc,'span','recap-event-label','收盘汇总 · 部分逐笔记录未留存'),eventDelta);eventDelta.textContent=signed(f.reconciliation);}
   if(f.complete)clearEffects();
   if(f.beat>=0&&f.beat!==lastBeat&&!f.complete&&activeMotion&&!systemReduced){
    lastBeat=f.beat;running.dataset.beat=String(f.beat);
    const strength=(f.beat+1)/Math.max(1,presentation.beats),pop=1+presentation.intensity*(.06+.17*strength);
    if(presentation.rank===3)animate(playback,[{transform:'scale(1)'},{transform:`scale(${1.008+strength*.018}) rotate(${presentation.direction==='loss'?-.28:.2}deg)`,offset:.35},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
    for(const counter of [running,profitCounter])animate(counter,[{transform:'scale(1)'},{transform:`scale(${pop})`,offset:.28},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.2,.7,.25,1)'});
   }
   if(f.stage==='landing'&&lastStage!=='landing'&&activeMotion&&!systemReduced){
    const loss=presentation.direction==='loss',kick=presentation.shake;
    const modal=container.closest?.('dialog');for(const target of new Set([doc.body||container,...(modal?.open?[modal]:[])]))animate(target,[{transform:'translate(0,0)'},{transform:`translate(${-kick}px,${loss?kick*.55:-kick*.6}px)`,offset:.14},{transform:`translate(${kick*.7}px,${-kick*.25}px)`,offset:.32},{transform:`translate(${-kick*.38}px,${kick*.12}px)`,offset:.55},{transform:'translate(0,0)'}],{duration:loss?820:650,easing:'ease-out'});
    animate(profitCounter,[{transform:'scale(.96)'},{transform:`scale(${1+presentation.intensity*.3})`,offset:.18},{transform:'scale(1)',offset:1}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});
   }
   lastStage=f.stage;candles.update(f);
  },onCue:({kind,rate,level})=>onSound(kind,{rate,level})});
 };
 container.insertBefore?.(playback,heading);
 const suspend=()=>{player?.finish();clearEffects();},visibility=()=>{if(doc.hidden)suspend();};doc.addEventListener?.('visibilitychange',visibility);doc.defaultView?.addEventListener?.('pagehide',suspend);
 skip.onclick=()=>{player?.finish();clearEffects();};replay.onclick=()=>start();start({initial:true});
 return{snapshot,replay:start,finish:()=>{player?.finish();clearEffects();},dispose:()=>{disposed=true;player?.cancel();clearEffects();doc.removeEventListener?.('visibilitychange',visibility);doc.defaultView?.removeEventListener?.('pagehide',suspend);screen.remove?.();}};
}
