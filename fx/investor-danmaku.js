import {MARKET_COMMENTS} from './market-comments.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export const COMMENT_REPEAT_GAP=30000;
// Activity is derived only from revealed candles and completed/recorded actions.
// Never read a planned quote track, reroll RNG, write a save, or affect execution.
export function marketCommentActivity(state={}){
 const day=state.day,beat=Number.isFinite(state.beat)?state.beat:0;
 const candles=(state.candles||[]).filter(c=>c?.closed&&!c.historical&&c.day===day&&c.open>0).slice(-4);
 const movement=candles.length?candles.reduce((sum,c)=>sum+Math.abs(c.close/c.open-1),0)/candles.length:0;
 const trades=(state.runStatistics?.trades||state.history||[]).filter(t=>t?.day===day&&t.beat>=Math.max(0,beat-1)&&t.beat<=beat).length;
 const event=state.lastEvent,revealedShock=state.swanSeen===true&&event?.swan===true&&event.day===day&&event.beat>=beat-1&&event.beat<=beat;
 const score=clamp(Math.max(movement/.0015,trades/5,(state.heat||0)/5,revealedShock?1:0));
 return score>=.66?{level:'hot',interval:2000,pixelsPerSecond:100,lanes:4}:score>=.25?{level:'active',interval:3600,pixelsPerSecond:72,lanes:3}:{level:'quiet',interval:9000,pixelsPerSecond:48,lanes:2};
}
export function eligibleMarketComments(comments=MARKET_COMMENTS){
 return comments.filter(row=>row.release_enabled===true&&/^CC-BY-SA-(3\.0|4\.0)$/.test(row.license)&&row.attribution_display&&row.source_title&&row.source_url?.startsWith('https://')&&row.license_url?.startsWith('https://creativecommons.org/')&&row.original&&row.zh_translation&&row.translation_note);
}
// A lane keeps its speed until empty. A following line may enter once the
// preceding tail has cleared the right edge by 42px, so it cannot catch up.
export const COMMENT_LANE_GAP=42;
export function createCommentSchedule({comments=MARKET_COMMENTS,measureWidth=text=>text.length*14}={}){
 const pool=eligibleMarketComments(comments),seen=new Map(),lanes=Array(4).fill(null);let cursor=0,laneCursor=0,clock=0,wall=null,paused=true,nextAt=0,key=null,reduced=null,viewport=null;
 return{
  update(state,{now=0,pause=false,reduce=false,width=400}={}){
   if(wall!==null&&!paused&&!pause)clock+=Math.max(0,Math.min(2000,now-wall)); // no replay after a sleeping tab
   wall=now;paused=pause;
   width=Math.max(200,width||400);
   const run=`${state.mode}:${state.runId||state.seed}`,reset=key!==run||reduced!==reduce||viewport!==width;
   if(reset){key=run;reduced=reduce;viewport=width;lanes.fill(null);laneCursor=0;nextAt=clock;}
   const activity=marketCommentActivity(state),result={clock,reset,paused:pause,reduced:reduce,activity,row:null};
   if(pause||clock<nextAt||!pool.length)return result;
   let lane=reduce?0:-1;
   if(!reduce)for(let n=0;n<activity.lanes;n++){
    const index=(laneCursor+n)%activity.lanes,previous=lanes[index];
    if(!previous||clock>=previous.entryAt){lane=index;break;}
   }
   if(lane<0)return result;
   let row=null;
   for(let n=0;n<pool.length;n++){const index=(cursor+n)%pool.length,candidate=pool[index];if(!seen.has(candidate.zh_translation)||clock-seen.get(candidate.zh_translation)>=COMMENT_REPEAT_GAP){row=candidate;cursor=(index+1)%pool.length;break;}}
   if(!row)return result; // never invent text or shorten the repeat cooldown for density
   const textWidth=Math.max(1,measureWidth(row.zh_translation)),previous=lanes[lane];
   const speed=previous&&previous.expires>clock?previous.speed:activity.pixelsPerSecond;
   const duration=reduce?30000:Math.ceil((width+textWidth)/speed*1000);
   seen.set(row.zh_translation,clock);lanes[lane]={entryAt:clock+(textWidth+COMMENT_LANE_GAP)/speed*1000,expires:clock+duration,speed};
   laneCursor=(lane+1)%activity.lanes;nextAt=clock+Math.max(activity.interval,reduce?30000:0);
   result.row={...row,lane,duration,textWidth,speed,expires:clock+duration};return result;
  }
 };
}
export function createInvestorDanmaku(root,{document=root.ownerDocument,now=()=>performance.now(),comments=MARKET_COMMENTS}={}){
 const canvas=document.createElement('canvas'),context=canvas.getContext?.('2d');
 if(context)context.font='600 13px sans-serif';
 const schedule=createCommentSchedule({comments,measureWidth:text=>context?Math.ceil(context.measureText(text).width)+8:text.length*14});let disposed=false;
 return{
  update(state,{paused=false,reducedMotion=false}={}){
   if(disposed)return;
   const frame=schedule.update(state,{now:now(),pause:paused,reduce:reducedMotion,width:root.clientWidth});
   root.dataset.activity=frame.activity.level;root.dataset.lanes=String(frame.activity.lanes);root.dataset.paused=String(paused);root.dataset.reduced=String(reducedMotion);
   if(frame.reset){const retained=reducedMotion?[...root.children].at(-1):null;root.replaceChildren();if(retained)root.append(retained);}
   for(const child of [...root.children])if(!reducedMotion&&Number(child.dataset.expires)<=frame.clock)child.remove();
   if(!frame.row)return;
   if(reducedMotion)root.replaceChildren();
   const line=document.createElement('li');line.className='investor-danmaku-line';line.textContent=frame.row.zh_translation;
   line.dataset.commentId=frame.row.id;line.dataset.lane=String(frame.row.lane);line.dataset.speed=String(frame.row.speed);line.dataset.expires=String(frame.row.expires);
   line.style.setProperty('--comment-width',`${frame.row.textWidth}px`);line.style.setProperty('--comment-lane',frame.row.lane);line.style.setProperty('--comment-duration',`${frame.row.duration}ms`);line.style.setProperty('--comment-travel',`${Math.max(200,root.clientWidth||400)}px`);
   line.addEventListener('animationend',()=>line.remove(),{once:true});root.append(line);
  },
  dispose(){disposed=true;root.replaceChildren();}
 };
}
export function mountCommentCredits(root,{document=root.ownerDocument,comments=MARKET_COMMENTS}={}){
 root.replaceChildren();
 const intro=document.createElement('p');intro.textContent='这些短评摘自公开外汇讨论，由英文节选翻译。它们不是剧情年代的实时聊天，也不代表已核验的交易记录。';root.append(intro);
 for(const row of eligibleMarketComments(comments)){
  const section=document.createElement('section'),title=document.createElement('h3'),quote=document.createElement('p'),original=document.createElement('p'),credit=document.createElement('p'),source=document.createElement('a'),license=document.createElement('a'),changes=document.createElement('p');
  title.textContent=row.zh_translation;original.textContent=row.original;original.lang='en';credit.textContent=`${row.attribution_display} · ${row.source_date.slice(0,10)} · Personal Finance & Money Stack Exchange`;
  source.href=row.source_url;source.textContent=row.source_title;license.href=row.license_url;license.textContent=row.license;license.rel='license noopener noreferrer';source.rel='noopener noreferrer';source.target=license.target='_blank';
  changes.textContent=`${row.translation_note} ${row.translation_credit}，按 ${row.license} 共享。`;quote.append(source,document.createTextNode(' · '),license);section.append(title,original,credit,quote,changes);root.append(section);
 }
 const policy=document.createElement('a');policy.href='https://stackoverflow.com/help/licensing';policy.textContent='Stack Exchange 内容许可说明';policy.target='_blank';policy.rel='noopener noreferrer';root.append(policy);
}
