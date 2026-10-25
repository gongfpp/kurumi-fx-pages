const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function chartOrderOverlay(plot,draft,previewPrice=null){
 if(!plot)return '';
 const lines=[];
 for(const [key,label] of [['upper','上方待用线'],['lower','下方待用线']]){
  const line=draft?.[key];if(!line)continue;
  const actual=plot.yAtPrice(line.price),y=clamp(actual,plot.top,plot.bottom),edge=actual<plot.top?'↑ ':actual>plot.bottom?'↓ ':'';
  const text=`${edge}${label} ${line.price.toFixed(3)}${line.crossed?' · 已失效':''}`;
  lines.push(`<g class="chart-order-line${line.crossed?' is-crossed':''}" data-chart-order-side="${key}"><line x1="${plot.left}" x2="${plot.right}" y1="${y}" y2="${y}"/><text data-chart-order-label="${key}" x="${plot.left+4}" y="${clamp(y-5,plot.top+12,plot.bottom-4)}">${text}</text></g>`);
 }
 if(Number.isFinite(previewPrice)){const y=clamp(plot.yAtPrice(previewPrice),plot.top,plot.bottom);lines.push(`<g class="chart-order-preview"><line x1="${plot.left}" x2="${plot.right}" y1="${y}" y2="${y}"/><text x="${plot.left+4}" y="${clamp(y-5,plot.top+12,plot.bottom-4)}">${previewPrice.toFixed(3)}</text></g>`);}
 return `<g class="chart-order-overlay" aria-label="下单待用线">${lines.join('')}</g>`;
}
// SVG xMinYMin/meet can leave unused room. Map through the rendered SVG's own
// viewBox rather than the chart card, its header or an independently fitted axis.
export function chartOrderClientPlot(svg,plot){
 if(!svg||!plot)return null;const rect=svg.getBoundingClientRect(),scale=Math.min(rect.width/plot.viewWidth,rect.height/plot.viewHeight);
 if(!Number.isFinite(scale)||scale<=0)return null;
 return {left:rect.left+plot.left*scale,right:rect.left+plot.right*scale,top:rect.top+plot.top*scale,bottom:rect.top+plot.bottom*scale,candleWidth:plot.candleWidth*scale,priceAt:y=>plot.priceAt((y-rect.top)/scale)};
}
