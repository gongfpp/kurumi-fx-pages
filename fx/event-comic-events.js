// Presentation candidates come only from records the engine has already written.
// No balance differences, click intent, market predictions or historical replay.
export function recordedComicEvents(state) {
 const events=[],today=receipt=>receipt?.day===state.day;
 for(const receipt of state.recapChoiceLedger||[])if(today(receipt))events.push({type:'activity',receipt});
 for(const receipt of state.consumptionLedger||[]){
  if(!today(receipt))continue;
  if(receipt.kind==='item'){
   const prefix=`item:${state.day}:`;
   if(receipt.id?.startsWith(prefix)){const id=receipt.id.slice(prefix.length);events.push({type:'item',id,result:{id,cost:receipt.amount}});}
  }else if(receipt.kind==='interest')events.push({type:'interest',receipt});
 }
 if(state.family?.withdrawal)events.push({type:'father-borrow',result:{id:'father',amount:state.family.withdrawal.amount}});
 if(state.family?.lastRepayment)events.push({type:'father-repayment',receipt:state.family.lastRepayment});
 if(state.fatherDiscovery?.eventId)events.push({type:'father-discovery',eventId:state.fatherDiscovery.eventId});
 events.push({type:'father-found'});
 for(const [type,field] of [['loan-borrow','lastBorrow'],['loan-repayment','lastRepayment']])if(state.loan?.[field])events.push({type,result:state.loan[field]});
 const living=state.dayReport?.livingSettlement?.receipt;if(living)events.push({type:'living',receipt:living});
 for(const receipt of state.quotePackage?.receipts||[])if(today(receipt))events.push({type:'quote-package',receipt});
 for(const receipt of state.history||[])if(today(receipt)&&receipt.type!=='open')events.push({type:'trade',receipt});
 events.push({type:'day-close'},{type:'walkaway'});
 return events;
}

// Only the context owner may certify the save. A returned ticket contains frozen
// presentation data selected BEFORE an asynchronous save, never future state.
export function createComicReceiptGate({initialState,context,select,onScenes=()=>{},onReset=()=>{}}) {
 let currentContext=context,revision=0,seen=new Set();
 const scenes=state=>recordedComicEvents(state).map(event=>select(state,event)).filter(Boolean);
 function rebase(state,nextContext){currentContext=nextContext;revision++;seen=new Set(scenes(state).map(scene=>scene.receiptKey));onReset();}
 rebase(initialState,context);
 return {
  capture(state,nextContext){
   if(nextContext!==currentContext){rebase(state,nextContext);return {context:nextContext,revision,scenes:[]};}
   const selected=scenes(state).filter(scene=>!seen.has(scene.receiptKey));
   return {context:currentContext,revision,scenes:structuredClone(selected)};
  },
  commit(ticket,{saved,context:nextContext,blocked=false}={}){
   if(!saved||blocked||ticket.context!==nextContext||ticket.context!==currentContext||ticket.revision!==revision)return [];
   const incoming=ticket.scenes.filter(scene=>!seen.has(scene.receiptKey));
   for(const scene of incoming)seen.add(scene.receiptKey);
   if(incoming.length)onScenes(incoming);
   return incoming;
  },
  rebase,
  invalidate(){revision++;onReset();},
 };
}
