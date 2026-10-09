import {RESEARCH_BUILD} from './research-config.js?v=11110082a121db2b95b0f01ab243349641eb7d85-23f2a20b7717';
// The sole public service-origin value. Production is intentionally unconfigured.
// tools/build-fx.mjs writes the explicitly supplied KURUMI_SERVICE_ORIGIN into
// the exported bundle only; tests can inject serviceOrigin without editing it.
export const KURUMI_SERVICE_ORIGIN = "https://kurumi-fx-api.gongfpp.chatgpt.site";
export const KURUMI_CLIENT_PATH = '/fx.html';
export const KURUMI_PAGES_ORIGIN = 'https://gongfpp.github.io';
export const KURUMI_PAGES_PATH = '/kurumi-fx-pages/';
export const SERVICE_UNCONFIGURED_MESSAGE = '久留美独立服务尚未配置，排行榜暂不可用；离线游戏和存档不受影响';

export function validServiceOrigin(value) {
  if (typeof value !== 'string' || !value) return false;
  try {
    const url = new URL(value);
    return url.origin === value && !url.username && !url.password &&
      (url.protocol === 'https:' || (url.protocol === 'http:' && isLoopbackOrigin(value)));
  } catch { return false; }
}
export function isLoopbackOrigin(value) {
  try { const url = new URL(value); return url.origin === value && ['http:', 'https:'].includes(url.protocol) && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname); }
  catch { return false; }
}
export function serviceConfiguration({serviceOrigin = KURUMI_SERVICE_ORIGIN, location = globalThis.location} = {}) {
  // Only a loopback browser may use same-origin without a registered service.
  // Invalid explicit configuration must never silently select another backend.
  const origin = serviceOrigin === '' && isLoopbackOrigin(location?.origin) ? location.origin : serviceOrigin;
  const configured = !RESEARCH_BUILD && validServiceOrigin(origin);
  const pages = location?.origin === KURUMI_PAGES_ORIGIN;
  return Object.freeze({
    configured, origin: configured ? origin : '',
    status: configured ? 'configured' : 'service-unconfigured',
    leaderboardEndpoint: configured ? origin + '/api/fx/leaderboard' : null,
    eventsEndpoint: configured ? origin + '/api/fx/events' : null,
    channel: pages ? 'github-pages' : isLoopbackOrigin(location?.origin) ? 'local' : 'gpt-site',
    path: pages ? KURUMI_PAGES_PATH : KURUMI_CLIENT_PATH,
  });
}
