import {ITEM_SCENES,STORY_DEFINITIONS,SCENE_LINES} from './copy/scenes.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
// Simulated market information is separate from user-approved character dialogue.
import {approvedQuote,dialogueFacts} from './dialogue.js?v=78e90797c3d0aa74b03810c3e1bd3c2a9b6852ac-23f2a20b7717';
// USD/JPY is quoted in JPY per USD: positive = stronger USD / weaker JPY.
// Bias is a simulated tendency; seeded noise and reversals can outweigh it.
// Quote convention: https://www.boj.or.jp/about/education/oshiete/intl/g18.htm
// Historical market incidents inspire scenarios only; headlines, timing and moves are fictional.

export const EXTRA_NEWS_CHAINS = [
  {id:"extra_us_inflation",name:"美国通胀意外降温",bias:-1,vol:2,source:"跨洋数据台",
    lead:"美国通胀低于预估，USD/JPY 承压",leadCopy:"通胀低于预期，美国利率预期回落，USD/JPY 偏下行。",
    confirmed:["美国物价降温范围扩大，日元获支撑","租金与服务价格也在放缓，USD/JPY 偏下行。"],
    reversed:["美国物价细项仍有黏性，美元或获支撑","总体降温主要靠能源，服务价格仍坚挺，USD/JPY 偏上行。"],
    muted:["美国物价信号分化，方向分歧仍在","物价分项好坏参半，买卖双方等待新数据。"]},
  {id:"extra_japan_wages",name:"春季工资谈判",bias:-1,vol:2,source:"东京经济观察",
    lead:"日本工资谈判结果偏强，日元获支撑",leadCopy:"加薪结果偏强，日本政策预期转热，USD/JPY 偏下行。",
    confirmed:["日本加薪范围扩大，日元支撑增强","加薪范围比初步样本更广，USD/JPY 偏下行。"],
    reversed:["加薪传闻缺完整数据支持，日元支撑减弱","已公布样本偏向大企业，市场下调预期，USD/JPY 偏上行。"],
    muted:["日本工资调查仍在汇总，结论未明","企业间差异较大，调查仍在汇总。"]},
  {id:"extra_japan_consumption",name:"日本消费恢复",bias:-1,vol:1,source:"街区经济简报",
    lead:"日本零售消费改善，日元或获支撑",leadCopy:"家庭支出初步改善，USD/JPY 偏下行。",
    confirmed:["日本消费改善延续，日元支撑增强","日常消费接续回暖，USD/JPY 偏下行。"],
    reversed:["消费改善多因短期促销，日元支撑减弱","剔除促销后，消费恢复有限，USD/JPY 偏上行。"],
    muted:["日本消费调查好坏参半，方向未明","部分品类回暖，其他品类仍弱，方向未明。"]},
  {id:"extra_yen_short_cover",name:"日元空头回补",bias:-1,vol:3,source:"汇市持仓观察",
    lead:"日元空头开始回补，USD/JPY 面临卖压",leadCopy:"基金买回此前卖出的日元，USD/JPY 偏下行。",
    confirmed:["日元空头回补扩大，USD/JPY 下行压力增强","日元回补买盘接连入场，USD/JPY 偏下行。"],
    reversed:["日元空头回补减弱，USD/JPY 或获支撑","回补买盘未获接力，短线资金离场，USD/JPY 偏上行。"],
    muted:["日元回补与新卖盘交错，方向信号减弱","回补与新卖盘交错，汇价来回波动。"]},
  {id:"extra_safe_haven",name:"跨市场避险买盘",bias:-1,vol:3,source:"全球风险简报",
    lead:"海外股市转弱，日元避险买盘增加",leadCopy:"风险仓位收缩，日元回补增加，USD/JPY 偏下行。",
    confirmed:["跨市场减仓继续，日元需求增强","多个时段持续减仓，USD/JPY 偏下行。"],
    reversed:["海外股市收复跌幅，日元避险买盘退潮","股市收复跌幅，避险买盘退潮，USD/JPY 偏上行。"],
    muted:["避险交易出现分歧，日元买卖交错","股债走势分歧，日元买卖交错。"]},
  {id:"extra_repatriation",name:"海外资金回流",bias:-1,vol:1,source:"企业资金台",
    lead:"日本企业海外收益回流，日元买盘增多",leadCopy:"企业把外币收益换回日元，USD/JPY 偏下行。",
    confirmed:["日本企业回流持续，USD/JPY 承压","企业分批结汇，USD/JPY 偏下行。"],
    reversed:["日本企业资金回流结束，日元支撑减弱","主要结汇已完成，美元需求占优，USD/JPY 偏上行。"],
    muted:["日本企业资金收付相抵，方向信号减弱","收益回流与进口付款相抵，方向未明。"]},
  {id:"extra_japan_bond_yield",name:"日本长债收益率抬升",bias:-1,vol:2,source:"东京债市快讯",
    lead:"日本长债收益率抬升，日元或获支撑",leadCopy:"日本收益率上升，利差预期收窄，USD/JPY 偏下行。",
    confirmed:["日本债市收益率继续抬升，日元支撑增强","日本多期限收益率抬升，USD/JPY 偏下行。"],
    reversed:["日本长债买盘回归，日元支撑或减弱","债券买盘压低收益率，USD/JPY 偏上行。"],
    muted:["日本债市逐渐稳定，汇市等待政策说明","债市渐稳，汇市等待政策说明。"]},
  {id:"extra_us_growth_slow",name:"美国增长放缓",bias:-1,vol:2,source:"纽约经济观察",
    lead:"美国企业订单减弱，USD/JPY 承压",leadCopy:"订单疲软压低美国利率预期，USD/JPY 偏下行。",
    confirmed:["美国订单走弱范围扩大，日元或获支撑","更多调查确认订单走弱，USD/JPY 偏下行。"],
    reversed:["美国订单下降被修正，美元或获支撑","更新样本显示经济好于初值，USD/JPY 偏上行。"],
    muted:["美国增长数据互有强弱，方向未明","订单与家庭支出信号相反，方向未明。"]},
  {id:"extra_carry_unwind",name:"利差交易减仓",bias:-1,vol:3,source:"跨境资金观察",
    lead:"日元融资交易减仓，日元回补需求增加",leadCopy:"日元融资头寸减仓，需要买回日元，USD/JPY 偏下行。",
    confirmed:["更多日元融资头寸退出，USD/JPY 承压","更多融资头寸退出，USD/JPY 偏下行。"],
    reversed:["日元融资减仓暂告段落，日元支撑减弱","减仓暂歇，追随回补的短线资金离场，USD/JPY 偏上行。"],
    muted:["日元融资头寸双向调整，方向信号减弱","减仓与新建仓同时发生，汇价双向波动。"]},
  {id:"extra_us_retail",name:"美国零售走强",bias:1,vol:2,source:"纽约数据简报",
    lead:"美国零售初值强劲，USD/JPY 获支撑",leadCopy:"强劲消费支持较高利率预期，USD/JPY 偏上行。",
    confirmed:["美国零售增长范围扩大，美元支撑增强","零售增长覆盖多个品类，USD/JPY 偏上行。"],
    reversed:["美国零售增长被下修，USD/JPY 承压","修订数据弱于初值，USD/JPY 偏下行。"],
    muted:["美国零售与消费调查分化，方向未明","零售与消费调查分化，增长能否持续仍有疑问。"]},
  {id:"extra_import_energy",name:"进口能源付款",bias:1,vol:1,source:"贸易资金观察",
    lead:"日本进口商美元付款增加，日元承压",leadCopy:"能源付款带来美元需求，USD/JPY 偏上行。",
    confirmed:["日本能源付款需求延续，美元或获支撑","进口商分批买入美元，USD/JPY 偏上行。"],
    reversed:["日本进口付款高峰过去，日元或获支撑","付款高峰已过，结汇买盘占优，USD/JPY 偏下行。"],
    muted:["日本进出口换汇相抵，方向信号减弱","进出口换汇大致相抵，盘中振幅缩小。"]},
  {id:"extra_japan_output",name:"日本工业调查转弱",bias:1,vol:2,source:"产业经济台",
    lead:"日本制造业订单减少，日元承压",leadCopy:"订单减少压低日本增长预期，USD/JPY 偏上行。",
    confirmed:["日本制造业疲弱扩散，日元卖压增加","企业继续削减订单与投资，USD/JPY 偏上行。"],
    reversed:["日本订单减少多因短暂停工，日元或获支撑","主要产线恢复，停工担忧缓和，USD/JPY 偏下行。"],
    muted:["日本工业数据分化，方向信号减弱","部分行业复苏，其他行业仍有库存压力。"]},
  {id:"extra_us_treasury",name:"美国债券拍卖",bias:1,vol:2,source:"纽约债市观察",
    lead:"美国债券拍卖需求偏弱，美元或获利差支持",leadCopy:"拍卖需求偏弱，美债收益率走高，USD/JPY 偏上行。",
    confirmed:["美债收益率继续抬升，USD/JPY 获支撑","债券买盘未归，美元利差优势扩大，USD/JPY 偏上行。"],
    reversed:["后续美债买盘增强，USD/JPY 或承压","后续买盘压低美债收益率，USD/JPY 偏下行。"],
    muted:["美债收益率趋稳，日元买卖暂时均衡","市场消化拍卖结果，买卖暂时均衡。"]},
  {id:"extra_risk_rebound",name:"风险偏好回升",bias:1,vol:2,source:"全球市场观察",
    lead:"海外股市回暖，日元避险需求减少",leadCopy:"股市回暖，日元避险需求回落，USD/JPY 偏上行。",
    confirmed:["股市反弹范围扩大，日元融资需求增加","避险仓位进一步削减，USD/JPY 偏上行。"],
    reversed:["股市反弹未能持续，日元再获避险买盘","股市尾盘转跌，日元避险买盘回流，USD/JPY 偏下行。"],
    muted:["风险资产涨跌交错，日元买卖分歧仍在","风险资产涨跌交错，反弹能否持续仍有分歧。"]},
  {id:"extra_rate_patience",name:"日本政策耐心论",bias:1,vol:2,source:"政策记者会",
    lead:"日本政策强调继续观察，日元承压",leadCopy:"日本近期加息预期降温，USD/JPY 偏上行。",
    confirmed:["日本政策继续审慎，日元支撑减弱","政策继续关注增长风险，USD/JPY 偏上行。"],
    reversed:["日本政策保留较早调整空间，日元或获支撑","声明保留较早调整空间，USD/JPY 偏下行。"],
    muted:["日本政策未给出时间表，方向信号减弱","政策没有时间表，汇价在日内区间往返。"]},
  {id:"extra_outbound_funds",name:"海外资产配置",bias:1,vol:1,source:"长期资金简报",
    lead:"日本机构增加海外配置，日元承压",leadCopy:"机构卖出日元增配海外资产，USD/JPY 偏上行。",
    confirmed:["日本海外配置分批执行，日元卖压持续","分批换汇持续，USD/JPY 偏上行。"],
    reversed:["日本机构增加汇率对冲，日元或获支撑","机构买回日元对冲，USD/JPY 偏下行。"],
    muted:["日本海外配置与对冲相抵，方向信号减弱","海外配置与对冲相抵，方向成交减少。"]},
  {id:"extra_us_wages",name:"美国薪资压力",bias:1,vol:3,source:"劳动力数据台",
    lead:"美国薪资增长超预估，USD/JPY 获支撑",leadCopy:"薪资压力推高美国利率预期，USD/JPY 偏上行。",
    confirmed:["美国薪资压力扩散，美元支撑增强","工资增长扩散，美元买盘增加，USD/JPY 偏上行。"],
    reversed:["美国薪资跳升受样本影响，美元支撑减弱","可比样本薪资增幅较低，USD/JPY 偏下行。"],
    muted:["美国薪资与就业信号不同，方向未明","薪资与就业信号不同，市场等待完整数据。"]},
  {id:"extra_quiet_session",name:"清淡时段美元买盘",bias:1,vol:2,source:"夜间成交观察",
    lead:"清淡时段美元买盘集中，USD/JPY 上行压力增加",leadCopy:"清淡时段美元买盘集中，USD/JPY 偏上行。",
    confirmed:["后续美元需求接上，日元卖压持续","活跃时段仍有美元买盘接力，USD/JPY 偏上行。"],
    reversed:["报价恢复后追涨需求退潮，USD/JPY 或回落","报价恢复后追涨买盘退潮，USD/JPY 偏下行。"],
    muted:["美元买卖渐趋平衡，方向信号减弱","买卖恢复平衡，短线波动回归平常。"]}
];

export const BLACK_SWANS = [
  {id:"peg_break",name:"汇率安排突变",title:"突发｜海外央行意外撤销汇率安排",
    copy:"海外央行撤销原有汇率安排，资金涌入日元，USD/JPY 突然向下跳离原区间。",delta:-0.032,speaker:"久留美"},
  {id:"bank_failure",name:"大型机构融资中断",title:"突发｜海外金融机构暂停正常融资",
    copy:"机构紧急减仓，美元融资需求激增，USD/JPY 向上跳升。市场流动性骤降。",delta:0.04,speaker:"安子"},
  {id:"pandemic_emergency",name:"公共卫生紧急措施",title:"突发｜多国公布公共卫生紧急措施",
    copy:"休市期间公布的紧急措施继续发酵，资金买入日元，USD/JPY 盘中向下跳空。",delta:-0.027,speaker:"萌智子"},
  {id:"gilt_spiral",name:"债市连锁平仓",title:"突发｜海外债市出现连锁卖盘",
    copy:"连锁卖盘从债市扩散，资金抢购美元补足融资，USD/JPY 向上跳升。",delta:0.023,speaker:"安子"},
  {id:"liquidity_freeze",name:"汇市流动性冲击",title:"突发｜短期融资紧张，USD/JPY 出现跳价",
    copy:"交易对手缩减报价，日元买盘推动 USD/JPY 向下跨过数档。",delta:-0.018,speaker:"久留美"},
  {id:"policy_surprise",name:"政策意外转向",title:"突发｜日本政策会议给出意外宽松措施",
    copy:"日本意外宽松，日元遭集中抛售，USD/JPY 向上跳升。交易员仍在读声明细节。",delta:0.035,speaker:"久留美"},
  {id:"referendum_night",name:"计票结果逆转",title:"突发｜海外公投结果逆转市场预期",
    copy:"计票结果出乎预期，风险头寸收缩，资金买回日元。USD/JPY 向下跨过数个价位。",delta:-0.024,speaker:"芽吹"},
  {id:"commodity_dislocation",name:"交割合约异价",title:"突发｜临近交割的商品合约出现异常报价",
    copy:"临近交割的商品合约报价失序，减仓推高美元需求，USD/JPY 向上跳升。",delta:0.015,speaker:"久留美"}
];

export const STORIES=STORY_DEFINITIONS;
export function getStory(s,key){
  const base=STORIES[key];if(!base)return null;
  const f=dialogueFacts(s),family=s.family||{};
  if(key==='fatherUnlock'&&(s.fatherUsed||f.equity>=30000))return null;
  if(key==='fatherFound'&&(!s.fatherUsed||!family.outstanding||family.informed||family.discovered))return null;
  if(key==='repayPartial'&&(!family.lastRepayment||!(family.outstanding>0)))return null;
  if(key==='repayFull'&&(!family.lastRepayment||family.outstanding!==0||family.lastRepayment.outstanding!==0))return null;
  if(key==='recovery'&&!s.story?.flags?.receiptWinDay)return null;
  const state=['fatherFound','fatherUnlock'].includes(key)?{...s,storyContext:key}:s;
  const lines=ids=>ids.map(id=>approvedQuote(id,state)).filter(Boolean).map(q=>[q.from,q.text]);
  const event={...base,key,lines:[],choices:base.choices.map(c=>({...c,lines:[]}))};
  if(ITEM_SCENES[key]){const scene=ITEM_SCENES[key];event.original=true;event.lines=scene.lines.map(line=>[...line]);for(const c of event.choices)c.lines=(scene.choices[c.id]||[]).map(line=>[...line]);}
  if(key==='fatherUnlock'){
    event.lines=lines(['V2-E03-01']);
    event.choices.find(c=>c.id==='look_at_savings').lines=lines(['V2-E03-02']);

  }
  if(key==='fatherDiscover'){event.original=true;event.lines=SCENE_LINES.fatherDiscover.map(line=>[...line]);}
  if(key==='quietNight'){event.original=true;event.lines=SCENE_LINES.quietNight.map(line=>[...line]);}
  if(key==='fatherFound')event.lines=lines(['V2-E04-01','V2-E04-03']);
  if(key==='repayPartial')event.lines=lines(['V2-E05-05','V2-E05-01','V2-E05-03']);
  if(key==='repayFull')event.lines=lines(['V2-E06-01']);
  return event;
}
