// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=591c20f8c91072a08d497d48fa9e2e68c7935364-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
