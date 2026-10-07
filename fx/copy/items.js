// 玩家可直接编辑名称与效果说明；cost 为游戏价格。
export const PROPS = {
 takeaway:{name:'点一份外卖',caption:'¥800 · 承受力 +10',copy:'心理承受力永久 +10，每天一次。',speaker:'久留美',cost:800},
 noodles:{name:'今天关灯吃泡面',caption:'¥150 · 今日生活费 −40%',copy:'今日生活费减 40%，只限今天。',speaker:'久留美',cost:150},
 energy:{name:'魔爪能量饮料',caption:'¥300 · 今日多一轮交易',copy:'今天多一轮交易，每天一罐。',speaker:'久留美',cost:300},
 celebration:{name:'预约温泉与按摩',caption:'¥8,000 · 承受力 +20',copy:'心理承受力永久 +20，每天一次。',speaker:'久留美',cost:8000},
 father:{name:'父亲的柜中存款',caption:'最高 ¥3,000,000 · 整章一次',copy:'自选取款金额，计入欠款，可随时归还。还清前增加心理压力。',speaker:'久留美'},
 mochiko:{name:'萌智子帮忙盯盘',caption:'¥500 · 本日爆仓损失减免 25%',copy:'今天强平净亏损减免 25%，最多亏至账户权益归零。普通止损、平仓不减免。',speaker:'萌智子',cost:500}
};
export const PROP_LINES={takeaway:'这顿我请自己。',noodles:'灯就不开了。',energy:'今晚再来一轮。',celebration:'今天花一点。',mochiko:'我帮你看着。'};
