import {setImage} from './assets.js?v=0b2e40405ee7fcd62ef27e0e253be40d5f854740-23f2a20b7717';
const el=(doc,tag,cls,text)=>{const n=doc.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
export function renderFatherIllustration(container,description){
 container.replaceChildren();container.hidden=!description;if(!description)return;
 const doc=container.ownerDocument,figure=el(doc,'figure','father-item-figure'),view=el(doc,'div','father-art-view'),image=el(doc,'img','');image.alt=description.caption||description.text||description.art.alt||description.art.note||'';setImage(image,description.art.path);view.append(image);
 if(description.art.grid){const [x,y,columns,rows]=description.art.grid;view.classList.add('father-art-crop');image.style.width=columns*100+'%';image.style.left=-x*100+'%';image.style.top=-y*100+'%';}
 figure.append(view,el(doc,'figcaption','',description.caption||description.text||''));container.append(figure);
}
export function renderFatherSequence(container,frames){
 container.replaceChildren();container.hidden=!frames?.length;if(!frames?.length)return;
 const doc=container.ownerDocument,title=el(doc,'h3','','父亲的柜中存款'),notice=el(doc,'p','father-discovery-boundary','柜子里的信封，还在那里。'),grid=el(doc,'div','father-discovery-grid');
 for(const frame of frames){const panel=el(doc,'section','father-discovery-panel');panel.dataset.stage=frame.id;renderFatherIllustration(panel,{art:frame.art,text:frame.text});grid.append(panel);}
 container.append(title,notice,grid);
}
