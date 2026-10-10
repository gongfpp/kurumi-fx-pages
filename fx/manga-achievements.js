import {MANGA_PANELS} from './manga-panels.js?v=42c930e045346f5238de61e26817354270fdaf41-23f2a20b7717';
// Trophy references are labelled as inspiration, not screenshots of this save.
const mappings=Object.freeze({
 "profit-receipt":{"panel":{"id":"cafe-meal-anime","original":"./manga/achievement-anime/cafe-meal.jpg","imageSize":[450,220],"kind":"original-anime-frame","sourceURL":"https://www.bilibili.com/video/BV1eqH96AEtJ/","sourceTimeSeconds":387.254264,"sha256":"e1683e04f61c2cefd310efbc3801066ae85ffacd8d368d473d5252ab878bba90"},"note":"原动画久留美和萌智子在快餐店用餐，呼应把钱用在一顿饭上；外卖下单与先盈利条件属于本局，不称原作已完成该条件。"},
 "mochiko-warning":{"panel":{"id":"mochiko-chart-anime","original":"./manga/achievement-anime/mochiko-chart.jpg","imageSize":[765,592],"kind":"original-anime-frame","sourceURL":"https://www.bilibili.com/video/BV1eqH96AEtJ/","sourceTimeSeconds":399.735747,"sha256":"a1f52bfb748a8e47fbef438d982e69d785b79705c085e51c702293f4caddaabf"},"note":"原动画萌智子举手机展示行情的动作呼应盯盘；原作该段讲解澳元价格，不表示原作具有游戏里的保护或强平减免功能。"},
 'fully-repaid':{panel:'million-thirty',note:'借原作久留美落袋后含泪发抖的释然呼应还清后的情绪，不声称原作已经还款；取用和归还金额只读本局账本。'},
 "liquidated":{"panel":{"record":65,"path":"./manga/contextual-lmno/65.jpg","sha256":"3290ee86e0d4988615ab770a8c2f5988f021d95f17bf4035f7577f3b01bae524","dimensions":[898,1417],"original":"./manga/contextual-lmno/65.jpg","imageSize":[898,1417],"kind":"original-manga"},"note":"原作久留美跪在电脑桌旁祈求神明的动作，呼应成就标题的祈祷；原格不表示已经强平。本局解锁只看真实强平成交。"},
 "hold-loss":{"panel":{"record":33,"sha256":"1dd449071db5a53b26b5bb5c98f514b29b2ccbbbeb92298be014f6967c3021ce","dimensions":[768,386],"path":"./manga/characters-v1/33.jpg","original":"./manga/characters-v1/33.jpg","imageSize":[768,386],"kind":"original-manga"},"note":"原作第2话31页，久留美短时间没看屏幕后发现价格下跌。呼应离开屏幕也不会停止亏损；画面原金额与本局账本分开。"},
 "hundred-times":{"panel":"leverage","note":"原作初次感受杠杆放大盈亏，胸前有心跳拟声。图内10枚是原作订单数量，不代表游戏100倍杠杆；仅作情绪呼应。"},
 "father-funds":{"panel":{"id":"father-envelope-anime","original":"./manga/achievement-anime/father-envelope.jpg","imageSize":[591,343],"kind":"original-anime-frame","sourceURL":"https://www.bilibili.com/video/BV1bypx6mEAN/","sourceTimeSeconds":94.5969,"sha256":"1cf8b5747cad3abf9e0081e15fdfd5dcdbb83a2623b6335f20984233950fda32"},"note":"动画原帧：父亲的手把信封藏在衣物抽屉里。仅呼应柜中存款对象，不将动作说成久留美取款，也不引入固定金额。"},
 "tell-everything":{"panel":{"record":197,"path":"./manga/contextual-gh/197.jpg","sha256":"801f2a8173c009dd8a91cc2db40ea201dee28193c5241b675893396d4bf9afa0","dimensions":[555,427],"original":"./manga/contextual-gh/197.jpg","imageSize":[555,427],"kind":"original-manga"},"note":"原作芽吹向萌智子发消息，坦白资金已耗尽、还借了学生现金贷；萌智子看手机。仅呼应向朋友披露欠款，不把芽吹冒认为久留美。"},
 "saved-at-last":{"panel":"million-thirty","note":"原作久留美盈利落定后流泪、发抖的情绪；本局的近强平经历及净收益另由实际交易记录验证。"},
 "walkaway":{"panel":{"record":105,"path":"./manga/contextual-lmno/105.jpg","sha256":"480236613d54aa9e92c713fb1a9f414903610f12297e2fbbb18483a6deff8125","dimensions":[848,605],"original":"./manga/contextual-lmno/105.jpg","imageSize":[848,605],"kind":"original-manga"},"note":"原作久留美说放弃FX的瞬间，芽吹在旁；后来重新入场，因此只呼应离场的决定，不宣称原作已经永久退休。"},
 'first-profit':{panel:'profit',note:'原作第 1 话第 45 页首单确认盈利。游戏解锁依据本局手续费后真实平仓结果；不采用图中 +24,000。'},
 'million-thirty':{panel:'million-thirty',note:'原作第 5 话第 23 页为一次确定收益 130 万。游戏条件是累计已实现净收益，二者不当成同一张账单。'},
 'accept-stop':{panel:'accept-stop',note:'原作第 4 话第 2 页是下决心止损。游戏把这个决心变成一次真实 stop 成交，不声称原图已经执行。'},
 'twenty-million':{panel:'recovery-vow',note:'游戏自拟成就名。原作第 1 话第 11 页是“想赚回两千万”的目标，并非原作已经赚到钱；本局以累计已实现净利润兑现这个 IF。'}
});
export function achievementManga(id){const map=mappings[id],panel=map&&(typeof map.panel==='string'?MANGA_PANELS[map.panel]:map.panel);return panel?{panel,note:map.note}:null;}
