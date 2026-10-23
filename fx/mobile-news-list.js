import {NEWS_ARCHIVE} from './news-archive.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=a881d911fe9c02f2ce01a0e3366a9d03d2fb1b98-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
