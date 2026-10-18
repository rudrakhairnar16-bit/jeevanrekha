import React, { type CSSProperties } from 'react';
import { Mark } from '../../ui';
import { ProtoIcon } from '../shared/icons';
import { ROLE_DEFINITIONS } from '../shared/header';
import { usePrototype } from '../state';
import type { Role } from '../types';

export function PrototypeHub() {
  const { setRole, setJuryStep, resetAll } = usePrototype();

  const handleStartJury = () => {
    resetAll();
    setJuryStep(1);
    setRole('citizen');
  };

  return (
    <div className="p-hub">
      <section className="p-hero">
        <div className="p-hero-copy">
          <span className="p-overline">ZERO-TRUST HEALTH DATA & EMERGENCY LAYER</span>
          <h1>
            One trust layer.<br />
            <em>Different responsibilities.</em>
          </h1>
          <p>
            Experience how consent, privacy-safe emergency access, granular family assistance,
            federated clinical records, and verifiable public health behave as one connected
            ecosystem—without creating one giant database of India&apos;s medical life.
          </p>

          <div className="p-actions">
            <button className="primary p-cta-jury" onClick={handleStartJury}>
              <ProtoIcon name="shield" /> Launch 20-Step Jury Presentation →
            </button>
            <button className="secondary" onClick={() => setRole('citizen')}>
              <ProtoIcon name="user" /> Explore Free Prototype
            </button>
            <button className="secondary" onClick={() => setRole('failure-lab')}>
              <ProtoIcon name="wifiOff" /> Test System Outages (Care Continues)
            </button>
          </div>
        </div>

        <div className="p-hero-visual" aria-hidden="true">
          <div className="p-orbit o1" />
          <div className="p-orbit o2" />
          <div className="p-center-mark">
            <Mark />
            <b>Trust & Access Layer</b>
            <small>Clinical records remain federated</small>
          </div>
          {[
            { label: 'Citizen', icon: 'user' },
            { label: 'Doctor', icon: 'cross' },
            { label: 'Responder', icon: 'ambulance' },
            { label: 'Family', icon: 'family' },
            { label: 'Providers', icon: 'database' },
            { label: 'Public Health', icon: 'chart' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="p-orbit-node"
              style={{ '--i': i } as CSSProperties}
            >
              <ProtoIcon name={item.icon} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-hub-categories">
        <div className="p-section-heading">
          <h2>Select a Workspace or Architectural Lab</h2>
          <p>Each workspace demonstrates an authentic role, enforcing strict authority and scoped visibility.</p>
        </div>

        <div className="p-role-grid">
          {ROLE_DEFINITIONS.map((r, i) => (
            <button
              key={r.id}
              className="p-role-card"
              onClick={() => setRole(r.id)}
            >
              <div className="p-role-card-top">
                <span className="p-role-no">0{i + 1}</span>
                <span className="p-role-cat">{r.category}</span>
              </div>
              <ProtoIcon name={r.icon} className="p-card-icon" />
              <h3>{r.label}</h3>
              <p>{r.sub}</p>
              <span className="p-role-cta">
                Open Workspace <ProtoIcon name="arrowRight" className="p-cta-arrow" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="p-principles">
        <div className="p-principle-item">
          <b>RIGHT PERSON</b>
          <span>Identity authentication before clinical request</span>
        </div>
        <div className="p-principle-item">
          <b>RIGHT DATA</b>
          <span>Minimum necessary categories authorized</span>
        </div>
        <div className="p-principle-item">
          <b>RIGHT REASON</b>
          <span>Encounter-scoped purpose limitation</span>
        </div>
        <div className="p-principle-item">
          <b>RIGHT TIME</b>
          <span>Automatic time-to-live expiration</span>
        </div>
        <div className="p-principle-item hero-item">
          <b>CARE CONTINUES</b>
          <span>Treatment is never denied because technology failed</span>
        </div>
      </section>
    </div>
  );
}
