// This orchestration never uploads the full local report; the score client
// projects a fixed allowlist and rechecks permanent developer taint.
export class RankingLifecycle {
 constructor({getState,getGeneration=()=>0,isBlocked=()=>false,persist,report,automatic,onStatus=()=>{},schedule=setTimeout,cancel=clearTimeout}={}){
  Object.assign(this,{getState,getGeneration,isBlocked,persist,report,automatic,onStatus,schedule,cancel});this.timer=null;this.pending=null;
 }
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
 async submit(){
  const current=this.getState();
  if(current?.phase!=='ending'||this.isBlocked()){this.clear();return {submitted:false,reason:'unfinished-or-blocked'};}
  if(this.pending)return this.pending;
  const generation=this.getGeneration(),campaign=current.runId;
  const same=()=>this.getGeneration()===generation&&this.getState()?.runId===campaign&&this.getState()?.phase==='ending'&&!this.isBlocked();
  this.clear();
  const task=Promise.resolve().then(async()=>{
   try{
    const saved=await this.persist();
    if(saved!==true||!same()){this.onStatus({state:'not-submitted',reason:saved===true?'stale':'save-pending'});return {submitted:false,reason:'save-pending'};}
    this.onStatus({state:'submitting'});
    const snapshot=structuredClone(this.getState()),result=await this.automatic.submitIfFinished(snapshot,this.report(snapshot));
    if(same())this.onStatus({state:result?.submitted?'submitted':result?.retryAt?'retry-pending':result?.reason==='service-unconfigured'?'unconfigured':'not-submitted',reason:result?.reason});
    if(same()&&Number.isFinite(result?.retryAt))this.timer=this.schedule(()=>{this.timer=null;if(same())void this.submit();},Math.max(250,result.retryAt-Date.now()));
    return result;
   }catch{if(same())this.onStatus({state:'not-submitted',reason:'local-error'});return {submitted:false,reason:'local-error'};}
   finally{this.pending=null;if(!same()&&this.getState()?.phase==='ending'&&!this.isBlocked())this.timer=this.schedule(()=>{this.timer=null;void this.submit();},0);}
  });
  this.pending=task;return task;
 }
}
