import {LIVING_CHOICE_COPY} from './copy/living-choices.js?v=7e5a730c4a9ee2cb901b46fdac3ef10a829bdcda-23f2a20b7717';
// Consumption is a separate, itemized cash ledger. Legacy totals are retained;
// missing old item names are never reconstructed from guesses.
export const LIFESTYLES=Object.freeze([
 Object.freeze({id:'basic',label:LIVING_CHOICE_COPY.options[0].label,dailyCost:2200,dailyBasics:2200,dailyRent:0,extraStressRelief:0,extraRestRecovery:0}),
 Object.freeze({id:'comfortable',label:LIVING_CHOICE_COPY.options[1].label,dailyCost:3300,dailyBasics:2200,dailyRent:1100,extraStressRelief:2,extraRestRecovery:4}),
 Object.freeze({id:'generous',label:LIVING_CHOICE_COPY.options[2].label,dailyCost:5500,dailyBasics:2200,dailyRent:3300,extraStressRelief:4,extraRestRecovery:8}),
]);
export function lifestylePlan(state={}){return LIFESTYLES.find(x=>x.id===state.lifestyle?.id)||LIFESTYLES[0];}
export function validLifestyle(record){return record===undefined||!!record&&[1,2].includes(record.version)&&LIFESTYLES.some(x=>x.id===record.id)&&Number.isSafeInteger(record.selectedDay)&&record.selectedDay>=1;}
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
 const lifestyle=lifestylePlan(state),housing=state.livingHousing,pending=housing?.pending;
 const currentHousing=LIFESTYLES.find(plan=>plan.id===housing?.id)||lifestyle;
 const receipt=report?.livingSettlement?.receipt;
 return{day,rows,total:costs,pendingLivingCost:report?.pendingLivingCost||0,lifestyle,currentHousing,
  scheduledHousing:pending?{...pending,plan:LIFESTYLES.find(plan=>plan.id===pending.toId)}:null,
  livingService:receipt?.service?{...receipt.service}:null,
  livingRecovery:state.livingRecovery?{...state.livingRecovery}:null,
  availableLivingCash:Math.max(0,state.cash||0)+(state.reserve||0)};
}
export function validConsumptionLedger(rows){return rows===undefined||Array.isArray(rows)&&rows.every((row,index)=>row&&typeof row.id==='string'&&rows.findIndex(other=>other.id===row.id)===index&&Number.isSafeInteger(row.day)&&row.day>0&&typeof row.kind==='string'&&typeof row.label==='string'&&Number.isFinite(row.amount)&&row.amount>=0);}
