import {EVENTS,COMMON_KEYS,MODES,PROFILE,LIMITS} from './analytics-a-contract.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {experienceSource} from './experience-policy.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
export {experienceSource as analyticsSource};
export const A_KEYS=Object.freeze({consent:'fx-api-v1-analytics-a-consent',visitor:'fx-api-v1-analytics-a-visitor',session:'fx-api-v1-analytics-a-session',queue:'fx-api-v1-analytics-a-queue',budget:'fx-api-v1-analytics-a-budget'});
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{16,80}$/.test(x);
const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
export function validData(name,data){
 const schema=EVENTS[name];if(!schema||!object(data))return false;
 const keys={...schema.required,...schema.optional};
 if(Object.keys(schema.required).some(k=>!Object.hasOwn(data,k))||Object.keys(data).some(k=>!Object.hasOwn(keys,k)))return false;
 if(!Object.entries(data).every(([key,value])=>{const d=keys[key];return d==='boolean'?typeof value==='boolean':Array.isArray(d)?d.includes(value):int(value,...d.integer);}))return false;
 if(name==='funnel.stage'&&(data.stage==='guide'?!data.guideResult:Object.hasOwn(data,'guideResult')))return false;
 if(name==='state.action'&&(data.result==='success')!==(data.reason==='none'))return false;
 if(name==='visit.resume'&&(data.result==='success')!==(data.reason==='none'))return false;
 if(name==='runtime.feature'&&(data.result==='success')!==(data.reason==='none'))return false;
 if(name==='runtime.coverage'&&data.sampledSelected>data.sampledEligible)return false;
 if(name==='load.vital'&&data.metric==='cls'&&data.value>10000)return false;
 return true;
}
export function validEvent(e,{source,build,now=Date.now()}={}){
 if(!object(e)||Object.keys(e).length!==COMMON_KEYS.length||COMMON_KEYS.some(k=>!Object.hasOwn(e,k)))return false;
 if(e.profile!==PROFILE||e.v!==1||e.game!=='fx'||e.site!=='fx'||!id(e.id)||!id(e.visitor)||!id(e.session)||e.run!==''&&!id(e.run))return false;
 if(e.channel!==source?.channel||e.path!==source?.path||!MODES.includes(e.mode)||typeof e.build!=='string'||!/^[A-Za-z0-9_.-]{1,64}$/.test(e.build)||build&&e.build!==build)return false;
 if(!int(e.at,now-LIMITS.queueAgeMs,now+300000)||!int(e.visitorBornAt,Math.max(0,now-LIMITS.visitorAgeMs),now+300000)||e.visitorBornAt>e.at||!int(e.seq,1,1e9)||!int(e.day,0,10000))return false;
 if(typeof e.family!=='string'||typeof e.action!=='string')return false;
 const name=e.family+'.'+e.action;if(!validData(name,e.data))return false;
 if(e.family==='load'||name==='visit.enter')return e.mode==='none'&&e.run===''&&e.day===0;
 const gameplay=['trade','state','story','settlement','funnel'].includes(e.family)||['visit.new_game','visit.restart','runtime.active'].includes(name)||name==='visit.resume'&&e.data.result==='success';
 if(gameplay&&(e.mode==='none'||!id(e.run)))return false;
 if(name==='story.progress'&&e.mode!=='story')return false;
 if(e.family==='settlement'&&e.day<1)return false;
 return true;
}
export const positionBand=n=>!Number.isFinite(n)||n<0?null:n===0?'zero':n<=10?'p01_10':n<=25?'p10_25':n<=50?'p25_50':n<=75?'p50_75':n<=100?'p75_100':'over100';
export const leverageBand=n=>!Number.isFinite(n)||n<=0?null:n<=1?'x1':n<=10?'x2_10':n<=25?'x10_25':n<=50?'x25_50':n<=100?'x50_100':'over100';
export const holdingBand=ms=>!Number.isFinite(ms)||ms<0?null:ms<10000?'lt10s':ms<60000?'s10_60':ms<300000?'m1_5':ms<1800000?'m5_30':'ge30m';
export const levelBand=n=>!Number.isFinite(n)?null:n<=0?'empty':n<=25?'low':n<=60?'medium':n<100?'high':'full';
export const capitalBand=n=>!Number.isFinite(n)?null:n<0?'negative':n===0?'zero':n<1e6?'lt1m':n<1e7?'m1_10':n<3e7?'m10_30':n<1e8?'m30_100':'ge100m';
export const profitBand=n=>!Number.isFinite(n)?null:n<=-1e7?'loss_ge10m':n<=-1e6?'loss_m1_10':n<0?'loss_lt1m':n===0?'zero':n<1e6?'gain_lt1m':n<1e7?'gain_m1_10':'gain_ge10m';
export const durationBand=ms=>ms<60000?'lt1m':ms<300000?'m1_5':ms<900000?'m5_15':ms<1800000?'m15_30':ms<3600000?'m30_60':'ge60m';
// Only the existing normalized risk indication may be passed here.
export const riskBand=n=>!Number.isFinite(n)||n<0||n>100?null:n<=25?'low':n<=50?'medium':n<=75?'high':'critical';
