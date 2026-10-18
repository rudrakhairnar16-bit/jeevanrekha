'use client';

import React, { useState } from 'react';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoIcon } from '../shared/icons';
import { ProtoStatus } from '../shared/status-badge';
import { usePrototype } from '../state';

export function EmergencyProtectionLab() {
  const { setRole } = usePrototype();
  const [activeScenario, setActiveScenario] = useState<'normal' | 'db_breach' | 'qr_photo' | 'stolen_medic'>('normal');

  return (
    <div className="p-em-lab-app">
      <PageHead
        eyebrow="CRYPTOGRAPHIC ARCHITECTURE LAB · EMERGENCY PROTECTION"
        title="Speed without a centralized medical honeypot."
        copy="Emergency summaries must release in seconds at 2 AM, yet central storage creates a dangerous target. JeevanRekha explores a two-part capability model."
        actions={
          <div className="p-head-stats">
            <button className="secondary small" onClick={() => setRole('responder')}>
              ← Return to Responder Workspace
            </button>
          </div>
        }
      />

      {/* TWO-PART SECRET CONCEPT DIAGRAM */}
      <section className="p-two-part-diagram">
        <div className="p-secret-part">
          <div className="p-part-icon"><ProtoIcon name="card" /></div>
          <span className="p-part-label">COMPONENT 1: PATIENT-SIDE CAPABILITY</span>
          <b>Patient Emergency Credential</b>
          <p>Cryptographic capability bound to the patient&apos;s physical card or secure device enclave.</p>
        </div>

        <div className="p-plus-sign">+</div>

        <div className="p-secret-part">
          <div className="p-part-icon"><ProtoIcon name="shield" /></div>
          <span className="p-part-label">COMPONENT 2: SERVICE HSM FRAGMENT</span>
          <b>Hardened Emergency Service Key</b>
          <p>Protected by tamper-resistant Hardware Security Modules (HSM) and strict policy enforcement.</p>
        </div>

        <div className="p-plus-sign">+</div>

        <div className="p-secret-part">
          <div className="p-part-icon"><ProtoIcon name="ambulance" /></div>
          <span className="p-part-label">OPERATIONAL CONTEXT</span>
          <b>Authenticated Responder Session</b>
          <p>Verified paramedic identity on active emergency duty with logged encounter context.</p>
        </div>

        <div className="p-equals-sign">⇒</div>

        <div className="p-secret-result">
          <ProtoStatus tone="teal">RELEASED</ProtoStatus>
          <b>Tier 1 Limited Emergency Summary</b>
          <small>Critical allergies, warnings, contacts. Not lifetime history.</small>
        </div>
      </section>

      {/* INTERACTIVE ATTACK SCENARIO SIMULATOR */}
      <ProtoPanel
        title="Simulate Attack & Threat Scenarios"
        subtitle="Test whether single-point compromises can leak citizen medical files."
      >
        <div className="p-scenario-tabs">
          {[
            { id: 'normal', label: '1. Legitimate Responder Encounter' },
            { id: 'db_breach', label: '2. Central Server Database Breach' },
            { id: 'qr_photo', label: '3. Public QR Photographed from Afar' },
            { id: 'stolen_medic', label: '4. Stolen Responder Credential' },
          ].map(s => (
            <button
              key={s.id}
              className={`p-scenario-btn ${activeScenario === s.id ? 'active' : ''}`}
              onClick={() => setActiveScenario(s.id as typeof activeScenario)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="p-scenario-result-box">
          {activeScenario === 'normal' && (
            <div className="p-scenario-outcome safe">
              <div className="p-outcome-header">
                <ProtoStatus tone="teal">AUTHORIZED WORKFLOW</ProtoStatus>
                <h4>Legitimate Emergency Release</h4>
              </div>
              <p>
                <b>Condition:</b> Paramedic EMS-3382 authenticates on duty and scans Rahul&apos;s physical card.
                Both secret components combine under policy.
              </p>
              <div className="p-outcome-box">
                <ProtoIcon name="checkCircle" />
                <span>
                  Tier 1 emergency summary released for 30 minutes. Event permanently recorded in audit ledger.
                </span>
              </div>
            </div>
          )}

          {activeScenario === 'db_breach' && (
            <div className="p-scenario-outcome protected">
              <div className="p-outcome-header">
                <ProtoStatus tone="amber">ATTACK MITIGATED</ProtoStatus>
                <h4>Central Database Exfiltration Attack</h4>
              </div>
              <p>
                <b>Threat:</b> An attacker or rogue database administrator exfiltrates the complete emergency summary table from the cloud database.
              </p>
              <div className="p-outcome-box">
                <ProtoIcon name="lock" />
                <span>
                  <b>RESULT: CIPHERTEXT UNREADABLE.</b> The central store contains only encrypted summaries.
                  Without the individual patient-held capability from each citizen&apos;s physical card, bulk decryption is impossible.
                </span>
              </div>
            </div>
          )}

          {activeScenario === 'qr_photo' && (
            <div className="p-scenario-outcome protected">
              <div className="p-outcome-header">
                <ProtoStatus tone="amber">ATTACK MITIGATED</ProtoStatus>
                <h4>Public QR Photograph / Eavesdropping</h4>
              </div>
              <p>
                <b>Threat:</b> A stranger secretly photographs Rahul&apos;s emergency QR code on the subway.
              </p>
              <div className="p-outcome-box">
                <ProtoIcon name="eye" />
                <span>
                  <b>RESULT: TIER 0 ONLY.</b> The photo reveals only the deliberate public minimum (penicillin allergy, contact).
                  The public QR does NOT contain or grant the Tier 1 cryptographic capability or responder authorization.
                </span>
              </div>
            </div>
          )}

          {activeScenario === 'stolen_medic' && (
            <div className="p-scenario-outcome protected">
              <div className="p-outcome-header">
                <ProtoStatus tone="amber">ATTACK MITIGATED</ProtoStatus>
                <h4>Compromised Responder Credential</h4>
              </div>
              <p>
                <b>Threat:</b> An adversary steals a paramedic&apos;s login credentials to browse citizen medical files remotely.
              </p>
              <div className="p-outcome-box">
                <ProtoIcon name="shield" />
                <span>
                  <b>RESULT: BULK LOOKUPS BLOCKED.</b> A responder credential alone cannot query arbitrary citizen records without
                  presenting a valid physical patient emergency capability in an active triage encounter.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-security-honesty-notice">
          <ProtoIcon name="shield" />
          <p>
            <b>Security & Cryptographic Honesty:</b> This is an architectural prototype demonstrating necessary trust boundaries,
            not a certified production cryptographic proof. Full deployment requires specialized cryptographic review,
            formal threat modeling, and reviewed key-derivation standards.
          </p>
        </div>
      </ProtoPanel>
    </div>
  );
}
