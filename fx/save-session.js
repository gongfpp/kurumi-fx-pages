import {encodeProgress} from './save-encoder.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {inspectSave,SAVE_COMPRESSION_THRESHOLD} from './save-codec.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
import {storageFailure} from './storage.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
// Progress is an optimistic, per-mode session. Compare the exact durable bytes,
// not a timestamp (or this tab's failed-write overlay), before every write.
// Web Locks make that comparison + write exclusive between current app pages.
export function createSaveSession({storage,key,legacyKey=null,restore,locks=globalThis.navigator?.locks,encode=encodeProgress}) {
  const read=()=>{
    const current=storage.readItem(key);
    const legacy=current.available&&current.value===null&&legacyKey?storage.readItem(legacyKey):null;
    return {current,legacy,raw:current.value??legacy?.value??null,failure:!current.available?storage.failureFor?.(key):legacy&&!legacy.available?storage.failureFor?.(legacyKey):null};
  };
  let baseline=read(),raw=baseline.raw,localRaw=raw,queue=Promise.resolve(),epoch=0;
  let savedText=null;try{savedText=raw===null?null:inspectSave(raw).currentRaw;}catch{}
  let revision=0,importPending=false,latestRun=null;
  let status='ready',reason='',failure=null;
  const decode=value=>{try{return value===null?null:restore(value);}catch{return null;}};
  const available=value=>value.current.available&&(!value.legacy||value.legacy.available);
  const invalid=value=>value.raw!==null&&!decode(value.raw);
  const fail=(next,why='',detail=null)=>{status=next;reason=why;failure=detail;return false;};
  if(!available(baseline))fail('memory','storage',baseline.failure);
  else if(invalid(baseline))fail('invalid','schema');
  const blocked=()=>status==='conflict'||status==='invalid';
  function check() {
    if(blocked())return false;
    const latest=read();
    if(!available(latest)){fail('memory','storage',latest.failure);return true;}
    // A previously unreadable slot can only be claimed once proven empty.
    if(!available(baseline)) {
      if(latest.raw!==null)return fail('conflict','unreadable-baseline');
      baseline=latest;
    }
    if(latest.current.value!==baseline.current.value||latest.legacy?.value!==baseline.legacy?.value)return fail('conflict','changed');
    return true;
  }
  return {
    key,legacyKey,
    get raw(){return raw;},get localRaw(){return localRaw;},
    get status(){return status==='saved'&&savedText!==localRaw?'pending':status;},get reason(){return reason;},get failure(){return failure?{...failure}:null;},get blocked(){return blocked();},
    check,
    save(state,options={}) {
      if(importPending&&!options.replacement)return Promise.resolve(false);
      const text=JSON.stringify(state),run=String(state.runId??`seed:${state.seed}:${state.mode}`);
      if(latestRun!==null&&latestRun!==run)epoch++;latestRun=run;
      const generation=epoch,ticket=++revision,large=text.length>=SAVE_COMPRESSION_THRESHOLD;localRaw=text;if(!blocked())status='pending';
      const write=async()=>{
        if(generation!==epoch||large&&ticket!==revision||!check())return false;
        if(options.replacement&&raw!==options.expectedRaw)return false;
        if(!locks?.request)return fail('memory','coordination');
        let durableText;
        try{const encoded=encode(text,baseline.raw,{replacement:!!options.replacement});durableText=typeof encoded==='string'?encoded:await encoded;}catch{return generation===epoch?fail('memory','encoding'):false;}
        try {
          return await locks.request('fx-progress:'+key,{mode:'exclusive'},()=>{
            // Let an in-flight snapshot of this run land even when newer ticks
            // are waiting, otherwise a busy market could starve every save.
            if(generation!==epoch||!check())return false;
            const latest=read();
            if(!available(latest))return fail('memory','storage',latest.failure);
            // Preserve the exact pre-v9 bytes once before replacing an older schema.
            // Backups stay in this mode's namespace and are never overwritten.
            let previousVersion;try{previousVersion=JSON.parse(baseline.raw)?.version;}catch{}
            if(Number.isInteger(previousVersion)&&previousVersion<9&&state.version>=9){
              const backupKey=key+':pre-v9',backup=storage.readItem(backupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(backupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(backupKey));
            }
            if(!storage.setItem(key,durableText))return fail('memory','storage',storage.failureFor?.(key));
            // After migration, the current slot is authoritative. Never delete
            // the legacy slot, which is still a recovery source for the user.
            baseline={current:{available:true,value:durableText},legacy:null,raw:durableText};
            raw=durableText;savedText=text;status='saved';reason='';failure=null;return true;
          });
        } catch(error) {return generation===epoch?fail('memory','coordination',storageFailure(error,'lock')):false;}
      };
      queue=queue.then(write,write);return queue;
    },
    async replaceFromBackup(state,expectedRaw) {
      if(importPending||blocked()||raw!==expectedRaw||!check()||!decode(JSON.stringify(state)))return false;
      const beforeLocal=localRaw,beforeRun=latestRun;importPending=true;epoch++;
      try{const saved=await this.save(state,{replacement:true,expectedRaw});if(!saved){localRaw=beforeLocal;latestRun=beforeRun;storage.forgetItem(key);}return saved;}
      finally{importPending=false;}
    },
    // Only an explicit user choice may replace this page with another save.
    // Cancel queued writes so a pre-reload snapshot cannot be written afterward.
    reload() {
      const latest=read();
      if(!available(latest)){reason='storage';failure=latest.failure;return {ok:false,reason};}
      if(invalid(latest)){fail('invalid','schema');return {ok:false,reason};}
      epoch++;latestRun=null;baseline=latest;raw=latest.raw;localRaw=raw;savedText=raw===null?null:inspectSave(raw).currentRaw;status='ready';reason='';failure=null;
      storage.forgetItem(key);
      return {ok:true,state:decode(raw)};
    },
    backup(state) {
      const latest=read();
      let recoveryRaw=null,importRaws=[];try{const archive=raw===null?null:inspectSave(raw);recoveryRaw=archive?.recoveryRaw??null;importRaws=archive?.importRaws??[];}catch{}
      return {recoveryRaw,importRaws,format:'fx-save-conflict-backup-v1',key,local:state,baselineRaw:raw,
        storedRaw:latest.current.available?latest.current.value:null,
        legacyRaw:latest.legacy?.available?latest.legacy.value:null,
        storageReadable:available(latest),saveDiagnostic:{status:status==='saved'&&savedText!==localRaw?'pending':status,reason,failure:failure?{...failure}:null,localCharacters:localRaw?.length??0,storedCharacters:latest.current.value?.length??0}};
    }
  };
}
