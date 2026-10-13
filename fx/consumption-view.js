import {LIVING_CHOICE_COPY} from './copy/living-choices.js?v=443669c15b264bcc9465b95315e1b8dd764b4d8f-23f2a20b7717';
import {mountLivingChoiceDetails} from './living-choice-view.js?v=443669c15b264bcc9465b95315e1b8dd764b4d8f-23f2a20b7717';
const yen=n=>'¥'+n.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function mountConsumptionStatement(container,statement,{onLifestyle=()=>{}}={}){
 const doc=container.ownerDocument,section=doc.createElement('section');section.className='consumption-statement';
 const rows=statement.rows.filter(row=>row.kind!=='living'&&row.amount>0);
 if(rows.length){
  const heading=doc.createElement('h3');heading.textContent='今日消费明细';section.append(heading);
  for(const row of rows){const line=doc.createElement('p');line.textContent=`${row.label} · −${yen(row.amount)}`;section.append(line);}
 }
 const adjustment=mountLivingChoiceDetails(doc,statement,LIVING_CHOICE_COPY,{onLifestyle});section.append(adjustment);container.append(section);return section;
}
