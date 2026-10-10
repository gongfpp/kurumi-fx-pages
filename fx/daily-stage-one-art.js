import {selectRealizedProfitArtwork} from './profit-tier-art.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {orderedDailyStories} from './daily-story-order.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {selectDailyFamilyArtwork,isDailyFamilyNarrative} from './daily-family-art.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {selectComicScene} from './comic-scenes.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {COMIC_SCENE_ASSETS,COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {selectDailyContextualManga} from './contextual-manga-scenes.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {settledComicArt,isSevereSettledLoss} from './settled-comic-art.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {artIdentity,dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {setImage} from './assets.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
import {mountContextualManga} from './contextual-manga-view.js?v=e9394d2e9c338188c2d4680441d7c59e8f5d8a93-23f2a20b7717';
const candidate=scene=>scene?.frames?{...scene,identity:'sequence:'+scene.frames.map(frame=>artIdentity(frame.art)).join('|')}:scene?.art?{...scene,identity:artIdentity(scene.art)}:null;
export function dailyArtworkCandidates(state,narrative){
 if(!sealedDailyMangaOutcome(state)||state.mode==='endless')return [];
 if(isDailyFamilyNarrative(narrative))return [candidate(selectDailyFamilyArtwork(state,narrative))].filter(Boolean);
 // The player's paid choice is more specific than a generic profit picture.
 const activity=(state.recapChoiceLedger||[]).findLast(r=>r.day===state.day);
 if(activity){const scene=selectComicScene(state,{type:'activity',receipt:activity},{assets:COMIC_SCENE_ASSETS});return scene?.ready?[candidate(scene)]:[];}
 if(narrative?.event?.key==='friendStudy'){const art=COMIC_PRESENTATION_ASSETS['mochiko-watch'];return art?.reviewed&&art.panels===4?[candidate({id:'mochiko-watch',title:narrative.event.title,art,lines:narrative.event.lines||[]})]:[];}
 const contextual=selectDailyContextualManga(state),choices=[];
 for(const arc of contextual?[contextual,...(contextual.related||[])]:[]){
  const selection={...arc,related:undefined};
  choices.push({id:arc.id,identity:`arc:${arc.id}`,title:arc.title,selection});
 }
 // No unrelated picture underneath a narrative event. A missing exact match
 // keeps its honest text rather than inventing a happy/loss scene.
 if(narrative?.event?.key&&narrative.event.key!=='quietNight')return choices;
 const trauma=tradingTrauma(state),art=state.dayReport.net>0&&!trauma.active?selectRealizedProfitArtwork(state.dayReport.net):settledComicArt({net:state.dayReport.net,settled:true,mood:trauma.active?'devastated':state.dayReport.mood,traumaActive:trauma.active,severeLoss:isSevereSettledLoss(state,state.dayReport)});
 if(art)choices.push(candidate({id:'daily-result',title:state.dayReport.net>0?'今天收盘了':state.dayReport.net<0?'今天先到这里':'收盘之后',art,lines:[]}));
 return choices.filter(Boolean);
}
export function selectDailyArtwork(state,narrative,{memory=dailyArtMemory}={}){
 return memory.pick(`${state.runId||state.seed}:${state.day}`,orderedDailyStories(dailyArtworkCandidates(state,narrative),memory));
}
export function mountDailyArtwork(host,selection,{memory=dailyArtMemory}={}){
 host.replaceChildren();host.hidden=false;host.className='daily-single-art';let dispose=()=>{};
 const doc=host.ownerDocument,make=(tag,text)=>{const el=doc.createElement(tag);if(text)el.textContent=text;return el;};
 if(!selection){host.hidden=true;return {dispose};}
 host.dataset.contentIdentity=selection.identity;
 const heading=make('h3',selection.title),body=make('div'),replay=make('button','回看这段小剧场');replay.type='button';replay.className='secondary';
 const seen=memory.has(selection.identity)||selection.arcIdentity&&memory.has(selection.arcIdentity);body.hidden=!!seen;replay.hidden=!seen;
 function paint(manual=false){if(body.childNodes.length)return;if(selection.selection){const view=mountContextualManga(body,selection.selection,{manual:false,unreadOnly:!manual,showHeading:false,memory});dispose=()=>view?.dispose();return;}if(selection.frames){dispose=mountDailySequence(body,selection,{memory});return;}const image=make('img');image.alt=selection.art.alt||selection.title;if(selection.art.width)image.width=selection.art.width;if(selection.art.height)image.height=selection.art.height;image.style.cssText='display:block;width:100%;height:auto;object-fit:contain';body.append(image);setImage(image,selection.art.path);dispose=observeSeenArtwork(image,{memory,identities:[selection.identity,selection.arcIdentity].filter(Boolean)});
  if(selection.manga)body.append(make('p','原作片段 · 图中金额与经历属于原作人物。'));
  for(const [speaker,text] of selection.lines||[])body.append(make('p',`${speaker}：${text}`));
 }
 replay.onclick=()=>{body.hidden=false;replay.hidden=true;paint(true);};host.append(replay,body);if(!seen)paint();return {dispose:()=>dispose()};
}

// Three moments, one scene. Partial reading survives refresh, but only seeing
// every loaded image and its caption acknowledges the complete story.
export function mountDailySequence(host,selection,{memory=dailyArtMemory}={}){
 const doc=host.ownerDocument,stops=[],ids=selection.frames.map(frame=>artIdentity(frame.art));
 const complete=()=>{if(ids.every(id=>memory.has(id)))memory.seen([selection.identity]);};
 host.className='daily-family-sequence';
 for(const frame of selection.frames){
  const figure=doc.createElement('figure'),image=doc.createElement('img'),caption=doc.createElement('figcaption');
  figure.dataset.stage=frame.id;image.alt=({pain:'久留美痛苦流泪',discover:'久留美发现柜中未动的信封',relief:'久留美望着信封，喜极而泣'})[frame.id];
  image.width=1086;image.height=1448;caption.textContent=frame.text;figure.append(image,caption);host.append(figure);
  setImage(image,frame.art.path);stops.push(observeSeenArtwork(image,{memory,identities:[artIdentity(frame.art)],visibilityTargets:[image,caption],minVisibleRatio:.9,onSeen:complete}));
 }
 return()=>stops.forEach(stop=>stop());
}
