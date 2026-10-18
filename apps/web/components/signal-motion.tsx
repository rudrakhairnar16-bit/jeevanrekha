'use client';
import {useEffect} from 'react';

/** Decorative native-scroll enhancement only. Never changes permissions or statistics. */
export function SignalMotion(){
 useEffect(()=>{
  const elements=['.protection-demo','.population-experience','.aggregation-demo'].map(selector=>document.querySelector<HTMLElement>(selector));
  if(elements.some(element=>!element))return;
  const roots=elements as HTMLElement[];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:701px)');
  let disposed=false,frame=0,height=1;let tops:number[]=[];
  const clear=()=>roots.forEach(element=>{element.removeAttribute('data-signal-motion');element.style.removeProperty('--signal-progress');});
  const draw=()=>{
   frame=0;if(disposed)return;
   if(reduced.matches||!desktop.matches){clear();return;}
   roots.forEach((element,index)=>{
    const progress=Math.max(0,Math.min(1,(scrollY-tops[index]+height*.72)/(height*.55))).toFixed(4);
    if(element.style.getPropertyValue('--signal-progress')!==progress)element.style.setProperty('--signal-progress',progress);
    if(!element.hasAttribute('data-signal-motion'))element.setAttribute('data-signal-motion','enabled');
   });
  };
  const queue=()=>{if(!disposed&&!frame)frame=requestAnimationFrame(draw);};
  const measure=()=>{tops=roots.map(element=>element.getBoundingClientRect().top+scrollY);height=innerHeight;queue();};
  const observer=new ResizeObserver(measure);roots.forEach(root=>observer.observe(root));
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
  reduced.addEventListener('change',measure);desktop.addEventListener('change',measure);
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',queue);removeEventListener('resize',measure);removeEventListener('pageshow',measure);reduced.removeEventListener('change',measure);desktop.removeEventListener('change',measure);clear();};
 },[]);
 return null;
}
