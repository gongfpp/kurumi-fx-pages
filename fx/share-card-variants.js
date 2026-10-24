import {createShareCard} from './share-card.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
