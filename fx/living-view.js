const yen=n=>'¥'+Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
export function mountLivingReceipt(container,receipt,{motion=true,reducedMotion=false,onSound=()=>{},onReady=()=>{},requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const doc=container.ownerDocument;container.replaceChildren();container.hidden=false;container.className='living-receipt';
 const summary=doc.createElement('div');summary.className='living-receipt-summary';
 const h=doc.createElement('h3');h.textContent='生活费 −'+yen(receipt.amount||0);const balance=doc.createElement('p');summary.append(h,balance);container.append(summary);
 const skip=doc.createElement('button');skip.type='button';skip.className='secondary';skip.textContent='跳过动画';container.append(skip);
 const end=Number.isFinite(receipt.netAssetsAfter)?receipt.netAssetsAfter:null,start=Number.isFinite(receipt.netAssetsBefore)?receipt.netAssetsBefore:end,duration=motion&&!reducedMotion&&!receipt.legacy?1200:0,started=now();let frame=null,stopped=false,ready=false;
 const draw=p=>{if(end!==null){const value=start===null?end:start+(end-start)*(1-(1-p)**3);balance.textContent='净资产 '+(value<0?'−':'')+yen(value);}if(p===1&&!ready){ready=true;skip.hidden=true;onReady();}};
 const tick=t=>{if(stopped)return;const p=duration?Math.min(1,(t-started)/duration):1;draw(p);if(p<1)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;if(frame!==null)cancelFrame(frame);};
 skip.onclick=()=>{cancel();draw(1);};
 if(duration){onSound(receipt.amount?'exhaust':'defend',{level:.3,rate:1});draw(0);frame=requestFrame(tick);}else draw(1);
 return{finish(){cancel();draw(1);},dispose:cancel};
}
