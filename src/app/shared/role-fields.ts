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
    'Escalation Comment From MVS Officer', 
    'MVS Officer Escalated Date', 
    'Escalation Category From MVS Supervisor', 
    'Escalation Comment From MVS Supervisor', 
    'MVS Supervisor Escalated Date',
    'Application Status'
  ],
  MVS_LEGAL_OFFICER: [
    'Application ID', 
    'Service', 
    'Service Type', 
    'Created Date'
  ]
};