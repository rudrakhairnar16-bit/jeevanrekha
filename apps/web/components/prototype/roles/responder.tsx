'use client';

import React, { useState } from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric, InteractiveQR, ProtoModal } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';

export function ResponderWorkspace() {
  const {
    responderTier,
    setResponderTier,
    credentialLocation,
    setCredentialLocation,
    identityConfidence,
    responderAuthenticated,
    setResponderAuthenticated,
    networkOffline,
    setNetworkOffline,
    breakGlassActive,
    breakGlassLog,
    triggerBreakGlass,
    credentials,
    setRole,
  } = usePrototype();

  const [scannerModal, setScannerModal] = useState(false);
  const [scanStep, setScanStep] = useState<'scan' | 'recognized'>('scan');
  const [breakGlassModal, setBreakGlassModal] = useState(false);
  const [bgReason, setBgReason] = useState('Unconscious multi-trauma patient; immediate surgical stabilization');

  const handleOpenScanner = () => {
    setScanStep('scan');
    setScannerModal(true);
  };

  const handleSimulateScan = () => {
    setScanStep('recognized');
    setTimeout(() => {
      setScannerModal(false);
      setResponderTier(0);
    }, 700);
  };

  const handleConfirmBreakGlass = () => {
    triggerBreakGlass(bgReason, ['emergency_allergies', 'medication_history', 'implant_specs']);
    setBreakGlassModal(false);
  };

  return (
    <div className="p-responder-app">
      <PageHead
        eyebrow="EMERGENCY RESPONDER INTERFACE · FIELD & TRAUMA"
        title="Seconds matter. Scope still matters."
        copy="Public emergency QR reveals only chosen minimum info. Certified responders authenticate for Tier 1 summary. Hospital emergency access uses audited Break-Glass."
        actions={
          <div className="p-head-stats">
            <button
              className={`p-toggle-offline-btn ${networkOffline ? 'offline' : 'online'}`}
              onClick={() => setNetworkOffline(!networkOffline)}
            >
              <ProtoIcon name={networkOffline ? 'wifiOff' : 'wifi'} />
              <span>{networkOffline ? 'SIMULATING OFFLINE' : 'NETWORK CONNECTED'}</span>
            </button>
            <span className="p-pill">Credential: {credentials.card.toUpperCase()}</span>
          </div>
        }
      />

      {/* PERSISTENT IDENTITY CONFIDENCE BANNER */}
      <div className={`p-identity-persistent-banner ${identityConfidence === 'unverified' ? 'warn' : 'ok'}`}>
        <div className="p-banner-icon">
          <ProtoIcon name={identityConfidence === 'unverified' ? 'alert' : 'checkCircle'} />
        </div>
        <div className="p-banner-text">
          <b>{identityConfidence === 'unverified' ? 'IDENTITY NOT CONFIRMED' : 'IDENTITY CONFIRMED ON PATIENT'}</b>
          <p>
            {identityConfidence === 'unverified'
              ? 'Emergency credential was found near the patient rather than physically on person. Treat clinical data as caution signals only—do not rely as sole identity proof for irreversible decisions.'
              : 'Physical credential ownership confirmed on person. Proceed with authenticated responder triage.'}
          </p>
        </div>
        <div className="p-banner-control">
          <label>Credential Found Location:</label>
          <select
            value={credentialLocation}
            onChange={e => setCredentialLocation(e.target.value as 'on_patient' | 'near_patient')}
            aria-label="Credential location selector"
          >
            <option value="near_patient">Near Patient (Unverified Identity)</option>
            <option value="on_patient">On Patient (Confirm Identity)</option>
          </select>
        </div>
      </div>

      {/* SCANNER TRIGGER CARD & QUICK ACTIONS */}
      <div className="p-responder-top-grid">
        <section className="p-scan-action-card">
          <div className="p-scan-card-left">
            <InteractiveQR onScan={handleOpenScanner} label="Click to simulate camera or NFC scan" />
            <div>
              <span className="p-overline">CREDENTIAL SCANNER</span>
              <h3>Simulate QR / NFC Interaction</h3>
              <p>Scan Rahul&apos;s physical card, emergency band, or lockscreen QR.</p>
              <button className="primary" onClick={handleOpenScanner}>
                <ProtoIcon name="camera" /> Open Visual Scanner
              </button>
            </div>
          </div>
          <div className="p-scan-card-right">
            <ProtoStatus tone={credentials.card === 'active' ? 'teal' : 'red'}>
              Card ID #CARD-7741 · {credentials.card.toUpperCase()}
            </ProtoStatus>
            <small>Cryptographic Signature: Valid SHA-256 Digest</small>
          </div>
        </section>
      </div>

      {/* THREE-TIER PROGRESSION BAR */}
      <section className="p-tier-stepper">
        <div className={`p-tier-step ${responderTier >= 0 ? 'active' : ''}`}>
          <span className="p-tier-num">TIER 0</span>
          <b>Public Minimum</b>
          <small>Always visible on scan</small>
        </div>
        <div className={`p-tier-arrow ${responderTier >= 1 ? 'active' : ''}`}>→</div>
        <div className={`p-tier-step ${responderTier >= 1 ? 'active' : ''}`}>
          <span className="p-tier-num">TIER 1</span>
          <b>Verified Responder Summary</b>
          <small>Authenticated emergency crew</small>
        </div>
        <div className={`p-tier-arrow ${responderTier >= 2 ? 'active' : ''}`}>→</div>
        <div className={`p-tier-step ${responderTier >= 2 ? 'active' : ''}`}>
          <span className="p-tier-num">TIER 2</span>
          <b>Hospital Break-Glass</b>
          <small>Emergency department exception</small>
        </div>
      </section>

      {/* TIER 0: PUBLIC MINIMUM DISPLAY */}
      <div className="p-grid two">
        <ProtoPanel
          title="Tier 0 — Public Emergency Minimum"
          subtitle="Displayed immediately upon scan. Restricted to deliberately chosen public fields."
          badge={<ProtoStatus tone="teal">PUBLIC ACCESS</ProtoStatus>}
        >
          <div className="p-tier0-info-list">
            <div className="p-t0-item critical">
              <span className="p-t0-label">CRITICAL ALLERGY WARNING</span>
              <b>Severe Penicillin Allergy (Anaphylaxis Risk)</b>
              <small>Verified by Hospital A Clinical System</small>
            </div>

            <div className="p-t0-item">
              <span className="p-t0-label">COMMUNICATION REQUIREMENT</span>
              <b>Preferred: Hindi / English / Gujarati</b>
            </div>

            <div className="p-t0-item">
              <span className="p-t0-label">PRIMARY EMERGENCY CONTACT</span>
              <b>Sunita Mehta (Mother) · +91 98200 •••••</b>
              <small>Factual alert dispatched when QR is scanned</small>
            </div>
          </div>

          <div className="p-locked-history-notice">
            <ProtoIcon name="lock" />
            <div>
              <b>Complete Medical File Locked 🔒</b>
              <p>Lifetime diagnoses, prescriptions, and sealed records are never stored in or accessible from this public QR.</p>
            </div>
          </div>
        </ProtoPanel>

        {/* TIER 1 AUTHENTICATION & SUMMARY */}
        <ProtoPanel
          title="Tier 1 — Professional Emergency Summary"
          subtitle="Requires authenticated emergency responder credentials and online key release."
          badge={
            <ProtoStatus tone={responderTier >= 1 ? 'teal' : responderAuthenticated ? 'amber' : 'grey'}>
              {responderTier >= 1 ? 'TIER 1 RELEASED' : responderAuthenticated ? 'AUTHENTICATED' : 'RESPONDER LOCKED'}
            </ProtoStatus>
          }
        >
          {!responderAuthenticated ? (
            <div className="p-responder-auth-box">
              <ProtoIcon name="shield" className="p-auth-icon" />
              <h4>Certified Responder Authentication</h4>
              <p>Simulate presenting your paramedic or emergency crew digital credentials.</p>

              <button
                className="primary p-wide"
                disabled={networkOffline}
                onClick={() => setResponderAuthenticated(true)}
              >
                Authenticate as Certified Medic (ID #EMS-3382)
              </button>

              {networkOffline && (
                <div className="p-offline-alert">
                  <ProtoIcon name="wifiOff" />
                  <span>Network unavailable: Tier 1 summary requires secure online key release. Offline Tier 0 remains readable.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-responder-tier1-controls">
              <div className="p-auth-success-badge">
                <ProtoIcon name="checkCircle" />
                <span>Responder Authenticated: Paramedic EMS-3382 · Active Duty</span>
              </div>

              {responderTier === 0 && (
                <button
                  className="primary p-wide"
                  disabled={networkOffline || identityConfidence === 'unverified'}
                  onClick={() => setResponderTier(1)}
                >
                  <ProtoIcon name="unlock" /> Unlock Tier 1 Emergency Summary
                </button>
              )}

              {identityConfidence === 'unverified' && (
                <p className="p-small-warning">
                  ⚠️ Credential marked &quot;Near Patient&quot;. Confirm credential location &quot;On Patient&quot; above to simulate verified possession.
                </p>
              )}
            </div>
          )}

          {responderTier >= 1 && (
            <div className="p-tier1-critical-summary">
              <span className="p-overline">PROTECTED EMERGENCY SUMMARY · CLINICAL PRIORITY</span>

              <div className="p-t1-metric-grid">
                <ProtoMetric label="1. IDENTITY CONFIDENCE" value="Possession Confirmed" subvalue="Physical credential on person" tone="teal" />
                <ProtoMetric label="2. CRITICAL ALLERGIES" value="Penicillin (Anaphylactic)" subvalue="Strict contraindicated" tone="red" />
                <ProtoMetric label="3. MEDICATION FLAGS" value="Anticoagulant Flag" subvalue="Warfarin/Aspirin check: None active" tone="normal" />
                <ProtoMetric label="4. CHRONIC CONDITIONS" value="Asthma / Reactive Airway" subvalue="Uses albuterol PRN" tone="normal" />
                <ProtoMetric label="5. IMPLANTS / HARDWARE" value="None Recorded" subvalue="No pacemaker or stent" tone="normal" />
                <ProtoMetric label="6. VERIFIED BLOOD GROUP" value="B positive (Rh+)" subvalue="Verified by Lab C · 12 Oct 2026" tone="teal" />
              </div>

              <div className="p-freshness-meta">
                <span>Clinical Freshness: Last clinically updated 12 Oct 2026 (6 days ago)</span>
              </div>
            </div>
          )}

          {/* TIER 2 BREAK-GLASS INITIATOR */}
          <div className="p-break-glass-trigger-box">
            <div>
              <b>Need Hospital Emergency Access Beyond Tier 1?</b>
              <p>Authorized ED physicians can invoke exceptional Break-Glass for unconscious trauma cases.</p>
            </div>
            <button
              className="danger small"
              onClick={() => setBreakGlassModal(true)}
            >
              Simulate Hospital Break-Glass →
            </button>
          </div>
        </ProtoPanel>
      </div>

      {/* OFFLINE RESILIENCE BANNER */}
      {networkOffline && (
        <section className="p-offline-care-banner">
          <ProtoIcon name="wifiOff" className="p-offline-icon" />
          <div>
            <h3>NETWORK LOSS SIMULATED — DIGITAL ACCESS UNAVAILABLE</h3>
            <p>
              Offline minimal Tier 0 signed payload remains cryptographically verified.
              Tier 1 remote summary cannot be released without emergency server key handshake.
            </p>
            <b className="p-golden-rule">CARE IS NEVER DENIED BECAUSE THE TECHNOLOGY FAILED. CONTINUE STANDARD CLINICAL TRAUMA CARE.</b>
          </div>
        </section>
      )}

      {/* SCANNER MODAL */}
      <ProtoModal
        title="Simulated Credential Scanner"
        isOpen={scannerModal}
        onClose={() => setScannerModal(false)}
      >
        <div className="p-scanner-modal-body">
          <div className="p-scanner-viewport">
            <div className="p-scanner-laser" />
            <InteractiveQR label="Scanning..." />
            <span className="p-scanner-hint">Simulating camera viewfinder / NFC card reader</span>
          </div>

          <div className="p-scanner-actions">
            <button className="primary" onClick={handleSimulateScan}>
              <ProtoIcon name="check" /> Scan Rahul&apos;s Emergency Credential
            </button>
            <button className="secondary" onClick={() => setScannerModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </ProtoModal>

      {/* BREAK-GLASS MODAL */}
      <ProtoModal
        title="Invoke Tier 2 Hospital Break-Glass Exception"
        isOpen={breakGlassModal}
        onClose={() => setBreakGlassModal(false)}
      >
        <div className="p-bg-modal-body">
          <div className="p-bg-warning">
            <ProtoIcon name="alert" />
            <p>
              <b>CRITICAL WARNING:</b> Break-Glass is an emergency clinical exception.
              All accessed records, clinician identity, declaring facility, and declaring reason
              are permanently committed to the immutable audit trail and reviewed by the hospital ethics committee.
            </p>
          </div>

          <div className="p-field">
            <label>Emergency Clinician</label>
            <input type="text" readOnly value="Dr. Varma, Senior Emergency Physician (#HPR-7812)" />
          </div>

          <div className="p-field">
            <label>Emergency Facility</label>
            <input type="text" readOnly value="Apex Trauma Centre / XYZ Hospital Emergency Dept" />
          </div>

          <div className="p-field">
            <label>Declared Clinical Emergency Reason</label>
            <textarea
              rows={3}
              value={bgReason}
              onChange={e => setBgReason(e.target.value)}
            />
          </div>

          <div className="p-field">
            <label>Requested Scope</label>
            <div className="p-bg-scope-chips">
              <span>✓ Prior Surgical Summaries</span>
              <span>✓ Medication History</span>
              <span>✓ Emergency Diagnostic Labs</span>
            </div>
          </div>

          <div className="p-modal-footer">
            <button className="danger" onClick={handleConfirmBreakGlass}>
              <ProtoIcon name="unlock" /> Confirm & Invoke Break-Glass Access
            </button>
            <button className="secondary" onClick={() => setBreakGlassModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </ProtoModal>
    </div>
  );
}
