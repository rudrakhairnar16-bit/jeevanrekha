'use client';

import {useEffect} from 'react';

/** Progressive enhancement only. Native scroll is never intercepted.
 * All semantic narrative remains server-rendered. Only Acts I–IV are addressed.
 * Cache geometry on resize/font load; one rAF at most per scroll event burst.
 */
export function EmergencyMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.rebuilt');
  const hero=document.querySelector<HTMLElement>('.cinema-hero');
  const publicScene=document.getElementById('public-minimum');
  const responder=document.getElementById('verified-help');
  const alert=document.getElementById('family-alert');
  const phone=document.querySelector<HTMLElement>('.notification-stage');
  if(!root||!hero||!publicScene||!responder||!alert||!phone)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const desktop=matchMedia('(min-width: 701px)');
  let frame=0,disposed=false;
  let bounds={hero:0,public:0,responder:0,alert:0,phone:0,heroHeight:1,height:1};
  const clamp=(value:number)=>Math.min(1,Math.max(0,value));
  const locate=(element:HTMLElement)=>element.getBoundingClientRect().top+scrollY;
  const clear=()=>{
   root.removeAttribute('data-motion');root.removeAttribute('data-emergency-stage');
   for(const name of ['--hero-travel','--scan-travel','--responder-travel','--alert-travel'])root.style.removeProperty(name);
  };
  const draw=()=>{
   frame=0;if(disposed)return;
   if(reduced.matches){clear();return;}
   const y=scrollY,h=bounds.height;
   const heroP=clamp((y-bounds.hero)/bounds.heroHeight);
   const scanP=clamp((y-bounds.public+h*.12)/(h*.58));
   const responderP=clamp((y-bounds.responder+h*.5)/(h*.45));
   const alertP=clamp((y-bounds.phone+h*.68)/(h*.45));
   // Clamped, unchanged values cause no style writes outside this chapter.
   const values:Record<string,number>={'--hero-travel':heroP,'--scan-travel':scanP,'--responder-travel':responderP,'--alert-travel':alertP};
   for(const [name,value] of Object.entries(values)){
    const next=value.toFixed(4);if(root.style.getPropertyValue(name)!==next)root.style.setProperty(name,next);
   }
   const mode=desktop.matches?'desktop':'mobile';
   const stage=responderP>.55?'responder':'public';
   if(root.dataset.motion!==mode)root.dataset.motion=mode;
   if(root.dataset.emergencyStage!==stage)root.dataset.emergencyStage=stage;
  };
  const queue=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
  const measure=()=>{
   bounds={hero:locate(hero),public:locate(publicScene),responder:locate(responder),alert:locate(alert),phone:locate(phone),heroHeight:hero.offsetHeight,height:innerHeight};
   queue();
  };
  // Measure untransformed phone position to avoid feedback from its own entrance.
  const refresh=()=>{
   const transform=phone.style.transform;
   phone.style.transform='none';measure();phone.style.transform=transform;
  };
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',refresh,{passive:true});
  addEventListener('pageshow',refresh);
  reduced.addEventListener('change',refresh);desktop.addEventListener('change',refresh);
  const observer=new ResizeObserver(refresh);observer.observe(hero);observer.observe(publicScene);observer.observe(responder);observer.observe(alert);
  document.fonts.ready.then(()=>{if(!disposed)refresh();});
  refresh();
  return()=>{
   disposed=true;cancelAnimationFrame(frame);observer.disconnect();
   removeEventListener('scroll',queue);removeEventListener('resize',refresh);removeEventListener('pageshow',refresh);
   reduced.removeEventListener('change',refresh);desktop.removeEventListener('change',refresh);clear();
  };
 },[]);
 return null;
}
