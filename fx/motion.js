// Independent FX motion primitive, extracted from leek-spire feedback.js.
export class GameMotion {
  constructor({root=globalThis.document,limit=12}={}){
    this.root=root;this.limit=limit;this.enabled=true;this.requested=true;this.animations=new Set();this.timers=new Set();this.targets=new WeakMap();
    this.preference=root?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    this.sync=()=>{this.enabled=this.requested&&!this.preference?.matches;root?.body?.classList?.toggle('motion-full',this.enabled);if(!this.enabled)this.clear();};
    this.preference?.addEventListener?.('change',this.sync);
  }
  // OS reduced motion is a safety fallback even for the game's full setting.
  configure(enabled){this.requested=!!enabled;this.sync();}
  clear(){for(const a of this.animations)a.cancel();this.animations.clear();this.targets=new WeakMap();for(const t of this.timers)clearTimeout(t);this.timers.clear();this.root?.querySelectorAll?.('.fx-ghost,.trade-feedback').forEach(e=>e.remove());}
  animate(el,frames,options){
    if(!el?.animate||!this.enabled)return;
    const previous=this.targets.get(el);if(previous){previous.cancel();this.animations.delete(previous);}
    while(this.animations.size>=this.limit){const oldest=this.animations.values().next().value;oldest.cancel();this.animations.delete(oldest);}
    let a;try{a=el.animate(frames,{duration:280,easing:'cubic-bezier(.2,.8,.2,1)',...options});}catch{return;}
    this.targets.set(el,a);this.animations.add(a);
    a.finished.catch(()=>{}).finally(()=>{this.animations.delete(a);if(this.targets.get(el)===a)this.targets.delete(el);});return a;
  }
  dispose(){this.clear();this.preference?.removeEventListener?.('change',this.sync);}
}
