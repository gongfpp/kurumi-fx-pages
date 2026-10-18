import {createShareCard} from './share-card.js?v=312310b759c9c281ed2d9f234cc9c6ec9eec4de2-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=312310b759c9c281ed2d9f234cc9c6ec9eec4de2-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
