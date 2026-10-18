'use client';

import React, { useState } from 'react';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoIcon } from '../shared/icons';
import { ProtoStatus } from '../shared/status-badge';
import { usePrototype } from '../state';

export function AggregationLabWorkspace() {
  const { setRole } = usePrototype();
  const [method, setMethod] = useState<'suppression' | 'prio'>('prio');

  const facilities = [
    { name: 'City Hospital A', cases: 2 },
    { name: 'Community Clinic B', cases: 2 },
    { name: 'District Lab C', cases: 2 },
    { name: 'Rural CHC D', cases: 2 },
    { name: 'Maternity Centre E', cases: 2 },
    { name: 'Subdistrict Hospital F', cases: 2 },
    { name: 'Private Clinic G', cases: 2 },
    { name: 'Primary Health Centre H', cases: 2 },
    { name: 'Diagnostic Centre I', cases: 2 },
    { name: 'Urban Health Post J', cases: 2 },
  ];

  const totalActualCases = facilities.reduce((acc, f) => acc + f.cases, 0); // 20
  const visibleSuppressedCases = 0; // Each <5 suppressed to 0 -> 0 + 0 ... = 0

  return (
    <div className="p-agg-lab-app">
      <PageHead
        eyebrow="PUBLIC HEALTH CRYPTOGRAPHY LAB · SECURE AGGREGATION"
        title="Privacy without blind spots."
        copy="Traditional privacy suppression destroys distributed cluster signals. JeevanRekha demonstrates a Prio/VDAF-style multi-party aggregation direction."
        actions={
          <div className="p-head-stats">
            <button className="secondary small" onClick={() => setRole('public-health')}>
              ← Back to District Analytics
            </button>
          </div>
        }
      />

      {/* METHOD SELECTOR */}
      <div className="p-method-toggle-bar">
        <button
          className={`p-method-btn ${method === 'suppression' ? 'active' : ''}`}
          onClick={() => setMethod('suppression')}
        >
          Traditional Approach: Per-Facility Small Count Suppression (&lt;5)
        </button>
        <button
          className={`p-method-btn ${method === 'prio' ? 'active' : ''}`}
          onClick={() => setMethod('prio')}
        >
          JeevanRekha Approach: Privacy-Preserving 2-Path Aggregation (Prio/VDAF)
        </button>
      </div>

      {/* COMPARISON RESULTS */}
      <div className="p-grid two">
        <ProtoPanel
          title={method === 'suppression' ? 'The Suppression Failure Mode' : 'Two-Path Cryptographic Secret Sharing'}
          subtitle={
            method === 'suppression'
              ? 'Why hiding numbers under 5 blinds public health authorities during early outbreaks.'
              : 'Each facility transforms its count into secret shares sent along independent administrative pathways.'
          }
          badge={
            <ProtoStatus tone={method === 'suppression' ? 'red' : 'teal'}>
              {method === 'suppression' ? 'FALSE ZERO SIGNAL' : 'SIGNAL PRESERVED'}
            </ProtoStatus>
          }
        >
          {method === 'suppression' ? (
            <div className="p-suppression-demo">
              <div className="p-facility-grid">
                {facilities.map((f, i) => (
                  <div key={i} className="p-fac-box suppressed">
                    <b>{f.name}</b>
                    <span className="p-actual">Actual: {f.cases} cases</span>
                    <span className="p-reported red">Reported: 0 (&lt;5 suppressed)</span>
                  </div>
                ))}
              </div>

              <div className="p-suppression-total-card red">
                <div className="p-total-row">
                  <span>Actual Distributed District Cluster:</span>
                  <b>{totalActualCases} Unique Patients</b>
                </div>
                <div className="p-total-row">
                  <span>Public Health Authority Observed Signal:</span>
                  <b className="red-text">{visibleSuppressedCases} Cases (The outbreak disappears!)</b>
                </div>
                <p>
                  Because every facility sees only 2 cases, each independently suppresses its count to prevent re-identification.
                  0 + 0 + 0 + ... = 0. The public health surveillance system records a false zero.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-prio-demo">
              <div className="p-prio-split-view">
                <div className="p-path-box">
                  <span className="p-path-tag">PATH A (Share A)</span>
                  <h4>Aggregator A</h4>
                  <small>Public Health Surveillance Infrastructure</small>
                  <p>Receives encrypted fragment A. Individual fragment is indistinguishable from random noise.</p>
                </div>

                <div className="p-path-box">
                  <span className="p-path-tag">PATH B (Share B)</span>
                  <h4>Aggregator B</h4>
                  <small>Independent Research / Oversight Institution</small>
                  <p>Receives encrypted fragment B. Neither aggregator can reconstruct any individual hospital count alone.</p>
                </div>
              </div>

              <div className="p-suppression-total-card green">
                <div className="p-total-row">
                  <span>Reconstructed District Aggregate:</span>
                  <b className="teal-text">{totalActualCases} Unique Cases Detected!</b>
                </div>
                <div className="p-total-row">
                  <span>Facility Individual Privacy:</span>
                  <b>Protected (Zero cleartext facility rows leaked)</b>
                </div>
                <p>
                  Aggregated shares are combined to produce the authorized district total.
                  Small counts are protected at the release level with calibrated differential privacy noise,
                  rather than blinding the surveillance system at source.
                </p>
              </div>
            </div>
          )}
        </ProtoPanel>

        {/* INTEGRITY & PROTOCOL REQUIREMENTS */}
        <ProtoPanel
          title="Protocol Integrity & Malicious Hospital Controls"
          subtitle="Why simple additive secret sharing is insufficient for real-world deployments."
        >
          <div className="p-vdaf-requirements">
            <div className="p-req-card">
              <div className="p-req-num">01</div>
              <div>
                <b>Authenticated Facility Credentials:</b>
                <p>Only verified clinics and laboratories holding valid hardware keys can submit data contributions.</p>
              </div>
            </div>

            <div className="p-req-card">
              <div className="p-req-num">02</div>
              <div>
                <b>Zero-Knowledge Validity Proofs (Prio / VDAF):</b>
                <p>Prevents a malicious hospital from secretly injecting 10,000 fake cases to disrupt health policy.</p>
              </div>
            </div>

            <div className="p-req-card">
              <div className="p-req-num">03</div>
              <div>
                <b>Non-Collusion Assumption:</b>
                <p>Aggregator A and Aggregator B must operate under separate administrative, legal, and operational domains.</p>
              </div>
            </div>

            <div className="p-req-card">
              <div className="p-req-num">04</div>
              <div>
                <b>Unique Patients, Not Visits:</b>
                <p>A single patient visiting 3 facilities within one episode must not artificially multiply into 3 epidemic cases.</p>
              </div>
            </div>
          </div>
        </ProtoPanel>
      </div>
    </div>
  );
}
