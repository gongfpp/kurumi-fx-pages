import {createDeferredModule} from './deferred-module.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {mountOptionalContentStatus} from './optional-content-status.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';

export function createDeferredInvestorComments(root,{load=()=>import('./investor-danmaku.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717'),...options}={}){
 const source=createDeferredModule(load),document=options.document??root.ownerDocument;
 let view=null,latest=null,rows=[],disposed=false,failure=null;
 function clearFailure(){failure?.status.dispose();failure?.row.remove();failure=null;}
 function showFailure(error){
  if(disposed)return;
  if(!failure){const row=document.createElement('li');row.className='investor-danmaku-status';root.append(row);failure={row,status:mountOptionalContentStatus(row,{document,retry:()=>void start()})};}
  failure.status.render({ready:false,error});
 }
 function mount(module){
  if(disposed)return null;
  clearFailure();
  if(!view){view=module.createInvestorDanmaku(root,options);view.setPlayerComments(rows);if(latest)view.update(...latest);}
  return module;
 }
 function start(){
  if(disposed)return Promise.resolve(false);
  failure?.status.render({ready:false,error:null});
  return source.load().then(mount).then(module=>!!module,error=>{showFailure(error);return false;});
 }
 return {
  // Explicitly started after the pixel frontend is available, never by render.
  start,
  setPlayerComments(next){if(disposed)return;rows=next;view?.setPlayerComments(next);},
  update(state,settings){if(disposed)return;latest=[state,settings];view?.update(state,settings);},
  async credits(target,{isCurrent=()=>true}={}){
   const module=await source.load();mount(module);
   if(!disposed&&isCurrent())module.mountCommentCredits(target);
  },
  dispose(){disposed=true;clearFailure();view?.dispose();view=null;latest=null;rows=[];}
 };
}
