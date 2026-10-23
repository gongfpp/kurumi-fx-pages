import {createShareCard} from './share-card.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
