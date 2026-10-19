import type {Vec3} from './narrative';
/** Authored shared-stage optics. Positions are never accumulated from prior frames. */
type Shot={position:Vec3;target:Vec3;fov:number};
type Range={index:number;start:number;end:number};
const shot=(position:Vec3,target:Vec3,fov=34):Shot=>({position,target,fov});
const OUT:Shot[]=[
 shot([2.65,1.72,4.25],[-.45,1.46,0],31),
 shot([4.6,2.05,6.4],[-.25,.72,.1],35),
 shot([3.3,1.85,4.9],[-.5,.55,.2],35),
 shot([3.3,1.7,4.8],[-.35,1,.1]),
 shot([6.3,1.7,4.1],[3.35,1.2,-.1],32),
 shot([3.8,1.85,5.4],[-.65,1,0]),
 shot([2.9,1.65,4.15],[-.65,1.05,0],33),
 shot([5.2,5.3,8.7],[-.65,.55,0],36),
 shot([2.8,2.15,4.4],[-.55,.55,.25],34),
 shot([3.1,1.75,4.7],[-.6,1,.1],35),
 shot([2.6,1.8,4.4],[-.5,1,.15],34),
 shot([2,26,14],[-.8,0,0],35),
 shot([5.4,5.2,8.8],[-.7,.65,.2],36),
 shot([2.9,2.2,6.1],[-.55,.9,.1],35),
 shot([3.1,1.75,4.9],[-.6,1,.1],33),
 shot([3.8,2.05,7],[-.75,.9,.1],35),
];
const MID:Shot[]=[
 shot([3.0,1.75,4.75],[-.5,1.42,0],32),
 shot([4.2,1.95,5.8],[-.35,.78,.05],35),
 shot([2.6,1.5,4.0],[-.4,.5,.2],35),
 shot([3.8,1.8,5.1],[-.45,.95,.1]),
 shot([6.7,1.8,4.6],[3.2,1.2,-.1],32),
 shot([4.4,1.95,6.2],[-.8,1,0]),
 shot([3.3,1.8,4.6],[-.65,1.05,0],33),
 shot([4.4,3.7,6.7],[-.5,.65,0],35),
 shot([3.2,2.5,5.1],[-.5,.6,.3]),
 shot([3.4,1.85,5.3],[-.5,1,.1]),
 shot([3,2,5],[-.4,1,.1]),
 shot([3.6,7,10],[-.25,.2,0],36),
 shot([6,6.1,10.1],[-.55,.75,.2],36),
 shot([3.8,2.7,7.4],[-.6,.9,.1],35),
 shot([3.9,1.9,5.8],[-.6,1,.1],33),
 shot([3.5,2,6.2],[-.6,.95,0],35),
];
// Portrait is an independently framed shot list. Subjects occupy the upper field;
// the lower field is reserved for native, sharp, scrollable semantic controls.
const PORTRAIT:Shot[]=[
 shot([2.1,1.9,6.5],[.25,.78,.1],41),shot([3.4,5.0,8.1],[.4,-.4,0],42),
 shot([3.7,5.2,8.3],[.4,-.5,0],42),shot([3.8,4.7,8.5],[.4,-.3,0],42),
 shot([4.8,1.9,3.8],[4,.85,-.1],40),shot([2.2,2.5,7.6],[0,.35,.3],42),
 shot([2,2.3,7.2],[0,.35,.3],42),shot([2,9,11],[0,.2,1.8],42),
 shot([1.6,3.3,6.5],[0,0,1.2],42),shot([1.8,2.6,9.2],[0,.2,.6],42),
 shot([2.4,3.1,9.4],[0,.1,.8],42),shot([0,34,18],[0,0,6],44),
 shot([1.5,7,10],[0,.2,.4],43),shot([1,4.3,7.5],[0,.4,0],42),
 shot([2,2.3,7.2],[0,.35,.3],42),shot([2.4,2.5,8],[0,.4,.2],42),
];
const station=(i:number)=>({x:i===8||i===9?7:i===12||i===13?16:0,z:i===9||i===10?6:i===13?10:0});
for(const i of[8,9,10,12,13]){const{x,z}=station(i);for(const list of[OUT,MID,PORTRAIT]){const v=list[i];list[i]={...v,position:[v.position[0]+x,v.position[1],v.position[2]+z],target:[v.target[0]+x,v.target[1],v.target[2]+z]};}}
type Key={time:number;value:Shot};
const tracks=new WeakMap<object,{desktop:Key[];portrait:Key[]}>();
function track(ranges:readonly Range[],mobile:boolean){
 let cached=tracks.get(ranges);if(!cached){const build=(portrait:boolean)=>{const list:Key[]=[{time:0,value:portrait?shot([2.8,2,7.8],[.2,.8,0],41):shot([5.8,2.1,8.4],[-.9,1,0])}];for(const r of ranges){const cross=[5,7,11,14].includes(r.index),mid=portrait?{...PORTRAIT[r.index],position:PORTRAIT[r.index].position.map((v,k)=>k===2?v+(.5):v) as [number,number,number]}:MID[r.index];list.push({time:r.start+(r.end-r.start)*(cross?.31:.43),value:r.index===11&&portrait?shot([2,13,13],[0,.1,0],44):mid});if(r.index===11)list.push({time:r.start+(r.end-r.start)*.72,value:portrait?PORTRAIT[11]:shot([1.3,18,13],[-.7,0,0],36)});list.push({time:r.end,value:portrait?PORTRAIT[r.index]:OUT[r.index]});}return list;};cached={desktop:build(false),portrait:build(true)};tracks.set(ranges,cached);}return mobile?cached.portrait:cached.desktop;
}
function hermite(t:number,a:number,b:number,ma:number,mb:number){const t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*a+(t3-2*t2+t)*ma+(-2*t3+3*t2)*b+(t3-t2)*mb;}
export function sampleCamera(progress:number,ranges:readonly Range[],mobile=false):Shot{
 const keys=track(ranges,mobile);let i=0;while(i<keys.length-2&&progress>keys[i+1].time)i++;const a=keys[i],b=keys[i+1],before=keys[Math.max(0,i-1)],after=keys[Math.min(keys.length-1,i+2)],span=b.time-a.time,t=Math.min(1,Math.max(0,(progress-a.time)/span));
 const scalar=(get:(s:Shot)=>number)=>{const delta=get(b.value)-get(a.value);const limit=(v:number)=>delta===0||Math.sign(v)!==Math.sign(delta)?0:Math.sign(v)*Math.min(Math.abs(v),Math.abs(delta)*2);const ma=limit((get(b.value)-get(before.value))/Math.max(1e-6,b.time-before.time)*span*.7),mb=limit((get(after.value)-get(a.value))/Math.max(1e-6,after.time-a.time)*span*.7);return hermite(t,get(a.value),get(b.value),ma,mb);};
 return{position:[0,1,2].map(j=>scalar(v=>v.position[j])) as [number,number,number],target:[0,1,2].map(j=>scalar(v=>v.target[j])) as [number,number,number],fov:scalar(v=>v.fov)};
}
