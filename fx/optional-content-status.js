// Small status inside an existing content panel; it never gates the game.
export function mountOptionalContentStatus(root,{document=root.ownerDocument,retry}={}){
 const status=document.createElement('span'),button=document.createElement('button');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 button.type='button';button.textContent='重新读取';button.hidden=true;
 status.append(button);root.append(status);
 const label=document.createElement('span');status.prepend(label);
 button.addEventListener('click',event=>{event.stopPropagation();retry();});
 button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')event.stopPropagation();});
 return {render({ready,error}){status.hidden=ready;button.hidden=!error;label.textContent=error?'未能载入，请重试。':'正在载入…';},dispose(){status.remove();}};
}
