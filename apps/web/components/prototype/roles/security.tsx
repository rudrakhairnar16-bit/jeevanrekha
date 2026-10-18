'use client';

import React from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';

export function SecurityWorkspace() {
  const { auditEvents, tamperSimulation, setTamperSimulation } = usePrototype();

  return (
    <div className="p-security-app">
      <PageHead
        eyebrow="SECURITY, AUDIT & ACCOUNTABILITY CONSOLE"
        title="Trust shouldn’t require “trust us.”"
        copy="Sensitive clinical authorizations and emergency events create tamper-evident cryptographic commitments. Anomalies prompt investigation, not automatic guilt."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">Witness Log: Append-Only Commitment</span>
            <ProtoStatus tone={tamperSimulation ? 'red' : 'teal'}>
              {tamperSimulation ? 'MISMATCH DETECTED' : 'LEDGER CONSISTENT'}
            </ProtoStatus>
          </div>
        }
      />

      <div className="p-grid two">
        {/* Real-Time Security Audit Stream */}
        <ProtoPanel
          title="Cryptographic Access & Security Audit Stream"
          subtitle="Every consent decision, emergency release, credential revocation, and break-glass invocation is permanently committed."
          badge={<span className="p-badge-subtle">{auditEvents.length} events logged</span>}
        >
          <div className="p-audit-list-full">
            {auditEvents.map(evt => (
              <div key={evt.id} className="p-audit-full-card">
                <div className="p-audit-card-top">
                  <span className="p-audit-timestamp">{evt.timestamp}</span>
                  <ProtoStatus
                    tone={
                      evt.category === 'Emergency'
                        ? 'amber'
                        : evt.category === 'Security'
                        ? 'red'
                        : 'teal'
                    }
                  >
                    {evt.category}
                  </ProtoStatus>
                </div>

                <h4>{evt.action}</h4>
                <div className="p-audit-card-details">
                  <span><b>Actor:</b> {evt.actor}</span>
                  <span><b>Facility:</b> {evt.facility}</span>
                  <span><b>Purpose:</b> {evt.purpose}</span>
                </div>

                <div className="p-audit-hash-bar">
                  <span>Commitment Digest:</span>
                  <code>{tamperSimulation && evt.id === 'aud-02' ? '0x9999...TAMPERED' : evt.commitmentHash}</code>
                </div>
              </div>
            ))}
          </div>
        </ProtoPanel>

        {/* Anomaly Review & Tamper-Evidence Demo */}
        <div className="p-col">
          <ProtoPanel
            title="Heuristic Anomaly Review"
            subtitle="Automated pattern detection surfaces unusual access volume without making automated judicial accusations."
          >
            <div className="p-anomaly-card review">
              <div className="p-anomaly-head">
                <ProtoStatus tone="amber">REVIEW RECOMMENDED</ProtoStatus>
                <span className="p-anomaly-flag">Pattern Flag #ANOM-108</span>
              </div>
              <h4>Unusual Outpatient Context Switching</h4>
              <p>
                Clinician credential #HPR-9921 initiated 4 unrelated patient lookups in 12 minutes—exceeding
                recent departmental baseline.
              </p>
              <div className="p-anomaly-rule">
                <ProtoIcon name="shield" />
                <small>
                  <b>Constitutional Principle:</b> Non-accusatory language.
                  Anomalies flag potential workflow strain, emergency batching, or credential compromise.
                  Preserve digital evidence and dispatch hospital clinical liaison.
                </small>
              </div>
            </div>

            <div className="p-anomaly-card normal">
              <div className="p-anomaly-head">
                <ProtoStatus tone="teal">NORMAL POSTURE</ProtoStatus>
                <span className="p-anomaly-flag">Emergency Monitoring</span>
              </div>
              <h4>Break-Glass Invocation Rate</h4>
              <p>Emergency department break-glass frequency is within expected trauma baseline for XYZ Hospital.</p>
            </div>
          </ProtoPanel>

          {/* Tamper-Evidence Interactive Demo */}
          <ProtoPanel
            title="Tamper-Evidence & Modification Verification"
            subtitle="Demonstrating how independent witness references detect attempts to rewrite or backdate clinical access history."
          >
            <div className="p-tamper-box">
              <div className="p-tamper-state-display">
                <div className={`p-proof-badge ${tamperSimulation ? 'mismatch' : 'verified'}`}>
                  <ProtoIcon name={tamperSimulation ? 'alert' : 'checkCircle'} />
                  <div>
                    <b>{tamperSimulation ? 'MISMATCH DETECTED' : 'CONSISTENCY VERIFIED'}</b>
                    <p>
                      {tamperSimulation
                        ? 'Historical event digest differs from the independent witness reference. Evidence of modification preserved.'
                        : 'Current audit ledger matches independent cryptographic witness reference.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-tamper-actions">
                <button
                  className={tamperSimulation ? 'secondary' : 'danger'}
                  onClick={() => setTamperSimulation(!tamperSimulation)}
                >
                  {tamperSimulation ? 'Restore Original Immutable Commitment' : 'Simulate Historical Database Modification →'}
                </button>
              </div>

              <div className="p-tamper-principle">
                <ProtoIcon name="eye" />
                <small>
                  <b>Accurate Claim:</b> The system claims <em>&ldquo;Mismatch Detected,&rdquo;</em> never <em>&ldquo;Historical modification is impossible.&rdquo;</em>
                  Independent witness nodes ensure that unauthorized retroactive changes are detectable by auditors.
                </small>
              </div>
            </div>
          </ProtoPanel>
        </div>
      </div>
    </div>
  );
}
