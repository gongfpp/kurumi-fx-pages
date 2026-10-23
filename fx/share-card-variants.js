import {createShareCard} from './share-card.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
