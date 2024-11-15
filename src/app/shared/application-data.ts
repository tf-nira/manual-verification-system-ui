export const ROLE_DATA_MAP: { [key: string]: any[] } = {
  o1: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03' },
  ],
  o2: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01', 'Escalation Reason From MVS Officer': 'Reason 1' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02', 'Escalation Reason From MVS Officer': 'Reason 2' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03', 'Escalation Reason From MVS Officer': 'Reason 3' },
  ],
  o3: [
    { 'Application ID': 1, Service: 'Service 1', 'Service Type': 'Type A', 'Created Date': '2024-10-01', 'Escalation Reason From MVS Officer': 'Reason 1', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 1' },
    { 'Application ID': 2, Service: 'Service 2', 'Service Type': 'Type B', 'Created Date': '2024-10-02', 'Escalation Reason From MVS Officer': 'Reason 2', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 2' },
    { 'Application ID': 3, Service: 'Service 3', 'Service Type': 'Type C', 'Created Date': '2024-10-03', 'Escalation Reason From MVS Officer': 'Reason 3', 'Escalation Reason From MVS Supervisor': 'Supervisor Reason 3' },
  ],
};