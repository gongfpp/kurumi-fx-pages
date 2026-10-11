import {MARKET_COMMENTS} from './market-comments.js?v=b3055da3d740f3dcd2fbd61cba1846712bfec8b6-23f2a20b7717';
import {currentTradingTimestamp} from './trading-time.js?v=b3055da3d740f3dcd2fbd61cba1846712bfec8b6-23f2a20b7717';
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export const COMMENT_REPEAT_GAP=30000;
export const PLAYER_COMMENT_MAX_LENGTH=30;
// Input is only the existing public comments API response, never composer text.
// Keep the nickname in the same text-only line; Unicode code points match the API.
export function eligiblePlayerComments(rows=[]){
 const ids=new Set();
 return (Array.isArray(rows)?rows:[]).slice(0,50).flatMap(row=>{
  if(!row||typeof row.id!=='string'||!row.id||ids.has(row.id)||typeof row.text!=='string')return [];
  const text=row.text.trim();
  if(!text||[...text].length>PLAYER_COMMENT_MAX_LENGTH)return [];
  ids.add(row.id);
  return [{id:row.id,playerText:text,zh_translation:`${typeof row.alias==='string'&&row.alias?row.alias:'匿名玩家'}：${text}`,source:'player'}];
 });
}
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
// New-batch review distinguishes timeless quoted expressions from concrete
// personal events. Publication year alone does not date a generic thought.
// The preserved legacy 16 records are unchanged and not reclassified here.
function recentRealizedLoss(state,cutoff){
 const trade=state.lastTrade,beat=state.beat;
 return !!trade&&['close','half','stop','liquidation','rescue','closing'].includes(trade.type)&&Number.isFinite(trade.pnl)&&trade.pnl<0&&Number.isFinite(trade.timestamp)&&trade.timestamp<=cutoff&&trade.day===state.day&&Number.isFinite(beat)&&Number.isFinite(trade.beat)&&trade.beat<=beat&&trade.beat>=Math.max(0,beat-1);
}
export function eligibleMarketComments(comments=MARKET_COMMENTS,state=null){
 const cutoff=state===null?Infinity:currentTradingTimestamp(state);
 return comments.filter(row=>{
  if(!row||row.release_enabled!==true||!/^CC-BY-SA-(3\.0|4\.0)$/.test(row.license)||!row.attribution_display||!row.source_title||!row.source_url?.startsWith('https://')||!row.license_url?.startsWith('https://creativecommons.org/')||!row.original||!row.zh_translation||!row.translation_note)return false;
  const created=Date.parse(row.source_date),updated=row.source_updated?Date.parse(row.source_updated):created;
  if(!Number.isFinite(created)||!Number.isFinite(updated))return false;
  if(row.source_batch==='ccse-20261010'){
   // Unreviewed edits, pair-specific material, unknown contexts and anything
   // presented as contemporaneous history still fail closed.
   if(row.edited_contributors_review_required!==false||row.source_updated!==null||row.context_reviewed!==true||row.asset_scope!=='general_trading'||row.contemporaneous_replay_allowed!==false||!Array.isArray(row.candidate_currency_pairs)||row.candidate_currency_pairs.length||!row.reuse_rationale_zh)return false;
   if(row.reuse_scope==='timeless_general_expression')return row.scene_gate==='general_expression';
   if(row.reuse_scope==='dated_personal_event'&&row.scene_gate==='recent_realized_loss')return state===null||Math.max(created,updated)<=cutoff&&recentRealizedLoss(state,cutoff);
   return false;
  }
  return true;
 });
}
// A lane keeps its speed until empty. A following line may enter once the
// preceding tail has cleared the right edge by 42px, so it cannot catch up.
export const COMMENT_LANE_GAP=42;
export function createCommentSchedule({comments=MARKET_COMMENTS,measureWidth=text=>text.length*14}={}){
 const catalogue=eligibleMarketComments(comments),seen=new Map(),shownPlayerIds=new Set(),lanes=Array(4).fill(null);let playerPool=[],marketSincePlayer=0,cursor=0,laneCursor=0,clock=0,wall=null,paused=true,nextAt=0,key=null,reduced=null,viewport=null;
 return{
  // Replace the public snapshot, rather than append on every poll or resume.
  setPlayerComments(rows){playerPool=eligiblePlayerComments(rows);},
  update(state,{now=0,pause=false,reduce=false,width=400}={}){
   if(wall!==null&&!paused&&!pause)clock+=Math.max(0,Math.min(2000,now-wall)); // no replay after a sleeping tab
   wall=now;paused=pause;
   width=Math.max(200,width||400);
   const pool=eligibleMarketComments(catalogue,state),run=`${state.mode}:${state.runId||state.seed}:${pool.map(row=>row.id).join(',')}`,scopeChanged=key!==run,reset=scopeChanged||reduced!==reduce||viewport!==width;
   if(reset){key=run;reduced=reduce;viewport=width;lanes.fill(null);laneCursor=0;nextAt=clock;}
   const activity=marketCommentActivity(state),result={clock,reset,scopeChanged,paused:pause,reduced:reduce,activity,row:null};
   if(pause||clock<nextAt||!pool.length)return result;
   let lane=reduce?0:-1;
   if(!reduce)for(let n=0;n<activity.lanes;n++){
    const index=(laneCursor+n)%activity.lanes,previous=lanes[index];
    if(!previous||clock>=previous.entryAt){lane=index;break;}
   }
   if(lane<0)return result;
   let row=null;
   if(marketSincePlayer>=3)row=playerPool.find(candidate=>!shownPlayerIds.has(candidate.id)&&(!seen.has(candidate.playerText)||clock-seen.get(candidate.playerText)>=COMMENT_REPEAT_GAP))||null;
   for(let n=0;!row&&n<pool.length;n++){const index=(cursor+n)%pool.length,candidate=pool[index];if(!seen.has(candidate.zh_translation)||clock-seen.get(candidate.zh_translation)>=COMMENT_REPEAT_GAP){row=candidate;cursor=(index+1)%pool.length;break;}}
   if(!row)return result; // never invent text or shorten the repeat cooldown for density
   const textWidth=Math.max(1,measureWidth(row.zh_translation)),previous=lanes[lane];
   const speed=previous&&previous.expires>clock?previous.speed:activity.pixelsPerSecond;
   const duration=reduce?30000:Math.ceil((width+textWidth)/speed*1000);
   if(row.source==='player'){shownPlayerIds.add(row.id);marketSincePlayer=0;}else marketSincePlayer=Math.min(3,marketSincePlayer+1);
   seen.set(row.playerText??row.zh_translation,clock);lanes[lane]={entryAt:clock+(textWidth+COMMENT_LANE_GAP)/speed*1000,expires:clock+duration,speed};
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
  setPlayerComments(rows){if(!disposed)schedule.setPlayerComments(rows);},
  update(state,{paused=false,reducedMotion=false}={}){
   if(disposed)return;
   const frame=schedule.update(state,{now:now(),pause:paused,reduce:reducedMotion,width:root.clientWidth});
   root.dataset.activity=frame.activity.level;root.dataset.lanes=String(frame.activity.lanes);root.dataset.paused=String(paused);root.dataset.reduced=String(reducedMotion);
   if(frame.reset){const retained=reducedMotion&&!frame.scopeChanged?[...root.children].at(-1):null;root.replaceChildren();if(retained)root.append(retained);}
   for(const child of [...root.children])if(!reducedMotion&&Number(child.dataset.expires)<=frame.clock)child.remove();
   if(!frame.row)return;
   if(reducedMotion)root.replaceChildren();
   const line=document.createElement('li');line.className='investor-danmaku-line';line.textContent=frame.row.zh_translation;
   line.dataset.source=frame.row.source||'excerpt';line.dataset.sourceRef=frame.row.source_ref||frame.row.id;line.dataset.commentId=frame.row.id;line.dataset.lane=String(frame.row.lane);line.dataset.speed=String(frame.row.speed);line.dataset.expires=String(frame.row.expires);
   line.style.setProperty('--comment-width',`${frame.row.textWidth}px`);line.style.setProperty('--comment-lane',frame.row.lane);line.style.setProperty('--comment-duration',`${frame.row.duration}ms`);line.style.setProperty('--comment-travel',`${Math.max(200,root.clientWidth||400)}px`);
   line.addEventListener('animationend',()=>line.remove(),{once:true});root.append(line);
  },
  dispose(){disposed=true;root.replaceChildren();}
 };
}
export function mountCommentCredits(root,{document=root.ownerDocument,comments=MARKET_COMMENTS}={}){
 root.replaceChildren();
 const intro=document.createElement('p');intro.textContent='这些短评摘自 Personal Finance & Money Stack Exchange 的公开交易与投资讨论，由英文节选翻译。它们不是剧情年代的实时聊天；提问、设想与作者自述均不代表已核验的交易经历。各条节选及译文按所列 CC BY-SA 许可共享，不代表作者或平台背书。';root.append(intro);
 for(const row of eligibleMarketComments(comments)){
  const section=document.createElement('section'),title=document.createElement('h3'),quote=document.createElement('p'),original=document.createElement('p'),credit=document.createElement('p'),source=document.createElement('a'),license=document.createElement('a'),changes=document.createElement('p');
  section.id=`comment-source-${row.source_ref||row.id}`;title.textContent=row.zh_translation;original.textContent=row.original;original.lang='en';credit.textContent=`${row.attribution_display} · ${row.source_date.slice(0,10)} · Personal Finance & Money Stack Exchange`;
  source.href=row.source_url;source.textContent=row.source_title;license.href=row.license_url;license.textContent=row.license;license.rel='license noopener noreferrer';source.rel='noopener noreferrer';source.target=license.target='_blank';
  changes.textContent=`${row.translation_note} ${row.translation_credit}，按 ${row.translation_license||row.license} 共享。`;quote.append(source,document.createTextNode(' · '),license);section.append(title,original,credit,quote,changes);
  if(row.source_author_url){const author=document.createElement('a');author.href=row.source_author_url;author.textContent=row.attribution_display;author.target='_blank';author.rel='noopener noreferrer';section.append(author);}
  if(row.context){const context=document.createElement('p');context.textContent=row.context;section.append(context);}
  root.append(section);
 }
 const policy=document.createElement('a');policy.href='https://stackoverflow.com/help/licensing';policy.textContent='Stack Exchange 内容许可说明';policy.target='_blank';policy.rel='noopener noreferrer';root.append(policy);
}
