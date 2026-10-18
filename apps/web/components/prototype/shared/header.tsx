import React from 'react';
import { Mark } from '../../ui';
import { ProtoIcon } from './icons';
import { ProtoStatus } from './status-badge';
import { usePrototype } from '../state';
import type { Role } from '../types';

export const ROLE_DEFINITIONS: { id: Role; label: string; sub: string; icon: string; category: string }[] = [
  { id: 'citizen', label: 'Citizen', sub: 'Health timeline, scoped consent & emergency card', icon: 'user', category: 'Core Roles' },
  { id: 'doctor', label: 'Clinician / Doctor', sub: 'Identity verification, scoped request & expiry', icon: 'cross', category: 'Core Roles' },
  { id: 'responder', label: 'Emergency Responder', sub: 'Tier 0 public QR → verified Tier 1 summary', icon: 'ambulance', category: 'Core Roles' },
  { id: 'family', label: 'Family Caregiver', sub: 'Capability-based care without surveillance', icon: 'family', category: 'Core Roles' },
  { id: 'public-health', label: 'Public Health', sub: 'District respiratory signals & reporting coverage', icon: 'chart', category: 'Intelligence' },
  { id: 'security', label: 'Security & Audit', sub: 'Access events, anomalies & tamper evidence', icon: 'eye', category: 'Intelligence' },
  { id: 'architecture', label: 'Trust Architecture', sub: 'Federated records vs trust & access layer', icon: 'database', category: 'Architecture & Labs' },
  { id: 'emergency-lab', label: 'Emergency Protection Lab', sub: 'Two-part access secret & attack simulation', icon: 'shield', category: 'Architecture & Labs' },
  { id: 'aggregation-lab', label: 'Secure Aggregation Lab', sub: 'Prio/VDAF-style 2-path privacy aggregation', icon: 'lock', category: 'Architecture & Labs' },
  { id: 'failure-lab', label: 'Resilience & Failure Lab', sub: 'What fails safely: CARE CONTINUES', icon: 'wifiOff', category: 'Architecture & Labs' },
];

export function ProtoHeader() {
  const { role, setRole, resetAll, juryStep } = usePrototype();

  const currentRoleDef = ROLE_DEFINITIONS.find(r => r.id === role);

  return (
    <header className="p-top">
      <div className="p-brand-group">
        <button className="p-brand" onClick={() => setRole('hub')} title="Return to Prototype Hub">
          <Mark />
          <div>
            <span className="p-brand-title">JeevanRekha.</span>
            <small className="p-brand-badge">INTERACTIVE PROTOTYPE</small>
          </div>
        </button>
      </div>

      <nav className="p-top-nav">
        <button
          className={`p-nav-link ${role === 'hub' ? 'active' : ''}`}
          onClick={() => setRole('hub')}
        >
          Prototype Hub
        </button>
        <a href="/" className="p-nav-link">
          Cinematic Story ↗
        </a>
        <a href="/architecture" className="p-nav-link">
          Architecture ↗
        </a>
      </nav>

      <div className="p-top-controls">
        <span className="p-demo-pill" title="All identities, hospitals and records in this prototype are synthetic.">
          SYNTHETIC ECOSYSTEM · NO LIVE DATA
        </span>

        <button
          className="p-reset-btn"
          onClick={resetAll}
          title="Reset all prototype interactions to initial baseline"
        >
          <ProtoIcon name="refresh" className="p-mini-icon" /> Reset Demo
        </button>
      </div>
    </header>
  );
}

export function ProtoRoleBar() {
  const { role, setRole, juryStep } = usePrototype();
  if (role === 'hub') return null;

  const currentRole = ROLE_DEFINITIONS.find(r => r.id === role);

  return (
    <div className="p-rolebar">
      <button className="p-back-hub" onClick={() => setRole('hub')}>
        ← All Workspaces
      </button>

      <div className="p-rolebar-current">
        <span className="p-rolebar-label">ACTIVE ROLE:</span>
        <b className="p-rolebar-name">{currentRole?.label || 'Workspace'}</b>
        <span className="p-rolebar-sub">{currentRole?.sub}</span>
      </div>

      <div className="p-rolebar-right">
        <ProtoStatus tone="teal" pulsing={juryStep > 0}>
          {juryStep > 0 ? `Jury Mode Active (Step ${juryStep}/20)` : 'Interactive State Synced'}
        </ProtoStatus>
      </div>
    </div>
  );
}
