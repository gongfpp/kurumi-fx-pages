import {QUOTE_PACKAGES,quotePackageState,quotePackageOffer,quotePackageName} from './quote-packages.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';
import {hasCanonicalGrid} from './quote-grid.js?v=91c199507858a651e9282627ac1f5e50e6fc76ba-23f2a20b7717';
const yen=value=>`¥${value.toLocaleString('zh-CN',{maximumFractionDigits:0})}`;
export function quotePackagePresentation(state,{availableCash=state.cash,canPurchase=true}={}){
 const p=quotePackageState(state),legacy=!hasCanonicalGrid(state.script),effectiveHz=legacy?1:p.selectedHz;
 const expired=p.rentalDay!==null&&p.rentalDay<state.day&&p.preferredHz>p.ownedHz;
 return {selectedHz:p.selectedHz,effectiveHz,legacy,expired,buttonLabel:quotePackageName(effectiveHz),paid:p.paid,
  renewalNote:p.legacyOwnedHz>1?'原已购档位继续可用。更高档位按日补差价，次日点续租才扣款。':'按交易日租用，当天升级补差价。次日保留上次选择，点续租才扣款；未续租时用免费档。',
  note:legacy?'本日沿用旧存档行情，下一交易日可租用。':expired?`上次选择：${quotePackageName(p.preferredHz)}。今天要继续用吗？`:`第 ${state.day} 日 · 用到今日收盘`,
  cards:QUOTE_PACKAGES.map(option=>{const offer=quotePackageOffer(state,option.hz,{availableCash,canPurchase:canPurchase&&!legacy}),selected=p.selectedHz===option.hz;
   return {...option,...offer,selected,disabled:selected||!offer.valid,actionLabel:selected?'使用中':offer.owned?'切换使用':`${expired&&p.preferredHz===option.hz?'今天续租':p.ownedHz>1?'今日升级':'今天租用'} · ${yen(offer.price)}`,costLabel:option.hz>1&&option.hz<=p.legacyOwnedHz?'原已购 · 持续可用':option.dailyPrice?`${yen(option.dailyPrice)} / 日`:'免费'};
  }),receipts:p.receipts.map(r=>({day:r.day,hz:r.hz,amount:r.amount,label:`第 ${r.day} 日 · ${quotePackageName(r.hz)} · ${yen(r.amount)}${r.kind==='daily-rental'?'':' · 原已购权益'}`}))};
}
export function quotePackageMarkup(state,options){
 const v=quotePackagePresentation(state,options);
 return `<p class="quote-package-note">${v.note}</p><div class="quote-package-grid">${v.cards.map(card=>`<section class="quote-package-card${card.selected?' selected':''}"><header><strong>${card.label}</strong></header><p>${card.description}</p><b class="quote-package-cost">${card.costLabel}</b><button type="button" class="secondary" data-quote-hz="${card.hz}" ${card.disabled?'disabled':''}>${card.actionLabel}</button>${card.reason?`<small>${card.reason}</small>`:''}</section>`).join('')}</div><p class="quote-package-disclosure">${v.renewalNote}</p>${v.receipts.length?`<details class="quote-package-receipts"><summary>租用记录 · 累计 ${yen(v.paid)}</summary><ul>${v.receipts.map(r=>`<li>${r.label}</li>`).join('')}</ul></details>`:''}`;
}
