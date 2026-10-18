import type { ReactNode } from 'react';
export function Mark({small=false}: {small?: boolean}) {
  return <svg aria-hidden="true" viewBox="0 0 40 40" className={small?'mark small':'mark'} fill="none"><path d="M10 11v13c0 7 9 9 13 4l8-13" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/><path d="m6 20 9-1 5-9 3 13 5-4h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function Arrow({diagonal=false}: {diagonal?: boolean}) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="arrow"><path d={diagonal?'M6 18 18 6M6 6h12v12':'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function LinkButton({href,children,secondary=false}: {href:string;children:ReactNode;secondary?:boolean}) {
  return <a href={href} className={`button ${secondary?'secondary':''}`}>{children}<Arrow/></a>;
}
export function Lock() {return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" width="16" height="16"><rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor"/><path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor"/></svg>}
