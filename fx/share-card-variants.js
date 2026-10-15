import {createShareCard} from './share-card.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=0b963eb22fa5097125d08d271aff291f07e79853-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
