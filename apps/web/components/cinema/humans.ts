import * as T from 'three';
import {GLTFLoader,type GLTF} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
export type HumanVariant='male'|'female';
export type HumanLibrary=Record<HumanVariant,GLTF>;
export const HUMAN_ASSETS=[{variant:'male' as const,url:'/models/universal_male.glb'},{variant:'female' as const,url:'/models/universal_female.glb'}];
/** Locally served CC0 meshes; compressed offline, no CDN or autonomous motion. */
export async function loadHumanLibrary(signal:AbortSignal):Promise<HumanLibrary>{
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 const results=await Promise.allSettled(HUMAN_ASSETS.map(async asset=>{
  const response=await fetch(asset.url,{signal});if(!response.ok)throw Error(`Character asset unavailable (${response.status})`);
  const bytes=await response.arrayBuffer();return loader.parseAsync(bytes,'/models/');
 }));
 const successes=results.filter((r):r is PromiseFulfilledResult<GLTF>=>r.status==='fulfilled').map(r=>r.value);
 if(signal.aborted||successes.length!==HUMAN_ASSETS.length){successes.forEach(disposeHumanModel);throw Error('Character asset loading interrupted');}
 return {male:successes[0],female:successes[1]};
}
export function disposeHumanModel(model:GLTF){
 const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),skeletons=new Set<T.Skeleton>();
 model.scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}if(o instanceof T.SkinnedMesh)skeletons.add(o.skeleton);});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());skeletons.forEach(s=>s.dispose());
}
export function disposeHumanLibrary(library:HumanLibrary){Object.values(library).forEach(disposeHumanModel);}
