import {chapterIllustration,chapterOriginalPortrait} from './art.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {setMangaImage} from '../manga-images.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {setImage} from '../assets.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {showChapterPortrait} from './portrait.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {storyChoices,storyEquity,storyUnrealized,storyMargin,storyAvailable} from './engine.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {mangaStoryScene,ADAPTATION_RULES} from './content.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
import {createChapterProgress,chapterFrames,chapterStorageEvent} from './progress.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
const $=id=>document.getElementById(id),progress=createChapterProgress(),session=progress.session;
let state=progress.state,historyIndex=null;
const yen=n=>`${n<0?'−':''}¥${Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const signed=n=>(n>0?'+':'')+yen(n);
const text=(id,value)=>$(id).textContent=value;
function saveStatus(){
 const blocked=session.blocked,memory=session.status==='memory',busy=progress.busy;
 $('legacy-notice').hidden=!progress.needsLegacyConsent;
 $('legacy-accept').disabled=busy;$('legacy-restart').disabled=busy;
 text('save-state',progress.needsLegacyConsent?'旧首章进度 · 只读预览':blocked?'进度已暂停':busy?'正在保存…':session.status==='saved'?'✓ 章节进度已保存':memory?'仅本页保存':session.raw?'✓ 已载入章节进度':'尚未开始本章');
 $('save-warning').hidden=!blocked&&!memory;
 text('save-warning-copy',session.status==='invalid'?'这份章节存档无法识别，可能来自新版本。原数据未被覆盖；可以备份后重新开章。':blocked?'另一个页面已更新章节存档，本页已暂停。先保留备份，再载入最新进度。':'浏览器暂时无法安全保存。进度仅留在本页，请重试保存或下载备份后再离开。');
 $('recover-open').hidden=session.status!=='invalid';
 $('retry-save').hidden=blocked;$('reload-save').hidden=memory;
 for(const b of document.querySelectorAll('[data-choice]'))b.disabled=busy||blocked||historyIndex!==null||progress.needsLegacyConsent;
 for(const id of ['confirm-replay','retry-save','reload-save','confirm-recover'])$(id).disabled=busy;
}
function chart(){
 const w=480,h=175,pad=22,values=state.quotes,min=Math.min(...values)-.05,max=Math.max(...values)+.05;
 const y=v=>h-pad-(v-min)/(max-min)*(h-pad*2),x=i=>pad+i/Math.max(4,values.length-1)*(w-pad*2-40);
 let svg=`<svg viewBox="0 0 ${w} ${h}" role="presentation">`;
 for(let i=0;i<3;i++){const v=min+(max-min)*i/2,Y=y(v);svg+=`<line x1="${pad}" x2="${w-50}" y1="${Y}" y2="${Y}" stroke="#59515d" stroke-dasharray="3 5"/><text x="${w-45}" y="${Y+4}" fill="#d7c9d2" font-size="10">${v.toFixed(3)}</text>`;}
 svg+=`<polyline fill="none" stroke="#efa1c0" stroke-width="3" points="${values.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}"/>`;
 values.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff0f7"/>`);
 $('story-chart').innerHTML=svg+'</svg>';
 $('story-chart').setAttribute('aria-label',`已发生的 ${values.length} 个教学报价：${values.map(n=>n.toFixed(3)).join('、')} 日元每美元`);
}
function render(){
 state=historyIndex===null?progress.state:chapterFrames(progress.state)[historyIndex];
 const scene=mangaStoryScene(state),panel=scene.panel;
 document.body.dataset.stage=state.stage;
 text('chapter-label',state.stage==='review'?'第 1 话 · 完成':`第 1 话 · 第 ${state.scene+1} 格`);
 text('scene-kicker',scene.kicker);text('scene-title',scene.title);text('scene-body',scene.body);text('scene-fact',scene.fact);
 const illustration=chapterIllustration(state),original=chapterOriginalPortrait(state);
 $('scene-art-frame').hidden=!illustration;
 if(illustration){setMangaImage($('scene-art'),illustration.path,{loading:'eager'});$('scene-art').alt=illustration.alt;text('scene-art-caption',illustration.caption+' · 原创同人场景');}
 $('portrait-frame').hidden=false;$('source-open').hidden=false;$('panel-fallback').hidden=true;
 if(panel){showChapterPortrait($('story-portrait'),panel);text('expression-label',panel.expression);text('panel-source',`第 ${panel.chapter} 话 · 第 ${panel.page} 页`);}
 else {const image=$('story-portrait');image.style.cssText='display:block;position:static;width:100%;height:auto;max-width:100%;transform:none';image.parentElement.style.aspectRatio='3 / 4';setMangaImage(image,original.path,{loading:'eager'});image.alt=`久留美 · ${original.label} · 原创同人立绘`;text('expression-label',original.label);text('panel-source',original.origin);}
 text('portrait-context',!panel?'按本章当前仓位和实际损益呈现原创表情。':state.position?`本局${state.position.direction===-1?'美元空单':'美元多单'} · ${signed(storyUnrealized(state))} 浮动盈亏。表情取自当前已揭示页。`:state.stage==='review'?'按本章实际结算匹配表情，漫画原图数值不代表本局。':'本局空仓。使用当前已揭示的中性画面。');
 text('story-price',state.price.toFixed(3));text('route-label',state.stage==='extension'?'IF 压力测试':state.branch==='if'?'IF 选择路线':'原作节点改编');
 text('story-equity',yen(storyEquity(state)));text('story-realized',signed(state.realized));text('story-floating',signed(storyUnrealized(state)));text('story-margin',yen(storyMargin(state)));text('story-available',yen(storyAvailable(state)));
 $('story-realized').className=state.realized<0?'loss':'profit';$('story-floating').className=storyUnrealized(state)<0?'loss':'profit';
 text('story-position',state.position?`${state.position.direction===1?'买入美元 · 多单':'卖出美元 · 空单'} ${state.position.quantity/10000} 枚 / ${state.position.quantity.toLocaleString('zh-CN')} USD，开仓 ${state.position.entry.toFixed(3)}`:'当前空仓 · 无未结算头寸');
 text('risk-plan',state.riskPlan==='protected'?'撤退计划：反向 0.10 日元自动止损':state.riskPlan==='discretionary'?'撤退计划：手动判断，未设自动止损':'撤退计划：尚未选择');
 const choices=$('choices');choices.replaceChildren();
 for(const choice of storyChoices(state)){
   const button=document.createElement('button'),label=document.createElement('span'),small=document.createElement('small');button.dataset.choice=choice.id;label.textContent=choice.label;small.textContent=choice.detail;button.append(label,small);
   button.hidden=historyIndex!==null;const expected=state.scene;button.onclick=event=>{if(event.detail>1)return;void choose(choice.id,expected);};choices.append(button);
 }
 $('choice-heading').hidden=state.stage==='review';
 $('review').hidden=!scene.review;
 if(scene.review){const r=scene.review;text('review-title',r.title);text('review-lesson',r.discipline+' '+r.lesson);text('review-comparison',`你的结果：${signed(r.profit)}，账户 ${yen(r.equity)}；最大已观测回撤 ${yen(r.maxDrawdown)}。原作首单：做空 10 枚，反弹时平仓，索引损益 +24,000 日元。模型只重现有依据的决策节点，未声称逐 tick 还原。`);}
 const ledger=$('ledger');ledger.replaceChildren();
 for(const t of state.ledger){const li=document.createElement('li');li.textContent=t.type==='observe'?'选择空仓观望':`${t.type==='open'?'开仓':'平仓'} · ${t.direction===1?'美元多单':'美元空单'} ${t.quantity/10000} 枚 @ ${t.price.toFixed(3)}${t.type==='close'?` · ${signed(t.pnl)} · ${{stop:'预设止损',half:'减半',manual:'主动平仓','chapter-end':'测试终点结算'}[t.reason]}`:''}`;ledger.append(li);}
 if(!state.ledger.length){const li=document.createElement('li');li.textContent='还没有下单。';ledger.append(li);}
 $('history-banner').hidden=historyIndex===null;
 $('history-open').hidden=progress.state.actions.length===0||historyIndex!==null;
 $('history-prev').disabled=historyIndex===0;$('history-next').disabled=historyIndex===null||historyIndex>=progress.state.actions.length;
 text('history-status',historyIndex===null?'':`正在回看第 ${historyIndex+1} 格 / 共 ${progress.state.actions.length+1} 格。账户与进度不会改变。`);
 $('replay').hidden=historyIndex!==null;
 chart();saveStatus();
}
async function choose(id,expected){
 if(historyIndex!==null)return;
 const pending=progress.choose(id,expected);saveStatus();
 const result=await pending;
 text('action-status',result.ok?'':result.reason==='busy'?'正在保存上一格。':result.reason);
 render();$('scene-title').focus({preventScroll:true});
}
function backup(){
 const url=URL.createObjectURL(new Blob([JSON.stringify(progress.backup(),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`久留美-原作首章-${progress.state.runId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('backup').onclick=backup;
$('legacy-accept').onclick=async()=>{const pending=progress.acceptLegacy();saveStatus();const result=await pending;text('action-status',result.ok?'已复制到本章独立存档，旧首章原档未更改。':'暂未复制，请重试或保留备份。');render();};
$('legacy-restart').onclick=()=>$('replay-dialog').showModal();
$('recover-open').onclick=()=>$('recover-dialog').showModal();
$('confirm-recover').onclick=async()=>{
 const pending=progress.recover();saveStatus();
 try{const result=await pending;if(result.ok){historyIndex=null;$('recover-dialog').close();text('action-status','旧存档已另存备份，新章节已开始。');}else text('action-status','恢复未完成（'+result.reason+'），原存档仍受保护。');}
 catch{ text('action-status','恢复未完成，请重试或先下载备份。');}finally{render();}
};
$('reload-save').onclick=()=>{const loaded=progress.reload();if(loaded.ok){historyIndex=null;text('action-status','');render();}else saveStatus();};
$('retry-save').onclick=async()=>{const pending=progress.retry();saveStatus();await pending;render();};
window.addEventListener('storage',event=>{if(chapterStorageEvent(event.key)){session.check();saveStatus();}});
window.addEventListener('pageshow',()=>{session.check();saveStatus();});
$('source-open').onclick=()=>{
 const {panel}=mangaStoryScene(state);$('source-link').hidden=!panel;
 if(panel){text('source-title',`${panel.character} · 第 ${panel.chapter} 话第 ${panel.page} 页`);text('source-copy',`${panel.scene} / ${panel.expression}。${panel.meaning}。${panel.correction||''}`);setImage($('source-original'),panel.original);$('source-original').alt='未经修改的原作来源图';$('source-link').href=panel.sourceURL;}
 else {const original=chapterOriginalPortrait(state);text('source-title','久留美 · 原创同人立绘');text('source-copy','当前表情：'+original.label+'。这是本作原创同人画面，不是原作漫画截图。');setImage($('source-original'),original.path);$('source-original').alt='本作原创同人立绘';$('source-link').removeAttribute('href');}
 $('source-dialog').showModal();
};
$('rules-open').onclick=()=>$('rules-dialog').showModal();text('adaptation-rules',ADAPTATION_RULES);
for(const button of document.querySelectorAll('[data-close]'))button.onclick=()=>$(button.dataset.close).close();
$('replay').onclick=()=>$('replay-dialog').showModal();
$('confirm-replay').onclick=async()=>{
 const pending=progress.restart();saveStatus();
 try{const result=await pending;if(result.ok){historyIndex=null;$('replay-dialog').close();text('action-status','上一轮已另存本机备份，开始新的选择。');}else text('action-status','未重新开章（'+result.reason+'），请先保存或备份当前进度。');}
 catch{text('action-status','未重新开章，请重试或先下载备份。');}finally{render();}
};
$('history-open').onclick=()=>{historyIndex=0;render();};
$('history-prev').onclick=()=>{if(historyIndex>0){historyIndex--;render();}};
$('history-next').onclick=()=>{if(historyIndex!==null&&historyIndex<progress.state.actions.length){historyIndex++;render();}};
$('history-exit').onclick=()=>{historyIndex=null;render();};
$('return-free').onclick=event=>{if(progress.unsafeToLeave){event.preventDefault();if(progress.busy)text('action-status','正在保存，完成后再返回交易室。');else $('leave-dialog').showModal();}};
$('leave-backup').onclick=backup;
$('leave-confirm').onclick=()=>{window.location.assign(new URL('./fx.html',document.baseURI).href);};
window.addEventListener('beforeunload',event=>{if(progress.unsafeToLeave){event.preventDefault();event.returnValue='';}});
render();
