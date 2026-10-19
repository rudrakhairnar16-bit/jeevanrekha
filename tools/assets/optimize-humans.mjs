import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,resample,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const sha256=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
await MeshoptEncoder.ready;await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const report=[];
for(const name of ['Casual_Male','Casual_Female']){
 const source=`assets/source/${name}.glb`,target=`apps/web/public/models/${name.toLowerCase()}.glb`;
 const doc=await io.read(source);
 for(const clip of doc.getRoot().listAnimations())if(!['Idle','Walk'].includes(clip.getName())){clip.listChannels().forEach(c=>c.dispose());clip.listSamplers().forEach(s=>s.dispose());clip.dispose();}
 await doc.transform(prune(),dedup(),resample(),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 await io.write(target,doc);
 report.push({name,sourceBytes:fs.statSync(source).size,optimizedBytes:fs.statSync(target).size,animations:doc.getRoot().listAnimations().map(a=>a.getName()),license:'CC0-1.0',creator:'Quaternius',sourceSha256:sha256(source),runtimeSha256:sha256(target)});
}
fs.writeFileSync('assets/human-optimization.json',JSON.stringify(report,null,2));console.log(report);
