// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=cd9f9f7e3a56c2f7b69205678364be26447bb249-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
