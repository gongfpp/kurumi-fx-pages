import {LIFE_RELAX_SCENES} from './life-relax-scenes.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
import {LIFE_FRIEND_SCENES} from './life-friend-scenes.js?v=2aaee9d9784e145682d6e458b5fcd9ab41d3ce7b-23f2a20b7717';
// Only independently reviewed full four-panel sheets are registered here.
// Receipt sources retain their original IDs/text; adding artwork never rewrites saves.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_SCENE_CATALOG=freeze([
  {
    "id": "life-work-cafe-01",
    "dialogueId": "life-work-art-20261012:life-work-cafe-01",
    "receiptDialogueSourceId": "life-action-20261012:work:cafe",
    "semanticReadKey": "life-scene:life-work-cafe-01",
    "category": "work",
    "optionId": "cafe",
    "order": 1,
    "approved": true,
    "title": "咖啡店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "滑溜的棕色围裙摊散，久留美皱眉接住滑开的折面。",
        "lines": [
          [
            "久留美",
            "这条围裙的面料太滑了，折三次滑开两次。"
          ]
        ]
      },
      {
        "action": "伏身按平同一围裙，将两边对齐折成双层长方形。",
        "lines": [
          [
            "久留美",
            "我就不信叠不齐它。"
          ]
        ]
      },
      {
        "action": "围裙卷已在摊开的手掌上保持形状，她松开另一手，惊喜确认。",
        "lines": [
          [
            "久留美",
            "先对折再卷起来……咦，这样居然完全不散架？"
          ]
        ]
      },
      {
        "action": "侧身把同一卷围裙放在已打开储物柜的中层，肩膀放松。",
        "lines": [
          [
            "久留美",
            "早知道一开始就卷着放进储物柜了。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-cafe-01",
      "path": "./generated/life-work-v1/cafe-apron-roll-v1.webp",
      "sha256": "959f8b5a27563ea627fd02a02edadbe0310ba3137cc5e3fac2069a96c7a0d76b",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-bookstore-01",
    "dialogueId": "life-work-art-20261012:life-work-bookstore-01",
    "receiptDialogueSourceId": "life-action-20261012:work:bookstore",
    "semanticReadKey": "life-scene:life-work-bookstore-01",
    "category": "work",
    "optionId": "bookstore",
    "order": 1,
    "approved": true,
    "title": "书店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "检查打开的空围裙口袋，找不到笔，表情疑惑。",
        "lines": [
          [
            "久留美",
            "口袋里的圆珠笔去哪了……刚才还在手里的。"
          ]
        ]
      },
      {
        "action": "转向刚归位的三本参考书，一手抵下巴，一手伸向书脊。",
        "lines": [
          [
            "久留美",
            "该不会顺手夹进哪本刚归位的参考书了吧？"
          ]
        ]
      },
      {
        "action": "第三本红词典拉出倾斜，蓝色圆珠笔明确夹在书页顶端，发现后取出。",
        "lines": [
          [
            "久留美",
            "顺着书脊摸过去……哈，果然插在第三本词典里。"
          ]
        ]
      },
      {
        "action": "三本词典放回齐列，把同一蓝色银夹圆珠笔放回围裙口袋，露出不好意思的笑。",
        "lines": [
          [
            "久留美",
            "差点给买书的客人附赠一支文具。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-bookstore-01",
      "path": "./generated/life-work-v1/bookstore-lost-pen-v1.webp",
      "sha256": "4d59092fed026f51873a8f9f0a2bda838b4e3b369e2f1424d8e6a05170cb723d",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          12,
          522,
          684
        ],
        [
          548,
          12,
          522,
          684
        ],
        [
          16,
          705,
          522,
          727
        ],
        [
          548,
          705,
          522,
          727
        ]
      ]
    }
  },
  {
    "id": "life-work-convenience-01",
    "dialogueId": "life-work-art-20261012:life-work-convenience-01",
    "receiptDialogueSourceId": "life-action-20261012:work:convenience",
    "semanticReadKey": "life-scene:life-work-convenience-01",
    "category": "work",
    "optionId": "convenience",
    "order": 1,
    "approved": true,
    "title": "便利店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "五瓶乌龙茶已推齐，仍有背标与侧标混向，她皱眉发现问题。",
        "lines": [
          [
            "久留美",
            "刚把整排乌龙茶推平，才发现标签全冲着不同方向。"
          ]
        ]
      },
      {
        "action": "她握住最右茶瓶的瓶身转正，前四瓶已经面向顾客。",
        "lines": [
          [
            "久留美",
            "……算了，反正也是最后收尾，顺手拧正吧。"
          ]
        ]
      },
      {
        "action": "她撤手俯身检查五个齐列的正面叶标，露出满意的笑。",
        "lines": [
          [
            "久留美",
            "正面全冲前排，这样看着确实痛快多了。"
          ]
        ]
      },
      {
        "action": "她站直抱臂得意，旁边同一排五瓶仍然正面齐列。",
        "lines": [
          [
            "久留美",
            "下一班要是夸货架整齐，可全是我的功劳。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-convenience-01",
      "path": "./generated/life-work-v1/convenience-labels-v1.webp",
      "sha256": "c5af77e743349d0e6d2fd3a9bf802e4c2f153dd602e6d14029f9c347d65b00fe",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          17,
          13,
          519,
          689
        ],
        [
          550,
          13,
          519,
          689
        ],
        [
          17,
          712,
          519,
          720
        ],
        [
          550,
          712,
          519,
          720
        ]
      ]
    }
  },
  ...LIFE_RELAX_SCENES,
  ...LIFE_FRIEND_SCENES
]);
