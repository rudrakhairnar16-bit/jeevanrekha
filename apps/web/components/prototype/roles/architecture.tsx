'use client';

import React from 'react';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoIcon } from '../shared/icons';
import { Mark } from '../../ui';
import { usePrototype } from '../state';

export function ArchitectureWorkspace() {
  const { setRole } = usePrototype();

  return (
    <div className="p-arch-app">
      <PageHead
        eyebrow="SYSTEM ARCHITECTURE EXPLORER"
        title="Permission travels. Records stay distributed."
        copy="JeevanRekha is a zero-trust trust, consent and emergency layer—NOT a central medical-record warehouse containing everyone's complete medical life."
        actions={
          <div className="p-head-stats">
            <button className="primary small" onClick={() => setRole('emergency-lab')}>
              <ProtoIcon name="shield" /> Emergency Protection Lab →
            </button>
            <button className="secondary small" onClick={() => setRole('aggregation-lab')}>
              <ProtoIcon name="lock" /> Secure Aggregation Lab →
            </button>
            <button className="secondary small" onClick={() => setRole('failure-lab')}>
              <ProtoIcon name="wifiOff" /> Failure Lab (Care Continues) →
            </button>
          </div>
        }
      />

      {/* ARCHITECTURE DIAGRAM */}
      <section className="p-arch-diagram-section">
        <div className="p-arch-actors">
          <div className="p-arch-box">
            <ProtoIcon name="user" />
            <b>Citizen</b>
            <small>Identity authentication, granular consent choices, emergency card controls</small>
          </div>
          <div className="p-arch-box">
            <ProtoIcon name="cross" />
            <b>Doctor / Clinician</b>
            <small>Identity verification, scoped request builder, encounter authorization</small>
          </div>
          <div className="p-arch-box">
            <ProtoIcon name="ambulance" />
            <b>Emergency Responder</b>
            <small>Credential scan, Tier 0 public view, verified Tier 1 summary</small>
          </div>
        </div>

        <div className="p-arch-layer-center">
          <div className="p-layer-orb">
            <Mark />
            <h3>JeevanRekha Trust & Access Layer</h3>
            <span className="p-layer-sub">TRUST · CONSENT · EMERGENCY · INTEGRITY · AUDIT</span>
            <div className="p-layer-capabilities">
              <span>✓ Cryptographic consent tokens</span>
              <span>✓ Scoped authorization enforcement</span>
              <span>✓ Emergency 2-part key release</span>
              <span>✓ Append-only tamper evidence</span>
              <span>✓ Privacy-preserving signal aggregation</span>
            </div>
            <div className="p-layer-warning">
              <ProtoIcon name="shield" />
              <b>NEVER STORES PLAINTEXT LIFETIME CLINICAL RECORDS</b>
            </div>
          </div>
        </div>

        <div className="p-arch-providers">
          <div className="p-arch-box provider">
            <ProtoIcon name="database" />
            <b>Hospital A (City Multispecialty)</b>
            <small>Clinical prescriptions, encounter notes stay on hospital servers</small>
          </div>
          <div className="p-arch-box provider">
            <ProtoIcon name="database" />
            <b>Lab C (Diagnostic Centre)</b>
            <small>CBC and pathology results stored at laboratory repository</small>
          </div>
          <div className="p-arch-box provider">
            <ProtoIcon name="database" />
            <b>Hospital B (Community Health)</b>
            <small>Outpatient assessments stored at community clinic systems</small>
          </div>
        </div>
      </section>

      {/* THREE CONSTITUTIONAL PILLARS */}
      <div className="p-grid three">
        <ProtoPanel title="Pillar 1 — Normal Healthcare Care" subtitle="Routine consent-controlled consultations">
          <ul className="p-pillar-list">
            <li><b>Identity ≠ Permission:</b> Confirming the patient does not unlock history.</li>
            <li><b>Explicit Scoped Consent:</b> Doctor requests specific categories (WHO / WHAT / WHY / HOW LONG).</li>
            <li><b>Short-Lived Authorization:</b> Tokens expire automatically; no silent permanent access.</li>
            <li><b>Federated Retrieval:</b> Records are queried directly from authoring facilities.</li>
          </ul>
        </ProtoPanel>

        <ProtoPanel title="Pillar 2 — Emergency Access Hierarchy" subtitle="Three strict operational boundaries">
          <ul className="p-pillar-list">
            <li><b>Tier 0 (Public):</b> Public QR shows only deliberate chosen minimum (critical allergy, contacts).</li>
            <li><b>Tier 1 (Verified Responder):</b> Pre-computed encrypted summary requiring 2-part secret.</li>
            <li><b>Tier 2 (Hospital Break-Glass):</b> Emergency department exception with permanent ethics logging.</li>
            <li><b>Identity Uncertainty:</b> Credential found near patient lowers confidence to caution only.</li>
          </ul>
        </ProtoPanel>

        <ProtoPanel title="Pillar 3 — Technology Failure Resilience" subtitle="The supreme healthcare invariant">
          <ul className="p-pillar-list">
            <li><b>Network Offline:</b> Standard emergency clinical care continues immediately.</li>
            <li><b>Service Down:</b> Offline signed Tier 0 payload remains verified.</li>
            <li><b>Phone Damaged:</b> Clinicians treat using bedside history and trauma algorithms.</li>
            <li><b>SUPREME RULE:</b> <b>CARE IS NEVER DENIED BECAUSE JEEVANREKHA FAILED.</b></li>
          </ul>
        </ProtoPanel>
      </div>
    </div>
  );
}
