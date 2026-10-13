import {createShareCard} from './share-card.js?v=56728f45e456b0600e343ee0e73e43491a254dbe-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=56728f45e456b0600e343ee0e73e43491a254dbe-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
