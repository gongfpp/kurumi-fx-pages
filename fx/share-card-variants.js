import {createShareCard} from './share-card.js?v=d2539e814da3f5cb5601b8be2c35addc36184a48-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=d2539e814da3f5cb5601b8be2c35addc36184a48-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
