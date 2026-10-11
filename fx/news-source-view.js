// The publication link is the only news-category cue. Never infer a URL from
// an archive ID, headline, source name or the current page location.
export function originalPublicationUrl(event){
 if(typeof event?.sourceUrl!=='string'||!event.sourceUrl.trim())return null;
 try{
  const value=event.sourceUrl.trim();if(!/^https?:\/\//i.test(value))return null;
  const url=new URL(value);
  return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?value:null;
 }catch{return null;}
}
export function renderArchiveSource(document,event){
 event=event??{};
 const details=document.getElementById('news-archive-details'),source=document.getElementById('news-archive-source');
 if(!details||!source)return;
 const url=originalPublicationUrl(event),shown=!!url;
 details.hidden=!shown;source.hidden=!shown;
 if(shown){source.href=url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='原始发布';}else source.removeAttribute('href');
 let notice=document.getElementById('news-source-attribution'),license=document.getElementById('news-source-license');
 if(shown&&event.sourceAttribution&&!notice){notice=document.createElement('span');notice.id='news-source-attribution';details.append(notice);}
 if(notice){notice.hidden=!shown||!event.sourceAttribution;notice.textContent=event.sourceAttribution?` · ${event.sourceAttribution}${event.summaryNotice?' · '+event.summaryNotice:''}`:'';}
 if(shown&&event.sourceLicenseUrl&&!license){license=document.createElement('a');license.id='news-source-license';license.target='_blank';license.rel='noopener noreferrer';details.append(license);}
 if(license){license.hidden=!shown||!event.sourceLicenseUrl;if(!license.hidden){license.href=event.sourceLicenseUrl;license.textContent=' · CC BY 4.0';}else license.removeAttribute('href');}
}
