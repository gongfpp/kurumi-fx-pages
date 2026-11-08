import {createShareCard} from './share-card.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
