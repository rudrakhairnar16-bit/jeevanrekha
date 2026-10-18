import { Lock, Mark } from './ui';

/** Story prop only: no identity lookup, QR payload or live credential. */
export function Credential({compact=false}:{compact?:boolean}) {
 return <div className={`health-card ${compact?'compact-card':''}`}><div className="health-card-head"><span><Mark small/>JeevanRekha</span><span>EMERGENCY<br/>CREDENTIAL</span></div><div className="card-chip" aria-hidden="true"><i/><i/><i/></div><div className="card-owner"><div><small>YOUR CARE. YOUR CONTROL.</small><strong>Rahul Mehta</strong><span>Fictional profile · Concept only</span></div><svg viewBox="0 0 70 70" role="img" aria-label="Decorative pattern, not a scannable QR"><path d="M3 3h18v18H3zM49 3h18v18H49zM3 49h18v18H3z" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M8 8h8v8H8zm46 0h8v8h-8zM8 54h8v8H8zM28 3h5v14h-5zm10 8h6v18h-6zM26 23h7v8h-7zM3 28h13v6H3zm18 7h11v7H21zM36 36h8v8h-8zm13-9h6v14h-6zm12 5h6v8h-6zM27 49h7v18h-7zm12 0h12v6H39zm0 12h6v6h-6zm17-15h5v8h-5zm0 15h11v6H56zM3 39h6v5H3z" fill="currentColor"/></svg></div><div className="health-card-foot"><span><i/>Protected by permission</span><Lock/></div></div>;
}
