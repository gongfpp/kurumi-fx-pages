import {MANGA_PANELS} from './manga-panels.js?v=26fc4a9d3550c0bd8ae9423227a4b22ae5a8b775-23f2a20b7717';

// Four already-reviewed excerpts, in chapter-one order. The last page belongs
// to this game's run; none of the manga's trades or balances are imported.
export const OPENING_VERSION=1;
export const OPENING_PAGES=Object.freeze([
  Object.freeze({id:'family-loss',panelId:'family-loss',title:'童年的记忆',
    text:'妈妈在 FX 中亏掉了两千万日元。',next:'那时的愿望 →',
    alt:'年幼的久留美受到惊吓，画面周围传来要求归还两千万日元的喊声。',
    sourceNote:'第1话第8页。画面中的年幼久留美不是喊话者的可靠依据；母亲亏损2000万的背景由官方简介交叉核实。标题、摘要与翻页按钮为游戏编排。'}),
  Object.freeze({id:'recovery-vow',panelId:'recovery-vow',title:'那时的愿望',
    text:'她把挽回家庭的希望，放在了“赚回来”上。',next:'长大以后 →',
    alt:'年幼的久留美在书桌前立下愿望，希望赚回两千万日元，让父母不再离婚。',
    sourceNote:'第1话第11页。图中文字是在表达赚回2000万、阻止父母离婚的愿望，不是已经实现的收益或结局。摘要与翻页按钮为游戏编排。'}),
  Object.freeze({id:'ready',panelId:'ready',title:'2014年2月14日',
    text:'福贺久留美，20岁，大学二年级。',next:'我準備好了 →',
    alt:'成年的久留美面对屏幕，原图标注2014年2月14日、20岁、大学二年级，并写着“我準備好了”。',
    sourceNote:'第1话第36页。日期、年龄、年级均可从原图直接读到；按钮“我準備好了”沿用图中短句，其余界面为游戏编排。'}),
  Object.freeze({id:'rule',panelId:'rule',title:'第一笔交易之前',
    text:'决心已经有了。市场却没有必胜法。',next:'打开交易软件 →',
    alt:'久留美闭眼思考，原图说明FX不存在必胜法。',
    sourceNote:'第1话第38页。原图说明FX不存在必胜法；标题、摘要与按钮为游戏衔接文案，不是漫画对白。'}),
  Object.freeze({id:'first-trade',panelId:null,title:'你的这一局',
    text:'第一笔交易，还在等你。',next:'进入交易室 →',
    sourceNote:'本页为游戏原创衔接：本局开局资金默认10万日元，目标为净已实现交易利润2000万；不沿用原作30万账户或原作首单结果。进入交易室不会替玩家下单。'})
]);

export function openingPanel(page){return page?.panelId?MANGA_PANELS[page.panelId]:null;}
export function openingIndex(state){
  const saved=state?.openingProgress;
  if(saved?.version!==OPENING_VERSION)return 0;
  const index=OPENING_PAGES.findIndex(page=>page.id===saved.pageId);
  return index<0?0:index;
}
export function rememberOpeningPage(state,index){
  if(!Number.isInteger(index)||!OPENING_PAGES[index])return false;
  state.openingProgress={version:OPENING_VERSION,pageId:OPENING_PAGES[index].id,completed:false};
  return true;
}
export function completeOpening(state,{skipped=false}={}){
  state.openingSeen=true;
  state.openingProgress={version:OPENING_VERSION,pageId:OPENING_PAGES.at(-1).id,completed:true,skipped:!!skipped};
}

// Per-open session guards protect late clicks after a reload, a new run, mode
// switch or dismissal. Replays never write progress or touch the trading state.
export function createOpeningSession({getState,guard=()=>true,save=()=>Promise.resolve(true),onPage=()=>{},onFinish=()=>{}}){
  let owner=null,index=0,replay=false,active=false;
  const current=()=>active&&owner===getState()&&guard();
  const present=()=>{
    if(!replay)rememberOpeningPage(owner,index);
    const result={index,page:OPENING_PAGES[index],replay};
    onPage(result);
    return {...result,saved:replay?Promise.resolve(true):Promise.resolve(save())};
  };
  const finish=skipped=>{
    if(!current())return false;
    active=false;
    if(!replay){completeOpening(owner,{skipped});save();}
    onFinish({replay,skipped});return true;
  };
  return {
    open({replay:requestedReplay=false}={}){
      if(!guard())return null;
      if(active&&owner===getState())return null;
      owner=getState();replay=requestedReplay||!!owner.openingSeen;
      index=replay?0:openingIndex(owner);active=true;
      return present();
    },
    move(delta){
      if(!current()||![1,-1].includes(delta))return null;
      const next=index+delta;
      if(next<0)return null;
      if(next>=OPENING_PAGES.length){if(delta===1)finish(false);return null;}
      index=next;return present();
    },
    skip:()=>finish(true),
    dismiss(){active=false;},
    get index(){return index;},get replay(){return replay;},get active(){return active;}
  };
}
