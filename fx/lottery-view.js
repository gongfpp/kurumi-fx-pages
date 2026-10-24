import {LotteryPresentation} from './lottery-presentation.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {bindTradeActivation} from './trade-activation.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
// Candidate renderer only: no CSS or app mount is selected before visual review.
// The host supplies its existing container and its durable settlement receipt.
export function mountLotteryView(root,{ticket,saved=false,now,schedule=callback=>requestAnimationFrame(callback),cancel=id=>cancelAnimationFrame(id),onClose=()=>{},reducedMotion=false}={}){
 const doc=root.ownerDocument,number=doc.createElement('div'),prize=doc.createElement('p'),skip=doc.createElement('button'),close=doc.createElement('button');
 number.setAttribute('aria-hidden','true');prize.setAttribute('role','status');prize.setAttribute('aria-live','polite');skip.type=close.type='button';skip.textContent='跳过动画';close.textContent='关闭';
 let handle=null,disposed=false;
 const controller=new LotteryPresentation({now,onFrame:frame=>{
  if(disposed)return;number.textContent=frame.digits.map(d=>d.value).join(' ');
  if(frame.status==='revealed'){prize.textContent=frame.receipt.prize>0?`票号 ${frame.receipt.number} · 奖金 ¥${frame.receipt.prize.toLocaleString('zh-CN')}`:`票号 ${frame.receipt.number} · 本次未中奖`;skip.hidden=true;}
 }});
 // Validate before replacing any host content.
 controller.open(ticket,{saved,reducedMotion});
 root.replaceChildren(number,prize,skip,close);
 const tick=()=>{handle=null;if(disposed)return;if(controller.frame().status==='running')handle=schedule(tick);};
 const stop=()=>{if(handle!==null)cancel(handle);handle=null;};
 const dispose=()=>{if(disposed)return;stop();controller.close();disposed=true;skip.removeEventListener('click',onSkip);close.removeEventListener('click',onDismiss);};
 const onSkip=()=>{stop();controller.skip();};
 const onDismiss=()=>{if(disposed)return;dispose();root.replaceChildren();onClose();};
 skip.addEventListener('click',onSkip);close.addEventListener('click',onDismiss);if(controller.status==='running')handle=schedule(tick);
 return {controller,skip:onSkip,close:onDismiss,dispose};
}

// Mount into the existing daily supply area; styles remain owned by the host.
// The host executes and saves game actions; updates preserve the live controls.
export function mountLotteryCard(root,{state={},getContext=()=>'',onPurchase=()=>{},onCode=()=>{},onOpen=()=>{},onError=()=>{}}={}){
 const doc=root.ownerDocument,card=doc.createElement('article'),title=doc.createElement('h3'),description=doc.createElement('p'),status=doc.createElement('p'),purchase=doc.createElement('button'),code=doc.createElement('input'),redeem=doc.createElement('button'),open=doc.createElement('button');
 card.className='lottery-card';title.textContent='每日彩票';description.textContent='本作原创玩法 · 每张 ¥300，每天限购一张，次个游戏日 18:00 开奖。提前收盘时随日结揭晓。';status.setAttribute('role','status');
 purchase.type=redeem.type=open.type='button';
 code.type='text';code.autocomplete='off';code.setAttribute('aria-label','彩票暗号');code.placeholder='输入暗号';code.maxLength=80;redeem.textContent='兑换暗号';open.textContent='查看开奖结果';
 const context=getContext();let disposed=false,busy=false,externalBusy=false,latest=null;
 const current=()=>!disposed&&getContext()===context;
 const text=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
 const update=(next=state,{busy:blocked=false}={})=>{
  if(disposed)return;state=next;externalBusy=blocked;
  const tickets=state.lottery?.tickets||[],today=tickets.find(t=>t.kind==='normal'&&t.purchaseDay===state.day),pending=tickets.find(t=>t.status==='pending');latest=tickets.at(-1);
  text(purchase,today?'今日已购票':'购买一张 · ¥300');purchase.disabled=!current()||busy||externalBusy||!!today||state.mode!=='story'||state.phase==='ending';
  text(status,pending?`票号 ${pending.number??pending.id} · 等待开奖`:latest?.status==='settled'?`票号 ${latest.number??latest.id} · 已开奖`:'今天还没有待开奖的彩票。');
  code.disabled=state.lottery?.cheatRedeemed===true;redeem.disabled=!current()||busy||externalBusy||code.disabled;open.hidden=latest?.status!=='settled';open.disabled=!current()||busy||externalBusy;
 };
 const run=async(action)=>{if(busy||externalBusy||!current())return;busy=true;update(state,{busy:externalBusy});try{await action();}catch(error){if(current())onError(error);}finally{busy=false;if(current())update(state,{busy:externalBusy});}};
 const buy=()=>{if(!purchase.disabled)return run(onPurchase);},exchange=()=>{if(!redeem.disabled)return run(()=>onCode(code.value));},reveal=()=>{if(current()&&!open.disabled&&!open.hidden)onOpen(latest);};
 const unbind=[bindTradeActivation(purchase,buy,{getToken:getContext,canInteract:current}),bindTradeActivation(redeem,exchange,{getToken:()=>JSON.stringify([getContext(),code.value]),canInteract:current}),bindTradeActivation(open,reveal,{getToken:()=>JSON.stringify([getContext(),latest?.id]),canInteract:current})];
 card.append(title,description,status,purchase,code,redeem,open);root.replaceChildren(card);update();
 return {root,context,update,controls:{purchase,code,redeem,open},dispose(){disposed=true;for(const stop of unbind)stop();},purchase:buy,redeem:exchange,open:reveal};
}
