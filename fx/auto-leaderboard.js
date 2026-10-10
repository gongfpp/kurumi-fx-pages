import {hasDevelopmentTaint} from './development-taint.js?v=42af2d398ec805e2c863657b55b1725ad2314fc6-23f2a20b7717';
const ID=/^[a-zA-Z0-9_-]{8,80}$/;
const ENDINGS=new Set(['million','walkaway','broke','crisis']);
const receiptKey=run=>'fx-api-v1-finished-score-'+run;
// Only a terminal game is eligible. A normal daily settlement is not game-over.
export function terminalRankingEligibility(state,report,storage){
 if(state?.historical?.version===2)return {eligible:false,reason:'private-research'};
 if(!ID.test(state?.runId||''))return {eligible:false,reason:'missing-run'};
 if(state.phase!=='ending'||!ENDINGS.has(state.ending?.id)||report?.gameFinished!==true||report?.completionReason!==state.ending.id||report?.eligibility?.gameFinished!==true)return {eligible:false,reason:'unfinished'};
 try{if(hasDevelopmentTaint(state,storage)||report.eligibility.developmentTaint!==false)return {eligible:false,reason:'developer'};}catch{return {eligible:false,reason:'storage-unavailable'};}
 if(report?.eligibility?.rankingEligible!==true)return {eligible:false,reason:'ineligible'};
 return {eligible:true,reason:null};
}
// The caller passes the local report, but the client serializes only its fixed
// score allowlist. Neither reports nor transaction logs are persisted here.
export class AutomaticLeaderboard {
 constructor({client,storage,now=()=>Date.now(),onStatus=()=>{}}={}){this.client=client;this.storage=storage;this.now=now;this.onStatus=onStatus;this.inFlight=new Map();this.completed=new Set();this.retries=new Map();}
 status(value){try{this.onStatus(value);}catch{}}
 async submitIfFinished(state,report){
  const eligibility=terminalRankingEligibility(state,report,this.storage);
  if(!eligibility.eligible){this.status({state:'not-submitted',reason:eligibility.reason});return {submitted:false,...eligibility};}
  const campaign=state.runId;
  if(!this.client?.configuration?.configured){this.status({state:'unconfigured'});return {submitted:false,reason:'service-unconfigured'};}
  try{if(this.completed.has(campaign)||this.storage.getItem(receiptKey(campaign))==='1')return {submitted:true,duplicate:true};}catch{this.status({state:'not-submitted',reason:'storage-unavailable'});return {submitted:false,reason:'storage-unavailable'};}
  if(this.inFlight.has(campaign))return this.inFlight.get(campaign);
  const retry=this.retries.get(campaign);if(retry&&this.now()<retry.nextAt)return {submitted:false,reason:'backoff',retryAt:retry.nextAt};
  this.status({state:'submitting'});
  const task=Promise.resolve().then(async()=>{
   try{
    // Snapshot only inside the explicit network client. It rechecks eligibility
    // and permanent taint before registering or publishing the capability.
    const result=await this.client.publishFinished(state,report,{alias:''});
    if(result?.ok!==true)throw Object.assign(Error('成绩未获确认'),{code:'response'});
    this.completed.add(campaign);this.retries.delete(campaign);
    try{this.storage.setItem(receiptKey(campaign),'1');}catch{}
    this.status({state:'submitted',duplicate:!!result.duplicate});return {submitted:true,...result};
   }catch(error){
    const attempts=(retry?.attempts||0)+1,nextAt=this.now()+Math.min(60000,1000*2**Math.min(attempts,6));
    this.retries.set(campaign,{attempts,nextAt});this.status({state:'retry-pending',code:error.code||'network',retryAt:nextAt});
    return {submitted:false,reason:error.code||'network',retryAt:nextAt};
   }finally{this.inFlight.delete(campaign);}
  });
  this.inFlight.set(campaign,task);return task;
 }
}
