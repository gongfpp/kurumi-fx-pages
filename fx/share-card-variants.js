import {createShareCard} from './share-card.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=259a194a807fb0628e1848b45093f34c3cbec7c9-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
