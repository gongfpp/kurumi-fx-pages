import {MOODS} from './content.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';
import {pressureMood} from './emotion-pressure.js?v=e05776abaf267608486a0e2fc93b7207885abc5f-23f2a20b7717';
const order=['numb','pressure-despair','despair','trauma-pain','trauma-frozen','anxious','nervous','regretful','stunned','exhausted','guilty','lonely','embarrassed','irritated','calm','focused','determined','warm','hopeful','smug','relieved','ecstatic','recovering'];
export const EMOTION_OVERVIEW=Object.freeze([...new Set([...order,...Object.keys(MOODS)])].map(id=>Object.freeze({id,label:id==='pressure-despair'?'极度绝望':id==='trauma-pain'?'痛苦':MOODS[id]?.[0]||id})));
export function currentEmotionChip(state,emotion){const trauma=tradingTrauma(state);if(trauma.active)return trauma.mood;return pressureMood(state)==='despair'?'pressure-despair':emotion;}
export function createEmotionOverview(root=document){
 const card=root.getElementById('character-card'),heading=card.querySelector('.character-heading'),row=root.createElement('div');
 row.className='emotion-overview';row.setAttribute('role','list');row.setAttribute('aria-label','全部情绪状态');heading.firstElementChild.textContent='当前';
 root.getElementById('emotion-label').classList.add('emotion-current-accessible');
 const chips=new Map(EMOTION_OVERVIEW.map(({id,label})=>{const span=root.createElement('span');span.className='emotion-chip';span.dataset.emotion=id;span.setAttribute('role','listitem');span.textContent=label;row.append(span);return[id,span];}));heading.append(row);
 const sanity=card.querySelector('.sanity-label'),meter=card.querySelector('.sanity-meter');heading.after(sanity,meter);
 const voice=card.querySelector('.voice-caption-row'),dock=root.createElement('div');dock.className='character-voice-controls';
 for(const id of ['voice-toggle','voice-replay','voice-library-open']){const control=root.getElementById(id);if(control)dock.append(control);}
 voice.append(dock);card.append(voice);
 return {render(state,emotion){const current=currentEmotionChip(state,emotion);for(const [id,chip] of chips){chip.classList.toggle('is-current',id===current);if(id===current)chip.setAttribute('aria-current','true');else chip.removeAttribute('aria-current');}}};
}
