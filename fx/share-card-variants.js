import {createShareCard} from './share-card.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
