import {M15_DURATION_MS,M15_STEP_MS} from './historical-m15-source.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
import {M15_PATH_MODEL} from './historical-m15-path.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
export const M15_AGGREGATION_MODEL='linear-boundary-cut-v1';
const fail=message=>{throw Error('Historical M15 aggregation: '+message);};

// Cut the fixed piecewise-linear simulation at exact minute boundaries. The
// caller keeps the full anchors private; only the path through `now` is exposed.
// At 900s the old close belongs only to its source bar; a following source open
// at the same timestamp starts the new bar separately. No buckets are created
// in missing/closed source intervals. This is simulated, not observed tick data.
export function aggregateM15Samples(samples,{minutes=15,now,fromAt=0}={}){
 if(![1,5,15].includes(minutes)||!Number.isSafeInteger(now)||now<0||!Number.isSafeInteger(fromAt)||fromAt<0||!Array.isArray(samples))fail('invalid period, time or samples');
 const groups=[];let previous=null;
 for(const sample of samples){
  if(!sample||!Number.isSafeInteger(sample.at)||sample.at<0)fail('invalid sample timestamp');
  if(sample.barAt>now)continue;
  if(!Number.isSafeInteger(sample.barAt)||sample.barAt<0||sample.barAt%M15_DURATION_MS!==0||!Number.isInteger(sample.step)||sample.step<0||sample.step>24||sample.at!==sample.barAt+sample.step*M15_STEP_MS||!Number.isFinite(sample.price)||sample.price<=0||sample.simulated!==true||sample.pathModel!==M15_PATH_MODEL)fail('invalid arrived sample');
  if(previous&&(sample.at<previous.at||sample.at===previous.at&&!(previous.step===24&&sample.step===0&&sample.barAt===previous.at)))fail('unordered samples or same-time open precedes close');
  let group=groups.at(-1);
  if(!group||group.barAt!==sample.barAt){if(sample.step!==0||group&&sample.barAt<group.barAt+M15_DURATION_MS)fail('missing opening or overlapping source bar');group={barAt:sample.barAt,samples:[]};groups.push(group);}
  if(sample.step!==group.samples.length)fail('missing or repeated arrived step');
  group.samples.push(sample);previous=sample;
 }
 const duration=minutes*60000,result=[];
 for(const group of groups){
  const end=group.barAt+M15_DURATION_MS,until=Math.min(now,end);
  if(group.samples.at(-1).at<until)fail('the enclosing path anchor is absent');
  const priceAt=at=>{
   const step=Math.floor((at-group.barAt)/M15_STEP_MS),left=group.samples[step];
   if(left.at===at)return left.price;
   const right=group.samples[step+1],fraction=(at-left.at)/M15_STEP_MS;
   return Math.max(Math.min(left.price,right.price),Math.min(Math.max(left.price,right.price),left.price+(right.price-left.price)*fraction));
  };
  for(let start=group.barAt;start<end&&start<=until;start+=duration){
   const bucketEnd=start+duration,visibleEnd=Math.min(until,bucketEnd),visibleStart=Math.max(start,fromAt);
   if(visibleStart>visibleEnd)continue;
   const open=priceAt(visibleStart),close=priceAt(visibleEnd);let high=Math.max(open,close),low=Math.min(open,close);
   for(const sample of group.samples)if(sample.at>visibleStart&&sample.at<=visibleEnd){high=Math.max(high,sample.price);low=Math.min(low,sample.price);}
   result.push({timestamp:start,periodMinutes:minutes,open,high,low,close,closed:until>=bucketEnd,firstQuoteAt:visibleStart,lastQuoteAt:visibleEnd,availableAt:visibleEnd,sourceBarAt:group.barAt,simulated:true,sourceKind:'m15-simulated',timeSource:'historical-m15-simulation',priceBasis:'game-reference-price',pathModel:M15_PATH_MODEL,aggregationModel:M15_AGGREGATION_MODEL});
  }
 }
 return result;
}
