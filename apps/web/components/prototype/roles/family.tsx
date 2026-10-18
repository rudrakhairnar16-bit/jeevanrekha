'use client';

import React from 'react';
import { usePrototype } from '../state';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoStatus } from '../shared/status-badge';
import { ProtoIcon } from '../shared/icons';

export function FamilyWorkspace() {
  const {
    familyCapabilities,
    toggleFamilyCapability,
    familyRequestPending,
    setFamilyRequestPending,
    responderTier,
    setRole,
  } = usePrototype();

  return (
    <div className="p-family-app">
      <PageHead
        eyebrow="FAMILY & CAREGIVER CONSOLE · SUNITA MEHTA"
        title="Care without surveillance."
        copy="Support loved ones with routine reminders and factual emergency alerts without browsing their complete private medical life."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">Caregiver: Sunita Mehta (Mother)</span>
            <span className="p-pill">Assisting: Rahul Mehta (Son)</span>
          </div>
        }
      />

      <div className="p-grid two">
        {/* Capabilities Granted */}
        <ProtoPanel
          title="Active Caregiving Capabilities"
          subtitle="Permissions granted by Rahul Mehta. Each capability is independent and granular."
        >
          <div className="p-cap-list">
            <div className="p-cap-row">
              <div className="p-cap-info">
                <b>Medication reminders</b>
                <small>Can verify whether Rahul logged his scheduled dose</small>
              </div>
              <button
                className={`p-toggle-btn ${familyCapabilities.reminders ? 'on' : 'off'}`}
                onClick={() => toggleFamilyCapability('reminders')}
              >
                {familyCapabilities.reminders ? 'ACTIVE ✓' : 'INACTIVE'}
              </button>
            </div>

            <div className="p-cap-row">
              <div className="p-cap-info">
                <b>Appointment companion assistance</b>
                <small>Can view clinic times (XYZ Hospital 16:30 today)</small>
              </div>
              <button
                className={`p-toggle-btn ${familyCapabilities.appointments ? 'on' : 'off'}`}
                onClick={() => toggleFamilyCapability('appointments')}
              >
                {familyCapabilities.appointments ? 'ACTIVE ✓' : 'INACTIVE'}
              </button>
            </div>

            <div className="p-cap-row">
              <div className="p-cap-info">
                <b>Factual emergency notifications</b>
                <small>Notified immediately when an emergency credential is scanned</small>
              </div>
              <button
                className={`p-toggle-btn ${familyCapabilities.emergencyAlerts ? 'on' : 'off'}`}
                onClick={() => toggleFamilyCapability('emergencyAlerts')}
              >
                {familyCapabilities.emergencyAlerts ? 'ACTIVE ✓' : 'INACTIVE'}
              </button>
            </div>

            <div className="p-cap-row">
              <div className="p-cap-info">
                <b>Selected clinical categories (Orthopedic)</b>
                <small>Explicitly shared knee arthroscopy discharge file</small>
              </div>
              <button
                className={`p-toggle-btn ${familyCapabilities.selectedClinical ? 'on' : 'off'}`}
                onClick={() => toggleFamilyCapability('selectedClinical')}
              >
                {familyCapabilities.selectedClinical ? 'ACTIVE ✓' : 'NOT SHARED'}
              </button>
            </div>

            <div className="p-cap-row disabled">
              <div className="p-cap-info">
                <b>Complete medical history & mental health files</b>
                <small>Adult longitudinal history is permanently protected from family browsing.</small>
              </div>
              <span className="p-lock-badge">
                <ProtoIcon name="lock" /> NOT PERMITTED
              </span>
            </div>
          </div>

          <div className="p-family-request-box">
            <h4>Need to help with a specific health document?</h4>
            <p>Family members can request capability to assist with specific encounters.</p>
            {!familyRequestPending ? (
              <button
                className="secondary small"
                onClick={() => setFamilyRequestPending(true)}
              >
                Request Assistance Permission for Knee Records →
              </button>
            ) : (
              <div className="p-pending-family-msg">
                <ProtoStatus tone="amber">REQUEST DISPATCHED</ProtoStatus>
                <span>Request sent to Rahul&apos;s phone. Rahul can approve or deny.</span>
              </div>
            )}
          </div>
        </ProtoPanel>

        {/* Live Notification Previews */}
        <ProtoPanel
          title="Caregiver Notification Stream"
          subtitle="Real-time notifications sent to Sunita's smartphone. Designed with strict privacy-preserving boundaries."
        >
          {responderTier > 0 ? (
            <div className="p-notif-box emergency">
              <div className="p-notif-header">
                <ProtoStatus tone="amber" pulsing>
                  EMERGENCY CREDENTIAL ACCESSED
                </ProtoStatus>
                <span className="p-notif-time">14:32</span>
              </div>
              <h3>Emergency Credential Associated with Rahul was Scanned</h3>
              <p>Approximate incident area: Vadodara West Ring Road. Responders have been dispatched.</p>
              <div className="p-scam-shield">
                <ProtoIcon name="shield" />
                <div>
                  <b>SCAM & EXTORTION PROTECTION</b>
                  <p>
                    Official JeevanRekha emergency alerts NEVER ask for money, OTP, PIN, banking passwords, or gift cards.
                    Check the trusted JeevanRekha app directly to confirm emergency details.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-notif-box">
              <div className="p-notif-header">
                <ProtoStatus tone="teal">ROUTINE CARE NOTIFICATION</ProtoStatus>
                <span className="p-notif-time">20:15</span>
              </div>
              <h3>Medication reminder missed for Rahul</h3>
              <p>A scheduled routine evening dose has not been confirmed.</p>
              <div className="p-privacy-note">
                <ProtoIcon name="eyeOff" />
                <p>
                  <b>Privacy Preserving:</b> The specific medication name, diagnosis, and prescriber are NOT revealed to the family member.
                  You can call Rahul to remind him without knowing his private medical details.
                </p>
              </div>
            </div>
          )}

          <div className="p-family-card-footer">
            <button className="secondary small" onClick={() => setRole('citizen')}>
              Switch to Rahul&apos;s Citizen Console →
            </button>
          </div>
        </ProtoPanel>
      </div>
    </div>
  );
}
