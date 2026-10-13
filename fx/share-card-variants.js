import {createShareCard} from './share-card.js?v=443669c15b264bcc9465b95315e1b8dd764b4d8f-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=443669c15b264bcc9465b95315e1b8dd764b4d8f-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
