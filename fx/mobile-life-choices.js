// Presentation only. The owning picker keeps the opening context and final guard.
// Selection is local UI state; only the original onChoose callback commits a day.
export const mobileLifeViewport=doc=>{
 const {innerWidth=1536,innerHeight=1024}=doc.defaultView||{};
 return doc.body.dataset.frontend==='pixel'&&(innerWidth<=759||(innerWidth<=1024&&innerHeight<=600&&innerWidth>innerHeight));
};
const GROUPS=Object.freeze([
 {id:'friend',label:'找朋友聊',hint:'选择朋友',icon:'chat',action:'开始聊天'},
 {id:'work',label:'打工',hint:'选择工作',icon:'work',action:'开始打工'},
 {id:'relax',label:'出去散心',hint:'选择地点',icon:'leaf',action:'出发'}
]);
const ART_IDS=new Set(['mochiko','yasuko','convenience','cafe','bookstore','shrine','river','park']);
const number=n=>n.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function renderMobileLifeChoices({document:doc,body,model,selections,busy,stale,optionsOf,make,button,icon,actionButton,onHousing,onDinner}){
 const status=model.status||{};
 const sprite=name=>{const node=make('span',`life-mobile-sprite life-mobile-sprite-${name}`);node.setAttribute('aria-hidden','true');return node;};
 if(model.character){
  const character=make('section','life-mobile-character');character.setAttribute('aria-label','久留美当前状态');
  const identity=make('div','life-mobile-identity');identity.append(sprite('kurumi'),make('strong','','久留美'));
  const stats=make('div','life-mobile-stats'),emotion=make('p','life-mobile-emotion');emotion.append(icon('chat'),make('span','','情绪'),make('strong','',model.character.emotion||'—'));stats.append(emotion);
  for(const [key,label] of [['sanity','心理承受力'],['stamina','体力']]){
   const value=model.character[key];if(!Number.isFinite(value))continue;
   const row=make('div',`life-mobile-stat life-mobile-${key}`),caption=make('p','');caption.append(sprite(key),make('span','',label),make('strong','',String(Math.round(value))));
   const meter=make('div','life-mobile-meter');meter.setAttribute('role','meter');meter.setAttribute('aria-label',label);meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','100');meter.setAttribute('aria-valuenow',String(Math.max(0,Math.min(100,value))));
   const fill=make('span','');fill.style.width=`${Math.max(0,Math.min(100,value))}%`;meter.append(fill);row.append(caption,meter);stats.append(row);
  }
  character.append(identity,stats);body.append(character);
 }
 for(const group of GROUPS){
  const section=make('section',`life-mobile-section life-mobile-${group.id}`);section.dataset.lifeGroup=group.id;
  const heading=make('h3','life-mobile-heading');heading.id=`life-mobile-${group.id}-heading`;heading.append(icon(group.icon),doc.createTextNode(group.label));
  section.append(heading,make('p','life-mobile-hint',group.hint));
  const options=optionsOf(model,group.id),grid=make('div','life-mobile-options');grid.setAttribute('role','group');grid.setAttribute('aria-labelledby',heading.id);
  if(!options.some(option=>option.id===selections[group.id]))selections[group.id]=(options.find(option=>option.enabled)||options[0])?.id;
  for(const option of options){
   const card=button('life-mobile-option');card.dataset.lifeSelect=option.id;card.dataset.lifeSelectCategory=group.id;
   card.setAttribute('aria-pressed',String(option.id===selections[group.id]));card.disabled=busy||stale||!status.enabled||!option.enabled;
   if(ART_IDS.has(option.id)){const art=make('span','life-mobile-art');art.append(sprite(option.id));card.append(art);}
   card.append(make('strong','life-mobile-option-label',option.label));
   const reason=option.reason||status.reason;
   if(!option.enabled&&reason){card.append(make('span','life-mobile-reason',reason));card.title=reason;}
   grid.append(card);
  }
  section.append(grid);
  const selected=options.find(option=>option.id===selections[group.id]);
  if(group.id==='work'&&Number.isFinite(selected?.income)){
   const income=make('p','life-mobile-income');income.append(sprite('coins'),make('span','','收入'),make('strong','',`${selected.income>=0?'+':''}¥${number(selected.income)}`));section.append(income);
   if(Number.isFinite(selected.staminaCost)){section.append(make('p','life-mobile-work-details',`体力 −${selected.staminaCost} · 压力 ${selected.stressDelta>0?'+':''}${selected.stressDelta}`),make('p','life-mobile-work-reward',`初次完成获得：${selected.rewardLabel}`));}
  }
  if(group.id==='relax'&&selected){if(Number.isFinite(selected.cost))section.append(make('p','life-mobile-income',`费用 ¥${number(selected.cost)}`));if(Number.isFinite(selected.staminaRecovery))section.append(make('p','life-mobile-work-details',`体力 +${selected.staminaRecovery} · 压力 ${selected.stressDelta>0?'+':''}${selected.stressDelta||0}`));}
  const reason=selected?.reason||status.reason;
  if(!options.length)section.append(make('p','life-mobile-reason',group.id==='friend'?'暂时还没有相识的朋友。':'暂时没有可选的安排。'));
  const disabled=busy||stale||!status.enabled||!selected?.enabled;
  const submit=actionButton(group.action,{lifeChoose:selected?.id||'',lifeCategory:group.id},disabled,reason);
  submit.setAttribute('aria-label',selected?`${group.action}：${selected.label}，自动平仓并进入结算`:group.action);
  section.append(submit);body.append(section);
 }
 // Existing housing and dinner flows remain available; neither shortcut commits.
 const extras=make('nav','life-mobile-extras');extras.setAttribute('aria-label','其他生活安排');
 const housing=button('life-mobile-extra','住房');housing.dataset.lifeOpen='housing';housing.disabled=busy||model.housingEnabled===false||typeof onHousing!=='function';housing.prepend(icon('house'));
 const dinner=button('life-mobile-extra','请客吃饭');dinner.dataset.lifeOpen='dinner';dinner.disabled=busy||(Array.isArray(model.options?.dinner)?!status.enabled:model.dinnerEnabled===false||typeof onDinner!=='function');dinner.prepend(icon('dinner'));extras.append(housing,dinner);body.append(extras);
}
