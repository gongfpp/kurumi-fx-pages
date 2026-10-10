// Only exact user-approved dialogue revisions with pixel-reviewed four-panel
// artwork belong here. An absent entry never falls back to an unrelated sheet.
export const APPROVED_FOUR_SKIT_ASSETS=Object.freeze({
 'dinner-small':{
  path:'./generated/approved-four-skits-v1/dinner-small.webp',width:1086,height:1448,
  sha256:'9db2b9cb383202e32c880a7e347c278db5ee6f2f5e71af7b907eef50dfb80c28',
  people:2,characters:['久留美','萌智子'],panels:4,reviewed:true,independentComic:true,kind:'original-fan-art',
  dialogueId:'approved-four-skits-20261010:dinner-small',
  alt:'久留美拿手机向萌智子报喜，两人在咖喱店选餐、坐下吃两份咖喱；萌智子举勺时，久留美举起手机拍照。',
 },
 'mebuki-after-loan':{
  path:'./generated/approved-four-skits-v1/mebuki-after-loan.webp',width:1086,height:1448,
  sha256:'c2bf764421dc20b60334db8ef5b061b1158e2c3ea00d8694aacee05064177216',
  people:2,characters:['芽吹','康子'],panels:4,reviewed:true,independentComic:true,kind:'original-fan-art',
  dialogueId:'approved-four-skits-20261010:mebuki-after-loan',
  alt:'黑白四格：芽吹放下手机，兴奋地说起借钱和不用上班的打算；康子拆开面包，把一半递给芽吹。',
 },
 'shrine-walk':{
  path:'./generated/approved-four-skits-v1/shrine-walk.webp',width:1086,height:1448,
  sha256:'e8c4ed69ed1f27c286b8fa05a64fa57250e805469987ecc338e840ea7db9e0cb',
  people:1,characters:['久留美'],panels:4,reviewed:true,independentComic:true,kind:'original-fan-art',
  dialogueId:'approved-four-skits-20261010:shrine-walk',
  alt:'久留美独自在神社收起手机、合掌祈愿，下台阶时又摸出手机，最后把手机按回口袋。',
 },
 'holding-loss-companion':{
  path:'./generated/approved-four-skits-v1/holding-loss-companion.webp',width:1086,height:1448,
  sha256:'06c54da159c50f6194347eec8bcdabc34ad91e4bfcf69eed1fb8bbd97c5b09ee',
  people:2,characters:['久留美','萌智子'],panels:4,reviewed:true,independentComic:true,kind:'original-fan-art',
  dialogueId:'approved-four-skits-20261010:holding-loss-companion',
  alt:'久留美和萌智子一起盯着下跌的报价，久留美逐渐慌张，拉住萌智子的袖子请她先别走。',
 },
});

// Generated story art remains excluded from every trading-expression pool.
export const APPROVED_FOUR_SKIT_REVIEWS=Object.freeze(Object.fromEntries(Object.values(APPROVED_FOUR_SKIT_ASSETS).map(asset=>[asset.path,{
 primaryUse:'story-dialogue',character:asset.characters.join('与'),characters:[...asset.characters],
 emotion:'多阶段剧情',intensity:null,events:[],directions:[],hasEmbeddedText:false,textOriginal:null,
 faceClarity:'scene-scale',textClarity:'no-text',status:'verified',identityStatus:'verified',identityDescription:asset.characters.join('与'),
}])));
