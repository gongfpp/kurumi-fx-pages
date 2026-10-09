import {selectTradingExpressionAsset} from './asset-usage-catalog.js?v=a3f9eecb8c4bffe5ed12deeae323a4a94c9c180e-23f2a20b7717';
import {assetURL} from './assets.js?v=a3f9eecb8c4bffe5ed12deeae323a4a94c9c180e-23f2a20b7717';
import {createExpressionObserver,createExpressionGate,tradingExpressionSnapshot,expressionEvent,expressionForTrades,expressionThought} from './trading-expression-events.js?v=a3f9eecb8c4bffe5ed12deeae323a4a94c9c180e-23f2a20b7717';

export function mountTradingExpression({portrait,speech,getState,canEnter=()=>true,doc=portrait.ownerDocument,now=()=>Date.now(),selectAsset=selectTradingExpressionAsset}){
 const win=doc.defaultView,observer=createExpressionObserver({now}),gate=createExpressionGate({now});
 const panel=doc.createElement('div'),img=doc.createElement('img'),close=doc.createElement('button'),thought=doc.createElement('div');
 panel.id='trading-expression';panel.className='trading-expression';panel.hidden=true;
 img.alt='';close.type='button';close.className='trading-expression-close';close.textContent='×';close.setAttribute('aria-label','收起交易表情');
 panel.append(img,close);portrait.append(panel);thought.className='trading-expression-thought';thought.hidden=true;thought.setAttribute('role','status');thought.setAttribute('aria-live','polite');speech.append(thought);
 let shown=null,expire=null,hesitation=null,suspended=false,seed=0,shownAsset=null,selectionSeed=0,placementFrame=null,cachedSelectionKey='',cachedSelection=null;
 function selectForSize(context,width,height){
  const key=JSON.stringify([context.event,context.direction,context.position,context.profitBasis,context.pnlSign,context.previousPnlSign,context.seed,width,height]);
  if(key===cachedSelectionKey)return cachedSelection;cachedSelectionKey=key;
  const asset=selectAsset({...context,maxDisplayWidth:width,maxDisplayHeight:height});
  // Embedded lettering gets a separate close strip, never a button on the art.
  return cachedSelection=asset?.hasEmbeddedText?selectAsset({...context,maxDisplayWidth:width,maxDisplayHeight:Math.max(0,height-28)}):asset;
 }
 const overlaps=(a,b)=>a.left<b.right+5&&a.right>b.left-5&&a.top<b.bottom+5&&a.bottom>b.top-5;
 function place(){
  if(!shown)return;
  const r=portrait.getBoundingClientRect(),height=win.innerHeight,width=doc.documentElement.clientWidth;
  const attached=r.top>=0&&r.bottom<=height;
  const asset=selectForSize({...shown,seed:selectionSeed},attached?Math.max(0,r.width-4):64,attached?Math.max(0,r.height-4):90);
  if(asset&&asset.id!==shownAsset?.id)paintAsset(asset);
  if(attached){if(panel.parentNode!==portrait)portrait.append(panel);if(thought.parentNode!==speech)speech.append(thought);panel.classList.remove('is-detached');panel.style.removeProperty('left');panel.style.removeProperty('top');return;}
  // Mobile may be scrolled down to the ticket. Find a genuinely free area,
  // excluding every input/button and chart/risk readout rather than using a
  // blind fixed toast that could cover the very order being placed.
  const blockers=[...doc.querySelectorAll('button,input,select,textarea,a,summary,[role="button"],#chart,.risk-line,.risk-progress,.position-risk-label,.liquidation-meter,#order-validation,#preview-liquidation,.amount-controls')].filter(n=>!panel.contains(n)&&n.getClientRects().length).map(n=>n.getBoundingClientRect()).filter(b=>b.bottom>0&&b.top<height);
  const w=Math.min(208,width-16),h=94;let spot=null;
  for(let y=8;y+h<=height-8&&!spot;y+=8)for(const x of [width-w-8,8]){const box={left:x,right:x+w,top:y,bottom:y+h};if(!blockers.some(b=>overlaps(box,b))){spot=box;break;}}
  if(!spot){if(panel.parentNode!==portrait)portrait.append(panel);if(thought.parentNode!==speech)speech.append(thought);panel.classList.remove('is-detached');panel.style.removeProperty('left');panel.style.removeProperty('top');return;}
  if(panel.parentNode!==doc.body)doc.body.append(panel);if(thought.parentNode!==panel)panel.append(thought);panel.classList.add('is-detached');panel.style.left=spot.left+'px';panel.style.top=spot.top+'px';
 }
 win.addEventListener('scroll',place,{passive:true});win.addEventListener('resize',place);
 const blocked=()=>suspended||doc.hidden||!!doc.querySelector('dialog[open]')||!tradingExpressionSnapshot(getState()).active;
 function cancelHesitation(){win.clearTimeout(hesitation);hesitation=null;}
 function hide({dismiss=false}={}){cancelHesitation();win.cancelAnimationFrame(placementFrame);placementFrame=null;win.clearTimeout(expire);shown=null;panel.hidden=true;thought.hidden=true;thought.textContent='';if(panel.parentNode!==portrait)portrait.append(panel);if(thought.parentNode!==speech)speech.append(thought);panel.classList.remove('is-detached');if(dismiss)gate.dismiss();}
 function suspend(){suspended=true;observer.reset();hide({dismiss:true});}
 function paintAsset(asset){
  shownAsset=asset;panel.classList.toggle('has-embedded-text',!!asset.hasEmbeddedText);panel.dataset.assetId=asset.id;img.src=assetURL(asset.path);
  img.alt=asset.hasEmbeddedText?(asset.textOriginal||asset.displayText||`${asset.character}的交易表情`):`${asset.character}的交易表情`;
  thought.textContent=asset.hasEmbeddedText?'':`${asset.character}心想：${expressionThought(shown.event,shown.direction)}`;
  thought.hidden=!!asset.hasEmbeddedText;
 }
 function emit(e){
  if(!e||blocked()||shown)return false;
  const r=portrait.getBoundingClientRect(),attached=r.top>=0&&r.bottom<=win.innerHeight;
  const text=expressionThought(e.event,e.direction),asset=selectForSize({...e,seed},attached?Math.max(0,r.width-4):64,attached?Math.max(0,r.height-4):90);
  if(!asset||!text||!gate.accept(e))return false;
  selectionSeed=seed++;shown=e;panel.dataset.event=e.event;panel.dataset.assetId=asset.id;panel.dataset.direction=e.direction;panel.dataset.profitBasis=e.profitBasis;
  // Keep embedded original text whole; thoughts accompany only unlettered art.
  paintAsset(asset);panel.hidden=false;place();
  const followLayout=()=>{if(!shown)return;place();placementFrame=win.requestAnimationFrame(followLayout);};
  placementFrame=win.requestAnimationFrame(followLayout);
  expire=win.setTimeout(()=>hide(),4800);return true;
 }
 img.addEventListener('error',()=>hide());
 close.addEventListener('click',e=>{e.stopPropagation();hide({dismiss:true});});
 doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&shown)hide({dismiss:true});});
 function refresh(){
  if(blocked()){observer.reset();hide();return;}
  const s=tradingExpressionSnapshot(getState());
  if(shown&&(shown.context!==s.context||shown.profitBasis==='floating'&&(s.position==='flat'||shown.positionKey!==s.key||shown.pnlSign!==s.pnlSign||shown.event==='risk-warning'&&!s.atRisk)))hide();
  emit(observer.observe(s));place();
 }
 function bind(button,direction){
  const start=()=>{cancelHesitation();if(button.disabled||blocked()||!canEnter())return;hesitation=win.setTimeout(()=>{hesitation=null;if(!button.disabled&&canEnter())emit(expressionEvent('entry-hesitation',tradingExpressionSnapshot(getState()),{direction}));},1100);};
  button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')start();});
  button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))start();});
  button.addEventListener('pointerleave',cancelHesitation);button.addEventListener('blur',cancelHesitation);
  // Never preventDefault or click; the original order handler alone places orders.
  button.addEventListener('pointerdown',()=>hide());button.addEventListener('click',()=>{cancelHesitation();if(shown?.event==='entry-hesitation')hide();});
 }
 const mutation=new win.MutationObserver(()=>{if(doc.querySelector('dialog[open]')){observer.reset();hide({dismiss:true});}});
 mutation.observe(doc.body,{subtree:true,attributes:true,attributeFilter:['open']});
 win.addEventListener('blur',suspend);win.addEventListener('pagehide',suspend);
 win.addEventListener('focus',()=>{suspended=false;observer.reset();});win.addEventListener('pageshow',()=>{suspended=false;observer.reset();});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)suspend();else{suspended=false;observer.reset();}});
 return {bind,refresh,hide,trade(trades){hide();return emit(expressionForTrades(trades,tradingExpressionSnapshot(getState())));},reset(){observer.reset();hide({dismiss:true});}};
}
