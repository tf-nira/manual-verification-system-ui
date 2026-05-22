// ui-labels
export const NAME: string = 'Name';
export const ROLE: string = 'Role';
export const LOGOUT: string = 'Logout';
export const SEARCH: string = 'Apply';
export const FROM_DATE: string = 'From Date:';
export const TO_DATE: string = 'To Date:';
export const DATE_OF_BIRTH: string = 'Date Of Birth'
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
export const BY_BIRTH_SERVICE_TYPE = 'Registration of citizens by birth'
export const Modify_DETAILS: string = 'Modify Details'
// roles
export const MVS_OFFICER: string = 'MVS_OFFICER';
export const MVS_SUPERVISOR: string = 'MVS_SUPERVISOR';
export const MVS_DISTRICT_OFFICER: string = 'MVS_DISTRICT_OFFICER';
export const MVS_LEGAL_OFFICER: string = 'MVS_LEGAL_OFFICER';
export const MVS_INTERNATIONAL_OFFICER: string = 'MVS_INTERNATIONAL_OFFICER';
export const MVS_EXECUTIVE_DIRECTOR: string ='MVS_EXECUTIVE_DIRECTOR';
export const MVS_SENIOR_REGISTRATION_OFFICER: string ='MVS_SENIOR_REGISTRATION_OFFICER';
export const MVS_MANAGER: string ='MVS_MANAGER';

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
export const SURNAME: string = 'Surname';
export const GIVEN_NAME: string = 'Given Name';
export const DOB: string = 'Date of Birth';
export const RESIDENCE_DISTRICT: string = 'Residence District';
export const ENROLMENT_DISTRICT: string = 'Enrolment District';

//api-utils
export const API_CONST_APPLICATION_ID: string = 'applicationId';
export const API_CONST_REG_ID = 'regId';
export const API_CONST_SERVICE: string = 'service';
export const API_CONST_SERVICE_TYPE: string = 'serviceType';
export const API_CONST_AGE_GROUP: string = 'ageGroup';
export const API_CONST_FOUNDLINK: string = 'foundLink';
export const API_CONST_CREATED_DATE: string = 'crDTimes';
export const API_CONST_CATEGORY = 'category';
export const API_CONST_COMMENT = 'comment';
export const API_CONST_ESCALATION_DATE = 'escDTimes';
export const API_CONST_ASSIGNED_OFFICER_ID = 'assignedOfficerId';
export const API_CONST_USER_ID = 'userId';
export const API_CONST_SURNAME = 'surname';
export const API_CONST_GIVEN_NAME = 'givenName';
export const API_CONST_DATE_OF_BIRTH = 'dateOfBirth';
export const API_CONST_RESIDENCE_DISTRICT = 'resDistrict';
export const API_CONST_ENROLMENT_DISTRICT = 'applicantPlaceOfEnrolmentDistrict'
export const API_CONST_EQUALS = 'equals';
export const API_CONST_IN = 'in';
export const API_CONST_CONTAINS = 'contains';
export const API_CONST_BETWEEN = 'between';
export const API_CONST_REJECTED = 'REJECTED';
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
export const API_CONST_RECOMMEND_FOR_APPROVAL ='RECOMMEND_FOR_APPROVAL'
export const API_CONST_MODIFY = 'modify_demographics'
//max indiviadual file size that can be uploaded 2mb
export const MAX_DOC_SIZE = 2 * 1024 * 1024;
export const SERVICE_CONST_MIGRATION = 'Migration';
export const SERVICE_CONST_NEW_REGISTRATION = 'New Registration';
export const SERVICE_CONST_RENEWAL = 'Renewal';

export const CHANGE_OF_PARTICULARS = 'Change of Particulars';
export const SERVICE_CONST_DEACTIVATED = 'Deactivated';
export const SERVICE_TYPE_ALIEN_DEACTIVATED = 'Alien Deactivated';
// Map document keys to readable titles
export const CATEGORY_MAP: { [key: string]: string } = {
  proofOfPhysicalApplicationForm: 'Physical Application Form',
  proofOfAbandonment: 'Proof of Abandonment',
  proofOfException: 'Exception Proof',
  proofOfPayment: 'Payment Receipt',
  proofOfRelationship: 'Proof of Relationship',
  proofOfCitizenship: 'Proof of Citizenship',
  proofOfLegalDOcuments: 'Proof of Legal Documents',
  proofOfIdentity: 'Proof of Identity',
  proofOfAddress: 'Proof of Residence',
  proofOfReplacement: 'Proof of Replacement',
  proofOfBirth: 'Proof of Event of Birth',
  proofOfOtherSupportingdocumentIssuedbyGovt: 'Other Supporting Documents Issued by Government',
  proofOfOtherSupportingDocuments: 'Other Supporting Documents',
  proofOfRegistration: 'Proof of Registration',
  proofOfAdoption: 'Proof of Adoption',
  proofOfChangeOfParticulars: 'Proof of Change of Particulars',
  proofOfDeclarant: 'Declarant National ID',
  proofOfLegalDeepPoll: 'Deed Poll',
  proofOfLegalGazzette: 'Uganda Gazette',
  proofOfLegalStatutoryDeclaration: 'Legal Statement Under Oath',
  proofOfModificationConsent: 'Modification Consent Form',
  proofOfIntroducerSignature: 'Introducer Signature',
  introducerProofOfSignature: 'Introducer Signature',
  proofOfCourtOrder: 'Court Order',
  proofOfLegalChange: 'Proof of Legal Change',
  proofOfLegalStatementUnderOath: 'Legal Statement under Oath',
  proofOfPoliceConfirmation: 'Proof of Police Confirmation',
  proofOfResidence: 'Proof of Residence',
  proofOfCitizenshipCertificate: 'Proof of Citizenship Certificate',
  proofOfLoss: 'Proof of Loss',
  proofOfNationalId: 'National ID',
  proofOfLC1Letter: 'LC 1 Letter',
  proofOfDamaged: 'Damaged Card',
  proofOfNoticeOfIntension: 'Notice of Intention to Change Name',
  proofOfDeedPoll: 'Deed Poll Registered with URSB',
  proofOfCID: 'CID Report',
  proofOfInterpol: 'Interpol clearance',
  proofOfBirthCert: 'Birth Certificate',
  proofOfAcademic: 'Academic Documents',
  proofOfPassport: 'Passport',
  proofOfVoters: 'Voters Card',
  proofOfDriving: 'Driving Permit',
  proofOfBaptism: 'Baptism Card',
  proofOfOtherRelevant: 'Any other relevant docs',
  proofOfStatutory: 'Statutory Declaration',
  proofOfLCV: 'Letter for Citizenship Verification',
  proofOfRecLetter: 'Recommendation Letter',
  proofOfOtherSupporting: 'Any other supporting Documents',
  proofOfStaDecalrationByParent: 'Statutory Declaration by the parent',
  proofOfNotification: 'Notification Record',
  proofOfCbyReg: 'Certificate of Citizenship by Registration',
  proofOfCbyNat: 'Certificate of Citizenship by Naturalization',
  proofOfCbyDual: 'Certificate of Dual Citizenship',
  proofOfMarCert: 'Certified copy of marriage certificate',
  proofOfDecAbsolute: 'Certified copy of decree absolute',
  proofOfDNA: 'DNA test results',
  proofOfBirthCertBeforeReg: 'Certified copy of Birth certificate issued before registration',
  proofOfLegalReport: 'Legal Report',
  proofOfAll: 'Passport/ Voters Card/ Driving Permit/ Baptism Card/ Other',
  proofOfMedRep: 'Medical Report',
  proofOfBAP: 'Birth Certificate/ Acadamic Docs/ Passport',
  proofOfBirthNotification: 'Birth Certificate / Notification Record',
  proofOfAppNationalID: 'National Identification Number of applicant',
  proofOfPNationalID: 'National ID of parent',
  proofOfFAll: 'Care order, Probation report, Welfare and family court reports',
  proofOfPOLREP: 'Police Report',
  proofOfNIDPBR: 'National ID of Parents/ Blood Relatives',
  proofOfCLEI: 'Local Council Letter or Embassy information',
  proofOfPPDetails: 'Previous Passports Details',
  proofOfNatCert: 'Naturalization Certificate',
  proofOfPrevRec: 'Previous immigration records',
  proofOfPassportCopy: 'Copy of Passport',
  proofOfImmigrationFacility: 'Copy of Immigration Facility',
  proofOfPrinciplePassport: 'Copy of Principal\'s Passport',
  proofOfAlienID:'Copy of AIN Card'
};

  export const PROOF_OF_PHYSICAL_APPLICATION_FORM = 'proofOfPhysicalApplicationForm';

  export const FORM_LABELS_BY_SERVICE: {[key: string]: string} = {
    'New registrations' : 'Proof of Form-3 New Registration',
    'Alien New Registration' : 'Proof of Form-4 Alien New Registration',
    'Renewal of card': 'Proof of Form-9 Renewal',
    'Renewal of Alien': 'Proof of Form-10 Renewal of Alien',
    'Lost/ Replacement of card': 'Proof of Form-11 Replacement',
    'Replacement of card': 'Proof of Form-11 Replacement',
    'Change of Particulars': 'Proof of Form-1/1A COP',
    'GetFirst ID': 'Proof of Form-7A GetFirst ID'
  }


  export const TITLE_MAP: { [key: string]: string[] } = {
    proofOfPhysicalApplicationForm: ['Physical Application Form'],
    proofOfAbandonment: ['Police Report'],
    proofOfException: ['Expetion Photo'],
    proofOfPayment: ['Payment Slip'],
    proofOfRelationship: ['LC 1 Recommendation Letter', 'Immunization Card', 'Mother National ID Card', 'Father National ID Card', 'Guardian introduction letter', 'Guardian National ID Card'],
    proofOfCitizenship: ['LC 1 Recommendation Letter', 'Notification Of Birth Record', 'Passport Document', 'Mother National ID Card', 'Certificate of Dual Citizenship', 'Father National ID Card', 'Relative National ID Card', 'Guardian National ID Card', 'Birth Certificate', 'Tax Document', 'Previous Immigration records', 'National Id', 'Previous passports of self, parents, or grandparents', 'Copies of birth certificates of self parents or grandparents', 'Naturalization Certificate of self parents', 'Certificate of Citizenship by Naturalization', 'Certificate of Citizenship by Registration'],
    proofOfLegalDOcuments: [],
    proofOfIdentity: ['Mother National ID Card', 'Father National ID Card', 'Passport Document', 'Relative National ID Card', 'Guardian National ID Card', 'Photo identification cards issued by the Government', 'Medical card issued by the State Govt', 'Voter Identification card', 'Driving licence of the applicant', 'Expired Card'
      ],
    proofOfAddress: ['Birth Document', 'Passport Document', 'LC 1 Recommendation Letter', 'Mother National ID Card', 'Certificate of Relationship', 'Guardian introduction letter', 'Birth Certificate', 'Certificate of Citizenship by Naturalization', 'Address Of Residence Diaspora', 'Guardian National ID Card'],
    proofOfReplacement: ['Police Letter', 'Damaged Card', 'CID Report'],
    proofOfBirth: ['Immunization Card', 'Notification Of Birth Record', 'Birth Certificate'],
    proofOfOtherSupportingdocumentIssuedbyGovt: ['Court Report', 'Welfare and Family', 'Passport Document', 'Voter Card', 'Driving Permit', 'Care Order', 'Probation report', 'Birth Certificate', 'Academic Documents', 'Marriage certificate or Divorce Decree', 'Certified copy of DNA test results', 'Court Order', 'Parent National ID'],
    proofOfOtherSupportingDocuments: ['Previous Immigration records', 'Baptism Card', 'Any other relevant Documents', 'Certificate of Marriage'],
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
    proofOfCourtOrder: ['Court Order'],
    proofOfLoss:['Police Report'],
    proofOfNationalId:['National Id'],
    proofOfLC1Letter: ['LC 1 Letter'],
    proofOfDamaged: ['Damaged Card']
  };
  // Define the mappings for categories and titles based on service and service type
export const SERVICE_CATEGORY_MAP: { [key: string]: { [key: string]: string[] } } = {
  'New registrations': {
    'Registration of citizens by birth': ['proofOfCitizenship', 'proofOfAddress', 'proofOfBirth',
       'proofOfOtherSupportingdocumentIssuedbyGovt', 'proofOfOtherSupportingDocuments'],
    'Citizenship under the Article 9': ['proofOfCitizenship', 'proofOfBirth',
      'proofOfOtherSupportingDocuments', 'proofOfLegalStatutoryDeclaration'],
    'Registration of Citizens by Naturalization': ['proofOfCitizenship', 'proofOfBirth',
       'proofOfOtherSupportingdocumentIssuedbyGovt'],
    'Registration of Citizens by Registration': ['proofOfCitizenship', 'proofOfBirth',
       'proofOfOtherSupportingdocumentIssuedbyGovt'],
    'Registration of Dual Citizens': ['proofOfCitizenship', 'proofOfAddress', 'proofOfBirth',
       'proofOfOtherSupportingdocumentIssuedbyGovt', 'proofOfOtherSupportingDocuments'],
    'Registration of child citizen': ['proofOfCitizenship', 'proofOfAddress', 'proofOfBirth',
       'proofOfOtherSupportingdocumentIssuedbyGovt', 'proofOfOtherSupportingDocuments'],
    'Registration of foundlings': ['proofOfAbandonment', 'proofOfAddress', 'proofOfBirth',
          'proofOfOtherSupportingdocumentIssuedbyGovt'],
     'Alien New Registration': ['proofOfImmigrationFacility', 'proofOfPassportCopy', 'proofOfPayment', 'proofOfPrinciplePassport']
  },
  'Renewal of card': {
    'Renewal of a card': ['proofOfCitizenship', 'proofOfAddress'],
    'Replacement of a card': [''],
    'Renewal of Alien': ['proofOfImmigrationFacility','proofOfPassportCopy','proofOfPayment','proofOfPhysicalApplicationForm','proofOfPrinciplePassport']

  },
  'Lost/ Replacement of card': {
    'Lost/ Replacement of card': ['proofOfPhysicalApplicationForm', 'proofOfAbandonment', 'proofOfLoss', 'proofOfDamaged', 'proofOfNationalId'],
    'Alien Replacement': ['proofOfImmigrationFacility','proofOfPassportCopy','proofOfPayment','proofOfAlienID','proofOfPhysicalApplicationForm']
  },
  'Deactivated':{
    'Alien Deactivated' : ['proofOfImmigrationFacility']
  },
  'Change of Particulars': {
    'addingName': ['proofOfNoticeOfIntension', 'proofOfDeedPoll', 'proofOfBirthCert', 'proofOfAcademic', 'proofOfPassport', 'proofOfVoters', 'proofOfDriving', 'proofOfBaptism', 'proofOfOtherRelevant'],
    'removingName': ['proofOfNoticeOfIntension', 'proofOfDeedPoll', 'proofOfBirthCert', 'proofOfAcademic', 'proofOfPassport', 'proofOfVoters', 'proofOfDriving', 'proofOfBaptism', 'proofOfOtherRelevant'],
    'changeOrderOfNames': ['proofOfStatutory', 'proofOfAll'],
    'completeChangeofName': ['proofOfNoticeOfIntension', 'proofOfDeedPoll', 'proofOfCID', 'proofOfInterpol', 'proofOfBirthCert', 'proofOfAcademic', 'proofOfPassport', 'proofOfVoters', 'proofOfDriving', 'proofOfBaptism', 'proofOfOtherRelevant'],
    'changeOfDateOfBirth': ['proofOfStatutory', 'proofOfCID', 'proofOfBirthCert', 'proofOfAcademic', 'proofOfPassport', 'proofOfVoters', 'proofOfDriving', 'proofOfLegalReport', 'proofOfBaptism'],
    'changeInPlaceOfResidence': ['proofOfLC1Letter'],
    'changeInPlaceOfBirth': ['proofOfStatutory', 'proofOfBirthNotification'],
    'changeInPlaceOfOrigin': ['proofOfStatutory','proofOfLC1Letter', 'proofOfBirthCert', 'proofOfBaptism', 'proofOfOtherSupporting'],
    'changeInCitizenshipType': ['proofOfStatutory', 'proofOfCbyReg', 'proofOfCbyNat', 'proofOfCbyDual'],
    'addSpouse': ['proofOfMarCert'],
    'removeSpouse': ['proofOfDecAbsolute'],
    'changeDetailsOfFather': ['proofOfBirthCertBeforeReg', 'proofOfCID', 'proofOfDNA', 'proofOfCourtOrder'],
    'changeDetailsOfMother': ['proofOfBirthCertBeforeReg', 'proofOfCID', 'proofOfDNA', 'proofOfCourtOrder'],
    'addingNamesFromPreviousCertorDoc':['proofOfStatutory', 'proofOfBAP'],
    'otherNameCorrections':['proofOfStatutory', 'proofOfAll'],
    'changeInGender':['proofOfStatutory', 'proofOfMedRep', 'proofOfAll']
  },
  'GetFirst ID': {
    'GetFirst ID': ['proofOfRegistration', 'proofOfOtherSupportingdocumentIssuedbyGovt', 
      'proofOfOtherSupportingDocuments']
  }
};

export const SERVICE_TITLE_MAP: { [key: string]: { [key: string]: { [key: string]: string[] } } } = {
  'New registrations': {
    'Registration of citizens by birth': {
      proofOfCitizenship: ['National ID of Parents/ Blood Relatives'],
      proofOfAddress: ['Local Council Letter'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Passport','Voters Card', 'Driving Permit'],
      proofOfOtherSupportingDocuments:['Baptism Card']
    },
    'Citizenship under the Article 9': {
      proofOfCitizenship: ['Previous Passports Details','Naturalization Certificate','Birth Certificates'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingDocuments:['Previous immigration records'],
      proofOfLegalStatutoryDeclaration:['Statutory Declaration']
    },
    'Registration of Citizens by Naturalization': {
      proofOfCitizenship: ['Certificate of Naturalization'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Passport']
    },
    'Registration of Citizens by Registration': {
      proofOfCitizenship: ['Certificate of Registration'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Passport']
    },
    'Registration of Dual Citizens': {
      proofOfCitizenship: ['Certificate of Dual Citizenship'],
      proofOfAddress: ['Local Council Letter'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Passport/s', 'Voters Card','Driving Permit'],
      proofOfOtherSupportingDocuments:['Baptism Card']
    },
    'Registration of child citizen': {
      proofOfCitizenship: ['National ID of Parents/ Blood Relatives'],
      proofOfAddress: ['Local Council Letter'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Passport'],
      proofOfOtherSupportingDocuments:['Baptism Card']
    },
    'Registration of foundlings': {
      proofOfAbandonment: ['Police Report'],
      proofOfAddress: ['Local Council Letter'],
      proofOfBirth:['Birth Certificate'],
      proofOfOtherSupportingdocumentIssuedbyGovt:['Care order', 'Probation report','Welfare and family court reports']
    },
    'Alien New Registration': {
      proofOfImmigrationFacility: ['Copy of Immigration Facility'],
      proofOfPassportCopy: ['Copy of Passport'],
      proofOfPayment:['Payment Receipt'],
      proofOfPrinciplePassport:['Copy of Principal\'s Passport']
    }
  },
  'Renewal of card': {
    'Renewal of a card': {
      proofOfAddress: ['Local Council Letter'],
      proofOfCitizenship:['National ID of Parents/ Blood Relatives']
    },
    'Replacement of a card': {
      },
    'Renewal of Alien': {
      proofOfImmigrationFacility: ['Copy of Immigration Facility'],
      proofOfPassportCopy: ['Copy of Passport'],
      proofOfPayment:['Payment Receipt'],
      proofOfPhysicalApplicationForm: ['Physical Application Form'],
      proofOfPrinciplePassport:['Copy of Principal\'s Passport']
    }
  },
  'Lost/ Replacement of card': {
    'Lost/ Replacement of card': {
      proofOfPhysicalApplicationForm: ['Physical Application Form'],
      proofOfLoss: ['Police Report'],
      proofOfNationalId:['National Id'],
      proofOfDamaged: ['Damaged Card']
   },
    'Alien Replacement': {
      proofOfImmigrationFacility: ['Copy of Immigration Facility'],
      proofOfPassportCopy: ['Copy of Passport'],
      proofOfPayment:['Payment Receipt'],
      proofOfAlienID:['Copy of AIN Card'],
      proofOfPhysicalApplicationForm: ['Physical Application Form']
    }
  },
  'Deactivated':{
    'Alien Deactivated' : {
      proofOfImmigrationFacility: ['Copy of Immigration Facility']
    }
  },
  'Change of Particulars': {
    // Added individual mappings for each COP service type
    'addingName': {
      proofOfNoticeOfIntension: ['Notice of Intention to Change Name'],
      proofOfDeedPoll: ['Deed Poll Registered with URSB'],
      proofOfBirthCert: ['Birth Certificate'],
      proofOfAcademic: ['Academic Documents'],
      proofOfPassport: ['Passport'],
      proofOfVoters: ['Voters Card'],
      proofOfDriving: ['Driving Permit'],
      proofOfBaptism: ['Baptism Card'],
      proofOfOtherRelevant: ['Any other relevant docs'],
      
    },
    'removingName': {
      proofOfNoticeOfIntension: ['Notice of Intention to Change Name'],
      proofOfDeedPoll: ['Deed Poll Registered with URSB'],
      proofOfBirthCert: ['Birth Certificate'],
      proofOfAcademic: ['Academic Documents'],
      proofOfPassport: ['Passport'],
      proofOfVoters: ['Voters Card'],
      proofOfDriving: ['Driving Permit'],
      proofOfBaptism: ['Baptism Card'],
      proofOfOtherRelevant: ['Any other relevant docs'],
    },
    'changeOrderOfNames': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfAll: ['Passport/ Voters Card/ Driving Permit/ Baptism Card/ Other'] 
    },
    'completeChangeofName': {
      proofOfNoticeOfIntension: ['Notice of Intention to Change Name'],
      proofOfDeedPoll: ['Deed Poll Registered with URSB'],
      proofOfCID: ['CID Report'],
      proofOfInterpol: ['Interpol clearance'],
      proofOfBirthCert: ['Birth Certificate'],
      proofOfAcademic: ['Academic Documents'],
      proofOfPassport: ['Passport'],
      proofOfVoters: ['Voters Card'],
      proofOfDriving: ['Driving Permit'],
      proofOfBaptism: ['Baptism Card'],
      proofOfOtherRelevant: ['Any other relevant docs'],
    },
    'changeOfDateOfBirth': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfCID: ['CID Report'],
      proofOfBirthCert: ['Birth Certificate'],
      proofOfAcademic: ['Academic Documents'],
      proofOfPassport: ['Passport'],
      proofOfVoters: ['Voters Card'],
      proofOfDriving: ['Driving Permit'],
      proofOfLegalReport: ['Legal Report'],
      proofOfBaptism: ['Baptism Card']
    },
    'changeInPlaceOfResidence': {
      proofOfLC1Letter: ['Letter from LC 1 Chairperson']
    },
    'changeInPlaceOfBirth': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfBirthNotification: ['Birth Certificate / Notification Record'],
    },
    'changeInPlaceOfOrigin': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfLC1Letter: ['Letter from LC 1 Chairperson'],
      proofOfBirthCert: ['Birth Certificate'],
      proofOfBaptism: ['Baptism Card'],
      proofOfOtherSupporting: ['Any other supporting Documents']
    },
    'changeInCitizenshipType': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfCbyReg: ['Certificate of Citizenship by Registration'],
      proofOfCbyNat: ['Certificate of Citizenship by Naturalization'],
      proofOfCbyDual: ['Certificate of Dual Citizenship']   
    },
    'addSpouse': {
      proofOfMarCert: ['Certified copy of marriage certificate']
    },
    'removeSpouse': {
      proofOfDecAbsolute: ['Certified copy of decree absolute']
    },
    'changeDetailsOfFather': {
      proofOfBirthCertBeforeReg: ['DNA test results'],
      proofOfCID: ['CID Report'],
      proofOfDNA: ['DNA test results'],
      proofOfCourtOrder: ['Court Order']
    },
    'changeDetailsOfMother': {
      proofOfBirthCertBeforeReg: ['DNA test results'],
      proofOfCID: ['CID Report'],
      proofOfDNA: ['DNA test results'],
      proofOfCourtOrder: ['Court Order']
    },
    'addingNamesFromPreviousCertorDoc': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfBAP: ['Birth Certificate/ Acadamic Docs/ Passport']
    },
    'otherNameCorrections': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfAll: ['Passport/ Voters Card/ Driving Permit/ Baptism Card/ Other']
    },
    'changeInGender': {
      proofOfStatutory: ['Statutory Declaration'],
      proofOfMedRep: ['Medical Report'],
      proofOfAll: ['Passport/ Voters Card/ Driving Permit/ Baptism Card/ Other']
    }
  },
  'GetFirst ID': {
    'GetFirst ID': {
      proofOfRegistration: ['National Identification Number of applicant'],
      proofOfOtherSupportingdocumentIssuedbyGovt: ['National ID of parent','Birth Certificate',
        'Academic Documents','Passport','Voters Card','Driving Permit'],
        proofOfOtherSupportingDocuments: ['Baptism Card ','Any other relevant Documents']

    }
  }
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

  export const RENEWAL_REJECTION_CATEGORIES = [
    { value: 'Documents provided have inconsistent information', default: false},
    { value: 'Insufficient supporting documents ', default: false},
    { value: 'Documents not in required format (i.e SD exists but not registered)', default: false},
    { value: 'Poorly scanned documents to enable decision', default: false},
    { value: 'Fraudulent/Altered /doctored documents', default: false},
    { value: 'No payment receipt attached', default: false},
    { value: 'Payments used on previous unrelated application', default: false},
    { value: 'Payment lower than statutory fees', default: false},
    { value: 'Evidence of multiple changes in short period of time(Time should be specified)', default: false},
    { value: 'An existing record is stop listed', default: false},
    { value: 'Other ( Free Text)', default: false}
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

  export const GETFIRSTID_REJECTION_CATEGORIES = [
    { value: 'Documents provided have inconsistent information', default: false },
    { value: 'Insufficient supporting documents', default: false },
    { value: 'Documents not in required format (i.e SD exists but not registered)', default: false },
    { value: 'Poorly scanned documents to enable decision', default: false },
    { value: 'Fraudulent/Altered /doctored documents ', default: false },
    { value: 'Evidence of multiple changes in short period of time(Time should be specified)', default: false },
    { value: 'An existing record is stop listed', default: false },
    { value: 'Other',  default: false}
  ];

  export const LR_REJECTION_CATEGORIES = [
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

  
  export const NEW_ESCALATION_CATEGORIES = [
    { value: 'Suspected Non Citizen',  default: false},
    { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
    { value: 'Inconsistent information on tribe of mother',  default: false},
    { value: 'Inconsistent information on clan of mother',  default: false},
    { value: 'Inconsistent information on tribe of father',  default: false},
    { value: 'Inconsistent information on clan of father',  default: false},
    { value: 'Inconsistent information on place of origin-Father',  default: false},
    { value: 'Inconsistent information on place of origin-Mother',  default: false},
    { value: 'Inconsistent information on place of origin-Blood Relative',  default: false},
    { value: 'Wrong citizenship category/Type',  default: false},
    { value: 'Applicant’s citizenship is stoplisted/blocked',  default: false},
    { value: 'Father/Mother is too young',  default: false},
    { value: 'Grandparents are too young',  default: false},
    { value: 'Different DOB/Age of mother on mother’s individual application',  default: false},
    { value: 'Different DOB/Age of father on father’s individual application',  default: false},
    { value: 'Different DOB/Age of blood relative on blood relative individual application',  default: false},
    { value: 'Attempting double registration',  default: false},
    { value: 'NIN has already been used to identify more than 20 people',  default: false},
    { value: 'Indigenous community not listed under Schedule 3',  default: false},
    { value: 'Missing Documentation',  default: false},
    { value: 'Insufficient Documentation',  default: false}
];

export const NEW_ESCALATION_CATEGORIES_FOR_OFFICER = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Inconsistent information on tribe of mother',  default: false},
  { value: 'Inconsistent information on clan of mother',  default: false},
  { value: 'Inconsistent information on tribe of father',  default: false},
  { value: 'Inconsistent information on clan of father',  default: false},
  { value: 'Inconsistent information on place of origin-Father',  default: false},
  { value: 'Inconsistent information on place of origin-Mother',  default: false},
  { value: 'Inconsistent information on place of origin-Blood Relative',  default: false},
  { value: 'Wrong citizenship category/Type',  default: false},
  { value: 'Applicant’s citizenship is stoplisted/blocked',  default: false},
  { value: 'Father/Mother is too young',  default: false},
  { value: 'Grandparents are too young',  default: false},
  { value: 'Different DOB/Age of mother on mother’s individual application',  default: false},
  { value: 'Different DOB/Age of father on father’s individual application',  default: false},
  { value: 'Different DOB/Age of blood relative on blood relative individual application',  default: false},
  { value: 'Attempting double registration',  default: false},
  { value: 'NIN has already been used to identify more than 20 people',  default: false},
  { value: 'Indigenous community not listed under Schedule 3',  default: false},
  { value: 'Missing Documentation',  default: false},
  { value: 'Insufficient Documentation',  default: false}
];


export const RENEWAL_ESCALATION_CATEGORIES = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Wrong citizenship category/Type',  default: false},
  { value: 'Applicant’s citizenship is stoplisted/blocked',  default: false},
  { value: 'Father is too young',  default: false},
  { value: 'Mother is too young',  default: false},
  { value: 'Additional Renewal application',  default: false},
  { value: 'Names are inconsistent with original application',  default: false},
  { value: 'Insufficient Documentation',  default: false},
  { value: 'Missing Documentation',  default: false}
];

export const RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Wrong citizenship category/Type',  default: false},
  { value: 'Applicant’s citizenship is stoplisted/blocked',  default: false},
  { value: 'Father is too young',  default: false},
  { value: 'Mother is too young',  default: false},
  { value: 'Additional Renewal application',  default: false},
  { value: 'Names are inconsistent with original application',  default: false},
  { value: 'Insufficient Documentation',  default: false}
];

export const GETFIRSTID_ESCALATION_CATEGORIES = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Unsatisfactory Evidence of intended changes',  default: false},
  { value: 'Unauthorized Second Register Entry',  default: false},
  { value: 'Submission of falsified documents',  default: false},
  { value: 'Insufficient supporting Documents',  default: false}
];
export const LR_ESCALATION_CATEGORIES = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Unsatisfactory Evidence of intended changes',  default: false},
  { value: 'Unauthorized Second Register Entry',  default: false},
  { value: 'Submission of falsified documents',  default: false},
  { value: 'Insufficient supporting Documents',  default: false}
];

export const COP_ESCALATION_CATEGORIES = [
  { value: 'Suspected Non Citizen',  default: false},
  { value: 'Supporting documents look suspicious/forged/Altered',  default: false},
  { value: 'Unsatisfactory Evidence of intended changes',  default: false},
  { value: 'Unauthorized Second Register Entry',  default: false},
  { value: 'Submission of falsified documents',  default: false},
  { value: 'Insufficient supporting Documents',  default: false}
];

  export const FILTERED_SERVICE_TYPES: { value: string; label: string }[] = [
    { value: 'Registration of citizens by birth', label: 'Registration of citizens by birth' },
    { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
    { value: 'Registration of Citizens by Naturalization', label: 'Registration of Citizens by Naturalization' },
    { value: 'Registration of Citizens by Registration', label: 'Registration of Citizens by Registration' },
    { value: 'Registration of Dual Citizens', label: 'Registration of Dual Citizens' },
    { value: 'Registration of citizens by birth', label: 'Registration of Child Citizens by birth' },
    { value: 'Registration of citizens by birth', label: 'Registration of Foundlings' },
    { value: 'Renewal of a card', label: 'Renewal of a card' },
    { value: 'Replacement of a card', label: 'Replacement of a card' },
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
      value: 'New registrations',
      label: 'New registrations',
      serviceTypes: [
        { value: 'Registration of citizens by birth', label: 'Registration of citizens by birth' },
        { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
        { value: 'Registration of Citizens by Naturalization', label: 'Registration of Citizens by Naturalization' },
        { value: 'Registration of Citizens by Registration', label: 'Registration of Citizens by Registration' },
        { value: 'Registration of Dual Citizens', label: 'Registration of Dual Citizens' }
      ]
    },
    {
      value: 'Renewal of card',
      label: 'Renewal of card',
      serviceTypes: [
        { value: 'Renewal of a card', label: 'Renewal of a card' },
      ]
    },
    {
      value: 'Lost/ Replacement of card',
      label: 'Lost/ Replacement of card',
      serviceTypes: [
        { value: 'Lost/ Replacement of card', label: 'Lost/ Replacement of card' }
      ]
    },
    {
      value: 'Change of Particulars',
      label: 'Change of Particulars',
      serviceTypes: [
        { value: 'Change of Particulars', label: 'Change of Particulars' }
        // { value: 'Add Name', label: 'Adding a Name' },
        // { value: 'Remove Name', label: 'Removing a name' },
        // { value: 'Change Order of Names', label: 'Change of Order of Names' },
        // { value: 'Complete Name Change', label: 'Complete Change of Name' },
        // { value: 'Change DOB', label: 'Change of Data of Birth' },
        // { value: 'Change DOB > 4 years', label: 'Change of Date of Birth > 4 years' },
        // { value: 'Change Residence Adult', label: 'Change in place of Residence of Adult' },
        // { value: 'Change Residence Child', label: 'Change in Place of Residence of Child' },
        // { value: 'Change Birth Place Adult', label: 'Change in place of Birth of Adult' },
        // { value: 'Change Birth Place Child', label: 'Change in Place of Birth of Child' },
        // { value: 'Correct Origin Adult', label: 'Correction in place of Origin of Adult' },
        // { value: 'Correct Origin Child', label: 'Correction in Place of Origin of Child' },
        // { value: 'Change Citizenship Type', label: 'Change in citizenship type' },
        // { value: 'Change Polling Station', label: 'Change in polling station' },
        // { value: 'Add Spouse', label: 'Add a spouse' },
        // { value: 'Remove Spouse', label: 'Remove a spouse' },
        // { value: 'Change Father Details', label: 'Change the details of the father' },
        // { value: 'Change Mother Details', label: 'Change the details of the mother' },
        // { value: 'Correct NIN Error', label: 'Correction of error regarding NIN' }
      ]
    },
    {
      value: 'GetFirst ID',
      label: 'GetFirst ID',
      serviceTypes: [
        { value: 'GetFirst ID', label: 'GetFirst ID' }
      ]
    },
    {
      value: 'Alien New Registration',
      label: 'Alien New Registration',
       serviceTypes: [
        { value: 'Alien New Registration', label: 'Alien New Registration' }
      ]
    },
     {
      value: 'Renewal of Alien',
      label: 'Renewal of Alien',
       serviceTypes: [
        { value: 'Renewal of Alien', label: 'Renewal of Alien' }
      ]
    },
     {
      value: 'Alien Replacement',
      label: 'Alien Replacement',
       serviceTypes: [
        { value: 'Alien Replacement', label: 'Alien Replacement' }
      ]
    },
  ];


  export const PERSONAL_INFO_FIELD_ORDER: string[] = [
  'fullname',
  'surname',
  'givenName',
  'otherNames',
  'maidenName',
  'previousName',
  'dateOfBirth',
  'gender',
  'phone',
  'nonLocalPhone',
  'email',
  'applicantLivingStatus',
  'CountryCode',
  'nonLocalCountryCode',
  'homePhoneNumber',
  'highestLevelOfEducation',
  'otherHighestLevelOfEducation',
  'profession',
  'otherProfession',
  'occupation',
  'otherOccupation',
  'religion',
  'otherReligion',
  'disabilities',
  'otherDisability',
  'userServiceType',
  'userService',
  'cardNumber',
  'UIN',
  'NIN',
  'preferredLang',
  'NINVerified',
  'updatedAt',
  'renewalNIN',
  'nextOfKinPhoneNumber',
  'ninExpiryDate',
  'applicantNationality',
  'applicantOtherNationality',
  'citizenshipCertificateNo',
  'foundLink',
  'drivingLicenceNumber',
  'taxIdentificationNumber'
];

export const RESIDENCE_INFO_FIELDS: string[] = [
  'residenceStatus',
  'applicantPlaceOfResidence',
  'applicantForeignResidenceCountry',
  'applicantForeignResidenceAddress',
  'appResCountryUGA',
  'applicantPlaceOfResidenceCounty',
  'applicantPlaceOfResidenceSubCounty',
  'applicantPlaceOfResidenceParish',
  'applicantPlaceOfResidenceVillage',
  'applicantPlaceOfResidenceStreet',
  'applicantPlaceOfResidenceYearsLived',
  'applicantPlaceOfResidenceDistrictOfPrevRes',
  'applicantPlaceOfResidencePostalAddress',
  'applicantPlaceOfResidenceHouseNo',
  'applicantPlaceOfResidenceDistrict'
];

export const BIRTH_INFO_FIELDS: string[] = [
  'applicantForeignBirthCountry',
  'applicantForeignBirthAddress',
  'appBirCountryUGA',
  'applicantPlaceOfBirthDistrict',
  'applicantPlaceOfBirthCounty',
  'applicantPlaceOfBirthSubCounty',
  'applicantPlaceOfBirthParish',
  'applicantPlaceOfBirthVillage',
  'applicantPlaceOfBirthCity',
  'applicantPlaceOfBirthHealthFacility'
];

export const ORIGIN_INFO_FIELDS: string[] = [
  'applicantForeignOriginCountry',
  'applicantForeignOriginAddress',
  'appOriCountryUGA',
  'applicantPlaceOfOriginDistrict',
  'applicantPlaceOfOriginCounty',
  'applicantPlaceOfOriginSubCounty',
  'applicantPlaceOfOriginParish',
  'applicantPlaceOfOriginVillage',
  'applicantPlaceOfOriginIndigenousCommunityTribe',
  'applicantPlaceOfOriginClan'
];

export const CITIZENSHIP_INFO_FIELDS: string[] = [
  'dualNationalityStatus',
  'primaryNationality',
  'secondaryNationality',
  'applicantPassportNumber',
  'applicantPassportFileNumber',
  'dualCitizenshipCertificateNumber',
  'registrationCertificateNumber',
  'naturalizationCertificateNumber',
  'citizenshipOrNationality',
  'previousNationality',
  'placeOfIssue',
  'dateOfIssue',
  'issuingAuthority'
];

export const POLLING_INFO_FIELDS: string[] = [
  'preferredPollingStation',
  'pollingStationNameResidence',
  'pollingStationNameOrigin'
];

export const SPOUSE_INFO_FIELDS: string[] = [
  'spouseSurname',
  'spouseGivenName',
  'spouseOtherNames',
  'spouseMaidenName',
  'spousePreviousName',
  'spouseNIN',
  'spouseCitizenshipType',
  'spousePlaceOfMarriage',
  'spouseDateOfMarriage',
  'spouseTypeOfMarriage',
  'spouseMarriageCertificateNumber',
  'numberOfOtherSpouses',
  'spouseTwoSurname',
  'spouseTwoGivenName',
  'spouseTwoOtherNames',
  'spouseTwoPreviousName',
  'spouseTwoNIN',
  'spouseTwoCitizenshipType',
  'spouseTwoPlaceOfMarriage',
  'spouseTwoDateOfMarriage',
  'spouseTwoTypeOfMarriage',
  'spouseTwoMarriageCertificateNumber',
  'spouseThreeSurname',
  'spouseThreeGivenName',
  'spouseThreeOtherNames',
  'spouseThreeMaidenName',
  'spouseThreePreviousName',
  'spouseThreeNIN',
  'spouseThreeCitizenshipType',
  'spouseThreePlaceOfMarriage',
  'spouseThreeDateOfMarriage',
  'spouseThreeTypeOfMarriage',
  'spouseThreeMarriageCertificateNumber',
  'removeSpouseSurname',
  'removeSpouseGivenName',
  'removeSpouseDateOfMarriage',
  'numberOfOtherSpousesAlien',
  'spouseName',
  'spouseTwoName',
  'spouseThreeName',
  'spouseFourName',
  'spouseFiveName',
  'spouseSixName'
];

export const FATHER_INFO_FIELDS: string[] = [
  'fatherLivingStatus',
  'fatherSurname',
  'fatherGivenName',
  'fatherOtherNames',
  'fatherPreviousName',
  'fatherNIN',
  'fatherUIN',
  'fatherIDDocumentNo',
  'fatherCitizenshipType',
  'fatherCitizenCertificateNumber',
  'fatherIndigenousCommunityTribe',
  'fatherIndigenousCommunityClan',
  'fatherOccupation',
  'fatherForeignResidenceCountry',
  'fatherForeignResidenceAddress',
  'fatherPostalAddress',
  'fatResCountryUGA',
  'fatherPlaceOfResidenceDistrict',
  'fatherPlaceOfResidenceCounty',
  'fatherPlaceOfResidenceSubCounty',
  'fatherPlaceOfResidenceParish',
  'fatherPlaceOfResidenceVillage',
  'fatherPlaceOfResidenceStreet',
  'fatherPlaceOfResidenceHouseNo',
  'fatherForeignOriginCountry',
  'fatherForeignOriginAddress',
  'fatOriCountryUGA',
  'fatherPlaceOfOriginDistrict',
  'fatherPlaceOfOriginCounty',
  'fatherPlaceOfOriginSubCounty',
  'fatherPlaceOfOriginParish',
  'fatherPlaceOfOriginVillage'
];

export const MOTHER_INFO_FIELDS: string[] = [
  'motherLivingStatus',
  'motherSurname',
  'motherGivenName',
  'motherOtherNames',
  'motherPreviousName',
  'motherMaidenName',
  'motherNIN',
  'motherIDDocumentNo',
  'motherCitizenshipType',
  'motherCitizenCertificateNumber',
  'motherIndigenousCommunityTribe',
  'motherIndigenousCommunityClan',
  'motherOccupation',
  'motherForeignResidenceCountry',
  'motherForeignResidenceAddress',
  'motherPostalAddress',
  'motResCountryUGA',
  'motherPlaceOfResidenceDistrict',
  'motherPlaceOfResidenceCounty',
  'motherPlaceOfResidenceSubCounty',
  'motherPlaceOfResidenceParish',
  'motherPlaceOfResidenceVillage',
  'motherPlaceOfResidenceStreet',
  'motherPlaceOfResidenceHouseNo',
  'motherForeignOriginCountry',
  'motherForeignOriginAddress',
  'motOriCountryUGA',
  'motherPlaceOfOriginDistrict',
  'motherPlaceOfOriginCounty',
  'motherPlaceOfOriginSubCounty',
  'motherPlaceOfOriginParish',
  'motherPlaceOfOriginVillage'
];

export const GUARDIAN_INFO_FIELDS: string[] = [
  'guardianRelationToApplicant',
  'guardianSurname',
  'guardianGivenName',
  'guardianOtherNames',
  'guardianOccupation',
  'guardianNIN_AIN',
  'guardianIDDocumentnumber',
  'guardianPassportNumber',
  'guardianTribe',
  'guardianClan',
  'guardianCitizenshipType',
  'guardianCitizenshipCertificateNumber',
  'guardianOtherNationality',
  'guardianForeignOriginCountry',
  'guardianForeignOriginAddress',
  'guardiansCountry',
  'guardianResidenceDistrict',
  'guardianResidenceCounty',
  'guardianResidenceSubCounty',
  'guardianResidenceParish',
  'guardianResidenceVillage',
  'guardianResidenceStreet',
  'guardianResidence',
  'guardianDateOfBirth'
];

export const CHILD_INFO_FIELDS: string[] = [
  'numberOfOtherChild',

  'childName',
  'childSurname',
  'childGivenName',
  'childOtherName',
  'childNIN',
  'childSex',
  'childDateOfBirth',

  'childTwoName',
  'childTwoSurname',
  'childTwoGivenName',
  'childTwoOtherName',
  'childTwoNIN',
  'childTwoSex',
  'childTwoDateOfBirth',

  'childThreeName',
  'childThreeSurname',
  'childThreeGivenName',
  'childThreeOtherName',
  'childThreeNIN',
  'childThreeSex',
  'childThreeDateOfBirth',

  'childFourName',
  'childFourSurname',
  'childFourGivenName',
  'childFourOtherName',
  'childFourNIN',
  'childFourSex',
  'childFourDateOfBirth',

  'childFiveName',
  'childFiveSurname',
  'childFiveGivenName',
  'childFiveOtherName',
  'childFiveNIN',
  'childFiveSex',
  'childFiveDateOfBirth',

  'childSixName',
  'childSixSurname',
  'childSixGivenName',
  'childSixOtherName',
  'childSixNIN',
  'childSixSex',
  'childSixDateOfBirth'
];
export const DECLARANT_INFO_FIELDS: string[] = [
  'declarant',
  'declarantSurname',
  'declarantgivenName',
  'declarantotherNames',
  'declarantPreviousNames',
  'declarantMaidenName',
  'declarantGender',
  'declarantNationality',
  'declarantResidenceStatus',
  'introducerNIN',
  'relationToApplicant',
  'otherDeclarantRelationship'
];
export const ENROLMENT_INFO_FIELDS: string[] = [
  'enrolmentCountry',
  'applicantPlaceOfEnrolmentDistrict',
  'applicantPlaceOfEnrolmentCounty',
  'applicantPlaceOfEnrolmentSubCounty',
  'applicantPlaceOfEnrolmentParish',
  'applicantPlaceOfEnrolmentVillage'
];

export const PAYMENT_INFO_FIELDS: string[] = [
  'PRNId'
];

export const EMPLOYER_DETAILS: string[] =[
  'employerName',
  'employerPhone',
  'employerDistrict',
  'employerCounty',
  'employerSubCounty',
  'employerParish',
  'employerVillage',
  'employerStreet',
  'employerCountryCode'
]
export const IMMIGRATION_DETAILS: string[] =[
  'dateOfEntryInUganda',
  'immigrationFacitityNo',
  'facilityType',
  'facilityTypeCategory',
  'dateOfIssuance',
  'dateOfExpiry',
  'facilityTypeSubCategory',
  'reasonforCancellation'
]
export const LINKED_TO_DETAILS: string[] =[
  'ownerType',
  'primaryOwnerAIN',
  'numberOfSecondaryOwner',
  'firstSecondaryOwner',
  'secondSecondaryOwner',
  'thirdSecondaryOwner',
  'fourthSecondaryOwner',
  'fifthSecondaryOwner',
  'sixthSecondaryOwner',
  'seventhSecondaryOwner',
  'eighthSecondaryOwner',
  'ninthSecondaryOwner'
]

export const PRINCIPAL_DEPENDENT_FIELDS: string[] =[
  'principalOfAIN',
  'applicationIDofPrincipal'
]

export const SCHOOL_DETAIL_FIELDS: string[] =[
  'nameOfSchool',
  'schoolCountryCode',
  'schoolPhone',
  'schoolDistrict',
  'schoolCounty',
  'schoolSubCounty',
  'schoolParish',
  'schoolVillage',
  'schoolStreet'
]

// Service-specific label mappings for Alien service types
export const ALIEN_SERVICE_LABEL_MAP: Record<string, string> = {
  phone: 'Local Mobile Number',
  CountryCode: 'Local Mobile No. Country Code',
  nonLocalPhone: 'Non-Local Mobile Number',
  nonLocalCountryCode: 'Non-Local Mobile No. Country Code',
  principalOfAIN: 'AIN of Principal',
  applicationIDofPrincipal: 'Application ID of Principal'
};

export const FIELD_LABEL_MAP: Record<string, string> = {
  phone: 'Mobile Number',
  NIN: 'National ID Number(NIN)',
  ninExpiryDate: 'Card Expiry Date',
  foundLink: 'Foundling',
  appResCountryUGA: 'Applicant Place of Residence Country',
  applicantPlaceOfResidenceDistrictOfPrevRes: 'District of Previous Residence',
  appBirCountryUGA: 'Applicant Place of Birth Country',
  applicantPlaceOfBirthHealthFacility: 'Health Facility',
  appOriCountryUGA: 'Applicant Place of Origin Country',
  applicantPlaceOfOriginIndigenousCommunityTribe: 'Indigenous Community Tribe',
  pollingStationNameResidence: 'Polling Station Name',
  pollingStationNameOrigin: 'Polling Station Name',
  removeSpouseSurname: 'Surname',
  removeSpouseGivenName: 'Given Name',
  removeSpouseDateOfMarriage: 'Date of Marriage',
  fatOriCountryUGA: 'Father Origin Country',
  fatResCountryUGA: 'Father Residence Country',
  motResCountryUGA: 'Mother Residence Country',
  motOriCountryUGA: 'Mother Origin Country',
  guardianRelationToApplicant: "Blood Relative's Relation To Applicant",
  guardianSurname: "Blood Relative's Surname",
  guardianGivenName: "Blood Relative's Given Name",
  guardianOtherNames: "Blood Relative's Other Names",
  guardianOccupation: "Blood Relative's Occupation",
  guardianNIN_AIN: "Blood Relative's Nin",
  guardianIDDocumentnumber: "Blood Relative's Id Document Number",
  guardianPassportNumber: "Blood Relative's Passport Number",
  guardianTribe: "Blood Relative's Tribe",
  guardianClan: "Blood Relative's Clan",
  guardianCitizenshipType: "Blood Relative's Citizenship Type",
  guardianCitizenshipCertificateNumber: "Blood Relative's Citizenship Certificate Number",
  guardianOtherNationality: "Blood Relative's Other Nationality",
  guardianForeignOriginCountry: "Blood Relative's Foreign Origin Country",
  guardianForeignOriginAddress: "Blood Relative's Foreign Origin Address",
  guardiansCountry: "Blood Relative's Country",
  guardianResidenceDistrict: "Blood Relative's Residence District",
  guardianResidenceCounty: "Blood Relative's Residence County",
  guardianResidenceSubCounty: "Blood Relative's Residence Subcounty",
  guardianResidenceParish: "Blood Relative's Residence Parish",
  guardianResidenceVillage: "Blood Relative's Residence Village",
  guardianResidenceStreet: "Blood Relative's Residence Street",
  guardianResidence: "Blood Relative's Residence",
  guardianDateOfBirth: "Blood Relative's Date of Birth",
  enrolmentCountry: 'Country',
  applicantPlaceOfEnrolmentDistrict: 'District',
  applicantPlaceOfEnrolmentCounty: 'County',
  applicantPlaceOfEnrolmentSubCounty: 'Subcounty',
  applicantPlaceOfEnrolmentParish: 'Parish',
  applicantPlaceOfEnrolmentVillage: 'Village',
  motherIDDocumentNo: 'Mother Id Document No',
  fatherIDDocumentNo: 'Fater Id Document No',
  PRNId: 'PRN Number'
};
