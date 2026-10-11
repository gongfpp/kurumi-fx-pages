import {orderAmountRatio} from './amount-controls.js?v=d55c17553b9e51d3617f435b9cad3227d3cd6fcc-23f2a20b7717';

// Paint only. Selection flows through the app's existing quoted order draft.
// Keep a selected ratio under fee/psychological caps, and disclose the actual
// ratio when the allowed amount differs. Fixed amounts are never changed here.
export function renderPercentageOrderControl({document,amount,availableMargin,cap,enabled,intent,format=String}){
 const slider=document.getElementById('percent-slider');if(!slider)return;
 const actual=orderAmountRatio(amount,availableMargin),selected=intent?.mode==='ratio'?intent.ratio:actual;
 const percent=Number.isFinite(selected)?Math.max(0,Math.min(100,selected*100)):0;
 const actualPercent=actual===null?'—':`${Number((actual*100).toFixed(2))}%`;
 const selectedPercent=`${Number(percent.toFixed(2))}%`;
 const clipped=intent?.mode==='ratio'&&actual!==null&&actual<intent.ratio-1e-6;
 const value=Number.isFinite(amount)?format(amount):'—';
 slider.value=String(percent);slider.disabled=!enabled||!Number.isFinite(availableMargin)||availableMargin<=0||!Number.isFinite(cap)||cap<100;
 slider.style?.setProperty('--percent-progress',`${percent}%`);
 slider.setAttribute?.('aria-valuetext',clipped?`${selectedPercent}，实际投入 ${actualPercent}，${value}`:`${actualPercent}，${value}`);
 const funds=document.getElementById('percent-available-margin');if(funds)funds.textContent=Number.isFinite(availableMargin)?format(availableMargin):'—';
 const output=document.getElementById('percent-selected');if(output)output.textContent=clipped?`${selectedPercent} · 实投 ${actualPercent} · ${value}`:`${actualPercent} · ${value}`;
}
