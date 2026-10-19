import * as T from 'three';
import {facility,plinth,gallery,daylight} from './art-direction';
import {INDIA_OUTLINE,GUJARAT_OUTLINE} from './geography';
import {AssetManager,actor,credential,phone,type Actor,type Palette} from './assets';
import {RANGES,smooth,type NarrativeState,type WorldId} from './narrative';
export type World={root:T.Group;update:(s:NarrativeState)=>void;anchors:Record<string,T.Vector3>;setConsent?:(allowed:boolean,count:number)=>void;depart?:(progress:number,next:WorldId)=>void};
const add=(root:T.Object3D,o:T.Object3D,x=0,y=0,z=0)=>{o.position.set(x,y,z);root.add(o);return o;};
const point=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
function stages(groups:Record<string,T.Group>,_s:NarrativeState){for(const group of Object.values(groups)){group.visible=true;}}
const building=facility;
export function emergencyWorld(a:AssetManager):World{
 const root=new T.Group(),world='emergency' as const;
 add(root,a.box(world,100,.14,100,'#27383a',.02),0,-.08,-1);
 add(root,a.box(world,14,.11,2.2,'#53635e',.08),0,-.04,-4.1);
 for(let i=0;i<5;i++){const x=i*3-6;add(root,building(a,world,2.2,2+(i%3)*.6,1.3,i%2?'#30474c':'#3d5554'),x,0,-5.5);}
 for(let i=0;i<4;i++){add(root,a.box(world,.75,.008,.045,'#a5b09e',.004),i*2.4-4,.002,-.75);}
 for(const x of[-4,4]){add(root,a.capsule(world,.035,2.8,'#71817b'),x,1.4,-3);add(root,a.box(world,.7,.04,.22,'#a4b3a5'),x+.28,2.82,-3);}
 // Rebuilt street dressing: an inhabited Indian urban evening, not an empty demo stage.
 const pavement=a.box(world,14,.12,2.0,'#6d756e',.025);add(root,pavement,0,.01,2.7);
 for(let i=0;i<9;i++)add(root,a.box(world,.95,.025,.045,i%2?'#d9d2b8':'#465c59',.004),-5.2+i*1.3,.085,1.72);
 const trees:T.Group[]=[];for(const x of[-5.2,5.4]){const tree=new T.Group();add(root,tree,x,0,2.95);add(tree,a.capsule(world,.075,1.45,'#695b48'),0,.72,0);for(const [dx,dy,dz,sc] of [[0,1.65,0,.72],[-.35,1.48,.05,.5],[.38,1.52,-.08,.52]] as const){const crown=new T.Mesh(a.geo('jr-tree-crown',()=>new T.IcosahedronGeometry(.62,2)),a.material(world,'#405f50',0,.92));crown.scale.setScalar(sc);add(tree,crown,dx,dy,dz);}trees.push(tree);}
 const kiosk=new T.Group();add(root,kiosk,5.1,0,-4.0);add(kiosk,a.box(world,2.1,1.9,.95,'#465b58',.04),0,.95,0);add(kiosk,a.box(world,1.65,.72,.025,'#c6b997',.025),0,1.18,.49);add(kiosk,a.box(world,2.45,.12,1.2,'#826c50',.02),0,1.98,0);
 const cityPeople=[actor(a,world,'#6f7f72','#b78f75',false,'female'),actor(a,world,'#8d725e','#a97d65'),actor(a,world,'#526a72','#c29679',false,'female')];
 cityPeople.forEach((person,i)=>{add(root,person.root,-4.8+i*4.7,0,2.25+(i%2)*.55);person.root.rotation.y=i===1?-1.7:.35;person.pose(i*.35,.15);});
 const patient=actor(a,world,'#9a8a70');add(root,patient.root,0,0,0);
 const passer=actor(a,world,'#687d79','#b18b75',false,'female');add(root,passer.root,3,0,.5);passer.root.rotation.y=-.6;
 const responder=actor(a,world,'#406d6b','#b78e73',true);add(root,responder.root,-4,0,.3);responder.root.rotation.y=.5;
 const family=actor(a,world,'#b0a18c','#a68069',false,'female');add(root,family.root,4.2,0,-.3);family.root.rotation.y=-.5;
 patient.pose();patient.root.rotation.z=-1.50;patient.root.children[0].visible=false;patient.root.updateMatrixWorld(true);const fallenFloor=-new T.Box3().setFromObject(patient.body,true).min.y+.018;patient.root.rotation.z=0;patient.root.children[0].visible=true;patient.pose();const bagHold=patient.hand('left').add(point(0,-.24,0));
 const bag=new T.Group();add(bag,a.box(world,.42,.38,.21,'#a1845f',.055));add(bag,a.line([point(-.12,.15,0),point(-.12,.30,0),point(.12,.30,0),point(.12,.15,0)],world,'#b59a73',.018));add(root,bag,-.32,.8,0);
 const fallenContact=a.contact(),bagContact=a.contact();root.add(fallenContact,bagContact);bagContact.scale.set(.52,.42,1);
 const card=credential(a,world);card.scale.setScalar(.34);add(root,card,.1,1.12,.16);card.rotation.y=.2;
 const scanner=phone(a,world);scanner.scale.setScalar(.55);add(root,scanner,.25,.85,1.2);scanner.rotation.x=-.5;
 const scanLine=a.box(world,.27,.006,.006,'#a5d7bd',.002);add(scanner,scanLine,0,0,.04);
 const familyPhone=phone(a,world);familyPhone.scale.setScalar(.55);add(root,familyPhone,3.85,1.3,.3);familyPhone.rotation.y=-.15;
 const edge=a.box(world,.28,.008,.005,'#eff3df',.002);add(familyPhone,edge,0,.08,.04);
 const flow=a.line([point(.35,.11,.41),point(.05,.4,-.1),point(.25,.8,-.65)],world,'#93bea5',.006);root.add(flow);
 const ambulance=new T.Group();root.add(ambulance);ambulance.position.set(-10,0,-1.65);
 // Authored, unbranded emergency vehicle silhouette: cab, patient compartment, glazing, lamps and wheels.
 add(ambulance,a.box(world,2.85,1.34,1.16,'#e2e5dd',.12),-.35,.82,0);
 add(ambulance,a.box(world,1.18,.92,1.12,'#d7ddd8',.10),1.58,.70,0);
 add(ambulance,a.box(world,.78,.43,.018,'#263e46',.02),1.72,.96,.571);add(ambulance,a.box(world,.78,.43,.018,'#263e46',.02),1.72,.96,-.571);
 add(ambulance,a.box(world,.95,.075,.40,'#82aaa3',.03),-.35,1.54,0);
 add(ambulance,a.box(world,.08,.18,.48,'#668f89',.018),-1.78,.93,0);
 add(ambulance,a.box(world,.22,.10,.05,'#e7d6aa',.015),2.18,.55,.57);add(ambulance,a.box(world,.22,.10,.05,'#e7d6aa',.015),2.18,.55,-.57);
 const wheels:T.Mesh[]=[];for(const x of[-1.08,1.20])for(const z of[-.61,.61]){const wheel=new T.Mesh(a.geo('jr-ambulance-wheel',()=>new T.CylinderGeometry(.27,.27,.15,24)),a.material(world,'#172326',0,.95));wheel.rotation.x=Math.PI/2;add(ambulance,wheel,x,.28,z);wheels.push(wheel);}
 return{root,anchors:{},update(s){
  const incident=s.index>1?1:s.index===1?smooth(s.local/.75):0;
  patient.root.rotation.z=-incident*1.50;patient.root.position.set(s.index===0?-1.35+1.05*smooth(s.local):-.30*incident,incident*fallenFloor,0);patient.root.children[0].visible=incident<.2;patient.body.rotation.x=Math.sin(incident*Math.PI)*.12;patient.leftLeg.rotation.x=Math.sin(incident*Math.PI)*.26;patient.rightLeg.rotation.x=-Math.sin(incident*Math.PI)*.13;patient.head.rotation.x=incident*.04;patient.head.rotation.y=s.index===0?-.08+Math.sin(s.local*Math.PI)*.16:0;patient.torso.rotation.y=s.index===0?Math.sin(s.local*Math.PI)*.035:0;patient.pose(s.index===0?1.05*s.local:0,s.index===0?.72:0);
  bag.position.copy(incident===0?patient.hand('left').add(point(0,-.22,0)):bagHold).lerp(point(-.65,.23,-.65),incident);bag.rotation.z=-incident*.45;bagContact.position.set(bag.position.x,.017,bag.position.z);bagContact.visible=incident>.8;fallenContact.position.set(.55*incident,.017,0);fallenContact.scale.set(2.3*incident,.85,1);fallenContact.visible=incident>.15&&(s.index<4||s.local<.48);
  card.position.set(.10+incident*.25,1.12-incident*1.02,.16+incident*.25);card.rotation.x=-incident*Math.PI/2;
  passer.root.position.set(3-incident*3.75,0,.5+incident*.15);passer.leftArm.rotation.x=-incident*.4;passer.root.rotation.y=-1.53-smooth((incident-.72)/.28)*2.25;passer.head.rotation.x=s.index>=2?.25:incident*.12;passer.leftLeg.rotation.x=0;passer.rightLeg.rotation.x=0;
  const arrival=s.index>3?1:s.index===3?smooth(s.local/.45):0;
  const ambulanceArrival=s.index>2?1:s.index===2?smooth((s.local-.12)/.58):s.index===1?smooth((s.local-.92)/.08)*.035:0;
  ambulance.visible=(s.index===1&&s.local>.92)||(s.index>=2&&s.index<4)||(s.index===4&&s.local<.16);
  // Long approach + eased deceleration. It enters the composition; it never pops into place.
  ambulance.position.x=-10+ambulanceArrival*6.15;ambulance.position.z=-1.72+.07*Math.sin(ambulanceArrival*Math.PI);
  wheels.forEach(w=>w.rotation.y=-ambulanceArrival*14);
  responder.root.visible=s.index>=3;responder.root.position.set(-3.7+arrival*3.95,0,.3-arrival*.95);responder.root.rotation.y=.5+arrival*.46;responder.rightArm.rotation.x=0;responder.leftLeg.rotation.x=0;responder.rightLeg.rotation.x=0;
  const phase=s.index===2?s.local:0;scanner.visible=s.index>=2&&s.index<=3;scanner.position.y=.75+Math.sin(phase*Math.PI)*.08;scanLine.position.y=-.2+phase*.4;
  flow.visible=s.index===3&&s.local>.35;const n=flow.geometry.index?.count||0;flow.geometry.setDrawRange(0,Math.floor(n*smooth((s.local-.35)/.45)/3)*3);
  family.root.visible=s.index>=4||s.index===3&&s.local>.7;familyPhone.visible=s.index>=4;family.leftArm.rotation.x=.75;edge.scale.x=s.index===4?smooth((s.local-.2)/.35):1;passer.leftArm.rotation.x=0;patient.root.visible=s.index<4||s.local<.48;passer.root.visible=s.index<4||s.local<.48;responder.root.visible=s.index>=3&&(s.index<4||s.local<.48);passer.pose(incident*3.75,smooth(Math.min(incident/.12,(1-incident)/.12)),'kneel',smooth((incident-.75)/.25));responder.pose(arrival*3.95,smooth(Math.min(arrival/.1,(1-arrival)/.12)),'kneel',smooth((arrival-.75)/.25));family.pose();scanner.rotation.set(-.65,passer.root.rotation.y+Math.PI,0);familyPhone.rotation.y=family.root.rotation.y+Math.PI;scanner.scale.setScalar(.34);familyPhone.scale.setScalar(.34);scanner.position.copy(passer.hand('right')).add(point(0,.13,.10));familyPhone.position.copy(family.hand('left')).add(point(0,.13,.10));
 }};
}
export function clinicalWorld(a:AssetManager):World{
 const root=new T.Group(),world='clinical' as const;root.position.x=12;
 add(root,a.box(world,70,.16,70,'#c9c5b6',.02),0,-.1,0);
 add(root,a.box(world,8,3,.13,'#e2dfd2',.10),0,1.4,-2.7);add(root,a.box(world,.12,3,4,'#d5d6c7',.06),-3.7,1.4,-.65);
 const windowFrame=a.box(world,3.8,1.4,.04,'#a4b9af',.04);windowFrame.material=daylight(a);add(root,windowFrame,1.1,1.8,-2.59);for(let i=0;i<4;i++)add(root,a.box(world,.025,1.4,.04,'#e8e5d7',.005),-.3+i*.9,1.8,-2.55);
 add(root,a.box(world,1.6,.10,.9,'#b19d7d',.08),0,.77,0);for(const x of[-.65,.65])for(const z of[-.32,.32])add(root,a.capsule(world,.03,.7,'#697b72'),x,.35,z);
 const doctor=actor(a,world,'#e5e6d8','#b78c73',true),patient=actor(a,world,'#7e9790','#ae876e');add(root,doctor.root,-.85,0,-.65);doctor.root.rotation.y=.5;add(root,patient.root,.9,0,.65);patient.root.rotation.y=-2.7;doctor.rightArm.rotation.x=-.4;patient.leftArm.rotation.x=-.2;


 // The animation's hips translate backwards while sitting. Fit furniture to that
 // actual pose, not to the standing actor origin. No narrative clock is introduced.
 patient.pose(0,0,true);const chair=new T.Group();root.add(chair);const hips=patient.body.getObjectByName('pelvis')!;patient.root.updateMatrixWorld(true);chair.position.copy(root.worldToLocal(hips.getWorldPosition(new T.Vector3())));chair.position.y=0;chair.rotation.y=patient.root.rotation.y;
 const seat=a.box(world,.53,.085,.53,'#61776f',.06);add(chair,seat,0,.45,0);const back=a.box(world,.53,.48,.055,'#61776f',.05);add(chair,back,0,.76,-.29);for(const x of[-.21,.21])for(const z of[-.21,.21])add(chair,a.capsule(world,.018,.39,'#64716a'),x,.22,z);
 const wallMaterial=(root.children[1] as T.Mesh).material as T.MeshStandardMaterial;wallMaterial.bumpMap=a.surface('plaster');wallMaterial.bumpScale=.012;
 const floorMaterial=(root.children[0] as T.Mesh).material as T.MeshStandardMaterial;floorMaterial.bumpMap=a.surface('plaster');floorMaterial.bumpScale=.008;
 // Timber reveals, a shelf and soft window mullions replace the empty beige-box set.
 for(const x of[-3.1,-2.5,-1.9,-1.3])add(root,a.box(world,.035,2.8,.08,'#b3a58e',.006),x,1.4,-2.58);
 add(root,a.box(world,1.2,.07,.25,'#a89d83',.01),-2,1.08,-2.42);const vessel=new T.Mesh(a.geo('clinic-vessel',()=>new T.CylinderGeometry(.09,.075,.2,18)),a.material(world,'#8b9d8d',0,.9));add(root,vessel,-2.3,1.22,-2.42);
 const clinicDevice=phone(a,world);clinicDevice.scale.setScalar(.4);add(root,clinicDevice,-.3,.99,-.18);clinicDevice.rotation.x=-.9;
 const folder=a.box(world,.42,.025,.29,'#e8e5d5',.02);add(root,folder,0,.84,0);
 const consentLine=a.line([point(-.7,.90,-.45),point(0,1.2,0),point(.6,.9,.5)],world,'#507d6b',.012);root.add(consentLine);
 const technical=new T.Group();clinicDevice.add(technical);for(let i=0;i<4;i++){const slab=a.box(world,.20-i*.025,.014,.004,'#56766a',.002);add(technical,slab,-.025,.18-i*.08,.041);}
 const finaleActors=new T.Group();root.add(finaleActors);
 let consentAllowed=false,consentCount=0;
 const identity=a.line([point(-2,.1,1.5),point(-1,.1,1.5),point(-.4,.1,1.9),point(.2,.1,1.1),point(.65,.1,1.65),point(2,.1,1.65)],world,'#719780',.005);root.add(identity);
 return{root,anchors:{},depart(progress,next){if(next!=='trust')return;const p=smooth(progress);root.children[1].scale.y=1-.65*p;root.children[1].position.x=-p*1.2;root.children[2].rotation.y=-p*.7;windowFrame.position.y=1.8-p*.4;},setConsent(allowed,count){consentAllowed=allowed;consentCount=count;},update(s){root.children[1].scale.y=1;root.children[1].position.x=0;root.children[2].rotation.y=0;windowFrame.position.y=1.8;const failing=s.act.id==='care-continues',final=s.act.id==='finale';consentLine.visible=s.act.id==='doctor-consent'&&consentAllowed;technical.visible=!failing&&!final&&s.act.id==='doctor-consent'&&consentAllowed;technical.children.forEach((o,i)=>o.visible=i<consentCount);finaleActors.visible=false;identity.visible=final;windowFrame.visible=true;clinicDevice.visible=!failing||s.local<.38;folder.visible=true;technical.scale.setScalar(s.act.id==='doctor-consent'?smooth(s.local/.4):1);doctor.rightArm.rotation.x=0;doctor.head.rotation.x=.055;doctor.torso.rotation.x=failing?.11:.025;doctor.pose(0,0,'talk',1,.3+smooth(s.local)*1.9);patient.head.rotation.x=failing?.08:.03;patient.pose(0,0,true);identity.scale.x=final?.5+smooth(s.local)*.5:1;}};
}
export function trustWorld(a:AssetManager):World{
 const root=new T.Group(),world='trust' as const;root.position.x=24;const floor=a.box(world,35,.10,28,'#172933',.02);add(root,floor,4,-.06,3);root.add(gallery(a,world));(floor.material as T.MeshStandardMaterial).bumpMap=a.surface('plaster');(floor.material as T.MeshStandardMaterial).bumpScale=.012;
 const nodes=new T.Group();root.add(nodes);nodes.position.y=.23;const networkTable=plinth(a,world,6.5,4.8);root.add(networkTable);const coords=[[-2.4,0,-1.7],[2.4,0,-1.7],[-2.4,0,1.7],[2.4,0,1.7]];
 coords.forEach(([x,y,z],i)=>add(nodes,building(a,world,1.05,.8+i*.12,.8,i%2?'#98ada1':'#b6bdab'),x,y,z));
 const trustRing=new T.Mesh(a.geo('trust-ring',()=>new T.TorusGeometry(.65,.015,8,72)),a.material(world,'#719a88',.3,.4));trustRing.rotation.x=-Math.PI/2;add(nodes,trustRing,0,.08,0);
 const exchange=a.line([point(2.4,1,-1.7),point(0,1.2,-1.7),point(-2.4,1,-1.7)],world,'#648f7b',.015);nodes.add(exchange);
 const packet=credential(a,world);packet.scale.setScalar(.65);nodes.add(packet);
 const privacy=new T.Group();root.add(privacy);privacy.position.x=7;privacy.scale.setScalar(.7);const privacyBase=plinth(a,world,3.25,2.8);privacyBase.scale.set(.8,1,.8);add(root,privacyBase,7,0,.35);const slabs:T.Mesh[]=[];
 const episode=a.box(world,.65,.50,.035,'#c5caba',.035);add(privacy,episode,0,.6,0);episode.rotation.x=-.5;slabs.push(episode);
 for(let i=0;i<3;i++){const bar=a.box(world,.36-i*.07,.012,.01,'#7f9184',.003);add(episode,bar,-.035,.07-i*.065,.032);}
 const bottle=a.capsule(world,.12,.26,'#a4b4a3');add(privacy,bottle,-.9,.64,.4);slabs.push(bottle);add(bottle,a.box(world,.21,.07,.20,'#758b7c',.025),0,.25,0);add(bottle,a.box(world,.17,.12,.035,'#c9cdbc',.015),0,0,.11);
 const test=a.capsule(world,.075,.36,'#9aafa6');add(privacy,test,.9,.64,.4);test.rotation.z=-.18;slabs.push(test);add(test,a.box(world,.16,.07,.16,'#718f80',.02),0,.27,0);
 const metadata=a.box(world,.52,.36,.025,'#b0bdad',.025);add(privacy,metadata,0,.64,1);metadata.rotation.x=-.5;slabs.push(metadata);for(let i=0;i<4;i++)add(metadata,a.box(world,.31-i*.035,.012,.01,'#7a8c7f',.003),-.02,.10-i*.06,.025);
 for(const[x,z]of[[-.9,.4],[.9,.4],[0,1]])privacy.add(a.line([point(0,.38,0),point(x*.5,.4,z*.5),point(x,.4,z)],world,'#829c89',.009));

 const boundary=new T.Mesh(a.geo('privacy-boundary',()=>new T.TorusGeometry(1,.015,8,80)),a.material(world,'#4f7d67',.4,.4));boundary.rotation.x=-Math.PI/2;add(privacy,boundary,0,.3,.35);
 // The whole relationship closes as one opaque housing. No diagnosis-only mask.
 const enclosure=new T.Group();privacy.add(enclosure);
 add(enclosure,a.box(world,2.95,1.48,.075,'#405b61',.035),0,.98,-.52);
 for(const x of[-1.48,1.48])add(enclosure,a.box(world,.075,1.48,1.96,'#405b61',.035),x,.98,.43);
 add(enclosure,a.box(world,2.98,.075,1.96,'#80958b',.035),0,1.74,.43);
 const doors=[new T.Group(),new T.Group()];doors.forEach((door,i)=>{add(enclosure,door,i===0?-1.48:1.48,.98,1.40);const leaf=a.box(world,1.48,1.48,.065,'#718c80',.035);add(door,leaf,i===0?.74:-.74,0,0);add(leaf,a.box(world,.018,.18,.028,'#bbc6b6',.005),i===0?.61:-.61,0,.05);});
 const seal=a.box(world,.11,.15,.018,'#c3cbb9',.015);add(privacy,seal,0,.98,1.45);
 const capability=new T.Group();root.add(capability);capability.position.set(7,0,6);const relative=actor(a,world,'#889c8c','#b99179',false,'female'),person=actor(a,world,'#b6ac96');add(capability,relative.root,-.8,0,0);add(capability,person.root,.8,0,0);relative.root.rotation.y=.85;person.root.rotation.y=-.7;const reminder=phone(a,world);reminder.scale.setScalar(.32);add(capability,reminder,-.4,1.15,.8);const history=a.box(world,.48,.58,.06,'#777f78',.045);add(capability,history,1.4,.6,1.1);
 const vault=new T.Group();root.add(vault);vault.position.z=6;const core=a.box(world,.78,.88,.10,'#9fae9f',.055);add(vault,core,0,1.1,0);const inset=a.box(world,.56,.64,.018,'#637e70',.025);add(vault,inset,0,1.1,.067);const keyA=a.box(world,.32,.32,.18,'#b8b498',.035),keyB=a.box(world,.32,.32,.18,'#698d82',.035);add(vault,keyA,-1.3,.95,.2);add(vault,keyB,1.3,.95,.2);const observer=actor(a,world,'#6b8e80','#ac866c',true);observer.root.scale.setScalar(1);add(vault,observer.root,0,0,-1.1);
 core.scale.setScalar(.66);inset.scale.setScalar(.66);core.position.y=.85;inset.position.y=.85;observer.root.position.set(-1.7,0,-.8);observer.root.rotation.y=.65;const vaultBase=plinth(a,world,2.8,1.4);add(vault,vaultBase,0,0,.15);keyA.position.y=.6;keyB.position.y=.6;
 const anchors:Record<string,T.Vector3>={};coords.forEach(([x,,z],i)=>anchors[['Hospital A','Lab B','Hospital C','Diagnostic Centre D'][i]]=point(x+24,1.65,z));anchors['Trust & Access Layer']=point(24,.16,0);Object.assign(anchors,{'Episode':point(31,1.05,0),'Prescription':point(30.1,1.05,.4),'Related test':point(31.9,1.05,.4),'Revealing metadata':point(31,.9,1)});
 return{root,anchors,update(s){const id=s.act.id;stages({'distributed-records':nodes,'sealed-records':privacy,'family-permission':capability,'emergency-locker':vault},s);capability.visible=id==='family-permission'||id==='sealed-records'&&s.local>.85;observer.root.visible=id==='emergency-locker'||id==='family-permission'&&s.local>.82;const networkLocal=id==='distributed-records'?s.local:1,privacyLocal=id==='sealed-records'?s.local:1,familyLocal=id==='family-permission'?s.local:1,lockerLocal=id==='emergency-locker'?s.local:1;const mobile=innerWidth<=760;networkTable.scale.x=mobile?.68:1;nodes.children.slice(0,4).forEach((o,i)=>{o.position.x=coords[i][0]*(mobile?.55:1);});exchange.scale.x=mobile?.55:1;coords.forEach(([x,,z],i)=>anchors[['Hospital A','Lab B','Hospital C','Diagnostic Centre D'][i]].set(24+x*(mobile?.55:1),1.88,z));const p=smooth((networkLocal-.2)/.45);packet.position.set((2.4-4.8*p)*(mobile?.55:1),1.1,-1.7);packet.visible=networkLocal>.2&&networkLocal<.78;exchange.visible=networkLocal<.78;const closing=smooth((privacyLocal-.20)/.42);enclosure.scale.y=.12+.88*smooth(privacyLocal/.22);doors[0].rotation.y=-1.65*(1-closing);doors[1].rotation.y=1.65*(1-closing);seal.visible=privacyLocal>.60;slabs.forEach(o=>o.visible=privacyLocal<.68);boundary.scale.setScalar(1.52);boundary.position.y=.23;slabs.forEach((slab,i)=>{slab.position.y=.6+smooth((privacyLocal-i*.08)/.3)*.08;});person.leftArm.rotation.x=.65;person.head.rotation.x=.15;relative.head.rotation.y=-.12-smooth(familyLocal)*.16;relative.rightArm.rotation.x=-.12;relative.pose();person.pose();reminder.position.copy(person.hand('left')).add(point(0,.12,.04));reminder.rotation.set(-.4,person.root.rotation.y+Math.PI,0);history.visible=false;observer.head.rotation.y=.18;observer.pose();keyA.position.x=-1.3+smooth(lockerLocal/.4)*.35;keyB.position.x=1.3-smooth((lockerLocal-.3)/.4)*.35;core.rotation.y=smooth(lockerLocal)*.08;}};
}
export function populationWorld(a:AssetManager,low:boolean):World{
 const root=new T.Group(),world='population' as const;root.position.x=36;const floor=a.box(world,110,.12,100,'#11232d',.02);add(root,floor,8,-.07,0);root.add(gallery(a,world));const geographyBase=plinth(a,world,14.5,17,'#1b333d');root.add(geographyBase);
 const city=new T.Group();root.add(city);const count=81;
 const geo=a.box(world,.42,1,.42,'#869e90',.04).geometry;const material=a.material(world,'#869e90');const blocks=new T.InstancedMesh(geo,material,count);blocks.castShadow=true;blocks.receiveShadow=true;const m=new T.Matrix4();for(let i=0;i<count;i++){const x=(i%9-4)*.7,z=(Math.floor(i/9)-4)*.7,h=.25+((i*7)%13)*.09;m.compose(point(x,h/2,z),new T.Quaternion(),point(1,h,1));blocks.setMatrixAt(i,m);}city.add(blocks);
 const district=new T.Mesh(a.geo('district-disc',()=>new T.CylinderGeometry(5.1,5.1,.12,6)),a.material(world,'#465f59'));add(city,district,0,-.06,0);
 const territory=new T.Group();root.add(territory);territory.position.y=.61;
 // Deliberately schematic scale silhouette: not a political/geographic boundary product.
 const land=(key:string,outline:number[][],depth:number,color:string)=>new T.Mesh(a.geo(key,()=>{const shape=new T.Shape(outline.map(([x,y])=>new T.Vector2(x,y)));const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:2,steps:1});g.rotateX(-Math.PI/2);return g;}),a.material(world,color));
 const country=land('natural-earth-india',INDIA_OUTLINE,.08,'#527568');add(territory,country,0,-.4,0);
 const gujarat=land('schematic-gujarat',GUJARAT_OUTLINE,.09,'#b0bd9e');add(territory,gujarat,0,-.27,0);

 const facilities=new T.Group();root.add(facilities);for(let i=0;i<3;i++)add(facilities,building(a,world,.65,.7,.65,'#a8b6a4'),-2.4+i*2.4,.1,-1.6);
 const aggregation=new T.Group();root.add(aggregation);aggregation.position.x=16;const aggregationBase=plinth(a,world,7.4,6.1);add(root,aggregationBase,16,0,.4);for(const x of[-1.6,1.6])add(aggregation,a.box(world,1.3,.55,.85,'#809d90',.09),x,.5,1.1);
 const paths:T.Mesh[]=[];for(let i=0;i<3;i++)for(const x of[-1.6,1.6]){const line=a.line([point(-2.4+i*2.4,.8,-1.6),point(x,1.8,0),point(x,.9,1.1)],world,x<0?'#a8bda4':'#729e94',.014);aggregation.add(line);paths.push(line);}
 const release=a.box(world,.55,.1,.55,'#c0c9aa',.10);add(aggregation,release,0,.30,2.5);
 const timeline=new T.Group();root.add(timeline);const evidenceBase=plinth(a,world,7.4,3.8);add(root,evidenceBase,16,0,10);timeline.position.set(16,0,10);const timelineLine=a.line([point(-3,.8,0),point(3,.8,0)],world,'#8ea994',.014);timeline.add(timelineLine);const markers:T.Mesh[]=[];for(let i=0;i<3;i++){const marker=a.box(world,.30,.46,.018,'#b9c4ac',.012);marker.rotation.z=.05;add(timeline,marker,-2+i*2,.8,0);for(let j=0;j<5;j++)add(marker,a.box(world,.20-j*.022,.012,.009,'#4a6862',.002),-.012,.13-j*.055,.018);add(timeline,a.box(world,.045,.43,.055,'#617e74',.008),-2+i*2,.43,0);markers.push(marker);}const witness=a.box(world,.5,.42,.10,'#91ada0',.035);add(timeline,witness,0,1.8,-.9);add(timeline,a.box(world,.07,1.4,.07,'#607c73',.01),0,.91,-.9);for(let j=0;j<3;j++)add(witness,a.box(world,.26-j*.03,.012,.012,'#3e6058',.002),-.02,.08-j*.07,.065);
 const anchors:Record<string,T.Vector3>={'Aggregator A':point(50.4,1.05,1.1),'Aggregator B':point(53.6,1.05,1.1),'Released statistic':point(52,.45,2.5),'Access evidence':point(50,1.2,10),'Independent witness':point(52,2.2,9.1),'Illustrative mismatch':point(52,1.5,10)};
 return{root,anchors,update(s){blocks.count=a.low?36:81;const pop=s.act.id==='population';const local=pop?s.local:1;city.visible=pop&&s.local>.17&&s.local<.84;territory.visible=!pop||s.local>.35;facilities.visible=true;facilities.position.x=pop?0:16;facilities.position.y=pop?.19:.12;geographyBase.visible=pop||s.act.id==='aggregation'&&s.local<.25;aggregation.visible=true;timeline.visible=true;city.scale.setScalar(1-smooth((local-.28)/.44)*.93);city.position.set(-2.7*smooth((s.local-.48)/.25),.23,.1*smooth((s.local-.48)/.25));territory.scale.setScalar(.45+smooth((local-.32)/.6)*.55);paths.forEach((path,i)=>{const n=path.geometry.index?.count||0;path.geometry.setDrawRange(0,Math.floor(n*smooth(((s.act.id==='aggregation'?s.local:s.index>12?1:0)-.1-i*.015)/.6)/3)*3);});markers[1].material=a.material(world,s.local>=.72?'#a76e5a':'#b9c4ac');markers[1].position.y=.8+smooth((s.local-.52)/.20)*.32;markers[1].rotation.z=.05+smooth((s.local-.52)/.2)*.3;anchors['Illustrative mismatch'].y=markers[1].position.y+.45;}};
}
export const BUILDERS:Record<WorldId,(a:AssetManager,low:boolean)=>World>={emergency:emergencyWorld,clinical:clinicalWorld,trust:trustWorld,population:populationWorld};
