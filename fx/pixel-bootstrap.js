// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=e334df457a8010281b76b74406fa77069f96d880-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
