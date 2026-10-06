// GitHub project Pages share one origin. Kurumi writes only its own namespace.
// Legacy FX values are read-only recovery sources; A-share keys are never read.
export const STORAGE_PREFIX='kurumi-fx:';
const allowed=new Set(['fx-girl-campaign-v2','fx-girl-campaign-v3','fx-girl-endless-v1','fx-girl-mode','fx-girl-settings','fx-girl-voice','fx-girl-motion','fx-girl-analytics','fx-girl-developer-backup-v3','fx-endless-developer-backup-v1','fx-jiuliumei-achievements-v1','fx-leaderboard-submit-session','fx-anon-visitor','fx-anon-session','fx-last-visit','fx-telemetry-enabled','fx-telemetry-outbox','fx-telemetry-seen']);
// Pending telemetry is deliberately not replayed from the old site's outbox.
const noLegacy=new Set(['fx-telemetry-outbox','fx-telemetry-seen','fx-anon-session','fx-leaderboard-submit-session']);
export function storageKey(key){if(!allowed.has(key)&&!/^fx-leaderboard-capability-[a-zA-Z0-9_-]{8,80}$/.test(key))throw new TypeError('Key is outside Kurumi storage');return STORAGE_PREFIX+key;}
export function storageEventMatches(eventKey,key){return eventKey===null||!!key&&(eventKey===key||eventKey===storageKey(key)||eventKey===storageKey(key)+':removed');}
export function namespacedStorage(raw){
 if(!raw)throw new Error('Browser storage is unavailable');
 return {
  getItem(key){const scoped=storageKey(key),value=raw.getItem(scoped);if(value!==null)return value;if(raw.getItem(scoped+':removed')==='1'||noLegacy.has(key))return null;return raw.getItem(key);},
  setItem(key,value){const scoped=storageKey(key);raw.setItem(scoped,String(value));},
  // A tombstone keeps an intentional removal from reviving a legacy value.
  // Write the tombstone before removal so quota failures cannot erase a save.
  removeItem(key){const scoped=storageKey(key);raw.setItem(scoped+':removed','1');raw.removeItem(scoped);}
 };
}
export function kurumiStorage(name='localStorage'){return namespacedStorage(globalThis[name]);}
