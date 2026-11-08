import {orderLossView} from './order-loss-view.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';

// Presentation only. The engine remains the sole owner of stop prices, losses,
// fees and debit amounts, including its existing emotion restrictions.
export function orderRiskPresentation({long,short,stopPips,draft,formatMoney}){
 const hasDraft=!!(draft?.upper||draft?.lower);
 const crossed=hasDraft&&!!(draft?.upper?.crossed||draft?.lower?.crossed);
 const longDrawn=long?.stopKind==='chart-price'&&!long?.ignoredDrawnStop;
 const shortDrawn=short?.stopKind==='chart-price'&&!short?.ignoredDrawnStop;
 const mode=crossed?'划线已失效':longDrawn&&shortDrawn?'按划线':longDrawn?'做多按划线':shortDrawn?'做空按划线':'';
 const loss=orderLossView(stopPips,long,short,formatMoney);
 return {...loss,...(hasDraft?{label:'预计止损亏损'}:{}),mode,
  stopValue:mode||(stopPips===null?'不预设':`${stopPips} 点`),
  presetActive:!crossed&&!(longDrawn&&shortDrawn)};
}

export function renderOrderRiskPresentation({document,...options}){
 const view=orderRiskPresentation(options);
 const write=(id,value)=>{const node=document.getElementById(id);if(node&&node.textContent!==value)node.textContent=value;return node;};
 write('risk-label',view.label);write('risk-amount',view.amount);
 const note=write('risk-note',view.note);if(note)note.hidden=!view.note;
 const mode=write('stop-chart-mode',view.mode);if(mode)mode.hidden=!view.mode;
 write('stop-value',view.stopValue);
 // Quote refreshes, as well as full renders, clear stale preset highlighting.
 for(const button of document.querySelectorAll('[data-stop-pips]'))button.setAttribute('aria-pressed',String(view.presetActive&&button.dataset.stopPips===(options.stopPips===null?'none':String(options.stopPips))));
 return view;
}
