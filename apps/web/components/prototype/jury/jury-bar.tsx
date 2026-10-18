import React from 'react';
import { usePrototype } from '../state';
import { ProtoIcon } from '../shared/icons';
import type { JuryStep, Role } from '../types';

export const JURY_STEPS: JuryStep[] = [
  {
    number: 1,
    title: 'Distributed Records at Providers',
    role: 'citizen',
    description: 'Rahul Mehta has clinical records distributed across Hospital A, Lab C, and Apex Clinic. JeevanRekha is not a centralized medical database.',
    whyItMatters: 'Records remain where they were created. No honeypot database of India\'s complete medical files.'
  },
  {
    number: 2,
    title: 'Routine Healthcare Encounter',
    role: 'doctor',
    description: 'Rahul visits XYZ Hospital for respiratory discomfort. Dr. Sharma logs into the clinical interface.',
    whyItMatters: 'Clinical encounters begin with professional identity and facility authentication.'
  },
  {
    number: 3,
    title: 'Patient Matching Confirmed',
    role: 'doctor',
    description: 'Dr. Sharma verifies the patient standing in front of him matches Rahul Mehta (Age 34, •••• 4821).',
    whyItMatters: 'Wrong-patient safety checks prevent common medical record mix-ups.'
  },
  {
    number: 4,
    title: 'Identity Confirmed ≠ History Unlocked',
    role: 'doctor',
    description: 'Even after confirming Rahul\'s identity, zero medical records open automatically.',
    whyItMatters: 'CONSTITUTIONAL RULE: Knowing who the patient is does not grant permission to browse their lifetime records.'
  },
  {
    number: 5,
    title: 'Scoped Minimum-Necessary Request',
    role: 'doctor',
    description: 'Dr. Sharma requests only Labs + Prescriptions for 2 hours for current treatment.',
    whyItMatters: 'Doctors request only what is needed for this specific encounter, not a lifetime master key.'
  },
  {
    number: 6,
    title: 'Citizen Receives Scoped Request',
    role: 'citizen',
    description: 'Rahul\'s device displays the real-time consent request: WHO (Dr. Sharma), WHAT (Labs + Prescriptions), WHY (Treatment), HOW LONG (2 hours).',
    whyItMatters: 'Meaningful consent requires plain-language understanding without dark patterns.'
  },
  {
    number: 7,
    title: 'Citizen Grants Authorization',
    role: 'citizen',
    description: 'Rahul selects "Allow for 2 hours". Authorization token is minted with strict cryptographic expiry.',
    whyItMatters: 'Citizen remains the sovereign controller of access permissions.'
  },
  {
    number: 8,
    title: 'Doctor Receives Scoped Records Only',
    role: 'doctor',
    description: 'Dr. Sharma\'s screen unlocks ONLY Labs (from Lab C) and Prescriptions (from Hospital A). All other records remain inaccessible.',
    whyItMatters: 'RIGHT DATA. MINIMUM NECESSARY. Other hospital files remain strictly locked.'
  },
  {
    number: 9,
    title: 'Specially Protected Episode Remains Sealed',
    role: 'doctor',
    description: 'Rahul\'s confidential psychiatric therapy record from MindCare remains completely sealed. Linked diagnosis, medicine, and metadata do not leak.',
    whyItMatters: 'Privacy boundaries protect relationships between records, not just single diagnosis words.'
  },
  {
    number: 10,
    title: 'Citizen Audits Real-Time Access History',
    role: 'citizen',
    description: 'Rahul opens Access History and sees Dr. Sharma\'s active permission, exact categories retrieved, and remaining countdown.',
    whyItMatters: 'Complete transparency without cryptographic jargon.'
  },
  {
    number: 11,
    title: 'Emergency Incident & Credential Scan',
    role: 'responder',
    description: 'Later, an emergency incident occurs. A passer-by scans Rahul\'s physical emergency credential.',
    whyItMatters: 'Emergency response begins before an ambulance arrives.'
  },
  {
    number: 12,
    title: 'Stranger Sees Tier 0 Public Minimum Only',
    role: 'responder',
    description: 'The public scan displays ONLY deliberate public emergency fields: severe penicillin anaphylaxis and language needs. Complete medical history is locked.',
    whyItMatters: 'A QR IS NOT A PASSWORD TO YOUR MEDICAL LIFE. Strangers cannot browse your history.'
  },
  {
    number: 13,
    title: 'Professional Responder Verification',
    role: 'responder',
    description: 'Certified emergency medic authenticates on duty. Credential location check confirms "Found On Patient".',
    whyItMatters: 'Separates public passer-by capability from certified clinical responder authority.'
  },
  {
    number: 14,
    title: 'Tier 1 Limited Emergency Summary Releases',
    role: 'responder',
    description: 'Emergency responder receives pre-computed emergency summary: critical allergies, medication flags, blood group provenance, and emergency contact.',
    whyItMatters: 'Fast emergency clinical summary without waiting for federated hospital queries at 2 AM.'
  },
  {
    number: 15,
    title: 'Family Receives Factual Emergency Alert',
    role: 'family',
    description: 'Rahul\'s mother Sunita receives: "Emergency credential accessed at 14:32". Does not claim an accident definitely occurred, and NEVER asks for money, OTP, or PIN.',
    whyItMatters: 'Factual family safety alerts protected against extortion scams.'
  },
  {
    number: 16,
    title: 'Security & Audit Console Logs Event',
    role: 'security',
    description: 'The emergency access event is recorded in the append-only tamper-evident transparency structure.',
    whyItMatters: 'High-risk actions create immutable evidence without publishing plaintext patient data.'
  },
  {
    number: 17,
    title: 'Public Health: District Case Cluster',
    role: 'public-health',
    description: '10 facilities each record 2 unusual respiratory cases. Local counts are protected via 2-path secure aggregation.',
    whyItMatters: 'Small facility counts are not suppressed or exposed individually.'
  },
  {
    number: 18,
    title: 'District Signal with Coverage & Confidence',
    role: 'public-health',
    description: 'Vadodara District dashboard displays an unusual upward trend. Reporting coverage is 81%, status: INVESTIGATION RECOMMENDED.',
    whyItMatters: 'No data ≠ no disease. AI does not autonomously declare an epidemic; human epidemiologists investigate.'
  },
  {
    number: 19,
    title: 'Total System Outage Simulated',
    role: 'failure-lab',
    description: 'Simulate complete internet, service, and phone outage during an acute trauma case.',
    whyItMatters: 'Technology is fallible. Digital dependency must never create clinical paralysis.'
  },
  {
    number: 20,
    title: 'CARE CONTINUES',
    role: 'failure-lab',
    description: 'Digital credentials disappear. Clinicians proceed with standard clinical trauma protocols. Treatment is delivered.',
    whyItMatters: 'THE GOLDEN RULE OF JEEVANREKHA: CARE IS NEVER DENIED BECAUSE THE TECHNOLOGY FAILED.'
  }
];

export function JuryBar() {
  const { juryStep, setJuryStep, setRole, updateConsentStatus, setDoctorPatientMatched, setResponderTier, setCredentialLocation, setResponderAuthenticated, setFailureScenario } = usePrototype();

  if (juryStep < 1 || juryStep > JURY_STEPS.length) return null;

  const currentStep = JURY_STEPS[juryStep - 1];

  const goToStep = (stepNum: number) => {
    const target = Math.max(1, Math.min(JURY_STEPS.length, stepNum));
    setJuryStep(target);
    const stepConfig = JURY_STEPS[target - 1];
    setRole(stepConfig.role);

    // Auto-configure state to match the narrative step
    if (target === 1) {
      updateConsentStatus('pending');
      setDoctorPatientMatched(false);
      setResponderTier(0);
      setFailureScenario('none');
    } else if (target >= 2 && target <= 4) {
      setDoctorPatientMatched(true);
      updateConsentStatus('pending');
    } else if (target === 5 || target === 6) {
      setDoctorPatientMatched(true);
      updateConsentStatus('pending');
    } else if (target >= 7 && target <= 10) {
      setDoctorPatientMatched(true);
      updateConsentStatus('allowed');
    } else if (target >= 11 && target <= 12) {
      setResponderTier(0);
      setCredentialLocation('on_patient');
      setResponderAuthenticated(false);
    } else if (target >= 13 && target <= 15) {
      setResponderTier(1);
      setCredentialLocation('on_patient');
      setResponderAuthenticated(true);
    } else if (target >= 19) {
      setFailureScenario('internet');
    }
  };

  return (
    <aside className="p-jury-bar" aria-label="Guided Jury Presentation Bar">
      <div className="p-jury-top">
        <div className="p-jury-badge">
          <span className="p-jury-tag">GUIDED JURY DEMO</span>
          <b className="p-jury-counter">
            STEP {String(currentStep.number).padStart(2, '0')} / {JURY_STEPS.length}
          </b>
        </div>

        <div className="p-jury-controls">
          <button
            className="p-jury-btn"
            onClick={() => goToStep(juryStep - 1)}
            disabled={juryStep === 1}
            title="Previous step"
          >
            ← Previous
          </button>
          <button
            className="p-jury-btn primary"
            onClick={() => goToStep(juryStep + 1)}
            disabled={juryStep === JURY_STEPS.length}
            title="Next step"
          >
            Next Step →
          </button>
          <button
            className="p-jury-btn text"
            onClick={() => setJuryStep(0)}
            title="Exit Jury Demo"
          >
            Exit Demo
          </button>
        </div>
      </div>

      <div className="p-jury-body">
        <div className="p-jury-headline">
          <span className="p-jury-role-pill">VIEWING: {currentStep.role.toUpperCase()}</span>
          <h3>{currentStep.title}</h3>
        </div>
        <p className="p-jury-desc">{currentStep.description}</p>
        <div className="p-jury-why">
          <ProtoIcon name="shield" className="p-why-icon" />
          <div>
            <b>WHY THIS MATTERS:</b>
            <span>{currentStep.whyItMatters}</span>
          </div>
        </div>
      </div>

      <div className="p-jury-track">
        <div
          className="p-jury-fill"
          style={{ width: `${(juryStep / JURY_STEPS.length) * 100}%` }}
        />
      </div>
    </aside>
  );
}
