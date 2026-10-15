import {createShareCard} from './share-card.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
