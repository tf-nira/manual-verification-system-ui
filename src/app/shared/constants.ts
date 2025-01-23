// ui-labels
export const NAME: string = 'Name';
export const ROLE: string = 'Role';
export const LOGOUT: string = 'Logout';
export const SEARCH: string = 'Apply';
export const FROM_DATE: string = 'From Date:';
export const TO_DATE: string = 'To Date:';
export const CLEAR_FILTERS: string = 'Clear Filters';
export const CATEGORY: string = 'Category';
export const COMMENT: string = 'Comment';
export const ESCALATION_DATE: string = 'Escalation Date';
export const ESCALATION_REASON_FROM_MVS_OFFICER: string = 'Escalation Reason From MVS Officer';
export const ESCALATION_REASON_FROM_MVS_SUPERVISOR: string = 'Escalation Reason From MVS Supervisor';
export const DEMOGRAPHIC_DETAILS: string = 'Demographic Details';
export const DOCUMENTS_UPLOADED: string = 'Documents Uploaded';
export const AUTO_RETRIEVE_NIN_DETAILS: string = 'Auto-Retrieve NIN Details';
export const BACK: string = 'Back';
export const APPROVE: string = 'Approve';
export const REJECT: string = 'Reject';
export const ESCALATE: string = 'Escalate';
export const SCHEDULE_INTERVIEW: string = 'Schedule Interview';
export const UPLOAD_DCOUMENTS: string = 'Upload Documents';
export const APPLICANT_NAME: string = 'Applicant Name';

// roles
export const MVS_OFFICER: string = 'MVS_OFFICER';
export const MVS_SUPERVISOR: string = 'MVS_SUPERVISOR';
export const MVS_DISTRICT_OFFICER: string = 'MVS_DISTRICT_OFFICER';
export const MVS_LEGAL_OFFICER: string = 'MVS_LEGAL_OFFICER';

// table fields
export const APPLICATION_ID: string = 'Application ID';
export const SERVICE: string = 'Service';
export const SERVICE_TYPE: string = 'Service Type';
export const CREATED_DATE: string = 'Created Date';
export const ESCALATION_CATEGORY: string = 'Escalation Category';
export const ESCALATION_COMMENT: string = 'Escalation Comment';
export const ESCALATED_DATE: string = 'Escalated Date';
export const ESCALATION_CATEGORY_FROM_MVS_OFFICER: string = 'Escalation Category from MVS Officer';
export const ESCALATION_COMMENT_FROM_MVS_OFFICER: string = 'Escalation Comment From MVS Officer';
export const MVS_OFFICER_ESCALATED_DATE: string = 'MVS Officer Escalated Date';
export const ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR: string = 'Escalation Category From MVS Supervisor';
export const ESCALATION_COMMENT_FROM_MVS_SUPERVISOR: string = 'Escalation Comment From MVS Supervisor';
export const MVS_SUPERVISOR_ESCALATED_DATE: string = 'MVS Supervisor Escalated Date';
export const APPLICATION_STATUS: string = 'Application Status';

//api-utils
export const API_CONST_APPLICATION_ID: string = 'applicationId';
export const API_CONST_REG_ID = 'regId';
export const API_CONST_SERVICE: string = 'service';
export const API_CONST_SERVICE_TYPE: string = 'serviceType';
export const API_CONST_CREATED_DATE: string = 'crDTimes';
export const API_CONST_CATEGORY = 'category';
export const API_CONST_COMMENT = 'comment';
export const API_CONST_ESCALATION_DATE = 'escDTimes';
export const API_CONST_ASSIGNED_OFFICER_ID = 'assignedOfficerId';
export const API_CONST_USER_ID = 'userId';
export const API_CONST_EQUALS = 'equals';
export const API_CONST_CONTAINS = 'contains';
export const API_CONST_BETWEEN = 'between';
export const API_CONST_STATUS = 'status';
export const API_CONST_STAGE = 'stage';
export const API_CONST_PENDING = 'Pending';
export const API_CONST_INTERVIEW_SCHEDULED = 'INTERVIEW SCHEDULED';
export const API_CONST_ASSIGNED_TO_DISTRICT_OFFICER = 'ASSIGNED TO DISTRICT OFFICER';
export const API_CONST_ASSIGNED_TO_LEGAL_OFFICER = 'ASSIGNED TO LEGAL OFFICER';
export const API_CONST_FROM_DATE = 'fromDate';
export const API_CONST_TO_DATE = 'toDate';
export const API_CONST_DESC = 'desc';
export const API_CONST_ASC = 'asc';
export const API_CONST_SUCCESS = 'success';
export const API_CONST_APPROVE = 'APPROVE';
export const API_CONST_ESCALATE = 'ESCALATE';
export const API_CONST_REJECT = 'REJECT';

// Map document keys to readable titles
export const CATEGORY_MAP: { [key: string]: string } = {
    proofOfPhysicalApplicationForm: 'Proof of Physical Application Form',
    proofOfAbandonment: 'Proof of Abandonment',
    proofOfException: 'Proof of Exception',
    // proofOfPayment: 'Proof of Payment',
    proofOfRelationship: 'Proof of Relationship',
    proofOfCitizenship: 'Proof of Citizenship',
    // proofOfLegalDOcuments: 'Proof of Legal Documents',
    proofOfIdentity: 'Proof of Identity',
    proofOfAddress: 'Proof of Address',
    // proofOfReplacement: 'Proof of Replacement',
    proofOfBirth: 'Proof of Birth',
    proofOfOtherSupportingdocumentIssuedbyGovt: 'Proof of Other Supporting Document',
    proofOfOtherSupportingdocuments: 'Proof of Other Supporting Documents',
    proofOfRegistration: 'Proof of Registration',
    proofOfAdoption: 'Proof of Adoption',
    // proofOfChangeOfParticulars: 'Proof of Change of Particulars',
    // proofOfDeclarant: 'Proof of Declarant',
    // proofOfLegalDeepPoll: 'Proof of Legal Deed Poll',
    // proofOfLegalGazzette: 'Proof of Legal Gazette',
    proofOfLegalStatutoryDeclaration: 'Proof of Statutory Declaration',
    proofOfModificationConsent: 'Proof of Modification Consent',
    // proofOfIntroducerSignature: 'Proof of Introducer Signature',
    // proofOfCourtOrder: 'Proof Of Court Order'
  };

  export const TITLE_MAP: { [key: string]: string[] } = {
    proofOfPhysicalApplicationForm: ['Physical Application Form'],
    proofOfAbandonment: ['Police Report'],
    proofOfException: ['Expetion Photo'],
    proofOfPayment: ['Payment Slip'],
    proofOfRelationship: ['LC 1 Recommendation Letter', 'Immunization Card', 'Mother National ID Card', 'Father National ID Card', 'Guardian introduction letter', 'Guardian National ID Card'],
    proofOfCitizenship: ['LC 1 Recommendation Letter', 'Notification Of Birth Record', 'Passport Document', 'Mother National ID Card', 'Certificate of Dual Citizenship', 'Father National ID Card', 'Relative National ID Card', 'Guardian National ID Card', 'Birth Certificate', 'Tax Document', 'Previous Immigration records', 'National Id', 'Previous passports of self, parents, or grandparents', 'Copies of birth certificates of self parents or grandparents', 'Naturalisation Certificate of self parents', 'Certificate of Citizenship by Naturalization', 'Certificate of Citizenship by Registration'],
    proofOfLegalDOcuments: [],
    proofOfIdentity: ['Mother National ID Card', 'Father National ID Card', 'Passport Document', 'Relative National ID Card', 'Guardian National ID Card', 'Photo identification cards issued by the Government', 'Medical card issued by the State Govt', 'Voter Identification card', 'Driving licence of the applicant', 'Expired Card'
      ],
    proofOfAddress: ['Birth Document', 'Passport Document', 'LC 1 Recommendation Letter', 'Mother National ID Card', 'Certificate of Relationship', 'Guardian introduction letter', 'Birth Certificate', 'Certificate of Citizenship by Naturalization', 'Address Of Residence Diaspora', 'Guardian National ID Card'],
    proofOfReplacement: ['Police Letter', 'Damaged Card', 'CID Report'],
    proofOfBirth: ['Immunization Card', 'Notification Of Birth Record', 'Birth Certificate'],
    proofOfOtherSupportingdocumentIssuedbyGovt: ['Court Report', 'Welfare and Family', 'Passport Document', 'Voter Card', 'Driving Permit', 'Care Order', 'Probation report', 'Birth Certificate', 'Academic Documents', 'Marriage certificate or Divorce Decree', 'Certified copy of DNA test results', 'Court Order', 'Parent National ID'],
    proofOfOtherSupportingdocuments: ['Previous Immigration records', 'Baptism Card', 'Any other relevant Documents', 'Certificate of Marriage'],
    applicantProofOfSignature: [],
    introducerProofOfSignature: [],
    proofOfRegistration: [],
    proofOfAdoption: ['Police Report'],
    proofOfChangeOfParticulars: [],
    proofOfDeclarant: ['Declarant National ID Card'],
    proofOfLegalDeepPoll: ['Deed Poll'],
    proofOfLegalGazzette: ['Gazzette'],
    proofOfLegalStatutoryDeclaration: [],
    proofOfModificationConsent: ['Modification Consent Form'],
    proofOfIntroducerSignature: ['Introducer Signature'],
    proofOfCourtOrder: ['Court Order']
  };

  export const NEW_REJECTION_CATEGORIES = [
    { value: 'Rejected due to evidence of non citizenship',  default: false},
    { value: 'Insufficient supporting documents to determine citizenship',  default: false},
    { value: 'Documents provided have inconsistent information',  default: false},
    { value: 'Documents not in required format ',  default: false},
    { value: 'Unsatisfactory CV Interview at Point of Registration ',  default: false},
    { value: 'Second register/application exists (May or may not have a NIN, stop listed)',  default: false},
    { value: 'Poorly scanned documents to enable decision',  default: false},
    { value: 'Fraudulent/Altered /doctored documents ',  default: false},
    { value: 'Other',  default: false}
  ];

  export const COP_REJECTION_CATEGORIES = [
    { value: 'Documents provided have inconsistent information', default: false },
    { value: 'Insufficient supporting documents', default: false },
    { value: 'Documents not in required format (i.e SD exists but not registered)', default: false },
    { value: 'Poorly scanned documents to enable decision', default: false },
    { value: 'Fraudulent/Altered /doctored documents ', default: false },
    { value: 'No payment receipt attached', default: false },
    { value: 'Payments used on previous unrelated application', default: false },
    { value: 'Payment lower than statutory fees', default: false },
    { value: 'Evidence of multiple changes in short period of time(Time should be specified)', default: false },
    { value: 'An existing record is stop listed', default: false },
    { value: 'Other',  default: false}
  ];

  export const FILTERED_SERVICE_TYPES: { value: string; label: string }[] = [
    { value: 'By Birth /Descent', label: 'Registration of citizens by birth' },
    { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
    { value: 'By Naturalisation', label: 'Registration of Citizens by Naturalisation' },
    { value: 'By Registration', label: 'Registration of Citizens by Registration' },
    { value: 'Dual Citizenship', label: 'Registration of Dual Citizens' },
    { value: 'By Birth /Descent', label: 'Registration of Child Citizens by birth' },
    { value: 'By Birth /Descent', label: 'Registration of Foundlings' },
    { value: 'Renewal', label: 'Renewal of a card' },
    { value: 'Replacement', label: 'Replacement of a card' },
    { value: 'Add Name', label: 'Adding a Name' },
    { value: 'Remove Name', label: 'Removing a name' },
    { value: 'Change Order of Names', label: 'Change of Order of Names' },
    { value: 'Complete Name Change', label: 'Complete Change of Name' },
    { value: 'Change DOB', label: 'Change of Data of Birth' },
    { value: 'Change DOB > 4 years', label: 'Change of Date of Birth > 4 years' },
    { value: 'Change Residence Adult', label: 'Change in place of Residence of Adult' },
    { value: 'Change Residence Child', label: 'Change in Place of Residence of Child' },
    { value: 'Change Birth Place Adult', label: 'Change in place of Birth of Adult' },
    { value: 'Change Birth Place Child', label: 'Change in Place of Birth of Child' },
    { value: 'Correct Origin Adult', label: 'Correction in place of Origin of Adult' },
    { value: 'Correct Origin Child', label: 'Correction in Place of Origin of Child' },
    { value: 'Change Citizenship Type', label: 'Change in citizenship type' },
    { value: 'Change Polling Station', label: 'Change in polling station' },
    { value: 'Add Spouse', label: 'Add a spouse' },
    { value: 'Remove Spouse', label: 'Remove a spouse' },
    { value: 'Change Father Details', label: 'Change the details of the father' },
    { value: 'Change Mother Details', label: 'Change the details of the mother' },
    { value: 'Correct NIN Error', label: 'Correction of error regarding NIN' }
  ]; // Holds the filtered service types

  export const SERVICES_WITH_TYPES = [
    {
      value: 'NEW',
      label: 'New registrations',
      serviceTypes: [
        { value: 'By Birth /Descent', label: 'Registration of citizens by birth' },
        { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
        { value: 'By Naturalisation', label: 'Registration of Citizens by Naturalisation' },
        { value: 'By Registration', label: 'Registration of Citizens by Registration' },
        { value: 'Dual Citizenship', label: 'Registration of Dual Citizens' }
      ]
    },
    {
      value: 'RENEWAL',
      label: 'Renewal of card',
      serviceTypes: [
        { value: 'Renewal', label: 'Renewal of a card' },
        { value: 'Replacement', label: 'Replacement of a card' }
      ]
    },
    {
      value: 'LOST',
      label: 'Lost/ Replacement of card',
      serviceTypes: [
        { value: 'Renewal', label: 'Renewal of a card' },
        { value: 'Replacement', label: 'Replacement of a card' }
      ]
    },
    {
      value: 'UPDATE',
      label: 'Change of Particulars',
      serviceTypes: [
        { value: 'Add Name', label: 'Adding a Name' },
        { value: 'Remove Name', label: 'Removing a name' },
        { value: 'Change Order of Names', label: 'Change of Order of Names' },
        { value: 'Complete Name Change', label: 'Complete Change of Name' },
        { value: 'Change DOB', label: 'Change of Data of Birth' },
        { value: 'Change DOB > 4 years', label: 'Change of Date of Birth > 4 years' },
        { value: 'Change Residence Adult', label: 'Change in place of Residence of Adult' },
        { value: 'Change Residence Child', label: 'Change in Place of Residence of Child' },
        { value: 'Change Birth Place Adult', label: 'Change in place of Birth of Adult' },
        { value: 'Change Birth Place Child', label: 'Change in Place of Birth of Child' },
        { value: 'Correct Origin Adult', label: 'Correction in place of Origin of Adult' },
        { value: 'Correct Origin Child', label: 'Correction in Place of Origin of Child' },
        { value: 'Change Citizenship Type', label: 'Change in citizenship type' },
        { value: 'Change Polling Station', label: 'Change in polling station' },
        { value: 'Add Spouse', label: 'Add a spouse' },
        { value: 'Remove Spouse', label: 'Remove a spouse' },
        { value: 'Change Father Details', label: 'Change the details of the father' },
        { value: 'Change Mother Details', label: 'Change the details of the mother' },
        { value: 'Correct NIN Error', label: 'Correction of error regarding NIN' }
      ]
    },
    {
      value: 'FIRSTID',
      label: 'GetFirst ID',
      serviceTypes: [
        { value: 'GetFirst ID', label: 'GetFirst ID' }
      ]
    },
  ];