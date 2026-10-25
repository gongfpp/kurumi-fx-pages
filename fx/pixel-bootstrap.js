// Catch application/dependency load failures without exposing a second UI.
// Program retries reload the document; renderer retries retain this same import.
const program=globalThis.kurumiPixelBoot?.programTicket?.();
try{await import('./app.js?v=48e2621c04083a2b00065eac842f8016d1721815-23f2a20b7717');}
catch(error){
 if(program)program.fail();else globalThis.kurumiPixelBoot?.fail('program');
 console.error('Game startup failed',error);
}
