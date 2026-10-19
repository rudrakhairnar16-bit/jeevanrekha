import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import {MeshBasicMaterial} from 'three';
/** Smooth authored clothing volume, weighted to the licensed rig; not an anatomical body repaint. */
export function tailoredSurface(type,source,bones){
 const res=46,mc=new MarchingCubes(res,new MeshBasicMaterial(),false,false,25000);mc.isolation=0;
 const center=type==='Shirt'?[0,1.285,-.025]:[0,.565,0],scale=type==='Shirt'?[.51,.32,.245]:[.31,.49,.22];
 const smoothMax=(a,b,k=.13)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.max(a,b)+h*h*k*.25;};
 for(let z=0;z<res;z++)for(let y=0;y<res;y++)for(let x=0;x<res;x++){
  const p=[(x/res*2-1)*scale[0]+center[0],(y/res*2-1)*scale[1]+center[1],(z/res*2-1)*scale[2]+center[2]];let f;
  if(type==='Shirt'){
   const radii=p[1]<1.51?[.20+Math.min(.47,p[1]-.99)*.075,.135]:[Math.max(.085,.235-(p[1]-1.51)*2.14),Math.max(.078,.135-(p[1]-1.51)*.8)];
   const torso=Math.min(1-(p[0]/radii[0])**2-((p[2]+.035)/radii[1])**2,(p[1]-.985)*30,(1.58-p[1])*30);
   const sleeve=Math.min(1-((p[1]-1.455)/.082)**2-((p[2]+.065)/.102)**2,(Math.abs(p[0])-.20)*30,(.46-Math.abs(p[0]))*30);f=smoothMax(torso,sleeve,.45);
  }else{
   const q=Math.min(1,Math.max(0,(p[1]-.1)/.8)),rx=.070+.038*q,rz=.088+.04*q;
   const left=1-((p[0]-.12)/rx)**2-(p[2]/rz)**2,right=1-((p[0]+.12)/rx)**2-(p[2]/rz)**2;
   const hip=1-(p[0]/.235)**2-((p[1]-.91)/.17)**2-(p[2]/.152)**2;
   f=Math.min(smoothMax(smoothMax(left,right,.08),hip,.12),(p[1]-.101)*35,(1.005-p[1])*35);
  }
  mc.field[x+y*res+z*res*res]=f;
 }
 mc.update();const position=mc.geometry.getAttribute('position'),count=mc.geometry.drawRange.count,vertices=[],indices=[],lookup=new Map();
 for(let i=0;i<count;i++){
  const p=[position.getX(i)*scale[0]+center[0],position.getY(i)*scale[1]+center[1],position.getZ(i)*scale[2]+center[2]],key=p.map(v=>Math.round(v*1e5)).join('/');
  if(lookup.has(key)){indices.push(lookup.get(key));continue;}
  const close=[];for(let n=0;n<source.length;n++){const v=source[n],d=v.p.reduce((s,x,k)=>s+(x-p[k])**2,0);if(close.length<3||d<close[close.length-1].d){close.push({v,d});close.sort((a,b)=>a.d-b.d);if(close.length>3)close.pop();}}
  const weights=new Map();for(const{v,d}of close)for(let k=0;k<4;k++)weights.set(v.j[k],(weights.get(v.j[k])||0)+v.w[k]/Math.max(.00001,d));
  if(type==='Shirt'){weights.clear();const stops=[[.985,'pelvis'],[1.1,'spine_01'],[1.23,'spine_02'],[1.38,'spine_03'],[1.50,'spine_03'],[1.58,'neck_01']];let hi=stops.findIndex(([y])=>y>=p[1]);if(hi<1)hi=1;const lo=hi-1,t=Math.min(1,Math.max(0,(p[1]-stops[lo][0])/(stops[hi][0]-stops[lo][0])));const ease=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t);};const arm=ease((Math.abs(p[0])-.14)/.23)*ease((p[1]-1.25)/.12);for(const[n,w]of [[stops[lo][1],(1-t)*(1-arm)],[stops[hi][1],t*(1-arm)],[p[0]>0?'upperarm_l':'upperarm_r',arm]]){const joint=bones.indexOf(n);if(joint<0)throw Error('Missing tailoring bone '+n);weights.set(joint,(weights.get(joint)||0)+w);}}const chosen=[...weights].sort((a,b)=>b[1]-a[1]).slice(0,4);while(chosen.length<4)chosen.push([0,0]);const total=chosen.reduce((s,[,w])=>s+w,0)||1;
  lookup.set(key,vertices.length);indices.push(vertices.length);vertices.push({p,n:[0,0,0],uv:[p[0]*3,p[1]*3],j:chosen.map(([j])=>j),w:chosen.map(([,w])=>w/total)});
 }
 mc.geometry.dispose();mc.material.dispose();return{vertices,indices};
}
