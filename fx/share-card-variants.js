import {createShareCard} from './share-card.js?v=12bbce5584c8b4366889740b782b99852f64ce30-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=12bbce5584c8b4366889740b782b99852f64ce30-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
