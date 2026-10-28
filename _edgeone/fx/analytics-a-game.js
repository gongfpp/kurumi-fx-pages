import {positionBand,leverageBand,holdingBand,levelBand,capitalBand,profitBand,riskBand} from './analytics-a-policy.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {safeLiveTradeEvidence} from './live-market-state.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {safeHistoricalTradeEvidence} from './historical-evidence.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {safeHistoricalSegmentEvidence} from './history-continuation.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {analyticsMarketSource} from './analytics-a-observations.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
// Read-only observations. All labels are closed contract enums; game IDs are
// used only for local deduplication, never copied into data.
export function createAnalyticsAGame({client,getState,equity,stamina,moodPercent=()=>null,riskPercent=()=>null,storyEpisodes=[]}){
 const memories=new WeakMap();
 function memory(){const s=getState();let m=memories.get(s);if(!m){m={run:s.runId,seen:new Set(),trades:new WeakSet(),executions:new Set(),opens:new Map(),stories:new Map(),levels:null,risk:null};memories.set(s,m);}if(m.run!==s.runId){memories.delete(s);return memory();}return m;}
 const context=()=>{const s=getState();return{run:s.runId,mode:s.mode,day:s.day,marketSource:analyticsMarketSource(s)};};
 const emit=(name,data)=>client.emit(name,data,context());
 function once(key,name,data){if(!client.allowed())return false;const m=memory();if(m.seen.has(key))return false;const ok=emit(name,data);if(ok)m.seen.add(key);return ok;}
 const stage=(value,extra={})=>once('funnel:'+value,'funnel.stage',{stage:value,...extra});
 // The supplied mood percentage is the existing emotionIntensity * 100:
 // emotional impact strength, never happiness or psychological tolerance.
 const levels=()=>{const s=getState();return{stamina:levelBand(stamina(s).value/stamina(s).max*100),mood:levelBand(moodPercent(s))};};
 function clock(t){
  if(!Number.isFinite(t?.timestamp)||t.timePrecision==='day-and-beat-only')return null;
  const segment=safeHistoricalSegmentEvidence(t.marketSegment);
  if(segment?.source==='simulated')return segment.timestamp===t.timestamp?'historical-simulated:'+segment.segment:null;
  const historical=safeHistoricalTradeEvidence(t);if(historical)return 'historical:'+historical.sourceVersion+':'+(historical.symbol??t.symbol??'USD/JPY');
  const live=safeLiveTradeEvidence(t.liveQuote);if(live)return live.sourceTimestamp===t.timestamp?(live.replay?'shared-replay:':'live:')+live.provider+':'+live.source+':'+live.symbol:null;
  const s=getState();return !s.historical&&!s.liveMarket&&(!t.timePrecision||t.timePrecision==='game-clock')&&s.tradingClock?.version===1&&Number.isFinite(s.tradingClock.epochMs)?'game:'+s.tradingClock.epochMs:null;
 }
 function story(episode,{visible=false,token,result='shown',choiceType='none'}={}){
  if(!visible||getState().mode!=='story'||!client.allowed()||typeof token!=='string'||!token)return false;
  const m=memory(),canonical=storyEpisodes.find(e=>e.id===episode?.id&&e.number===episode?.number),number=canonical?.number;
  const band=number>=1&&number<=50?(number<=17?'early':number<=34?'middle':'late'):'unknown';
  const key=token+':'+(canonical?.id??'unclassified'),previous=m.stories.get(key);
  if(result!=='shown'&&!previous?.shown)return false;
  if(previous?.[result])return false;
  if(!emit('story.progress',{stage:band,choiceType,result}))return false;
  m.stories.set(key,{...previous,[result]:true});while(m.stories.size>128)m.stories.delete(m.stories.keys().next().value);return true;
 }
 const api={
  context,emit,levels,story,
  activate({fresh=false,restart=false,reason='manual'}={}){if(!client.allowed())return;stage('mode');if(restart)once('restart','visit.restart',{reason});if(fresh){once('new','visit.new_game',{});stage('start');}else emit('visit.resume',{result:'success',reason:'none'});},
  resumeFailed(reason='unknown'){client.emit('visit.resume',{result:'failure',reason});},
  guide({skipped=false,replay=false}={}){if(replay||getState().mode!=='story')return;stage('guide',{guideResult:skipped?'skipped':'completed'});emit('story.progress',{stage:'opening',choiceType:'none',result:skipped?'skipped':'completed'});},
  opening(){if(getState().mode==='story')once('opening','story.progress',{stage:'opening',choiceType:'none',result:'shown'});},
  observe(){
   const m=memory();if(!client.allowed()){m.risk=null;m.levels=null;return;}const current=levels(),key=JSON.stringify(current);
   if(current.stamina&&current.mood&&m.levels!==key){if(emit('state.levels',current))m.levels=key;}
   const risk=riskBand(riskPercent(getState()));
   if(risk&&m.risk&&risk!==m.risk)emit('trade.risk',{beforeRisk:m.risk,afterRisk:risk});m.risk=risk;
  },
  attempt(percent,leverage){emit('trade.attempt',{positionBand:positionBand(percent),leverageBand:leverageBand(leverage)});},
  rejected(reason='other'){emit('trade.rejected',{reason});},
  trade(t,capitalBefore){
   if(!t||typeof t!=='object'||!client.allowed()||!['open','half','close','closing','rescue','stop','take-profit','liquidation'].includes(t.type))return;const m=memory();if(m.trades.has(t))return;m.trades.add(t);
   const stats=getState().runStatistics,matching=(stats?.trades||[]).filter(row=>Number.isSafeInteger(row.sequence)&&row.sequence>=1&&row.sequence<=stats.executions&&['type','positionId','timestamp','margin','leverage','pnl','entry','exit'].every(k=>(row[k]??null)===(t[k]??null)));
   const receipt=matching.length===1?matching[0]:getState().lastTrade===t?matching.at(-1):null;
   if(receipt&&m.executions.has(receipt.sequence)||matching.length>1&&!receipt&&matching.every(row=>m.executions.has(row.sequence)))return;
   if(receipt)m.executions.add(receipt.sequence);while(m.executions.size>2048)m.executions.delete(m.executions.values().next().value);
   if(t.type==='open'){
    const p=positionBand(Number.isFinite(capitalBefore)&&capitalBefore>0?t.margin/capitalBefore*100:NaN),l=leverageBand(t.leverage);
    if(!p||!l)return;m.opens.set(t.positionId,{at:t.timestamp,clock:clock(t),positionBand:p});emit('trade.filled',{positionBand:p,leverageBand:l});
    // Only proven first trades reach the first-fill stage after a restored run.
    if(t.positionId==='order-1'&&stats?.complete===true&&stats.timelinePartial===false&&stats.executions===1)stage('first_fill');return;
   }
   const observed=m.opens.get(t.positionId),retained=(stats?.trades||[]).filter(row=>row.type==='open'&&row.positionId===t.positionId),opening=observed??(retained.length===1?{at:retained[0].timestamp,clock:clock(retained[0])}:null),exitClock=clock(t);
   const holding=opening?.clock&&opening.clock===exitClock&&Number.isFinite(opening.at)?holdingBand(t.timestamp-opening.at):null;
   const action=t.type==='liquidation'?'liquidation':t.type==='stop'?'stop_loss':'close';
   const reason=t.type==='take-profit'?'other':action==='liquidation'?'margin':action==='stop_loss'?'stop':['close','half','rescue'].includes(t.type)?'manual':getState().phase==='ending'?'ending':t.type==='closing'?'day_end':'other';
   emit('trade.'+action,{positionBand:observed?.positionBand??'unknown',leverageBand:leverageBand(t.leverage)??'unknown',holdingBand:holding??'unknown',reason});
   const first=stats?.trades?.find(row=>row.type!=='open');
   if(stats?.complete===true&&!stats.timelinePartial&&first?.positionId===t.positionId&&first.timestamp===t.timestamp&&first.type===t.type)stage('first_close');if(t.positionClosed)m.opens.delete(t.positionId);
  },
  action(category,before,{result='success',reason='none',cost}={}){const after=levels();if(!before?.mood||!after.mood||!before.stamina||!after.stamina)return false;emit('state.action',{category,result,reason,beforeStamina:before.stamina,afterStamina:after.stamina,beforeMood:before.mood,afterMood:after.mood,...(Number.isFinite(cost)?{costBand:capitalBand(cost)}:{})});},
  // Called only for real manual completion receipts. Repeated uses count again;
  // automatic saves/polls report faults separately and never enter this stream.
  feature(feature,result,reason='none',observedContext){return client.emit('runtime.feature',{feature,result,reason},observedContext??context());},
  settlement(){const s=getState(),r=s.dayReport;if(!r||r.day!==s.day)return;const trades=(s.history||[]).filter(t=>t.day===s.day&&t.type!=='open').length;
   once('settlement:'+s.day,'settlement.day',{trades,capitalBand:capitalBand(equity(s)),pnlBand:profitBand(r.net)});if(s.day===1)stage('first_settlement');},
  ending(){const s=getState();if(s.phase!=='ending'||!s.ending)return;once('ending','story.ending',{endingType:s.ending.id});stage('ending');if(s.mode==='story')once('ending-story','story.progress',{stage:'ending',choiceType:'none',result:'completed'});},
 };
 // Observability must not turn a storage or reporting fault into a game error.
 return Object.fromEntries(Object.entries(api).map(([key,fn])=>[key,(...args)=>{try{return fn(...args);}catch{return false;}}]));
}
