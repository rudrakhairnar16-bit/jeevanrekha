'use client';
import {useEffect,useState} from 'react';

function useReady(){const[ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);return ready;}
const samples=[['01','Consent granted','Treatment · selected records','c7a2…91ef'],['02','Emergency access','Responder · declared purpose','f1b8…2c04'],['03','Public-health statistic published','Aggregate · release version','8d03…ab72']];

/** Fixed fictional comparisons: no hashes, inclusion proofs or verification run. */
export function EvidenceDemo(){
 const ready=useReady();const[edited,setEdited]=useState(false),[witness,setWitness]=useState(true);
 const state=!witness?'unavailable':edited?'mismatch':'aligned';
 return <figure className="evidence-demo evidence-interactive" data-evidence-state={state}>
  <figcaption className="panel-overline"><span>APPEND-ONLY TIMELINE CONCEPT</span><span>ILLUSTRATIVE</span></figcaption>
  <p className="evidence-intro">Fixed fictional samples. No hashes are computed and no cryptographic proof is checked.</p>
  <ol className="proof-chain">{samples.map(([n,title,description,commitment])=><li className="proof-event" key={n} data-example-edit={n==='02'&&edited?'changed':'original'}><span>{n}</span><div><strong>{n==='02'&&edited?'Emergency access description changed':title}</strong><small>{n==='02'&&edited?'Historical sample edited for comparison':description}</small><code>EXAMPLE COMMITMENT {n==='02'&&edited?'a49c…6d20':commitment}</code></div><span className="proof-mark" aria-hidden="true">{n==='02'&&edited?'≠':'◇'}</span></li>)}</ol>
  <div className="witness-reference"><span>SEPARATELY HELD REFERENCE / ILLUSTRATED</span><div><strong>Saved reference · event 02</strong><code>{witness?'f1b8…2c04':'Reference unavailable'}</code></div><p>{witness?'Editing the displayed sample does not change this independent example reference.':'Without the independent reference, this example cannot establish whether history still agrees.'}</p></div>
  <div className="evidence-comparison" role="status"><span>{state==='aligned'?'ILLUSTRATED REFERENCES ALIGN':state==='mismatch'?'ILLUSTRATED MISMATCH / EVENT 02':'CANNOT COMPARE / REFERENCE MISSING'}</span><p>{state==='aligned'?'Agreement with a reference does not prove that every access was logged.':state==='mismatch'?'A changed sample no longer agrees with the saved reference. Preserve evidence and investigate; this does not identify who changed it.':'Unavailable evidence is not successful verification. Care must not depend on this comparison.'}</p></div>
  <div className="evidence-controls"><button disabled={!ready} onClick={()=>setEdited(!edited)}>{edited?'Restore original example':'Illustrate a historical edit'}<span aria-hidden="true">{edited?'↺':'≠'}</span></button><button disabled={!ready} onClick={()=>setWitness(!witness)}>{witness?'Remove witness reference':'Restore witness reference'}<span aria-hidden="true">{witness?'−':'+'}</span></button><button disabled={!ready||(!edited&&witness)} onClick={()=>{setEdited(false);setWitness(true);}}>Reset evidence example<span aria-hidden="true">↺</span></button></div>
  <p className="proof-result">Tamper-evident under stated assumptions.<br/>Not tamper-impossible.</p>
  <small className="fine-print">Predetermined illustration—not live cryptographic verification. A real design needs protected commitments, inclusion and consistency proofs, independent witnesses and secure key management. A log alone cannot prove that every real-world access was captured.</small>
  <noscript><p className="closing-nojs">Static comparison: a changed event would disagree with an independently saved reference. A missing reference means the comparison is unavailable, not verified. These controls need JavaScript.</p></noscript>
 </figure>;
}

const failures={
 internet:{label:'Internet offline',title:'Use the local care pathway.',text:'Follow hospital downtime procedures and use available local information. Online record exchange and remote protected-summary retrieval may be unavailable.',limit:'A printed public minimum may help. A URL-only credential cannot be assumed to load offline.'},
 service:{label:'Service unavailable',title:'A service outage is not permission to refuse care.',text:'Continue through local clinical workflows. Digital consent or capability services may be unavailable; an outage must not silently expand access.',limit:'Unavailable records remain unavailable. No blanket override or automatic opening of sealed information.'},
 phone:{label:'Phone unusable',title:'A working phone is not a condition for treatment.',text:'An available physical credential or assisted identity and consent workflow may help. Continue through the hospital’s existing care process.',limit:'Do not unlock an unconscious person’s phone with their biometrics. A family relationship is not treatment consent.'},
} as const;

/** Changes a fictional explanation only; never changes actual connectivity. */
export function CareContinuity(){
 const ready=useReady();const[scenario,setScenario]=useState<keyof typeof failures>('internet');const current=failures[scenario];
 return <div className="continuity-demo" data-failure-scenario={scenario}>
  <span className="outage-example-label">ILLUSTRATIVE OUTAGES / NOT LIVE SYSTEM STATUS</span>
  <div className="outage-row" role="group" aria-label="Explore care continuity scenarios">{(Object.keys(failures) as Array<keyof typeof failures>).map(key=><button type="button" key={key} disabled={!ready} aria-pressed={scenario===key} onClick={()=>setScenario(key)}>{failures[key].label}<span aria-hidden="true">{scenario===key?'—':'↗'}</span></button>)}</div>
  <svg className="human-line-art" viewBox="0 0 220 120" aria-hidden="true" fill="none"><circle cx="65" cy="26" r="13"/><path d="M30 110V77c0-36 70-36 70 0v33M50 67l15 19 15-19"/><circle cx="157" cy="26" r="13"/><path d="M122 110V77c0-36 70-36 70 0v33M143 68h28m-14-14v28"/><path className="human-connection" d="M100 91h22"/></svg>
  <h2 id="care-title">CARE<br/><em>CONTINUES.</em></h2>
  <p>JeevanRekha assists healthcare.<br/>It never becomes permission to receive healthcare.</p>
  <div className="continuity-explanation" role="status"><h3>{current.title}</h3><p>{current.text}</p><small>{current.limit}</small></div>
  <span className="care-footnote">THE PATIENT STILL GETS TREATED.</span>
  <noscript><div className="closing-nojs"><p>Service unavailable: local clinical workflows continue; no automatic access expansion.</p><p>Phone unusable: existing hospital or assisted workflows may help; never unlock an unconscious person’s phone using their biometrics.</p></div></noscript>
 </div>;
}
