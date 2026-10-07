// Only add actual, locally packaged recordings after checking the author's license
// and the file's SHA-256. This validates metadata; it does not verify a license.
export const BGM_SCENE_TAGS=Object.freeze(['neutral','focus','tension','gain','loss','crisis','numb','relief']);
export const BGM_CATALOG=Object.freeze([
  {
    "id": "on-the-ground",
    "title": "On the Ground",
    "artist": "Kevin MacLeod",
    "src": "./bgm/on-the-ground.mp3",
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    },
    "sourceUrl": "https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400030",
    "credit": "\"On the Ground\" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. https://creativecommons.org/licenses/by/4.0/",
    "sceneTags": [
      "neutral",
      "focus"
    ],
    "duration": 159.137959,
    "sha256": "0c42eb44ed039fffb6565eaac667185784f67585c27c0f40c776d6d812517879",
    "modifications": "Transcoded to stereo 44.1kHz/128kbps MP3; loudness normalized to target -20 LUFS / -3 dBTP; 0.8s fade-in and 1.5s fade-out."
  },
  {
    "id": "the-complex",
    "title": "The Complex",
    "artist": "Kevin MacLeod",
    "src": "./bgm/the-complex.mp3",
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    },
    "sourceUrl": "https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300025",
    "credit": "\"The Complex\" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. https://creativecommons.org/licenses/by/4.0/",
    "sceneTags": [
      "tension",
      "gain"
    ],
    "duration": 267.781224,
    "sha256": "c9e7f578f2a34f0a232139499d813b13fed9388b040a1c6829ea591c7773821f",
    "modifications": "Transcoded to stereo 44.1kHz/128kbps MP3; loudness normalized to target -20 LUFS / -3 dBTP; 0.8s fade-in and 1.5s fade-out."
  },
  {
    "id": "dark-fog",
    "title": "Dark Fog",
    "artist": "Kevin MacLeod",
    "src": "./bgm/dark-fog.mp3",
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    },
    "sourceUrl": "https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300031",
    "credit": "\"Dark Fog\" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. https://creativecommons.org/licenses/by/4.0/",
    "sceneTags": [
      "loss",
      "crisis"
    ],
    "duration": 239.072653,
    "sha256": "56cba61d6711a17405ca61141e29cbb68885740f084efa4c8e3d5924e87289d2",
    "modifications": "Transcoded to stereo 44.1kHz/128kbps MP3; loudness normalized to target -20 LUFS / -3 dBTP; 0.8s fade-in and 1.5s fade-out."
  },
  {
    "id": "comfortable-mystery-4",
    "title": "Comfortable Mystery 4",
    "artist": "Kevin MacLeod",
    "src": "./bgm/comfortable-mystery-4.mp3",
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    },
    "sourceUrl": "https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100535",
    "credit": "\"Comfortable Mystery 4\" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. https://creativecommons.org/licenses/by/4.0/",
    "sceneTags": [
      "numb"
    ],
    "duration": 75.781224,
    "sha256": "c4b32d6bb607845c7d6e7d0c3bb80ca8a823c13ca01d612aefb0f1fe0018bb4c",
    "modifications": "Transcoded to stereo 44.1kHz/128kbps MP3; loudness normalized to target -20 LUFS / -3 dBTP; 0.8s fade-in and 1.5s fade-out."
  },
  {
    "id": "cool-vibes",
    "title": "Cool Vibes",
    "artist": "Kevin MacLeod",
    "src": "./bgm/cool-vibes.mp3",
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/"
    },
    "sourceUrl": "https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100863",
    "credit": "\"Cool Vibes\" Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License. https://creativecommons.org/licenses/by/4.0/",
    "sceneTags": [
      "relief",
      "neutral"
    ],
    "duration": 218.409796,
    "sha256": "e88c7cc4a5b6a7ea4fcf30dc1fdb88c553dc8ca74b1630e240802da0785b93c7",
    "modifications": "Transcoded to stereo 44.1kHz/128kbps MP3; loudness normalized to target -20 LUFS / -3 dBTP; 0.8s fade-in and 1.5s fade-out."
  }
]);

export function validateBgmCatalog(tracks) {
  if(!Array.isArray(tracks))throw new TypeError('BGM catalog must be an array');
  const ids=new Set(),web=value=>{try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}};
  return Object.freeze(tracks.map(track=>{
    if(!track||!['id','title','artist','credit'].every(key=>typeof track[key]==='string'&&track[key].trim()))throw new TypeError('BGM needs an id, title, artist and credit');
    if(ids.has(track.id))throw new TypeError(`Duplicate BGM id: ${track.id}`);ids.add(track.id);
    if(typeof track.src!=='string'||!/^\.\/bgm\/[a-zA-Z0-9_./-]+\.(mp3|ogg|m4a|wav|flac)$/i.test(track.src)||track.src.split('/').includes('..'))throw new TypeError(`BGM must use a packaged ./bgm/ recording: ${track.id}`);
    if(!track.license?.name?.trim()||!web(track.license.url)||!web(track.sourceUrl))throw new TypeError(`BGM needs license and source links: ${track.id}`);
    if(!Number.isFinite(track.duration)||track.duration<=0||!/^\w{64}$/.test(track.sha256)||!/^[a-f0-9]+$/i.test(track.sha256))throw new TypeError(`BGM needs measured duration and SHA-256: ${track.id}`);
    if(!Array.isArray(track.sceneTags)||!track.sceneTags.length||track.sceneTags.some(tag=>!BGM_SCENE_TAGS.includes(tag)))throw new TypeError(`Invalid BGM scene tags: ${track.id}`);
    return Object.freeze({...track,sceneTags:Object.freeze([...track.sceneTags]),license:Object.freeze({...track.license})});
  }));
}
