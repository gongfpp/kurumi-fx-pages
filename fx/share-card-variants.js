import {createShareCard} from './share-card.js?v=d646c2f56c57fd7702f80200246852039ee3cd77-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=d646c2f56c57fd7702f80200246852039ee3cd77-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
