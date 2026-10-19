import {sampleCamera} from './camera-rig';
export type WorldId='emergency'|'clinical'|'trust'|'population';
export type Vec3=readonly[number,number,number];
export type Act={id:string;roman:string;label:string;title:string;emphasis:string;copy:string;world:WorldId;weight:number;camera:Vec3;target:Vec3;warm:boolean};
export const ACTS:readonly Act[]=[
 {id:'opening',roman:'I',label:'Before healthcare becomes healthcare',title:'Your health story',emphasis:'belongs to you.',copy:'Most days, you can speak for yourself. We begin with a person—not a patient.',world:'emergency',weight:1.05,camera:[7,3.3,10],target:[0,.9,0],warm:false},
 {id:'incident',roman:'II',label:'Human response comes first',title:'A moment changes.',emphasis:'People respond first.',copy:'A fictional, non-graphic sudden collapse. The cause stays unknown. A nearby person responds before technology enters the frame.',world:'emergency',weight:1.1,camera:[4,2.7,6.5],target:[0,.75,0],warm:false},
 {id:'public-minimum',roman:'III',label:'The public minimum',title:'The credential is found. A QR is not a key',emphasis:'to your medical life.',copy:'Only deliberately public emergency information belongs in a bystander’s view.',world:'emergency',weight:1.6,camera:[2.7,2.35,4.7],target:[.8,.85,.4],warm:false},
 {id:'verified-help',roman:'IV',label:'A separate authorization',title:'The right help.',emphasis:'Not unlimited access.',copy:'Authenticated responder → limited emergency summary. A copied QR is not professional authorization.',world:'emergency',weight:1.5,camera:[4,2.2,5],target:[.2,.9,0],warm:false},
 {id:'family-alert',roman:'V',label:'A fact, not an assumption',title:'Someone knows.',emphasis:'No one has to guess.',copy:'Emergency credential triggered · 14:32 · Approximate location. Factual, minimal, and no accident is assumed.',world:'emergency',weight:1.4,camera:[6,2.5,4.8],target:[3.8,1.25,.2],warm:false},
 {id:'ordinary-visit',roman:'VI',label:'A new chapter of the same story',title:'Emergency access is exceptional.',emphasis:'Now imagine an ordinary hospital visit.',copy:'Most healthcare is not an emergency. Routine care begins again, with no emergency authority carried forward.',world:'clinical',weight:1.05,camera:[16,3.5,7],target:[12,1,0],warm:true},
 {id:'doctor-consent',roman:'VII',label:'Who · What · Why · How long',title:'Identity',emphasis:'≠ Permission.',copy:'Dr. Sharma · XYZ Hospital · Labs + prescriptions · Current treatment · Two hours. Nothing preselected.',world:'clinical',weight:1.45,camera:[15,2.8,5.5],target:[12,1,0],warm:true},
 {id:'distributed-records',roman:'VIII',label:'Federation, not a warehouse',title:'Your records stay distributed.',emphasis:'Permission travels instead.',copy:'Records stay with providers. Scoped permission travels, then expires. JeevanRekha is a trust layer—not a central medical warehouse.',world:'trust',weight:2,camera:[28,8,11],target:[24,.8,0],warm:false},
 {id:'sealed-records',roman:'IX',label:'Protect the relationship',title:'Hiding the diagnosis',emphasis:'isn’t enough.',copy:'Privacy protects linked relationships—not just one hidden field.',world:'trust',weight:1.5,camera:[26,3.8,6],target:[24,1,0],warm:false},
 {id:'family-permission',roman:'X',label:'A relationship is not permission',title:'Care without',emphasis:'surveillance.',copy:'Reminder help and full medical history are separate capabilities. Family is not automatic consent.',world:'trust',weight:1.4,camera:[27,3.6,7],target:[24,1,0],warm:false},
 {id:'emergency-locker',roman:'XI',label:'Available, not exposed',title:'Available when',emphasis:'seconds matter.',copy:'Emergency protection remains scoped, authenticated and non-universal. No invisible master key.',world:'trust',weight:1.7,camera:[27,3.5,6],target:[24,1.2,0],warm:false},
 {id:'population',roman:'XII',label:'Person → facility → city → district → Gujarat → India',title:'See the pattern.',emphasis:'Not the person.',copy:'Identity disappears before population analytics. Synthetic Vadodara signal: 81% coverage, medium confidence, investigation recommended.',world:'population',weight:2.25,camera:[39,4.5,6],target:[36,0,0],warm:false},
 {id:'aggregation',roman:'XIII',label:'Two separate trust domains',title:'Hospitals stay private.',emphasis:'The signal remains useful.',copy:'Protected facility contributions combine across separate trust domains into a district statistic—not a person-level feed.',world:'population',weight:1.4,camera:[41,9,13],target:[36,1,0],warm:false},
 {id:'transparency',roman:'XIV',label:'Independent evidence matters',title:'Trust shouldn’t',emphasis:'require “trust us.”',copy:'Important access leaves evidence. A fictional historical edit produces an illustrated mismatch—not a claim of immutability.',world:'population',weight:1.4,camera:[40,4.5,9],target:[36,1,0],warm:false},
 {id:'care-continues',roman:'XV',label:'When technology fails',title:'CARE',emphasis:'CONTINUES.',copy:'Internet offline. Service unavailable. Phone damaged. The digital layer disappears; the clinician and patient remain. Care is never denied because JeevanRekha failed.',world:'clinical',weight:1.45,camera:[16,3,7],target:[12,.95,0],warm:true},
 {id:'finale',roman:'XVI',label:'JeevanRekha',title:'Right Person. Right Data.',emphasis:'Right Reason. Right Time.',copy:'And never more than necessary.',world:'clinical',weight:1.5,camera:[16,3.5,9],target:[12,1,0],warm:true},
];
const total=ACTS.reduce((sum,a)=>sum+a.weight,0);let cursor=0;
export const RANGES=ACTS.map((act,index)=>{const start=cursor;cursor+=act.weight/total;return{...act,index,start,end:cursor};});
export const clamp=(v:number)=>Math.min(1,Math.max(0,v));
export const smooth=(v:number)=>{v=clamp(v);return v*v*(3-2*v);};
export function resolveNarrative(progress:number){
 progress=clamp(progress);const act=RANGES.find(a=>progress<a.end)||RANGES[RANGES.length-1];const local=clamp((progress-act.start)/(act.end-act.start));
 const previous=RANGES[Math.max(0,act.index-1)];const blend=smooth(local/.38);
 const rig=sampleCamera(progress,RANGES);const camera=[...rig.position] as [number,number,number],target=[...rig.target] as [number,number,number];

 return{progress,act,index:act.index,local,camera,target,fov:rig.fov,blend,previousWorld:previous.world};
}
export type NarrativeState=ReturnType<typeof resolveNarrative>;
export const beatProgress=(index:number,local=.5)=>RANGES[index].start+(RANGES[index].end-RANGES[index].start)*local;
