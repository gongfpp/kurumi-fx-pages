// Presentation must respect the OS hint; it never changes gameplay or sound.
export function systemReducedMotion(root=globalThis.document){
 return !!root?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
