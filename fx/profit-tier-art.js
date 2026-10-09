// Read-only presentation. The caller supplies certified realized trading net,
// never balance, equity, borrowed cash, deposits or unrealized profit.
const rows = {
 small: {path:'./generated/settled-comics-v1/settled-gain.webp',alt:'久留美确认小额盈利，放下手机，轻轻松了一口气。'},
 thousand: {path:'./generated/comic-scenes-v1/closed-profit.webp',alt:'久留美完成平仓，微笑着握起一只拳头。'},
 'hundred-thousand': {path:'./generated/character-profit-v1/profit-hundred-thousand-v1.webp',alt:'久留美惊喜地掩住嘴，站起来举起双拳，又合掌确认收益。'},
 'twenty-million': {path:'./generated/character-profit-v1/profit-twenty-million-v1.webp',alt:'久留美震惊得停住动作，喜极而泣，举起双臂后按着心口笑了。'}
};
export const PROFIT_TIER_ART=Object.freeze(Object.fromEntries(Object.entries(rows).map(([tier,row])=>[tier,Object.freeze({...row,src:new URL(row.path,import.meta.url).href,tier,direction:'profit',people:1,panels:4,kind:'generated-game-art',reviewed:true})])));
export function realizedProfitTier(net){
 if(!Number.isFinite(net)||net<=0)return null;
 return net>=20000000?'twenty-million':net>=100000?'hundred-thousand':net>=1000?'thousand':'small';
}
export function selectRealizedProfitArtwork(net){const tier=realizedProfitTier(net);return tier?PROFIT_TIER_ART[tier]:null;}
// Daily recap integration: specifically consume the immutable snapshot's daily
// realized trading net. No fallback to an account amount is intentional.
export function selectDailyRecapProfitArtwork(snapshot){return selectRealizedProfitArtwork(snapshot?.daily?.tradingNet);}
