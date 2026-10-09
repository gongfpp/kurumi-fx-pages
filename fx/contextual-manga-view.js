import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
import {setImage} from './assets.js?v=f8e46c73488e10f2709e832efabab8cf5592af68-23f2a20b7717';
// Inline, manual presentation only. It has no game-state or persistence access.
export function mountContextualManga(host,selection,{manual=true,root=host.ownerDocument||document}={}){
 host.replaceChildren();host.hidden=!selection;if(!selection)return null;
 const make=(tag,text)=>{const node=root.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 host.className='contextual-manga';host.dataset.arc=selection.id;
 const section=make('section'),heading=make('h3',selection.title),content=make('div');
 let expanded=!manual;
 function paint(){content.replaceChildren();content.hidden=!expanded;if(!expanded)return;
  for(const node of selection.nodes){const story=make('section'),title=make('h4',node.title);story.dataset.node=node.id;story.append(title,make('p',node.before));
   for(const panel of node.panels){if(panel.before)story.append(make('p',panel.before));const asset=CHARACTER_STORY_ASSETS[panel.record],figure=make('figure'),img=make('img'),missing=make('p','图片暂未加载。');missing.hidden=true;missing.setAttribute('role','status');img.alt=panel.alt;img.width=asset.dimensions[0];img.height=asset.dimensions[1];img.dataset.sourceRecord=String(panel.record);img.loading='eager';img.decoding='async';setImage(img,asset.path,{onStatus:status=>{missing.hidden=status!=='unavailable';img.hidden=status==='unavailable';}});figure.append(img,missing);story.append(figure);}
   story.append(make('p',node.after));content.append(story);
  }
 }
 section.append(heading);
 if(manual){const toggle=make('button','展开这段往事');toggle.type='button';toggle.className='secondary';toggle.setAttribute('aria-expanded','false');toggle.addEventListener('click',()=>{expanded=!expanded;toggle.textContent=expanded?'收起这段往事':'展开这段往事';toggle.setAttribute('aria-expanded',String(expanded));paint();});section.append(toggle);}
 section.append(content);host.append(section);paint();return {get expanded(){return expanded;}};
}
