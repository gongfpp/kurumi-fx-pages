import {createShareCard} from './share-card.js?v=e0f3cc62baa3b2ee57b32a2c4d590e858d72a749-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=e0f3cc62baa3b2ee57b32a2c4d590e858d72a749-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
