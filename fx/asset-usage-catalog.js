import {APPROVED_FOUR_SKIT_ASSETS,APPROVED_FOUR_SKIT_REVIEWS} from './approved-four-skit-assets.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {FIRSTDAY_BACKSTORY_NODES,OPPOSITE_IMAGINATION_PANEL} from './contextual-manga-firstday-backstory.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {BORROWING_CONTINUATION_NODES} from './contextual-manga-borrowing-continuation.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {LINK_DAILY_NODES,LINK_DAILY_PANELS} from './contextual-manga-links-content.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {REVERSAL_DAILY_NODES} from './contextual-manga-reversal-content.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {VERIFIED_DAILY_NODES,VERIFIED_DAILY_PANELS} from './contextual-manga-verified-daily.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {DAILY_EXTENSION_NODES} from './contextual-manga-daily-extension.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {MANGA_PANELS} from './manga-panels.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {CHARACTER_STORY_ASSETS,CHARACTER_STORY_NODES} from './character-story-content.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS,CONTEXTUAL_MANGA_NODES} from './contextual-manga-content.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {COMIC_SCENE_ASSETS} from './comic-scene-assets.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {SUPPLEMENTAL_ASSET_SOURCES} from './asset-usage-supplemental.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {ASSET_USAGE_REVIEWS} from './asset-usage-reviews.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
import {ORIGINAL_ASSET_USAGE_REVIEWS} from './asset-usage-original-reviews.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';

// Classification is additive. Existing story/daily consumers retain their own
// source chronology and gates; this catalogue never rewrites those registries.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const ASSET_PRIMARY_USES=freeze({'trading-expression':'交易表情','story-dialogue':'剧情对话'});
const sources=new Map();
function register(registry,id,asset){
 const path=asset.path||asset.original;if(!path)return;
 const previous=sources.get(path),ref=`${registry}:${id}`;
 if(previous){if(previous.sha256!==asset.sha256)throw Error(`Conflicting asset hash: ${path}`);previous.metadataRefs.push(ref);if(asset.record)previous.record=asset.record;return;}
 sources.set(path,{path,sha256:asset.sha256,dimensions:asset.dimensions||asset.imageSize||[asset.width,asset.height],record:asset.record??null,id,character:asset.character??null,kind:registry==='MANGA_PANELS'||registry.includes('STORY_ASSETS')||registry==='CONTEXTUAL_MANGA_ASSETS'?'original-manga':asset.kind||'original-fan-art',metadataRefs:[ref],sourceURL:asset.sourceURL??null,sourceCommit:asset.sourceCommit??null});
}
for(const [id,a]of Object.entries(MANGA_PANELS))register('MANGA_PANELS',id,a);
for(const [id,a]of Object.entries(CHARACTER_STORY_ASSETS))register('CHARACTER_STORY_ASSETS',id,a);
for(const [id,a]of Object.entries(CONTEXTUAL_MANGA_ASSETS))register('CONTEXTUAL_MANGA_ASSETS',id,a);
for(const [id,a]of Object.entries(COMIC_SCENE_ASSETS))register('COMIC_SCENE_ASSETS',id,a);
for(const [id,a]of Object.entries(APPROVED_FOUR_SKIT_ASSETS))register('APPROVED_FOUR_SKIT_ASSETS',id,a);
for(const a of SUPPLEMENTAL_ASSET_SOURCES)register('SUPPLEMENTAL_ASSET_SOURCES',a.id,a);
const storyNodes=[...FIRSTDAY_BACKSTORY_NODES,{id:'opposite-open-opinions',panels:[OPPOSITE_IMAGINATION_PANEL]},...BORROWING_CONTINUATION_NODES,...LINK_DAILY_NODES,{id:'daily-links-panels',panels:Object.values(LINK_DAILY_PANELS)},...REVERSAL_DAILY_NODES,...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES,...DAILY_EXTENSION_NODES,...VERIFIED_DAILY_NODES,{id:'daily-interleaved-panels',panels:Object.values(VERIFIED_DAILY_PANELS)}];
const eventRules=freeze({
 'entry-hesitation':{positions:['flat','open'],profitBases:['none'],directions:['long','short']},
 'position-opened':{positions:['open'],profitBases:['none'],directions:['long','short','mixed']},
 'floating-profit':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[1]},
 'floating-loss':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1]},
 'profit-to-loss':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1],previousPnlSigns:[1]},
 'loss-to-profit':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[1],previousPnlSigns:[-1]},
 'closed-profit':{directions:['long','short','mixed'],positions:['flat','open'],profitBases:['realized'],pnlSigns:[1]},
 'closed-loss':{directions:['long','short','mixed'],positions:['flat','open'],profitBases:['realized'],pnlSigns:[-1]},
 'risk-warning':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1]}
});
export const TRADING_EXPRESSION_EVENTS=freeze(Object.keys(eventRules));
export const ASSET_USAGE_CATALOG=freeze([...sources.values()].map(source=>{
 const r=APPROVED_FOUR_SKIT_REVIEWS[source.path]||ORIGINAL_ASSET_USAGE_REVIEWS[source.path]||ASSET_USAGE_REVIEWS[source.path],record=source.record??r?.sourceRecord??null,nodes=record?storyNodes.filter(n=>n.panels?.some(p=>p.record===record)).map(n=>n.id):[];
 const primaryUse=r?.primaryUse||'story-dialogue',status=r?.status||'pending';
 const events=primaryUse==='trading-expression'&&status==='verified'?(r.events||[]):[];
 const applicability={events,directions:r?.directions||[],positions:[...new Set(events.flatMap(e=>eventRules[e]?.positions||[]))],profitBases:[...new Set(events.flatMap(e=>eventRules[e]?.profitBases||[]))],rules:Object.fromEntries(events.map(e=>[e,{...eventRules[e],...(r.eventRules?.[e]||{})}])),exclusions:r?.exclusions|| (primaryUse==='story-dialogue'?['story-only','never-crop-dialogue']:['unverified-account-event','direction-mismatch','profit-basis-mismatch'])};
 return {id:`asset:${source.path.slice(2).replace(/\.[^.]+$/,'')}`,path:source.path,primaryUse,label:ASSET_PRIMARY_USES[primaryUse],tags:[primaryUse,source.kind,...(r?.tags||[]),...(nodes.length?['existing-story-consumer']:[])],character:r?.character||source.character||'未核定',characters:r?.characters||[r?.character||source.character||'未核定'],emotion:r?.emotion||'待核',intensity:r?.intensity??null,hasEmbeddedText:r?.hasEmbeddedText??null,textOriginal:r?.textOriginal??null,presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:!r?.hasEmbeddedText,minDisplayWidth:r?.minDisplayWidth??(r?.hasEmbeddedText?320:64)},applicability,review:{status,confidence:status==='verified'?'high':'pending',faceClarity:r?.faceClarity||'pending',textClarity:r?.textClarity||'pending',identityStatus:r?.identityStatus||status,identityDescription:r?.identityDescription||r?.character||source.character||'未核定'},source:{kind:source.kind,id:record?`manga-index:${record}`:`${source.metadataRefs[0]}`,record,sha256:source.sha256,dimensions:source.dimensions,metadataRefs:source.metadataRefs,url:source.sourceURL,commit:source.sourceCommit},storyNodeIds:nodes};
}));

// Caller supplies a certified event derived from current positions or a real
// receipt. A quote moving up/down alone is not a profit/loss event. No game RNG,
// no account reads/writes, no historical narration converted to player facts.
export function tradingExpressionCandidates(context={}){
 const {event,direction,position,profitBasis,pnlSign,previousPnlSign,maxDisplayWidth,maxDisplayHeight}=context;
 if([maxDisplayWidth,maxDisplayHeight].some(n=>n!==undefined&&(!Number.isFinite(n)||n<=0)))return [];
 if(!Object.hasOwn(eventRules,event)||!['long','short','mixed','none'].includes(direction)||!['flat','open'].includes(position)||!['none','floating','realized'].includes(profitBasis))return [];
 const facts={positions:position,profitBases:profitBasis,directions:direction,pnlSigns:pnlSign,previousPnlSigns:previousPnlSign,eventSources:context.eventSource};
 return ASSET_USAGE_CATALOG.filter(a=>{
  const [width,height]=a.source.dimensions;
  const fittedWidth=Math.min(maxDisplayWidth??Infinity,maxDisplayHeight===undefined?Infinity:maxDisplayHeight*width/height);
  if(a.presentation.minDisplayWidth>fittedWidth)return false;
  if(a.primaryUse!=='trading-expression'||a.review.status!=='verified'||!a.applicability.events.includes(event)||!a.applicability.directions.includes(direction))return false;
  const rule=a.applicability.rules[event];
  return Object.entries(rule).every(([key,allowed])=>Array.isArray(allowed)&&allowed.includes(facts[key]));
 });
}
export function selectTradingExpressionAsset(context={}){
 const pool=tradingExpressionCandidates(context);if(!pool.length)return null;
 const seed=Number.isSafeInteger(context.seed)?context.seed:0;
 return pool[((seed%pool.length)+pool.length)%pool.length];
}
