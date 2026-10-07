// Consumption is a separate, itemized cash ledger. Legacy totals are retained;
// missing old item names are never reconstructed from guesses.
export const LIFESTYLES=Object.freeze([
 Object.freeze({id:'basic',label:'基础生活',dailyCost:2200}),
 Object.freeze({id:'comfortable',label:'舒适生活',dailyCost:3300}),
 Object.freeze({id:'generous',label:'宽裕生活',dailyCost:5500}),
]);
export function lifestylePlan(state={}){return LIFESTYLES.find(x=>x.id===state.lifestyle?.id)||LIFESTYLES[0];}
export function validLifestyle(record){return record===undefined||!!record&&record.version===1&&LIFESTYLES.some(x=>x.id===record.id)&&Number.isSafeInteger(record.selectedDay)&&record.selectedDay>=1;}
export function recordConsumption(state,{id,kind,label,amount,timestamp}){
 if(!Number.isFinite(amount)||amount<0)throw Error('消费流水金额无效');
 state.consumptionLedger ||= [];
 const existing=state.consumptionLedger.find(row=>row.id===id);if(existing)return existing;
 const row={id,day:state.day,kind,label,amount,timestamp};state.consumptionLedger.push(row);return row;
}
export function consumptionStatement(state,report=state.dayReport){
 const day=report?.day??state.day,rows=(state.consumptionLedger||[]).filter(row=>row.day===day).map(row=>({...row}));
 const costs=Number.isFinite(report?.costs)?report.costs:Math.max(0,(state.expenses||0)-(state.dayOpeningExpenses||0));
 const known=rows.reduce((n,row)=>n+row.amount,0),unitemized=Math.max(0,Math.round((costs-known)*100)/100);
 if(unitemized>.005)rows.push({id:`legacy-unitemized:${day}`,day,kind:'legacy-unitemized',label:'旧存档支出（未保留明细）',amount:unitemized,legacy:true});
 return{day,rows,total:costs,pendingLivingCost:report?.pendingLivingCost||0,lifestyle:lifestylePlan(state)};
}
export function validConsumptionLedger(rows){return rows===undefined||Array.isArray(rows)&&rows.every((row,index)=>row&&typeof row.id==='string'&&rows.findIndex(other=>other.id===row.id)===index&&Number.isSafeInteger(row.day)&&row.day>0&&typeof row.kind==='string'&&typeof row.label==='string'&&Number.isFinite(row.amount)&&row.amount>=0);}
