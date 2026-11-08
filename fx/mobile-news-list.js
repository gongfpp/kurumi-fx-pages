import {NEWS_ARCHIVE} from './news-archive.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=7bd64276f68c37e12853b700dcba03d20dcb9a49-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
