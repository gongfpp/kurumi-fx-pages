import {QUOTE_PACKAGES,quotePackageState,quotePackageOffer} from './quote-packages.js?v=26fc4a9d3550c0bd8ae9423227a4b22ae5a8b775-23f2a20b7717';
import {hasCanonicalGrid} from './quote-grid.js?v=26fc4a9d3550c0bd8ae9423227a4b22ae5a8b775-23f2a20b7717';
const yen=value=>`¥${value.toLocaleString('zh-CN',{maximumFractionDigits:0})}`;
export function quotePackagePresentation(state,{availableCash=state.cash,canPurchase=true}={}){
 const p=quotePackageState(state),legacy=!hasCanonicalGrid(state.script),effectiveHz=legacy?1:p.selectedHz;
 return {selectedHz:p.selectedHz,effectiveHz,legacy,buttonLabel:`${effectiveHz}Hz`,paid:p.paid,
  note:legacy&&p.selectedHz>1?'本日沿用原存档报价，已购高刷从下一交易日起生效。':'刷新频率独立于倍速，每根 K 线仍为 6 秒。',
  cards:QUOTE_PACKAGES.map(option=>{const offer=quotePackageOffer(state,option.hz,{availableCash,canPurchase}),selected=p.selectedHz===option.hz;
   return {...option,...offer,selected,disabled:selected||!offer.valid,actionLabel:selected?'使用中':offer.owned?`切换至 ${option.hz}Hz`:`${p.ownedHz>1?'升级':'购买'} ${option.hz}Hz · ${yen(offer.price)}`,costLabel:option.totalPrice?`本局总价 ${yen(option.totalPrice)} 游戏资金`:'免费'};
  }),receipts:p.receipts.map(r=>({day:r.day,hz:r.hz,amount:r.amount,label:`第 ${r.day} 日 · ${r.hz}Hz · ${yen(r.amount)} 游戏资金`}))};
}
export function quotePackageMarkup(state,options){
 const v=quotePackagePresentation(state,options);
 return `<p class="quote-package-note">${v.note}</p><div class="quote-package-grid">${v.cards.map(card=>`<section class="quote-package-card${card.selected?' selected':''}"><header><strong>${card.hz}Hz</strong><span>${card.label}</span></header><p>${card.costLabel}</p><button type="button" class="secondary" data-quote-hz="${card.hz}" ${card.disabled?'disabled':''}>${card.actionLabel}</button>${card.reason?`<small>${card.reason}</small>`:''}</section>`).join('')}</div><p class="quote-package-disclosure">使用本局游戏资金购买，一次扣款。已购档位可免费切换；升级只付差额。</p>${v.receipts.length?`<details class="quote-package-receipts"><summary>购买记录 · 已付 ${yen(v.paid)}</summary><ul>${v.receipts.map(r=>`<li>${r.label}</li>`).join('')}</ul></details>`:''}`;
}
