// Approved A only. Independent from experience-v1; never relabel old consent or queues.
export const PROFILE='experience-a-v1';
export const CONTRACT_REVISION=3;
export const LIMITS=Object.freeze({batchEvents:40,batchBytes:48000,queueEvents:240,queueAgeMs:86400000,visitorAgeMs:7776000000,sessionIdleMs:1800000,eventsPerVisitorHour:600,noncriticalPerVisitorHour:480,detailDays:30,aggregateDays:180});
export const MODES=['none','story','endless'];
export const BANDS=Object.freeze({
 position:['zero','p01_10','p10_25','p25_50','p50_75','p75_100','over100'],
 leverage:['x1','x2_10','x10_25','x25_50','x50_100','over100'],
 holding:['lt10s','s10_60','m1_5','m5_30','ge30m'],
 level:['empty','low','medium','high','full'],
 capital:['negative','zero','lt1m','m1_10','m10_30','m30_100','ge100m'],
 pnl:['loss_ge10m','loss_m1_10','loss_lt1m','zero','gain_lt1m','gain_m1_10','gain_ge10m'],
 duration:['lt1m','m1_5','m5_15','m15_30','m30_60','ge60m']
});
// Descriptor format: enum array, bounded integer [min,max] via {integer:...}, boolean.
const integer=max=>({integer:[0,max]});
const E=(required,optional={})=>({required,optional});
// Missing historical open context is explicit, not a zero/smallest band.
const exitBands=values=>[...values,'unknown'];
export const EVENTS=Object.freeze({
 'visit.enter':E({returning:'boolean',device:['desktop','mobile','tablet','unknown']}),
 'visit.new_game':E({}),
 'visit.resume':E({result:['success','failure'],reason:['none','missing','corrupt','incompatible','storage','unknown']}),
 'visit.restart':E({reason:['ending','manual','other']}),
 'load.start':E({elapsedMs:integer(600000)}),
 'load.skeleton':E({elapsedMs:integer(600000)}),
 'load.ready':E({elapsedMs:integer(600000)}),
 'load.tradable':E({elapsedMs:integer(600000)}),
 'load.resource_failure':E({resource:['script','style','image','audio','data','other'],code:['network','timeout','http','decode','unknown']}),
 'load.vital':E({metric:['lcp','inp','cls'],value:integer(600000),support:['supported']}),
 'load.support':E({lcp:'boolean',inp:'boolean',cls:'boolean'}),
 'funnel.stage':E({stage:['mode','start','guide','first_fill','first_close','first_settlement','ending']},{guideResult:['completed','skipped']}),
 'trade.attempt':E({positionBand:BANDS.position,leverageBand:BANDS.leverage}),
 'trade.filled':E({positionBand:BANDS.position,leverageBand:BANDS.leverage}),
 'trade.rejected':E({reason:['funds','stamina','market','position_limit','invalid','cooldown','other']}),
 'trade.stop_loss':E({positionBand:exitBands(BANDS.position),leverageBand:exitBands(BANDS.leverage),holdingBand:exitBands(BANDS.holding),reason:['stop','gap','other']}),
 'trade.close':E({positionBand:exitBands(BANDS.position),leverageBand:exitBands(BANDS.leverage),holdingBand:exitBands(BANDS.holding),reason:['manual','day_end','ending','other']}),
 'trade.liquidation':E({positionBand:exitBands(BANDS.position),leverageBand:exitBands(BANDS.leverage),holdingBand:exitBands(BANDS.holding),reason:['margin','risk','other']}),
 'trade.risk':E({beforeRisk:['low','medium','high','critical'],afterRisk:['low','medium','high','critical']}),
 'state.levels':E({stamina:BANDS.level,mood:BANDS.level}),
 'state.action':E({category:['work','rest','item','living'],result:['success','failure','cancelled'],reason:['none','funds','stamina','mood','unavailable','cooldown','storage','other'],beforeStamina:BANDS.level,afterStamina:BANDS.level,beforeMood:BANDS.level,afterMood:BANDS.level},{costBand:BANDS.capital}),
 'story.progress':E({stage:['opening','early','middle','late','ending','unknown'],choiceType:['none','dialogue','risk','relationship','life','other'],result:['shown','chosen','completed','skipped']}),
 'story.ending':E({endingType:['million','walkaway','broke','crisis']}),
 'settlement.day':E({trades:integer(10000),capitalBand:BANDS.capital,pnlBand:BANDS.pnl}),
 'runtime.menu':E({menu:['settings','help','stats','leaderboard','comments','save','other'],action:['open','close']}),
 'runtime.feature':E({feature:['settings','help','stats','leaderboard','comments','save','load','audio','other'],result:['success','failure'],reason:['none','network','timeout','storage','invalid','unavailable','other']}),
 'runtime.error':E({scope:['runtime','resource','comments','leaderboard','save','telemetry','other'],code:['runtime_error','unhandled_rejection','network_error','timeout','http_error','invalid_response','storage_error','unknown']}),
 'runtime.active':E({activeMs:integer(60000)}),
 'runtime.interruption':E({reason:['pagehide','hidden_timeout','explicit_exit','run_replaced','unknown'],durationBand:BANDS.duration}),
 'runtime.coverage':E({criticalEligible:integer(1000000),sampledEligible:integer(1000000),sampledSelected:integer(1000000),sent:integer(1000000),queueDropped:integer(1000000),expiredDropped:integer(1000000),quotaDropped:integer(1000000),sendFailed:integer(1000000)})
});
export const COMMON_KEYS=['id','visitor','visitorBornAt','session','run','game','site','channel','path','build','mode','at','seq','day','family','action','data','profile','v'];
export function sampledSession(channel,session){let h=2166136261;for(const c of channel+':'+session){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0)%10===0;}
export const isSampledEvent=e=>e.family==='load'&&['vital','support'].includes(e.action)||e.family==='runtime'&&e.action==='menu';
export const isNoncritical=e=>isSampledEvent(e)||e.family==='runtime'&&['active','coverage'].includes(e.action);
