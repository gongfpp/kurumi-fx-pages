import {createShareCard} from './share-card.js?v=553e629fa4c529b0c37c46225ae9c87b691d663f-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=553e629fa4c529b0c37c46225ae9c87b691d663f-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
