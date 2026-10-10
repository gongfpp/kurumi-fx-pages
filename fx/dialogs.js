import {preserveScroll} from './preserve-scroll.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
// Every modal owns one fixed control strip and one scrollable content region.
// Closing a narrative window dismisses its presentation, never chooses a story.
export function enhanceDialogs({root=document,onDismiss=()=>{},onClose=()=>{}}={}) {
  const dialogs=[...root.querySelectorAll('dialog')],records=new Map();
  const openDialogs=()=>dialogs.filter(d=>d.open);
  const sync=()=>root.documentElement.classList.toggle('dialog-active',openDialogs().length>0);
  const focusable=node=>node?.isConnected&&!node.disabled&&!node.closest?.('[hidden]');
  for(const dialog of dialogs) {
    if(dialog.classList.contains('dialog-shell'))continue;
    const scroller=root.createElement('div');scroller.className='dialog-scroll';
    const toolbar=root.createElement('div');toolbar.className='dialog-toolbar';
    const existing=dialog.querySelector('.x-close');
    const close=existing||root.createElement('button');
    close.classList.add('x-close');close.type='button';
    if(!existing){close.textContent='×';close.setAttribute('aria-label','关闭窗口，保留当前进度');close.dataset.dialogDismiss='';}
    const title=dialog.querySelector('h2');
    if(title){title.id||=`${dialog.id}-title`;dialog.setAttribute('aria-labelledby',title.id);}
    dialog.setAttribute('aria-modal','true');
    for(const child of [...dialog.childNodes])if(child!==existing)scroller.append(child);
    toolbar.append(close);dialog.append(toolbar,scroller);dialog.classList.add('dialog-shell');
    const record={opener:null,show:dialog.showModal.bind(dialog),scroller};records.set(dialog,record);
    dialog.showModal=()=>{
      if(dialog.open)return;
      record.opener=root.activeElement;preserveScroll(root.documentElement,()=>record.show());scroller.scrollTop=0;sync();
      close.focus({preventScroll:true});
    };
    const nativeClose=dialog.close.bind(dialog);
    dialog.close=(...args)=>preserveScroll(record.opener?.parentElement||root.documentElement,()=>nativeClose(...args));
    const dismiss=()=>{
      if(!dialog.open)return;
      if(dialog.id==='prop-dialog'){root.getElementById('prop-done').click();return;}
      dialog.close('dismiss');onDismiss(dialog);
    };
    if(!existing)close.addEventListener('click',dismiss);
    // Existing opening skip keeps its explicit skip semantics. Other Escape
    // closes are ordinary dismissals, not synthetic next-day/choice clicks.
    dialog.addEventListener('cancel',event=>{
      if(dialog.id==='opening-dialog')return;
      event.preventDefault();event.stopImmediatePropagation();dismiss();
    },true);
    dialog.addEventListener('keydown',event=>{
      // Native controls still receive Enter/Space/Tab, but gameplay shortcuts
      // on the page never receive a key from a modal.
      event.stopPropagation();
    });
    dialog.addEventListener('close',()=>{
      onClose(dialog);sync();queueMicrotask(()=>{
        const active=openDialogs().at(-1),opener=record.opener;
        if(active){if(focusable(opener)&&active.contains(opener))opener.focus({preventScroll:true});else if(!active.contains(root.activeElement))active.querySelector('.x-close')?.focus({preventScroll:true});}
        else if(focusable(opener))opener.focus({preventScroll:true});
        else root.getElementById('scene-resume')?.focus({preventScroll:true});
      });
    });
  }
  sync();return {dialogs,records,sync};
}
