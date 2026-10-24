import {NEWS_ARCHIVE} from './news-archive.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=c2206d06d03022b81c2f2452b19871fb40d4a8b9-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
