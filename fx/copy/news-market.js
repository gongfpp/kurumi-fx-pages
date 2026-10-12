// Exact newsMarket block from the reviewed Gemini response.
// Private generation evidence: docs/news-market-link-20261012/gemini/.
export const NEWS_MARKET_COPY = Object.freeze({
  "labels": {
    "recap": "盘面回顾",
    "background": "历史背景",
    "details": "详情",
    "unknownTime": "未核实发布时间"
  },
  "recap": "{pair}在{from}至{to}期间，从{start}运行至{last}（{change}%），区间{low}至{high}。",
  "crossPair": {
    "leadUp": {
      "title": "{pair}上方挂单偏薄",
      "copy": "买盘意愿相对集中，盘口卖单稀疏，盘面显现上行倾向。"
    },
    "leadDown": {
      "title": "{pair}下方买盘显弱",
      "copy": "卖盘压力显现，承接意愿有限，盘面呈现下行倾向。"
    },
    "updateUp": {
      "title": "{pair}最新买压占优",
      "copy": "最新数据显示主动买单占据多数，上方阻力位正接受买盘测试。"
    },
    "updateDown": {
      "title": "{pair}最新卖压显现",
      "copy": "最新挂单显示卖方抛压集中，下方承接意愿面临考验。"
    },
    "updateMuted": {
      "title": "{pair}买卖压力趋缓",
      "copy": "双方报价挂单相对平衡，单向推力减弱，市场正等待新的挂单进入。"
    },
    "shockUp": {
      "title": "{pair}卖方流动性骤降",
      "copy": "上方挂单突遭集中扫空，报价瞬间向上跳离原区间。"
    },
    "shockDown": {
      "title": "{pair}买方承接瞬间失衡",
      "copy": "大额抛盘短时集中释出，报价瞬间向下跳离原区间。"
    }
  }
});
