// 非秘密发布配置。只有实际fx HTTPS origin及原A隐私门禁通过才启用新通道。
// 2026-10-28恢复后的新候选：六个运行核心已按原QA manifest逐字节核实；此文件重新创建。
export const ANALYTICS_JOURNEY_RELEASE=Object.freeze({enabled:true,origin:'https://fx.gongfpp.icu',endpoint:'https://stats.gongfpp.icu/api/journey/v1/events',umamiEnabled:true,umamiSrc:'https://stats.gongfpp.icu/script.js',umamiWebsiteId:'bb8f9140-45fa-4919-99f5-43da20ec6aaf'});
