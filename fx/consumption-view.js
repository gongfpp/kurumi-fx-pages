import {LIFESTYLES} from './consumption-ledger.js?v=de121dd0edf28d5961cd0eba458fe8bc2b0f2bcd-23f2a20b7717';
const yen=n=>'¥'+n.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function mountConsumptionStatement(container,statement,{onLifestyle=()=>{}}={}){
 const doc=container.ownerDocument,section=doc.createElement('section');section.className='consumption-statement';
 const heading=doc.createElement('h3');heading.textContent='今日消费明细';section.append(heading);
 for(const row of statement.rows.filter(row=>row.kind!=='living')){const line=doc.createElement('p');line.textContent=`${row.label} · −${yen(row.amount)}`;section.append(line);}
 if(!statement.rows.some(row=>row.kind!=='living')){const line=doc.createElement('p');line.textContent='今天没有其他消费。';section.append(line);}
 const note=doc.createElement('p');note.textContent=`当前：${statement.lifestyle.label}。`;section.append(note);
 const choices=doc.createElement('div');for(const plan of LIFESTYLES){const button=doc.createElement('button');button.type='button';button.className='secondary';button.textContent=`${plan.label} · 每天 ${yen(plan.dailyCost)}${plan.dailyCost>LIFESTYLES[0].dailyCost?`（比基础多 ${yen(plan.dailyCost-LIFESTYLES[0].dailyCost)}）`:""}`;button.disabled=plan.id===statement.lifestyle.id;button.onclick=()=>onLifestyle(plan);choices.append(button);}section.append(choices);
 const terms=doc.createElement('small');terms.textContent='可随时切换。今天已结账时，从明天起生效。';section.append(terms);container.append(section);return section;
}
