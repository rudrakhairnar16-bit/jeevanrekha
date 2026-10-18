'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type {
  Role,
  ConsentStatus,
  ConsentRequest,
  HealthRecord,
  EmergencyFieldSetting,
  AuditEvent,
  BreakGlassLog,
  CredentialStatus,
  CredentialLocation,
  IdentityConfidence,
} from './types';

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec-1',
    title: 'Complete Blood Count (CBC) with Differential',
    category: 'lab',
    facility: 'Lab C (Accredited Diagnostic)',
    doctor: 'Dr. Patel, Pathologist',
    date: '12 Oct 2026 · 11:20 AM',
    provenance: 'verified_lab',
    summary: 'Hemoglobin: 14.2 g/dL, Platelets: 240,000/mcL, WBC: 7,200/mcL. All indices within normal limits.',
    details: [
      'Specimen: Venous blood in K2-EDTA',
      'Verified by Lab C automated analyzer & signed by pathologist',
      'ABDM FHIR DiagnosticReport resource #LAB-C-98412'
    ],
    correctionHistory: {
      original: 'Platelets initially transcribed as 24,000/mcL due to OCR transposition.',
      correction: 'Corrected to 240,000/mcL after automated laboratory instrument cross-check.',
      author: 'Dr. Patel, Quality Lead, Lab C',
      reason: 'Digital transcript transcription verification',
      timestamp: '12 Oct 2026 · 11:45 AM'
    }
  },
  {
    id: 'rec-2',
    title: 'Amoxicillin-Clavulanate 625mg (Oral Tablets)',
    category: 'prescription',
    facility: 'Hospital A (City Multispecialty)',
    doctor: 'Dr. Joshi, General Medicine',
    date: '10 Oct 2026 · 04:15 PM',
    provenance: 'verified_hospital',
    summary: '1 tablet twice daily for 7 days after meals. Indication: Acute sinus episode. Severe penicillin allergy check: flag noted in clinical record.',
    details: [
      'Dispensed: City Care Pharmacy, counter 3',
      'Course duration: 7 days (ends 17 Oct 2026)',
      'Digital e-prescription hash: #HOSP-A-RX-7719'
    ]
  },
  {
    id: 'rec-3',
    title: 'Prior Discharge Summary — Knee Arthroscopy',
    category: 'discharge',
    facility: 'Apex Orthopedic Clinic',
    doctor: 'Dr. Rao, Orthopedic Surgeon',
    date: '02 Sep 2025',
    provenance: 'patient_uploaded',
    summary: 'Elective right knee arthroscopic partial meniscectomy. Uneventful recovery. Weight bearing as tolerated.',
    details: [
      'Document uploaded by citizen via mobile scan on 05 Sep 2025',
      'Provenance note: Original hospital signature stamped; not independently API-verified by JeevanRekha'
    ]
  },
  {
    id: 'rec-4',
    title: 'Outpatient Follow-up & Vitals Assessment',
    category: 'followup',
    facility: 'Hospital B (Community Health Centre)',
    doctor: 'Dr. Kulkarni, Medical Officer',
    date: '18 Aug 2026 · 10:00 AM',
    provenance: 'verified_hospital',
    summary: 'BP: 122/78 mmHg, HR: 72 bpm, SpO2: 99% on room air, BMI: 23.4. Routine fitness clearance.',
    details: [
      'Encounter record #HOSP-B-ENC-1033',
      'Clinical note: Patient advised routine physical activity and hydration'
    ]
  },
  {
    id: 'rec-sealed-1',
    title: 'Confidential Psychiatric Consultation & Therapy Plan',
    category: 'consultation',
    facility: 'MindCare Clinic, Vadodara',
    doctor: 'Dr. Ananya Sen, Psychiatrist',
    date: '15 Jul 2026 · 03:00 PM',
    provenance: 'verified_hospital',
    summary: 'Specially protected episode. Mild anxiety & adjustment assessment. Cognitive behavioral sessions scheduled.',
    details: [
      'Sealed compartment: Mental Health Protection Act compliant',
      'Linked prescription: Escitalopram 5mg (sealed inside same boundary)',
      'Associated clinical notes and appointment records are sealed together to prevent metadata leakage'
    ],
    sealed: true
  }
];

export const INITIAL_EMERGENCY_FIELDS: EmergencyFieldSetting[] = [
  { id: 'f-allergy', label: 'Critical Allergy: Severe Penicillin Anaphylaxis', value: 'Severe Penicillin Allergy (Anaphylaxis risk)', privacy: 'public', sensitive: false },
  { id: 'f-blood', label: 'Verified Blood Group: B positive (Rh+)', value: 'B positive (Rh+)', privacy: 'responders_only', sensitive: false },
  { id: 'f-thinner', label: 'Blood Thinner / Anticoagulant Flag', value: 'None active', privacy: 'responders_only', sensitive: false },
  { id: 'f-epilepsy', label: 'Epilepsy / Seizure Emergency Alert', value: 'No known seizure history', privacy: 'responders_only', sensitive: false },
  { id: 'f-implant', label: 'Implanted Device (Pacemaker / Stent)', value: 'None recorded', privacy: 'responders_only', sensitive: false },
  { id: 'f-comm', label: 'Emergency Communication Requirement', value: 'Preferred: Hindi / English / Gujarati', privacy: 'public', sensitive: false },
  { id: 'f-contact', label: 'Primary Emergency Contact: Sunita Mehta (Mother)', value: 'Sunita Mehta · +91 98200 •••••', privacy: 'public', sensitive: false },
  { id: 'f-history', label: 'Complete Medical File & Longitudinal Timeline', value: 'All consultations, labs, hospital notes', privacy: 'dont_show', sensitive: true },
  { id: 'f-sealed', label: 'Sealed Psychological Consultation Record', value: 'Mental health records from MindCare', privacy: 'dont_show', sensitive: true },
];

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  { id: 'aud-01', timestamp: '09:12 AM', actor: 'Lab C Automated Engine', facility: 'Lab C Diagnostic', action: 'Verified laboratory result committed (CBC)', purpose: 'Clinical result publishing', category: 'Routine', commitmentHash: '0x8f2a...91b4' },
  { id: 'aud-02', timestamp: '10:03 AM', actor: 'Dr. Sharma (Clinician ID #HPR-9921)', facility: 'XYZ Hospital', action: 'Patient identity matched (Rahul Mehta, •••• 4821)', purpose: 'Outpatient consultation setup', category: 'Routine', commitmentHash: '0x3c11...48ae' },
];

interface PrototypeContextType {
  role: Role;
  setRole: (r: Role) => void;
  consent: ConsentRequest;
  updateConsentStatus: (s: ConsentStatus) => void;
  createDoctorRequest: (categories: ('labs' | 'prescriptions' | 'consultations' | 'diagnostics')[], purpose: string, duration: number) => void;
  doctorPatientMatched: boolean;
  setDoctorPatientMatched: (matched: boolean) => void;
  healthRecords: HealthRecord[];
  emergencyFields: EmergencyFieldSetting[];
  updateEmergencyFieldPrivacy: (id: string, privacy: 'public' | 'responders_only' | 'dont_show') => void;
  credentials: { phone: CredentialStatus; card: CredentialStatus; wearable: CredentialStatus };
  setCredentialStatus: (type: 'phone' | 'card' | 'wearable', status: CredentialStatus) => void;
  // Emergency Responder
  responderTier: 0 | 1 | 2;
  setResponderTier: (t: 0 | 1 | 2) => void;
  credentialLocation: CredentialLocation;
  setCredentialLocation: (loc: CredentialLocation) => void;
  identityConfidence: IdentityConfidence;
  responderAuthenticated: boolean;
  setResponderAuthenticated: (v: boolean) => void;
  networkOffline: boolean;
  setNetworkOffline: (v: boolean) => void;
  breakGlassActive: boolean;
  breakGlassLog: BreakGlassLog | null;
  triggerBreakGlass: (reason: string, scope: string[]) => void;
  // Family
  familyCapabilities: {
    reminders: boolean;
    appointments: boolean;
    emergencyAlerts: boolean;
    selectedClinical: boolean;
  };
  toggleFamilyCapability: (cap: 'reminders' | 'appointments' | 'emergencyAlerts' | 'selectedClinical') => void;
  familyRequestPending: boolean;
  setFamilyRequestPending: (v: boolean) => void;
  // Public Health
  districtCoverage: number;
  setDistrictCoverage: (c: number) => void;
  // Security
  auditEvents: AuditEvent[];
  tamperSimulation: boolean;
  setTamperSimulation: (v: boolean) => void;
  // Failure Lab
  failureScenario: 'none' | 'internet' | 'jeevanrekha' | 'provider' | 'phone_damaged' | 'no_credential';
  setFailureScenario: (f: 'none' | 'internet' | 'jeevanrekha' | 'provider' | 'phone_damaged' | 'no_credential') => void;
  // Jury Demo
  juryStep: number;
  setJuryStep: (step: number) => void;
  resetAll: () => void;
}

const PrototypeContext = createContext<PrototypeContextType | undefined>(undefined);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('hub');
  const [doctorPatientMatched, setDoctorPatientMatched] = useState(false);
  const [consent, setConsent] = useState<ConsentRequest>({
    id: 'req-sharma-01',
    doctorName: 'Dr. Sharma',
    facility: 'XYZ Hospital, Outpatient Dept',
    purpose: 'Current clinical treatment for respiratory discomfort',
    durationMinutes: 120,
    requestedCategories: ['labs', 'prescriptions'],
    status: 'pending',
  });

  const [healthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [emergencyFields, setEmergencyFields] = useState<EmergencyFieldSetting[]>(INITIAL_EMERGENCY_FIELDS);
  const [credentials, setCredentials] = useState<{ phone: CredentialStatus; card: CredentialStatus; wearable: CredentialStatus }>({
    phone: 'active',
    card: 'active',
    wearable: 'active',
  });

  // Emergency Responder
  const [responderTier, setResponderTier] = useState<0 | 1 | 2>(0);
  const [credentialLocation, setCredentialLocationState] = useState<CredentialLocation>('near_patient');
  const [identityConfidence, setIdentityConfidence] = useState<IdentityConfidence>('unverified');
  const [responderAuthenticated, setResponderAuthenticated] = useState(false);
  const [networkOffline, setNetworkOffline] = useState(false);
  const [breakGlassActive, setBreakGlassActive] = useState(false);
  const [breakGlassLog, setBreakGlassLog] = useState<BreakGlassLog | null>(null);

  const setCredentialLocation = useCallback((loc: CredentialLocation) => {
    setCredentialLocationState(loc);
    if (loc === 'near_patient') {
      setIdentityConfidence('unverified');
    } else {
      setIdentityConfidence('confirmed');
    }
  }, []);

  // Family
  const [familyCapabilities, setFamilyCapabilities] = useState({
    reminders: true,
    appointments: true,
    emergencyAlerts: true,
    selectedClinical: false,
  });
  const [familyRequestPending, setFamilyRequestPending] = useState(false);

  // Public Health
  const [districtCoverage, setDistrictCoverage] = useState(81);

  // Security & Audit
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_LOG);
  const [tamperSimulation, setTamperSimulation] = useState(false);

  // Failure
  const [failureScenario, setFailureScenario] = useState<'none' | 'internet' | 'jeevanrekha' | 'provider' | 'phone_damaged' | 'no_credential'>('none');

  // Jury
  const [juryStep, setJuryStep] = useState(0);

  const addAudit = useCallback((action: string, actor: string, facility: string, purpose: string, category: 'Access' | 'Emergency' | 'Security' | 'Consent' | 'Routine') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randHex = Math.random().toString(16).substring(2, 6);
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeStr,
      actor,
      facility,
      action,
      purpose,
      category,
      commitmentHash: `0x${randHex}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  }, []);

  const updateConsentStatus = useCallback((s: ConsentStatus) => {
    setConsent(prev => ({
      ...prev,
      status: s,
      grantedAt: s === 'allowed' ? '10:08 AM' : undefined,
      expiresAt: s === 'allowed' ? '12:08 PM' : undefined,
    }));
    if (s === 'allowed') {
      addAudit('Consent granted: Labs + Prescriptions authorized for 2 hours', 'Rahul Mehta (Citizen)', 'XYZ Hospital', 'Treatment encounter', 'Consent');
    } else if (s === 'denied') {
      addAudit('Consent denied by citizen: Access request rejected', 'Rahul Mehta (Citizen)', 'XYZ Hospital', 'Patient preference', 'Consent');
    } else if (s === 'revoked') {
      addAudit('Consent revoked by citizen before expiration', 'Rahul Mehta (Citizen)', 'XYZ Hospital', 'Citizen revocation', 'Consent');
    } else if (s === 'expired') {
      addAudit('Consent window automatically expired (2h TTL elapsed)', 'JeevanRekha Trust Engine', 'XYZ Hospital', 'Time-to-live enforcement', 'Consent');
    }
  }, [addAudit]);

  const createDoctorRequest = useCallback((categories: ('labs' | 'prescriptions' | 'consultations' | 'diagnostics')[], purpose: string, duration: number) => {
    setConsent({
      id: `req-${Date.now()}`,
      doctorName: 'Dr. Sharma',
      facility: 'XYZ Hospital',
      purpose,
      durationMinutes: duration,
      requestedCategories: categories,
      status: 'pending',
    });
    addAudit(`Access request created for: ${categories.join(', ')}`, 'Dr. Sharma (Clinician #HPR-9921)', 'XYZ Hospital', purpose, 'Access');
  }, [addAudit]);

  const updateEmergencyFieldPrivacy = useCallback((id: string, privacy: 'public' | 'responders_only' | 'dont_show') => {
    setEmergencyFields(prev => prev.map(f => f.id === id ? { ...f, privacy } : f));
    addAudit(`Emergency field disclosure preference updated: ${id} -> ${privacy}`, 'Rahul Mehta (Citizen)', 'Citizen Application', 'Emergency Card Config', 'Security');
  }, [addAudit]);

  const setCredentialStatus = useCallback((type: 'phone' | 'card' | 'wearable', status: CredentialStatus) => {
    setCredentials(prev => ({ ...prev, [type]: status }));
    const label = type === 'card' ? 'Physical Emergency Card' : type === 'phone' ? 'Mobile App Credential' : 'Wearable Band';
    addAudit(`${label} status updated to: ${status.toUpperCase()}`, 'Rahul Mehta (Citizen)', 'Citizen Device Manager', 'Credential Lifecycle', 'Security');
  }, [addAudit]);

  const triggerBreakGlass = useCallback((reason: string, scope: string[]) => {
    setBreakGlassActive(true);
    setResponderTier(2);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log: BreakGlassLog = {
      id: `bg-${Date.now()}`,
      clinician: 'Dr. Varma, Emergency Physician (#HPR-7812)',
      facility: 'Apex Trauma Centre / XYZ Hospital',
      patient: 'Rahul Mehta (Unconscious)',
      reason,
      scope,
      timestamp: timeStr,
      duration: '45 minutes (Strict emergency TTL)',
    };
    setBreakGlassLog(log);
    addAudit(`TIER 2 BREAK-GLASS INVOKED: ${reason} (Scope: ${scope.join(', ')})`, 'Dr. Varma (Emergency #HPR-7812)', 'Apex Trauma Centre', reason, 'Emergency');
  }, [addAudit]);

  const toggleFamilyCapability = useCallback((cap: 'reminders' | 'appointments' | 'emergencyAlerts' | 'selectedClinical') => {
    setFamilyCapabilities(prev => {
      const next = !prev[cap];
      addAudit(`Family permission ${cap} changed to: ${next ? 'ALLOWED' : 'REVOKED'}`, 'Rahul Mehta (Citizen)', 'Citizen Family Center', 'Caregiver Permissions', 'Security');
      return { ...prev, [cap]: next };
    });
  }, [addAudit]);

  const resetAll = useCallback(() => {
    setRole('hub');
    setDoctorPatientMatched(false);
    setConsent({
      id: 'req-sharma-01',
      doctorName: 'Dr. Sharma',
      facility: 'XYZ Hospital, Outpatient Dept',
      purpose: 'Current clinical treatment for respiratory discomfort',
      durationMinutes: 120,
      requestedCategories: ['labs', 'prescriptions'],
      status: 'pending',
    });
    setEmergencyFields(INITIAL_EMERGENCY_FIELDS);
    setCredentials({ phone: 'active', card: 'active', wearable: 'active' });
    setResponderTier(0);
    setCredentialLocationState('near_patient');
    setIdentityConfidence('unverified');
    setResponderAuthenticated(false);
    setNetworkOffline(false);
    setBreakGlassActive(false);
    setBreakGlassLog(null);
    setFamilyCapabilities({ reminders: true, appointments: true, emergencyAlerts: true, selectedClinical: false });
    setFamilyRequestPending(false);
    setDistrictCoverage(81);
    setAuditEvents(INITIAL_AUDIT_LOG);
    setTamperSimulation(false);
    setFailureScenario('none');
    setJuryStep(0);
  }, []);

  const value = useMemo(() => ({
    role,
    setRole,
    consent,
    updateConsentStatus,
    createDoctorRequest,
    doctorPatientMatched,
    setDoctorPatientMatched,
    healthRecords,
    emergencyFields,
    updateEmergencyFieldPrivacy,
    credentials,
    setCredentialStatus,
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
    familyCapabilities,
    toggleFamilyCapability,
    familyRequestPending,
    setFamilyRequestPending,
    districtCoverage,
    setDistrictCoverage,
    auditEvents,
    tamperSimulation,
    setTamperSimulation,
    failureScenario,
    setFailureScenario,
    juryStep,
    setJuryStep,
    resetAll,
  }), [
    role, consent, updateConsentStatus, createDoctorRequest, doctorPatientMatched,
    healthRecords, emergencyFields, updateEmergencyFieldPrivacy, credentials,
    setCredentialStatus, responderTier, credentialLocation, setCredentialLocation,
    identityConfidence, responderAuthenticated, networkOffline, breakGlassActive,
    breakGlassLog, triggerBreakGlass, familyCapabilities, toggleFamilyCapability,
    familyRequestPending, districtCoverage, auditEvents, tamperSimulation,
    failureScenario, juryStep, resetAll
  ]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error('usePrototype must be used within PrototypeProvider');
  return ctx;
}
