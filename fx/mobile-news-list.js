import {NEWS_ARCHIVE} from './news-archive.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=dbe282e832afbc680c0a4ce70e9edbf550f0c34f-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
