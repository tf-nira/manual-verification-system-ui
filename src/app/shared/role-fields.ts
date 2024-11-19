export const ROLE_FIELDS_MAP: { [key: string]: string[] } = {
  MVS_OFFICER: ['Application ID', 'Service', 'Service Type', 'Created Date'],
  MVS_SUPERVISOR: ['Application ID', 'Service', 'Service Type', 'Created Date', 'Escalation Reason From MVS Officer'],
  MVS_DISTRICT_OFFICER: ['Application ID', 'Service', 'Service Type', 'Created Date', 'Escalation Reason From MVS Officer', 'Escalation Reason From MVS Supervisor'],
  MVS_LEGAL_OFFICER: ['Application ID', 'Service', 'Service Type', 'Created Date']
};