'use client';

import {useEffect} from 'react';

/** V–VI: the exceptional access path ends before a separate ordinary request. */
export function RoutineMotion(){
 useEffect(()=>{
  const reset=document.getElementById('ordinary-visit');
  const consent=document.getElementById('doctor-consent');
  if(!reset||!consent)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,disposed=false,resetTop=0,consentTop=0,height=1;
  const clamp=(n:number)=>Math.max(0,Math.min(1,n));
  const clear=()=>{for(const el of[reset,consent]){el.removeAttribute('data-routine-motion');el.style.removeProperty('--routine-progress');}};
  const draw=()=>{
   frame=0;if(disposed)return;
   if(reduced.matches){clear();return;}
   for(const [el,top] of [[reset,resetTop],[consent,consentTop]] as const){
    const value=clamp((scrollY-top+height*.65)/(height*.5)).toFixed(4);
    if(el.style.getPropertyValue('--routine-progress')!==value)el.style.setProperty('--routine-progress',value);
    if(!el.hasAttribute('data-routine-motion'))el.setAttribute('data-routine-motion','enabled');
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const measure=()=>{resetTop=reset.getBoundingClientRect().top+scrollY;consentTop=consent.getBoundingClientRect().top+scrollY;height=innerHeight;queue();};
  const observer=new ResizeObserver(measure);observer.observe(reset);observer.observe(consent);
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);reduced.addEventListener('change',measure);
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',queue);removeEventListener('resize',measure);removeEventListener('pageshow',measure);reduced.removeEventListener('change',measure);clear();};
 },[]);
 return null;
}
