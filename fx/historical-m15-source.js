// Structural validation only. This module does not verify a vendor's timezone,
// quote side, licence or authenticity, and it never downloads or repairs data.
export const M15_DURATION_MS=900000;
export const M15_STEP_MS=37500;
export const M15_SOURCE_SCHEMA='historical-m15-ohlc-v1';
const MAX_AT=Number.MAX_SAFE_INTEGER-M15_DURATION_MS;
const fail=message=>{throw new Error(`Historical M15: ${message}`);};
const text=value=>typeof value==='string'&&value.trim()===value&&value.length>0&&value.length<=256;
const at=value=>Number.isSafeInteger(value)&&value>=0&&value<=MAX_AT;
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;};
const clone=value=>JSON.parse(JSON.stringify(value));

export function validateM15Pair(pair){
 if(typeof pair!=='string'||! /^[A-Z0-9]{2,12}\/[A-Z0-9]{2,12}$/.test(pair))fail('explicit pair required');
 return pair;
}
export function validateM15Seed(seed){
 if(!(typeof seed==='string'&&text(seed))&&!Number.isSafeInteger(seed))fail('seed must be a safe integer or nonempty string');
 return seed;
}
export function validateM15Bar(row){
 if(!row||typeof row!=='object'||Array.isArray(row)||!at(row.at)||row.at%M15_DURATION_MS!==0||![row.open,row.high,row.low,row.close].every(n=>Number.isFinite(n)&&n>0)||row.low>Math.min(row.open,row.close)||row.high<Math.max(row.open,row.close)||row.high<row.low)fail('invalid 15-minute OHLC bar');
 // A single reference price is deliberately not interpreted as bid/ask/volume.
 if(Object.keys(row).some(key=>!['at','open','high','low','close'].includes(key)))fail('unsupported bar field');
 return Object.freeze({at:row.at,open:row.open,high:row.high,low:row.low,close:row.close});
}
function validTimeZone(value){try{return text(value)&&Boolean(new Intl.DateTimeFormat('en',{timeZone:value}).resolvedOptions().timeZone);}catch{return false;}}

// A deterministic binding token for save/source compatibility, not a
// cryptographic content hash or evidence that the source has been verified.
export function m15BindingToken(value){
 const input=JSON.stringify(value);let a=2166136261,b=2246822507;
 for(let i=0;i<input.length;i++){const c=input.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,3266489909);}
 return [a,b].map(n=>(n>>>0).toString(16).padStart(8,'0')).join('');
}
export function validateHistoricalM15Source(input){
 if(!input||input.schemaVersion!==M15_SOURCE_SCHEMA||!text(input.datasetId)||!text(input.version)||!validTimeZone(input.timeZone)||input.timeUnit!=='milliseconds'||input.timestampMeaning!=='bar-open'||input.priceBasis!=='game-reference-price'||!text(input.priceUnit)||!['synthetic-fixture','historical-ohlc'].includes(input.provenance?.kind)||!text(input.provenance?.sourceId)||!Array.isArray(input.bars)||!input.bars.length||input.bars.length>1000000)fail('invalid source metadata');
 const pair=validateM15Pair(input.pair),bars=input.bars.map(validateM15Bar);
 for(let i=1;i<bars.length;i++)if(bars[i].at<bars[i-1].at+M15_DURATION_MS)fail('bars overlap or are unordered');
 if(input.closures!==undefined&&!Array.isArray(input.closures))fail('invalid verified closures');
 const closures=(input.closures||[]).map(c=>{
  if(!c||!at(c.from)||!at(c.to)||c.to<=c.from||c.from%M15_DURATION_MS!==0||c.to%M15_DURATION_MS!==0||c.classification!=='verified-closure'||!text(c.basis)||!text(c.calendarSource))fail('invalid verified closure');
  return {from:c.from,to:c.to,classification:c.classification,basis:c.basis,calendarSource:c.calendarSource};
 });
 let barIndex=0;
 for(let i=0;i<closures.length;i++){
  const c=closures[i];if(c.from<bars[0].at||c.to>bars.at(-1).at+M15_DURATION_MS||i&&c.from<closures[i-1].to)fail('closures overlap or are outside source bounds');
  while(barIndex<bars.length&&bars[barIndex].at+M15_DURATION_MS<=c.from)barIndex++;
  if(barIndex<bars.length&&bars[barIndex].at<c.to)fail('verified closure overlaps an observed bar');
 }
 const provenance=clone(input.provenance);
 if(provenance.kind==='historical-ohlc'&&(!['bid','ask','bid-ask-mid'].includes(provenance.quoteBasis)||!text(provenance.sourceTimeZone)||! /^[a-f0-9]{64}$/.test(provenance.sourceSha256)||!provenance.rights||typeof provenance.rights.redistribution!=='string'||typeof provenance.rights.localOnly!=='boolean'))fail('historical provenance must retain quote basis, timezone, hash and rights');
 if(input.observationGaps!==undefined&&!Array.isArray(input.observationGaps))fail('invalid observed gaps');
 const observationGaps=(input.observationGaps||[]).map(g=>{
  if(!g||!at(g.from)||!at(g.to)||g.to<=g.from||!['unexplained_observation_gap','weekend_closure_candidate','verified_closure'].includes(g.classification)||!text(g.classificationBasis)||g.classification==='verified_closure'&&!text(g.calendarSource))fail('invalid observed gap');
  return clone(g);
 });
 if(input.sourceBars!==undefined&&(!Array.isArray(input.sourceBars)||input.sourceBars.length!==bars.length))fail('invalid source-side bars');
 const sourceBars=input.sourceBars?.map((b,i)=>{
  if(!b||b.at!==bars[i].at||!at(b.firstObservedAt)||!at(b.lastObservedAt)||b.firstObservedAt<b.at||b.lastObservedAt>=b.at+M15_DURATION_MS||b.lastObservedAt<b.firstObservedAt||!Number.isSafeInteger(b.count)||b.count<1)fail('invalid observed bar coverage');
  for(const side of ['bid','ask'])validateM15Bar({at:b.at,...b[side]});
  return clone(b);
 });
 const normalized={schemaVersion:M15_SOURCE_SCHEMA,datasetId:input.datasetId,version:input.version,pair,timeZone:input.timeZone,timeUnit:'milliseconds',timestampMeaning:'bar-open',priceBasis:'game-reference-price',priceUnit:input.priceUnit,provenance,bars,closures,observationGaps,...(sourceBars?{sourceBars}:{}),...(input.approvedUse?{approvedUse:clone(input.approvedUse)}:{})};
 return freeze({...normalized,bindingToken:m15BindingToken(normalized)});
}
export function parseHistoricalM15Source(input){
 if(typeof input!=='string')return validateHistoricalM15Source(input);
 let value;try{value=JSON.parse(input);}catch{fail('invalid source JSON');}
 return validateHistoricalM15Source(value);
}

// No weekday/weekend inference. Every absent interval is missing unless an
// explicit verified calendar interval accounts for it; neither gets fake bars.
export function describeM15Coverage(source){
 const data=validateHistoricalM15Source(source),gaps=[];
 for(let i=1;i<data.bars.length;i++){
  let from=data.bars[i-1].at+M15_DURATION_MS;const to=data.bars[i].at;
  for(const c of data.closures){
   if(c.to<=from)continue;if(c.from>=to)break;
   if(c.from>from)gaps.push({from,to:c.from,classification:'missing'});
   const end=Math.min(c.to,to);gaps.push({from:Math.max(from,c.from),to:end,classification:'verified-closure',basis:c.basis,calendarSource:c.calendarSource});from=end;
  }
  if(from<to)gaps.push({from,to,classification:'missing'});
 }
 return freeze({from:data.bars[0].at,to:data.bars.at(-1).at+M15_DURATION_MS,gaps});
}
