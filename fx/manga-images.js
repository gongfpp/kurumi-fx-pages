import {setImage} from './assets.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717';
const bindings=new WeakMap();
// The main game may observe actual reading; archived consumers remain isolated.
let observeArtwork=null;
export function configureMangaImageObserver(observer){
 if(observer!==null&&typeof observer!=='function')throw new TypeError('Artwork observer must be a function or null');
 observeArtwork=observer;
}
// Lazy non-primary art and an explicit text fallback retain the ledger/context
// even if both the original request and its one ordinary retry fail.
export function setMangaImage(image,path,{loading='lazy'}={}){
 image.loading=loading;image.decoding='async';
 setImage(image,path);
 observeArtwork?.(image,path);
 const current=bindings.get(image),asset=image.dataset.asset;
 if(current?.asset===asset)return;
 current?.note?.remove();
 const state={asset,note:null};bindings.set(image,state);
 const error=image.onerror,loaded=image.onload;
 image.onerror=event=>{
  error?.call(image,event);
  if(bindings.get(image)!==state||!image.classList.contains('image-unavailable')||state.note)return;
  const note=image.ownerDocument.createElement('p');note.className='manga-image-fallback';note.setAttribute('role','status');
  note.textContent='漫画图片暂时无法载入；本局数值与文字说明仍可查看。';
  image.parentElement?.append(note);state.note=note;
 };
 image.onload=event=>{loaded?.call(image,event);state.note?.remove();state.note=null;};
}
