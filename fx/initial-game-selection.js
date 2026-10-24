// Only the first mode dialog's preselection. No save creation, migration or writes.
const SAVE_KEYS=['fx-girl-campaign-v3','fx-girl-campaign-v2','fx-girl-endless-v1',
 ...['story','endless'].flatMap(mode=>[`fx-girl-historical-${mode}-v1`,`fx-girl-live-${mode}-v1`,`fx-girl-shared-replay-${mode}-v1`])];
export function initialGameSelection({storage,firstVisit,mode='story',market='simulated'}={}){
 let unavailable=false;const read=key=>{try{
  // The production wrapper deliberately returns cached/null values from
  // getItem after a failed read. Only readItem carries durable availability.
  if(typeof storage?.readItem==='function'){const result=storage.readItem(key);if(result?.available!==true)unavailable=true;return result?.value??null;}
  if(!storage)unavailable=true;return storage?.getItem(key)??null;
 }catch{unavailable=true;return null;}};
 const preferredMode=read('fx-girl-mode'),preferredMarket=read('fx-girl-market-source');
 const hasSave=SAVE_KEYS.some(key=>!!read(key));
 const fresh=firstVisit&&!unavailable&&!preferredMode&&!preferredMarket&&!hasSave;
 return {mode:fresh?'story':mode,market:fresh?'historical':['simulated','historical','live'].includes(preferredMarket)?preferredMarket:market,firstUse:!!fresh};
}
