// Generic AFTER-close scenes. These do not depict an intraday market path.
// The single authoritative emotion selector supplies mood/traumaActive.
const positive=Object.freeze({path:'./generated/settled-comics-v1/settled-gain.webp',kind:'generated-game-art',layout:'whole-sheet',alt:'收盘后，久留美看过账单，放下手机，松了一口气'});
const severe=Object.freeze({path:'./generated/settled-comics-v1/settled-severe-loss.webp',kind:'generated-game-art',layout:'whole-sheet',alt:'收盘后，久留美从难过流泪到放下手机，疲惫地坐着'});
const SEVERE_MOODS=new Set(['despair','extreme-despair','numb','trauma-numb','devastated']);
export function settledComicArt({net,settled=false,mood,traumaActive=false}={}){
 if(!settled||!Number.isFinite(net))return null;
 if(net>0&&!traumaActive&&!SEVERE_MOODS.has(mood))return positive;
 if(net<0&&SEVERE_MOODS.has(mood))return severe;
 // A small loss/profit giveback must not produce a breakdown comic.
 return null;
}
