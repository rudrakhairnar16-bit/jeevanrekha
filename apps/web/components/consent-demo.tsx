'use client';

import {useEffect,useRef,useState} from 'react';
import {Lock} from './ui';

type Choice='request'|'allowed'|'denied'|'revoked'|'expired';
const scopes=[{id:'labs',label:'Laboratory reports'},{id:'prescriptions',label:'Previous prescriptions'}] as const;

/** Local explanatory state only. No API, storage, grant token or medical records. */
export function ConsentDemo({onIllustrationChange}:{onIllustrationChange?:(choice:string,count:number)=>void}={}){
 const [ready,setReady]=useState(false);
 const [choice,setChoice]=useState<Choice>('request');
 const [selected,setSelected]=useState<string[]>([]);
 const [shared,setShared]=useState<string[]>([]);
 const heading=useRef<HTMLHeadingElement>(null);
 const firstChoice=useRef<HTMLInputElement>(null);
 const shouldFocus=useRef(false);
 useEffect(()=>setReady(true),[]);
 useEffect(()=>{onIllustrationChange?.(choice,shared.length);},[choice,shared,onIllustrationChange]);
 useEffect(()=>()=>onIllustrationChange?.('request',0),[onIllustrationChange]);
 useEffect(()=>{
  if(!shouldFocus.current)return;
  if(choice==='request')firstChoice.current?.focus({preventScroll:true});
  else heading.current?.focus({preventScroll:true});
  shouldFocus.current=false;
 },[choice]);
 const decide=(next:Choice)=>{
  shouldFocus.current=true;
  if(next==='allowed'){
   if(!selected.length)return;
   setShared([...selected]);
  }
  setChoice(next);
 };
 const reset=()=>{setSelected([]);setShared([]);decide('request');};
 const toggle=(id:string)=>setSelected(old=>old.includes(id)?old.filter(item=>item!==id):[...old,id]);
 const labels=shared.map(id=>scopes.find(scope=>scope.id===id)!.label);
 const outcome={
  request:'Review the request.',
  allowed:'Only what you chose.',
  denied:'No sharing. Care continues.',
  revoked:'Permission withdrawn.',
  expired:'Time is up. Access ends.',
 }[choice];
 return <figure className={`consent-demo consent-interactive ${choice}`} data-consent-state={choice}>
  <figcaption className="panel-overline"><span>{choice==='request'?'REQUEST TO SHARE':'YOUR DECISION'}</span><span>ILLUSTRATIVE DEMO</span></figcaption>
  <div className="consent-demo-disclaimer">A fictional request. No real records or clinical access.</div>
  {choice==='request'?<>
   <div className="consent-who"><span className="annotation">01 / WHO</span><div className="professional"><div className="professional-avatar">DS</div><div><strong>Dr. Sharma</strong><span>XYZ Hospital · fictional example</span></div></div></div>
   <fieldset className="consent-scope" disabled={!ready} aria-describedby="scope-instruction"><legend className="annotation">02 / WHAT</legend><p id="scope-instruction">Choose what to include. Nothing is selected for you.</p>
    {scopes.map((scope,index)=><label className={`scope-option ${selected.includes(scope.id)?'chosen':''}`} key={scope.id}><span><input ref={index===0?firstChoice:undefined} type="checkbox" checked={selected.includes(scope.id)} onChange={()=>toggle(scope.id)}/><span>{scope.label}</span></span><small>Requested</small></label>)}
   </fieldset>
   <div className="permission-line restricted"><span><Lock/> Other medical records</span><small>Not included</small></div>
   <div className="request-terms"><div><small>03 / WHY</small><span>Current treatment</span></div><div><small>04 / HOW LONG</small><span>2 hours</span></div></div>
   <div className="consent-buttons" role="group" aria-label="Illustrative consent decision"><button type="button" disabled={!ready||!selected.length} onClick={()=>decide('allowed')}>Allow selected records <span aria-hidden="true">↗</span></button><button type="button" disabled={!ready} onClick={()=>decide('denied')}>Deny request</button></div>
   <p className="consent-selection-hint" aria-live="polite">{selected.length?`${selected.length} ${selected.length===1?'category':'categories'} selected. Everything else stays locked.`:'Select at least one category to try Allow, or choose Deny.'}</p>
   <noscript><div className="consent-nojs"><p>This illustration needs JavaScript for the choices. The boundaries still apply:</p><p><strong>Allow:</strong> selected labs and/or prescriptions only, for current treatment, for two hours. Other records stay locked.</p><p><strong>Deny:</strong> no sharing. Care continues.</p></div></noscript>
  </>:<section className="consent-outcome" aria-labelledby="consent-outcome-title">
   <span className="outcome-symbol" aria-hidden="true">{choice==='allowed'?'↗':choice==='expired'?'◷':<Lock/>}</span>
   <h3 id="consent-outcome-title" ref={heading} tabIndex={-1}>{outcome}</h3>
   {choice==='allowed'?<>
    <p className="outcome-explanation">Illustrative permission for Dr. Sharma, XYZ Hospital. Current treatment · 2 hours.</p>
    <ul className="allowed-records" aria-label="Illustratively permitted categories">{labels.map(label=><li key={label}><span aria-hidden="true">✓</span>{label}<small>Included in this illustration</small></li>)}</ul>
    <div className="outcome-lock"><Lock/><span>{shared.length===1?'Unselected categories and all other records stay locked.':'All other medical records stay locked.'}</span></div>
    <div className="lifecycle-demo"><span className="annotation">PERMISSION ALSO HAS AN END</span><p>Try withdrawing permission, or illustrate what happens after two hours.</p><div className="lifecycle-actions"><button type="button" onClick={()=>decide('revoked')}>Revoke illustration</button><button type="button" onClick={()=>decide('expired')}>Illustrate expiry</button></div></div>
   </>:<>
    <p className="outcome-explanation">{choice==='denied'?'No records are shared in this illustration. Denying data access must not prevent treatment.':choice==='revoked'?'Future access ends in this illustration. Revocation cannot remotely erase copies already received.':'The illustrated two-hour window has ended. A new request would need a new decision.'}</p>
    <div className="closed-scope"><Lock/><span>No future record access<br/>under this illustrative request.</span></div>
    <p className="outcome-care">Care continues.</p>
   </>}
   <button type="button" className="consent-reset" onClick={reset}>Try the request again <span aria-hidden="true">↺</span></button>
  </section>}
  <p className="consent-result">Illustration only. No permission is granted and no records are shared. Choices reset on reload.</p>
 </figure>;
}
