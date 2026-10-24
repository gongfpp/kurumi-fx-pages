import {createShareCard} from './share-card.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
