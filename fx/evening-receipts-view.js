import {setImage} from './assets.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
import {comicReceiptText} from './event-comic-presenter.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
// The daily story already owns settlement, trade recap and the living receipt.
// Keep other durable same-day events in that very window, not another modal.
export function eveningReceiptScenes(scenes,{day,narrative}={}){
 const duplicate=new Set(['father-discover',...(narrative?.event?.key==='fatherFound'?['father-found']:[])]);
 return scenes.filter(scene=>scene.receipt?.day===day&&!duplicate.has(scene.id)&&!scene.id.startsWith('settled-')&&!scene.id.startsWith('living-')&&!['friend-treat','walkaway','closed-profit','half-profit','stop-loss','liquidation'].includes(scene.id));
}
export function mountEveningReceipts(container,scenes){
 const signature=JSON.stringify(scenes.map(s=>[s.receiptKey,s.result,s.lines]));
 if(container.dataset.receipts===signature)return;
 container.dataset.receipts=signature;const doc=container.ownerDocument,oldOpen=new Map([...container.querySelectorAll('details')].map(x=>[x.dataset.receiptKey,x.open]));
 container.replaceChildren();container.hidden=!scenes.length;if(!scenes.length)return;
 const heading=doc.createElement('h3');heading.textContent='今天发生的事';container.append(heading);
 for(const scene of scenes){
  const detail=doc.createElement('details');detail.className='evening-receipt';detail.dataset.receiptKey=scene.receiptKey;
  detail.open=oldOpen.has(scene.receiptKey)?oldOpen.get(scene.receiptKey):scene.id.startsWith('father-');
  const summary=doc.createElement('summary');summary.textContent=[scene.title,comicReceiptText(scene)].filter(Boolean).join(' · ');detail.append(summary);
  const content=doc.createElement('div');content.className='evening-receipt-content';
  if(scene.ready){const image=doc.createElement('img');image.alt=scene.art.alt||scene.title;image.width=scene.art.width;image.height=scene.art.height;setImage(image,scene.art.path);content.append(image);}
  const lines=doc.createElement('div');for(const [speaker,text] of scene.lines){const p=doc.createElement('p');p.textContent=`${speaker}：${text}`;lines.append(p);}content.append(lines);detail.append(content);container.append(detail);
 }
}
