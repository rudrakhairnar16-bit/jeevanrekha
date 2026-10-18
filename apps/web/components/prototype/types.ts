export type Role =
  | 'hub'
  | 'citizen'
  | 'doctor'
  | 'responder'
  | 'family'
  | 'public-health'
  | 'security'
  | 'architecture'
  | 'emergency-lab'
  | 'aggregation-lab'
  | 'failure-lab';

export type ConsentStatus = 'pending' | 'allowed' | 'denied' | 'revoked' | 'expired';

export type CredentialStatus = 'active' | 'revoked';

export type IdentityConfidence = 'unverified' | 'confirmed';

export type CredentialLocation = 'on_patient' | 'near_patient';

export type ProvenanceType =
  | 'verified_hospital'
  | 'verified_lab'
  | 'patient_uploaded'
  | 'patient_reported';

export interface HealthRecord {
  id: string;
  title: string;
  category: 'lab' | 'prescription' | 'diagnostic' | 'consultation' | 'discharge' | 'followup';
  facility: string;
  doctor?: string;
  date: string;
  provenance: ProvenanceType;
  summary: string;
  details: string[];
  sealed?: boolean;
  correctionHistory?: {
    original: string;
    correction: string;
    author: string;
    reason: string;
    timestamp: string;
  };
}

export interface ConsentRequest {
  id: string;
  doctorName: string;
  facility: string;
  purpose: string;
  durationMinutes: number;
  requestedCategories: ('labs' | 'prescriptions' | 'consultations' | 'diagnostics')[];
  status: ConsentStatus;
  grantedAt?: string;
  expiresAt?: string;
}

export interface EmergencyFieldSetting {
  id: string;
  label: string;
  value: string;
  privacy: 'public' | 'responders_only' | 'dont_show';
  sensitive?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  facility: string;
  action: string;
  purpose: string;
  category: 'Access' | 'Emergency' | 'Security' | 'Consent' | 'Routine';
  commitmentHash: string;
  tampered?: boolean;
}

export interface BreakGlassLog {
  id: string;
  clinician: string;
  facility: string;
  patient: string;
  reason: string;
  scope: string[];
  timestamp: string;
  duration: string;
}

export interface JuryStep {
  number: number;
  title: string;
  role: Role;
  description: string;
  whyItMatters: string;
}
