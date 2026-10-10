import {isResearch} from './historical-replay.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
import {advanceHistoricalBatch} from './historical-market.js?v=94d9f353e5b85a91b1fbe9811b5810dce412b461-23f2a20b7717';
const multiplier=speed=>[1,2,4].includes(speed)?speed:1;
// One observed minute every 400ms at 1x: 15 market minutes in six wall seconds.
// This is independent of chart period and daily display rental.
export function historicalStepMilliseconds(state,speed=1){return isResearch(state)?400/multiplier(speed):50;}
export function advanceHistoricalPlayback(state,step,{speed=1,...options}={}){
 return isResearch(state)?step(state):advanceHistoricalBatch(state,step,{...options,speed:multiplier(speed)});
}
