import {createShareCard} from './share-card.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
