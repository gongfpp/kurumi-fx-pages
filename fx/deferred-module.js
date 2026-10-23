// One optional module request at a time. A rejected attempt is never retained
// as the business cache: a later explicit request can retry the same module URL.
export function createDeferredModule(load){
 let value=null,pending=null,error=null;
 return {
  get value(){return value;},get error(){return error;},get pending(){return !!pending;},
  load(){
   if(value)return Promise.resolve(value);
   if(pending)return pending;
   error=null;
   pending=Promise.resolve().then(load).then(module=>{value=module;pending=null;return module;},reason=>{pending=null;error=reason;throw reason;});
   return pending;
  }
 };
}
