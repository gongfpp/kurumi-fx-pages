// Catch application/dependency load failures without exposing a second UI.
// Program retries reload the document; renderer retries retain this same import.
const program=globalThis.kurumiPixelBoot?.programTicket?.();
try{await import('./app.js?v=14a5ec6b633c2c522d81c9a484536de59c4ee715-23f2a20b7717');}
catch(error){
 if(program)program.fail();else globalThis.kurumiPixelBoot?.fail('program');
 console.error('Game startup failed',error);
}
