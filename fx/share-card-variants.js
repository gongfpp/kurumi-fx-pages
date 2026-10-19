import {createShareCard} from './share-card.js?v=591c20f8c91072a08d497d48fa9e2e68c7935364-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=591c20f8c91072a08d497d48fa9e2e68c7935364-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
