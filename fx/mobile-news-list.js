import {NEWS_ARCHIVE} from './news-archive.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
import {mobileNewsItems as items} from './mobile-news-items.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
export {mobileNewsListTime} from './mobile-news-items.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';
export {mountMobileNewsList} from './mobile-news-view.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717';

export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 return items(state,current,{archive});
}
