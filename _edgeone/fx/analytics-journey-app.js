import {createAnalyticsJourney} from './analytics-journey.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717';
import {ANALYTICS_JOURNEY_RELEASE} from './analytics-journey-release.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717';

const ENDPOINT='https://stats.gongfpp.icu/api/journey/v1/events',ORIGIN='https://fx.gongfpp.icu';
const dialogs=Object.freeze({'mode-dialog':'landing','privacy-dialog':'stats','help-dialog':'help','leaderboard-dialog':'leaderboard','comment-credits-dialog':'comments','save-restore-dialog':'save','save-conflict-dialog':'save','bgm-dialog':'settings','voice-library-dialog':'settings','achievements-dialog':'stats'});

/** 只读取既有 UI 状态和模式；不读取正文、输入值、昵称、存档或精确游戏数值。 */
export function journeySurface(document,getState){
 const open=[...(document?.querySelectorAll?.('dialog[open]')||[])].at(-1);
 if(open)return dialogs[open.id]||'other';
 if(document?.querySelector?.('.pixel-settings[open]'))return 'settings';
 try{const state=getState?.();return state?.runId&&['story','endless'].includes(state.mode)?'game':'landing';}catch{return 'other';}
}

/** 实际 app 使用此接线；默认关闭，网络故障不阻断游戏，不复用 A 的 ACK。 */
export function mountAnalyticsJourneyForApp({client,getState,release=ANALYTICS_JOURNEY_RELEASE,location=globalThis.location,document=globalThis.document,window=globalThis.window,fetch:fetcher=globalThis.fetch?.bind(globalThis),...testOptions}={}){
 const enabled=release?.enabled===true&&release.origin===ORIGIN&&release.endpoint===ENDPOINT&&location?.origin===ORIGIN;
 const transport=async(payload,{signal}={})=>{
  if(!enabled||!client.allowed()||!fetcher)return null;
  const response=await fetcher(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal,credentials:'omit',referrerPolicy:'no-referrer',keepalive:true});
  if(!response?.ok)return null;
  try{return await response.json();}catch{return null;}
 };
 return createAnalyticsJourney({...testOptions,client,enabled,transport,document,window,getSurface:()=>journeySurface(document,getState)});
}
