import {Credential} from './experience';
import {Lock} from './ui';

/** Animated visual actor only. Accessible tier descriptions live beside this stage. */
export function EmergencyStage(){return <aside className="emergency-anchor" aria-label="Illustrative emergency credential">
 <div className="emergency-scene-grid" aria-hidden="true"/>
 <span className="scene-coordinate">FICTIONAL SCENARIO / 14:32</span>
 <div className="stage-heading" aria-hidden="true"><span>ONE CREDENTIAL.</span><strong>Carefully defined access.</strong></div>
 <Credential compact/>
 <div className="scan-brackets" aria-hidden="true"><i/><i/><i/><i/><span className="scan-sweep"/></div>
 <div className="stage-public" aria-hidden="true"><div className="stage-connector"/><span className="stage-state-label">PUBLIC SCAN / TIER 0</span><div className="stage-public-row"><span>Critical allergy</span><b>Visible</b></div><div className="stage-public-row"><span>Communication assistance</span><b>Visible</b></div><small>Only the information its owner made public.</small></div>
 <div className="stage-authorization" aria-hidden="true"><div className="stage-responder"><span className="responder-portrait"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="15" r="7"/><path d="M9 42v-8c0-18 30-18 30 0v8M19 30h10m-5-5v10"/></svg><b>✓</b></span><div><small>SEPARATE AUTHORIZATION</small><strong>Verified<br/>responder</strong></div></div><div className="stage-connection"/><div className="stage-summary"><span>LIMITED EMERGENCY SUMMARY</span><strong>Relevant to this emergency.<br/>Never the complete history.</strong><div className="summary-scope"><span>Critical risks</span><span>Urgent care context</span></div><small>Credential + verified responder context</small></div><span className="stage-simulation">VISUAL SIMULATION · NOT LIVE VERIFICATION</span></div>
 <div className="stage-permanent-lock"><Lock/><span>COMPLETE MEDICAL HISTORY</span><strong>Locked</strong></div>
 <div className="scan-caption"><span className="signal-dot"/> IDENTITY STILL NEEDS CONFIRMATION.<br/><small>A QR IS NOT PROOF OF PHYSICAL PRESENCE.</small></div>
 <div className="stage-sequence" aria-hidden="true"><span className="sequence-public">01 Public minimum</span><i/><span className="sequence-responder">02 Verified context</span></div>
 </aside>}
