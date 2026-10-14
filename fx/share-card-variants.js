import {createShareCard} from './share-card.js?v=04c4c7b885b82e51359b1c13d8a6e7224b69e3c2-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=04c4c7b885b82e51359b1c13d8a6e7224b69e3c2-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
