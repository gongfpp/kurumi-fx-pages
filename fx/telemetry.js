import {kurumiStorage} from './storage-namespace.js?v=8959fa01c393e05a661e624b1d19ad4ce1f33273-23f2a20b7717';
import {serviceConfiguration} from './service-config.js?v=8959fa01c393e05a661e624b1d19ad4ce1f33273-23f2a20b7717';
import {FX_TELEMETRY_HOOKS} from './telemetry-hooks.js?v=8959fa01c393e05a661e624b1d19ad4ce1f33273-23f2a20b7717';
// Anonymous FX telemetry: fixed metadata only; never send chat, input, URLs or error text.
export const FX_EVENT_NAMES = Object.freeze(['visit','screen_view','screen_exit','transition','heartbeat','day_start','day_end','trade_attempt','trade_open','trade_close','trade_rejected','story_seen','story_choice','item_unlocked','item_used','debuff_applied','news_seen','black_swan','mood_change','dialogue_turn','voice_play','voice_rejected','market_end','settlement_confirm','rest_start','rest_end','ending_seen','message_receive','session_end','error']);
const names = new Set(FX_EVENT_NAMES), tokens = new Set(['from','to','reason','build','direction','risk','pnlBucket','capitalBucket','toleranceBucket','mood','previousMood','story','choice','item','debuff','news','kind','code','returnGap','device','orientation','newsId','storyId','choiceId','itemId','debuffId','equityBucket','riskBucket','sanityBucket','channel','dialogueId']);
const numbers = new Set(['leverage','sizePct','durationMs','drawdownPct','tolerance','stress','turn','count','day','beat','stake','stop','duration','threshold']);
const booleans = new Set(['success','returning','muted']);
const uid = () => crypto.randomUUID();
const defaultStorage = name => { try { return kurumiStorage(name); } catch { return null; } };
const token = value => typeof value === 'string' && /^[a-zA-Z0-9_:.-]{0,80}$/.test(value);
export const capitalBucket = value => value < 10000 ? 'under-10k' : value < 30000 ? '10k-30k' : value < 100000 ? '30k-100k' : value < 300000 ? '100k-300k' : 'over-300k';
export const pnlBucket = value => value < -10000 ? 'loss-large' : value < -1000 ? 'loss-medium' : value < 0 ? 'loss-small' : value === 0 ? 'flat' : value < 1000 ? 'gain-small' : value < 10000 ? 'gain-medium' : 'gain-large';
export function sanitizeDetail(value = {}) {
  const result = {};
  for (const [key, val] of Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})) {
    if (tokens.has(key) && token(val)) result[key] = val;
    else if (numbers.has(key) && Number.isFinite(val)) result[key] = Math.max(0, Math.min(1000000, val));
    else if (booleans.has(key) && typeof val === 'boolean') result[key] = val;
  }
  return result;
}
const get = (storage, key) => { try { return storage?.getItem(key); } catch { return null; } };
const put = (storage, key, value) => { try { storage?.setItem(key, value); } catch {} };
const remove = (storage, key) => { try { if(!storage || storage.getItem(key)===null)return true;storage.removeItem(key);return storage.getItem(key)===null; } catch {return false;} };
const stableID = (storage, key) => { let value = get(storage, key); if (!value || !/^[a-zA-Z0-9_-]{8,80}$/.test(value)) { value = uid(); put(storage, key, value); } return value; };
export class FXTelemetry {
  constructor(options = {}) {
    this.storage = options.storage ?? defaultStorage('localStorage');
    this.sessionStorage = options.sessionStorage ?? defaultStorage('sessionStorage');
    this.document = options.document ?? globalThis.document;
    this.window = options.window ?? globalThis.window;
    this.navigator = options.navigator ?? globalThis.navigator;
    this.location = options.location ?? globalThis.location;
    this.fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
    this.now = options.now ?? (() => Date.now());
    this.monotonic = options.monotonic ?? (() => performance.now());
    this.browserPrivacyReason = this.navigator?.globalPrivacyControl === true ? 'privacy-gpc' : this.navigator?.doNotTrack === '1' || this.window?.doNotTrack === '1' ? 'privacy-dnt' : null;
    this.dnt = !!this.browserPrivacyReason;
    this.manualTestMode = options.testMode === true;
    this.getTestMode = typeof options.getTestMode === 'function' ? options.getTestMode : null;
    this.suspended = this.manualTestMode; this.preferencesUnavailable = false;this.testModeUnavailable=false;
    this.serverPrivacy = false; this.destroyed = false;
    this.requestTimeoutMs = Number.isFinite(options.requestTimeoutMs) ? Math.max(100,Math.min(30000,options.requestTimeoutMs)) : 10000;
    this.configuration = serviceConfiguration({serviceOrigin:options.serviceOrigin,location:this.location});
    this.preferenceEnabled = options.enabled !== false;
    this.enabled = this.preferenceEnabled && !this.dnt && this.configuration.configured;
    this.channel = this.configuration.channel;
    this.path = this.configuration.path;
    this.endpoint = this.configuration.eventsEndpoint;
    this.context = {screen: 'boot', run: '', day: 0};
    this.build = token(options.build || '') ? options.build || '' : '';
    this.queue = []; this.seen = new Set(); this.pending = false; this.active = 0; this.pageTime = 0; this.decision = 0; this.last = this.monotonic(); this.visible = !this.document?.hidden; this.lastScreen = ''; this.attempts = 0; this.retryAt = 0; this.ended = false; this.diagnostics = {sent: 0, failed: 0, filteredCount: 0, lastFilterReason: null, lastSent: null, dropped: 0, rejectedBatches: 0, retries: 0, lastStatus: 0}; this.lastReason = 'ready'; this.onStatus = typeof options.onStatus === 'function' ? options.onStatus : () => {};
    this.visitor = ''; this.session = ''; this.generation = 0; this.controller = null;this.privacyCleanupPending=false;this.taintedRuns=new Set();this.inflightIDs=null;
    this.syncPrivacy();
    if (this.enabled && !this.suspended) this.start();
    else this.clearTracking(this.blockReason());
    if (this.blockReason()) this.report(this.blockReason());
    this.onVisibility = () => { this.clock(); if (this.document?.hidden) { this.beat(); this.flush(true); } this.last = this.monotonic(); };
    this.onHide = () => { this.clock(); if (!this.ended) { this.emit('screen_exit', '', {activeMs: this.pageTime}); this.emit('session_end', '', {detail: {reason: 'pagehide'}}); this.ended = true; } this.beat(); this.pageTime = 0; this.flush(true); };
    this.onShow = event => { this.ended = false; this.last = this.monotonic(); this.visible = !this.document?.hidden; if(event.persisted) this.emit('screen_view'); };
    this.onOnline = () => { this.retryAt = 0; this.flush(); };
    // Read current values, never event.newValue: storage events may arrive late.
    this.onStorage = () => { const before=this.blockReason(),reason=this.syncPrivacy();if(reason!==before)this.report(reason || 'ready'); };
    this.window?.addEventListener('storage', this.onStorage);
    this.document?.addEventListener('visibilitychange', this.onVisibility);
    this.window?.addEventListener('pagehide', this.onHide);
    this.window?.addEventListener('pageshow', this.onShow);
    this.window?.addEventListener('online', this.onOnline);
    // Error categories only. Stack/message/filename may contain private data.
    this.onError = () => this.emit('error', 'runtime', {detail: {code: 'runtime-error'}, dedupeKey: 'runtime-error'});
    this.onRejection = () => this.emit('error', 'runtime', {detail: {code: 'unhandled-rejection'}, dedupeKey: 'unhandled-rejection'});
    this.window?.addEventListener('error', this.onError);
    this.window?.addEventListener('unhandledrejection', this.onRejection);
    this.timer = options.autoTimer === false ? null : setInterval(() => { this.clock(); if (this.active >= 15000) this.beat(); this.flush(); }, 5000);
  }
  privacyReason() {
    if (this.navigator?.globalPrivacyControl === true) return 'privacy-gpc';
    if (this.navigator?.doNotTrack === '1' || this.window?.doNotTrack === '1') return 'privacy-dnt';
    return this.serverPrivacy ? 'server-privacy' : this.browserPrivacyReason;
  }
  blockReason() {
    return this.privacyReason() || (!this.preferenceEnabled ? 'statistics-disabled' : (this.preferencesUnavailable || this.testModeUnavailable) ? 'privacy-storage-unavailable' : this.suspended ? 'developer-test' :
      !this.configuration.configured ? 'service-unconfigured' : this.destroyed ? 'destroyed' : !this.enabled ? 'statistics-disabled' : null);
  }
  readPrivacyItem(key) {
    if(!this.storage?.getItem)throw new Error('privacy-unavailable');
    if(!this.storage.readItem)return this.storage.getItem(key);
    const entry=this.storage.readItem(key);if(!entry.available)throw new Error('privacy-unavailable');return entry.value;
  }
  pruneTaintedRuns() {
    const runs=new Set([...this.queue.map(e=>e.run),this.context.run].filter(Boolean));
    for(const run of runs){
      // Real campaigns use validated IDs. Never query another storage namespace.
      if(!/^[a-zA-Z0-9_-]{8,80}$/.test(run) || this.readPrivacyItem('fx-api-v1-developer-taint-'+run)!==null)this.taintedRuns.add(run);
    }
    const removed=this.queue.filter(e=>this.taintedRuns.has(e.run));
    if(!removed.length)return;
    this.queue=this.queue.filter(e=>!this.taintedRuns.has(e.run));this.filtered('developer-test',removed.length);
    if(this.controller && removed.some(e=>this.inflightIDs?.has(e.id))){this.generation++;this.controller.abort();this.lastReason='ready';}
    this.persist();
  }
  syncPrivacy() {
    const wasSuspended=this.suspended,wasUnavailable=this.preferencesUnavailable || this.testModeUnavailable;
    const wasAllowed=this.enabled && !wasSuspended && !wasUnavailable;
    // A failed read is unknown consent, never an implicit opt-in. An observed
    // opt-out stays off until this page receives an explicit setEnabled(true).
    try {
      if(this.readPrivacyItem('fx-telemetry-enabled')==='false' || this.readPrivacyItem('fx-girl-analytics')==='off')this.preferenceEnabled=false;
      this.preferencesUnavailable=false;
      if(this.preferenceEnabled)this.pruneTaintedRuns();
    } catch {this.preferencesUnavailable=true;}
    let dynamicTestMode=false;this.testModeUnavailable=false;
    try {if(this.getTestMode){const value=this.getTestMode();this.testModeUnavailable=value!==true && value!==false;dynamicTestMode=value!==false;}} catch {dynamicTestMode=true;this.testModeUnavailable=true;}
    this.suspended=this.manualTestMode || dynamicTestMode;
    const privacy=this.privacyReason();
    if(privacy && privacy!=='server-privacy')this.browserPrivacyReason=privacy;
    this.dnt=!!this.browserPrivacyReason;
    this.enabled=this.preferenceEnabled && !privacy && !this.preferencesUnavailable && !this.testModeUnavailable && this.configuration.configured && !this.destroyed;
    let reason=this.blockReason();
    if(this.privacyCleanupPending || reason && (this.queue.length || this.visitor || this.session || this.controller && !this.controller.signal.aborted))this.clearTracking(reason || 'privacy-storage-unavailable');
    if(this.privacyCleanupPending){this.preferencesUnavailable=true;this.enabled=false;reason=this.blockReason();}
    if((wasAllowed && reason) || wasSuspended!==this.suspended || wasUnavailable!==(this.preferencesUnavailable || this.testModeUnavailable)){
      this.active=this.pageTime=this.decision=0;this.last=this.monotonic();
    }
    if(!reason && (wasSuspended || wasUnavailable)){
      // A resumed/new run must not attach its bootstrap visit to the old run.
      this.context={screen:'boot',run:'',day:0};this.lastScreen='';this.start();
    }
    return reason;
  }
  // A copy of fixed configuration and counters, never queue rows or identifiers.
  // Counters live only in this client instance; failed counts failed attempts.
  snapshot() {
    return Object.freeze({configured:this.configuration.configured,endpoint:this.endpoint,build:this.build,
      enabled:this.enabled,testMode:this.suspended,queued:this.queue.length,sent:this.diagnostics.sent,
      failed:this.diagnostics.failed,filteredCount:this.diagnostics.filteredCount,
      lastFilterReason:this.diagnostics.lastFilterReason,lastStatus:this.diagnostics.lastStatus,
      lastSent:this.diagnostics.lastSent,pending:this.pending,retryAt:this.retryAt,
      dropped:this.diagnostics.dropped,rejectedBatches:this.diagnostics.rejectedBatches,retries:this.diagnostics.retries,
      reason:this.blockReason() || this.lastReason});
  }
  report(reason) { this.lastReason=reason; try {this.onStatus(this.snapshot());} catch {} }
  filtered(reason,count=1) {
    if (count>0) {this.diagnostics.filteredCount+=count;this.diagnostics.lastFilterReason=reason;}
    return false;
  }
  start() {
    if (this.syncPrivacy()) return;
    this.visitor = stableID(this.storage, 'fx-api-v1-anon-visitor'); this.session = stableID(this.sessionStorage, 'fx-api-v1-anon-session');
    try { this.seen = new Set(JSON.parse(get(this.sessionStorage, 'fx-api-v1-telemetry-seen') || '[]').filter(k => typeof k === 'string').slice(-1200)); } catch { this.seen = new Set(); }
    try { const saved = JSON.parse(get(this.storage, 'fx-api-v1-telemetry-outbox') || '[]'); this.queue = saved.filter(e => this.now() - e.queuedAt < 86400000 && names.has(e.name) && e.visitor === this.visitor && /^[a-zA-Z0-9_-]{8,80}$/.test(e.id) && /^[a-zA-Z0-9_-]{8,80}$/.test(e.session) && token(e.run) && token(e.screen) && token(e.target)).slice(-240).map(e => ({id:e.id,visitor:e.visitor,session:e.session,game:'fx',site:'fx',channel:this.channel,path:this.path,run:e.run,screen:e.screen,name:e.name,target:e.target,stage:0,day:Math.max(0,Math.min(10000,Math.floor(e.day||0))),activeMs:Math.max(0,Math.min(3600000,Math.round(e.activeMs||0))),detail:sanitizeDetail(e.detail),queuedAt:e.queuedAt})); } catch { this.queue = []; }
    const previous = Number(get(this.storage, 'fx-api-v1-last-visit') || 0), gap = this.now() - previous;
    put(this.storage, 'fx-api-v1-last-visit', String(this.now()));
    const mobile = (this.window?.innerWidth || 1024) < 640;
    this.emit('visit', '', {detail: {returning: previous > 0, returnGap: previous ? gap < 3600000 ? 'under-hour' : gap < 86400000 ? 'same-day' : gap < 604800000 ? 'under-week' : 'over-week' : 'first', device: mobile ? 'mobile' : 'desktop'}});
  }
  persist() { if (this.enabled && !this.suspended) put(this.storage, 'fx-api-v1-telemetry-outbox', JSON.stringify(this.queue)); }
  clearTracking(reason = this.blockReason() || 'statistics-disabled') {
    this.generation++; this.controller?.abort(); this.filtered(reason,this.queue.length); this.queue=[]; this.seen.clear();
    this.attempts=0; this.retryAt=0;
    const cleared=[...['fx-api-v1-telemetry-outbox','fx-api-v1-anon-visitor','fx-api-v1-last-visit'].map(key=>remove(this.storage,key)),...['fx-api-v1-anon-session','fx-api-v1-telemetry-seen'].map(key=>remove(this.sessionStorage,key))];
    this.privacyCleanupPending=cleared.some(ok=>!ok);
    this.visitor = ''; this.session = '';
  }
  setTestMode(value) {
    this.manualTestMode=value===true;
    this.report(this.syncPrivacy() || 'ready');
  }
  setEnabled(value) {
    const was=this.enabled;
    this.preferenceEnabled=value===true;
    put(this.storage,'fx-telemetry-enabled',value===true?'true':'false');
    const blocked=this.syncPrivacy();
    if(!blocked && !was && !this.visitor){this.lastScreen='';this.start();this.view(this.context);}
    this.report(blocked || 'ready');
    return this.enabled;
  }
  clock() { this.syncPrivacy();const now = this.monotonic(), elapsed = Math.max(0, Math.min(30000, now - this.last)); this.last = now; if (this.enabled && !this.suspended && this.visible) { this.active += elapsed; this.pageTime += elapsed; this.decision += elapsed; } this.visible = !this.document?.hidden; }
  emit(name, target = '', extra = {}) {
    const blocked=this.syncPrivacy();
    if (blocked) return this.filtered(blocked);
    if(this.taintedRuns.has(this.context.run))return this.filtered('developer-test');
    if (!names.has(name)) return this.filtered('invalid-event');
    if (!token(target)) return this.filtered('invalid-target');
    if (extra.dedupeKey) { const key = `${name}:${extra.dedupeKey}`; if (this.seen.has(key)) return this.filtered('duplicate-event'); this.seen.add(key); if (this.seen.size > 1200) this.seen.delete(this.seen.values().next().value); put(this.sessionStorage, 'fx-api-v1-telemetry-seen', JSON.stringify([...this.seen])); }
    this.queue.push({id: uid(), visitor: this.visitor, session: this.session, game: 'fx', site: 'fx', channel: this.channel, path: this.path, ...this.context, name, target, stage: 0, activeMs: Math.round(Math.max(0, Math.min(3600000, extra.activeMs || 0))), detail: {...sanitizeDetail(extra.detail), build: this.build}, queuedAt: this.now()});
    if (this.queue.length > 240) {const count=this.queue.splice(0,this.queue.length-240).length;this.diagnostics.dropped+=count;this.filtered('buffer-limit',count);}
    this.persist(); return true;
  }
  beat() { if (this.active > 0) this.emit('heartbeat', '', {activeMs: this.active}); this.active = 0; }
  view(context = {}) {
    this.clock(); const next = {screen: token(context.screen) && context.screen.length <= 40 ? context.screen : this.context.screen, run: token(context.run) ? context.run : this.context.run, day: Math.max(0, Math.min(10000, Math.floor(Number.isFinite(context.day) ? context.day : this.context.day)))};
    if (next.screen !== this.lastScreen) {
      if (this.lastScreen) { this.emit('screen_exit', '', {activeMs: this.pageTime}); this.emit('transition', '', {detail: {from: this.lastScreen, to: next.screen}}); }
      this.context = next; this.emit('screen_view'); this.pageTime = 0; this.lastScreen = next.screen;
    } else this.context = next;
  }
  hook(key, options = {}) {
    const blocked=this.syncPrivacy();if(blocked)return this.filtered(blocked);
    const hook=Object.hasOwn(FX_TELEMETRY_HOOKS,key) ? FX_TELEMETRY_HOOKS[key] : null;
    if (!hook) return this.filtered('invalid-hook');
    // Ignore all caller detail/target fields. Only a local dedupe key is accepted.
    return this.emit(hook.name,hook.target,{detail:hook.detail,dedupeKey:options?.dedupeKey ? `hook:${key}:${options.dedupeKey}` : undefined});
  }
  action(name, target = '', detail = {}) { this.clock(); const result = this.emit(name, target, {activeMs: this.decision, detail}); if (['trade_open','trade_close','story_choice','item_used'].includes(name)) this.decision = 0; return result; }
  async flush(lifecycle = false) {
    if (this.syncPrivacy() || !this.queue.length || this.pending) return false;
    const before=this.queue.length;
    this.queue=this.queue.filter(e=>this.now()-e.queuedAt<86400000);
    const expired=before-this.queue.length;
    if(expired){this.diagnostics.dropped+=expired;this.filtered('expired',expired);this.persist();}
    if(!this.queue.length || this.now()<this.retryAt)return false;
    if(!this.fetch){this.report('transport-unavailable');return false;}
    if(this.navigator?.onLine===false){this.report('offline');return false;}
    this.pending=true;
    const generation=this.generation,controller=new AbortController();this.controller=controller;
    // Old offline sessions are sent separately; the backend enforces a single session per batch.
    const session=this.queue[0].session,rows=this.queue.filter(e=>e.session===session).slice(0,40);
    let data=JSON.stringify({events:rows.map(({queuedAt,...e})=>e)});
    while(new TextEncoder().encode(data).byteLength>47000 && rows.length>1){rows.pop();data=JSON.stringify({events:rows.map(({queuedAt,...e})=>e)});}
    const ids=new Set(rows.map(e=>e.id));this.inflightIDs=ids;
    let timeout,abortListener,timedOut=false,status=0,failure='network-error';
    // Race both fetch and JSON decoding. Abort alone cannot settle a stalled adapter.
    const cancelled=new Promise((_,reject)=>{
      abortListener=()=>reject(new Error('cancelled'));
      controller.signal.addEventListener('abort',abortListener,{once:true});
      timeout=setTimeout(()=>{timedOut=true;controller.abort();},this.requestTimeoutMs);
    });
    try {
      this.report('sending');
      const result=await Promise.race([cancelled,(async()=>{
        if(this.syncPrivacy() || generation!==this.generation)return {ok:false};
        const response=await this.fetch(this.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',referrerPolicy:'no-referrer',body:data,keepalive:lifecycle,signal:controller.signal});
        status=Number.isInteger(response?.status)&&response.status>=100&&response.status<=599?response.status:0;
        if(!response?.ok)return {ok:false};
        failure='invalid-ack';
        const body=await response.json();return {ok:true,body};
      })()]);
      if(this.syncPrivacy() || generation!==this.generation)return false;
      this.diagnostics.lastStatus=status;
      if(status===400 || status===403){
        this.diagnostics.failed++;this.diagnostics.rejectedBatches++;this.diagnostics.dropped+=rows.length;
        this.queue=this.queue.filter(e=>!ids.has(e.id));this.attempts=0;this.retryAt=0;this.persist();this.report('batch-rejected');return false;
      }
      if(result.ok && result.body?.ok===true && result.body.ignored==='privacy' && result.body.count===0){
        this.serverPrivacy=true;this.enabled=false;this.clearTracking('server-privacy');this.report('server-privacy');return false;
      }
      if(!result.ok){failure='http-error';throw new Error('retry');}
      const ack=result.body;
      if(!ack || typeof ack!=='object' || Array.isArray(ack) || ack.ok!==true || ack.ignored!==undefined || !Number.isInteger(ack.count) || ack.count!==rows.length){failure='invalid-ack';throw new Error('retry');}
      // The backend inserts by event ID. Retrying a lost ACK never creates new IDs.
      this.queue=this.queue.filter(e=>!ids.has(e.id));this.attempts=0;this.retryAt=0;
      this.diagnostics.sent+=rows.length;this.diagnostics.lastSent=this.now();this.persist();this.report('sent');return true;
    } catch {
      if(this.syncPrivacy() || generation!==this.generation)return false;
      this.diagnostics.lastStatus=status;this.diagnostics.failed++;this.diagnostics.retries++;
      this.attempts=Math.min(8,this.attempts+1);this.retryAt=this.now()+Math.min(300000,5000*2**this.attempts);
      this.report(timedOut?'timeout':failure);return false;
    } finally {
      clearTimeout(timeout);controller.signal.removeEventListener('abort',abortListener);
      this.pending=false;if(this.controller===controller){this.controller=null;this.inflightIDs=null;}
      this.report(this.blockReason() || this.lastReason);
    }
  }
  destroy() { this.destroyed=true;this.generation++;this.controller?.abort();if (this.timer) clearInterval(this.timer); this.document?.removeEventListener('visibilitychange', this.onVisibility); for (const [name, handler] of [['pagehide',this.onHide],['pageshow',this.onShow],['online',this.onOnline],['storage',this.onStorage],['error',this.onError],['unhandledrejection',this.onRejection]]) this.window?.removeEventListener(name,handler); }
}
export {FXTelemetry as Telemetry};
