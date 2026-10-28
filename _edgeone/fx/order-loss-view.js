// Presentation only. The account threshold and price come from orderPreview's
// shared liquidation estimator; never substitute the ticket's margin as loss.
export function liquidationLossAmount(preview){
  const estimate=preview?.liquidation;
  return preview?.valid&&Number.isFinite(preview.liquidationPrice)&&preview.liquidationPrice>0
    &&estimate&&!estimate.reason&&Number.isFinite(estimate.lossThreshold)&&estimate.lossThreshold>=0
    ?estimate.lossThreshold:null;
}

export function orderLossView(stopPips,longPreview,shortPreview,formatMoney){
  const money=value=>Number.isFinite(value)?formatMoney(value):'—';
  if(longPreview?.priceBracketVersion===1||shortPreview?.priceBracketVersion===1){
    const quote=value=>Number.isFinite(value)?value.toFixed(3):'不预设';
    const bracket=(label,preview)=>`${label}：止损 ${quote(preview?.stopPrice)} / 止盈 ${quote(preview?.takeProfitPrice)}`;
    const ignored=longPreview?.ignoredDrawnStop||shortPreview?.ignoredDrawnStop;
    return {label:'本单止损 / 止盈',amount:`做多 ${money(longPreview?.valid?longPreview.stopLossAmount:null)} / 做空 ${money(shortPreview?.valid?shortPreview.stopLossAmount:null)}`,note:[bracket('多单',longPreview),bracket('空单',shortPreview),ignored?'当前情绪不能设止损，画线止损不随本单提交。':''].filter(Boolean).join('；')};
  }
  if(stopPips!==null)return {
    label:'预计止损亏损',
    amount:money(longPreview?.valid?longPreview.stopLossAmount:null),
    note:''
  };
  return {
    label:'预计强平亏损',
    amount:`做多 ${money(liquidationLossAmount(longPreview))} / 做空 ${money(liquidationLossAmount(shortPreview))}`,
    note:'账户浮亏估算，不含平仓费或减免；实际按触发报价结算。'
  };
}
