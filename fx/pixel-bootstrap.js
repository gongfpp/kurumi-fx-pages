// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=7a839b5792d6dcf1fed62b676f05ec286e587c37-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
