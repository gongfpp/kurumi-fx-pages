import {MANGA_PANELS} from '../manga-panels.js?v=8959fa01c393e05a661e624b1d19ad4ce1f33273-23f2a20b7717';
import {storyUnrealized,storyReview} from './engine.js?v=8959fa01c393e05a661e624b1d19ad4ce1f33273-23f2a20b7717';
const scenes={
 opening:{page:40,kicker:'2014 · 成年后的第一笔交易',title:'三十万日元，和一个太大的目标。',body:'久留美为了赚回家中亏损而接触 FX。到了 20 岁，她终于准备入场。现在，账户里是 300,000 日元。你要替这一次交易做决定。',fact:'原作锚点：第 1 话第 11、36、40 页。背景与本金按原作节点整理。',panel:'ready'},
 plan:{page:40,kicker:'下单之前',title:'“不存在必胜法。”',body:'还没有仓位，也没有赚到一分钱。先决定：判断错了，要靠什么让自己离场？这一条计划会真的影响之后的成交。',fact:'原作锚点：第 1 话第 38 页。止损选项是游戏改编，不冒充原作操作。',panel:'rule'},
 entry:{page:41,kicker:'第一笔 · USD/JPY',title:'她认为，美元还有下跌的余地。',body:'原作的久留美准备做空美元。你可以跟随，也可以缩小仓位、反向判断或空仓旁观。每枚是 10,000 美元，每 0.01 日元波动都算进账户。',fact:'原作锚点：第 1 话第 41–42 页。此处只显示到第 41 页；下一格才会看到成交后的反应。',panel:null},
 first:{page:43,kicker:'价格动了',title:'屏幕上的变化，变成了自己的钱。',body:'美元兑日元下行。先看看方向和规模，再决定要不要兑现。眼前的浮动盈亏还没有锁定。',fact:'原作锚点：第 1 话第 42–43 页：卖出建空后，开始感受到杠杆。'},
 temptation:{page:44,kicker:'下一格 · 还没结束',title:'就到这里，还是再等一点？',body:'报价继续下行。已经平仓的钱不再波动；还在场内的仓位，接下来仍可能赚钱，也可能把浮盈还回去。',fact:'原作锚点：第 1 话第 43–44 页。中间报价为本游戏教学路径。'},
 rebound:{page:44,kicker:'反弹时刻',title:'报价开始反弹。',body:'这正是原作里让久留美决定撤退的时刻。你的仓位可能不同：先看自己的损益，再选择是否结束这笔交易。',fact:'原作锚点：第 1 话第 44 页。“撤退”是平掉空单，未必是已实现亏损。'},
 extension:{page:44,kicker:'IF · 原作之外的压力测试',title:'如果没有在那一刻走呢？',body:'这段是游戏设计的假设路径，不是漫画的后续行情。自动撤退线若被触发，会按规则成交；没有预设止损，就还得亲手决定。',fact:'没有新增原作事实；本场景仅复用截至第 44 页已出现且与账户语境相符的表情。'},
 review:{page:46,kicker:'第 1 话 · 你的交易复盘',title:'这一笔，到这里。',body:'原作中的久留美首单做空 10 枚，在反弹中平仓。现在，把她的选择与你自己的账单放在一起看。',fact:'原作第 45 页索引为 +24,000 日元；第 46 页账户为 324,200 日元。与 30 万本金存在 200 日元差异，现有索引没有解释，本作不补写。'}
};
export function mangaStoryScene(s){
 const base=scenes[s.stage],pnl=storyUnrealized(s);let id=base.panel;
 // Only use an approved, already revealed image whose account context fits.
 // The entry plan has no reviewed runtime image yet. Keep that scene textual.
 if(s.stage==='entry')id=null;
 if(!base.panel&&s.position?.direction===-1){
  id=s.stage==='rebound'?'retreat':pnl<0?'retreat':pnl>0?'leverage':'short-entry';
 }
 if(s.stage==='review'){
  const opening=s.ledger.find(x=>x.type==='open');
  id=s.realized>0&&opening?.direction===-1?'profit':s.realized===0?'rule':null;
 }
 const panel=id&&MANGA_PANELS[id];
 return {...base,panel:panel&&panel.page<=base.page?panel:null,review:storyReview(s)};
}
export const ADAPTATION_RULES='教学改编：USD/JPY 从 100.000 开始的报价序列为虚构，不是历史数据。1 枚 = 10,000 USD；固定 50× 仅用于保证金换算；本章手续费、点差、利息均为 0。自动止损在连续教学路径上按触发价执行，真实市场可能跳空滑点。原作页码为素材索引页码。没有借款、转账或真实交易。';
