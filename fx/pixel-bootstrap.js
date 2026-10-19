// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=e60ab366b51c60891ec0c2bf4cd9abb2d6da1dad-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
