import {isOrdinaryLive,liveQuote,liveSymbol,liveStatusLabel} from './live-market-state.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
const tokyo=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
export function tokyoWallClock(at=Date.now()){
 if(!Number.isFinite(at))return '当前东京时间不可用';
 const p=Object.fromEntries(tokyo.formatToParts(new Date(at)).map(x=>[x.type,x.value]));
 return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} JST`;
}
export function liveMarketNotice(state){
 if(!isOrdinaryLive(state))return {visible:false,closed:false,message:''};
 const q=liveQuote(state),market=state.liveMarket,status=market.statuses?.[liveSymbol(state)];
 const closed=market.transport==='online'&&status==='closed'&&q?.providerMarketState==='closed';
 const message=closed?'当前市场休市，实时模式暂不能交易，当前显示最后报价。':market.transport!=='online'?(q?'行情连接状态未知，当前保留最后报价。':'正在连接实时行情，暂未收到报价。'):!q?'正在等待实时报价。':status==='stale'||q.providerStale?'行情更新有延迟，当前保留最后报价。':status!=='current'?'行情状态待确认，当前保留最后报价。':'';
 const statusLabel=closed?'休市 · 最后报价':market.transport!=='online'?(market.transport==='denied'?'行情暂不可用':'行情连接中'):q?.providerMarketState==='closed'?'行情状态待确认 · 最后报价':liveStatusLabel(state);
 return {visible:true,closed,message,statusLabel};
}
// Wall-clock paint is isolated from game render/step/save and never replaces a
// trading control. The persistent notice uses existing provider status only.
export function mountLiveMarketNotice({root=document,getState,now=Date.now,schedule=(fn,ms)=>setInterval(fn,ms),cancel=clearInterval,motionEnabled=()=>true}={}){
 const box=root.createElement('section'),clock=root.createElement('p'),card=root.createElement('p');box.id='live-market-notice';box.className='live-market-notice';clock.className='live-wall-clock';clock.setAttribute('aria-live','off');card.className='live-market-condition';card.setAttribute('role','status');card.setAttribute('aria-live','polite');box.append(clock,card);let disposed=false,closed=false,message='',transitioning=false;
 const preference=root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
 const text=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
 const settle=()=>{
  transitioning=false;card.dataset.curtainMotion='false';
  for(const key of ['height','opacity','padding-top','padding-bottom'])card.style.removeProperty(key);
  card.hidden=!message;card.dataset.curtainPhase=closed?'open':message?'notice':'closed';
 };
 const transition=(opening,height)=>{
  card.hidden=false;card.dataset.curtainMotion='false';card.style.height=(opening?0:height)+'px';card.style.opacity=opening?'0':'1';card.style.paddingTop=card.style.paddingBottom=opening?'0px':'6px';
  // Commit the start height before enabling the single state-change transition.
  void card.offsetHeight;
  transitioning=true;card.dataset.curtainPhase=opening?'opening':'closing';card.dataset.curtainMotion='true';card.style.height=(opening?height:0)+'px';card.style.opacity=opening?'1':'0';card.style.paddingTop=card.style.paddingBottom=opening?'6px':'0px';
 };
 const refresh=()=>{
  if(disposed)return;
  const animate=motionEnabled()&&!preference?.matches;if(transitioning&&!animate)settle();if(root.hidden)return;
  const model=liveMarketNotice(getState());box.hidden=!model.visible;if(!model.visible){closed=false;message='';text(card,'');settle();return;}
  const host=root.getElementById('pixel-frontend')?.querySelector('.pixel-notices')||root.getElementById('terminal');if(host&&box.parentElement!==host)host.prepend(box);
  const wasClosed=closed,height=card.hidden?0:card.getBoundingClientRect().height;closed=model.closed;message=model.message;
  text(clock,'当前东京时间：'+tokyoWallClock(now()));text(card,message);card.dataset.marketClosed=String(closed);
  if(closed&&!wasClosed){settle();const target=card.getBoundingClientRect().height;if(animate&&target>0)transition(true,target);}
  else if(wasClosed&&!closed&&!message&&animate&&height>0){settle();transition(false,height);}
  else if(!closed&&!(transitioning&&!message&&!wasClosed))settle();
 };
 const ended=event=>{if(event.target===card&&event.propertyName==='height')settle();};
 const reduced=()=>{if(preference.matches)settle();};
 const visibility=()=>{if(root.hidden)settle();else refresh();};const timer=schedule(refresh,1000);
 card.addEventListener('transitionend',ended);preference?.addEventListener?.('change',reduced);
 root.addEventListener?.('visibilitychange',visibility);root.defaultView?.addEventListener?.('pageshow',refresh);refresh();
 return {refresh,element:box,clock,card,dispose(){disposed=true;settle();cancel(timer);card.removeEventListener('transitionend',ended);preference?.removeEventListener?.('change',reduced);root.removeEventListener?.('visibilitychange',visibility);root.defaultView?.removeEventListener?.('pageshow',refresh);box.remove();}};
}
