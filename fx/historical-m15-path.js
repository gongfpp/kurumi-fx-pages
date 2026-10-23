import {M15_STEP_MS,validateM15Bar,validateM15Pair,validateM15Seed,m15BindingToken} from './historical-m15-source.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
export const M15_PATH_MODEL='fixed-24-linear-v1';

// Local PRNG only: never reads/advances the game's trading or story RNG.
function generator(identity){
 let state=parseInt(m15BindingToken(identity).slice(0,8),16);
 return ()=>{state+=0x6D2B79F5;let n=state;n=Math.imul(n^n>>>15,n|1);n^=n+Math.imul(n^n>>>7,n|61);return((n^n>>>14)>>>0)/4294967296;};
}
export function createM15Path(input,{seed,pair}={}){
 const bar=validateM15Bar(input);validateM15Seed(seed);validateM15Pair(pair);
 const random=generator([M15_PATH_MODEL,seed,pair,bar]);
 const first=1+Math.floor(random()*10),second=12+Math.floor(random()*11),highFirst=random()<.5;
 const anchors=[[0,bar.open],[first,highFirst?bar.high:bar.low],[second,highFirst?bar.low:bar.high],[24,bar.close]],prices=Array(25);
 for(let i=0;i<anchors.length-1;i++){
  const [start,left]=anchors[i],[end,right]=anchors[i+1],weights=Array.from({length:end-start},()=>.25+random()),total=weights.reduce((a,b)=>a+b,0);let weight=0;
  prices[start]=left;
  for(let step=start+1;step<end;step++){weight+=weights[step-start-1];const fraction=weight/total;prices[step]=Math.max(bar.low,Math.min(bar.high,left*(1-fraction)+right*fraction));}
  prices[end]=right;
 }
 return Object.freeze(prices.map((price,step)=>Object.freeze({at:bar.at+step*M15_STEP_MS,price,barAt:bar.at,step,kind:step===0?'open':step===24?'close':'update',simulated:true,pathModel:M15_PATH_MODEL,priceBasis:'game-reference-price'})));
}
