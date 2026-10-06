// Keep the sign, currency and every digit in one visual token. Placeholder or
// explanatory text stays wrappable; no abbreviated financial values are used.
export function amountToken(value) {
  const text=String(value??'').trim();
  return /^[+−-]?¥\d[\d,]*(?:\.\d+)?$/.test(text)?{text,characters:Array.from(text).length}:null;
}
const selectors=['#equity','#floating','#day-pnl','#free-cash','#used-margin','#reserve-amount','#available-margin','#fees-paid','#external-funding','#day-total','#bankrupt-money','#prop-amount','#amount-selected','#amount-slider-max','#risk-amount','[data-order-field]','.account-row>b','.primary-estimate>b','#preview-fee','#preview-quantity','.ranking-metrics b','.recap-profit','.recap-counter','.recap-stats dd'].join(',');
export function observeNumericLayout(root=document) {
  const update=()=>{
    for(const element of root.querySelectorAll(selectors)){
      const token=amountToken(element.textContent);
      if(token){element.dataset.atomicAmount='';element.style.setProperty('--amount-characters',String(token.characters));}
      else{delete element.dataset.atomicAmount;element.style.removeProperty('--amount-characters');}
    }
  };
  const observer=new MutationObserver(update);observer.observe(root.body,{subtree:true,childList:true,characterData:true});update();
  return ()=>observer.disconnect();
}
