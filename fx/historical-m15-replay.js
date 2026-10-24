import {validateHistoricalM15Source,validateM15Seed,describeM15Coverage,M15_DURATION_MS} from './historical-m15-source.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {createM15Path,M15_PATH_MODEL} from './historical-m15-path.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {aggregateM15Samples} from './historical-m15-aggregate.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
const fail=message=>{throw Error('Historical M15 replay: '+message);};
const clone=value=>value===null?null:JSON.parse(JSON.stringify(value));

// Feed and all unseen OHLC stay outside saved game state. The only serialised
// data are a source binding, fixed seed and the cursor of executed samples.
export class HistoricalM15Replay{
 #source;#seed;#next=0;#now=null;#observed=[];#paths=new Map();#coverage;
 constructor({source,seed,progress=null}={}){
  this.#source=validateHistoricalM15Source(source);this.#seed=validateM15Seed(seed);this.#coverage=describeM15Coverage(this.#source);
  if(progress!==null)this.#restore(progress);
 }
 get pair(){return this.#source.pair;}
 get marketAt(){return this.#now;}
 get cursor(){return this.#next;}
 get exhausted(){return this.#next===this.#source.bars.length*25;}
 #sample(index){
  if(index>=this.#source.bars.length*25)return null;
  const barIndex=Math.floor(index/25);
  if(!this.#paths.has(barIndex))this.#paths.set(barIndex,createM15Path(this.#source.bars[barIndex],{seed:this.#seed,pair:this.#source.pair}));
  return this.#paths.get(barIndex)[index%25];
 }
 peekNextTime(){return this.#sample(this.#next)?.at??null;}
 // Execution adapter only: one next mark, never the unseen source OHLC.
 peekNextSample(){const sample=this.#sample(this.#next);return sample?{...sample}:null;}
 next(){
  const sample=this.#sample(this.#next);if(!sample)return null;
  this.#next++;this.#now=sample.at;this.#observed.push(sample);return {...sample};
 }
 advanceTo(at){
  if(!Number.isSafeInteger(at)||at<0||this.#now!==null&&at<this.#now)fail('market time cannot go backwards');
  const arrived=[];let next;
  while((next=this.peekNextTime())!==null&&next<=at)arrived.push(this.next());
  this.#now=at;return arrived;
 }
 observedSamples(){return this.#observed.map(sample=>({...sample}));}
 candles(minutes=15,{after}={}){
  if(this.#now===null||!this.#observed.length)return [];
  const first=after===undefined?null:this.#observed.find(sample=>sample.at>after);
  if(after!==undefined&&!first)return [];
  const through=this.#observed.at(-1).barAt,anchors=[];
  for(let i=0;i<this.#source.bars.length&&this.#source.bars[i].at<=through;i++){this.#sample(i*25);anchors.push(...this.#paths.get(i));}
  return aggregateM15Samples(anchors,{minutes,now:this.#now,fromAt:first?.at??0});
 }
 completedSourceBar(sample=this.#observed.at(-1)){
  if(!sample||sample.step!==24||sample.at>this.#now||!this.#observed.some(s=>s.barAt===sample.barAt&&s.step===24))return null;
  const index=this.#source.bars.findIndex(b=>b.at===sample.barAt);return index<0?null:{...this.#source.bars[index]};
 }
 sourceSidesForCompletedBar(sample=this.#observed.at(-1)){
  if(!this.completedSourceBar(sample))return null;
  const index=this.#source.bars.findIndex(b=>b.at===sample.barAt);return clone(this.#source.sourceBars?.[index]??null);
 }
 coverage(){
  const through=this.#now??this.#coverage.from;
  return {from:this.#coverage.from,to:Math.min(through,this.#coverage.to),gaps:this.#coverage.gaps.filter(g=>g.from<through).map(g=>({...g,to:Math.min(g.to,through)})),observationGaps:this.#source.observationGaps.filter(g=>g.from<through).map(g=>({...g,to:Math.min(g.to,through)}))};
 }
 snapshot(){return {version:1,pathModel:M15_PATH_MODEL,sourceBinding:this.#source.bindingToken,pair:this.#source.pair,seed:this.#seed,nextEvent:this.#next,marketAt:this.#now,lastSample:clone(this.#observed.at(-1)??null)};}
 #restore(progress){
  if(!progress||progress.version!==1||progress.pathModel!==M15_PATH_MODEL||progress.sourceBinding!==this.#source.bindingToken||progress.pair!==this.#source.pair||progress.seed!==this.#seed||!Number.isSafeInteger(progress.nextEvent)||progress.nextEvent<0||progress.nextEvent>this.#source.bars.length*25||progress.marketAt!==null&&(!Number.isSafeInteger(progress.marketAt)||progress.marketAt<0))fail('progress/source identity mismatch');
  for(let i=0;i<progress.nextEvent;i++)this.next();
  const last=this.#observed.at(-1)??null,next=this.peekNextTime();
  if(JSON.stringify(last)!==JSON.stringify(progress.lastSample)||last&&(progress.marketAt===null||progress.marketAt<last.at)||next!==null&&progress.marketAt!==null&&progress.marketAt>next)fail('progress cursor/time/price mismatch');
  this.#now=progress.marketAt;
 }
}
