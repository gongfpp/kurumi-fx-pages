import {NEWS_ARCHIVE} from './news-archive.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
