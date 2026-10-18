'use client';

import React from 'react';
import { PrototypeProvider, usePrototype } from './state';
import { ProtoHeader, ProtoRoleBar, ROLE_DEFINITIONS } from './shared/header';
import { JuryBar } from './jury/jury-bar';
import { PrototypeHub } from './roles/hub';
import { CitizenWorkspace } from './roles/citizen';
import { DoctorWorkspace } from './roles/doctor';
import { ResponderWorkspace } from './roles/responder';
import { FamilyWorkspace } from './roles/family';
import { PublicHealthWorkspace } from './roles/public-health';
import { SecurityWorkspace } from './roles/security';
import { ArchitectureWorkspace } from './roles/architecture';
import { EmergencyProtectionLab } from './roles/emergency-lab';
import { AggregationLabWorkspace } from './roles/aggregation-lab';
import { FailureLabWorkspace } from './roles/failure-lab';
import { ProtoIcon } from './shared/icons';

function PrototypeMain() {
  const { role, setRole, juryStep } = usePrototype();

  return (
    <div className="prototype-shell">
      <ProtoHeader />
      <ProtoRoleBar />

      {juryStep > 0 && <JuryBar />}

      {role === 'hub' ? (
        <PrototypeHub />
      ) : (
        <div className="p-workspace-layout">
          {/* Quick Role Switcher Sidebar */}
          <aside className="p-side-nav" aria-label="Role Switcher Sidebar">
            <span className="p-side-nav-title">WORKSPACES & LABS</span>
            <div className="p-side-nav-list">
              {ROLE_DEFINITIONS.map(r => (
                <button
                  key={r.id}
                  className={`p-side-btn ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <ProtoIcon name={r.icon} className="p-side-icon" />
                  <div className="p-side-btn-text">
                    <b>{r.label}</b>
                    <small>{r.sub}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-side-footer-actions">
              <button
                className="p-side-back-btn"
                onClick={() => setRole('hub')}
              >
                ← Return to Hub
              </button>
            </div>
          </aside>

          {/* Main Workspace Area */}
          <main className="p-workspace-content">
            {role === 'citizen' && <CitizenWorkspace />}
            {role === 'doctor' && <DoctorWorkspace />}
            {role === 'responder' && <ResponderWorkspace />}
            {role === 'family' && <FamilyWorkspace />}
            {role === 'public-health' && <PublicHealthWorkspace />}
            {role === 'security' && <SecurityWorkspace />}
            {role === 'architecture' && <ArchitectureWorkspace />}
            {role === 'emergency-lab' && <EmergencyProtectionLab />}
            {role === 'aggregation-lab' && <AggregationLabWorkspace />}
            {role === 'failure-lab' && <FailureLabWorkspace />}
          </main>
        </div>
      )}
    </div>
  );
}

export function PrototypeExperience() {
  return (
    <PrototypeProvider>
      <PrototypeMain />
    </PrototypeProvider>
  );
}
