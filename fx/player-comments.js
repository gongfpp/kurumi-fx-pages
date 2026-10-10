import {serviceConfiguration} from './service-config.js?v=42af2d398ec805e2c863657b55b1725ad2314fc6-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=42af2d398ec805e2c863657b55b1725ad2314fc6-23f2a20b7717';

// Render every user-controlled value as text, never markup or links.
export function renderPlayerComments(list,rows,{document=list.ownerDocument}={}){
 const fragment=document.createDocumentFragment();
 for(const row of rows.slice(0,50)){
  const item=document.createElement('li'),author=document.createElement('strong'),text=document.createElement('span');
  item.dataset.commentId=row.id;author.textContent=`${row.alias || '匿名玩家'}：`;text.textContent=row.text;
  item.append(author,text);fragment.append(item);
 }
 list.replaceChildren(fragment);
}
export function mountPlayerComments(root,{document=root.ownerDocument,fetch=globalThis.fetch.bind(globalThis),configuration=serviceConfiguration(),getAlias=()=>document.getElementById('ranking-name')?.value||'',storage,crypto=globalThis.crypto}={}){
 const form=root.querySelector('form'),input=root.querySelector('textarea'),button=form.querySelector('button'),status=root.querySelector('[role=status]'),list=root.querySelector('ul'),identity=root.querySelector('[data-comment-author]');
 let pending=false,reading=false,disposed=false,attempt=null,visitor=null,revision=0;
 try{storage??=kurumiStorage();visitor=storage.getItem('fx-api-v1-comment-visitor');if(!/^[a-zA-Z0-9_-]{16,80}$/.test(visitor||'')){visitor=crypto.randomUUID();storage.setItem('fx-api-v1-comment-visitor',visitor);}}catch{visitor=crypto.randomUUID();}
 const author=()=>getAlias().trim()||'匿名玩家';
 const showAuthor=()=>{identity.textContent=`以「${author()}」留言，所有玩家可见。请勿填写个人隐私。`;};
 const request=async(options={})=>{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{const response=await fetch(configuration.origin+'/api/fx/comments',{credentials:'omit',cache:'no-store',...options,signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.error||'留言暂不可用，请稍后重试');return data;}finally{clearTimeout(timeout);}
 };
 async function refresh(){
  if(disposed||reading||pending||document.hidden||!configuration.configured)return;
  reading=true;const startedRevision=revision;
  try{const data=await request();if(disposed||pending||startedRevision!==revision)return;renderPlayerComments(list,data.rows||[]);if(!pending)status.textContent=data.rows?.length?'':'还没有玩家留言。';}
  catch{if(!disposed&&!pending)status.textContent='暂时读不到留言，稍后会重试。';}finally{reading=false;}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!configuration.configured)return;
  const text=input.value.trim(),alias=getAlias().trim();if(!text||[...text].length>200){status.textContent='请输入 1–200 字的留言。';return;}
  if(!attempt||attempt.text!==text||attempt.alias!==alias)attempt={id:crypto.randomUUID(),visitor,text,alias};
  pending=true;button.disabled=true;input.disabled=true;status.textContent='正在公开发送…';
  try{const result=await request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(attempt)});if(result.ok!==true||!result.row)throw Error('留言未获确认，请重试');
   revision++;const row=result.row,item=document.createElement('li'),name=document.createElement('strong'),message=document.createElement('span');name.textContent=`${row.alias}：`;message.textContent=row.text;item.dataset.commentId=row.id;for(const old of [...list.children])if(old.dataset.commentId===row.id)old.remove();item.append(name,message);list.prepend(item);while(list.children.length>50)list.lastElementChild.remove();input.value='';attempt=null;status.textContent='已公开发送。';
  }catch(error){status.textContent=error.name==='AbortError'?'发送结果暂未确认，重试不会重复留言。':error.message;}
  finally{pending=false;button.disabled=false;input.disabled=false;}
 });
 input.addEventListener('focus',showAuthor);document.getElementById('ranking-name')?.addEventListener('input',showAuthor);showAuthor();
 if(configuration.configured){refresh();}else{button.disabled=true;status.textContent='留言服务尚未配置。';}
 const timer=setInterval(refresh,30000);document.addEventListener('visibilitychange',refresh);
 return {refresh,dispose(){disposed=true;clearInterval(timer);document.removeEventListener('visibilitychange',refresh);}};
}
