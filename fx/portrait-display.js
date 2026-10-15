import {setImage,retryImage} from './assets.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
const notices=new WeakMap();
export function showGeneratedPortrait(image,portrait){
 image.parentElement?.classList.toggle('portrait-preserve-whole',portrait.preserveWholeImage===true);
 image.alt=`久留美 · ${portrait.label}`;image.dataset.mood=portrait.emotion;image.loading='eager';image.decoding='async';
 setImage(image,portrait.path,{onStatus:status=>{
  let notice=notices.get(image);
  if(status!=='unavailable'){notice?.remove();notices.delete(image);image.hidden=false;return;}
  image.hidden=true;if(notice)return;
  const doc=image.ownerDocument;notice=doc.createElement('div');notice.className='portrait-load-status';notice.setAttribute('role','status');
  const label=doc.createElement('p'),retry=doc.createElement('button');label.textContent='表情图片暂时未载入';retry.type='button';retry.textContent='重新加载表情';retry.onclick=()=>retryImage(image);notice.append(label,retry);image.parentElement?.append(notice);notices.set(image,notice);
 }});
}
