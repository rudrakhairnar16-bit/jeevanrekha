'use client';

import React, { useState } from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';

export function DoctorWorkspace() {
  const {
    consent,
    updateConsentStatus,
    createDoctorRequest,
    doctorPatientMatched,
    setDoctorPatientMatched,
    setRole,
  } = usePrototype();

  const [selectedCats, setSelectedCats] = useState<('labs' | 'prescriptions' | 'consultations' | 'diagnostics')[]>([
    'labs',
    'prescriptions',
  ]);
  const [purpose, setPurpose] = useState('Current clinical treatment for respiratory discomfort');
  const [duration, setDuration] = useState(120);

  const toggleCat = (cat: 'labs' | 'prescriptions' | 'consultations' | 'diagnostics') => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSendRequest = () => {
    createDoctorRequest(selectedCats, purpose, duration);
  };

  return (
    <div className="p-doctor-app">
      <PageHead
        eyebrow="CLINICIAN WORKSPACE · OPD CONSULTATION"
        title="Treatment without invisible access."
        copy="Confirm the patient's identity first. Request only the specific clinical categories required for this consultation."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">Dr. Sharma · HPR ID: #HPR-9921-DEL</span>
            <span className="p-pill">Facility: XYZ Hospital (OPD Rm 204)</span>
          </div>
        }
      />

      {/* STEP 1: PATIENT MATCHING */}
      <div className="p-grid two">
        <ProtoPanel
          title="Step 1 — Patient Identity Matching"
          subtitle="Confirm the individual in front of you matches the intended health reference."
          badge={
            <ProtoStatus tone={doctorPatientMatched ? 'teal' : 'amber'}>
              {doctorPatientMatched ? 'MATCH CONFIRMED ✓' : 'VERIFICATION REQUIRED'}
            </ProtoStatus>
          }
        >
          <div className="p-patient-card">
            <div className="p-patient-avatar">RM</div>
            <div className="p-patient-details">
              <h3>Rahul Mehta</h3>
              <p>Age 34 · Male · ABHA Reference: 91-4821-••••-9012</p>
              <small>Last hospital visit: Hospital A (10 Oct 2026)</small>
            </div>
          </div>

          <div className="p-patient-confirm-action">
            <button
              className={`p-wide ${doctorPatientMatched ? 'secondary' : 'primary'}`}
              onClick={() => setDoctorPatientMatched(!doctorPatientMatched)}
            >
              {doctorPatientMatched ? 'Patient Match Confirmed ✓ (Click to reset)' : 'Confirm Correct Patient Matches Record'}
            </button>
          </div>

          <div className="p-notice-box">
            <ProtoIcon name="shield" />
            <p>
              <b>Constitutional Invariant:</b> Identity ≠ Permission.
              Confirming Rahul&apos;s identity allows you to initiate an encounter, but zero medical records are disclosed without explicit patient consent.
            </p>
          </div>
        </ProtoPanel>

        {/* STEP 2: ACCESS POSTURE */}
        <ProtoPanel
          title="Step 2 — Encounter Authorization State"
          subtitle="Real-time cryptographic consent posture for this encounter."
        >
          <ProtoMetric
            label="PATIENT IDENTITY CHECK"
            value={doctorPatientMatched ? 'Identity Confirmed' : 'Not Confirmed'}
            tone={doctorPatientMatched ? 'teal' : 'amber'}
          />

          <ProtoMetric
            label="CONSENT AUTHORIZATION STATUS"
            value={
              consent.status === 'allowed'
                ? 'Authorized (Scoped TTL Active)'
                : consent.status === 'pending'
                ? 'Consent Request Pending Citizen Review'
                : consent.status === 'revoked'
                ? 'Access Revoked by Patient'
                : consent.status === 'denied'
                ? 'Access Denied by Patient'
                : 'No Active Authorization'
            }
            tone={consent.status === 'allowed' ? 'teal' : consent.status === 'pending' ? 'amber' : 'red'}
          />

          <ProtoMetric
            label="PERMITTED SCOPE"
            value={consent.status === 'allowed' ? consent.requestedCategories.map(c => c.toUpperCase()).join(' + ') : 'None'}
            subvalue={consent.status === 'allowed' ? 'Authorized until 12:08 PM · 1h 48m remaining' : 'Federated queries disabled'}
          />

          {consent.status === 'allowed' && (
            <div className="p-active-badge-card">
              <ProtoStatus tone="teal" pulsing>
                LIVE SCOPED SESSION ACTIVE
              </ProtoStatus>
              <small>Session token expires automatically at 12:08 PM. Provider tokens will cease resolving.</small>
            </div>
          )}
        </ProtoPanel>
      </div>

      {/* STEP 3: REQUEST BUILDER (When matched & not yet allowed) */}
      {doctorPatientMatched && consent.status !== 'allowed' && (
        <section className="p-request-builder">
          <div className="p-builder-header">
            <div>
              <span className="p-overline">REQUEST MINIMUM NECESSARY</span>
              <h2>Construct Scoped Clinical Consent Request</h2>
              <p>Select only the record categories clinically essential for today&apos;s encounter.</p>
            </div>
            <ProtoStatus tone="amber">PRE-AUTHORIZATION</ProtoStatus>
          </div>

          <div className="p-builder-categories">
            {[
              { id: 'labs', label: 'Laboratory Reports', desc: 'Recent CBC, metabolic panels, microbiology', req: true },
              { id: 'prescriptions', label: 'Active Prescriptions', desc: 'Current medication courses, active antibiotics', req: true },
              { id: 'consultations', label: 'Clinical Notes & Consultations', desc: 'Outpatient notes and specialist opinions', req: false },
              { id: 'diagnostics', label: 'Diagnostic Imaging & Radiology', desc: 'X-rays, CT scans, ultrasounds', req: false },
            ].map(cat => (
              <button
                key={cat.id}
                className={`p-cat-toggle ${selectedCats.includes(cat.id as typeof selectedCats[0]) ? 'selected' : ''}`}
                onClick={() => toggleCat(cat.id as typeof selectedCats[0])}
              >
                <div className="p-cat-toggle-header">
                  <b>{cat.label}</b>
                  <span>{selectedCats.includes(cat.id as typeof selectedCats[0]) ? '✓ INCLUDED' : '+ ADD'}</span>
                </div>
                <small>{cat.desc}</small>
              </button>
            ))}
          </div>

          <div className="p-builder-form-grid">
            <div className="p-field">
              <label>Declared Clinical Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="Clinical reason for this encounter"
              />
            </div>

            <div className="p-field">
              <label>Authorization Duration (Encounter Time-To-Live)</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                <option value={60}>1 hour (Focused OPD visit)</option>
                <option value={120}>2 hours (Standard consultation + lab check)</option>
                <option value={240}>4 hours (Extended diagnostic workup)</option>
              </select>
            </div>
          </div>

          <div className="p-builder-actions">
            <button className="primary" onClick={handleSendRequest}>
              <ProtoIcon name="shield" /> Dispatch Scoped Request to Rahul&apos;s Device
            </button>
            <button
              className="secondary"
              onClick={() => {
                handleSendRequest();
                updateConsentStatus('allowed');
              }}
            >
              Demo Shortcut: Citizen Approves Instantly →
            </button>
            <button className="secondary" onClick={() => setRole('citizen')}>
              Switch to Citizen View to Experience Review Flow →
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: AUTHORIZED FEDERATED CLINICAL VIEW */}
      {doctorPatientMatched && consent.status === 'allowed' && (
        <section className="p-authorized-clinical-view">
          <div className="p-scope-banner">
            <div className="p-scope-left">
              <ProtoStatus tone="teal" pulsing>
                ENCOUNTER AUTHORIZATION GRANTED
              </ProtoStatus>
              <b>Active Scope: {consent.requestedCategories.map(c => c.toUpperCase()).join(' + ')}</b>
              <span>Authorized by Rahul Mehta · Expires at 12:08 PM</span>
            </div>
            <div className="p-scope-right">
              <button
                className="secondary small"
                onClick={() => setRole('citizen')}
              >
                Switch to Citizen (Test Revocation) →
              </button>
            </div>
          </div>

          <div className="p-grid two">
            {/* Federated Provider Queries */}
            <ProtoPanel
              title="Federated Provider Discovery & Retrieval"
              subtitle="Records are retrieved dynamically from authorized source facilities; no centralized lifetime database."
            >
              <div className="p-provider-retrieval-list">
                <div className="p-retrieval-item success">
                  <div className="p-retrieval-icon"><ProtoIcon name="checkCircle" /></div>
                  <div className="p-retrieval-content">
                    <b>Lab C (Diagnostic Centre)</b>
                    <p>CBC Panel retrieved · Verified Pathologist Signature · FHIR DiagnosticReport</p>
                  </div>
                  <span className="p-retrieval-tag">RETRIEVED ✓</span>
                </div>

                <div className="p-retrieval-item success">
                  <div className="p-retrieval-icon"><ProtoIcon name="checkCircle" /></div>
                  <div className="p-retrieval-content">
                    <b>Hospital A (City Multispecialty)</b>
                    <p>Current prescription retrieved · Amoxicillin-Clavulanate 625mg</p>
                  </div>
                  <span className="p-retrieval-tag">RETRIEVED ✓</span>
                </div>

                <div className="p-retrieval-item locked">
                  <div className="p-retrieval-icon"><ProtoIcon name="lock" /></div>
                  <div className="p-retrieval-content">
                    <b>Hospital C (Prior Encounter)</b>
                    <p>Inpatient records locked: Not requested in current consent scope</p>
                  </div>
                  <span className="p-retrieval-tag locked">LOCKED 🔒</span>
                </div>

                <div className="p-retrieval-item locked">
                  <div className="p-retrieval-icon"><ProtoIcon name="lock" /></div>
                  <div className="p-retrieval-content">
                    <b>Diagnostic Centre D (Radiology)</b>
                    <p>Chest imaging locked: Not requested in current consent scope</p>
                  </div>
                  <span className="p-retrieval-tag locked">LOCKED 🔒</span>
                </div>
              </div>
            </ProtoPanel>

            {/* Retrieved Records Display */}
            <ProtoPanel
              title="Authorized Clinical Record View"
              subtitle="Displaying only permitted records. Sealed psychiatric episode remains strictly shielded."
            >
              <div className="p-retrieved-records">
                <div className="p-clinical-card">
                  <span className="p-provenance-tag verified_lab">✓ Verified Lab Result · Lab C</span>
                  <h4>Complete Blood Count (CBC) with Differential</h4>
                  <p>Hemoglobin: 14.2 g/dL | Platelets: 240,000/mcL | WBC: 7,200/mcL</p>
                  <small>Recorded: 12 Oct 2026 · Normal indices</small>
                </div>

                <div className="p-clinical-card">
                  <span className="p-provenance-tag verified_hospital">✓ Verified Hospital Prescription · Hospital A</span>
                  <h4>Amoxicillin-Clavulanate 625mg Oral</h4>
                  <p>1 tab twice daily for 7 days. Note: Penicillin allergy warning flagged.</p>
                  <small>Dispensed: 10 Oct 2026 · Course concluding</small>
                </div>

                {/* Sealed Record Compartment Demonstration */}
                <div className="p-sealed-record-boundary">
                  <div className="p-sealed-head">
                    <ProtoIcon name="lock" />
                    <b>SPECIALLY PROTECTED EPISODE UNAVAILABLE</b>
                  </div>
                  <p>
                    MindCare Psychiatric Clinic encounter is sealed under Rahul&apos;s special privacy compartment.
                    Associated diagnosis, prescriptions, and notes are shielded inside the same boundary.
                  </p>
                  <small>Zero diagnosis metadata or linked therapy notes leak into this general consultation.</small>
                </div>
              </div>
            </ProtoPanel>
          </div>
        </section>
      )}

      {/* STATE REACTION: REVOKED OR DENIED */}
      {doctorPatientMatched && (consent.status === 'revoked' || consent.status === 'denied') && (
        <section className="p-revoked-state-banner">
          <ProtoIcon name="xCircle" className="p-revoked-icon" />
          <div>
            <h3>
              {consent.status === 'revoked'
                ? 'Clinical Access Revoked by Patient'
                : 'Access Request Denied by Patient'}
            </h3>
            <p>
              {consent.status === 'revoked'
                ? 'Rahul Mehta actively terminated authorization from the Citizen app. Session tokens have expired, and cached records have been flushed.'
                : 'The citizen declined to authorize record retrieval. Normal clinical care continues with bedside history.'}
            </p>
            <button className="primary small" onClick={() => updateConsentStatus('pending')}>
              Create New Clinical Request
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
