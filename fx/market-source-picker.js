// One ordinary game entry. Transport details stay outside the main mode panel.
export function mountMarketSourcePicker({document,library,onSelect=()=>{},importFile,acquireHistory,cancelAcquire=()=>{}}){
 const $=id=>document.getElementById(id),panel=$('history-choice-step');
 const selected=new Map();let rows=[],loading=null,target='mode',ready=false,busy=false,ownerMonthAvailable=false,step=null;
 const status=text=>{$('history-choice-status').textContent=text;};
 function choose(prefix,market){$(prefix+'-market').value=market;for(const b of document.querySelectorAll(`[data-market-prefix="${prefix}"]`)){const active=b.dataset.market===market;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);}onSelect(prefix,market);}
 function paint(){const has=rows.length>0;$('history-date-field').hidden=!has;$('history-choice-confirm').disabled=!has||busy;$('history-file-open').hidden=has;$('history-owner-load').hidden=ownerMonthAvailable||!acquireHistory;$('history-owner-load').textContent=has?'载入2008年10月':'载入历史行情';$('history-owner-load').disabled=busy;$('history-file-open').disabled=busy;$('history-choice-retry').hidden=ready||busy;}
 async function load(){
  if(loading)return loading;busy=true;status('正在读取本机历史行情…');paint();
  loading=(async()=>{try{await library.catalog();const found=[];ownerMonthAvailable=false;for(const dataset of library.datasets){const p=await library.provider(dataset);ownerMonthAvailable ||= p.manifest.schemaVersion==='research-m1-close-v1'&&p.manifest.id==='research-forexite-2008-10';for(const d of p.manifest.days)found.push({datasetId:dataset.id,date:d.date});}rows=found.sort((a,b)=>a.date.localeCompare(b.date));const dates=$('history-choice-date');dates.replaceChildren(...rows.map((r,i)=>new Option(r.date,String(i))));ready=true;status(rows.length?'':acquireHistory?'这台设备还没有历史行情。登录确认后即可载入。':'这台设备还没有历史行情。选择本机文件后即可开始。');for(const prefix of ['mode','restart'])if(!selected.has(prefix)&&rows.length)selected.set(prefix,rows.find(r=>r.date==='2014-02-14')||rows[0]);}catch(error){ready=false;rows=[];status(error.message||'历史行情暂时无法读取，请重试。');}finally{busy=false;loading=null;paint();}})();return loading;
 }
 function back({focus=true}={}){
  cancelAcquire();if(!step)return;const old=step;step=null;panel.hidden=true;for(const [node,hidden]of old.visibility)node.hidden=hidden;
  if(old.label)old.host.setAttribute('aria-labelledby',old.label);else old.host.removeAttribute?.('aria-labelledby');old.scroller.scrollTop=old.scroll;
  if(focus)document.querySelector?.(`[data-market-prefix="${old.prefix}"][data-market="historical"]`)?.focus?.({preventScroll:true});
 }
 async function open(prefix){
  if(step)back({focus:false});target=prefix;const host=$(prefix+'-dialog'),scroller=host.querySelector?.('.dialog-scroll')||host;
  const visibility=[...(scroller.children||[])].filter(node=>node!==panel).map(node=>[node,node.hidden]);step={prefix,host,scroller,visibility,scroll:scroller.scrollTop||0,label:host.getAttribute?.('aria-labelledby')};
  for(const [node]of visibility)node.hidden=true;scroller.append(panel);panel.hidden=false;host.setAttribute?.('aria-labelledby','history-choice-title');scroller.scrollTop=0;
  if(!ready)await load();const chosen=selected.get(prefix),index=rows.findIndex(r=>r.datasetId===chosen?.datasetId&&r.date===chosen?.date);if(index>=0)$('history-choice-date').value=String(index);
  if(step?.prefix===prefix)$('history-choice-title').focus?.({preventScroll:true});
 }
 for(const b of document.querySelectorAll('[data-market-prefix]'))b.onclick=()=>{if(b.dataset.market==='historical')void open(b.dataset.marketPrefix);else choose(b.dataset.marketPrefix,'simulated');};
 $('history-choice-confirm').onclick=()=>{const row=rows[Number($('history-choice-date').value)];if(busy||!row)return;const prefix=target;selected.set(prefix,row);back();choose(prefix,'historical');};
 for(const prefix of ['mode','restart'])$(prefix+'-dialog').addEventListener?.('close',()=>{if(step?.prefix===prefix)back({focus:false});});
 $('history-owner-load').onclick=async()=>{if(busy||!acquireHistory)return;busy=true;status('请在打开的窗口确认载入历史行情。');paint();try{await acquireHistory();ready=false;busy=false;await load();}catch(error){status(error.message||'历史行情尚未载入。');}finally{busy=false;paint();}};
 $('history-choice-cancel').onclick=()=>back();$('history-choice-retry').onclick=()=>void load();
 $('history-file-open').onclick=()=>$('history-local-file').click();
 $('history-local-file').onchange=async e=>{const file=e.target.files?.[0];if(!file||busy)return;busy=true;status('正在读取历史文件…');paint();try{await importFile(file);ready=false;busy=false;await load();}catch(error){status(error.message||'这个历史文件无法读取。');}finally{busy=false;e.target.value='';paint();}};
 return {load,select:choose,async options(prefix){if(!ready)await load();const chosen=selected.get(prefix);if(!chosen||!rows.some(r=>r.datasetId===chosen.datasetId&&r.date===chosen.date))throw Error('请先选择本机历史行情');return library.options(chosen.datasetId,chosen.date);}};
}
