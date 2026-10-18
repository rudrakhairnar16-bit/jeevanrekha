'use client';
import {useEffect,useState} from 'react';
import {Lock} from './ui';

function useReady(){const[ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);return ready;}

/** A diagram of necessary conditions, never a key operation or access grant. */
export function ProtectionDemo(){
 const ready=useReady();const[credential,setCredential]=useState(false),[service,setService]=useState(false),[context,setContext]=useState(false);
 const complete=credential&&service&&context;
 return <div className="locker-art protection-demo" data-protection-state={complete?'complete':'incomplete'}>
  <span className="protection-caption">ILLUSTRATION / NO KEYS OR RECORDS</span>
  <p className="condition-instruction">Choose example conditions. These controls simulate presence, not authentication.</p>
  <fieldset className="protection-conditions"><legend className="visually-hidden">Illustrated emergency access conditions</legend>
   <div className="key-fragments">
    <label className="protection-component"><span>COMPONENT 01</span><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 20h28v15h13v30H20z"/><circle cx="33" cy="34" r="4"/></svg><strong>Emergency<br/>credential</strong><small>Insufficient alone</small><span className="condition-check"><input type="checkbox" aria-labelledby="include-credential-label" disabled={!ready} checked={credential} onChange={e=>setCredential(e.target.checked)}/><span id="include-credential-label">Include emergency credential</span></span></label>
    <span className="fragment-plus" aria-hidden="true">+</span>
    <label className="protection-component"><span>COMPONENT 02</span><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 20h40v45H20zM28 30h24M28 40h24M28 50h12"/></svg><strong>Protected<br/>service</strong><small>Insufficient alone</small><span className="condition-check"><input type="checkbox" aria-labelledby="include-service-label" disabled={!ready} checked={service} onChange={e=>setService(e.target.checked)}/><span id="include-service-label">Include protected service</span></span></label>
   </div>
   <div className="locker-converge" aria-hidden="true"/>
   <label className="context-condition"><span><Lock/><strong>Authorized responder context</strong><small>A separate policy boundary—not a third key.</small></span><span className="condition-check"><input type="checkbox" aria-labelledby="include-context-label" disabled={!ready} checked={context} onChange={e=>setContext(e.target.checked)}/><span id="include-context-label">Include authorized responder context</span></span></label>
  </fieldset>
  <div className="protection-outcome" role="status"><span>{complete?'ALL THREE EXAMPLE CONDITIONS PRESENT':'EXAMPLE ROUTE INCOMPLETE'}</span><p>{complete?'The proposed route could permit a scoped summary after real checks. Nothing is decrypted or released here.':'A credential, a service or a role label alone is not authority to read the summary.'}</p></div>
  <div className="protected-summary"><Lock/><span>Minimum emergency summary</span><small>DIAGRAM ONLY / NO CONTENT</small></div>
  <span className="history-stays-locked"><Lock/> Complete medical history stays locked.</span>
  <button className="signal-action protection-reset" disabled={!ready||(!credential&&!service&&!context)} onClick={()=>{setCredential(false);setService(false);setContext(false);}}>Reset example<span aria-hidden="true">↺</span></button>
  <noscript><p className="signal-nojs">Static model: both components and a valid, independently checked responder context are required. No record is unlocked. JavaScript is needed to change this example.</p></noscript>
 </div>;
}

/** Fictional reporting completeness, not an epidemiological inference engine. */
export function PopulationSignal(){
 const ready=useReady();const[low,setLow]=useState(false);
 return <div className="population-experience" data-coverage-state={low?'limited':'baseline'}>
  <div className="population-art">
   <svg viewBox="0 0 620 450" className="signal-field aggregate-field" aria-hidden="true">
    {[90,160,230,300,370].map(y=><path key={y} d={`M25 ${y}H595`} className="field-grid"/>)}
    {!low&&[80,105,95,140,130,165,150,190,210,185,235,250].map((v,i)=><rect key={i} x={42+i*45} y={375-v} width="16" height={v} className="period-bar"/>)}
   </svg>
   <div className="district-signal" role="status"><span className="panel-overline">SYNTHETIC DISTRICT SIGNAL</span><div><span className="signal-dot"/><strong>Vadodara District</strong><span className="signal-up" aria-hidden="true">{low?'—':'↗'}</span></div><h3>Respiratory signal</h3><div className="district-metrics"><div><strong>{low?'43':'81'}<span>%</span></strong><small>REPORTING COVERAGE</small></div><div><strong>{low?'Low':'Medium'}</strong><small>CONFIDENCE</small></div></div><p>{low?'Trend uncertain · Restore reporting before comparison':'Unusual trend · Investigation recommended'}</p></div>
   <span className="field-note">{low?'REPORTING GAPS · COMPARISON PAUSED':'AGGREGATE PERIODS ONLY · NOT A GEOGRAPHIC MAP'}</span>
  </div>
  <div className="coverage-reading"><span>{low?'43':'81'} / 100 expected reports received</span><p>Missing reports are not zero cases.</p></div>
  <button className="signal-action coverage-toggle" disabled={!ready} onClick={()=>setLow(!low)}>{low?'Restore baseline example':'Illustrate missing reports'}<span aria-hidden="true">{low?'↺':'→'}</span></button>
  <p className="signal-caution">Two fictional scenarios, not a validated statistical threshold. No outbreak is declared and no alert is sent.</p>
  <noscript><p className="signal-nojs">With fewer reports, confidence may fall; missing reports cannot be treated as zero cases. This static illustration does not compute a trend.</p></noscript>
 </div>;
}

const pathA=['M100 0C100 40 135 50 135 95','M300 0C300 50 135 45 135 95','M500 0C500 60 135 30 135 95'];
const pathB=['M100 0C100 60 465 30 465 95','M300 0C300 50 465 45 465 95','M500 0C500 40 465 50 465 95'];
/** Both branches always remain visible; trace controls change emphasis only. */
export function AggregationDemo(){
 const ready=useReady();const[trace,setTrace]=useState<'both'|'a'|'b'>('both');
 return <div className="aggregation-demo" data-trace-path={trace}>
  <div className="aggregation-trace" role="group" aria-label="Trace separate aggregation paths">{([['a','Trace path A'],['b','Trace path B'],['both','Show both paths']] as const).map(([value,label])=><button key={value} disabled={!ready} aria-pressed={trace===value} onClick={()=>setTrace(value)}>{label}</button>)}</div>
  <div className="aggregation-pipeline">
   <div className="pipeline-source"><span>Hospital A</span><span>Lab B</span><span>Hospital C</span></div>
   <svg className="protected-paths" viewBox="0 0 600 95" preserveAspectRatio="none" role="img" aria-label="Each of three facilities contributes a protected share to Aggregator A and another protected share to Aggregator B. Neither branch is a patient list.">
    <g className="aggregation-path-bases">{[...pathA,...pathB].map(d=><path key={d} d={d}/>)}</g>
    <g className="aggregation-path-a">{pathA.map(d=><path key={d} d={d} pathLength="1"/>)}</g>
    <g className="aggregation-path-b">{pathB.map(d=><path key={d} d={d} pathLength="1"/>)}</g>
   </svg>
   <div className="aggregation-pair"><div className="aggregator-a"><small>SEPARATE TRUST DOMAIN</small><h3>Aggregator A</h3><span>Protected contribution A</span></div><span aria-hidden="true">+</span><div className="aggregator-b"><small>SEPARATE TRUST DOMAIN</small><h3>Aggregator B</h3><span>Protected contribution B</span></div></div>
   <div className="split-lines inverted" aria-hidden="true"/>
   <div className="aggregate-release"><Lock/><span>Privacy controls</span><b aria-hidden="true">→</b><strong>District statistic</strong></div>
  </div>
  <p className="aggregation-trace-reading" role="status">{trace==='both'?'Each facility has two separate contribution paths. Neither operator alone is intended to reconstruct its input.':`Path ${trace.toUpperCase()} is emphasized. The other contribution path remains separate and visible; no data has been sent.`}</p>
  <span className="aggregation-demo-note">CONCEPTUAL ROUTING ONLY / NO SHARES, COMPUTATION OR PRIVACY PROOF</span>
  <details className="aggregation-limits"><summary>What this protection depends on</summary><div><p><strong>Independent operators.</strong> Separation depends on non-collusion and a reviewed protocol, not on drawing two boxes.</p><p><strong>Truth still needs checking.</strong> Encoding or range-validity checks cannot prove that a diagnosis or source report is true.</p><p><strong>Careful release policy.</strong> Minimum groups, repeat-release controls and reviewed differential-privacy accounting need a specified threat model. Small-cell suppression alone is not differential privacy.</p><p><strong>Count the right thing.</strong> A sum of facility-distinct counts is not district-wide unique patients. No cross-facility deduplication is demonstrated.</p></div></details>
  <noscript><p className="signal-nojs">Both contribution paths are shown. The expandable protection limits work without JavaScript. This illustration performs no cryptographic calculation.</p></noscript>
 </div>;
}
