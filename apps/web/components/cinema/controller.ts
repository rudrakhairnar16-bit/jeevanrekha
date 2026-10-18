import {RANGES,resolveNarrative,type NarrativeState} from './narrative';
import type {CinemaEngine,FrameReport,Quality} from './engine';
export type NarrativeCue={act:string;progress:number};
/** Filters the world, never the browser. No wheel/touch interception or document transforms. */
export class NarrativeController{
 engine:CinemaEngine|null=null;disposed=false;frame=0;observer:ResizeObserver|null=null;
 reduced=matchMedia('(prefers-reduced-motion:reduce)');forced=matchMedia('(forced-colors:active)');
 top=0;distance=1;lastAct='';pendingHash=true;abort=new AbortController();contextCreated=false;
 rawProgress=0;visualProgress=NaN;previousTime=0;lastInputTime=0;viewWidth=0;viewHeight=0;
 constructor(public root:HTMLElement,public canvas:HTMLCanvasElement,public quality:Quality|'auto',public onFrame:(state:NarrativeState,report:FrameReport)=>void,public onReady:()=>void,public onFallback:(reason:string)=>void,public onCue?:(cue:NarrativeCue)=>void){}
 async start(){
  if(this.reduced.matches||this.forced.matches){this.preference();return;}
  try{
   const{CinemaEngine,selectQuality,loadHumanLibrary,disposeHumanLibrary}=await import('./engine');if(this.disposed)return;
   selectQuality(this.canvas,innerWidth<760);this.contextCreated=true;const humans=await loadHumanLibrary(this.abort.signal);
   if(this.disposed){disposeHumanLibrary(humans);return;}
   try{this.engine=new CinemaEngine(this.canvas,this.quality,()=>this.onFallback('The graphics context was interrupted. The complete story remains available.'),humans);}catch(error){disposeHumanLibrary(humans);throw error;}
   this.measure();this.draw(performance.now());if(this.disposed)return;this.onReady();this.measure();
   this.viewWidth=innerWidth;this.viewHeight=innerHeight;
   addEventListener('scroll',this.scroll,{passive:true});addEventListener('resize',this.resize,{passive:true});addEventListener('pageshow',this.restore);addEventListener('hashchange',this.hash);
   document.addEventListener('visibilitychange',this.visibility);this.reduced.addEventListener('change',this.preference);this.forced.addEventListener('change',this.preference);
   this.observer=new ResizeObserver(this.layout);this.observer.observe(this.canvas);this.observer.observe(this.root);
   document.fonts.ready.then(()=>{if(!this.disposed)this.layout();});this.hash();
  }catch{if(!this.disposed)this.onFallback('Real-time graphics are unavailable. Enjoy the complete reading experience.');}
 }
 measure=()=>{if(this.disposed)return;const prelude=this.root.querySelector<HTMLElement>('.film-prelude');const lead=prelude?.offsetHeight||0;this.top=this.root.getBoundingClientRect().top+scrollY+lead;this.distance=Math.max(1,this.root.offsetHeight-lead-innerHeight);};
 scroll=()=>{this.lastInputTime=performance.now();this.queue();};
 draw=(now:number)=>{
  this.frame=0;if(this.disposed||!this.engine||document.hidden)return;
  this.rawProgress=Math.min(1,Math.max(0,(scrollY-this.top)/this.distance));
  const dt=this.previousTime?Math.min(.1,Math.max(.001,(now-this.previousTime)/1000)):1/60;
  const active=Number.isFinite(this.visualProgress)&&Math.abs(this.rawProgress-this.visualProgress)>1e-7;
  if(active&&this.previousTime)this.engine.noteFrameInterval(now-this.previousTime);
  this.previousTime=now;
  if(!Number.isFinite(this.visualProgress))this.visualProgress=this.rawProgress;
  const difference=this.rawProgress-this.visualProgress;
  // Native scroll stays immediate; only the rendered film follows with a short, frame-rate-independent cinematic response.
  const tau=Math.abs(difference)>.12?.032:.052;
  this.visualProgress+=difference*(1-Math.exp(-dt/tau));
  if(Math.abs(this.rawProgress-this.visualProgress)<2e-5)this.visualProgress=this.rawProgress;
  const state=resolveNarrative(this.visualProgress);let report:FrameReport;
  try{report=this.engine.update(this.visualProgress);}catch{this.onFallback('The cinematic layer was interrupted. The complete reading experience remains available.');return;}
  report.rawProgress=this.rawProgress;report.visualProgress=this.visualProgress;
  this.root.style.setProperty('--film-progress',String(this.visualProgress));
  const transition=state.previousWorld!==state.act.world;const caption=Math.min(1,Math.max(0,(state.local-(transition?.30:.035))/.12));this.root.style.setProperty('--caption-presence',String(state.index===0?1:caption));this.root.dataset.captionReady=state.index===0||caption>.001?'yes':'no';
  this.root.style.setProperty('--detail-presence',String(Math.min(1,Math.max(0,(state.local-(transition?.42:.14))/.12))));
  this.root.dataset.detailReady=state.local>(transition?.42:.14)?'yes':'no';
  this.onFrame(state,report);
  if(this.pendingHash&&this.root.classList.contains('film-enhanced')){this.pendingHash=false;this.hash();}
  if(state.act.id!==this.lastAct){this.lastAct=state.act.id;this.onCue?.({act:state.act.id,progress:state.progress});}
  this.engine.prefetchNear(state);
  if(Math.abs(this.rawProgress-this.visualProgress)>1e-7)this.queue();else this.previousTime=0;
 };
 queue=()=>{if(!this.disposed&&!this.frame&&!document.hidden)this.frame=requestAnimationFrame(this.draw);};
 layout=()=>{if(this.disposed)return;this.measure();this.engine?.resize();this.queue();};
 resize=()=>{
  if(this.disposed)return;const changed=this.viewWidth!==innerWidth||Math.abs(this.viewHeight-innerHeight)>100;
  this.viewWidth=innerWidth;this.viewHeight=innerHeight;this.measure();this.engine?.resize();
  // Native scroll anchoring owns resize. A delayed resize must never overwrite
  // a newer touch/keyboard/scrollbar position with a stale progress snapshot.
  if(changed)this.visualProgress=NaN;
  this.previousTime=0;this.queue();
 };
 restore=()=>{this.previousTime=0;this.measure();this.queue();};
 visibility=()=>{this.previousTime=0;if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;}else this.queue();};
 preference=()=>{if(this.reduced.matches||this.forced.matches)this.onFallback(this.forced.matches?'High contrast: the complete reading experience is shown.':'Reduced motion: the complete reading experience is shown.');};
 hash=()=>{if(!this.root.classList.contains('film-enhanced'))return;const id=location.hash.slice(1).replace(/^film-/,'');const act=RANGES.find(a=>a.id===id);if(act){this.measure();this.lastInputTime=0;scrollTo({top:this.top+this.distance*(act.start+(act.end-act.start)*(act.index?.52:0)),behavior:'instant'});this.queue();}};
 dispose(){if(this.disposed)return;this.disposed=true;this.abort.abort();cancelAnimationFrame(this.frame);this.observer?.disconnect();removeEventListener('scroll',this.scroll);removeEventListener('resize',this.resize);removeEventListener('pageshow',this.restore);removeEventListener('hashchange',this.hash);document.removeEventListener('visibilitychange',this.visibility);this.reduced.removeEventListener('change',this.preference);this.forced.removeEventListener('change',this.preference);if(this.engine)this.engine.dispose();else if(this.contextCreated)this.canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();this.engine=null;}
}
