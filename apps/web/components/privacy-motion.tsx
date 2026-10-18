'use client';
import {useEffect} from 'react';

/** VII–VIII progressive enhancement: direct exchange, then linked protection. */
export function PrivacyMotion(){
 useEffect(()=>{
  const network=document.querySelector<HTMLElement>('.network-experience');
  const art=document.querySelector<HTMLElement>('.network-art');
  const boundary=document.querySelector<HTMLElement>('.sealed-experience');
  if(!network||!art||!boundary)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,disposed=false,height=1,networkTop=0,boundaryTop=0;
  const clear=()=>{network.removeAttribute('data-network-motion');network.style.removeProperty('--network-flow');boundary.removeAttribute('data-boundary-motion');boundary.style.removeProperty('--boundary-flow');};
  const draw=()=>{
   frame=0;if(disposed)return;if(reduced.matches){clear();return;}
   const values=[[network,networkTop,'--network-flow','data-network-motion'],[boundary,boundaryTop,'--boundary-flow','data-boundary-motion']] as const;
   for(const[el,top,variable,attribute]of values){
    const value=Math.max(0,Math.min(1,(scrollY-top+height*.65)/(height*.55))).toFixed(4);
    if(el.style.getPropertyValue(variable)!==value)el.style.setProperty(variable,value);
    if(!el.hasAttribute(attribute))el.setAttribute(attribute,'enabled');
   }
  };
  const queue=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
  const measure=()=>{networkTop=art.getBoundingClientRect().top+scrollY;boundaryTop=boundary.getBoundingClientRect().top+scrollY;height=innerHeight;queue();};
  const observer=new ResizeObserver(measure);observer.observe(art);observer.observe(boundary);
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);reduced.addEventListener('change',measure);
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',queue);removeEventListener('resize',measure);removeEventListener('pageshow',measure);reduced.removeEventListener('change',measure);clear();};
 },[]);
 return null;
}
