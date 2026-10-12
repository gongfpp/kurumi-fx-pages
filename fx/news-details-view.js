import {originalPublicationUrl,renderArchiveSource} from './news-source-view.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';
import {closeAllModalOpen} from './close-all-control.js?v=312cdfbdd4a39e25906ce9f6e87d933d3599e3ed-23f2a20b7717';

// The list is a headline entry. The existing detail dialog owns scrolling,
// Escape, touch, focus return and the ordinary modal playback boundary.
export function mountNewsDetails({document=globalThis.document,openDetails}={}){
 const get=id=>document.getElementById(id),list=get('news'),title=get('news-title'),copy=get('news-copy');
 const meta=list?.querySelector('.news-meta'),source=get('news-archive-source'),sources=get('news-archive-details');
 if(!list||!title||!copy||!meta||!source||!sources||typeof openDetails!=='function')return null;
 const attributes=['role','tabindex','aria-haspopup','aria-controls','aria-labelledby'];
 const before=new Map(attributes.map(name=>[name,list.getAttribute(name)]));
 const visibility={meta:meta.hidden,copy:copy.hidden};let current=null,disposed=false;
 list.setAttribute('role','button');list.setAttribute('tabindex','0');list.setAttribute('aria-haspopup','dialog');
 list.setAttribute('aria-controls','detail-dialog');list.setAttribute('aria-labelledby','news-title');
 function render(event){
  if(disposed)return;
  // Keep a snapshot of the displayed item, including its provenance. Never
  // mutate the event, save, archive selection or a detail already being read.
  current={...event};title.textContent=current.title??'';copy.textContent=current.copy??'';
  const sourceName=get('news-source'),time=get('news-time');
  if(sourceName)sourceName.textContent=current.source??'';if(time)time.textContent=current.time??'';
  meta.hidden=true;copy.hidden=true;sources.hidden=true;source.hidden=true;source.removeAttribute('href');
 }
 function open(){
  if(disposed||!current||closeAllModalOpen(document))return false;
  const event={...current},extra=document.createElement('div'),link=document.createElement('a');
  extra.id='news-archive-details';link.id='news-archive-source';extra.append(link);
  // Historical facts and actual live publications use the same source UI.
  // Synthetic events must not inherit a historical publication by accident.
  const fictional=event.contentKind==='fictional_market_event'||event.swan;
  const sourced={...event,sourceUrl:fictional?null:event.sourceUrl,
   sourceLicenseUrl:originalPublicationUrl({sourceUrl:event.sourceLicenseUrl})};
  renderArchiveSource({createElement:tag=>document.createElement(tag),
   getElementById:id=>id===extra.id?extra:extra.querySelector('#'+id)},sourced);
  const lines=[event.copy,[event.source,event.time].filter(value=>typeof value==='string'&&value.trim()).join(' · ')]
   .filter(value=>typeof value==='string'&&value.trim());
  list.focus({preventScroll:true});
  openDetails(event.title??'',lines,null,extra.hidden?null:extra);
  return true;
 }
 const click=event=>{event.stopPropagation();if(event.detail>1)return;open();};
 const keydown=event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  event.preventDefault();event.stopPropagation();if(!event.repeat)open();
 };
 list.addEventListener('click',click);list.addEventListener('keydown',keydown);
 return {render,open,dispose(){
  if(disposed)return;disposed=true;list.removeEventListener('click',click);list.removeEventListener('keydown',keydown);
  for(const [name,value] of before)if(value===null)list.removeAttribute(name);else list.setAttribute(name,value);
  meta.hidden=visibility.meta;copy.hidden=visibility.copy;if(current)renderArchiveSource(document,current);
 }};
}
