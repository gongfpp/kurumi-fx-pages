import {createShareCard} from './share-card.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
