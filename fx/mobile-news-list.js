import {NEWS_ARCHIVE} from './news-archive.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
