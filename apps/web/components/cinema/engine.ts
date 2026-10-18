import * as T from 'three';
import {GpuTimer} from './gpu-timer';
import {AssetManager} from './assets';
import type {HumanLibrary} from './humans';
export {loadHumanLibrary,disposeHumanLibrary} from './humans';
import {BUILDERS,type World} from './worlds';
import {RANGES,resolveNarrative,smooth,type NarrativeState,type WorldId} from './narrative';
import {sampleCamera} from './camera-rig';
export type Quality='high'|'medium'|'low';
export type FrameReport={progress:number;rawProgress?:number;visualProgress?:number;act:string;local:number;camera:number[];target:number[];quality:Quality;worlds:string[];calls:number;triangles:number;geometries:number;textures:number;renderMs:number;gpuMs:number|null;gpuTimerSupported:boolean;gpuSamples:number;assets:string[];anchors:Record<string,{x:number;y:number}>;fps?:number;dpr?:number;fov?:number};
const ORIGIN:Record<WorldId,number>={emergency:0,clinical:12,trust:24,population:36};
export function selectQuality(canvas:HTMLCanvasElement,mobile:boolean):Quality{
 const gl=canvas.getContext('webgl2',{antialias:!mobile,alpha:false,powerPreference:'low-power'});if(!gl)throw Error('WebGL 2 unavailable');
 const memory=(navigator as Navigator&{deviceMemory?:number}).deviceMemory||4;
 const ext=gl.getExtension('WEBGL_debug_renderer_info');const software=ext&&/swiftshader|llvmpipe|software/i.test(String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)));
 if(software||mobile||memory<4||navigator.hardwareConcurrency<=4)return'low';
 return gl.getParameter(gl.MAX_TEXTURE_SIZE)>=8192&&memory>=8?'high':'medium';
}
/** A single shared film stage, not a camera flight between four separated dioramas. */
export class CinemaEngine{
 renderer:T.WebGLRenderer;scene=new T.Scene();camera=new T.PerspectiveCamera(34,1,.08,150);assets:AssetManager;worlds=new Map<WorldId,World>();
 quality:Quality;light:T.DirectionalLight;keyLight:T.HemisphereLight;rim:T.DirectionalLight;disposed=false;frames=0;slowFrames=0;lastProgress=0;timer:GpuTimer;
 adaptive=true;renderScale=1;intervals:number[]=[];fps=0;idleHandle:ReturnType<typeof setTimeout>|null=null;pendingWorld:WorldId|null=null;
 wipe:T.Mesh<T.PlaneGeometry,T.MeshBasicMaterial>;guide:T.Mesh<T.PlaneGeometry,T.MeshBasicMaterial>;
 private target=new T.Vector3();private cold=new T.Color('#0d202a');private ivory=new T.Color('#dedaca');private background=new T.Color();private keyCold=new T.Color('#c8dce8');private keyWarm=new T.Color('#fff0d4');
 constructor(public canvas:HTMLCanvasElement,requested:Quality|'auto',public onLoss:()=>void,humans:HumanLibrary){
  this.assets=new AssetManager(humans);this.quality=requested==='auto'?selectQuality(canvas,innerWidth<760):requested;this.adaptive=requested==='auto';
  const context=canvas.getContext('webgl2')!;this.timer=new GpuTimer(context);
  this.renderer=new T.WebGLRenderer({canvas,context,alpha:false,powerPreference:'low-power'});this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
  this.renderer.shadowMap.enabled=this.quality!=='low';this.renderer.shadowMap.type=T.PCFShadowMap;
  this.keyLight=new T.HemisphereLight('#bacbce','#14232b',.55);this.scene.add(this.keyLight);
  this.light=new T.DirectionalLight('#c8dce8',3.1);this.light.position.set(-3.5,7,4);this.light.castShadow=true;this.light.shadow.mapSize.set(this.quality==='high'?1536:1024,this.quality==='high'?1536:1024);this.light.shadow.camera.left=-8;this.light.shadow.camera.right=8;this.light.shadow.camera.top=8;this.light.shadow.camera.bottom=-8;this.light.shadow.normalBias=.02;this.light.shadow.bias=-.00015;this.scene.add(this.light,this.light.target);
  this.rim=new T.DirectionalLight('#89aaa8',1.15);this.rim.position.set(4,3,-4);this.scene.add(this.rim,this.rim.target);
  this.scene.background=this.background.copy(this.cold);this.scene.fog=new T.Fog('#0d202a',15,70);
  this.wipe=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:'#dcd7c8',depthTest:false,depthWrite:false,toneMapped:false}));this.wipe.renderOrder=1000;this.camera.add(this.wipe);
  this.guide=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:'#77978e',depthTest:false,depthWrite:false,toneMapped:false}));this.guide.renderOrder=1001;this.camera.add(this.guide);this.scene.add(this.camera);
  this.canvas.addEventListener('webglcontextlost',this.contextLost);this.resize();
 }
 contextLost=(event:Event)=>{event.preventDefault();if(!this.disposed)this.onLoss();};
 configureQuality(requested:Quality|'auto'){
  if(this.disposed)return;this.adaptive=requested==='auto';this.quality=this.adaptive?selectQuality(this.canvas,innerWidth<760):requested as Quality;this.renderScale=1;
  this.renderer.shadowMap.enabled=this.quality!=='low';this.light.shadow.map?.dispose();this.light.shadow.map=null;const size=this.quality==='high'?1536:1024;this.light.shadow.mapSize.set(size,size);this.assets.materials.forEach(m=>m.needsUpdate=true);this.intervals=[];this.slowFrames=0;this.resize();
 }
 resize(){if(this.disposed)return;const rect=this.canvas.getBoundingClientRect(),cap=this.quality==='high'?1.5:this.quality==='medium'?1.15:1;this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,cap)*this.renderScale);this.renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);this.camera.aspect=rect.width/Math.max(1,rect.height);this.camera.updateProjectionMatrix();}
 noteFrameInterval(ms:number){
  if(ms<4||ms>1500)return;this.intervals.push(ms);if(this.intervals.length>20)this.intervals.shift();this.fps=1000/(this.intervals.reduce((a,b)=>a+b,0)/this.intervals.length);
  if(!this.adaptive||this.intervals.length<6)return;
  if(this.fps<26)this.slowFrames++;else this.slowFrames=Math.max(0,this.slowFrames-1);
  if(this.slowFrames>=4){if(this.renderScale>.72)this.renderScale=Math.max(.72,this.renderScale-.14);else if(this.quality!=='low'){this.quality=this.quality==='high'?'medium':'low';this.renderer.shadowMap.enabled=this.quality!=='low';}this.slowFrames=0;this.intervals=[];this.resize();}
 }
 load(world:WorldId){if(!this.worlds.has(world)){const instance=BUILDERS[world](this.assets,this.quality==='low');instance.root.position.x=0;instance.root.visible=false;this.worlds.set(world,instance);this.scene.add(instance.root);}return this.worlds.get(world)!;}
 prefetchNear(s:NarrativeState){
  const next=RANGES.slice(s.index+1).find(a=>a.world!==s.act.world)?.world;if(!next||this.worlds.has(next)||this.pendingWorld||this.disposed)return;
  this.pendingWorld=next;this.idleHandle=setTimeout(()=>{this.idleHandle=null;if(this.disposed)return;const world=this.load(next);world.update(resolveNarrative(RANGES.find(a=>a.world===next)!.start+.0001));
   // compileAsync queues shader readiness without painting the future world or blocking native scroll.
   const visible=world.root.visible;world.root.visible=true;const pending=this.renderer.getContext().getExtension('KHR_parallel_shader_compile')?this.renderer.compileAsync(world.root,this.camera,this.scene):Promise.resolve(this.renderer.compile(world.root,this.camera,this.scene));world.root.visible=visible;pending.catch(()=>{}).finally(()=>{this.pendingWorld=null;});
  },s.local>.55?60:220);
 }
 update(progress:number):FrameReport{
  const begin=performance.now(),s=resolveNarrative(progress);this.lastProgress=progress;this.assets.low=this.quality==='low';const current=this.load(s.act.world),cross=s.previousWorld!==s.act.world,transition=s.local/.32;
  const previous=cross?this.load(s.previousWorld):current,oldVisible=cross&&transition<.5&&s.act.id!=='population';
  for(const[id,world]of this.worlds){world.root.visible=id===s.act.world&&!oldVisible||id===s.previousWorld&&oldVisible;world.root.scale.setScalar(1);world.root.position.y=0;if(world.root.visible)world.update(id===s.act.world?s:resolveNarrative(s.act.start-1e-7));}
  if(oldVisible)previous.depart?.(Math.min(1,transition*2),s.act.world);
  const priorWarm=s.index?RANGES[s.index-1].warm:s.act.warm,warmth=(priorWarm?1:0)+((s.act.warm?1:0)-(priorWarm?1:0))*smooth(s.local/.32);
  this.background.copy(this.cold).lerp(this.ivory,warmth);(this.scene.fog as T.Fog).color.copy(this.background);this.keyLight.intensity=.95+warmth*.12;this.light.color.copy(this.keyCold).lerp(this.keyWarm,warmth);this.light.intensity=3.1+warmth*.25;this.rim.intensity=1.1-warmth*.4;
  const rig=sampleCamera(progress,RANGES,innerWidth<=760);this.camera.position.fromArray(rig.position);this.target.fromArray(rig.target);this.camera.lookAt(this.target);this.camera.fov=rig.fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
  const focusX=this.target.x,focusZ=this.target.z;this.light.position.set(focusX-3.5,7,focusZ+4);this.light.target.position.set(focusX,0,focusZ);this.light.target.updateMatrixWorld();this.rim.position.set(focusX+4,3,focusZ-4);this.rim.target.position.set(focusX,1,focusZ);this.rim.target.updateMatrixWorld();
  const occlude=cross&&transition>0&&transition<1;
  this.wipe.visible=this.guide.visible=occlude;
  if(occlude){const height=2*Math.tan(T.MathUtils.degToRad(this.camera.fov/2))*.5,width=height*this.camera.aspect;this.wipe.material.color.copy(s.act.warm?this.ivory:this.cold);this.wipe.scale.set(width*1.45,height*1.5,1);this.wipe.position.set((smooth(transition)*3.2-1.6)*width,0,-.5);this.guide.scale.set(width*.003,height*1.5,1);this.guide.position.set(this.wipe.position.x+width*.725,0,-.499);}
  for(const world of this.worlds.values())if(world.root.visible)this.assets.simplifyMaterials(world.root);
  this.timer.begin();this.renderer.render(this.scene,this.camera);this.timer.end();const renderMs=performance.now()-begin;this.frames++;
  const anchors:FrameReport['anchors']={};if(current.root.visible&&!occlude&&s.local>.32&&['distributed-records','sealed-records','aggregation','transparency'].includes(s.act.id))for(const[label,v]of Object.entries(current.anchors)){if(s.act.world==='trust'&&(s.act.id==='sealed-records')!==['Episode','Prescription','Related test','Revealing metadata'].includes(label))continue;if(s.act.id==='sealed-records'&&s.local>.53)continue;if(s.act.world==='population'&&((s.act.id==='aggregation')!==['Aggregator A','Aggregator B','Released statistic'].includes(label)))continue;if(label==='Illustrative mismatch'&&s.local<.72)continue;const p=v.clone();p.x-=ORIGIN[s.act.world];p.applyMatrix4(current.root.matrixWorld).project(this.camera);if(p.z>1||p.z< -1)continue;anchors[label]={x:(p.x*.5+.5)*100,y:(-.5*p.y+.5)*100};}
  const info=this.renderer.info;return{progress,act:s.act.id,local:s.local,camera:this.camera.position.toArray(),target:this.target.toArray(),quality:this.quality,worlds:[...this.worlds.keys()],calls:info.render.calls,triangles:info.render.triangles,geometries:info.memory.geometries,textures:info.memory.textures,renderMs,gpuMs:this.timer.lastMs,gpuTimerSupported:this.timer.supported,gpuSamples:this.timer.samples,assets:process.env.NODE_ENV==='development'?[...this.assets.geometries.keys()]:[],anchors,fps:this.fps||undefined,dpr:this.renderer.getPixelRatio(),fov:this.camera.fov};
 }
 setConsent(allowed:boolean,count:number){this.load('clinical').setConsent?.(allowed,count);}
 dispose(){if(this.disposed)return;this.disposed=true;if(this.idleHandle)clearTimeout(this.idleHandle);this.canvas.removeEventListener('webglcontextlost',this.contextLost);this.timer.dispose();this.wipe.geometry.dispose();this.wipe.material.dispose();this.guide.geometry.dispose();this.guide.material.dispose();this.scene.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});this.light.shadow.map?.dispose();this.assets.dispose();this.renderer.renderLists.dispose();this.renderer.dispose();this.renderer.forceContextLoss();this.scene.clear();this.worlds.clear();}
}
