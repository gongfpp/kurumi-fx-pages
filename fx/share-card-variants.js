import {createShareCard} from './share-card.js?v=3e46387a0af3c021f17bee9e9544bf62cd430c32-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=3e46387a0af3c021f17bee9e9544bf62cd430c32-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
