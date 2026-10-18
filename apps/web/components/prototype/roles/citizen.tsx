'use client';

import React, { useState } from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric, InteractiveQR, ProtoModal } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';
import type { HealthRecord } from '../types';

export function CitizenWorkspace() {
  const {
    consent,
    updateConsentStatus,
    healthRecords,
    emergencyFields,
    updateEmergencyFieldPrivacy,
    credentials,
    setCredentialStatus,
    familyCapabilities,
    toggleFamilyCapability,
    familyRequestPending,
    setFamilyRequestPending,
    auditEvents,
    setRole,
  } = usePrototype();

  const [activeTab, setActiveTab] = useState<'today' | 'health' | 'access' | 'family' | 'emergency'>('today');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [strangerPreview, setStrangerPreview] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Filter public emergency items for stranger preview
  const publicFields = emergencyFields.filter(f => f.privacy === 'public');

  return (
    <div className="p-citizen-app">
      <PageHead
        eyebrow="CITIZEN HEALTH TRUST CONSOLE"
        title="Good afternoon, Rahul."
        copy="Your health records remain federated at your providers. You determine when, why, and for how long permission travels."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">ABHA Reference: 91-4821-••••-9012</span>
            <ProtoStatus tone={credentials.card === 'active' ? 'teal' : 'red'}>
              Card: {credentials.card.toUpperCase()}
            </ProtoStatus>
          </div>
        }
      />

      <nav className="p-tabs" aria-label="Citizen workspace sections">
        {[
          { id: 'today', label: 'Today', icon: 'heart' },
          { id: 'health', label: 'My Health Timeline', icon: 'fileText' },
          { id: 'access', label: 'Access & Consent', icon: 'shield', badge: consent.status === 'pending' ? '1 pending' : undefined },
          { id: 'family', label: 'Family Care', icon: 'family' },
          { id: 'emergency', label: 'Emergency Card', icon: 'ambulance' },
        ].map(t => (
          <button
            key={t.id}
            className={`p-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
          >
            <ProtoIcon name={t.icon} />
            <span>{t.label}</span>
            {t.badge && <span className="p-tab-badge">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {/* TAB 1: TODAY */}
      {activeTab === 'today' && (
        <div className="p-grid two">
          <div className="p-col">
            <ProtoPanel title="Today's Healthcare Routine" subtitle="Upcoming encounters and scheduled care reminders">
              <div className="p-item-row">
                <div className="p-item-left">
                  <span className="p-item-time">16:30</span>
                  <div className="p-item-meta">
                    <b>Dr. Sharma · Outpatient Consultation</b>
                    <small>XYZ Hospital, Respiratory Medicine, Room 204</small>
                  </div>
                </div>
                <ProtoStatus tone="teal">Confirmed</ProtoStatus>
              </div>

              <div className="p-item-row">
                <div className="p-item-left">
                  <span className="p-item-time">20:00</span>
                  <div className="p-item-meta">
                    <b>Evening Medication Reminder</b>
                    <small>Amoxicillin-Clavulanate 625mg (Day 7 of 7)</small>
                  </div>
                </div>
                <span className="p-item-tag">Scheduled</span>
              </div>

              <div className="p-item-row">
                <div className="p-item-left">
                  <span className="p-item-time">Recent</span>
                  <div className="p-item-meta">
                    <b>Complete Blood Count (CBC)</b>
                    <small>Verified by Lab C · 12 Oct 2026</small>
                  </div>
                </div>
                <button
                  className="p-link-btn"
                  onClick={() => {
                    setSelectedRecord(healthRecords[0]);
                  }}
                >
                  View Details →
                </button>
              </div>
            </ProtoPanel>

            {consent.status === 'pending' && (
              <div className="p-alert-card action-required">
                <div className="p-alert-icon">
                  <ProtoIcon name="alert" />
                </div>
                <div className="p-alert-content">
                  <span className="p-alert-kicker">ACTION REQUIRED</span>
                  <h4>Dr. Sharma requested clinical access</h4>
                  <p>XYZ Hospital requested Labs & Prescriptions for 2 hours for your current appointment.</p>
                  <button className="primary small" onClick={() => setActiveTab('access')}>
                    Review Consent Request →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-col">
            <ProtoPanel title="Privacy & Security at a Glance" subtitle="Active authorizations and credential posture">
              <ProtoMetric
                label="ACTIVE CLINICAL PERMISSIONS"
                value={consent.status === 'allowed' ? '1 Active (Dr. Sharma · 2h TTL)' : '0 Active (Zero unmonitored access)'}
                subvalue={consent.status === 'allowed' ? 'Expires in 1h 48m · Scoped to Labs & Prescriptions' : 'All clinical files locked'}
                tone={consent.status === 'allowed' ? 'teal' : 'normal'}
              />

              <ProtoMetric
                label="PHYSICAL EMERGENCY CARD"
                value={credentials.card === 'active' ? 'Card Ready & Active' : 'Card Revoked (Lost reported)'}
                subvalue={credentials.card === 'active' ? 'Tier 0 public minimum verified' : 'NFC & QR scan invalid'}
                tone={credentials.card === 'active' ? 'teal' : 'red'}
              />

              <ProtoMetric
                label="FAMILY CAREGIVER BOUNDARY"
                value="Capability Scoped: Reminders & Alerts"
                subvalue="Medical history browsing strictly blocked"
              />

              <div className="p-panel-cta-group">
                <button className="secondary small" onClick={() => setActiveTab('emergency')}>
                  <ProtoIcon name="qr" /> Manage Emergency Card
                </button>
                <button className="secondary small" onClick={() => setActiveTab('access')}>
                  <ProtoIcon name="eye" /> View Full Audit Log
                </button>
              </div>
            </ProtoPanel>
          </div>
        </div>
      )}

      {/* TAB 2: MY HEALTH TIMELINE */}
      {activeTab === 'health' && (
        <div className="p-health-timeline-view">
          <ProtoPanel
            title="Longitudinal Health Timeline"
            subtitle="Records remain stored at each facility. Every entry includes verified digital provenance."
            badge={<span className="p-badge-subtle">{healthRecords.length} federated records</span>}
          >
            <div className="p-timeline-list">
              {healthRecords.map(rec => (
                <div key={rec.id} className={`p-timeline-card ${rec.sealed ? 'sealed' : ''}`}>
                  <div className="p-timeline-date">
                    <span>{rec.date.split('·')[0]}</span>
                    <small>{rec.facility.split(' ')[0]}</small>
                  </div>

                  <div className="p-timeline-bullet">
                    <i />
                  </div>

                  <div className="p-timeline-body">
                    <div className="p-timeline-header">
                      <div>
                        <span className={`p-provenance-tag ${rec.provenance}`}>
                          {rec.provenance === 'verified_lab' && '✓ Verified by Laboratory'}
                          {rec.provenance === 'verified_hospital' && '✓ Verified Clinical Hospital Record'}
                          {rec.provenance === 'patient_uploaded' && '⚠ Patient Uploaded (Unverified Source)'}
                          {rec.provenance === 'patient_reported' && 'ℹ Patient Reported'}
                        </span>
                        <h4>{rec.title}</h4>
                      </div>

                      <div className="p-timeline-actions">
                        {rec.sealed && <span className="p-sealed-pill"><ProtoIcon name="lock" /> Specially Sealed</span>}
                        {rec.correctionHistory && <span className="p-correction-badge">Correction Provenance</span>}
                        <button
                          className="secondary small"
                          onClick={() => setSelectedRecord(rec)}
                        >
                          Inspect Record →
                        </button>
                      </div>
                    </div>

                    <p className="p-timeline-summary">{rec.summary}</p>
                    <div className="p-timeline-facility">
                      <span>{rec.facility}</span>
                      {rec.doctor && <span>· {rec.doctor}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProtoPanel>
        </div>
      )}

      {/* TAB 3: ACCESS & CONSENT */}
      {activeTab === 'access' && (
        <div className="p-access-view">
          <section className="p-consent-hero">
            <div className="p-consent-hero-header">
              <div>
                <span className="p-overline">ACTIVE CLINICAL CONSENT REQUEST</span>
                <h2>{consent.doctorName} <small>· {consent.facility}</small></h2>
              </div>
              <ProtoStatus
                tone={
                  consent.status === 'allowed'
                    ? 'teal'
                    : consent.status === 'pending'
                    ? 'amber'
                    : consent.status === 'revoked'
                    ? 'red'
                    : 'grey'
                }
              >
                {consent.status.toUpperCase()}
              </ProtoStatus>
            </div>

            <div className="p-four-metrics">
              <ProtoMetric label="WHO" value={consent.doctorName} subvalue={consent.facility} />
              <ProtoMetric label="WHAT" value="Labs + Prescriptions" subvalue="Consultations & other records locked" />
              <ProtoMetric label="WHY" value="Current treatment" subvalue={consent.purpose} />
              <ProtoMetric label="HOW LONG" value={`${consent.durationMinutes / 60} hours`} subvalue={consent.status === 'allowed' ? 'Expires 12:08 PM' : 'Short-lived TTL'} />
            </div>

            <div className="p-consent-actions">
              {consent.status === 'pending' && (
                <>
                  <button className="primary" onClick={() => updateConsentStatus('allowed')}>
                    <ProtoIcon name="check" /> Allow Access for 2 Hours
                  </button>
                  <button className="secondary danger-text" onClick={() => updateConsentStatus('denied')}>
                    <ProtoIcon name="xCircle" /> Deny Request
                  </button>
                </>
              )}

              {consent.status === 'allowed' && (
                <>
                  <button className="danger" onClick={() => updateConsentStatus('revoked')}>
                    <ProtoIcon name="lock" /> Revoke Access Immediately
                  </button>
                  <button className="secondary" onClick={() => updateConsentStatus('expired')}>
                    Simulate 2-Hour Expiration
                  </button>
                  <button className="secondary" onClick={() => setRole('doctor')}>
                    Switch to Doctor View to Confirm Authorization →
                  </button>
                </>
              )}

              {(consent.status === 'denied' || consent.status === 'revoked' || consent.status === 'expired') && (
                <button className="secondary" onClick={() => updateConsentStatus('pending')}>
                  <ProtoIcon name="refresh" /> Reset Request for Demo
                </button>
              )}
            </div>
          </section>

          <ProtoPanel
            title="Real-Time Access Audit Trail"
            subtitle="Every consent decision, emergency query, and provider retrieval is permanently recorded with cryptographic commitments."
          >
            <div className="p-audit-table">
              {auditEvents.map(evt => (
                <div key={evt.id} className="p-audit-row">
                  <span className="p-audit-time">{evt.timestamp}</span>
                  <div className="p-audit-actor">
                    <b>{evt.actor}</b>
                    <small>{evt.facility}</small>
                  </div>
                  <div className="p-audit-desc">
                    <p>{evt.action}</p>
                    <small>Purpose: {evt.purpose} · Commitment: <code>{evt.commitmentHash}</code></small>
                  </div>
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
              ))}
            </div>
          </ProtoPanel>
        </div>
      )}

      {/* TAB 4: FAMILY CARE */}
      {activeTab === 'family' && (
        <div className="p-family-view">
          <div className="p-grid two">
            <ProtoPanel
              title="Family Caregiver Permissions"
              subtitle="Caregiver: Sunita Mehta (Mother). Capability-based permissions without medical surveillance."
            >
              <div className="p-cap-list">
                {[
                  { id: 'reminders', label: 'Medication reminders', desc: 'Can confirm when routine medication was taken or missed', state: familyCapabilities.reminders },
                  { id: 'appointments', label: 'Appointment schedule assistance', desc: 'Can view appointment times and accompany patient', state: familyCapabilities.appointments },
                  { id: 'emergencyAlerts', label: 'Emergency incident notifications', desc: 'Receives factual SMS/App alert when emergency QR is scanned', state: familyCapabilities.emergencyAlerts },
                  { id: 'selectedClinical', label: 'Selected clinical categories (e.g., orthopedic)', desc: 'Explicitly shared documents for caregiving support', state: familyCapabilities.selectedClinical },
                ].map(c => (
                  <div key={c.id} className="p-cap-row">
                    <div className="p-cap-info">
                      <b>{c.label}</b>
                      <small>{c.desc}</small>
                    </div>
                    <button
                      className={`p-toggle-btn ${c.state ? 'on' : 'off'}`}
                      onClick={() => toggleFamilyCapability(c.id as Parameters<typeof toggleFamilyCapability>[0])}
                    >
                      {c.state ? 'ALLOWED ✓' : 'NOT SHARED'}
                    </button>
                  </div>
                ))}

                <div className="p-cap-row disabled">
                  <div className="p-cap-info">
                    <b>Complete medical history & psychiatric records</b>
                    <small>Adult longitudinal history is permanently protected from automatic family browsing.</small>
                  </div>
                  <span className="p-lock-badge">
                    <ProtoIcon name="lock" /> PERMANENTLY BLOCKED
                  </span>
                </div>
              </div>

              <div className="p-info-callout">
                <ProtoIcon name="shield" />
                <p>
                  <b>Constitutional Principle:</b> Family relationship ≠ Medical consent.
                  Adult medical history remains private unless an adult citizen explicitly shares a scoped category.
                </p>
              </div>
            </ProtoPanel>

            <ProtoPanel
              title="Caregiver Notification Preview"
              subtitle="What Sunita sees when a medication is missed or an emergency occurs."
            >
              <div className="p-notification-preview-card">
                <span className="p-preview-tag">SAMPLE LOCK SCREEN NOTIFICATION</span>
                <div className="p-notif-box">
                  <div className="p-notif-header">
                    <span className="p-notif-source">JeevanRekha Care</span>
                    <span className="p-notif-time">20:15</span>
                  </div>
                  <b>Medication reminder missed for Rahul</b>
                  <p>A scheduled routine evening dose has not been logged.</p>
                  <small className="p-notif-privacy">
                    🔒 Privacy Protection: Specific medication name, diagnosis, and prescriber are NOT revealed to caregiver.
                  </small>
                </div>

                <div className="p-notif-box emergency">
                  <div className="p-notif-header">
                    <span className="p-notif-source">JeevanRekha Emergency Alert</span>
                    <span className="p-notif-time">14:32</span>
                  </div>
                  <b>Emergency credential accessed</b>
                  <p>An emergency credential associated with Rahul was scanned near Vadodara West.</p>
                  <small className="p-notif-privacy">
                    🛡️ Factual alert only: Does not assert an accident definitely occurred. Official alerts NEVER ask for OTP, PIN, or payment.
                  </small>
                </div>
              </div>
            </ProtoPanel>
          </div>
        </div>
      )}

      {/* TAB 5: EMERGENCY CARD */}
      {activeTab === 'emergency' && (
        <div className="p-emergency-view">
          <div className="p-grid two">
            {/* Visual Credential */}
            <div className="p-col">
              <div className="p-em-card-showcase">
                <div className="p-em-card-head">
                  <span className="p-em-brand">JEEVANREKHA EMERGENCY CARD</span>
                  <ProtoStatus tone={credentials.card === 'active' ? 'teal' : 'red'}>
                    {credentials.card === 'active' ? 'CREDENTIAL READY' : 'CARD REVOKED'}
                  </ProtoStatus>
                </div>

                <div className="p-em-card-content">
                  <div>
                    <span className="p-em-id-label">CITIZEN IDENTITY</span>
                    <h3>Rahul Mehta</h3>
                    <p className="p-em-sub">Fictional Demo Profile · Age 34 · ABHA Ref #4821</p>
                    <div className="p-em-chips">
                      <span className="p-chip danger">Critical Allergy: Penicillin</span>
                      <span className="p-chip">Blood: B+</span>
                    </div>
                  </div>

                  <div className="p-em-card-qr">
                    <InteractiveQR
                      label="Emergency QR: Click to open simulated scanner"
                      onScan={() => {
                        setRole('responder');
                      }}
                    />
                  </div>
                </div>

                <div className="p-em-card-foot">
                  <span>Public Tier 0 disclosure is strictly limited</span>
                  <ProtoIcon name="lock" />
                </div>
              </div>

              <div className="p-credential-manager">
                <h4>Independent Credential Management</h4>
                <p>Lost credentials can be revoked independently without replacing your digital identity.</p>

                <div className="p-cred-row">
                  <div>
                    <b>Physical Plastic Health Card</b>
                    <small>Unique ID: #CARD-7741 · Status: {credentials.card.toUpperCase()}</small>
                  </div>
                  <button
                    className={credentials.card === 'active' ? 'danger small' : 'secondary small'}
                    onClick={() => setCredentialStatus('card', credentials.card === 'active' ? 'revoked' : 'active')}
                  >
                    {credentials.card === 'active' ? 'Report Card Lost & Revoke' : 'Reissue Card'}
                  </button>
                </div>

                <div className="p-cred-row">
                  <div>
                    <b>Mobile Phone Credential</b>
                    <small>Samsung Galaxy · Status: {credentials.phone.toUpperCase()}</small>
                  </div>
                  <button
                    className={credentials.phone === 'active' ? 'danger small' : 'secondary small'}
                    onClick={() => setCredentialStatus('phone', credentials.phone === 'active' ? 'revoked' : 'active')}
                  >
                    {credentials.phone === 'active' ? 'Revoke Device' : 'Reactivate Device'}
                  </button>
                </div>

                <div className="p-cred-row">
                  <div>
                    <b>Emergency Wristband</b>
                    <small>NFC Smartband · Status: {credentials.wearable.toUpperCase()}</small>
                  </div>
                  <button
                    className={credentials.wearable === 'active' ? 'danger small' : 'secondary small'}
                    onClick={() => setCredentialStatus('wearable', credentials.wearable === 'active' ? 'revoked' : 'active')}
                  >
                    {credentials.wearable === 'active' ? 'Revoke Band' : 'Reissue Band'}
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Controls & Stranger Preview */}
            <div className="p-col">
              <ProtoPanel
                title="Emergency Disclosure Privacy Controls"
                subtitle="You choose whether each eligible emergency item is visible to the public, certified responders only, or hidden."
              >
                <div className="p-field-privacy-list">
                  {emergencyFields.map(field => (
                    <div key={field.id} className="p-field-privacy-row">
                      <div className="p-field-info">
                        <b>{field.label}</b>
                        <small>{field.value}</small>
                      </div>

                      <div className="p-privacy-select">
                        <select
                          value={field.privacy}
                          onChange={e =>
                            updateEmergencyFieldPrivacy(
                              field.id,
                              e.target.value as 'public' | 'responders_only' | 'dont_show'
                            )
                          }
                          aria-label={`Privacy for ${field.label}`}
                        >
                          <option value="public">Public (Tier 0)</option>
                          <option value="responders_only">Responders Only (Tier 1)</option>
                          <option value="dont_show">Do Not Show</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-stranger-preview-cta">
                  <button
                    className="primary"
                    onClick={() => setStrangerPreview(!strangerPreview)}
                  >
                    <ProtoIcon name="eye" /> {strangerPreview ? 'Hide' : 'View'} What Strangers Can See
                  </button>
                  <button
                    className="secondary"
                    onClick={() => setRole('responder')}
                  >
                    <ProtoIcon name="ambulance" /> Open Responder Simulation →
                  </button>
                </div>

                {strangerPreview && (
                  <div className="p-stranger-preview-box">
                    <div className="p-preview-badge">
                      <ProtoIcon name="eye" /> EXACT TIER 0 PUBLIC SCAN DISPLAY
                    </div>
                    <h4>Public Emergency Summary</h4>
                    <p className="p-preview-desc">This is exactly what a passer-by or stranger sees when scanning Rahul&apos;s QR code:</p>

                    <ul className="p-preview-public-list">
                      {publicFields.map(f => (
                        <li key={f.id}>
                          <b>{f.label.split(':')[0]}:</b> <span>{f.value}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="p-preview-locked-warning">
                      <ProtoIcon name="lock" />
                      <span>
                        Full medical history, prior prescriptions, and sealed records are permanently locked and cannot be accessed from this public QR.
                      </span>
                    </div>
                  </div>
                )}
              </ProtoPanel>
            </div>
          </div>
        </div>
      )}

      {/* RECORD DETAIL MODAL */}
      <ProtoModal
        title={selectedRecord?.title || 'Record Detail'}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <div className="p-record-modal-body">
            <div className="p-record-modal-meta">
              <span className={`p-provenance-tag ${selectedRecord.provenance}`}>
                Provenance: {selectedRecord.provenance.replace('_', ' ').toUpperCase()}
              </span>
              <span className="p-record-date">{selectedRecord.date}</span>
            </div>

            <div className="p-record-modal-section">
              <h4>Clinical Summary</h4>
              <p>{selectedRecord.summary}</p>
            </div>

            <div className="p-record-modal-section">
              <h4>Encounter Provenance & Details</h4>
              <ul>
                <li><b>Facility:</b> {selectedRecord.facility}</li>
                {selectedRecord.doctor && <li><b>Authoring Clinician:</b> {selectedRecord.doctor}</li>}
                {selectedRecord.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            {selectedRecord.correctionHistory && (
              <div className="p-record-correction-box">
                <div className="p-correction-head">
                  <ProtoIcon name="refresh" />
                  <b>RECORD CORRECTION PROVENANCE (IMMUTABLE AUDIT)</b>
                </div>
                <div className="p-correction-diff">
                  <div className="diff-original">
                    <span className="diff-label">ORIGINAL VERSION:</span>
                    <p>{selectedRecord.correctionHistory.original}</p>
                  </div>
                  <div className="diff-arrow">↓</div>
                  <div className="diff-corrected">
                    <span className="diff-label">CURRENT CLINICAL VERSION:</span>
                    <p>{selectedRecord.correctionHistory.correction}</p>
                  </div>
                </div>
                <small className="p-correction-meta">
                  Author: {selectedRecord.correctionHistory.author} · Reason: {selectedRecord.correctionHistory.reason} · Verified: {selectedRecord.correctionHistory.timestamp}
                </small>
              </div>
            )}

            <div className="p-modal-footer">
              <button className="secondary" onClick={() => setSelectedRecord(null)}>
                Close Record
              </button>
            </div>
          </div>
        )}
      </ProtoModal>
    </div>
  );
}
