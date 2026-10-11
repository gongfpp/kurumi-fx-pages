// Gemini 3.8-authored UI copy, 2026-10-10. Deterministic field extraction only.
// Source JSON SHA-256: beb8613ca1b01d8d54571fb24b71c26111899cf43b65b16b3727b71345f37efd
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIVING_CHOICE_COPY=freeze({
  "options": [
    {
      "id": "basic",
      "label": "宿舍",
      "buttonTemplate": "安排{label}（日常 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日）",
      "costBreakdownTemplate": "日常开销 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日",
      "recoveryDescription": "基础休息压力最多减少4、休息恢复最多增加8；宿舍无额外住房恢复加成。",
      "capDescription": "无额外住房加成。休息恢复累计上限为{restRecoveryCap}，压力最低降至0。原交易重创限制仍有效。",
      "currentStatusTemplate": "当前安排：{label}",
      "scheduledNextDayTemplate": "已预约：进入第{effectiveDay}日生效为{label}",
      "insufficientBalanceText": "当前可用资金与生活预留金不足以安排{label}（需全额预留{dailyTotal}）。"
    },
    {
      "id": "comfortable",
      "label": "独住小套间",
      "buttonTemplate": "安排{label}（日常 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日）",
      "costBreakdownTemplate": "日常开销 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日",
      "recoveryDescription": "在基础休息之上，额外压力最多减少{extraStressRelief}，额外休息恢复最多加{extraRestRecovery}。须当日全额付清生活支出并休息后结算。",
      "capDescription": "额外压力最多减少{extraStressRelief}，额外休息恢复最多加{extraRestRecovery}。休息恢复累计上限为{restRecoveryCap}，压力最低降至0。原交易重创限制仍有效。",
      "currentStatusTemplate": "当前安排：{label}",
      "scheduledNextDayTemplate": "已预约：进入第{effectiveDay}日生效为{label}",
      "insufficientBalanceText": "当前可用资金与生活预留金不足以安排{label}（需全额预留{dailyTotal}）。"
    },
    {
      "id": "generous",
      "label": "独住安静一居室",
      "buttonTemplate": "安排{label}（日常 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日）",
      "costBreakdownTemplate": "日常开销 {dailyBasics} ｜ 房租 {dailyRent} ｜ 合计 {dailyTotal}/日",
      "recoveryDescription": "在基础休息之上，额外压力最多减少{extraStressRelief}，额外休息恢复最多加{extraRestRecovery}。须当日全额付清生活支出并休息后结算。",
      "capDescription": "额外压力最多减少{extraStressRelief}，额外休息恢复最多加{extraRestRecovery}。休息恢复累计上限为{restRecoveryCap}，压力最低降至0。原交易重创限制仍有效。",
      "currentStatusTemplate": "当前安排：{label}",
      "scheduledNextDayTemplate": "已预约：进入第{effectiveDay}日生效为{label}",
      "insufficientBalanceText": "当前可用资金与生活预留金不足以安排{label}（需全额预留{dailyTotal}）。"
    }
  ],
  "shared": {
    "adjustTitle": "住处与生活安排",
    "terms": "点击选项不立即扣费，亦不产生恢复。今日未结算时选择将立即更新当前安排并搬入；今日已结算时安排将于进入次日生效。每日生活结算时统一扣除一次。全额付清当日生活支出并休息后结算额外住房恢复；未全额付清则无住房额外加成。",
    "pendingMoveTemplate": "已预约住处调整，将于进入第{effectiveDay}日生效为{label}。",
    "servicePaidTemplate": "已支付{label}生活支出：日常开销 {basicPaid}，房租 {rentPaid}。",
    "servicePartialTemplate": "本日生活支出未全额付清，未获得住房额外恢复加成。",
    "rentPaidTemplate": "房租支出：{rentPaid}",
    "basicsPaidTemplate": "日常开销支出：{basicPaid}",
    "receivedRecoveryTemplate": "住房额外恢复结算：压力实际减少 {actualStressRelief}，休息恢复实际增加 {actualRestRecovery}（休息恢复累计上限{restRecoveryCap}，压力下限0）。",
    "discountDescription": "泡面优惠与朋友请客仅针对共同日常开销（{dailyBasics}）生效，房租不享受减免。",
    "noodlesCaption": "¥150应急泡面餐（日常开销减40%，房租不减）",
    "noodlesDescription": "花费¥150食用泡面，仅限今日共同日常开销减少40%，房租部分照常结算。",
    "noodlesRecapDescription": "今日食用¥150泡面，日常开销减免40%，房租按原价计。",
    "livingOrdinaryReceiptLabel": "生活支出结算（标准）",
    "livingDiscountedReceiptLabel": "生活支出结算（日常减免）"
  },
  "compactDisplay": {
    "options": [
      {
        "id": "basic",
        "buttonTemplate": "{label} {dailyTotal}/日",
        "subtitleTemplate": "房租 {dailyRent} ｜ 无额外加成",
        "scheduledNextDayTemplate": "将于第{effectiveDay}日生效"
      },
      {
        "id": "comfortable",
        "buttonTemplate": "{label} {dailyTotal}/日",
        "subtitleTemplate": "房租 {dailyRent} ｜ 额外压力-{extraStressRelief}、休息恢复+{extraRestRecovery}",
        "scheduledNextDayTemplate": "将于第{effectiveDay}日生效"
      },
      {
        "id": "generous",
        "buttonTemplate": "{label} {dailyTotal}/日",
        "subtitleTemplate": "房租 {dailyRent} ｜ 额外压力-{extraStressRelief}、休息恢复+{extraRestRecovery}",
        "scheduledNextDayTemplate": "将于第{effectiveDay}日生效"
      }
    ],
    "shared": {
      "termsCompact": "生活费每日统一结算，全额付清并休息方可获得加成。上述效果均为最大值。",
      "detailTitle": "查看明细"
    }
  }
});
export const renderLivingCopy=(template,values)=>String(template||'').replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g,(match,key)=>Object.hasOwn(values,key)?String(values[key]):match);
