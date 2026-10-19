import {createShareCard} from './share-card.js?v=cd9f9f7e3a56c2f7b69205678364be26447bb249-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=cd9f9f7e3a56c2f7b69205678364be26447bb249-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
