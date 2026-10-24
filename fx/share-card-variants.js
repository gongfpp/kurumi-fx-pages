import {createShareCard} from './share-card.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
