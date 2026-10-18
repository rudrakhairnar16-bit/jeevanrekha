'use client';

import {useEffect,useState} from 'react';
import {Lock,Mark} from './ui';

function useDemoReady(){const[ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);return ready;}

/** Independent, explicitly fictional exchange. Does not consume the consent demo. */
export function NetworkExchange(){
 const ready=useDemoReady();const[expired,setExpired]=useState(false);
 return <div className="network-experience" data-exchange-state={expired?'expired':'authorized'}>
  <div className="network-example-note"><span>SEPARATE ILLUSTRATIVE SCENARIO</span><p>This diagram does not use or grant your consent choice above.</p></div>
  <div className="network-art" role="img" aria-label={`Records remain at Hospital A, Lab B, Hospital C and Diagnostic Centre D. JeevanRekha coordinates trust, not a central record warehouse. ${expired?'The illustrated Lab B to Hospital A exchange is expired and closed.':'A fictional two-hour lab-report exchange from Lab B to Hospital A is authorized in this separate example.'}`}>
   <svg viewBox="0 0 600 440" aria-hidden="true" className="network-lines">
    <defs><marker id="exchange-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" strokeWidth="1"/></marker></defs>
    <path className="trust-links" d="M110 85C110 205 300 110 300 215M490 85C490 205 300 110 300 215M110 355C110 225 300 330 300 215M490 355C490 225 300 330 300 215" strokeDasharray="2 6"/>
    <path className="exchange-base" d="M450 65H150"/><path className="authorized-exchange" d="M450 65H150" markerEnd={expired?undefined:'url(#exchange-arrow)'}/>
    <text x="300" y="47" textAnchor="middle" fill="#385d3e" fontSize="7" letterSpacing="1">{expired?'EXPIRED · PATH CLOSED':'LAB B → HOSPITAL A · LAB REPORTS · 2 HOURS'}</text>
    {!expired&&<circle className="authorized-packet" cx="450" cy="65" r="3"/>}
    <path d="M150 370H450" strokeDasharray="4 5" style={{stroke:'#8f9888'}}/>
    <text x="300" y="395" textAnchor="middle" fill="#52654e" fontSize="7" letterSpacing="1">EXPIRED PERMISSION · PATH CLOSED</text>
    <circle cx="300" cy="220" r="95"/><circle cx="300" cy="220" r="137" strokeDasharray="2 10"/>
   </svg>
   <div className="network-facility facility-a"><span>01 / PROVIDER</span><strong>Hospital A</strong><small>Clinical records stay here</small></div>
   <div className="network-facility facility-b"><span>02 / PROVIDER</span><strong>Lab B</strong><small>Lab results stay here</small></div>
   <div className="network-facility facility-c"><span>03 / PROVIDER</span><strong>Hospital C</strong><small>Visit history stays here</small></div>
   <div className="network-facility facility-d"><span>04 / PROVIDER</span><strong>Diagnostic Centre D</strong><small>Reports stay here</small></div>
   <div className="network-center"><Mark/><strong>JeevanRekha</strong><span>TRUST & ACCESS LAYER</span></div>
  </div>
  <div className="network-permissions"><span><i/> Authorized, time-limited exchange</span><span className="expired-path"><i/> Expired · no access</span></div>
  <div className="exchange-control"><div role="status" className="exchange-status"><span>{expired?'ILLUSTRATED ACCESS / EXPIRED':'ILLUSTRATED ACCESS / AUTHORIZED'}</span><strong>{expired?'The path closes. Records stay.':'Lab B → Hospital A'}</strong><p>{expired?'No new exchange under this expired example. Data already received cannot be remotely erased.':'Lab reports only. Current treatment. Two hours. No complete-history permission.'}</p></div><button type="button" disabled={!ready} onClick={()=>setExpired(!expired)}>{expired?'Replay authorized example':'Illustrate exchange expiry'}<span aria-hidden="true">{expired?'↺':'→'}</span></button></div>
  <noscript><p className="privacy-nojs">Static example: after two hours, the illustrated lab-report path closes. Provider records stay at their sources. JavaScript is needed to switch this demonstration.</p></noscript>
  <p className="privacy-disclaimer">Conceptual illustration. No provider connection, actual transfer or clinical authorization.</p>
 </div>;
}

/** Trace relationships, never disclose a sensitive episode or its details. */
export function SealedBoundary(){
 const ready=useDemoReady();const[traced,setTraced]=useState(false);
 return <div className="sealed-experience" data-boundary-state={traced?'relationships':'overview'}>
  <div className="sealed-art"><span className="boundary-corner corner-tl"/><span className="boundary-corner corner-tr"/><span className="boundary-corner corner-bl"/><span className="boundary-corner corner-br"/>
   <span className="boundary-label"><Lock/> ONE PRIVACY BOUNDARY</span>
   <div className="sealed-file"><span className="file-lines" aria-hidden="true"/><strong>Sensitive clinical episode</strong><Lock/></div>
   <div className="relationship-thread"><span/>RELATED INFORMATION<span/></div>
   <div className="sealed-file medicine-file"><span className="pill-art" aria-hidden="true"/><strong>Linked prescription</strong><Lock/></div>
   <div className="linked-private-items"><span><Lock/> Related test</span><span><Lock/> Revealing metadata</span></div>
   <span className="sealed-art-caption">PROTECT THE RELATIONSHIP.<br/>NOT JUST THE FIELD.</span>
  </div>
  <div className="boundary-explanation" role="status"><span className="boundary-state"><Lock/>{traced?'ALL RELATED INFORMATION REMAINS SEALED':'SEALED / NO DETAILS SHOWN'}</span><p>{traced?'A prescription, test or metadata can reveal the episode. The proposed boundary covers the relationship—not only the diagnosis field.':'Generic labels only. No actual diagnosis, medication, test result or patient information is displayed.'}</p></div>
  <button className="trace-boundary" type="button" disabled={!ready} aria-pressed={traced} onClick={()=>setTraced(!traced)}>{traced?'Reset boundary view':'Trace linked information'}<span aria-hidden="true">{traced?'↺':'↗'}</span></button>
  <noscript><p className="privacy-nojs">The episode, prescription, related test and revealing metadata all remain within this illustrated privacy boundary.</p></noscript>
 </div>;
}

/** Capability grant illustration only; no reminder, contact or medical data. */
export function FamilyDemo(){
 const ready=useDemoReady();const[enabled,setEnabled]=useState(false);
 return <figure className="family-demo family-interactive" data-reminder-state={enabled?'enabled':'off'}>
  <figcaption className="eyebrow">A FAMILY RELATIONSHIP IS NOT A PERMISSION</figcaption>
  <div className="caregiver-avatar" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="32" r="14"/><path d="M20 88v-8c0-37 60-37 60 0v8M36 59l14 17 14-17"/></svg></div>
  <div className="family-setting"><span className="family-decision" aria-hidden="true">{enabled?'✓':'—'}</span><div><strong>Help me remember<br/>my medication.</strong><span>{enabled?'Reminder-only permission illustrated.':'Not enabled. Always a separate choice.'}</span></div></div>
  <div className="family-capability-control"><span>Medication reminders<br/><small>Illustration only</small></span><button type="button" role="switch" aria-checked={enabled} aria-label="Medication reminder permission" disabled={!ready} onClick={()=>setEnabled(!enabled)}><span className="switch-track" aria-hidden="true"><i/></span><span>{enabled?'On':'Off'}</span></button></div>
  <div className="family-setting disabled-setting"><Lock/><div><strong>See my complete<br/>medical history.</strong><span>Not included. Remains locked.</span></div></div>
  <div className="family-reminder-preview" role="status"><span className="annotation">GENERIC REMINDER PREVIEW</span><p>{enabled?'A care reminder is due.':'No reminder permission.'}</p><small>{enabled?'No diagnosis. No medicine name. No medical history.':'Enable the illustration above to see the limited message.'}</small></div>
  <p>Separate capabilities. Separate choices.</p><small>Fictional caregiver. No reminders or messages are sent. This permission is not treatment consent.</small>
  <noscript><p className="privacy-nojs">With JavaScript off, this is a static comparison. Reminder assistance never automatically includes complete-history access.</p></noscript>
 </figure>;
}
