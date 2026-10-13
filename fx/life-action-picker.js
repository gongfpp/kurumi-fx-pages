import {mobileLifeViewport,renderMobileLifeChoices} from './mobile-life-choices.js?v=443669c15b264bcc9465b95315e1b8dd764b4d8f-23f2a20b7717';
/** Approved life menu. Presentation only: the owning app supplies live engine data
 * and guards every final choice. This module never owns game state or a clock. */
export const LIFE_ACTION_CONSEQUENCE = '选定具体行动后结束今日交易，持仓自动平仓';
const CATEGORIES = Object.freeze({dinner:{label:'请客吃饭',heading:'选择请客安排',icon:'dinner'},friend:{label:'找朋友聊',heading:'已相识的朋友',icon:'chat'},work:{label:'打工',heading:'选择工作',icon:'work'},relax:{label:'出去散心',heading:'选择地点',icon:'leaf'}});
const MENU = Object.freeze([
 {id:'dinner',label:'请客吃饭',button:'去请客',icon:'dinner'},
 {id:'friend',label:'找朋友聊',button:'选择朋友',icon:'chat'},
 {id:'work',label:'打工',button:'选择工作',icon:'work'},
 {id:'relax',label:'出去散心',button:'选择地点',icon:'leaf'}
]);
const ART_IDS = new Set(['mochiko','yasuko','convenience','cafe','bookstore','shrine','river','park']);
const mounted = new WeakMap();
const number = n => n.toLocaleString('zh-CN',{maximumFractionDigits:2});

/** getModel(): {status: lifeActionStatus(state), options: {friend,work,relax},
 * housingLabel?, housingEnabled?, dinnerEnabled?, dinnerReason?, character?: {emotion,sanity,stamina}}.
 * onChoose receives {category,optionId,day,runId}; only this callback may commit.
 * Its return is core's {applied,alreadyApplied,...}, or {ok:false,reason} on a
 * guarded failure. onHousing/onDinner reopen the app's existing original flows. */
export function mountLifeActionPicker({document:doc=globalThis.document,getModel,onChoose,onHousing,onDinner,getContext=()=>undefined,onClose=()=>{}}={}) {
 if(!doc?.body||typeof getModel!=='function'||typeof onChoose!=='function')throw new TypeError('Life picker requires document, getModel and onChoose');
 if(mounted.has(doc))return mounted.get(doc);
 const make=(tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const button=(className,text)=>{const node=make('button',className,text);node.type='button';return node;};
 const icon=name=>{const node=make('span',`life-picker-icon life-picker-icon-${name}`);node.setAttribute('aria-hidden','true');return node;};
 const art=(id,label)=>{const node=make('div',`life-picker-art life-picker-art-${id}`);node.setAttribute('role','img');node.setAttribute('aria-label',label);return node;};
 const dialog=make('dialog','life-action-picker');dialog.id='life-action-picker';dialog.setAttribute('aria-labelledby','life-picker-title');dialog.setAttribute('aria-describedby','life-picker-consequence');dialog.setAttribute('aria-modal','true');
 const shell=make('div','life-picker-shell'),header=make('header','life-picker-header');
 const back=button('life-picker-back','返回生活');back.prepend(make('span','life-picker-arrow','‹'));
 const title=make('h2','life-picker-title');title.id='life-picker-title';
 const closeButton=button('life-picker-close','×');closeButton.setAttribute('aria-label','关闭生活菜单');header.append(back,title,closeButton);
 const content=make('div','life-picker-content'),notice=make('p','life-picker-consequence',LIFE_ACTION_CONSEQUENCE);notice.id='life-picker-consequence';
 const feedback=make('p','life-picker-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.hidden=true;
 const body=make('div','life-picker-body');content.append(notice,feedback,body);shell.append(header,content);dialog.append(shell);doc.body.append(dialog);
 const selections={};
 let mobile=false;
 let category='menu',snapshot=null,opener=null,disposed=false,busy=false,session=0,lastSignature='',message='';
 const listeners=[];
 const listen=(node,type,handler)=>{node.addEventListener(type,handler);listeners.push(()=>node.removeEventListener(type,handler));};
 const model=()=>getModel()||{};
 const statusOf=m=>m.status||{};
 const optionsOf=(m,c)=>(Array.isArray(m.options?.[c])?m.options[c]:[]).filter(o=>o&&typeof o.id==='string'&&typeof o.label==='string');
 const setMessage=text=>{message=text||'';feedback.textContent=message;feedback.hidden=!message;};
 const stale=m=>snapshot&&(snapshot.day!==statusOf(m).day||snapshot.runId!==statusOf(m).runId||snapshot.contextToken!==(m.contextToken??getContext()));
 const focusStart=()=>{const preferred=mobile?[...body.querySelectorAll('[data-life-select]')].find(node=>!node.disabled):category==='menu'?body.querySelector('[data-life-open="housing"]'):back;const target=preferred&&!preferred.disabled?preferred:closeButton;target.focus({preventScroll:true});};
 function setTitle(){title.replaceChildren(icon(mobile?'house':CATEGORIES[category]?.icon||'house'),doc.createTextNode(mobile?'生活':CATEGORIES[category]?.label||'生活'));}
 function actionButton(label,attrs,disabled=false,reason=''){
  const node=button('life-picker-primary',label);for(const [key,value]of Object.entries(attrs))node.dataset[key]=value;node.disabled=disabled;if(disabled&&reason)node.title=reason;node.append(make('span','life-picker-chevron','›'));return node;
 }
 function renderMenu(m){
  const housing=make('section','life-picker-housing'),housingArt=art('housing','宿舍与独住居所'),housingCopy=make('div','life-picker-housing-copy'),housingHeading=make('h3','');housingHeading.append(icon('house'),doc.createTextNode('住房'));housingCopy.append(housingHeading,make('p','',m.housingLabel||'选择住宿形式'));
  housing.append(housingArt,housingCopy,actionButton('选择住房',{lifeOpen:'housing'},busy||m.housingEnabled===false||typeof onHousing!=='function'));body.append(housing);
  const section=make('section','life-picker-today'),heading=make('h3','life-picker-section-title');heading.append(icon('bag'),doc.createTextNode('今日行动'));section.append(heading);
  const grid=make('div','life-picker-menu-grid');
  for(const item of MENU){
   const card=make('article','life-picker-menu-card'),h=make('h4','');h.append(icon(item.icon),doc.createTextNode(item.label));
   const options=optionsOf(m,item.id),isDinner=item.id==='dinner';
   const hasDinnerOptions=isDinner&&Array.isArray(m.options?.dinner);
   const disabled=busy||(isDinner&&!hasDinnerOptions?(m.dinnerEnabled===false||typeof onDinner!=='function'):!statusOf(m).enabled);
   const reason=statusOf(m).reason||(isDinner?m.dinnerReason:'')||(!options.some(o=>o.enabled)?options.find(o=>o.reason)?.reason||'还没有可选的安排':'');
   card.append(h,art(item.id,item.label));if(reason&&!options.some(o=>o.enabled))card.append(make('p','life-picker-option-reason',reason));card.append(actionButton(item.button,{lifeOpen:item.id},disabled,reason));grid.append(card);
  }
  section.append(grid);body.append(section);
  const footer=make('footer','life-picker-footer'),returnButton=button('life-picker-return','‹ 返回交易');returnButton.dataset.lifeClose='true';footer.append(returnButton);body.append(footer);
 }
 function renderOptions(m){
  const heading=make('h3','life-picker-section-title',CATEGORIES[category].heading),grid=make('div',`life-picker-option-grid life-picker-${category}-grid`);grid.setAttribute('aria-label',CATEGORIES[category].heading);body.append(heading,grid);
  const options=optionsOf(m,category);let enabledCount=0;
  for(const option of options){
   const card=make('article','life-picker-option-card');card.dataset.optionId=option.id;
   const h=make('h4','life-picker-option-title',option.label);
   if(category==='friend'){const badge=make('span','life-picker-friend-badge',(option.known??option.unlocked??option.enabled)?'已相识':'未相识');badge.dataset.locked=String(!(option.known??option.unlocked??option.enabled));h.append(badge);}
   card.append(h);
   // Unknown future options remain usable, but never borrow another person's art.
   if(ART_IDS.has(option.id))card.append(art(option.id,option.label));
   if(category==='dinner'&&Number.isFinite(option.cost))card.append(make('p','life-picker-income',`请客费用 ¥${number(option.cost)}`));
   if(category==='work'&&Number.isFinite(option.income))card.append(make('p','life-picker-income',`工作收入 ¥${number(option.income)}`));
   const disabled=busy||!statusOf(m).enabled||!option.enabled||stale(m),reason=option.reason||statusOf(m).reason;
   if(option.enabled)enabledCount++;
   if(!option.enabled&&reason)card.append(make('p','life-picker-option-reason',reason));
   const choose=actionButton('选定并收盘',{lifeChoose:option.id},disabled,reason);choose.setAttribute('aria-label',`${option.label}，选定并收盘`);card.append(choose);grid.append(card);
  }
  if(!options.length)body.append(make('p','life-picker-empty',category==='friend'?'暂时还没有相识的朋友。':'暂时没有可选的安排。'));
  if(options.length&&!enabledCount&&!message)setMessage(statusOf(m).reason||options.find(o=>o.reason)?.reason||(category==='friend'?'暂时还没有相识的朋友。':''));
 }
 function render({force=false}={}){
  if(disposed||!dialog.open)return;
  const m=model(),status=statusOf(m);
  mobile=mobileLifeViewport(doc)&&category!=='dinner';dialog.dataset.mobileLife=String(mobile);
  dialog.dataset.category=category;dialog.dataset.busy=String(busy);dialog.setAttribute('aria-busy',String(busy));back.hidden=!mobile&&category==='menu';back.disabled=busy;back.setAttribute('aria-label',mobile?'返回交易':'返回生活');
  notice.textContent=mobile?'选择行动后，自动平仓并进入结算':LIFE_ACTION_CONSEQUENCE;
  const signature=JSON.stringify({category,mobile,selections,character:m.character,busy,status,contextToken:m.contextToken??getContext(),options:m.options,housingLabel:m.housingLabel,housingEnabled:m.housingEnabled,dinnerEnabled:m.dinnerEnabled,dinnerReason:m.dinnerReason});
  if(!force&&signature===lastSignature)return;
  const focusKeyOf=node=>node?.dataset?.lifeSelect?`select:${node.dataset.lifeSelectCategory}:${node.dataset.lifeSelect}`:node?.dataset?.lifeChoose?`choose:${node.dataset.lifeCategory||category}:${node.dataset.lifeChoose}`:node?.dataset?.lifeOpen;
  const active=doc.activeElement,focusKey=focusKeyOf(active);
  const wasInBody=body.contains(active);lastSignature=signature;setTitle();body.replaceChildren();
  if(stale(m))setMessage('今天的安排已变化，请重新打开生活菜单。');else if(!status.enabled&&status.reason)setMessage(status.reason);
  if(mobile)renderMobileLifeChoices({document:doc,body,model:m,selections,busy,stale:stale(m),optionsOf,make,button,icon,actionButton,onHousing,onDinner});
  else category==='menu'?renderMenu(m):renderOptions(m);
  if(wasInBody){const replacement=[...body.querySelectorAll('button')].find(n=>focusKeyOf(n)===focusKey&&!n.disabled);(replacement||(mobile||category==='menu'?closeButton:back))?.focus({preventScroll:true});}
 }
 function close(){
  if(!dialog.open)return;session++;dialog.close();
 }
 function open(next='menu'){
  if(disposed)return false;
  if(next!=='menu'&&!CATEGORIES[next])return false;
  if(!dialog.open){opener=doc.activeElement;const m=model(),s=statusOf(m);snapshot={day:s.day,runId:s.runId,contextToken:m.contextToken??getContext()};session++;dialog.showModal();}
  category=next;setMessage('');render({force:true});focusStart();return true;
 }
 async function choose(optionId,event,choiceCategory=category){
  if(disposed||!dialog.open||busy||event?.detail>1||event?.repeat||!CATEGORIES[choiceCategory])return;
  const m=model(),option=optionsOf(m,choiceCategory).find(o=>o.id===optionId);
  if(stale(m)){setMessage('今天的安排已变化，请重新打开生活菜单。');render({force:true});return;}
  if(!statusOf(m).enabled||!option?.enabled){setMessage(option?.reason||statusOf(m).reason||'这项安排暂时无法选择。');render({force:true});return;}
  const action={category:choiceCategory,optionId,day:snapshot.day,runId:snapshot.runId,contextToken:snapshot.contextToken},requestSession=session;busy=true;setMessage('');render({force:true});
  try{
   const result=await onChoose(action);
   if(disposed)return;
   if(result?.ok===false||!(result?.applied===true||result?.alreadyApplied===true||result?.ok===true)){
    if(requestSession===session)setMessage(result?.reason||result?.message||'这次行动尚未完成，请稍后再试。');
   }else if(requestSession===session)close();
  }catch(error){if(!disposed&&requestSession===session)setMessage(error?.message||'这次行动尚未完成，请稍后再试。');}
  finally{busy=false;if(!disposed)render({force:true});}
 }
 listen(body,'click',event=>{
  const target=event.target.closest('button');if(!target||target.disabled||!body.contains(target)||event.detail>1)return;
  if(target.dataset.lifeSelect){
   if(busy||!mobile)return;const selectedCategory=target.dataset.lifeSelectCategory;
   if(!['friend','work','relax'].includes(selectedCategory))return;
   const m=model(),option=optionsOf(m,selectedCategory).find(o=>o.id===target.dataset.lifeSelect);
   if(stale(m)||!statusOf(m).enabled||!option?.enabled)return;
   selections[selectedCategory]=option.id;setMessage('');render({force:true});return;
  }
  if(target.dataset.lifeChoose)return void choose(target.dataset.lifeChoose,event,target.dataset.lifeCategory||category);
  if(target.dataset.lifeClose)return close();
  const next=target.dataset.lifeOpen;if(!next||busy)return;
  if(next==='housing'||next==='dinner'&&!Array.isArray(model().options?.dinner)){close();(next==='housing'?onHousing:onDinner)?.();return;}
  open(next);
 });
 listen(back,'click',()=>{if(!busy){if(mobile)close();else open('menu');}});listen(closeButton,'click',close);
 listen(dialog,'click',event=>{if(event.target===dialog)close();});
 listen(dialog,'cancel',event=>{event.preventDefault();close();});
 listen(dialog,'close',()=>{if(dialog.open)return;const another=[...doc.querySelectorAll('dialog[open]')].some(n=>n!==dialog);if(!another&&opener?.isConnected)opener.focus({preventScroll:true});onClose();});
 listen(dialog,'keydown',event=>{
  // Keep the app's trading hotkeys outside every modal interaction.
  event.stopPropagation();
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const nodes=[...dialog.querySelectorAll('button')].filter(n=>!n.disabled&&!n.hidden&&!n.closest('[hidden]'));
  const first=nodes[0],last=nodes.at(-1);if(!first)return;
  if(event.shiftKey&&(doc.activeElement===first||!dialog.contains(doc.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(doc.activeElement===last||!dialog.contains(doc.activeElement))){event.preventDefault();first.focus();}
 });
 if(doc.defaultView?.addEventListener)listen(doc.defaultView,'resize',()=>render());
 // A skin switch must restore the original life menu without changing the run.
 const Observer=doc.defaultView?.MutationObserver;
 if(Observer){const observer=new Observer(()=>render());observer.observe(doc.body,{attributes:true,attributeFilter:['data-frontend']});listeners.push(()=>observer.disconnect());}
 const api={open,close,render,refresh:render,element:dialog,dispose(){if(disposed)return;close();disposed=true;session++;for(const remove of listeners)remove();dialog.remove();mounted.delete(doc);}};
 mounted.set(doc,api);return api;
}
