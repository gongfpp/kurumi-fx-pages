import {LIVING_CHOICE_COPY} from './living-choices.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';
// 玩家可直接编辑名称与效果说明；cost 为游戏价格。
export const PROPS = {
 // Game-original convenience item; the source scenes do not identify an exact drink.
 dailyDrink:{name:'盯盘饮料',caption:'¥300 · 体力 +10',copy:'体力恢复10，本交易日50×、100×免连点。每天一瓶。',speaker:'久留美',cost:300},
 takeaway:{name:'点一份外卖',caption:'¥1,200 · 体力 +30',copy:'体力恢复30，情绪向平静靠近一档，替代今日一餐预算300。每天一份。',speaker:'久留美',cost:1200},
 noodles:{name:'今天关灯吃泡面',caption:LIVING_CHOICE_COPY.shared.noodlesCaption,copy:LIVING_CHOICE_COPY.shared.noodlesDescription,speaker:'久留美',cost:150},
 energy:{name:'魔爪能量饮料',caption:'¥300 · 体力 +30',copy:'体力恢复30，情绪向亢奋靠近一档。每天一罐。',speaker:'久留美',cost:300},
 chocolate:{name:'巧克力',caption:'¥200 · 体力 +5',copy:'体力恢复5，低落时情绪向平静靠近一档。每天一份。',speaker:'久留美',cost:200},
 eyeMask:{name:'睡眠眼罩',caption:'¥500 · 下次睡眠 +15',copy:'下次睡眠多恢复15体力，用后消耗。每天可用一次，待睡眠时无需再买。',speaker:'久留美',cost:500},
 tradingNotes:{name:'交易笔记',caption:'免费 · 每日压力 -3',copy:'写下今天的交易，压力减少3。每天一次。',speaker:'久留美',cost:0},
 father:{name:'父亲的柜中存款',caption:'最高 ¥3,000,000 · 整章一次',copy:'自选取款金额，计入欠款，可随时归还。还清前增加心理压力。',speaker:'久留美'},
};
export const PROP_LINES={takeaway:'这顿我请自己。',noodles:'灯就不开了。',energy:'先歇一口气。',chocolate:'掰一小块。',eyeMask:'今晚早点闭眼。',tradingNotes:'今天先记到这里。'};
