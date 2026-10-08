import {EXTRA_NEWS_CHAINS} from './story-content.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';
// Simulated market information and functional UI copy, separate from approved character dialogue.
// Bias is the simulated USD/JPY quote tendency: +1 = USD stronger / JPY weaker.
// Economic news can be priced in or overwhelmed by other flows; it never guarantees a trade.
const BASE_NEWS_CHAINS = [
  {id:"boj",name:"日本央行会议",bias:-1,vol:2,source:"东京政策快讯",
    lead:"日本央行讨论追加加息，日元买盘增加",leadCopy:"日本加息预期升温，USD/JPY 偏下行。",
    confirmed:["日本央行上调政策利率，日元获支撑","工资与物价循环增强，USD/JPY 偏下行。"],
    reversed:["日本央行维持利率，会前日元买盘或退潮","央行仍需观察数据，会前买盘退潮，USD/JPY 偏上行。"],
    muted:["日本央行维持政策，后续信号未明","央行未给出下一步时间表，市场等待记者会。"]},
  {id:"cpi",name:"日本物价数据",bias:-1,vol:2,source:"东京经济数据",
    lead:"日本消费价格超预期，日元获加息预期支持",leadCopy:"日本利率预期上升，USD/JPY 偏下行。",
    confirmed:["日本服务价格继续上涨，日元支撑增强","价格压力扩散至服务业，USD/JPY 偏下行。"],
    reversed:["物价细项偏弱，日元买盘或退潮","剔除短期因素后，物价弱于初步解读，USD/JPY 偏上行。"],
    muted:["日本物价分项不一，方向信号减弱","商品与服务价格走势分化，方向未明。"]},
  {id:"intervention",name:"财务省汇市发言",bias:-1,vol:3,source:"东京汇市快讯",
    lead:"财务省关注日元贬值，干预预期升温",leadCopy:"市场押注买入日元干预，USD/JPY 偏下行。",
    confirmed:["财务省确认买入日元，USD/JPY 承压","财务省买入日元，USD/JPY 偏下行。"],
    reversed:["财务省未确认干预，日元支撑或减弱","官员未确认干预，日元买盘降温，USD/JPY 偏上行。"],
    muted:["财务省重申关注汇率，暂无新增政策","官员未透露新措施，汇市仍在等待。"]},
  {id:"payroll",name:"美国就业数据",bias:1,vol:3,source:"纽约经济数据",
    lead:"美国就业偏强，美元获利率预期支持",leadCopy:"强劲就业推高美国利率预期，USD/JPY 偏上行。",
    confirmed:["美国就业细项强劲，USD/JPY 获支撑","薪资与新增岗位同增，USD/JPY 偏上行。"],
    reversed:["美国就业修订值转弱，USD/JPY 承压","前期新增岗位下修，利率预期回落，USD/JPY 偏下行。"],
    muted:["美国就业分项不一，方向信号减弱","就业分项不一，市场等待更多数据。"]},
  {id:"fed",name:"美日利差",bias:1,vol:2,source:"纽约政策快讯",
    lead:"美国利率预期上升，USD/JPY 获支撑",leadCopy:"美债收益率抬升，利差预期扩大，USD/JPY 偏上行。",
    confirmed:["美国官员偏鹰，USD/JPY 上行压力增强","官员偏鹰的发言推高利差预期，USD/JPY 偏上行。"],
    reversed:["美国官员保留降息空间，USD/JPY 承压","完整讲话保留降息空间，USD/JPY 偏下行。"],
    muted:["美国政策路径未明，方向分歧仍在","利率路径仍有分歧，汇价方向未明。"]},
  {id:"export",name:"东京企业结汇",bias:-1,vol:1,source:"东京市场观察",
    lead:"日本出口企业结汇增加，日元获买盘支持",leadCopy:"出口商卖出美元、买入日元，USD/JPY 偏下行。",
    confirmed:["企业日元需求延续，USD/JPY 承压","企业结汇需求延续，USD/JPY 偏下行。"],
    reversed:["企业结汇告一段落，日元支撑或减弱","结汇买盘减弱，USD/JPY 偏上行。"],
    muted:["企业买卖趋于平衡，方向信号减弱","企业换汇需求大致平衡，方向未明。"]}
];

export const NEWS_CHAINS = [...BASE_NEWS_CHAINS,...EXTRA_NEWS_CHAINS];
export const MOODS = {
  'trauma-pain':['崩溃','shocked'],'trauma-frozen':['重创','blank'],numb:['麻木','blank'],recovering:['恢复中','blank'],
  hopeful:['期待','hopeful'],focused:['专注','focused'],irritated:['烦躁','irritated'],stunned:['震惊','stunned'],exhausted:['疲惫','exhausted'],guilty:['内疚','guilty'],embarrassed:['局促','embarrassed'],lonely:['落寞','lonely'],determined:['坚定','determined'],warm:['温暖','warm'],
  calm:['平静','calm'],smug:['得意','smug'],nervous:['紧张','nervous'],anxious:['焦虑','anxious'],
  ecstatic:['极度亢奋','exhilarated'],despair:['绝望','shocked'],regretful:['懊恼','regretful'],relieved:['如释重负','relieved']
};

export const CANON_QUOTE = {id:'V2-HOPE-01',text:'两千万而已，我会轻松赚回来的！',source:'用户附译；日语原句见动画官方简介',url:'https://fxkurumi-info.com/'};
export {PROPS} from './copy/items.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';
