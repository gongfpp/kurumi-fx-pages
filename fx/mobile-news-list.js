import {NEWS_ARCHIVE} from './news-archive.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
