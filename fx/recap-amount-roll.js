// C's delivered money roller, using the existing recap clock. The 250ms
// deceleration now ends at the receipt's shared amount/scan/audio anchor.
// Financial targets and labels remain the sealed frame; columns are decorative.
import {receiptRecapFrame} from './recap-receipts.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
const DURATION=250,HEIGHT=1.15;

export function rollingSample(column,time){
 const duration=column.duration||DURATION,p=Math.max(0,Math.min(1,(time-column.started)/duration)),d=column.to-column.from,m=column.velocity*duration;
 if(p===1)return {position:column.to,velocity:0,complete:true};
 const position=column.from+d*(-2*p*p*p+3*p*p)+m*(p*p*p-2*p*p+p);
 const velocity=(d*(-6*p*p+6*p)+m*(3*p*p-4*p+1))/duration;
 return {position,velocity,complete:false};
}

export function amountRollWindow(timeline,elapsed){
 const beats=timeline?.scoreBeats||[],index=beats.findIndex(beat=>beat.atMs>elapsed);
 if(index<0)return null;
 const next=beats[index],start=Math.max(0,next.atMs-DURATION,index?beats[index-1].atMs:0);
 if(elapsed<=start)return null;
 // Use the counter's exact frame and cent conversion, including old ledgers
 // and half-cent values; formatting the raw receipt could round differently.
 const target=receiptRecapFrame(timeline,next.atMs).settlementAssets-timeline.opening;
 return {eventId:next.eventId,start,end:next.atMs,value:Math.round(target*100)/100};
}

export function createRecapMoneyRoller(root){
 const doc=root.ownerDocument;let text='',columns=[],key='',disposed=false,plain=true;
 const make=(cls,value)=>{const node=doc.createElement('span');node.className=cls;if(value!==undefined)node.textContent=value;node.setAttribute('aria-hidden','true');return node;};
 const label=target=>{root.setAttribute('aria-label',target);root.dataset.cTargetText=target;};
 const drawPlain=target=>{
  if(!plain||text!==target){root.replaceChildren(...Array.from(target,c=>make(/\d/.test(c)?'recap-digit':'recap-punctuation',c)));}
  text=target;columns=[];key='';plain=true;root.dataset.cSettled='true';delete root.dataset.cRollTargetText;label(target);
 };
 const update=(current,{next=null,elapsed=0}={})=>{
  if(disposed)return;
  if(!next||elapsed<=next.start||elapsed>=next.end||next.text===current){drawPlain(current);return;}
  const nextKey=[current,next.text,next.eventId,next.start,next.end].join('|');
  if(key!==nextKey){
   const oldDigits=current.replace(/\D/g,''),targetDigits=next.text.replace(/\D/g,''),duration=next.end-next.start;
   // Preserve the current receipt's sign until the anchor, including zero and
   // crossings through zero. Only the hidden decorative wheels anticipate it.
   const prefix=current.match(/^\D*/)[0],body=next.text.replace(/^\D*/,'');
   const nodes=Array.from(prefix,c=>make('recap-punctuation',c));let index=0;columns=[];
   for(const char of body){
    if(!/\d/.test(char)){nodes.push(make('recap-punctuation',char));continue;}
    const place=targetDigits.length-1-index++,old=oldDigits[oldDigits.length-1-place],from=old===undefined?0:Number(old),digit=Number(char);
    if(from===digit){nodes.push(make('recap-digit',char));continue;}
    const viewport=make('recap-digit c-money-column'),track=make('c-money-track');
    for(let i=0;i<50;i++)track.append(make('c-money-cell',String(i%10)));
    viewport.append(track);nodes.push(viewport);
    let to=digit;while(to<=from+.05)to+=10;if(to-from<2)to+=10;
    columns.push({place,viewport,track,digit,from,to,velocity:3*(to-from)/duration,started:next.start,duration});
   }
   root.replaceChildren(...nodes);key=nextKey;plain=false;
  }
  text=current;label(current);root.dataset.cRollTargetText=next.text;root.dataset.cSettled='false';
  for(const column of columns){
   const sample=rollingSample(column,elapsed);column.track.style.transform=`translate3d(0,${-sample.position*HEIGHT}em,0)`;
   Object.assign(column.viewport.dataset,{rollPosition:String(sample.position),rollVelocity:String(sample.velocity),rollTarget:String(column.digit),rollStart:String(next.start),rollEnd:String(next.end)});
  }
 };
 return {update,reset:target=>{if(!disposed)drawPlain(target);},get nodes(){return [...root.children];},get settled(){return plain;},dispose(){disposed=true;columns=[];}};
}
