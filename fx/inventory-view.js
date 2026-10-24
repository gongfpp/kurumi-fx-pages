// Inventory presentation only. Prices and effects are executed by the engine.
import {supplyUnavailableReason,supplyUsedToday} from './daily-supplies.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {ownsTradingNotes} from './life-work.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
export const SUPPLY_CARDS=Object.freeze([
 {id:'energy',name:'魔爪能量饮料',cost:300,effect:'体力 +25',detail:'体力恢复25，情绪更亢奋，当日破限免连点。接下来四分之一交易日耗体八折，随后半个交易日耗体增加五成。每天一罐。',icon:'drink'},
 {id:'noodles',name:'泡面',cost:150,effect:'体力 +8',detail:'与外卖共用一餐位，抵扣餐费 ¥300',icon:'meal'},
 {id:'takeaway',name:'外卖',cost:1200,effect:'体力 +20',detail:'情绪向平静移动一档，与泡面共用餐位',icon:'meal'}
]);
const ICON_PATHS={drink:'M8 3h8v3l2 3v12H6V9l2-3z M8 12h8 M9 3v3h6',meal:'M3 12h18l-3 8H6z M7 8V3 M12 8V2 M17 8V3',chocolate:'M5 3h14v18H5z M5 9h14 M5 15h14 M12 3v18',sleep:'M3 9c3-3 6-3 9 0 3-3 6-3 9 0l-2 8h-5l-2-3-2 3H5z',work:'M3 7h18v14H3z M8 7V3h8v4 M3 12h18 M10 12v3h4v-3'};
export function inventoryModel({state,props={},jobs=[],effects={},availableMargin=0,canUse=false,busy=false,canUseFather=false,itemDiscovered=()=>false,itemUnlocked=()=>false}){
 const notesOwned=ownsTradingNotes(state);
 const supplies=SUPPLY_CARDS.map(spec=>({...spec,pending:false,used:supplyUsedToday(state,spec.id)||spec.id==='tradingNotes'&&state.dailySupplies?.noteUsedDay===state.day,disabled:busy||!canUse||!!supplyUnavailableReason(state,spec.id)||availableMargin<spec.cost}));
 const work=Object.values(state.workInventory||{}).filter(item=>item.id!=='memo'||notesOwned).map(item=>{
  const job=jobs.find(row=>row.id===item.jobId),effect=effects[item.id];
  return {...item,name:item.id==='memo'?'交易笔记':item.label,source:`${job?.label||'打工'} · 第 ${item.day} 天获得`,effect:effect?.label||'工作纪念品',collectibleOnly:!!effect?.collectibleOnly,active:item.id==='memo'&&notesOwned,used:item.id==='memo'&&(!!state.itemsUsed?.tradingNotes||state.dailySupplies?.noteUsedDay===state.day),disabled:busy||!canUse||!!state.itemsUsed?.tradingNotes||state.dailySupplies?.noteUsedDay===state.day};
 });
 const father=itemDiscovered(state,'father')?{...props.father,id:'father',disabled:busy||!canUseFather||!itemUnlocked(state,'father')||!!state.fatherUsed,used:!!state.fatherUsed}:null;
 const excluded=new Set([...SUPPLY_CARDS.map(x=>x.id),'father','mochiko','celebration','tradingNotes','dailyDrink','chocolate','eyeMask']);
 const unknownWork=[...new Map(jobs.filter(job=>job.rewardId&&(job.rewardId==='memo'?!notesOwned:!state.workInventory?.[job.rewardId])).map(job=>[job.rewardId,job])).values()];
 const unknown=Object.keys(props).filter(id=>!excluded.has(id)&&!itemDiscovered(state,id)).length+unknownWork.length;
 return {supplies,work,father,unknown,unknownWork,count:supplies.length+work.length+(father?1:0)};
}
export function loadInventoryStyles(doc){
 if(doc.getElementById('inventory-view-style'))return;
 const link=doc.createElement('link');link.id='inventory-view-style';link.rel='stylesheet';link.href=new URL('./inventory-view.css',import.meta.url).href;doc.head.append(link);
}
// Keep live controls in place between quote paints. Only a replaced run/day or
// a genuinely added/removed item changes node identity, never routine rendering.
const inventoryViews=new WeakMap();
export function renderInventory({document:doc,box,model,context=''}){
 const focused=doc.activeElement?.dataset?.prop;
 const make=(tag,cls,text)=>{const node=doc.createElement(tag);node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const text=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
 const icon=id=>{const node=doc.createElementNS('http://www.w3.org/2000/svg','svg');node.setAttribute('viewBox','0 0 24 24');node.setAttribute('aria-hidden','true');node.setAttribute('class','inventory-symbol');const path=doc.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',ICON_PATHS[id]||ICON_PATHS.work);node.append(path);return node;};
 const use=id=>{const button=make('button','inventory-use');button.type='button';button.dataset.prop=id;return button;};
 const updateUse=(button,item)=>{text(button,item.pending?'待下次睡眠':item.used?'今日已用':'使用');button.disabled=item.disabled;};
 let ui=inventoryViews.get(box);
 if(!ui||ui.context!==context||ui.supplies.parentElement!==box){
  box.classList.add('inventory-view');box.replaceChildren();
  const section=(label,cls)=>{const node=make('section',cls);node.append(make('h3','inventory-heading',label));box.append(node);return node;};
  const supplies=section('每日补给','inventory-supplies'),grid=make('div','inventory-supply-grid');supplies.append(make('p','inventory-note','每天一次；泡面和外卖二选一。体力最高恢复至 100。'),grid);
  const work=section('随身工作物品','inventory-work'),empty=make('p','inventory-note','打工获得的物品会收在这里。');
  ui={context,supplies,grid,work,empty,supplyCards:new Map(),workCards:new Map(),father:null,collection:null};inventoryViews.set(box,ui);
 }
 const wantedSupplies=new Set();
 for(const spec of model.supplies){
  wantedSupplies.add(spec.id);let row=ui.supplyCards.get(spec.id);
  if(!row){const card=make('article','inventory-card'),title=make('h4',''),price=make('strong','inventory-price'),effect=make('p','inventory-effect'),detail=make('p','inventory-detail'),button=use(spec.id);card.dataset.supply=spec.id;card.append(icon(spec.icon),title,price,effect,detail,button);ui.grid.append(card);row={card,title,price,effect,detail,button};ui.supplyCards.set(spec.id,row);}
  text(row.title,spec.name);text(row.price,spec.cost===0?'免费':`¥${spec.cost.toLocaleString('zh-CN')}`);text(row.effect,spec.effect);text(row.detail,spec.detail);updateUse(row.button,spec);
 }
 for(const [id,row]of ui.supplyCards)if(!wantedSupplies.has(id)){row.card.remove();ui.supplyCards.delete(id);}
 if(model.work.length)ui.empty.remove();else if(ui.empty.parentElement!==ui.work)ui.work.append(ui.empty);
 const wantedWork=new Set();
 for(const item of model.work){
  wantedWork.add(item.id);let row=ui.workCards.get(item.id);
  if(!row){const card=make('article','inventory-work-item'),title=make('h4',''),detail=make('p','inventory-detail'),effect=make('p','inventory-effect');card.append(icon('work'),title,detail,effect);ui.work.append(card);row={card,title,detail,effect,control:null,active:null};ui.workCards.set(item.id,row);}
  text(row.title,item.name);text(row.detail,item.source);text(row.effect,item.effect);
  if(row.active!==item.active){row.control?.remove();row.control=item.active?use('tradingNotes'):make('small','inventory-passive');row.card.append(row.control);row.active=item.active;}
  if(item.active)updateUse(row.control,item);else text(row.control,item.collectibleOnly?'工作纪念物':'随身生效');
 }
 for(const [id,row]of ui.workCards)if(!wantedWork.has(id)){row.card.remove();ui.workCards.delete(id);}
 if(model.father){
  if(!ui.father){const button=make('button','inventory-father'),title=make('b',''),detail=make('small','');button.type='button';button.dataset.prop='father';button.id='father';button.append(title,detail);box.insertBefore(button,ui.collection?.root||null);ui.father={button,title,detail};}
  ui.father.button.disabled=model.father.disabled;text(ui.father.title,model.father.name);text(ui.father.detail,model.father.used?'已取用':model.father.caption);
 }else if(ui.father){ui.father.button.remove();ui.father=null;}
 if(model.unknown){
  if(!ui.collection){const root=make('details','inventory-collection'),summary=make('summary',''),note=make('p','inventory-note','继续打工，收集不同工作的纪念品。');root.append(summary,note);box.append(root);ui.collection={root,summary,rows:new Map()};}
  text(ui.collection.summary,`未获得收藏 · ${model.unknown} 件`);const wanted=new Set();
  for(const job of model.unknownWork){const id=job.rewardId;wanted.add(id);let row=ui.collection.rows.get(id);if(!row){row=make('p','inventory-detail');ui.collection.rows.set(id,row);ui.collection.root.append(row);}text(row,`${job.rewardLabel} · ${job.label}获得`);}
  for(const [id,row]of ui.collection.rows)if(!wanted.has(id)){row.remove();ui.collection.rows.delete(id);}
 }else if(ui.collection){ui.collection.root.remove();ui.collection=null;}
 if(focused&&!box.contains(doc.activeElement)){const replacement=[...box.querySelectorAll('[data-prop]')].find(n=>n.dataset.prop===focused&&!n.disabled);replacement?.focus({preventScroll:true});}
}
