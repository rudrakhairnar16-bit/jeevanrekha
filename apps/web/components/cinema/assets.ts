import * as T from 'three';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import type {HumanLibrary,HumanVariant} from './humans';
export type Palette='emergency'|'clinical'|'trust'|'population';
/** Shared geometric sculpt library. Production GLB replacements attach at named actor roots. */
export class AssetManager{
 low=false;
 lodMaterials=new Map<T.MeshStandardMaterial,T.MeshLambertMaterial>();
 simplifyMaterials(root:T.Object3D){root.traverse(node=>{if(!(node instanceof T.Mesh)||Array.isArray(node.material))return;const current=node.material;if(current instanceof T.MeshStandardMaterial)node.userData.fullMaterial=current;const full=node.userData.fullMaterial as T.MeshStandardMaterial|undefined;if(!full)return;if(!this.low){node.material=full;return;}let low=this.lodMaterials.get(full);if(!low){low=new T.MeshLambertMaterial({color:full.color,map:full.map,emissive:full.emissive,emissiveIntensity:full.emissiveIntensity,transparent:full.transparent,opacity:full.opacity,side:full.side,depthWrite:full.depthWrite});this.lodMaterials.set(full,low);}node.material=low;});}

 calibrations=new Map<HumanVariant,{feet:T.Vector3[];scale:number;offset:T.Vector3}>();skeletons=new Set<T.Skeleton>();
 constructor(public humans:HumanLibrary){for(const[variant,model]of Object.entries(humans)){let i=0;model.scene.traverse(o=>{if(o instanceof T.Mesh){this.geometries.set(`human/${variant}/${i++}`,o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m instanceof T.MeshStandardMaterial)this.materials.set(`source/${variant}/${m.uuid}`,m);});}if(o instanceof T.SkinnedMesh)this.skeletons.add(o.skeleton);});}}
 surface(kind:'weave'|'plaster'|'asphalt'){
  const key=`surface/${kind}`;const existing=this.surfaceMaps.get(key);if(existing)return existing;
  const size=128,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const value=kind==='weave'?128+Math.sin(x*Math.PI/2)*12+Math.cos(y*Math.PI/2)*12:110+((x*71+y*137+(x*y)%73)%61);const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;}
  const texture=new T.DataTexture(data,size,size);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(kind==='weave'?12:3,kind==='weave'?12:3);texture.needsUpdate=true;this.textures.push(texture);this.surfaceMaps.set(key,texture);return texture;
 }
 surfaceMaps=new Map<string,T.Texture>();
 textures:T.Texture[]=[];contactMaterial:T.MeshBasicMaterial|null=null;
 geometries=new Map<string,T.BufferGeometry>();materials=new Map<string,T.MeshStandardMaterial>();
 geo(key:string,create:()=>T.BufferGeometry){if(!this.geometries.has(key))this.geometries.set(key,create());return this.geometries.get(key)!;}
 material(world:Palette,color:string,metalness=.05,roughness=.72){const key=`${world}/${color}/${metalness}/${roughness}`;if(!this.materials.has(key))this.materials.set(key,new T.MeshStandardMaterial({color,metalness,roughness}));return this.materials.get(key)!;}
 box(world:Palette,w:number,h:number,d:number,color:string,r=.04){const key=`box/${w}/${h}/${d}/${r}`;const geometry=this.geo(key,()=>{
  const s=new T.Shape(),x=-w/2,y=-h/2;const radius=Math.min(r,w/3,h/3);s.moveTo(x+radius,y);s.lineTo(x+w-radius,y);s.quadraticCurveTo(x+w,y,x+w,y+radius);s.lineTo(x+w,y+h-radius);s.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);s.lineTo(x+radius,y+h);s.quadraticCurveTo(x,y+h,x,y+h-radius);s.lineTo(x,y+radius);s.quadraticCurveTo(x,y,x+radius,y);
  const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:Math.min(.018,d/5),bevelThickness:Math.min(.018,d/5),bevelSegments:2,steps:1,curveSegments:5});g.translate(0,0,-d/2);return g;
 });const mesh=new T.Mesh(geometry,this.material(world,color));mesh.castShadow=true;mesh.receiveShadow=true;return mesh;}
 ellipsoid(world:Palette,x:number,y:number,z:number,color:string){const mesh=new T.Mesh(this.geo('sphere',()=>new T.SphereGeometry(1,20,14)),this.material(world,color));mesh.scale.set(x,y,z);mesh.castShadow=true;return mesh;}
 capsule(world:Palette,r:number,length:number,color:string){const mesh=new T.Mesh(this.geo(`capsule/${r}/${length}`,()=>new T.CapsuleGeometry(r,length,5,10)),this.material(world,color));mesh.castShadow=true;return mesh;}
 line(points:T.Vector3[],world:Palette,color='#7fa89c',radius=.012){const curve=new T.CatmullRomCurve3(points);const mesh=new T.Mesh(new T.TubeGeometry(curve,32,radius,5,false),this.material(world,color,.35,.4));this.geometries.set(`line/${this.geometries.size}`,mesh.geometry);return mesh;}
 contact(){if(!this.contactMaterial){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d')!;const gradient=ctx.createRadialGradient(64,64,5,64,64,63);gradient.addColorStop(0,'rgba(0,0,0,.35)');gradient.addColorStop(.4,'rgba(0,0,0,.18)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const tex=new T.CanvasTexture(canvas);this.textures.push(tex);this.contactMaterial=new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});}const mesh=new T.Mesh(this.geo('contact-plane',()=>new T.PlaneGeometry(1.1,.8)),this.contactMaterial);mesh.rotation.x=-Math.PI/2;mesh.position.y=.015;return mesh;}
 dispose(){this.lodMaterials.forEach(m=>m.dispose());this.lodMaterials.clear();this.skeletons.forEach(s=>s.dispose());this.skeletons.clear();this.calibrations.clear();this.textures.forEach(t=>t.dispose());this.contactMaterial?.dispose();this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.geometries.clear();this.materials.clear();}
}
export type Actor={root:T.Group;body:T.Group;head:T.Group;torso:T.Group;leftArm:T.Group;rightArm:T.Group;leftLeg:T.Group;rightLeg:T.Group;pose:(distance?:number,locomotion?:number,sitting?:boolean|'crouch'|'kneel'|'talk',stanceWeight?:number,gesture?:number)=>void;hand:(side:'left'|'right')=>T.Vector3};
/** Contemporary CC0 adult rig. No elongated limbs, shrunken heads or proxy box shoes. */
export function actor(a:AssetManager,world:Palette,coat:string,skin='#b99179',medical=false,variant:HumanVariant=medical?'female':'male'):Actor{
 const root=new T.Group();root.name=medical?'human-clinician':'human-civilian';root.add(a.contact());
 const body=new T.Group(),fit=new T.Group(),model=cloneSkeleton(a.humans[variant].scene);root.add(body);body.add(fit);fit.add(model);model.name=`universal-${variant}-adult`;
 model.traverse(o=>{if(o instanceof T.SkinnedMesh)a.skeletons.add(o.skeleton);if(!(o instanceof T.Mesh))return;
  const source=Array.isArray(o.material)?o.material[0]:o.material;const colors:Record<string,string>={Skin:skin,Shirt:coat,Pants:medical?'#52636b':'#35444c',Shoes:'#202d33',Eyes:'#343c3b',Hair:'#303237'};
  const fabric=['Shirt','Pants'].includes(source.name);o.material=a.material(world,colors[source.name]||'#303237',0,fabric?.96:source.name==='Skin'?.76:.65);
  if(fabric){const mat=o.material as T.MeshStandardMaterial;mat.bumpMap=a.surface('weave');mat.bumpScale=.0025;}
  o.userData.sourceMaterial=source.name;o.castShadow=!['Eyes','Hair'].includes(source.name);o.receiveShadow=true;o.frustumCulled=!(o instanceof T.SkinnedMesh);
 });
 const idle=a.humans[variant].animations.find(c=>c.name==='Idle')!,walk=a.humans[variant].animations.find(c=>c.name==='Walk')!;
 if(!idle||!walk)throw Error('Required neutral/locomotion clips unavailable');
 const tracks=(clip:T.AnimationClip)=>clip.tracks.map(track=>{const binding=T.PropertyBinding.parseTrackName(track.name);return{node:T.PropertyBinding.findNode(model,binding.nodeName) as T.Object3D|null,property:binding.propertyName,interpolant:track.InterpolantFactoryMethodLinear(new Float32Array(track.getValueSize()))};});
 const idleTracks=tracks(idle),sitTracks=tracks(a.humans[variant].animations.find(c=>c.name==='Sit')||idle),kneelTracks=tracks(a.humans[variant].animations.find(c=>c.name==='Kneel')||idle),talkTracks=tracks(a.humans[variant].animations.find(c=>c.name==='Talk')||idle),crouchTracks=tracks(a.humans[variant].animations.find(c=>c.name==='Crouch')||idle),walkTracks=new Map(tracks(walk).map(t=>[t.node?.uuid+'/'+t.property,t]));const tempQ=new T.Quaternion(),tempV=new T.Vector3(),q=new T.Quaternion();
 const proxies=[new T.Group(),new T.Group(),new T.Group(),new T.Group()],bones=['upperarm_l','upperarm_r','thigh_l','thigh_r'].map(name=>model.getObjectByName(name)!);if(bones.some(b=>!b))throw Error('Adult rig contract mismatch');
 const headProxy=new T.Group(),torsoProxy=new T.Group(),headBone=model.getObjectByName('Head')!,torsoBone=model.getObjectByName('spine_02')!;
 const handBones=[model.getObjectByName('hand_l')!,model.getObjectByName('hand_r')!];
 const fingers:T.Object3D[]=[];model.traverse(n=>{if(/^(thumb|index|middle|ring|pinky)_0[123]_[lr]$/.test(n.name))fingers.push(n);});const fingerRest=fingers.map(n=>n.quaternion.clone());const rest:{bone:T.Object3D;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3}[]=[];model.traverse(bone=>{if(bone instanceof T.Bone)rest.push({bone,position:bone.position.clone(),quaternion:bone.quaternion.clone(),scale:bone.scale.clone()});});
 const pose=(distance=0,locomotion=0,sitting:boolean|'crouch'|'kneel'|'talk'=false,stanceWeight=1,gesture=.55)=>{
  // Every sample starts from the bind-local pose. Clips may omit channels;
  // retaining an omitted channel would make a reverse seek depend on history.
  rest.forEach(({bone,position,quaternion,scale})=>{bone.position.copy(position);bone.quaternion.copy(quaternion);bone.scale.copy(scale);});
  const time=((distance/1.12*walk.duration)%walk.duration+walk.duration)%walk.duration;
  for(const track of(sitting==='kneel'?kneelTracks:sitting==='talk'?talkTracks:sitting==='crouch'?crouchTracks:sitting?sitTracks:idleTracks)){if(!track.node)continue;const still=track.interpolant.evaluate(sitting==='talk'?Math.min(2.8,Math.max(0,gesture)):.55),moving=walkTracks.get(track.node.uuid+'/'+track.property)?.interpolant.evaluate(time),weight=Math.max(0,Math.min(1,locomotion));
   if(track.property==='quaternion'){track.node.quaternion.fromArray(still);if(moving)track.node.quaternion.slerp(tempQ.fromArray(moving),weight);}
   else if(track.property==='position'||track.property==='scale'){track.node[track.property].fromArray(still);if(moving)track.node[track.property].lerp(tempV.fromArray(moving),weight);}
  }
  if((sitting==='crouch'||sitting==='kneel')&&stanceWeight<1){const selected=sitting==='kneel'?kneelTracks:crouchTracks;for(let i=0;i<selected.length;i++){const c=selected[i],base=idleTracks.find(t=>t.node===c.node&&t.property===c.property);if(!base||!c.node)continue;const value=base.interpolant.evaluate(.55);if(c.property==='quaternion')c.node.quaternion.slerp(tempQ.fromArray(value),(1-stanceWeight)*(1-locomotion));else if(c.property==='position')c.node.position.lerp(tempV.fromArray(value),(1-stanceWeight)*(1-locomotion));}}
  fingers.forEach((bone,i)=>bone.quaternion.copy(fingerRest[i]));
  bones.forEach((bone,i)=>bone.quaternion.multiply(q.setFromEuler(proxies[i].rotation)));headBone.quaternion.multiply(q.setFromEuler(headProxy.rotation));torsoBone.quaternion.multiply(q.setFromEuler(torsoProxy.rotation));root.updateMatrixWorld(true);
 };
 pose();const cached=a.calibrations.get(variant);
 if(cached){fit.scale.setScalar(cached.scale);model.position.sub(cached.offset);}
 else{root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(model,true),center=bounds.getCenter(new T.Vector3()),offset=new T.Vector3(center.x,bounds.min.y,center.z),scale=1.82/(bounds.max.y-bounds.min.y);fit.scale.setScalar(scale);model.position.sub(offset);a.calibrations.set(variant,{feet:[],scale,offset});}
 const hand=(side:'left'|'right')=>{root.updateMatrixWorld(true);const p=handBones[side==='left'?0:1].getWorldPosition(new T.Vector3());return root.parent?root.parent.worldToLocal(p):p;};
 if(medical){const badge=a.box(world,.065,.09,.006,'#dce1d8',.006);badge.position.set(.11,1.36,.14);body.add(badge);const stripe=a.box(world,.036,.009,.003,'#477c73',.001);stripe.position.set(0,.015,.007);badge.add(stripe);root.updateMatrixWorld(true);model.getObjectByName('spine_03')!.attach(badge);}
 pose();return{root,body,leftArm:proxies[0],rightArm:proxies[1],leftLeg:proxies[2],rightLeg:proxies[3],pose,hand,head:headProxy,torso:torsoProxy};
}
export function credential(a:AssetManager,world:Palette){const root=new T.Group();root.name='illustrative-credential-no-payload';root.add(a.box(world,.40,.255,.015,'#b8c9b6',.025));const band=a.box(world,.29,.018,.004,'#5d7c6d',.004);band.position.set(-.015,.065,.013);root.add(band);for(let i=0;i<3;i++){const l=a.box(world,.15-i*.025,.009,.004,'#6a8073',.002);l.position.set(-.065,.015-i*.026,.014);root.add(l);}// QR-like printed illustration only: no encoded identifier, URL or record capability.
 let texture=a.surfaceMaps.get('credential-code');if(!texture){const size=25,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const xx=x-2,yy=y-2;let ink=xx>=0&&yy>=0&&xx<21&&yy<21&&((xx*17+yy*29+xx*yy)%7<3);for(const[fx,fy]of[[0,0],[14,0],[0,14]])if(xx>=fx-1&&xx<=fx+7&&yy>=fy-1&&yy<=fy+7){const dx=xx-fx,dy=yy-fy;ink=dx>=0&&dy>=0&&dx<7&&dy<7&&(dx===0||dy===0||dx===6||dy===6||dx>=2&&dx<=4&&dy>=2&&dy<=4);}const i=(y*size+x)*4;data[i]=ink?34:218;data[i+1]=ink?55:224;data[i+2]=ink?52:208;data[i+3]=255;}texture=new T.DataTexture(data,size,size);texture.magFilter=T.NearestFilter;texture.minFilter=T.NearestFilter;texture.needsUpdate=true;a.surfaceMaps.set('credential-code',texture);a.textures.push(texture);}const print=a.material(world,'#ffffff',0,1);print.map=texture;print.needsUpdate=true;const chip=new T.Mesh(a.geo('credential-code-plane',()=>new T.PlaneGeometry(.075,.075)),print);chip.position.set(.12,-.035,.016);root.add(chip);return root;}
export function phone(a:AssetManager,world:Palette){const root=new T.Group();root.name='illustrative-device';root.add(a.box(world,.40,.76,.045,'#283d3e',.045));const screen=a.box(world,.35,.65,.008,'#b7d0c0',.025);screen.position.z=.029;root.add(screen);const speaker=a.box(world,.08,.008,.005,'#65776d',.003);speaker.position.set(0,.31,.036);root.add(speaker);return root;}
