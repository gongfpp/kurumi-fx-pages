import {ANALYTICS_JOURNEY_RELEASE} from './analytics-journey-release.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717';
import {validEvent} from './analytics-a-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

const ORIGIN='https://fx.gongfpp.icu',SRC='https://stats.gongfpp.icu/script.js',WEBSITE='bb8f9140-45fa-4919-99f5-43da20ec6aaf',HOOK='kurumiUmamiBeforeSend';

/** 原生概览与完整collector分流。仅自动pageview，不复制A、心跳或历史事件。 */
export function mountKurumiUmamiForApp({client,release=ANALYTICS_JOURNEY_RELEASE,location=globalThis.location,document=globalThis.document,window=globalThis.window}={}){
 const noop={observe:()=>false,reset:()=>false,destroy(){},snapshot:()=>({enabled:false,started:false,pageviewObserved:false})};
 if(release?.umamiEnabled!==true||release.origin!==ORIGIN||release.umamiSrc!==SRC||release.umamiWebsiteId!==WEBSITE||location?.origin!==ORIGIN||client?.source?.origin!==ORIGIN)return noop;
 let seed=null,started=false,loaded=false,pageviewObserved=false,departed=false,destroyed=false,script=null,reason=null;
 const leave=()=>{departed=true;},restore=e=>{if(e.persisted)departed=false;};
 window?.addEventListener?.('pagehide',leave);window?.addEventListener?.('pageshow',restore);
 function beforeSend(type,payload){
  if(destroyed||departed||!seed||!client.allowed()||type!=='event'||payload?.name||pageviewObserved||payload?.website!==WEBSITE||payload?.hostname!=='fx.gongfpp.icu')return null;
  const current=client.observationContext();if(!current||current.visitor!==seed.visitor||current.visitorBornAt!==seed.visitorBornAt)return null;
  const next={...payload,id:current.visitor};delete next.data;
  // 来源概览只需外部域名，不收集外部文章路径、查询或hash。
  try{const referrer=new URL(payload.referrer||'',ORIGIN);next.referrer=payload.referrer&&referrer.origin!==ORIGIN?referrer.origin:'';}catch{next.referrer='';}
  pageviewObserved=true;return next;
 }
 function observe(event){
  if(destroyed||departed||event?.family!=='visit'||event.action!=='enter'||!client.allowed()||!validEvent(event,{source:client.source,now:event.at}))return false;
  const current=client.observationContext();if(!current||current.visitor!==event.visitor||current.visitorBornAt!==event.visitorBornAt)return false;
  seed={visitor:event.visitor,visitorBornAt:event.visitorBornAt};
  if(started)return true;
  if(window.umami||document.querySelector?.('script[data-website-id]')){reason='existing-tracker';return false;}
  const target=document.head||document.body;if(!target?.appendChild)return false;
  script=document.createElement('script');script.src=SRC;script.defer=true;
  for(const [key,value]of Object.entries({'data-website-id':WEBSITE,'data-host-url':'https://stats.gongfpp.icu','data-domains':'fx.gongfpp.icu','data-tag':'edgeone-pages','data-before-send':HOOK,'data-do-not-track':'true','data-exclude-search':'true','data-exclude-hash':'true','data-performance':'false','data-fetch-credentials':'omit'}))script.setAttribute(key,value);
  window[HOOK]=beforeSend;script.addEventListener('load',()=>{loaded=true;});script.addEventListener('error',()=>{reason='script-error';});
  started=true;target.appendChild(script);return true;
 }
 return{observe,reset(){seed=null;return true;},snapshot:()=>({enabled:true,started,loaded,pageviewObserved,reason}),destroy(){destroyed=true;seed=null;window?.removeEventListener?.('pagehide',leave);window?.removeEventListener?.('pageshow',restore);}};
}
