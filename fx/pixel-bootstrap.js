// Catch application/dependency load failures without exposing a second UI.
try{await import('./app.js?v=12bbce5584c8b4366889740b782b99852f64ce30-23f2a20b7717');}
catch(error){
 globalThis.kurumiPixelBoot?.fail();
 console.error('Game startup failed',error);
}
