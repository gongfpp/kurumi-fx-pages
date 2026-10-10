import {RESEARCH_BUILD} from './research-config.js?v=6575cc7d8edebeb416dd2402d8cb30a676da677c-23f2a20b7717';
// GitHub project Pages share one origin. Kurumi writes only its own namespace.
// Legacy FX values are read-only recovery sources; A-share keys are never read.
export const STORAGE_PREFIX=RESEARCH_BUILD?'kurumi-fx:research-v1:':'kurumi-fx:';
const historicalKeys=['fx-girl-historical-story-v1','fx-girl-historical-endless-v1','fx-girl-market-source'];
const allowed=new Set(['fx-api-v1-comment-visitor','fx-api-v1-live-ranking-receipts','fx-daily-art-memory-v1',...historicalKeys,'fx-api-v1-telemetry-budget','fx-api-v1-chapter-01-telemetry-budget','fx-bgm-preferences-v1','fx-api-v1-chapter-01-storage-check','fx-api-v1-chapter-01-consent','fx-api-v1-telemetry-consent','fx-api-v1-chapter-01-anon-session','fx-api-v1-chapter-01-last-visit','fx-api-v1-chapter-01-telemetry-outbox','fx-api-v1-chapter-01-telemetry-seen','fx-moving-averages','fx-girl-campaign-v2','fx-girl-campaign-v3','fx-girl-endless-v1','fx-girl-mode','fx-girl-settings','fx-girl-voice','fx-girl-motion','fx-girl-analytics','fx-girl-developer-backup-v3','fx-endless-developer-backup-v1','fx-jiuliumei-achievements-v1','fx-leaderboard-submit-session','fx-anon-visitor','fx-anon-session','fx-last-visit','fx-telemetry-enabled','fx-telemetry-outbox','fx-telemetry-seen','fx-api-v1-leaderboard-submit-session','fx-api-v1-anon-visitor','fx-api-v1-anon-session','fx-api-v1-last-visit','fx-api-v1-telemetry-outbox','fx-api-v1-telemetry-seen']);
// Migration backups are exact recovery bytes for the two current save slots.
// They never fall back to another project's unscoped storage.
const migrationBackups=new Set(['fx-girl-campaign-v3:pre-v9','fx-girl-endless-v1:pre-v9']);
// Pending telemetry is deliberately not replayed from the old site's outbox.
const noLegacy=new Set(['fx-daily-art-memory-v1','fx-bgm-preferences-v1','fx-moving-averages','fx-telemetry-outbox','fx-telemetry-seen','fx-anon-visitor','fx-anon-session','fx-last-visit','fx-leaderboard-submit-session']);
const serviceOnly=key=>historicalKeys.includes(key)||migrationBackups.has(key)||key.startsWith('fx-api-v1-')||key.startsWith('fx-leaderboard-capability-')||noLegacy.has(key);
export function storageKey(key){if(!allowed.has(key)&&!migrationBackups.has(key)&&!/^fx-(?:api-v1-)?leaderboard-capability-[a-zA-Z0-9_-]{8,80}$/.test(key)&&!/^fx-api-v1-(?:developer-taint|developer-backup|finished-score)-[a-zA-Z0-9_-]{8,80}$/.test(key))throw new TypeError('Key is outside Kurumi storage');return STORAGE_PREFIX+key;}
export function storageEventMatches(eventKey,key){return eventKey===null||!!key&&(eventKey===key||eventKey===storageKey(key)||eventKey===storageKey(key)+':removed');}
export function namespacedStorage(raw){
 if(!raw)throw new Error('Browser storage is unavailable');
 return {
  getItem(key){const scoped=storageKey(key),value=raw.getItem(scoped);if(value!==null)return value;if(RESEARCH_BUILD||raw.getItem(scoped+':removed')==='1'||serviceOnly(key))return null;return raw.getItem(key);},
  setItem(key,value){const scoped=storageKey(key);raw.setItem(scoped,String(value));},
  // A tombstone keeps an intentional removal from reviving a legacy value.
  // Write the tombstone before removal so quota failures cannot erase a save.
  removeItem(key){const scoped=storageKey(key);raw.setItem(scoped+':removed','1');raw.removeItem(scoped);}
 };
}
export function kurumiStorage(name='localStorage'){return namespacedStorage(globalThis[name]);}
