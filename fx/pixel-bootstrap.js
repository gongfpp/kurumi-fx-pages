// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=312310b759c9c281ed2d9f234cc9c6ec9eec4de2-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
