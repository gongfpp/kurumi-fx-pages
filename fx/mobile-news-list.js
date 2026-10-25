import {NEWS_ARCHIVE} from './news-archive.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
