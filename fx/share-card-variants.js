import {createShareCard} from './share-card.js?v=5ffe4858d3c5ee4ea910ecf96c1477745bc1b782-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=5ffe4858d3c5ee4ea910ecf96c1477745bc1b782-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
