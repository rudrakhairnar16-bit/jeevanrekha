'use client';
import {useEffect} from 'react';

/** Closing emphasis only. Native scroll never verifies evidence or changes an outage. */
export function ClosingMotion(){
 useEffect(()=>{
  const elements=['.evidence-interactive','.continuity-demo','.cinema-finale'].map(selector=>document.querySelector<HTMLElement>(selector));
  if(elements.some(element=>!element))return;
  const roots=elements as HTMLElement[],desktop=matchMedia('(min-width:701px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let frame=0,disposed=false,height=1;let tops:number[]=[];
  const clear=()=>roots.forEach(root=>{root.removeAttribute('data-closing-motion');root.style.removeProperty('--closing-progress');});
  const draw=()=>{
   frame=0;if(disposed)return;if(!desktop.matches||reduced.matches){clear();return;}
   roots.forEach((root,index)=>{
    const progress=Math.max(0,Math.min(1,(scrollY-tops[index]+height*.6)/(height*.55))).toFixed(4);
    if(root.style.getPropertyValue('--closing-progress')!==progress)root.style.setProperty('--closing-progress',progress);
    if(!root.hasAttribute('data-closing-motion'))root.setAttribute('data-closing-motion','enabled');
   });
  };
  const queue=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
  const measure=()=>{height=innerHeight;tops=roots.map(root=>root.getBoundingClientRect().top+scrollY);queue();};
  const observer=new ResizeObserver(measure);roots.forEach(root=>observer.observe(root));
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);desktop.addEventListener('change',measure);reduced.addEventListener('change',measure);
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',queue);removeEventListener('resize',measure);removeEventListener('pageshow',measure);desktop.removeEventListener('change',measure);reduced.removeEventListener('change',measure);clear();};
 },[]);
 return null;
}
