export const VERSION = '1.0';
export const fetchDocument = {
    version: "v1",
    id: "mosip.registration.packet.reader",
    source: "REGISTRATION_CLIENT",
    process: "MVS_DOC"
}
export const IDS = {
    login: 'mosip.mvs.user.login',
    applicationList: 'mosip.mvs.user.application.list',
    scheduleInterview: 'mosip.mvs.user.schedule.interview'

};
export const APPEND_URL = {
    auth: '/auth/login',
    application_list: '/applications/user/',
    applications: '/applications/',
    status: '/status',
    search: 'search',
    schedule_interview: '/schedule/interview',
    upload_document: '/upload/documents',
    fetch_documents:'fetch/document',
    get_config: 'get-config',
    save_modified: '/modify_demographics'
}