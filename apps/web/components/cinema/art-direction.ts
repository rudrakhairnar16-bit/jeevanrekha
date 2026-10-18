import * as T from 'three';
import {AssetManager,type Palette} from './assets';
const put=(g:T.Object3D,m:T.Object3D,x=0,y=0,z=0)=>{m.position.set(x,y,z);g.add(m);return m;};
/** Architectural scale models: glazing, mullions, canopy and a recessed entrance;
 * not a medical insignia or a real provider. Geometry and materials are shared. */
export function facility(a:AssetManager,world:Palette,w:number,h:number,d:number,color:string){
 const g=new T.Group();g.name='fictional-facility-architecture';
 put(g,a.box(world,w,h,d,color,.025),0,h/2,0);
 put(g,a.box(world,w*.88,h*.68,.014,world==='emergency'?'#213b43':'#344f54',.004),0,h*.57,d/2+.015);
 const members:{x:number;y:number;w:number;h:number}[]=[];
 for(let k=1;k<5;k++)members.push({x:w*(k/5-.5)*.88,y:h*.57,w:w*.014,h:h*.70});
 for(let k=0;k<4;k++)members.push({x:0,y:h*(.24+k*.22),w:w*.91,h:h*.018});
 const beam=a.box(world,1,1,.03,color,.002),frames=new T.InstancedMesh(beam.geometry,beam.material,members.length),matrix=new T.Matrix4();members.forEach((q,i)=>{matrix.compose(new T.Vector3(q.x,q.y,d/2+.027),new T.Quaternion(),new T.Vector3(q.w,q.h,1));frames.setMatrixAt(i,matrix);});g.add(frames);
 put(g,a.box(world,w*.19,h*.21,.018,'#273e43',.003),-w*.23,h*.105,d/2+.025);
 put(g,a.box(world,w*.39,.027,d*.28,'#9cae9e',.007),-w*.23,h*.235,d/2+d*.08);
 put(g,a.box(world,w+.045,.045,d+.045,world==='emergency'?'#6d807a':'#bdc5b7',.01),0,h+.015,0);
 return g;
}
/** Quiet physical support makes the information legible as an installation,
 * rather than a collection of weightless cards in black space. */
export function plinth(a:AssetManager,world:Palette,w:number,d:number,color='#233b43'){
 const g=new T.Group();g.name='architectural-information-surface';
 put(g,a.box(world,w,.17,d,color,.06),0,.09,0);
 put(g,a.box(world,w*.93,.035,d*.93,'#657e75',.025),0,.19,0);
 for(const x of[-w*.42,w*.42])for(const z of[-d*.38,d*.38])put(g,a.box(world,.055,.09,.055,'#253d42',.008),x,-.025,z);
 const shadow=a.contact();shadow.scale.set(w*.9,d*.9,1);g.add(shadow);return g;
}
export function gallery(a:AssetManager,world:Palette){
 const g=new T.Group();g.name='continuous-quiet-architecture';
 put(g,a.box(world,24,3.8,.14,'#253a43',.035),5,1.8,-4.8);
 for(let i=0;i<13;i++)put(g,a.box(world,.055,3.5,.09,i%4===0?'#71847c':'#3c5358',.005),-5+i*1.65,1.75,-4.69);
 put(g,a.box(world,24,.05,.24,'#6c8077',.008),5,.18,-4.65);
 return g;
}
export function daylight(a:AssetManager){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d')!;
 const sky=ctx.createLinearGradient(0,0,0,128);sky.addColorStop(0,'#e8eadf');sky.addColorStop(.65,'#bfd0c6');sky.addColorStop(1,'#a3b9ac');ctx.fillStyle=sky;ctx.fillRect(0,0,128,128);
 ctx.fillStyle='#91aa9c';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(i*23-3,130,17+(i%3)*3,32+(i%4)*7,0,0,Math.PI*2);ctx.fill();}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;a.textures.push(texture);
 const material=a.material('clinical','#ffffff',0,.95);material.map=texture;material.emissive.set('#acbcad');material.emissiveIntensity=.16;material.needsUpdate=true;return material;
}
