'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {FullDemoExperience} from './full-demo-experience';

type Status='idle'|'countdown'|'running'|'paused'|'done'|'error';
type Step={id:string;chapter:string;caption:string;run:(d:Document)=>Promise<void>};
const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const text=(el:Element|null)=>el?.textContent?.replace(/\s+/g,' ').trim()||'';
function buttons(d:Document){return [...d.querySelectorAll('button')] as HTMLButtonElement[]}
function byButton(d:Document,label:string,exact=false){const b=buttons(d).find(x=>exact?text(x)===label:text(x).includes(label));if(!b)throw new Error(`Expected button not found: ${label}`);return b}
function click(d:Document,label:string,exact=false){const b=byButton(d,label,exact);if(b.disabled)throw new Error(`Expected enabled button: ${label}`);b.click()}
async function until(test:()=>boolean,message:string,timeout=3500){const start=Date.now();while(Date.now()-start<timeout){if(test())return;await wait(80)}throw new Error(message)}
function body(d:Document){return text(d.body)}
async function role(d:Document,name:string){click(d,name);await wait(180)}
async function accessTab(d:Document){click(d,'Access',true);await wait(140)}

const steps:Step[]=[
 {id:'intro',chapter:'01 · THE PROBLEM',caption:'A doctor may know who the patient is. That still should not unlock the patient’s medical life.',run:async d=>{await role(d,'Doctor');await wait(1200)}},
 {id:'match',chapter:'02 · IDENTITY ≠ PERMISSION',caption:'First, confirm the intended synthetic patient. Permission remains closed.',run:async d=>{click(d,'Confirm correct patient');await until(()=>body(d).includes('MATCH CONFIRMED')&&body(d).includes('No active authorization'),'Patient match state did not appear');await wait(1200)}},
 {id:'minimum',chapter:'03 · MINIMUM NECESSARY',caption:'For this proof, the doctor requests Labs only — not the entire history.',run:async d=>{if(body(d).includes('Prescriptions ✓'))click(d,'Prescriptions');await until(()=>body(d).includes('Labs')&&!body(d).includes('Labs + Prescriptions'),'Labs-only request did not resolve');await wait(1000)}},
 {id:'duration',chapter:'04 · PURPOSE + DURATION',caption:'The request states WHAT, WHY and HOW LONG before it is sent.',run:async d=>{const b=buttons(d).find(x=>text(x)==='2 hours');if(b)b.click();await until(()=>body(d).includes('Duration: 1 hour'),'1-hour duration did not appear');await wait(900)}},
 {id:'send',chapter:'05 · REQUEST',caption:'The clinician sends the scoped request. No approval is injected behind the scenes.',run:async d=>{click(d,'Send consent request');await wait(700);await role(d,'Citizen');await accessTab(d);await until(()=>body(d).includes('PENDING ACCESS REQUEST'),'Citizen did not receive pending request');await wait(900)}},
 {id:'review',chapter:'06 · CITIZEN REVIEW',caption:'WHO · WHAT · WHY · HOW LONG. The citizen sees the exact request before deciding.',run:async d=>{const t=body(d);if(!t.includes('Labs')||t.includes('Labs + Prescriptions')||!t.includes('1 hour'))throw new Error('Citizen review does not match Labs-only / 1-hour request');await wait(1500)}},
 {id:'allow',chapter:'07 · EXPLICIT CONSENT',caption:'The citizen explicitly allows this request. Identity and permission stay separate.',run:async d=>{click(d,'Allow Access for 1 hour');await until(()=>body(d).includes('ACTIVE SCOPED ACCESS'),'Active scoped access did not appear');await wait(900)}},
 {id:'retrieve',chapter:'08 · SCOPED RETRIEVAL',caption:'Back at the doctor: Lab C is available. Prescription data and prescription-provider success must be absent.',run:async d=>{await role(d,'Doctor');await until(()=>body(d).includes('CBC — Complete Blood Count'),'Authorized lab result did not appear');const t=body(d);if(t.includes('Prescription —')||t.includes('Prescription · synthetic'))throw new Error('Negative-scope failure: prescription content leaked into Labs-only grant');await wait(1700)}},
 {id:'sealed',chapter:'09 · SEALED PRIVACY',caption:'Sensitive relationship metadata is omitted, not displayed as a revealing locked card.',run:async d=>{const t=body(d);if(/MindCare|Psychiatric Clinic|Sealed psychiatric episode/i.test(t))throw new Error('Sealed metadata disclosure detected');await wait(1200)}},
 {id:'revoke',chapter:'10 · REVOCATION',caption:'The citizen revokes the active grant. Revocation closes future system retrieval; it cannot erase copies already received elsewhere.',run:async d=>{await role(d,'Citizen');await accessTab(d);click(d,'Revoke access');await wait(450);await role(d,'Doctor');await until(()=>body(d).includes('No active authorization'),'Revocation did not close authorization');if(body(d).includes('CBC — Complete Blood Count'))throw new Error('Retrieved record remained visible after revocation');await wait(1300)}},
 {id:'blocked',chapter:'11 · BLOCKED AFTER REVOKE',caption:'A subsequent retrieval is blocked until a new scoped request is approved.',run:async d=>{if(!body(d).includes('No active authorization'))throw new Error('Blocked state missing after revoke');await wait(1300)}},
 {id:'failure',chapter:'12 · FAILURE IS VISIBLE',caption:'A real simulated network failure removes expanded emergency access. Tier 0 remains minimal and treatment continues.',run:async d=>{await role(d,'Responder');click(d,'Simulate network loss');await until(()=>body(d).includes('OFFLINE MODE')&&body(d).includes('Standard emergency care continues'),'Offline failure-safe state did not appear');await wait(1500)}},
 {id:'evidence',chapter:'13 · EVIDENCE BOUNDARY',caption:'BUILT: browser interactions. SIMULATED: external systems. PROPOSED: production integrations and cryptographic infrastructure.',run:async d=>{await role(d,'Prototype hub');await wait(1700)}},
 {id:'close',chapter:'14 · JEEVANREKHA',caption:'Right Person. Right Data. Right Reason. Right Time. Never more than necessary. CARE CONTINUES.',run:async()=>{await wait(2200)}}
];

export function DemoExperience(){
 const[full,setFull]=useState(false); const[clean,setClean]=useState(false); const[status,setStatus]=useState<Status>('idle'); const[index,setIndex]=useState(0); const[count,setCount]=useState(3); const[error,setError]=useState(''); const frame=useRef<HTMLIFrameElement>(null); const token=useRef(0);
 useEffect(()=>{const p=new URLSearchParams(location.search);setFull(p.get('mode')==='full');setClean(p.get('clean')==='1')},[]);
 const run=useCallback(async(from=0)=>{const my=++token.current;setError('');setStatus('running');for(let i=from;i<steps.length;i++){if(token.current!==my)return;setIndex(i);const d=frame.current?.contentDocument;if(!d){setError('Prototype frame is not available.');setStatus('error');return}try{await steps[i].run(d)}catch(e){setError(e instanceof Error?e.message:String(e));setStatus('error');return}while(token.current===my&&document.documentElement.dataset.demoPaused==='1')await wait(100)}if(token.current===my)setStatus('done')},[]);
 const start=useCallback(async()=>{token.current++;setStatus('countdown');for(let n=3;n>=1;n--){setCount(n);await wait(650)}const f=frame.current;if(!f)return;f.src='/prototype?demo=1';await new Promise<void>(resolve=>{f.onload=()=>resolve()});run(0)},[run]);
 useEffect(()=>{const p=new URLSearchParams(location.search);if(!full&&p.get('autoplay')==='1'){const id=setTimeout(start,700);return()=>clearTimeout(id)}},[full,start]);
 const pause=()=>{if(status==='running'){document.documentElement.dataset.demoPaused='1';setStatus('paused')}else if(status==='paused'){delete document.documentElement.dataset.demoPaused;setStatus('running')}};
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'&&(status==='running'||status==='paused'))pause()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[status]);
 const restart=()=>{delete document.documentElement.dataset.demoPaused;start()};
 if(full)return <FullDemoExperience/>;
 return <main className={`demo-director-page ${clean?'is-clean':''}`}>
   <iframe ref={frame} className="evidence-frame" src="/prototype?demo=1" title="JeevanRekha interactive prototype"/>
   <div className="evidence-shade"/>
   <header className="evidence-head"><b>JeevanRekha</b><span>AUTOMATED PRODUCT PROOF · SYNTHETIC DATA</span><i>{index+1}/{steps.length}</i></header>
   <section className="evidence-caption" aria-live="polite"><small>{steps[index].chapter}</small><p>{steps[index].caption}</p></section>
   {status==='idle'&&<div className="evidence-launch"><span>2-MINUTE EVIDENCE MODE</span><h1>Story attracts attention.<br/><em>Correct behaviour builds trust.</em></h1><p>This mode drives the real interactive prototype through patient confirmation, minimum scope, citizen review, explicit consent, scoped retrieval, revocation and blocked access.</p><button onClick={start}>Start product proof →</button><a href="/demo?mode=full">Open complete system story</a></div>}
   {status==='countdown'&&<div className="evidence-count">{count}</div>}
   {status==='error'&&<div className="evidence-error"><b>DEMO PAUSED — EXPECTED STATE NOT FOUND</b><p>{error}</p><button onClick={restart}>Restart safely</button><a href="/prototype">Take manual control</a></div>}
   {status==='done'&&<div className="evidence-finish"><small>BUILT · SIMULATED · PROPOSED</small><h1>CARE CONTINUES.</h1><p>The prototype demonstrates browser behaviour with synthetic data. External providers, professional authentication and production infrastructure remain simulated or proposed as labelled.</p><button onClick={restart}>Replay</button></div>}
   {!clean&&status!=='idle'&&status!=='countdown'&&status!=='done'&&<nav className="evidence-controls"><button onClick={pause}>{status==='paused'?'Resume':'Pause'}</button><button onClick={restart}>Restart</button><a href="/prototype">Manual takeover</a><a href="/demo?mode=full">Full story</a></nav>}
 </main>
}
