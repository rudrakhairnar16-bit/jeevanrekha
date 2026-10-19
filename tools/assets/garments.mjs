import {tailoredSurface} from './tailored-surface.mjs';
import {BufferGeometry,BufferAttribute,Vector3} from 'three';
import {ConvexGeometry} from 'three/addons/geometries/ConvexGeometry.js';
/** Exact rest-space garment cuts. Never classify a cuff/hem by the dominant skin bone. */
export function dress(doc,node){
 const mesh=node.getMesh(),source=mesh.listPrimitives()[0],a=Object.fromEntries(['POSITION','NORMAL','TEXCOORD_0','JOINTS_0','WEIGHTS_0'].map(k=>[k,source.getAttribute(k)])),buffer=doc.getRoot().listBuffers()[0];
 const read=(v)=>({p:Array.from(a.POSITION.getArray().slice(v*3,v*3+3)),n:Array.from(a.NORMAL.getArray().slice(v*3,v*3+3)),uv:a.TEXCOORD_0?Array.from(a.TEXCOORD_0.getArray().slice(v*2,v*2+2)):[0,0],j:Array.from(a.JOINTS_0.getArray().slice(v*4,v*4+4)),w:Array.from(a.WEIGHTS_0.getArray().slice(v*4,v*4+4))});
 const mix=(a,b,t)=>{const influences=new Map();for(let k=0;k<4;k++){influences.set(a.j[k],(influences.get(a.j[k])||0)+a.w[k]*(1-t));influences.set(b.j[k],(influences.get(b.j[k])||0)+b.w[k]*t);}const picked=[...influences].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).slice(0,4);while(picked.length<4)picked.push([0,0]);const total=picked.reduce((s,[,w])=>s+w,0)||1;return{p:a.p.map((v,k)=>v+(b.p[k]-v)*t),n:a.n.map((v,k)=>v+(b.n[k]-v)*t),uv:a.uv.map((v,k)=>v+(b.uv[k]-v)*t),j:picked.map(([j])=>j),w:picked.map(([,w])=>w/total)};};
 const split=(poly,axis,value)=>{const low=[],high=[];for(let i=0;i<poly.length;i++){const v=poly[i],next=poly[(i+1)%poly.length],d=v.p[axis]-value,e=next.p[axis]-value;(d<=0?low:high).push(v);if(d*e<0){const intersection=mix(v,next,-d/(e-d));low.push(intersection);high.push(intersection);}}return[low,high];};
 const polys={Skin:[],Shirt:[],Pants:[],Shoes:[]};
 const add=(type,p)=>{if(p.length>=3)polys[type].push(p);};const indices=source.getIndices().getArray();
 for(let i=0;i<indices.length;i+=3){const triangle=[read(indices[i]),read(indices[i+1]),read(indices[i+2])];let[shoe,upper]=split(triangle,1,.105);add('Shoes',shoe);if(upper.length<3)continue;let[pants,torso]=split(upper,1,.99);add('Pants',pants);if(torso.length<3)continue;let[shirt,head]=split(torso,1,1.575);add('Skin',head);let[left,remainder]=split(shirt,0,-.44);add('Skin',left);let[middle,right]=split(remainder,0,.44);add('Skin',right);add('Shirt',middle);}
 mesh.removePrimitive(source);
 const bodySource=Array.from({length:a.POSITION.getCount()},(_,i)=>read(i));
 for(const[type,polygons]of Object.entries(polys)){
  const vertices=[],list=[],unique=new Map();
  const index=(v)=>{const key=[...v.p,...v.uv,...v.j,...v.w].map(x=>Math.round(x*1e6)).join(',');if(unique.has(key))return unique.get(key);const i=vertices.length;vertices.push(v);unique.set(key,i);return i;};
  for(const polygon of polygons)for(let i=1;i<polygon.length-1;i++)list.push(index(polygon[0]),index(polygon[i]),index(polygon[i+1]));
  if(type==='Shoes'){
   // A convex, closed toe box—not exposed anatomical toes painted black.
   const old=vertices.slice();vertices.length=0;list.length=0;unique.clear();for(const sign of[-1,1]){const half=old.filter(v=>v.p[0]*sign>0),hull=new ConvexGeometry(half.map(v=>new Vector3(...v.p)));const points=hull.getAttribute('position');for(let i=0;i<points.count;i++){const p=[points.getX(i),points.getY(i),points.getZ(i)],v=half.reduce((best,v)=>v.p.reduce((s,x,k)=>s+(x-p[k])**2,0)<best.distance?{v,distance:v.p.reduce((s,x,k)=>s+(x-p[k])**2,0)}:best,{v:half[0],distance:Infinity}).v;list.push(index({...v,p}));}hull.dispose();}
  }
  if(type==='Shirt'||type==='Pants'){const tailored=tailoredSurface(type,bodySource,node.getSkin().listJoints().map(j=>j.getName()));vertices.splice(0,vertices.length,...tailored.vertices);list.splice(0,list.length,...tailored.indices);}
  const positions=new Float32Array(vertices.flatMap(v=>v.p));
  if(type==='Shoes')for(let v=0;v<vertices.length;v++){positions[v*3]*=1.03;positions[v*3+1]=Math.max(.008,positions[v*3+1]+.006);positions[v*3+2]*=1.06;}
  const geometry=new BufferGeometry();geometry.setAttribute('position',new BufferAttribute(positions,3));geometry.setIndex(list);geometry.computeVertexNormals();
  const accessor=(name,array,size,type)=>doc.createAccessor(name).setType(type).setArray(array).setBuffer(buffer);
  const p=doc.createPrimitive().setIndices(accessor(type+'/indices',new Uint32Array(list),1,'SCALAR')).setAttribute('POSITION',accessor(type+'/position',positions,3,'VEC3')).setAttribute('NORMAL',accessor(type+'/normal',new Float32Array(geometry.getAttribute('normal').array),3,'VEC3')).setAttribute('TEXCOORD_0',accessor(type+'/uv',new Float32Array(vertices.flatMap(v=>v.uv)),2,'VEC2')).setAttribute('JOINTS_0',accessor(type+'/joints',new Uint16Array(vertices.flatMap(v=>v.j)),4,'VEC4')).setAttribute('WEIGHTS_0',accessor(type+'/weights',new Float32Array(vertices.flatMap(v=>v.w)),4,'VEC4'));
  p.setMaterial(doc.createMaterial(type).setRoughnessFactor(type==='Skin'?.76:type==='Shirt'?.93:type==='Pants'?.95:.55));mesh.addPrimitive(p);geometry.dispose();
 }
}
