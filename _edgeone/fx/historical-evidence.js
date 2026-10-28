// Public report projection only. No provider, file path, local package URL or
// unobserved price enters a result through arbitrary save metadata.
import {hasHistoricalSimulation} from './history-continuation.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {M15_PATH_MODEL} from './historical-m15-path.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
const HASH=/^[a-f0-9]{64}$/;
const symbols=['USD/JPY','AUD/JPY','GBP/JPY'];
function validDate(value){return typeof value==='string'&&/^\d{4}-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export function safeHistoricalTradeEvidence(trade){
 const e=trade?.historicalQuote,at=trade?.timestamp;
 if(!e||!validDate(e.date)||!Number.isSafeInteger(e.cursor)||e.cursor<0||typeof e.sourceVersion!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(e.sourceVersion)||!Number.isSafeInteger(at)||at<0)return null;
 if(e.priceBasis==='m15-mid-reference-simulated-path'){
  if(!HASH.test(e.sourceHash)||e.pathModel!==M15_PATH_MODEL||!Number.isSafeInteger(e.barAt)||e.barAt<0||!Number.isInteger(e.step)||e.step<0||e.step>24||at!==e.barAt+e.step*37500)return null;
  return {date:e.date,cursor:e.cursor,sourceVersion:e.sourceVersion,sourceTimestamp:at,priceBasis:e.priceBasis,sourceHash:e.sourceHash,pathModel:e.pathModel,barAt:e.barAt,step:e.step};
 }
 if(e.symbol!==undefined&&!symbols.includes(e.symbol)||e.sourceTimestamp!==undefined&&e.sourceTimestamp!==at||e.priceBasis!==undefined&&e.priceBasis!=='observed-close-only')return null;
 return {date:e.date,cursor:e.cursor,sourceVersion:e.sourceVersion,sourceTimestamp:at,...(e.symbol?{symbol:e.symbol,priceBasis:'observed-close-only'}:{})};
}
export function historicalReportSource(state){
 const h=state?.historical;if(![1,2,3,4].includes(h?.version))return null;
 if(h.version===4)return {marketSource:'historical-mixed',marketData:{priceBasis:'m15-mid-reference-simulated-path',execution:'game-fees-applied-to-seeded-m15-path',timeBasis:'historical-source-UTC',sourceHash:HASH.test(h.sourceHash)?h.sourceHash:null,pathModel:M15_PATH_MODEL,stepsPerBar:24,stepMarketSeconds:37.5,minuteCandles:'simulated-linear-boundary-aggregation',composition:'historical-m15-simulated-path',pureHistoricalProfit:null,exhaustion:'continue-simulated-from-last-real-price',simulatedGapSamples:state.historyContinuation?.simulatedSamples??0}};
 const mixed=hasHistoricalSimulation(state);
 return {marketSource:mixed?'historical-mixed':'historical',marketData:{priceBasis:h.version===1?'bid-ask-mid':'observed-close-only',execution:h.version===1?'game-fees-applied-to-observed-mid':'game-fees-applied-to-observed-close',timeBasis:h.version===1?'historical-source-UTC':'source-label-plus-60-seconds',...(HASH.test(h.sourceHash)?{sourceHash:h.sourceHash}:{}),...(h.version!==1?{timestampMeaning:'unknown-open-or-close-label',quoteSide:'unverified-single-price-OHLC',availabilityModel:'label-plus-60-seconds'}:{}),exhaustion:'continue-simulated-from-last-real-price',composition:mixed?'mixed':'historical',...(mixed?{pureHistoricalProfit:null,simulatedSamples:state.historyContinuation.simulatedSamples,segments:state.historyContinuation.segments.map(row=>({id:row.id,source:row.source,from:row.from,to:row.to})),segmentsOmitted:state.historyContinuation.segmentsOmitted}:{})}};
}
export function historicalTimeDefinition(state){
 if(state.historical.version===4)return '时间采用来源 UTC 时间戳，界面显示 JST；剧情天数仅为游戏进度。历史15分钟开高低收来自已验证报价，段内按固定种子生成24步、每步37.5秒的模拟路径；1／5分钟线按该路径准确时间边界模拟合成。成交、止损和强平按模拟路径依次执行，并非真实逐笔行情或无前视偏差的专业回测。缺口和历史用尽后的模拟续盘另行标记。';
 const details=state.historical.version===1?'逐笔数据按已接收的买卖报价中间价和游戏费用结算，不代表可执行盘口。':'分钟 OHLC 标签的开收含义和报价侧未核实，按标签后 60 秒可用的保守模型读取已完成线，只以已观察收盘价和游戏费用结算；不补造逐笔路径或价差。';
 return `历史行情时间采用来源 UTC 时间戳，界面显示 JST；剧情天数仅为游戏进度。${details}历史数据缺口和结束后从最后真实价格进行模拟补接，模拟段单独标记；混合结果不代表纯真实历史收益。`;
}
