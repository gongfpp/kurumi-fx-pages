// Catch application/dependency load failures without exposing a second UI.
// Program retries reload the document; renderer retries retain this same import.
const program=globalThis.kurumiPixelBoot?.programTicket?.();
try{await import('./app.js?v=82affdc0b9de0f9673fae6eecd09c7e943ae7874-23f2a20b7717');}
catch(error){
 if(program)program.fail();else globalThis.kurumiPixelBoot?.fail('program');
 console.error('Game startup failed',error);
}
