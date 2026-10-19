import fs from 'node:fs';
import {dress} from './garments.mjs';
import {createHash} from 'node:crypto';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {mergeDocuments,prune,dedup,resample,meshopt,unpartition,simplify} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder,MeshoptSimplifier} from 'meshoptimizer';
import {Quaternion,BufferGeometry,BufferAttribute} from 'three';
await MeshoptEncoder.ready;await MeshoptDecoder.ready;await MeshoptSimplifier.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const dir='assets/source/universal',report=[];
for(const sex of ['male','female']){
 const original=`${dir}/Superhero_${sex==='male'?'Male':'Female'}_FullBody.gltf`,doc=await io.read(original),root=doc.getRoot(),scene=root.listScenes()[0],buffer=root.listBuffers()[0],baseChildren=new Set(scene.listChildren()),baseNodes=new Map(root.listNodes().map(n=>[n.getName(),n])),skin=root.listSkins()[0];
 for(const node of root.listNodes())if(node.getMesh()&&node.getName().toLowerCase().includes('superhero'))dress(doc,node);
 const hairDoc=await io.read(`${dir}/${sex==='male'?'Hair_SimpleParted':'Hair_Buns'}.gltf`),hairMap=mergeDocuments(doc,hairDoc);
 for(const n of hairDoc.getRoot().listNodes())if(n.getMesh()){
  const target=hairMap.get(n),sourceSkin=n.getSkin();if(sourceSkin){const order=sourceSkin.listJoints().map(j=>skin.listJoints().findIndex(b=>b.getName()===j.getName()));for(const p of target.getMesh().listPrimitives()){const attr=p.getAttribute('JOINTS_0');attr.setArray(new Uint16Array([...attr.getArray()].map(i=>order[i])));}target.setSkin(skin);}
  target.setMatrix(n.getWorldMatrix());scene.addChild(target);baseChildren.add(target);target.setName('Hair');
 }
 const animDoc=await io.read(`${dir}/UAL1_Standard.glb`),animMap=mergeDocuments(doc,animDoc);
 for(const clip of animDoc.getRoot().listAnimations()){
  const target=animMap.get(clip);if(!['Idle_Loop','Walk_Loop','Sitting_Idle_Loop','Crouch_Idle_Loop','Fixing_Kneeling','Idle_Talking_Loop'].includes(clip.getName())){target.listChannels().forEach(c=>c.dispose());target.listSamplers().forEach(s=>s.dispose());target.dispose();continue;}
  target.setName(clip.getName()==='Idle_Loop'?'Idle':clip.getName()==='Walk_Loop'?'Walk':clip.getName()==='Sitting_Idle_Loop'?'Sit':clip.getName()==='Fixing_Kneeling'?'Kneel':clip.getName()==='Idle_Talking_Loop'?'Talk':'Crouch');
  for(const channel of target.listChannels()){
   const source=channel.getTargetNode(),node=baseNodes.get(source.getName()),path=channel.getTargetPath();
   if(!node||path==='scale'||path==='translation'&&!['root','pelvis'].includes(source.getName())){channel.dispose();continue;}
   const sampler=channel.getSampler(),values=new Float32Array(sampler.getOutput().getArray());
   if(path==='rotation'){const correction=new Quaternion().fromArray(node.getRotation()).multiply(new Quaternion().fromArray(source.getRotation()).invert()),q=new Quaternion();for(let k=0;k<values.length;k+=4)q.fromArray(values,k).premultiply(correction).normalize().toArray(values,k);}
   if(path==='translation'){const a=node.getTranslation(),b=source.getTranslation();for(let k=0;k<values.length;k++)values[k]+=a[k%3]-b[k%3];}
   sampler.setOutput(doc.createAccessor().setType(path==='rotation'?'VEC4':'VEC3').setArray(values).setBuffer(buffer));channel.setTargetNode(node);
  }
 }
 // Intentional illustrated surfaces: no huge source skin/normal textures, no remotely fetched images.
 for(const material of root.listMaterials()){
  const name=material.getName();if(!['Skin','Shirt','Pants','Shoes'].includes(name))material.setName(name.includes('Eye')?'Eyes':'Hair');
  material.setBaseColorTexture(null).setNormalTexture(null).setMetallicRoughnessTexture(null).setEmissiveTexture(null).setOcclusionTexture(null).setMetallicFactor(0).setDoubleSided(false);
 }
 for(const node of [...scene.listChildren()])if(!baseChildren.has(node))scene.removeChild(node);
 for(const s of [...root.listScenes()])if(s!==scene)s.dispose();
 const reachable=new Set();const visit=node=>{reachable.add(node);node.listChildren().forEach(visit);};scene.listChildren().forEach(visit);for(const node of [...root.listNodes()])if(!reachable.has(node))node.dispose();
 await doc.transform(prune(),dedup(),resample(),unpartition(),simplify({simplifier:MeshoptSimplifier,ratio:.4,error:.002}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 const target=`apps/web/public/models/universal_${sex}.glb`;await io.write(target,doc);
 report.push({sex,bytes:fs.statSync(target).size,sha256:createHash('sha256').update(fs.readFileSync(target)).digest('hex'),animations:root.listAnimations().map(a=>a.getName()),license:'CC0-1.0',source:'Quaternius Universal Base Characters Standard + Universal Animation Library Standard',modifications:'Custom continuous implicit-surface shirt/trousers, authored shirt bone weights, exact exposed-skin cuts, convex footwear, local-rest quaternion retargeting, hair remapped onto retained bind skeleton. All unrelated animation clips removed.'});
}
fs.writeFileSync('assets/rescue-human-manifest.json',JSON.stringify(report,null,2));console.log(report);
