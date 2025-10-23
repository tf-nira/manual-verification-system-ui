import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import * as appConstants from '../../app.constants';
import { API_CONST_APPROVE, API_CONST_ESCALATE, API_CONST_ESCALATION_DATE, API_CONST_REJECT, APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, MVS_LEGAL_OFFICER, MVS_EXECUTIVE_DIRECTOR, REJECT, RENEWAL_REJECTION_CATEGORIES, GETFIRSTID_ESCALATION_CATEGORIES, GETFIRSTID_REJECTION_CATEGORIES, LR_ESCALATION_CATEGORIES, LR_REJECTION_CATEGORIES, COP_ESCALATION_CATEGORIES, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS, MVS_OFFICER, NEW_ESCALATION_CATEGORIES_FOR_OFFICER, RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER, API_CONST_RECOMMEND_FOR_APPROVAL, MVS_INTERNATIONAL_OFFICER, Modify_DETAILS, API_CONST_MODIFY } from '../../shared/constants';
import { CATEGORY_MAP, TITLE_MAP, NEW_REJECTION_CATEGORIES, COP_REJECTION_CATEGORIES,
  NEW_ESCALATION_CATEGORIES, RENEWAL_ESCALATION_CATEGORIES, SERVICE_CATEGORY_MAP, SERVICE_TITLE_MAP,
  MAX_DOC_SIZE, FORM_LABELS_BY_SERVICE, PROOF_OF_PHYSICAL_APPLICATION_FORM, CHANGE_OF_PARTICULARS,
  SERVICE_CONST_MIGRATION,SERVICE_CONST_NEW_REGISTRATION,SERVICE_CONST_RENEWAL,PERSONAL_INFO_FIELD_ORDER,RESIDENCE_INFO_FIELDS,BIRTH_INFO_FIELDS,ORIGIN_INFO_FIELDS,CITIZENSHIP_INFO_FIELDS,POLLING_INFO_FIELDS,SPOUSE_INFO_FIELDS,FATHER_INFO_FIELDS,MOTHER_INFO_FIELDS,GUARDIAN_INFO_FIELDS,CHILD_INFO_FIELDS,DECLARANT_INFO_FIELDS,ENROLMENT_INFO_FIELDS,FIELD_LABEL_MAP
 } from '../../shared/constants';
 import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { error } from 'node:console';
import { NgZone } from '@angular/core';
import { map } from 'rxjs/operators';

type DocumentPayload = {
  [key: string]: {
    document: number[];
    value: string;
    type: string;
    format: string;
  };
};

interface DocumentResponse {
  documents: {
    documentName: string;
    document: string;
    value: string;
    type: string;
    format: string;
    refNumber: string | null;
  }[];
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DemographicDetailsComponent,
    FormsModule,
    DocumentsUploadedComponent,
    HeaderComponent,
    MatProgressSpinnerModule,
    HttpClientModule

  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent implements OnInit {
  @ViewChild('scannerVideo', { static: false }) scannerVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('scannerCanvas', { static: false }) scannerCanvas!: ElementRef<HTMLCanvasElement>;
  private objectUrls: string[] = [];
  showScannerModal = false;
  showVideo = true;
  isInitializingCamera = false;
  scannerError = '';
  private stream: MediaStream | null = null;
  private currentScanIndex = 0;
  isLoading = false;
  demographicData: any;
  isChecked = false;
  role: string = '';
  photoBase64: string = '';
  isPhotoError = false;
  // Map document keys to readable titles
  categoryMap = CATEGORY_MAP;
  titleMap = TITLE_MAP;
  selectedTab: string = 'demographic'; // Default to 'demographic'
  escalateOption: boolean = false;
  showApprovalModal: boolean = false;
  showEscalateModal: boolean = false;
  isEditMode: boolean = false;
  closeEdit: boolean=false;
  saveChanges: boolean=false;
  showScheduleInterviewModal: boolean = false;
  showDocumentUploadModal: boolean = false;
  showRejectModal: boolean = false;
  showConfirmationModal: boolean = false;
  userAction: String = "";
  uploadDocumentSucessStatus : boolean = false;
  isOthersSelected: boolean = false;
  othersText: string = '';
  rowData: any = {};
  tempData:any={};
  fieldOrder = PERSONAL_INFO_FIELD_ORDER;
  residentField = RESIDENCE_INFO_FIELDS;
  birthField = BIRTH_INFO_FIELDS;
  originField = ORIGIN_INFO_FIELDS;
  citizenField = CITIZENSHIP_INFO_FIELDS;
  votingFields = POLLING_INFO_FIELDS;
  spouseField = SPOUSE_INFO_FIELDS;
  fatherField = FATHER_INFO_FIELDS;
  motherField = MOTHER_INFO_FIELDS;
  guardianField = GUARDIAN_INFO_FIELDS;
  childField = CHILD_INFO_FIELDS;
  declarantField = DECLARANT_INFO_FIELDS;
  enrollmentField = ENROLMENT_INFO_FIELDS;
  configData:any={};
  matchedRegIds : string[] = [];
  applicationStatus: string = '';
  interviewDetails = {
    subject: '',
    content: '',
    districtOffice: ''
  };
  allowedFields = [
    'surname',
    'givenName',
    'gender',
    'dateOfBirth',
    'NIN',
    'applicantPlaceOfOriginIndigenousCommunityTribe',
    'applicantPlaceOfOriginClan'
  ];
  relativeDocumentListByRole: Record<string, any[]> = {}; 
  demographicDataByRole: Record<string, Record<string, any>> = {};
  relativeDocumentList: any[] = [];
  currentDocument = {
    category: '',
    title: '',
    fileName: '',
    file: null as File | null // Allow both File and null
  };
  sectionsCop = [
    {
      id: 'copServices',
      label: 'COP Services',
      open: true,
      subSections: [
        { id: 'addingName', label: 'Adding a Name' },
        { id: 'removingName', label: 'Removing a Name' },
        { id: 'changeOrderOfNames', label: 'Change Order of Names' },
        { id: 'completeChangeofName', label: 'Complete Change of Name' },
        { id: 'changeOfDateOfBirth', label: 'Change of date of birth' },
        { id: 'changeInPlaceOfResidence', label: 'Change in place of Residence' },
        { id: 'changeInPlaceOfBirth', label: 'Change in place of Birth' },
        { id: 'changeInPlaceOfOrigin', label: 'Change in place of Origin' },
        { id: 'changeInCitizenshipType', label: 'Change in Citizenship Type' },
        { id: 'addSpouse', label: 'Adding a Spouse' },
        { id: 'removeSpouse', label: 'Removing a Spouse' },
        { id: 'changeDetailsOfFather', label: 'Change the Details of Father' },
        { id: 'changeDetailsOfMother', label: 'Change the Details of Mother' },
        { id: 'addingNamesFromPreviousCertorDoc', label: 'Adding Names from birth certificate, passport/ Academic documents' },
        { id: 'otherNameCorrections', label: 'Other Name Corrections' },
        { id: 'changeInGender', label: 'Change In Gender' }
      ]
    }
  ];
  sections = [
    {
      id: 'partA',
      label: 'Part - A',
      open: false,
      subSections: [
        { id: 'personal-info-section', label: 'Personal Information' },
        { id: 'place-of-residence-section', label: 'Place Of Residence' },
        { id: 'foundling-section', label: 'Foundling Check' },
        { id: 'place-of-birth-section', label: 'Place Of Birth' },
        { id: 'place-of-origin-section', label: 'Place of Origin' },
        { id: 'citizenship-details-section', label: 'Citizenship Details' },
      ],
    },
    {
      id: 'partB',
      label: 'Part - B',
      open: false,
      subSections: [
        { id: 'voter-info-section', label: 'Voters Information' },
        { id: 'marital-status-section', label: 'Marital Status' },
        { id: 'spouse-details-section', label: 'Spouse Details' },
      ],
    },
    {
      id: 'partC',
      label: 'Part - C',
      open: false,
      subSections: [
        { id: 'father-details-section', label: 'Fathers Details' },
        { id: 'mother-details-section', label: 'Mother Details' },
        { id: 'intoducer-details-section', label: 'Blood Relatives/Introducer Details' },
        { id: 'children-details-section', label: 'Particulars of Applicants Children' },
        { id: 'declarant-details-section', label: 'Declarants Details' },
        { id: 'place-of-enrolment-section', label: 'Place Of Enrollment' }
      ],
    },
    {
      id: 'partD',
      label: 'Part - D',
      open: false,
      subSections: [
        { id: 'signature-section', label: 'Signature' },
        { id: 'biometrics-collected-section', label: 'Biometrics Collected' }, 
      ],
    }
  ];
  fingerprintList: string[] = [
    'Left Thumb',
    'Left IndexFinger',
    'Left MiddleFinger',
    'Left RingFinger',
    'Left LittleFinger',
    'Right Thumb',
    'Right IndexFinger',
    'Right MiddleFinger',
    'Right RingFinger',
    'Right LittleFinger'
  ];
  
  irisList: string[] = ['Left', 'Right'];

  stageSpeciifcLabels: Record<string, string> = {
    'CITIZENSHIP_VERIFICATION' : 'CVS rejection reason',
    'BIO_DEDUPE' : 'Biometric Deduplication rejection reason'
  };
  extractedStageName: string = '';
  extractedComment: string = '';
  commentLabel: string = 'Rejection reason';

  expandedSections: { [key: string]: boolean } = {};
  activeTab: string = 'history'; // Default tab is 'history'
  service: string = '';
  serviceType: string = '';
  statusComment: string = '';    //to store CVS rejection comment.
  enrollmentOfficerComment: string =''; ////to store enrollment officer comment.
  approvalComment: string = '';
  applicationId: string = '';
  commentMVSOfficer: string = '';
  commentMVSSupervisor: string = '';
  dropdownOptions: { value: string; label: string; default: boolean }[] = [];
  rejectionCategories: { value: string; default: boolean }[] = [];
  escalationCategories: { value: string; default: boolean }[] = [];
  selectedEscalationCategories: string[] = [];
  isEscalationDropdownOpen: boolean = false;
  selectedOfficerLevel: string = '';
  //escalationCategory: string = '';
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';
  rejectedByOfficerRole: string = '';
  rejectedByOfficerId: string = '';
  rejectionTimeStamp!: Date;
  isSectionExpanded: boolean[] = []; // Tracks expanded/collapsed states for each section
  ageGroup: string ='';
  foundling: string = '';
  // Added: State variables for left and right section collapse
  isLeftCollapsed: boolean = true;
  isRightCollapsed: boolean = true;
  isEditable: boolean = false;
  isEscalated: boolean= false;
  selectedRow: any = {};
  documents: { category: string; title: string; fileName: string; file: File | SafeResourceUrl | null }[] = [
    { category: '', title: '', fileName: '', file: null }
  ];
  additionalDocuments: { category: string; title: string; fileName: string; file: File | SafeResourceUrl | null }[] = [
    { category: '', title: '', fileName: '', file: null }
  ];

additionalFetchedDocuments: { category: string; title: string; fileName: string; file: SafeResourceUrl | null }[] = [];
  personDetails: { role: string; details: { [key: string]: any } }[] = []; // Store details for Father, Mother, Guardian
  constants = {
    MVS_OFFICER,
    MVS_DISTRICT_OFFICER,
    MVS_LEGAL_OFFICER,
    MVS_EXECUTIVE_DIRECTOR,
    APPLICATION_ID,
    SERVICE,
    SERVICE_TYPE,
    ESCALATION_REASON_FROM_MVS_OFFICER,
    ESCALATION_REASON_FROM_MVS_SUPERVISOR,
    APPLICATION_STATUS,
    DEMOGRAPHIC_DETAILS,
    DOCUMENTS_UPLOADED,
    AUTO_RETRIEVE_NIN_DETAILS,
    BACK,
    APPROVE,
    REJECT,
    ESCALATE,
    SCHEDULE_INTERVIEW,
    UPLOAD_DCOUMENTS: 'Upload Documents',
    APPLICANT_NAME,
    MVS_INTERNATIONAL_OFFICER,
    CHANGE_OF_PARTICULARS,
    SERVICE_CONST_MIGRATION,
    SERVICE_CONST_NEW_REGISTRATION,
    SERVICE_CONST_RENEWAL,
    Modify_DETAILS
  }
  
  // Sample Data
  //Offices: string[] = ['District Office 1', 'District Office 2', 'District Office 3'];
  // Create an array of objects mapping keys to titles
  // docCategories = Object.entries(this.categoryMap).map(([key, value]) => ({
  //   key,
  //   title: value,
  // }));
  // docTitles = Object.entries(this.titleMap).map(([key, value]) => ({
  //   key,
  //   title: value,
  // }));
  docCategories : { key: string; title: string }[] = [];
docTitles:any;
  pdfUrl: any;
  formattedDate: string | ' ' = ' ';
  cachedDemographicsData: Record<string, any> = {}; 
  districtOfficeName!: string;
  districtOfficeId!: number;

  constructor(private router: Router, private dataService: DataStorageService,
    private sanitizer: DomSanitizer, private snackBar: MatSnackBar,private ngZone: NgZone
  ) { }

  originalDetails: any = {};
  modifiedDetails: any={};
 

  ngOnInit() {
    const state = history.state;
    //fetch the created date and save it in to display in the ui
    const date = new Date(state.rowData.crDTimes);
    this.formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
      .format(date)
      .replace(/\//g, '-')
      .replace(',',''); 

    this.role = state.role || '';
    this.rowData = state.data || {};
    this.selectedRow = state.rowData || {};
    this.photoBase64 = this.rowData?.biometricAttributes?.ApplicantPhoto?.trim() || '';
    if (this.role === MVS_DISTRICT_OFFICER || this.role === MVS_LEGAL_OFFICER || this.role === MVS_INTERNATIONAL_OFFICER || this.role === MVS_EXECUTIVE_DIRECTOR) {
      this.applicationStatus = this.selectedRow.status;
    }
    this.serviceType = this.rowData.serviceType || '';
    this.applicationId = this.rowData.applicationId || '';
    this.service = this.rowData.service || '';
    if (this.service === this.constants.SERVICE_CONST_MIGRATION && this.rowData?.demographics?.userService === this.constants.SERVICE_CONST_NEW_REGISTRATION) {
      this.rowData.demographics.userService = this.constants.SERVICE_CONST_RENEWAL;
    }
    this.statusComment = this.rowData.statusComment || '';
    if(this.statusComment.includes('::')){
      const parts = this.statusComment.split('::');
      this.extractedStageName = parts[0];
      this.extractedComment = parts[1];

      this.commentLabel = this.stageSpeciifcLabels[this.extractedStageName] || 'Rejection reason';
    }
    this.enrollmentOfficerComment = (() => {
      const rawComment = this.rowData?.demographics?.enrollmentOfficerComment;
      if (!rawComment) return ''; // Handles null, undefined, or empty cases
      try {
        return JSON.parse(rawComment)?.[0]?.value || '';
      } catch (error) {
        console.error('Error parsing enrollmentOfficerComment:', error);
        return '';
      }
    })();
    this.commentMVSOfficer = this.rowData[ESCALATION_COMMENT_FROM_MVS_OFFICER] || '';
    this.commentMVSSupervisor = this.rowData[ESCALATION_COMMENT_FROM_MVS_SUPERVISOR] || '';
    this.ageGroup = this.rowData.ageGroup || '';
    this.foundling = this.rowData.foundLink || '';
    this.checkPersonDetails();
    this.setDropdownOptions();
    
    this.dataService.getConfig().pipe(
      map((configs: any) => ({ configs, role: this.role }))
    ).subscribe(result => {
      this.configData = result;        // store in the component variable
      console.log('Stored config:', this.configData);
      this.setEscalationCategories();
      this.setRejectionCategories();
    });
    // Check if the rowData contains documents and process them
    if (this.rowData?.documents) {
      this.processDocuments();
    } else {
      console.log('No documents found in the API response.');
    }
    this.isSectionExpanded = this.documents.map(() => false);
    this.updateCategoriesAndTitles();

    const storedDetails = localStorage.getItem('rejectionDetails');

    if (storedDetails) {
      const rejectionDetails = JSON.parse(storedDetails);
      this.rejectedByOfficerRole = rejectionDetails.rejectedByOfficerRole;
      this.rejectionCategory = rejectionDetails.rejectionCategory;
      this.rejectionComment = rejectionDetails.rejectionComment;
      this.rejectedByOfficerId = rejectionDetails.rejectedByOfficerId;
      this.rejectionTimeStamp = rejectionDetails.rejectionTimeStamp;
    }
    this.uploadDocumentSucessStatus = localStorage.getItem(`uploadSuccess_${this.applicationId}`) === 'true';
    // Check if there are upload documents to fetch
  if (this.role === 'MVS_SENIOR_REGISTRATION_OFFICER' && this.rowData?.uploadDocList && this.rowData.uploadDocList.length > 0) {
    this.fetchAdditionalDocuments(this.rowData.uploadDocList, this.rowData.applicationId);
  }
  
  this.districtOfficeName = localStorage.getItem('districtOfficeName') || '';
  console.log("Districtoffice name " +this.districtOfficeName);
  this.districtOfficeId = parseInt(localStorage.getItem('districtOfficeId') || '0', 10);

  this.matchedRegIds = this.selectedRow.matchedRegIds || [];
  }
  // Update the docCategories and docTitles based on selectedService and selectedServiceType
updateCategoriesAndTitles() {
   if(this.service === 'Change of Particulars'){
    const serviceTypeCop = this.getVisibleSectionsCop();
    let categories: string[] = [];
    serviceTypeCop.forEach(service => {
      service.subSections.forEach(serviceType => {
        const categoryList = SERVICE_CATEGORY_MAP[this.service]?.[serviceType.id] || [];
        categories = categories.concat(categoryList);
      });
    });
    this.docCategories = categories.map(key => ({
      key,
      title: CATEGORY_MAP[key]
    }));
    return;
  }
  else if(this.foundling === 'Y'){
    const categories = SERVICE_CATEGORY_MAP[this.service]?.['Registration of foundlings'] || [];
    this.docCategories = categories.map(key => ({
      key,
      title: CATEGORY_MAP[key]
    }));
    return;
  }
  else if(this.ageGroup === 'MINOR'){
    const categories = SERVICE_CATEGORY_MAP[this.service]?.['Registration of child citizen'] || [];
    this.docCategories = categories.map(key => ({
      key,
      title: CATEGORY_MAP[key]
    }));
    return;
  }
  else{
    const categories = SERVICE_CATEGORY_MAP[this.service]?.[this.serviceType] || [];
    this.docCategories = categories.map(key => ({
      key,
      title: CATEGORY_MAP[key]
    }));
  }
}


getTitlesForDocument(document: any): string[] {
  const categoryKey = document.category;
  if(this.service === 'Change of Particulars'){
    // For Change of Particulars, we need to check all visible COP services
    const serviceTypeCop = this.getVisibleSectionsCop();
    let allTitles: string[] = [];

    serviceTypeCop.forEach(service => {
      service.subSections.forEach(serviceType => {
        const titles = SERVICE_TITLE_MAP[this.service]?.[serviceType.id]?.[categoryKey] || [];
        allTitles = allTitles.concat(titles);
      });
    });

    // Remove duplicates and return
    return [...new Set(allTitles)];
  }
  else if(this.ageGroup === 'MINOR'){
    return SERVICE_TITLE_MAP[this.service]?.['Registration of child citizen']?.[categoryKey] || [];
  }
  else if(this.foundling === 'Y'){
    return SERVICE_TITLE_MAP[this.service]?.['Registration of foundlings']?.[categoryKey] || [];
  }
  else{
    return SERVICE_TITLE_MAP[this.service]?.[this.serviceType]?.[categoryKey] || [];
  }
  
}

  convertBase64ToPdfUrl(base64: string): SafeResourceUrl {
    // Decode Base64 string to a byte array
    const byteCharacters = atob(base64.split(',')[1] || base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' });

    this.pdfUrl = URL.createObjectURL(blob);

    // Use Angular's DomSanitizer to sanitize the URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }
  onImageError() {
    this.isPhotoError = true;
    console.error('Image failed to load:', this.photoBase64);
  }
  
  toggleRightSection(sectionId: string): void {
    this.sections = this.sections.map((section) =>
      section.id === sectionId ? { ...section, open: !section.open } : section
    );
  }
  // Process the documents data into the required structure
  processDocuments() {
    const documents = this.rowData?.documents || {};

    this.documents = Object.keys(documents).map((key) => {
      const base64Data = documents[key]?.trim();
      let safeUrl: SafeResourceUrl | null = null;

      if (base64Data) {
        // Detect file type based on base64 header
        if (base64Data.startsWith('JVBERi0')) {
          // PDF file
          safeUrl = this.convertBase64ToPdfUrl(base64Data);
        } else if (base64Data.startsWith('TU0AKg') || base64Data.startsWith('SUkqAA')) {
          // TIFF file - create download blob
          console.log('TIFF detected for:', key);
          safeUrl = this.createTiffDownloadUrl(base64Data);
        } else if (base64Data.startsWith('iVBORw0K')) {
          // PNG file
          safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${base64Data}`);
        } else if (base64Data.startsWith('/9j/')) {
          // JPEG file
          safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${base64Data}`);
        } else {
          // Unknown format - treat as PDF (fallback)
          safeUrl = this.convertBase64ToPdfUrl(base64Data);
        }
      }

      return {
        category: key,
        title: this.getDocumentTitle(key),
        fileName: `${key}.${this.getFileExtension(base64Data || '')}`,
        file: safeUrl,
      };
    });

    this.isSectionExpanded = this.documents.map(() => false);
  }


  private createTiffDownloadUrl(base64Data: string): SafeResourceUrl {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'image/tiff' });
      const blobUrl = URL.createObjectURL(blob);

      // Store for cleanup
      this.storeObjectUrlForCleanup(blobUrl);

      // Return special marker for TIFF files
      return this.sanitizer.bypassSecurityTrustResourceUrl(`tiff-download:${blobUrl}`);
    } catch (error) {
      console.error('Error creating TIFF blob:', error);
      // Fallback to data URL
      return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/tiff;base64,${base64Data}`);
    }
  }

  private getFileExtension(base64Data: string): string {
    if (!base64Data) return 'pdf';
    if (base64Data.startsWith('JVBERi0')) return 'pdf';
    if (base64Data.startsWith('iVBORw0K')) return 'png';
    if (base64Data.startsWith('/9j/')) return 'jpg';
    if (base64Data.startsWith('TU0AKg') || base64Data.startsWith('SUkqAA')) return 'tiff';
    return 'pdf'; // Default fallback
  }

  private storeObjectUrlForCleanup(url: string) {
    this.objectUrls.push(url);
  }
  getDocumentTitle(key: string): string {
    if (key === PROOF_OF_PHYSICAL_APPLICATION_FORM && this.service && FORM_LABELS_BY_SERVICE[this.service]) {
      return FORM_LABELS_BY_SERVICE[this.service];
    }
    return this.categoryMap[key] || 'Unknown Document';
  }
  // Added: Methods to toggle left and right sections
  toggleLeft() {
    this.isLeftCollapsed = !this.isLeftCollapsed;
  }

  toggleRight() {
    this.isRightCollapsed = !this.isRightCollapsed;
  }
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }
  isEscalationExpanded(section: string): boolean {
    return this.expandedSections[section] || false;
  }

  toggleEscalation(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
  checkPersonDetails() {
    const allowedFields = [
      'Surname',
      'GivenName',
      'DateOfBirth',
      'NIN_AIN',//added for guardian
      'NIN',
      'IndigenousCommunityTribe',
      'Clan'
    ];
    const allowedFieldsLowerCase = allowedFields.map((field) => field.toLowerCase());
    let roles;
    if(this.service === 'Change of Particulars') roles = ['NIN'];
    else roles = ['father', 'mother', 'guardian'];
    console.log(this.rowData.demographics)
    this.personDetails = roles
      .map((role) => {
        let ninKey;
        if(this.service === 'Change of Particulars') ninKey = role;
        else ninKey = role === 'guardian' ? `${role}NIN_AIN` : `${role}NIN`;
        if (this.rowData?.demographics?.[ninKey]) {
          console.log(this.rowData.demographics[ninKey] + "exist")
          // If NIN exists for the person, collect all details related to the role
          let personData;
          if (this.service === 'Change of Particulars') {
            personData = Object.keys(this.rowData.demographics).reduce(
              (acc: { [key: string]: any }, key) => {
                // Check if the field (case-insensitive) is in the allowed list
                if (allowedFieldsLowerCase.includes(key.toLowerCase())) {
                  acc[key] = this.rowData.demographics[key]; // Add key-value pair to the accumulator
                }
                return acc;
              },
              {}
            );
          }
          else {
            personData = Object.keys(this.rowData.demographics)
            .filter((key) => key.startsWith(role)) // Match keys starting with the role (e.g., father)
            .reduce((acc: { [key: string]: any }, key) => {
              const field = key.replace(role, '');
              if (allowedFieldsLowerCase.includes(field.toLowerCase())) {    //only adding specified fields in records of father, mother, guardian
              acc[key] = this.rowData.demographics[key]; // Add key-value pair to the accumulator
              }
              return acc;
            }, {});
          }
          
        const sortedPersonData = Object.keys(personData)
        .sort((a, b) => {
          const fieldA = a.replace(role, '').toLowerCase();
          const fieldB = b.replace(role, '').toLowerCase();
          return allowedFieldsLowerCase.indexOf(fieldA) - allowedFieldsLowerCase.indexOf(fieldB);
        })
        .reduce((acc: { [key: string]: any }, key) => {
          acc[key] = personData[key];
          return acc;
        }, {});
          return { role, details: sortedPersonData  };
        }
        return null;
      })
      .filter((person) => person !== null); // Remove null entries
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  changeApplicationStatus(status: string, comment: string = '', rejectionCategory: string = '', selectedOfficerLevel?: string) {
    const applicationId = this.rowData.applicationId;
    this.dataService
      .changeStatus(applicationId, status, comment, rejectionCategory, selectedOfficerLevel)
      .subscribe(
        (response : any) => {
          if (response?.errors?.length > 0) {
            // Extract the first error message from the API response
            const errorMessage = response.errors[0].message;
            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['center-snackbar'],
            });
          } else {
          let statusMsg = '';
          if(status == API_CONST_REJECT) statusMsg = 'Application REJECTED successfully.';
          else if(status === API_CONST_RECOMMEND_FOR_APPROVAL) statusMsg = 'Application RECOMMENDED FOR APPROVAL successfully.';
          else statusMsg = `Application ${status}D successfully.`
          this.snackBar.open(statusMsg, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          
          this.router.navigate(['/application-list'], {state: { role: this.role }});
        }
        },
        (error) => {
          console.error('Error updating status:', error);
          this.snackBar.open('Failed to update status. Please try again', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        });
  }
  setDropdownOptions() {
    let isInUganda = true;
    let residenceStatusExists = false;
    try {
      const residenceStatus = this.rowData?.demographics?.residenceStatus;
      if (residenceStatus) {
        residenceStatusExists = true;
        const parsedStatus = typeof residenceStatus === 'string'
          ? JSON.parse(residenceStatus)
          : residenceStatus;

        if (Array.isArray(parsedStatus) && parsedStatus.length > 0) {
          const status = parsedStatus[0]?.value || '';
          isInUganda = status === 'In Uganda';
        } else if (parsedStatus?.value) {
          isInUganda = parsedStatus.value === 'In Uganda';
        }
      }
    } catch (error) {
      console.error('Error parsing residence status:', error);
      residenceStatusExists = false;
    }
    // Set the appropriate officer title based on residence status
    let districtOrInternational;

    if(!residenceStatusExists) {
      //if residence status is null undefined then check from nin
      districtOrInternational = {
        value : 'MVS_DISTRICT_OR_INTERNATIONAL_OFFICER_ROLE',
        label : 'District/ International Officer',
        default : false
      };
    } else {
      //residence status exist in packet
      districtOrInternational = isInUganda
      ? { value: 'MVS_DISTRICT_OFFICER', label: 'District', default: false }
      : { value: 'MVS_INTERNATIONAL_OFFICER', label: 'International Officer', default: false };
    }
    
    switch (this.role) {
      case 'MVS_OFFICER':
        this.dropdownOptions = [
          { value: 'MVS_SUPERVISOR', label: 'Supervisor', default: true },
          districtOrInternational,
          { value: 'MVS_LEGAL_OFFICER', label: 'Legal', default: false }
        ];
        this.selectedOfficerLevel = 'MVS_SUPERVISOR';
        break;
      case 'MVS_SUPERVISOR':
        this.dropdownOptions = [
          districtOrInternational,
          { value: 'MVS_LEGAL_OFFICER', label: 'Legal', default: false },
          { value: 'MVS_MANAGER', label: 'Manager', default: false } 
        ];
        this.selectedOfficerLevel = !residenceStatusExists
          ?'MVS_DISTRICT_OR_INTERNATIONAL_OFFICER_ROLE'
          :'MVS_DISTRICT_OFFICER';
        break;
      case 'MVS_DISTRICT_OFFICER':
        this.dropdownOptions = [
          { value: 'MVS_LEGAL_OFFICER', label: 'Legal', default: true }
        ];
        this.selectedOfficerLevel = 'MVS_LEGAL_OFFICER';
        break;
      case 'MVS_LEGAL_OFFICER':
        this.dropdownOptions = [
          { value: 'MVS_EXECUTIVE_DIRECTOR', label: 'Executive Director', default: true },
          { value: 'MVS_MANAGER', label: 'Manager', default: false } 
        ];
        this.selectedOfficerLevel = 'MVS_EXECUTIVE_DIRECTOR';
        break;
      default:
        this.dropdownOptions = [];
        this.selectedOfficerLevel = '';
    }
  }

  // setRejectionCategories() {
  //   switch(this.service) {
  //     case 'New registrations':
  //       this.rejectionCategories = NEW_REJECTION_CATEGORIES;
  //       break;
  //     case 'Change of Particulars':
  //       this.rejectionCategories = COP_REJECTION_CATEGORIES;
  //       break;
  //     case 'Renewal of card':
  //       this.rejectionCategories = RENEWAL_REJECTION_CATEGORIES;
  //       break;
  //     case 'GetFirst ID':
  //       this.rejectionCategories = GETFIRSTID_REJECTION_CATEGORIES;
  //       break;
  //     case 'Replacement of card':
  //       this.rejectionCategories = LR_REJECTION_CATEGORIES;
  //       break;
  //   }
  // }
   setRejectionCategories(){
     this.rejectionCategories =[]
     if (
        !this.configData ||
        !this.configData.configs.response ||
        !this.configData.configs.response.rejection_CATEGORIES
      ) {
        return;
      }
      // console.log("reject-conf",this.configData.configs.response.rejection_CATEGORIES);
      const rejectionConfig = this.configData.configs.response.rejection_CATEGORIES;

        const matchingKeys = Object.keys(rejectionConfig).filter(key =>
        rejectionConfig[key].some((val:string) => this.service.includes(val))
      );
      // Map keys to objects { value, default }
      this.rejectionCategories = matchingKeys.map((key, index) => ({
        value: key,
        default: index === 0 // mark first one as default
      }));
      
   }
  // setEscalationCategories() {
  //   switch(this.service) {
  //     case 'New registrations':
  //       if (this.role === MVS_OFFICER) this.escalationCategories = NEW_ESCALATION_CATEGORIES_FOR_OFFICER;
  //       else this.escalationCategories = NEW_ESCALATION_CATEGORIES;
  //       break;
  //     case 'Renewal of card':
  //       if (this.role === MVS_OFFICER) this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER;
  //       else this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES;
  //       break;
  //       case 'GetFirst ID':
  //         this.escalationCategories = GETFIRSTID_ESCALATION_CATEGORIES;
  //         break;
  //       case 'Replacement of card':
  //         this.escalationCategories = LR_ESCALATION_CATEGORIES;
  //         break;
  //       case 'Change of Particulars':
  //         this.escalationCategories = COP_ESCALATION_CATEGORIES;
  //         break;
  //       case 'Migration':
  //       if (this.role === MVS_OFFICER) this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER;
  //       else this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES;
  //       break;
  //   }  
  // }
     
    setEscalationCategories() {
      this.escalationCategories = [];
      if (
        !this.configData ||
        !this.configData.configs.response ||
        !this.configData.configs.response.escalation_CATEGORIES
      ) {
        return;
      }

      const escalationConfig = this.configData.configs.response.escalation_CATEGORIES;
      // console.log("escalationConfig", escalationConfig);

      const isOfficer = this.role === MVS_OFFICER && [
        'New registrations',
        'Renewal of card',
        'Migration'
      ].includes(this.service);

      // Normalize the service string to match exactly the values in the arrays
      let serviceNamesToMatch = [this.service];
      let servicename=this.service;
      if(this.service==='Migration'){
        serviceNamesToMatch=['Renewal of card'];
        servicename='Renewal of card';
      }
      if (isOfficer) {
        serviceNamesToMatch=[`${servicename} officer`];
      }
       // Collect all keys whose array contains any of the serviceNamesToMatch
      const matchingKeys = Object.keys(escalationConfig).filter(key =>
        escalationConfig[key].some((val:string) => serviceNamesToMatch.includes(val))
      );
      // Map keys to objects { value, default }
      this.escalationCategories = matchingKeys.map((key, index) => ({
        value: key,
        default: index === 0 // mark first one as default
      }));
    }


  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
  goBack() {
    const applicationType = history.state.applicationType || 'Assigned';
    this.router.navigate(['/application-list'], {
      state: { role: this.role, data: history.state.data, applicationType: applicationType }
    });
  }
  openApprovalModal() {
    this.showApprovalModal = true;
  }
  openEscalateModal() {
    console.log('Escalate Modal Opened');
    this.showEscalateModal = true;
  }
  confirmAndModify(){
    const isConfirmed = window.confirm('Are you sure you want to modify this record?');
     if (isConfirmed) {
      this.openModifyModule();
      this.closeEdit=true;
      this.saveChanges=true;
    }
  }

  openModifyModule(){
    this.isEditMode = true;
    this.originalDetails = JSON.parse(JSON.stringify(this.rowData.demographics));
    this.tempData = JSON.parse(JSON.stringify(this.rowData.demographics));
    this.modifiedDetails = JSON.parse(JSON.stringify(this.originalDetails)); 
    Object.keys(this.modifiedDetails).forEach(key => {
    this.modifiedDetails[key] = this.normalizeValue(this.modifiedDetails[key]);
    });
    Object.keys(this.originalDetails).forEach(key => {
    this.originalDetails[key] = this.normalizeValue(this.originalDetails[key]);
    });
  }

  normalizeValue(value: any): any {
  // Already array → return
  if (Array.isArray(value)) return value;
  // Already object → return
  if (typeof value === 'object' && value !== null) return value;
  // If it's a string, try JSON.parse
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      // If parsed is array of objects → return as array
      if (Array.isArray(parsed)) return parsed;
      // If parsed is plain value → return it directly
      return parsed;
    } catch {
      // Not JSON, just a raw string → keep it
      return value;
    }
  }
  // For numbers, booleans, null → keep as-is
  return value;
}

  cancelModefy(){
    const confirmDiscard = window.confirm("Do you really want to discard the modifications?");
    if(confirmDiscard){
    this.closeEdit=false;
    this.isEditMode=false;
    this.saveChanges=false;
    return;
    }
  }

  saveandcloseModify(){
    const hasChanges = JSON.stringify(this.modifiedDetails) !== JSON.stringify(this.originalDetails);
    if (!hasChanges) {
    this.snackBar.open('No changes detected to save.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['center-snackbar'],
    });
    return;
  }
    const confirmSave = confirm("Do you really want to save the modifications?");
    if (confirmSave) {
    this.isEditMode = false;
    this.closeEdit=false;
    this.saveChanges=false;
    const denormalized: any = {};
    Object.keys(this.modifiedDetails).forEach(key => {
    const val = this.modifiedDetails[key];
    denormalized[key] = Array.isArray(val) || (val?.value !== undefined)
    ? JSON.stringify(val)
    : val;
    });
    // console.log('denormalozed ', denormalized);
    // console.log('rowData', this.rowData);
    this.tempData.demographics = denormalized;
    // console.log('Modified rowdata', this.rowData);
    const changes = this.getChangedFields(this.originalDetails, this.modifiedDetails);
    this.saveModifiedRowData(changes,this.rowData);
    this.snackBar.open('Modifications initiated.', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['center-snackbar'],
    });
  }
  }

  private getChangedFields(original: any, modified: any): any {
  const changes: any = {};

  Object.keys(modified).forEach(key => {
    if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
      changes[key] = modified[key];
    }
  });

  return changes;
  }

 saveModifiedRowData(changes: any,rowData: any){
    this.dataService.saveModifiedRow(changes, rowData).subscribe(
  (response) => {
    const hasErrors = response?.errors && response.errors.length > 0;
    const message = response?.errors?.[0]?.message || response?.message || 'Modifications saved successfully.';
    this.ngZone.run(() => {
      this.snackBar.open(message, 'Close', { duration: 3000 });
        if (!hasErrors) {
          this.rowData.demographics = this.tempData.demographics;
        }
    });
    
  },
  (error) => {
    this.ngZone.run(() => {
      this.snackBar.open('Failed to save modifications. Please try again.', 'Close', { duration: 3000 });
    });
  }
);
  } 

  closeEscalateModal() {
    this.showEscalateModal = false;
    this.isEscalationDropdownOpen = false;
  }

  openScheduleInterviewModal() {
    this.showScheduleInterviewModal = true;
  }
  closeScheduleInterviewModal() {
    this.showScheduleInterviewModal = false;
  }

  openDocumentUploadwModal() {
    this.showDocumentUploadModal = true;
    
  }
  closeDocumentUploadModal() {
    this.showDocumentUploadModal = false;
  }

  openRejectModal() {
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
  }
  closeApprovalModal() {
    this.showApprovalModal = false;
  }

  openConfirmationModal(action: String) {
    this.userAction = action;

    switch(action) {
      case "APPROVE" :
        this.closeApprovalModal();
        break;
      case "REJECT" :
        this.closeRejectModal();
        break;
      case "ESCALATE" :
        this.closeEscalateModal();
        break;
    }
    
    this.showConfirmationModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
    this.selectedEscalationCategories = [];
    this.isEscalationDropdownOpen = false;
    this.escalationComment = '';
    this.isOthersSelected = false;
    this.othersText = '';
  }

  confirmAction() {
    switch(this.userAction) {
      case "APPROVE":
        this.approveApplication();
        break;
      case "REJECT":
        this.rejectApplication();
        break;
      case "ESCALATE":
        this.escalateApplication();
        break;
    }
  }

  approveApplication() {
    // Approval logic
    if (this.isChecked) {
      this.showApprovalModal = false;
      const comment = this.approvalComment.trim();
      debugger
      if((this.role === 'MVS_DISTRICT_OFFICER' || this.role === 'MVS_INTERNATIONAL_OFFICER') && (this.uploadDocumentSucessStatus)){
        debugger
        this.changeApplicationStatus(API_CONST_RECOMMEND_FOR_APPROVAL, comment);
        this.closeApprovalModal();
        return;
      }
      this.changeApplicationStatus(API_CONST_APPROVE, comment);
      this.closeApprovalModal();
    }
  }
  escalateApplication() {
    // Escalate logic 
    this.showConfirmationModal = false;
    const comment = this.escalationComment.trim();
    const categoriesString = this.selectedEscalationCategories.join(', ');
    this.changeApplicationStatus(API_CONST_ESCALATE, comment, categoriesString, this.selectedOfficerLevel);
    this.closeConfirmationModal();
  }

  rejectApplication() {
    // Reject logic 
    debugger
    this.showRejectModal = false;
    const rejectionCategory = this.rejectionCategory;
    const comment = this.rejectionComment.trim();
    this.changeApplicationStatus(API_CONST_REJECT, comment, rejectionCategory);
    this.closeRejectModal();
  }
  // Method to change tabs
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  // Check if the form is valid
  isFormValid(): boolean {
    const { subject, content, districtOffice } = this.interviewDetails;
    return subject.trim() !== '' && content.trim() !== ''
    
  }

  // Send invite logic
  sendInvite() {
    if (this.isFormValid()) {
      console.log('Sending Invite:', this.interviewDetails);
      const applicationId = this.rowData.applicationId;
      this.dataService.scheduleInterview(applicationId, this.interviewDetails)
        .subscribe(
          (response: any) => {
            if (response?.response?.status === "Success") {
              this.snackBar.open('Interview scheduled successfully', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['center-snackbar'],
              });
              this.closeScheduleInterviewModal();
              this.router.navigate(['/application-list'], {
                state: { role: this.role, data: history.state.data }
              });
            } else {
              this.snackBar.open('Failed to schedule the interview. Please try again.', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['center-snackbar'],
              });
            }
          },
          (error) => {
            console.error('Error scheduling interview:', error);
            this.snackBar.open('An error occurred while scheduling the interview. Please try again later.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['center-snackbar'],
            });
          });
    } else {
      this.snackBar.open('Please fill all the required fields.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }
  
  viewDocument(document: { file: File | SafeResourceUrl | null, category?: string }): void {
    if (document.file) {
      console.log('Viewing document:', document.category);

      const sanitizedUrl = this.sanitizer.sanitize(4, document.file);
      if (!sanitizedUrl) {
        this.snackBar.open('Invalid or unsafe URL for the document.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
        return;
      }

      const documentTitle = document.category ? this.getDocumentTitle(document.category) : 'Document';

      // Check if this is a TIFF download URL
      if (sanitizedUrl.startsWith('tiff-download:')) {
        const blobUrl = sanitizedUrl.replace('tiff-download:', '');
        this.openTiffViewer(documentTitle, blobUrl);
        return;
      }

      // Handle scanned documents (File objects)
      if (document.file instanceof File) {
        const objectUrl = URL.createObjectURL(document.file);
        const newWindow = window.open(objectUrl, '_blank');
        if (!newWindow) {
          this.snackBar.open('Unable to open a new window. Please check your browser settings.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
        return;
      }

      // Handle other document types (PDF, images)
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe src="${sanitizedUrl}" width="100%" height="100%" frameborder="0"></iframe>
          </body>
        </html>
      `);
        newWindow.document.close();
      } else {
        this.snackBar.open('Unable to open a new window. Please check your browser settings.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    } else {
      this.snackBar.open('Document is not available.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }

  private openTiffViewer(documentTitle: string, blobUrl: string): void {
    const windowName = `tiff_viewer_${documentTitle}`.replace(/[^a-zA-Z0-9]/g, '_');
    const newWindow = window.open('about:blank', windowName);

    if (newWindow) {
      newWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f5f5f5;
              margin: 0;
              padding: 40px;
              text-align: center;
            }
            .container {
              background: white;
              max-width: 500px;
              margin: 0 auto;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
              font-size: 24px;
            }
            .message {
              color: #666;
              margin-bottom: 30px;
              font-size: 16px;
              line-height: 1.5;
            }
            .download-btn {
              background: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
              font-size: 16px;
              margin: 20px 0;
            }
            .download-btn:hover {
              background: #0056b3;
              text-decoration: none;
              color: white;
            }
            .file-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
              color: #666;
              font-size: 14px;
            }
            .help-text {
              color: #888;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📄 ${documentTitle}</h1>
            
            <div class="message">
              This is a TIFF image file. TIFF files may not display properly in web browsers, so we've prepared it for download.
            </div>

            <a href="${blobUrl}" download="${documentTitle}.tiff" class="download-btn">
              📥 Download TIFF File
            </a>

            <div class="file-info">
              <strong>File:</strong> ${documentTitle}.tiff
            </div>

            <div class="help-text">
              You can open TIFF files with most image viewers, Microsoft Office, or photo editing software.
            </div>
          </div>
        </body>
      </html>
    `);
      newWindow.document.close();
    } else {
      // Fallback: direct download if popup is blocked
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${documentTitle}.tiff`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.snackBar.open('TIFF file download started. Please check your downloads folder.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }

  // Handle file selection
  onFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.documents[index].fileName = file.name;
      this.documents[index].file = file;
    }
  }

  // Add a new document row
  addDocumentRow() {
    console.log("add doc row")
    this.additionalDocuments.push({ category: '', title: '', fileName: '', file: null });
  }

  deleteDocumentRow(index: number) {
    this.additionalDocuments.splice(index, 1);
  }

  triggerFileSelect(index: number) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.png,.jpg';
    fileInput.style.display = 'none';

    fileInput.onchange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        this.additionalDocuments[index].fileName = file.name;
        this.additionalDocuments[index].file = file;
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.remove();
  }

  async triggerScan(index: number) {
    this.currentScanIndex = index;
    
    // Check if device supports camera and  access camera
    if (await this.isCameraSupported()) {
      // Desktop/tablet with camera 
      this.openScannerModal();
    } else {
      // Mobile device or no camera API support - fallback to file input
      this.triggerMobileScan(index);
    }
  }

  previewFile(file: File | SafeResourceUrl) {
    if (file instanceof File) {
      const fileURL = URL.createObjectURL(file);

      if (file.type.startsWith('image/')) {
        const imageWindow = window.open(fileURL, '_blank');
        if (!imageWindow) {
          this.snackBar.open('Unable to preview the image.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      } else if (file.type === 'application/pdf') {
        const pdfWindow = window.open(fileURL, '_blank');
        if (!pdfWindow) {
          this.snackBar.open('Unable to preview the PDF.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      } else {
        this.snackBar.open('Preview is not supported for this file type.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    } else {
      this.snackBar.open('Invalid file type for preview.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }

  isValidDocumentList(documents: any[]): boolean {
    const seenTitles = new Set();
    const seenCategories = new Set();
  
    for (const doc of documents) {
      if (!doc.title || !doc.category) {
        continue; //edge case - no doc entry
      }
  
      // Check if title already exists
      if (seenTitles.has(doc.title)) {
        return false; // Duplicate title found
      }
      seenTitles.add(doc.title);
  
      // Check if category already exists
      if (seenCategories.has(doc.category)) {
        return false; // Duplicate category found
      }
      seenCategories.add(doc.category);
    }
  
    return true; // No duplicates found
  }
  
  


  // Confirm and approve action
  confirmAndUpload() {
    // Check if document list is empty or contains only invalid (null) documents
    const hasValidDocument = this.additionalDocuments?.some(
      (doc) => doc.file && doc.fileName && doc.category
    );

    if (!hasValidDocument) {
      this.snackBar.open('No valid document selected. Please upload at least one valid document.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
      return;
    }

    // Validate document list before proceeding
    if (!this.isValidDocumentList(this.additionalDocuments)) {
      this.snackBar.open('Warning: Multiple uploads of the same document are restricted.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
      return;
    }
    // Check file size for each document
    for (const doc of this.additionalDocuments) {
      if (doc.file instanceof File && doc.file.size > MAX_DOC_SIZE) { // 2 MB = 2 * 1024 * 1024 bytes
        this.snackBar.open(`File size for '${doc.fileName}' exceeds 2 MB. Please upload a smaller file.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
        return; 
      }
    }

    const payload: {
      id: string;
      version: string;
      requesttime: string;
      metadata: null;
      request: {
        documents: DocumentPayload;
      };
    } = {
      id: '',
      version: '',
      requesttime: new Date().toISOString(),
      metadata: null,
      request: {
        documents: {}
      }
    };

    this.additionalDocuments.forEach((doc) => {
      if (doc.category && doc.file) {
        if (doc.file instanceof File) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
              payload.request.documents[doc.category] = {
                document: Array.from(fileBytes),
                value: doc.category,
                type: 'DOC' + Math.floor(100 + Math.random() * 900).toString(),
                format: doc.fileName.split('.').pop() || ''
              };

              if (Object.keys(payload.request.documents).length === this.additionalDocuments.length) {
                this.uploadDocuments(payload);
              }
            }
          };
          reader.readAsArrayBuffer(doc.file);
        } else {
          console.error(`Invalid file type for category ${doc.category}`);
        }
      }
    });
  }

  uploadDocuments(payload: any) {
    this.dataService.uploadDocuments(this.applicationId, payload).subscribe(
      (response) => {
        if (response?.response?.status === 'Success') {
          this.snackBar.open('All documents uploaded successfully.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          localStorage.setItem(`uploadSuccess_${this.applicationId}`, 'true');
          this.uploadDocumentSucessStatus = true;
          this.closeDocumentUploadModal();
          // this.router.navigate(['/application-list'], {
          //   state: {
          //     role: this.role, 
          //     data: this.rowData 
          //   }
          // });

        } else {
          this.snackBar.open('Failed to upload documents. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      },
      (error) => {
        console.error('Error uploading documents:', error);
        this.snackBar.open('An error occurred while uploading the documents.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    );
  }
  parseJson(jsonString: string | null | undefined): any {
    if (!jsonString) {
      return [];
    }
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }
  }
  fetchDemographicData(registrationId: string, role: string, ) {
    this.isLoading = true;
    this.dataService.fetchDemographicData(registrationId).subscribe(
      (response: any) => {
        if (response?.response?.status === 'ACTIVATED') {
          if (!this.cachedDemographicsData) {
            this.cachedDemographicsData = {}; 
          }
          this.cachedDemographicsData[role] = response; // Cache the response
          if (!this.demographicDataByRole) {
            this.demographicDataByRole = {}; // Ensure it is initialized
          }
          this.demographicDataByRole[role] = response.response.identity;
          if (!this.relativeDocumentListByRole) {
            this.relativeDocumentListByRole = {}; // Ensure it is initialized
          }
          this.relativeDocumentListByRole[role] = response.response.documents;

          this.isLoading = false; 
          localStorage.setItem('serviceData', this.service);
        } else {
          const errorMessage =`Failed to fetch demographic data for ${role} from id repo`;
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          }); this.isLoading = false; 
        }
      },
      (error) => {
        console.error('Error in fetching demographic data', error);
        const errorMessage =`An error occurred while fetching demographic data for ${role} from id repo`;
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
        this.isLoading = false;
      }
    );
  }
  /**
   * Format a key by inserting spaces before uppercase letters and capitalizing the result.
   */
  formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  }

  hasSectionData(keys: string[]): boolean {
    if (!this.rowData?.demographics) {
      return false;
    }
    return keys.some(key => {
      const value = this.rowData.demographics[key];
      if (Array.isArray(value)) {
        return value.some(item => {
          const isItemNonEmpty = item && typeof item.value === 'string' && item.value.trim().length > 0;
          return isItemNonEmpty;
        });
      }
  
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
  
          if (Array.isArray(parsed)) {
            return parsed.some(item => 
              item && typeof item.value === 'string' && item.value.trim().length > 0
            );
          }
        } catch (err) {
          console.log('DEBUG: Failed to parse JSON, fallback to string check');
        }
        
        return value.trim().length > 0;
      }
  
      const isValueNonNull = value != null;
      return isValueNonNull;
    });
  }
  
  extractValue(data: any): string | null {
    if (!data) {
      return null; // Skip null or undefined values
    }

    if (Array.isArray(data)) {
      if (data[0]?.value != null && typeof data[0].value === 'string' && data[0].value.trim() !== '') {
        return data[0].value; // Extract 'value' key from the first array item
      }
      return null;
    }

    if (typeof data === 'object') {
      if (data.value != null && typeof data.value === 'string' && data.value.trim() !== '') {
        return data.value; // Handle objects with a 'value' key
      }
      return null;
    }

    if (typeof data === 'string' && data.trim() !== '') {
      try {
        // Parse JSON strings if applicable
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.value != null && typeof parsed[0].value === 'string' && parsed[0].value.trim() !== '') {
          return parsed[0].value; // Extract 'value' from parsed array
        }
        return data; // Return raw string if not JSON
      } catch {
        return data; // Return raw string if parsing fails
      }
    }

    return data; // Return plain value if none of the above conditions match
  }

  handleRecordsClick(): void {
    this.setActiveTab('records');
    let roles;
    if(this.service === 'Change of Particulars') roles = ['NIN'];
    else roles = ['father', 'mother', 'guardian'];
    roles.forEach(role => {
      const person = this.personDetails.find(person => person.role === role);
      if (person) {
        const demographicData = person.details['guardianNIN_AIN'] || person.details[person.role + 'NIN'] || person.details['NIN'];
        if (!this.cachedDemographicsData || !this.cachedDemographicsData[role]) {
          this.fetchDemographicData(demographicData, role);
        } else {
          this.getCachedData(role);
        }
      }
    });
  }
  getCachedData(role: string) {
    if (this.cachedDemographicsData[role]?.response?.status === 'ACTIVATED') {
      this.demographicData = this.demographicDataByRole[role] ;
      this.relativeDocumentList = this.relativeDocumentListByRole[role];
    } else {
      console.log("Error fetching cached data!")
    }
  }


  displayCachedData(role: string) {
    if (this.cachedDemographicsData[role]?.response?.status === 'ACTIVATED') {
      this.demographicData = this.cachedDemographicsData[role].response.identity;
      this.relativeDocumentList = this.cachedDemographicsData[role].response.documents;
      const newTab = window.open(`/demographic-details`, '_blank');
      if (newTab) {
        localStorage.setItem('demographicData', JSON.stringify(this.demographicData));
        localStorage.setItem('documentData', JSON.stringify(this.relativeDocumentList));
        localStorage.setItem('serviceData', this.service);
      }
    } else {
      const person = this.personDetails.find(person => person.role === 'guardian');
      if (person) {
        const demographicData = person.details['guardianNIN_AIN'] || person.details[person.role + 'NIN'];
        this.fetchDemographicData(demographicData, role);
      }
    }
  }
  extractJsonValue(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data) && data.length > 0 && data[0].value) {
      return data[0].value;
    }
    if (data && typeof data === 'object' && 'value' in data) {
      return data.value;
    }
    return '';
  }
  hasSectionDataForNavigation(sectionId: string): boolean {
    const sectionElement = document.getElementById(sectionId);
    return !!(sectionElement && sectionElement.offsetHeight > 0);
  }
  getVisibleSections() {
    return this.sections.filter(section =>
      section.subSections.some(sub => this.hasSectionDataForNavigation(sub.id))
    );
  }
  getVisibleSectionsCop() {
    return this.sectionsCop
        .map(section => {
            // Filter subsections based on the Y value in demographics
            const visibleSubSections = section.subSections.filter(subSection =>
                this.rowData.demographics[subSection.id] === 'Y'
            );

            // Return the section only if it has visible subsections
            return visibleSubSections.length > 0
                ? { ...section, subSections: visibleSubSections }
                : null;
        })
        .filter(section => section !== null);
  }
  hasValidField(field: any): boolean {
    return field && Array.isArray(field) && field.length > 0 && field[0]?.value?.trim();
  }
  getDemographicField(role: string, field: string): any {
    return this.demographicDataByRole?.[role]?.[field] || null;
}
getDemographicIdentity(role: string): any {
  return this.demographicDataByRole?.[role] || null;
}

// Check if a specific biometric is collected
isBiometricCollected(type: string, value: string): boolean {
  if (!this.rowData?.biometricInfo || !this.rowData.biometricInfo[type]) {
    return false;
  }
  return this.rowData.biometricInfo[type].includes(value);
}

formatBiometricName(name: string): string {
  name = name.replace('IndexFinger', 'Index Finger')
             .replace('MiddleFinger', 'Middle Finger')
             .replace('RingFinger', 'Ring Finger')
             .replace('LittleFinger', 'Little Finger');
  return name;
}
onSignatureError() {
  console.error('Signature image failed to load');
}

isRejectionDetailsPresent(): boolean {
  const rejectionDetails = localStorage.getItem('rejectionDetails');
  return rejectionDetails !== null && rejectionDetails !== undefined && rejectionDetails !== '';
}

fetchAdditionalDocuments(documentNames: string[], applicationId: string) {
  const requestPayload = {
    id: appConstants.fetchDocument.id,
    version: appConstants.fetchDocument.version,
    requesttime: new Date().toISOString(),
    request: {
      id: applicationId,
      documentNames: documentNames,
      source: appConstants.fetchDocument.source,
      process: appConstants.fetchDocument.process
    }
  };

  this.dataService.fetchDocuments(requestPayload).subscribe(
    (response) => {
      if (response && response.response && response.response.documents) {
        // Process the document responses
        this.processAdditionalDocuments(response.response);
      } else {
        console.error('No valid documents found in API response');
      }
    },
    (error) => {
      console.error('Error fetching additional documents:', error);
      this.snackBar.open('Failed to load additional documents.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  );
}

processAdditionalDocuments(response: DocumentResponse) {
  this.additionalFetchedDocuments = [];
  
  if (response && response.documents && response.documents.length > 0) {
    response.documents.forEach(doc => {
      const base64Content = doc.document?.trim();
      
      this.additionalFetchedDocuments.push({
        category: doc.documentName,
        title: this.getDocumentTitle(doc.documentName) || doc.documentName,
        fileName: `${doc.documentName}.${doc.format.toLowerCase()}`,
        file: base64Content ? this.convertBase64ToUrl(base64Content, doc.format) : null
      });
    });
  }
}

convertBase64ToUrl(base64: string, format: string): SafeResourceUrl {
  const mimeType = this.getMimeType(format);
  
  // Make sure the base64 string has the correct prefix
  const base64Data = base64.includes('base64,') ? base64 : `data:${mimeType};base64,${base64}`;
  
  if (mimeType === 'application/pdf') {
    return this.convertBase64ToPdfUrl(base64Data);
  } else {
    // For images and other formats
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
  }
}

getMimeType(format: string): string {
  const formatMap: {[key: string]: string} = {
    'PDF': 'application/pdf',
    'PNG': 'image/png',
    'JPG': 'image/jpeg',
    'JPEG': 'image/jpeg',
    'GIF': 'image/gif'
  };
  
  return formatMap[format.toUpperCase()] || 'application/octet-stream';
}
  /**
     * to check if camera is supported
     */
  private async isCameraSupported(): Promise<boolean> {
    try {
      // Check if navigator.mediaDevices exists new browsers support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      // Check if we can enumerate devices 
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        if (!hasVideoDevice) {
          return false;
        }
      }

      // Test if we can actually get camera permission/access
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1, height: 1 } // video request for testing
        });

        // stop the test stream
        testStream.getTracks().forEach(track => track.stop());
        return true;
      } catch (permissionError) {
        console.warn('Camera access test failed:', permissionError);
        return false;
      }

    } catch (error) {
      console.warn('Camera support check failed:', error);
      return false;
    }
  }


  openScannerModal() {
    this.showScannerModal = true;
    this.showVideo = true;
    this.scannerError = '';
    this.isInitializingCamera = true;

    //  delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeCamera();
    }, 100);
  }

  closeScannerModal() {
    this.stopCamera();
    this.showScannerModal = false;
    this.showVideo = true;
    this.scannerError = '';
    this.isInitializingCamera = false;
  }
  /**
     * Initialize camera stream
     */
  private async initializeCamera() {
    try {
      this.scannerError = '';

      // request camera access with preferences for back camera
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      });

      if (this.scannerVideo?.nativeElement) {
        this.scannerVideo.nativeElement.srcObject = this.stream;
        this.isInitializingCamera = false;
      }

    } catch (error) {
      console.error('Error accessing camera:', error);
      this.isInitializingCamera = false;

      let errorMessage = 'Unable to access camera. ';

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera is not supported on this device.';
        } else {
          errorMessage += 'Please check your camera and try again.';
        }
      }

      this.scannerError = errorMessage;


      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }


  /**
   * Capture image from video stream
   */
  captureImage() {
    const video = this.scannerVideo?.nativeElement;
    const canvas = this.scannerCanvas?.nativeElement;

    if (!video || !canvas) {
      this.scannerError = 'Camera or canvas not available';
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      this.scannerError = 'Camera is not ready. Please wait a moment and try again.';
      return;
    }

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Switch to preview mode
        this.showVideo = false;
        this.scannerError = '';
      } else {
        this.scannerError = 'Unable to capture image. Please try again.';
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      this.scannerError = 'Failed to capture image. Please try again.';
    }
  }
  /**
     * Return to video mode for retaking
     */
  retakeImage() {
    this.showVideo = true;
    this.scannerError = '';
  }

  /**
   * Save the scanned document
   */
  saveScannedDocument() {
    const canvas = this.scannerCanvas?.nativeElement;

    if (!canvas) {
      this.scannerError = 'No image captured';
      return;
    }

    try {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          if (blob.size > MAX_DOC_SIZE) {
            this.snackBar.open('Scanned image is too large. Please try scanning again with better lighting.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['center-snackbar'],
            });
            return;
          }

          // Creating file from blob
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 19);
          const fileName = `scanned_document_${timestamp}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });

          // Adding to document list
          if (this.additionalDocuments[this.currentScanIndex]) {
            this.additionalDocuments[this.currentScanIndex].fileName = fileName;
            this.additionalDocuments[this.currentScanIndex].file = file;

            this.snackBar.open('Document scanned successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['center-snackbar'],
            });

            // Close modal
            this.closeScannerModal();
          } else {
            this.scannerError = 'Error saving document. Please try again.';
          }
        } else {
          this.scannerError = 'Failed to process scanned image. Please try again.';
        }
      }, 'image/png', 0.8); // 0.8 quality to reduce file size
    } catch (error) {
      console.error('Error saving scanned document:', error);
      this.scannerError = 'Failed to save document. Please try again.';
    }
  }

  /**
   * Stop camera stream and cleanup
   */
  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }
  }

  private triggerMobileScan(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment'); // Use back camera
    input.style.display = 'none';

    input.onchange = (event: Event) => {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];

        // Validate file size
        if (file.size > MAX_DOC_SIZE) {
          this.snackBar.open('File size exceeds 2 MB. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.snackBar.open('Please select an image file.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          return;
        }

        this.additionalDocuments[index].fileName = file.name;
        this.additionalDocuments[index].file = file;

        this.snackBar.open('Document captured successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    };

    input.onerror = () => {
      this.snackBar.open('Error accessing camera. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    };

    document.body.appendChild(input);
    input.click();
    input.remove();
  }

  /**
   * Toggle the custom dropdown visibility
   */
  toggleEscalationDropdown(): void {
    this.isEscalationDropdownOpen = !this.isEscalationDropdownOpen;
  }

  /**
   * Check if an escalation category is selected
   */
  isEscalationSelected(value: string): boolean {
    return this.selectedEscalationCategories.includes(value);
  }

  /**
   * Handle checkbox changes for escalation categories
   */
  onEscalationChange(value: string, event: any): void {
    if (event.target.checked) {
      if (!this.selectedEscalationCategories.includes(value)) {
        this.selectedEscalationCategories.push(value);
      }
    } else {
      const index = this.selectedEscalationCategories.indexOf(value);
      if (index > -1) {
        this.selectedEscalationCategories.splice(index, 1);
      }
    }
    this.isEscalated = this.selectedEscalationCategories.length > 0;
    console.log("isExclated",this.isEscalated)
  }

  /**
   * Get display text for selected escalation categories
   */
  getSelectedEscalationText(): string {
    if (this.selectedEscalationCategories.length === 0) {
      return 'Select escalation categories';
    } else if (this.selectedEscalationCategories.length === 1) {
      const category = this.selectedEscalationCategories[0];
      if (category.startsWith('Others: ')) {
        return category.substring(8); // removing others prefix from display
      }
      return this.selectedEscalationCategories[0];
    } else {
      return `${this.selectedEscalationCategories.length} categories selected`;
    }
  }

  onOthersChange(event: any): void {
    this.isOthersSelected = event.target.checked;
    if (this.isOthersSelected) {
      if (!this.selectedEscalationCategories.includes('Others')) {
        this.selectedEscalationCategories = this.selectedEscalationCategories.filter(
          category => category !== 'Others' && !category.startsWith('Others:')
        );
        this.selectedEscalationCategories.push('Others');
      }
    } else {
      this.selectedEscalationCategories = this.selectedEscalationCategories.filter(
        category => category !== 'Others' && !category.startsWith('Others:')
      );
      this.othersText = '';
    }
  }

  onOthersTextChange(): void {
    if (this.isOthersSelected && this.othersText.trim()) {
      this.selectedEscalationCategories = this.selectedEscalationCategories.filter(
        category => category !== 'Others' && !category.startsWith('Others:')
      );
      this.selectedEscalationCategories.push(`Others: ${this.othersText.trim()}`);
    } else if (this.isOthersSelected && !this.othersText.trim()) {
      this.selectedEscalationCategories = this.selectedEscalationCategories.filter(
        category => !category.startsWith('Others:')
      );

      if (!this.selectedEscalationCategories.includes('Others')) {
        this.selectedEscalationCategories.push('Others');
      }
    }
  }

  openRegIdDetails(registrationId: string, event: MouseEvent): void {
    event.preventDefault();
    this.getMatchedRegIdData(registrationId);
  }

  getMatchedRegIdData(registartionId: string) {
    this.dataService.fetchMatchedRegIdData(registartionId).subscribe(
      (response: any) => {
        console.log("Response : "+ JSON.stringify(response))
        if(response?.response){
          console.log("Response -- Response : " + JSON.stringify(response?.response))
          const newTab =  window.open(`/demographic-details`, '_blank');
          if(newTab){
             localStorage.setItem('demographicData', JSON.stringify(response?.response));
             localStorage.removeItem('documentData');
          } else {
            alert('Failed to open new tab');
          }
        }
      },
      (error) => {
        console.log('Error fetching data: ', error);
      }
    );
  }

  ngOnDestroy() {
    this.stopCamera();
    localStorage.removeItem('rejectionDetails');
     this.objectUrls.forEach(url => {
    URL.revokeObjectURL(url);
  });
  this.objectUrls = [];
  }

getParsedValue(value: any): string | null {
  if (value === null || value === undefined) return null;
  // If it’s already a plain string or number (not JSON)
  if (typeof value === 'string' && !value.trim().startsWith('[') && !value.trim().startsWith('{')) {
    const val = value.toString().trim();
    return val && val.toLowerCase() !== 'null' && val !== '-' ? val : null;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // Try to parse JSON arrays like `[{"value":"In Uganda"}]`
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.length) {
      const val = parsed[0]?.value?.toString().trim();
      return val && val.toLowerCase() !== 'null' && val !== '-' ? val : null;
    }
    // If JSON is a plain object, try reading its value directly
    if (parsed && typeof parsed === 'object') {
      const val = parsed.value?.toString().trim?.();
      return val && val.toLowerCase() !== 'null' && val !== '-' ? val : null;
    }
    return null;
  } catch {
    // Fallback: just return trimmed value if JSON.parse fails
    const val = value?.toString().trim();
    return val && val.toLowerCase() !== 'null' && val !== '-' ? val : null;
  }
}

formatLabel(key: string): string {
   if (FIELD_LABEL_MAP[key]) {
    return FIELD_LABEL_MAP[key];
  }
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
}

// Helper function to get value safely
getValue(key: string) {
  const value = this.rowData?.demographics?.[key];
  return this.getParsedValue(value); // your existing parser
}

isArrayField(key: string): boolean {
  return Array.isArray(this.modifiedDetails[key]);
}

}

