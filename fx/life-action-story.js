import {currentLifeSceneReceipt} from './life-scene-consumer.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';
import {APPROVED_FOUR_SKITS} from './copy/approved-four-skits.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS} from './approved-four-skit-assets.js?v=dc2d3c2c7c850feefe871b0398d0d71c5f530df2-23f2a20b7717';

// A committed exchange is already trusted by validLifeActions. Render those
// exact bytes, never infer a missing story from its label or borrow other art.
export function lifeActionStory(state){
 const receipt=currentLifeSceneReceipt(state);
 if(!receipt?.dialogue?.lines?.length)return null;
 const scene={id:`life-dialogue:${receipt.id}`,identity:`life-dialogue:${receipt.id}`,title:receipt.label,
  ready:true,dialogueOnly:true,receiptDialogue:true,lifeScene:true,
  lines:receipt.dialogue.lines.map(({from,text})=>[from,text]),receiptKey:receipt.id,receiptBinding:JSON.stringify(receipt),
  day:state.day,runId:String(state.runId??`seed:${state.seed}:${state.mode}`),dayKey:`${state.runId||state.seed}:${state.day}`};
 const shrine=APPROVED_FOUR_SKITS['shrine-walk'],art=APPROVED_FOUR_SKIT_ASSETS['shrine-walk'];
 if(receipt.category==='relax'&&receipt.optionId==='shrine'&&art?.reviewed&&art.panels===4&&JSON.stringify(scene.lines)===JSON.stringify(shrine.lines))return {...scene,title:shrine.title,dialogueOnly:false,art:structuredClone(art),dialoguePanels:structuredClone(shrine.dialoguePanels),reusedArtwork:true};
 return scene;
}

// Legacy browsers have no IntersectionObserver. Intersect each line with the
// viewport and every overflow-clipping ancestor, not just the window bounds.
function fallbackLineVisible(line,win){
 const r=line.getBoundingClientRect?.();
 if(!r||r.width<=0||r.height<=0||line.isConnected===false)return false;
 let left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(win.innerWidth,r.right),bottom=Math.min(win.innerHeight,r.bottom);
 for(let node=line;node;node=node.parentElement){
  const style=win.getComputedStyle?.(node);
  if(node.hidden||style?.display==='none'||style?.visibility==='hidden'||style?.visibility==='collapse')return false;
  if(node===line)continue;
  const clips=value=>/^(auto|scroll|hidden|clip|overlay)$/.test(value||'');
  const clipX=clips(style?.overflowX||style?.overflow),clipY=clips(style?.overflowY||style?.overflow);
  if(!clipX&&!clipY)continue;
  const box=node.getBoundingClientRect?.();if(!box)return false;
  const scaleX=node.offsetWidth>0?box.width/node.offsetWidth:1,scaleY=node.offsetHeight>0?box.height/node.offsetHeight:1;
  const x=box.left+(node.clientLeft||0)*scaleX,y=box.top+(node.clientTop||0)*scaleY;
  const width=Number.isFinite(node.clientWidth)?node.clientWidth*scaleX:box.width,height=Number.isFinite(node.clientHeight)?node.clientHeight*scaleY:box.height;
  if(clipX){left=Math.max(left,x);right=Math.min(right,x+width);}
  if(clipY){top=Math.max(top,y);bottom=Math.min(bottom,y+height);}
 }
 // Preserve this fallback's existing full-line threshold. Lines may become
 // visible at different scroll positions; accumulate only witnessed lines.
 return left<=r.left&&right>=r.right&&top<=r.top&&bottom>=r.bottom;
}

// Text is acknowledged only after every actual line has entered the viewport.
// No account/story mutation, and no picture or four-panel completion is implied.
export function mountLifeActionStory(host,scene,{memory}={}){
 const doc=host.ownerDocument,win=doc.defaultView,lines=[];let stopped=false,completed=false,observer=null;
 host.classList?.add('life-action-story');
 for(const [from,text] of scene.lines){const line=doc.createElement('p');line.textContent=`${from}：${text}`;host.append(line);lines.push(line);}
 const seen=new Set(),finish=()=>{if(!stopped&&!completed&&!doc.hidden&&seen.size===lines.length){completed=true;memory?.seen([scene.identity]);observer?.disconnect();}};
 if(win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{if(stopped||doc.hidden)return;for(const entry of entries)if(entry.isIntersecting&&entry.intersectionRatio>=.9)seen.add(entry.target);finish();},{threshold:[.9]});lines.forEach(line=>observer.observe(line));}
 const check=()=>{if(stopped||completed||doc.hidden)return;for(const line of lines)if(fallbackLineVisible(line,win))seen.add(line);finish();};
 if(!observer){win?.addEventListener?.('scroll',check,true);win?.addEventListener?.('resize',check);check();}
 return {dispose(){stopped=true;observer?.disconnect();win?.removeEventListener?.('scroll',check,true);win?.removeEventListener?.('resize',check);}};
}
