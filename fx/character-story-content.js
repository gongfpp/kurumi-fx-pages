// Fixed manga chronology. This module never reads prices or changes a game.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const CHARACTER_STORY_ASSETS=freeze({"89": {"record": 89, "path": "./manga/characters-v1/89.jpg", "sha256": "1ed11cca29b5f7ddcafc0817673b128958aaee097c33b6c8bcd7870e449fbf12", "dimensions": [786, 433]}, "95": {"record": 95, "path": "./manga/characters-v1/95.jpg", "sha256": "809bc596574817852c991deb94d8a244e77a1bff732fe0a27e6086438b4fa8ca", "dimensions": [786, 228]}, "175": {"record": 175, "path": "./manga/characters-v1/175.jpg", "sha256": "c4b09262c97b2a479dc06551b7fd6e48259175a19f532bf9764d96631549a92f", "dimensions": [568, 339]}, "178": {"record": 178, "path": "./manga/characters-v1/178.jpg", "sha256": "9039b3afdbcbd60e4dbcbae117e65d11dd592bb7e0693a5165a59bd803576153", "dimensions": [543, 450]}, "186": {"record": 186, "path": "./manga/characters-v1/186.jpg", "sha256": "40c63a4d72d5bb88e6a6e9cce6914cc3477b6bc969c1c11f25b066b03e4f897e", "dimensions": [661, 611]}, "185": {"record": 185, "path": "./manga/characters-v1/185.jpg", "sha256": "af18905df2c173a06742621099e61fc4edec2f849a84a8d4ac6306f54adf886e", "dimensions": [996, 288]}, "207": {"record": 207, "path": "./manga/characters-v1/207.jpg", "sha256": "091eda2055ad3db561dd173a80b0efffd9e1c62718b417a0741e9158bb64dd9a", "dimensions": [555, 358]}, "206": {"record": 206, "path": "./manga/characters-v1/206.jpg", "sha256": "52112bac2c953e50b175a36b9c6c19119f432d030c76dd44252951f44645f173", "dimensions": [904, 443]}, "45": {"record": 45, "path": "./manga/characters-v1/45.jpg", "sha256": "f519d3a918dadf9a1442de3d9b97f057a69f7a77f4568fe8ada49b1c0c1055c9", "dimensions": [452, 870]}, "172": {"record": 172, "path": "./manga/characters-v1/172.jpg", "sha256": "0689ce751c795eb7cd56b82c0792d24e24c5e4f5a856007c91fab590e7a62da2", "dimensions": [613, 414]}, "37": {"record": 37, "path": "./manga/context-stop-loss-uneasy.jpg", "sha256": "0bd856aacdaeaf4906f2dee8e80513562e56cd9ea530408fac556b9bba1e2958", "dimensions": [827, 446]}, "28": {"record": 28, "path": "./manga/context-long-profit.jpg", "sha256": "1c1b4ffc94318e6c41a9a1bc792ae02827c43387e0d1e57c554793d95f648699", "dimensions": [789, 739]}, "64": {"record": 64, "path": "./manga/context-despair.jpg", "sha256": "47d7bbda56abdf0f1cf6a683ecd584829ef7791cd0a451620af10c1afad3b983", "dimensions": [689, 622]}, "243": {"record": 243, "path": "./manga/context-calm.jpg", "sha256": "d7eea5118d9accd2ca1c796e434533dd486330a6f9d9644f8291ae0a22d9b53e", "dimensions": [348, 417]}, "35": {"record": 35, "path": "./manga/characters-v1/35.jpg", "sha256": "9236b6766367b430c54f67cd72ff70eb03baded10b4be465e9a00e0b393ec6c3", "dimensions": [665, 427]}, "60": {"record": 60, "path": "./manga/characters-v1/60.jpg", "sha256": "b9ee61f313e7b38ab5290564c8ed9c0440de92264771cbe23f7451bedcf27d81", "dimensions": [883, 757]}, "75": {"record": 75, "path": "./manga/characters-v1/75.jpg", "sha256": "af4e2d4382f4129f8241d77d94c5f1232e4116927cb06c38cdf317080c5b5bb9", "dimensions": [829, 294]}, "152": {"record": 152, "path": "./manga/characters-v1/152.jpg", "sha256": "b303270224ac96c2aec90d1f9878e33f2823d3a519fa6145d8cab787f4178a55", "dimensions": [809, 426]}, "202": {"record": 202, "path": "./manga/characters-v1/202.jpg", "sha256": "b0e6f6aa5c6202319fbc3258fdc2e56baa37cae04f106d303709f1d0c462a159", "dimensions": [942, 514]}, "204": {"record": 204, "path": "./manga/characters-v1/204.jpg", "sha256": "dea88db2d1a58bac2e473c15dc795b88919ee673f5d33cf225a162b13d8e1e42", "dimensions": [904, 410]}});
export const CHARACTER_STORY_NODES=freeze([
 {id:'aud-yen-delight',chapter:2,title:'涨起来了',people:'久留美',pages:[22],positionOwner:'久留美 · AUD/JPY持仓损益评估',
  before:'澳元兑日元涨起来了。久留美看着屏幕，兴奋得叫出声。',
  panels:[{record:28,alt:'久留美兴奋地喊着涨了；AUD/JPY账户余额811,600日元，损益评估为正139,500日元'}],
  after:'账户里的浮盈，让她笑得合不拢嘴。'},
 {id:'first-negative-estimate',chapter:3,title:'笑不出来了',people:'久留美',pages:[1],positionOwner:'久留美（持仓损益评估；方向未确认）',
  before:'屏幕上的损益评估是负数。久留美睁大眼睛，额头冒汗。',
  panels:[{record:35,alt:'久留美惊惧地看着负105,000日元的损益评估'}],
  after:'她的表情僵住了。'},
 {id:'considering-stop',chapter:3,title:'及时止损会比较好吧',people:'久留美',pages:[3],positionOwner:'久留美（考虑止损；交易方向未确认）',
  before:'久留美坐在屏幕前，额头冒着汗。',
  panels:[{record:37,alt:'久留美不安地看着屏幕，犹豫是否及时止损'}],
  after:'及时止损，会比较好吧……？'},
 {id:'unrealized-fear',chapter:3,title:'不想看见的数字',people:'久留美',pages:[20],positionOwner:'久留美（持仓损益评估；方向未确认）',
  before:'久留美看着账户里的负损益评估，慌了。',
  panels:[{record:45,alt:'久留美惊恐地喊着不要；账户余额与负损益评估分别列出'}],
  after:'她一遍遍喊着：不要。'},
 {id:'blank-mind',chapter:4,title:'什么都没考虑',people:'久留美',pages:[18],positionOwner:null,
  before:'画面里的久留美仿佛漂在宇宙里，双眼发直。',
  panels:[{record:60,alt:'久留美置身宇宙般的幻想画面，文字写着什么都没有考虑'}],
  after:'脑子里一片空白。'},
 {id:'overwhelmed',chapter:4,title:'已经不可能了',people:'久留美',pages:[25],positionOwner:null,
  before:'久留美双手抱住头，眼里含着泪。',
  panels:[{record:64,alt:'久留美流着汗和泪，双手抱头，喊着已经不可能了'}],
  after:'她已经承受不住了。'},
 {id:'aud-yen-realized',chapter:5,title:'这回真的赚到了',people:'久留美',pages:[26],positionOwner:'久留美 · AUD/JPY获利确定',
  before:'树荫下，久留美和另一人待在一起。这一回，画面列出了澳元兑日元的获利确定记录。',
  panels:[{record:75,alt:'树荫下的长椅旁有两个人；AUD/JPY记录写着获利确定正1,311,510日元'}],
  after:'属于久留美的这笔交易，利润落定了。'},
 {id:'entrusted',chapter:7,title:'萌智子的托付',people:'久留美、萌智子与芽吹',pages:[10,11,12,15],positionOwner:null,
  before:'萌智子请久留美教芽吹做FX。久留美有些犹豫，觉得自己还教不了别人。',
  panels:[{record:89,alt:'久留美回想读过的FX书籍，讲述自己的知识观'}],
  after:'萌智子又劝了劝。久留美答应，先教自己会的。'},
 {id:'first-lesson',chapter:7,title:'她想直接知道涨跌',people:'久留美与芽吹',pages:[16,20,24,25,26,27],positionOwner:'芽吹（入金；未在本段确认真实订单）',
  before:'芽吹不想工作，把助学贷款拿来入金。她更想知道的，是接下来到底会涨还是会跌。',
  panels:[{record:95,alt:'久留美向芽吹强调，投资决定的后果需要自己承担'}],
  after:'久留美先说清：最后要由芽吹自己决定，也要承担后果。芽吹答应后，两人才开始看英镑兑日元。'},
 {id:'mebuki-negative-estimate',chapter:12,title:'偏偏往上走',people:'芽吹',pages:[25],positionOwner:'芽吹（浮动盈亏；订单方向未在本格展示）',
  before:'美元行情与芽吹的预料相反，反而涨了差不多一日元。她低下头，盯着桌前。',
  panels:[{record:152,alt:'芽吹坐在桌前低着头；浮动盈亏为负92,200日元'}],
  after:'账面上的亏损，让她笑不出来。'},
 {id:'balance-delight',chapter:13,title:'这次赚了好多',people:'久留美',pages:[22],positionOwner:'久留美（阶段账户余额；交易方向未确认）',
  before:'久留美举起双手，比出两个V。起始资金涨了超过七成，她高兴得直笑。',
  panels:[{record:172,alt:'久留美笑着比出双V，账户框标出余额及73.5%的增长'}],
  after:'“这次赚了好多啊！”'},
 {id:'tuition',chapter:13,title:'追加进去的学费',people:'芽吹与萌智子',pages:[29,30,31,32],positionOwner:'芽吹',
  before:'后来，芽吹向萌智子诉苦：之前赚的钱亏光了，追加的次年学费也快保不住。',
  panels:[{record:175,alt:'芽吹背对镜头向萌智子诉说次年学费的困境'},
   {record:178,alt:'萌智子用行情可能一夜反转的话安抚芽吹',before:'萌智子却说，追加学费没有错，家里和学校总能想办法。她说美日迟早会跌，只是不知道要等多久。'}],
  after:'芽吹接受了她的说法，继续听她讲。'},
 {id:'held-short',chapter:15,title:'你早就持有空单了？',people:'康子与芽吹',pages:[2,3,4,5],positionOwner:'芽吹 · USD/JPY空头',
  before:'久留美发来美日做多的消息，芽吹却依然看跌。她告诉正在画画的康子，自己手里早有美日空单。',
  panels:[{record:186,alt:'芽吹站在康子的椅子后，明确说自己手上已有美日空单'},
   {record:185,alt:'康子惊讶地发现芽吹原来已经持有空头仓位'}],
  after:'康子这才发现，芽吹可能从上涨前就一直扛着空单。她劝芽吹止损，芽吹不肯。'},
 {id:'manga-fund-plan',chapter:17,title:'把钱用来画漫画',people:'康子与萌智子',pages:[13],positionOwner:'康子（FX账户余额；创作资金计划）',
  before:'康子举起手机，打算把FX账户里的余额投入漫画。',
  panels:[{record:202,alt:'康子举着手机，展示71,052日元的FX账户余额，说要全部投进漫画'},
   {record:204,alt:'萌智子问康子是否打算不碰FX，康子回答没错',before:'萌智子问：打算不碰FX了？康子说，没错。'}],
  after:'萌智子觉得，真能做到这个决定，确实厉害。她又提起了眼下的大行情。'},
 {id:'help-a-friend',chapter:17,title:'朋友能不能帮一把',people:'康子、萌智子与久留美',pages:[16,17,18,19],positionOwner:'芽吹（朋友讨论其处境，结果未确认）',
  before:'三人在街边谈起芽吹。康子担心，芽吹那笔空单可能已经出事。久留美也放心不下。',
  panels:[{record:206,alt:'康子站在街边向萌智子和久留美说起芽吹，担心她可能已经被强平'},
   {record:207,alt:'萌智子在街边以自负盈亏为由，表示她们帮不了芽吹'}],
  after:'康子不认同：朋友遇到困难，还是该帮忙。久留美也仍担心芽吹。'},
 {id:'caution-after-rise',chapter:19,title:'差不多该小心了',people:'久留美',pages:[21],positionOwner:null,
  before:'久留美托着下巴，盯着屏幕，想着眼下的涨势。',
  panels:[{record:243,alt:'久留美在屏幕前思考，说自己差不多要小心了'}],
  after:'她提醒自己：差不多要小心了。'}
]);
// Evidence of an event, not mere discovery, item availability, age of a run, or debt.
export function characterStoriesAvailable(state={}){
 return state.story?.seen?.includes('friendStudy')===true || state.story?.log?.some(row=>row?.id==='friendStudy')===true || state.itemsUsed?.mochiko===true || state.consumptionLedger?.some(row=>row?.kind==='item'&&/^item:[1-9]\d*:mochiko$/.test(row.id||''))===true;
}
export function createCharacterStorySession({getState,getContext,canOpen=()=>true,onPage=()=>{},onClose=()=>{}}){
 let context=null,index=0,active=false;
 const valid=()=>context===getContext()&&characterStoriesAvailable(getState());
 const paint=()=>onPage({index,node:CHARACTER_STORY_NODES[index],total:CHARACTER_STORY_NODES.length});
 function close(){if(!active)return false;active=false;onClose();return true;}
 return {
  open(){if(active||!canOpen()||!characterStoriesAvailable(getState()))return false;const next=getContext();if(next!==context){context=next;index=0;}active=true;paint();return true;},
  move(delta){if(!active)return false;if(!valid()){close();return false;}const next=Math.max(0,Math.min(CHARACTER_STORY_NODES.length-1,index+Math.sign(delta)));if(next===index)return false;index=next;paint();return true;},
  close,
  refresh(){if(active&&!valid())close();if(context!==getContext()){context=null;index=0;}return characterStoriesAvailable(getState());},
  get active(){return active;},get index(){return index;}
 };
}
