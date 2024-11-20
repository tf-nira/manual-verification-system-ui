export const ROLE_FIELDS_MAP: { [key: string]: string[] } = {
  MVS_OFFICER: [
    'Application ID', 
    'Service', 
    'Service Type', 
    'Created Date'
  ],
  MVS_SUPERVISOR: [
    'Application ID', 
    'Service', 
    'Service Type', 
    'Created Date', 
    'Escalation Category', 
    'Escalation Comment', 
    'Escalated Date'
  ],
  MVS_DISTRICT_OFFICER: [
    'Application ID', 
    'Service', 
    'Service Type', 
    'Created Date', 
    'Escalation Category from MVS Officer', 
    'Escalation Comment from MVS Officer', 
    'MVS Officer Escalated Date', 
    'Escalation Category from MVS Supervisor', 
    'Escalation Comment from MVS Supervisor', 
    'MVS Supervisor Escalated Date'
  ],
  MVS_LEGAL_OFFICER: [
    'Application ID', 
    'Service', 
    'Service Type', 
    'Created Date'
  ]
};