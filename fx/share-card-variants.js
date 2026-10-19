import {createShareCard} from './share-card.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
