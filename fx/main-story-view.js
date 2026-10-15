import {createSkitLine} from './skit-dialogue.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
import {setImage} from './assets.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
import {mainStoryArtForDay} from './main-story-art-assets.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';

// The existing settlement scroll area owns layout. No new modal, continuation
// button, account action or automatic pagination is introduced.
export function mountMainStory(host,episode){
 host.replaceChildren();host.hidden=!episode;
 if(!episode)return;
 const doc=host.ownerDocument,heading=doc.createElement('h3'),action=doc.createElement('p');
 host.dataset.mainStoryId=episode.id;host.className='main-story';
 heading.textContent=episode.title;action.textContent=episode.action;
 host.append(heading,action);
 const art=mainStoryArtForDay(episode.number);
 if(art){
  const image=doc.createElement('img');image.alt=art.alt;image.width=art.width;image.height=art.height;
  image.setAttribute('style','display:block;width:100%;height:auto;object-fit:contain');
  setImage(image,art.path);host.append(image);
 }
 for(const [speaker,text] of episode.lines)host.append(createSkitLine(doc,speaker,text));
}
