import {LIFESTYLES} from './consumption-ledger.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';
import {renderLivingCopy} from './copy/living-choices.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';
const yen=value=>'¥'+value.toLocaleString('zh-CN',{maximumFractionDigits:2});
export const fillLivingCopy=renderLivingCopy;
const planValues=(plan,option,extra={})=>({label:option?.label||plan.label,dailyBasics:yen(plan.dailyBasics),dailyRent:yen(plan.dailyRent),dailyTotal:yen(plan.dailyCost),extraStressRelief:plan.extraStressRelief,extraRestRecovery:plan.extraRestRecovery,restRecoveryCap:32,...extra});
// The caller supplies reviewed, authored copy. This view never chooses housing,
// charges, schedules recovery, changes receipts or reconstructs old bills.
export function mountLivingChoiceDetails(doc,statement,copy,{onLifestyle=()=>{}}={}){
 const options=new Map(copy.options.map(option=>[option.id,option])),shared=copy.shared,compact=copy.compactDisplay;
 const shortOptions=new Map((compact?.options||copy.options).map(option=>[option.id,option]));
 const make=(tag,className,text)=>{const el=doc.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
 const adjustment=make('details','living-adjustment');adjustment.open=false;adjustment.append(make('summary',null,shared.adjustTitle));
 const current=statement.currentHousing||statement.lifestyle,currentCopy=options.get(current.id);
 adjustment.append(make('p','living-current-arrangement',fillLivingCopy(currentCopy.currentStatusTemplate,planValues(current,currentCopy))));
 const choices=make('div','living-plan-choices');
 for(const plan of LIFESTYLES){
  const option=options.get(plan.id),short=shortOptions.get(plan.id),values=planValues(plan,option),button=make('button','secondary');button.type='button';button.value=plan.id;
  button.append(make('span','living-plan-label',fillLivingCopy(short.buttonTemplate,values)),make('small','living-plan-effect',fillLivingCopy(short.subtitleTemplate||option.recoveryDescription,values)));
  const pending=statement.scheduledHousing;
  if(pending?.toId===plan.id)button.append(make('small','living-pending-arrangement',fillLivingCopy(short.scheduledNextDayTemplate,planValues(plan,option,{effectiveDay:pending.effectiveDay}))));
  const insufficient=Number.isFinite(statement.availableLivingCash)&&plan.dailyCost>statement.lifestyle.dailyCost&&statement.availableLivingCash+1e-6<plan.dailyCost;
  button.disabled=plan.id===statement.lifestyle.id||insufficient;
  if(insufficient)button.title=fillLivingCopy(option.insufficientBalanceText,values);
  button.onclick=()=>onLifestyle(plan);choices.append(button);
 }
 adjustment.append(choices);
 if(compact?.shared.termsCompact)adjustment.append(make('small','living-choice-terms',compact.shared.termsCompact));
 const details=compact?.shared.detailTitle?make('details','living-choice-details'):make('div','living-choice-details');
 if(compact?.shared.detailTitle){details.open=false;details.append(make('summary',null,compact.shared.detailTitle));}
 const service=statement.livingService;
 if(service){
  const plan=LIFESTYLES.find(plan=>plan.id===service.lifestyleId),option=options.get(service.lifestyleId),values=planValues(plan,option,{basicPaid:yen(service.basicPaid),rentPaid:yen(service.rentPaid)});
  const detail=make('div','living-paid-components');
  if(service.rentDue>0&&service.fullyPaid)detail.append(make('p','living-paid-service',fillLivingCopy(shared.servicePaidTemplate,values)));
  else{detail.append(make('p',null,fillLivingCopy(shared.basicsPaidTemplate,values)));if(service.rentDue>0){detail.append(make('p',null,fillLivingCopy(shared.rentPaidTemplate,values)));detail.append(make('p','living-paid-service',shared.servicePartialTemplate));}}
  details.append(detail);
 }
 const recovery=statement.livingRecovery;
 if(recovery&&recovery.day===statement.day&&(recovery.stressRelief>0||recovery.restRecovery>0)){
  const plan=LIFESTYLES.find(plan=>plan.id===recovery.lifestyleId),option=options.get(recovery.lifestyleId);
  details.append(make('p','living-received-recovery',fillLivingCopy(shared.receivedRecoveryTemplate,planValues(plan,option,{actualStressRelief:recovery.stressRelief,actualRestRecovery:recovery.restRecovery}))));
 }
 const selected=options.get(statement.lifestyle.id);
 details.append(make('p','living-recovery-cap',fillLivingCopy(selected.capDescription,planValues(statement.lifestyle,selected))));
 if(shared.discountDescription)details.append(make('p',null,fillLivingCopy(shared.discountDescription,planValues(statement.lifestyle,selected))));
 details.append(make('p','living-full-terms',shared.terms));adjustment.append(details);
 return adjustment;
}
