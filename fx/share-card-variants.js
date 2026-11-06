import {createShareCard} from './share-card.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
