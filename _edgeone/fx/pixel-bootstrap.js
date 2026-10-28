// Catch application/dependency load failures without exposing a second UI.
// Program retries reload the document; renderer retries retain this same import.
const program=globalThis.kurumiPixelBoot?.programTicket?.();
try{await import('./app.js?v=4e1bb4fd62a377ce983db7672852ed86d1f9ab5b-23f2a20b7717');}
catch(error){
 if(program)program.fail();else globalThis.kurumiPixelBoot?.fail('program');
 console.error('Game startup failed',error);
}
