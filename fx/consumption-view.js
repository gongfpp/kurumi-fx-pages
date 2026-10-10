import {LIFESTYLES} from './consumption-ledger.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
const yen=n=>'¥'+n.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function mountConsumptionStatement(container,statement,{onLifestyle=()=>{}}={}){
 const doc=container.ownerDocument,section=doc.createElement('section');section.className='consumption-statement';
 const rows=statement.rows.filter(row=>row.kind!=='living'&&row.amount>0);
 if(rows.length){
  const heading=doc.createElement('h3');heading.textContent='今日消费明细';section.append(heading);
  for(const row of rows){const line=doc.createElement('p');line.textContent=`${row.label} · −${yen(row.amount)}`;section.append(line);}
 }
 // This is a manual preference, not a daily prompt. Opening the native
 // disclosure is presentation-only; only choosing a plan calls the handler.
 const adjustment=doc.createElement('details');adjustment.className='living-adjustment';adjustment.open=false;
 const toggle=doc.createElement('summary');toggle.textContent='调整生活';adjustment.append(toggle);
 const note=doc.createElement('p');note.textContent=`当前：${statement.lifestyle.label}。`;adjustment.append(note);
 const choices=doc.createElement('div');choices.className='living-plan-choices';for(const plan of LIFESTYLES){const button=doc.createElement('button');button.type='button';button.className='secondary';button.textContent=`${plan.label} · 每天 ${yen(plan.dailyCost)}${plan.dailyCost>LIFESTYLES[0].dailyCost?`（比基础多 ${yen(plan.dailyCost-LIFESTYLES[0].dailyCost)}）`:""}`;button.disabled=plan.id===statement.lifestyle.id;button.onclick=()=>onLifestyle(plan);choices.append(button);}adjustment.append(choices);
 const terms=doc.createElement('small');terms.textContent='可随时切换。今天已结账时，从明天起生效。';adjustment.append(terms);section.append(adjustment);container.append(section);return section;
}
