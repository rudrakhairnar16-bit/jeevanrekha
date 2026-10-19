import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';
await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const report=[];
for(const entry of JSON.parse(fs.readFileSync('assets/rescue-human-manifest.json','utf8'))){
 const path=`apps/web/public/models/universal_${entry.sex}.glb`,bytes=fs.readFileSync(path),doc=await io.read(path),root=doc.getRoot();
 assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 assert.equal(bytes.length,entry.bytes);assert.ok(bytes.length<800000);
 assert.deepEqual(root.listAnimations().map(a=>a.getName()).sort(),['Crouch','Idle','Kneel','Sit','Talk','Walk']);
 const reachable=new Set(),walk=n=>{reachable.add(n);n.listChildren().forEach(walk);};root.listScenes().forEach(s=>s.listChildren().forEach(walk));
 root.listNodes().forEach(n=>assert.ok(reachable.has(n),`Orphan node: ${n.getName()}`));
 const roles=new Set();let vertices=0;
 for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){
  roles.add(p.getMaterial()?.getName());const position=p.getAttribute('POSITION');vertices+=position.getCount();
  for(const semantic of p.listSemantics())for(const v of p.getAttribute(semantic).getArray())assert.ok(Number.isFinite(v),`${semantic} must be finite`);
  for(const i of p.getIndices().getArray())assert.ok(i<position.getCount());
  const weights=p.getAttribute('WEIGHTS_0');if(weights){const a=weights.getArray(),divisor=weights.getNormalized()?(a instanceof Uint8Array?255:65535):1;for(let i=0;i<a.length;i+=4){const sum=(a[i]+a[i+1]+a[i+2]+a[i+3])/divisor;assert.ok(Math.abs(sum-1)<.025,`Invalid skin weight sum ${sum}`);}}
 }
 for(const role of ['Skin','Shirt','Pants','Shoes'])assert.ok(roles.has(role),`Missing ${role}: material dedup regression`);
 for(const animation of root.listAnimations())for(const channel of animation.listChannels())assert.ok(reachable.has(channel.getTargetNode()),'Animation targets an orphan');
 report.push({sex:entry.sex,bytes:bytes.length,vertices,materials:[...roles],animations:entry.animations,status:'PASS'});
}
fs.mkdirSync('evidence/rescue',{recursive:true});fs.writeFileSync('evidence/rescue/asset-invariants.json',JSON.stringify(report,null,2));console.log(report);
