'use client';

import React, { useState } from 'react';
import { PageHead, ProtoPanel, ProtoMetric } from '../shared/panels';
import { ProtoIcon } from '../shared/icons';
import { ProtoStatus } from '../shared/status-badge';
import { usePrototype } from '../state';

export function FailureLabWorkspace() {
  const { failureScenario, setFailureScenario, setRole } = usePrototype();

  const scenarios = [
    {
      id: 'internet',
      label: '1. Internet Offline (Rural / Disaster)',
      title: 'Complete Network Connectivity Loss',
      whatStopped: 'Remote federated queries to Hospital A and cloud consent token verification cannot reach servers.',
      whatRemains: 'Digitally signed offline Tier 0 emergency payload on physical card remains verifiable. Printed emergency details on plastic card remain readable.',
      whatToDo: 'Paramedics and ED clinicians proceed with standard emergency clinical algorithms (ATLS, ABCDE). Triage is never delayed.',
      whatHappensLater: 'When connectivity returns, encounter summaries queue and synchronize securely in background.',
    },
    {
      id: 'jeevanrekha',
      label: '2. JeevanRekha Cloud Service Down',
      title: 'Central Trust & Access Engine Outage',
      whatStopped: 'New digital consent token issuance and real-time audit ledger commits are temporarily paused.',
      whatRemains: 'Hospitals already holding cached local electronic health records continue routine care. Physical credentials still verify locally.',
      whatToDo: 'Hospitals revert to standard hospital encounter registration and bedside clinical history. Patient care is delivered.',
      whatHappensLater: 'Integrity logs reconcile once the distributed trust gateway restores.',
    },
    {
      id: 'provider',
      label: '3. Hospital Provider System Offline',
      title: 'Hospital B Record Store Unavailable / Ransomware Isolation',
      whatStopped: 'Federated retrieval of prior Hospital B records cannot resolve.',
      whatRemains: 'Records from Lab C, Hospital A, and patient-uploaded timeline remain fully accessible.',
      whatToDo: 'Doctor Sharma treats patient using available verified CBC lab results and bedside clinical examination.',
      whatHappensLater: 'Hospital B status flags as "Temporarily Offline" with zero data corruption.',
    },
    {
      id: 'phone_damaged',
      label: '4. Citizen Smartphone Destroyed in Incident',
      title: 'Mobile Device Crushed or Battery Exhausted',
      whatStopped: 'Mobile app push notifications, digital QR screen, and citizen self-service consent app are inaccessible.',
      whatRemains: 'Physical emergency card in wallet, emergency NFC wristband, or hospital identity matching workflow.',
      whatToDo: 'Responders scan physical card or proceed with hospital trauma intake without waiting for phone.',
      whatHappensLater: 'Rahul logs into new replacement phone later; lost device is revoked with one click without changing health identity.',
    },
    {
      id: 'no_credential',
      label: '5. Patient Unidentified & No Credential Available',
      title: 'Unconscious Patient with Zero Belongings',
      whatStopped: 'Digital lookup, ABHA matching, and Tier 0/1 summary cannot be queried.',
      whatRemains: 'Full emergency clinical care, hospital trauma protocol, blood matching, emergency resuscitation.',
      whatToDo: 'Emergency department treats patient as "Unknown Trauma Male 30s" under universal clinical emergency standards.',
      whatHappensLater: 'JeevanRekha NEVER conducts a coercive national biometric scan. Family or hospital identifies patient through proper clinical channels.',
    },
  ];

  const current = scenarios.find(s => s.id === failureScenario) || scenarios[0];

  return (
    <div className="p-failure-lab-app">
      <PageHead
        eyebrow="RESILIENCE & FAILURE ENGINEERING LAB"
        title="Technology can fail. Care continues."
        copy="A healthcare system that protects confidentiality while preventing clinicians from treating patients is not a successful health system."
        actions={
          <div className="p-head-stats">
            <span className="p-pill">Principle: Digital Failure ≠ Clinical Denial</span>
            <button className="primary small" onClick={() => setRole('hub')}>
              ← Back to Hub
            </button>
          </div>
        }
      />

      {/* HERO BANNER: CARE CONTINUES */}
      <section className="p-hero-care-continues">
        <div className="p-hero-care-left">
          <ProtoIcon name="heart" className="p-hero-heart" />
          <div>
            <span className="p-overline light">THE NON-NEGOTIABLE CORE MOTTO</span>
            <h2>CARE IS NEVER DENIED BECAUSE JEEVANREKHA FAILED.</h2>
            <p>
              Digital access can fail. Servers can crash. Internet can drop. Credentials can be lost.
              Healthcare always continues through human clinical competence.
            </p>
          </div>
        </div>
      </section>

      {/* OUTAGE SCENARIO SWITCHER */}
      <div className="p-failure-selector-bar">
        {scenarios.map(s => (
          <button
            key={s.id}
            className={`p-failure-tab-btn ${failureScenario === s.id ? 'active' : ''}`}
            onClick={() => setFailureScenario(s.id as Parameters<typeof setFailureScenario>[0])}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* DETAILED SCENARIO DRILLDOWN */}
      <div className="p-grid two">
        <ProtoPanel
          title={current.title}
          subtitle="Systemic failure analysis and graceful operational degradation"
          badge={<ProtoStatus tone="amber">OUTAGE SIMULATED</ProtoStatus>}
        >
          <div className="p-failure-qa-grid">
            <div className="p-qa-box stopped">
              <span className="p-qa-tag red">WHAT STOPPED?</span>
              <p>{current.whatStopped}</p>
            </div>

            <div className="p-qa-box remains">
              <span className="p-qa-tag teal">WHAT REMAINS AVAILABLE?</span>
              <p>{current.whatRemains}</p>
            </div>

            <div className="p-qa-box action">
              <span className="p-qa-tag blue">WHAT SHOULD CLINICIANS DO?</span>
              <p>{current.whatToDo}</p>
            </div>

            <div className="p-qa-box later">
              <span className="p-qa-tag grey">WHAT HAPPENS LATER?</span>
              <p>{current.whatHappensLater}</p>
            </div>
          </div>
        </ProtoPanel>

        <ProtoPanel
          title="Constitutional Safety Rules"
          subtitle="Architectural guarantees designed to prevent technology-induced patient harm."
        >
          <div className="p-safety-rule-list">
            <div className="p-safety-rule-item">
              <div className="p-safety-icon"><ProtoIcon name="checkCircle" /></div>
              <div>
                <b>Zero Hard Digital Gatekeepers:</b>
                <p>No hospital triage door, ambulance dispatch, or ICU admission is gated behind successful biometric authentication or QR scan.</p>
              </div>
            </div>

            <div className="p-safety-rule-item">
              <div className="p-safety-icon"><ProtoIcon name="shield" /></div>
              <div>
                <b>No National Biometric Searches on Unidentified Patients:</b>
                <p>If an unconscious person has no credential, JeevanRekha does not execute mass facial or fingerprint searches. Identification follows clinical and police welfare protocols.</p>
              </div>
            </div>

            <div className="p-safety-rule-item">
              <div className="p-safety-icon"><ProtoIcon name="lock" /></div>
              <div>
                <b>No Coercive Phone Unlocking:</b>
                <p>Responders never press an unconscious patient&apos;s limp finger against a phone scanner to unlock personal photos or chats.</p>
              </div>
            </div>

            <div className="p-safety-rule-item hero">
              <div className="p-safety-icon"><ProtoIcon name="heart" /></div>
              <div>
                <b>Care Continues:</b>
                <p>Digital systems exist to serve human health, not to become a failure point for emergency treatment.</p>
              </div>
            </div>
          </div>
        </ProtoPanel>
      </div>
    </div>
  );
}
