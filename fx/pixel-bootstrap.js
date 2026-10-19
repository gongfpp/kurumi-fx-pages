// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=d646c2f56c57fd7702f80200246852039ee3cd77-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
