export const ROLE_DATA_MAP: { [key: string]: any[] } = {
  MVS_OFFICER: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03' },
  ],
  MVS_SUPERVISOR: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01', 'Escalation Reason From MVS Officer': 'Reason 1' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02', 'Escalation Reason From MVS Officer': 'Reason 2' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03', 'Escalation Reason From MVS Officer': 'Reason 3' },
  ],
  MVS_DISTRICT_OFFICER: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01', 'Escalation Reason From MVS Officer': 'Reason 1', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 1' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02', 'Escalation Reason From MVS Officer': 'Reason 2', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 2' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03', 'Escalation Reason From MVS Officer': 'Reason 3', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 3' },
  ],
  MVS_LEGAL_OFFICER: [
    { 'Application ID': 100, Service: 'Service 11', 'Service Type': 'Type Ab', 'Created Date': '2024-10-01' },
    { 'Application ID': 101, Service: 'Service 12', 'Service Type': 'Type Bc', 'Created Date': '2024-10-02' },
    { 'Application ID': 102, Service: 'Service 13', 'Service Type': 'Type Cd', 'Created Date': '2024-10-03' },
  ]
};