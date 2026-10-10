// Restore only the local state from our own downloadable recovery package.
// Stored/baseline strings are recovery evidence, never an implicit import choice.
export const MAX_BACKUP_BYTES=32*1024*1024;
const MAX_NODES=1000000,MAX_DEPTH=100;
export function parseProgressBackup(text,{key,mode,historical,restore,isHistorical}) {
 if(typeof text!=='string'||text.length>MAX_BACKUP_BYTES)throw Error('备份文件过大。');
 let backup;try{backup=JSON.parse(text);}catch{throw Error('无法读取备份，请选择完整的进度备份 JSON 文件。');}
 const stack=[[backup,0]];let nodes=0;
 while(stack.length){const [value,depth]=stack.pop();if(++nodes>MAX_NODES||depth>MAX_DEPTH)throw Error('备份内容过大或层级异常。');if(typeof value==='number'&&!Number.isFinite(value))throw Error('备份含有无效数值。');if(value&&typeof value==='object'){for(const name of Object.keys(value)){if(['__proto__','prototype','constructor'].includes(name))throw Error('备份含有不安全的内容。');if(stack.length+nodes>=MAX_NODES)throw Error('备份内容过大。');stack.push([value[name],depth+1]);}}}
 if(!backup||backup.format!=='fx-save-conflict-backup-v1'||backup.key!==key||!backup.local||Array.isArray(backup.local))throw Error('请选择与当前模式、行情来源相同的进度备份。');
 const original=backup.local;
 if(!Number.isSafeInteger(original.day)||original.day<1||!Number.isSafeInteger(original.version))throw Error('备份进度不完整，未恢复。');
 const candidate=restore(JSON.stringify(original));
 if(!candidate||candidate.mode!==mode||isHistorical(candidate)!==historical)throw Error('备份损坏、模式不匹配，或来自更新版本。');
 return candidate;
}
export async function readProgressBackup(file,options){
 if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>MAX_BACKUP_BYTES)throw Error('请选择不超过 32 MB 的进度备份。');
 return parseProgressBackup(await file.text(),options);
}

// One preview/confirmation dialog; stale reads and repeated clicks cannot apply twice.
export function mountProgressRestore({document,getContext,restore,isHistorical,apply,onError}) {
 const dialog=document.getElementById('save-restore-dialog'),input=document.getElementById('save-restore-file'),copy=document.getElementById('save-restore-copy'),confirm=document.getElementById('save-restore-confirm'),cancel=document.getElementById('save-restore-cancel');
 let ticket=0,preview=null,busy=false;
 const clear=()=>{ticket++;preview=null;input.value='';confirm.disabled=true;};
 const close=()=>{if(busy)return;clear();dialog.close();};
 const choose=()=>{if(busy)return;const context=getContext();if(!context||context.session.blocked||!context.session.check()){onError('请先处理存档冲突，再恢复备份。');return;}clear();copy.textContent='请选择进度备份文件。';if(!dialog.open)dialog.showModal();input.click();};
 for(const button of document.querySelectorAll('[data-save-restore]'))button.onclick=choose;
 cancel.onclick=close;dialog.addEventListener('cancel',event=>{event.preventDefault();close();});dialog.addEventListener('close',clear);
 input.addEventListener('cancel',()=>{if(!preview)close();});
 input.onchange=async()=>{
  const file=input.files?.[0];if(!file){close();return;}const id=++ticket,context=getContext();preview=null;confirm.disabled=true;copy.textContent='正在核对备份…';
  try{
   const candidate=await readProgressBackup(file,{...context,restore,isHistorical});
   if(id!==ticket||!dialog.open)return;
   const current=getContext();if(current.session!==context.session||current.generation!==context.generation||current.session.blocked||!current.session.check())throw Error('当前进度已变化，请取消后重新选择备份。');
   const expectedRaw=current.session.raw,stored=expectedRaw===null?null:restore(expectedRaw);
   preview={candidate,context:current,expectedRaw};
   copy.textContent=`本页：第 ${current.day} 天；已保存：${stored?'第 '+stored.day+' 天':'尚无存档'}；备份：第 ${candidate.day} 天。恢复会替换本页和当前模式存档，会保留导入前进度备份。是否恢复？`;
   confirm.disabled=false;
  }catch(error){if(id===ticket&&dialog.open)copy.textContent=error.message;}
 };
 confirm.onclick=async()=>{
  if(busy||!preview)return;const selected=preview,current=getContext();
  if(current.session!==selected.context.session||current.generation!==selected.context.generation||current.session.raw!==selected.expectedRaw||current.session.blocked||!current.session.check()){clear();copy.textContent='存档已变化，未恢复。请取消后重新检查。';return;}
  busy=true;dialog.dataset.dismissLocked='true';confirm.disabled=true;cancel.disabled=true;copy.textContent='正在保存恢复的进度，请稍候…';
  try{const ok=await apply(selected.candidate,selected.context,selected.expectedRaw);if(ok){preview=null;dialog.close();}else{preview=null;copy.textContent='恢复未保存成功，本页进度和原存档均未替换。请取消后重试。';}}
  catch{preview=null;copy.textContent='恢复未完成。请保留本页和备份文件。';}
  finally{busy=false;dialog.dataset.dismissLocked='false';cancel.disabled=false;}
 };
 return {get busy(){return busy;}};
}
