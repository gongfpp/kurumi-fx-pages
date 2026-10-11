// Show provenance beside the existing article link, without adding a dialog.
export function renderArchiveSource(document,event){
 const details=document.getElementById('news-archive-details'),source=document.getElementById('news-archive-source');
 if(!details||!source)return;
 const shown=!!event?.archiveId;
 details.hidden=!shown;source.hidden=!shown;
 if(shown){source.href=event.sourceUrl;source.textContent='原始发布';}else source.removeAttribute('href');
 let notice=document.getElementById('news-source-attribution'),license=document.getElementById('news-source-license');
 if(shown&&event.sourceAttribution&&!notice){notice=document.createElement('span');notice.id='news-source-attribution';details.append(notice);}
 if(notice){notice.hidden=!shown||!event.sourceAttribution;notice.textContent=event.sourceAttribution?` · ${event.sourceAttribution} · ${event.summaryNotice}`:'';}
 if(shown&&event.sourceLicenseUrl&&!license){license=document.createElement('a');license.id='news-source-license';license.target='_blank';license.rel='noopener noreferrer';details.append(license);}
 if(license){license.hidden=!shown||!event.sourceLicenseUrl;if(!license.hidden){license.href=event.sourceLicenseUrl;license.textContent=' · CC BY 4.0';}else license.removeAttribute('href');}
}
