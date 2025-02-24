import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { API_CONST_APPROVE, API_CONST_ESCALATE, API_CONST_ESCALATION_DATE, API_CONST_REJECT, APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, MVS_LEGAL_OFFICER, REJECT, RENEWAL_REJECTION_CATEGORIES, GETFIRSTID_ESCALATION_CATEGORIES, GETFIRSTID_REJECTION_CATEGORIES, LR_ESCALATION_CATEGORIES, LR_REJECTION_CATEGORIES, COP_ESCALATION_CATEGORIES, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS, MVS_OFFICER, NEW_ESCALATION_CATEGORIES_FOR_OFFICER, RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER } from '../../shared/constants';
import { CATEGORY_MAP, TITLE_MAP, NEW_REJECTION_CATEGORIES, COP_REJECTION_CATEGORIES,
  NEW_ESCALATION_CATEGORIES, RENEWAL_ESCALATION_CATEGORIES, SERVICE_CATEGORY_MAP, SERVICE_TITLE_MAP,
  MAX_DOC_SIZE
 } from '../../shared/constants';
 import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { error } from 'node:console';
type DocumentPayload = {
  [key: string]: {
    document: number[];
    value: string;
    type: string;
    format: string;
  };
};

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
  showScheduleInterviewModal: boolean = false;
  showDocumentUploadModal: boolean = false;
  showRejectModal: boolean = false;
  rowData: any = {};
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
        { id: 'correctionOfErrorRegardingNin', label: 'Correction of error regarding NIN' },
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
        { id: 'declarant-details-section', label: 'Declarants Details' }
      ],
    },];
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
  selectedOfficerLevel: string = '';
  escalationCategory: string = '';
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';
  isSectionExpanded: boolean[] = []; // Tracks expanded/collapsed states for each section
  ageGroup: string ='';
  foundling: string = '';
  // Added: State variables for left and right section collapse
  isLeftCollapsed: boolean = true;
  isRightCollapsed: boolean = true;
  isEditable: boolean = false;
  selectedRow: any = {};
  documents: { category: string; title: string; fileName: string; file: File | SafeResourceUrl | null }[] = [
    { category: '', title: '', fileName: '', file: null }
  ];
  additionalDocuments: { category: string; title: string; fileName: string; file: File | SafeResourceUrl | null }[] = [
    { category: '', title: '', fileName: '', file: null }
  ];
  personDetails: { role: string; details: { [key: string]: any } }[] = []; // Store details for Father, Mother, Guardian
  constants = {
    MVS_OFFICER,
    MVS_DISTRICT_OFFICER,
    MVS_LEGAL_OFFICER,
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
    APPLICANT_NAME
  }
  
  // Sample Data
  districtOffices: string[] = ['District Office 1', 'District Office 2', 'District Office 3'];
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
  cachedDemographicsData: any;

  constructor(private router: Router, private dataService: DataStorageService,
    private sanitizer: DomSanitizer, private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const state = history.state;
    console.log(state.rowData)
    //fetch the created date and save it in to display in the ui
    const date = new Date(state.rowData.crDTimes);
    this.formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
      .format(date)
      .replace(/\//g, '-'); 

    this.role = state.role || '';
    this.rowData = state.data || {};
    this.selectedRow = state.rowData || {};
    this.photoBase64 = this.rowData?.biometricAttributes?.ApplicantPhoto?.trim() || '';

    if (this.role === MVS_DISTRICT_OFFICER || this.role === MVS_LEGAL_OFFICER) {
      this.applicationStatus = this.selectedRow.status;
      console.log(this.rowData);
    }
    this.serviceType = this.rowData.serviceType || '';
    this.applicationId = this.rowData.applicationId || '';
    this.service = this.rowData.service || '';
    this.statusComment = this.rowData.statusComment || '';
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
    this.setRejectionCategories();
    this.setEscalationCategories();
    // Check if the rowData contains documents and process them
    if (this.rowData?.documents) {
      this.processDocuments();
    } else {
      console.log('No documents found in the API response.');
    }
    this.isSectionExpanded = this.documents.map(() => false);
    this.updateCategoriesAndTitles();
  }
  // Update the docCategories and docTitles based on selectedService and selectedServiceType
updateCategoriesAndTitles() {
  if(this.foundling === 'Y'){
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
  if(this.ageGroup === 'MINOR'){
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

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a safe object URL for the Blob
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
    console.log("inside processDocuments")
    const documents = this.rowData?.documents || {};

    this.documents = Object.keys(documents).map((key) => {
      const base64Pdf = documents[key]?.trim();
      return {
        category: key, // Use the key as the category
        title: this.getDocumentTitle(key), // Map keys to human-readable titles
        fileName: `${key}.pdf`, // Generate a filename dynamically
        file: base64Pdf ? this.convertBase64ToPdfUrl(base64Pdf) : null, // Convert Base64 to a SafeResourceUrl
      };
    });

    // Set the initial state of section expansion
    this.isSectionExpanded = this.documents.map(() => false);
  }

  getDocumentTitle(key: string): string {

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
        console.log("for rolw:" + role)
        console.log("checking" + this.rowData.demographics[ninKey])
        if (this.rowData.demographics[ninKey]) {
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
    switch (this.role) {
      case 'MVS_OFFICER':
        this.dropdownOptions = [
          { value: 'MVS_SUPERVISOR', label: 'Supervisor', default: true },
          { value: 'MVS_DISTRICT_OFFICER', label: 'District', default: false },
          { value: 'MVS_LEGAL_OFFICER', label: 'Legal', default: false }
        ];
        this.selectedOfficerLevel = 'MVS_SUPERVISOR';
        break;
      case 'MVS_SUPERVISOR':
        this.dropdownOptions = [
          { value: 'MVS_DISTRICT_OFFICER', label: 'District', default: true },
          { value: 'MVS_LEGAL_OFFICER', label: 'Legal', default: false }
        ];
        this.selectedOfficerLevel = 'MVS_DISTRICT_OFFICER';
        break;
      case 'MVS_LEGAL_OFFICER':
        this.dropdownOptions = [
          { value: 'MVS_EXECUTIVE_DIRECTOR', label: 'Executive Director', default: true }
        ];
        this.selectedOfficerLevel = 'MVS_EXECUTIVE_DIRECTOR';
        break;
      default:
        this.dropdownOptions = [];
        this.selectedOfficerLevel = '';
    }
  }

  setRejectionCategories() {
    switch(this.service) {
      case 'New registrations':
        this.rejectionCategories = NEW_REJECTION_CATEGORIES;
        break;
      case 'Change of Particulars':
        this.rejectionCategories = COP_REJECTION_CATEGORIES;
        break;
      case 'Renewal of card':
        this.rejectionCategories = RENEWAL_REJECTION_CATEGORIES;
        break;
      case 'GetFirst ID':
        this.rejectionCategories = GETFIRSTID_REJECTION_CATEGORIES;
        break;
      case 'Lost/ Replacement of card':
        this.rejectionCategories = LR_REJECTION_CATEGORIES;
        break;
    }
  }
  setEscalationCategories() {
    switch(this.service) {
      case 'New registrations':
        if (this.role === MVS_OFFICER) this.escalationCategories = NEW_ESCALATION_CATEGORIES_FOR_OFFICER;
        else this.escalationCategories = NEW_ESCALATION_CATEGORIES;
        break;
      case 'Renewal of card':
        if (this.role === MVS_OFFICER) this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES_FOR_OFFICER;
        else this.escalationCategories = RENEWAL_ESCALATION_CATEGORIES;
        break;
        case 'GetFirst ID':
          this.escalationCategories = GETFIRSTID_ESCALATION_CATEGORIES;
          break;
        case 'Lost/ Replacement of card':
          this.escalationCategories = LR_ESCALATION_CATEGORIES;
          break;
        case 'Change of Particulars':
          this.escalationCategories = COP_ESCALATION_CATEGORIES;
          break;
    }
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  goBack() {
    this.router.navigate(['/application-list'], {
      state: { role: this.role, data: history.state.data }
    });
  }
  openApprovalModal() {
    this.showApprovalModal = true;
  }
  openEscalateModal() {
    console.log('Escalate Modal Opened');
    this.showEscalateModal = true;
  }

  closeEscalateModal() {
    this.showEscalateModal = false;
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
  approveApplication() {
    // Approval logic
    if (this.isChecked) {
      this.showApprovalModal = false;
      const comment = this.approvalComment.trim();
      this.changeApplicationStatus(API_CONST_APPROVE, comment);
      this.closeApprovalModal();
    }
  }
  escalateApplication() {
    // Escalate logic 
    this.showEscalateModal = false;
    const comment = this.escalationComment.trim();
    console.log(this.selectedOfficerLevel)
    this.changeApplicationStatus(API_CONST_ESCALATE, comment, this.escalationCategory, this.selectedOfficerLevel);
    this.closeEscalateModal();
  }

  rejectApplication() {
    // Reject logic 
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
  viewDocument(document: { file: File | SafeResourceUrl | null }): void {
    if (document.file) {
      const sanitizedUrl = this.sanitizer.sanitize(4, document.file); // Sanitizes the SafeResourceUrl
      if (!sanitizedUrl) {
        this.snackBar.open('Invalid or unsafe URL for the document.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
        return;
      }

      // Open a new window and inject sanitized HTML
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
            <html>
              <head>
                <title>${document.file || 'Document'}</title>
              </head>
              <body style="margin: 0;">
                <iframe
                  src="${sanitizedUrl}"
                  width="100%"
                  height="100%"
                  style="border: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
                ></iframe>
              </body>
            </html>
          `);
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

  triggerScan(index: number) {
    // Trigger scan logic here
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
  fetchDemographicData(registrationId: string) {
    console.log("showDemographicData" + registrationId);
    this.isLoading = true;
    this.dataService.fetchDemographicData(registrationId).subscribe(
      (response: any) => {
        console.log("response:: malay :: " + JSON.stringify(response))
        if (response?.response?.status === 'ACTIVATED') {
          this.cachedDemographicsData = response; // Cache the response
          this.demographicData = response.response.identity; // Pass identity data to child
          this.relativeDocumentList = response.response.documents;
          this.isLoading = false; 
          console.log(this.demographicData);
        } else {
          this.snackBar.open('Failed to fetch demographic data from id repo', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          }); this.isLoading = false; 
        }
      },
      (error) => {
        console.error('Error in fetching demographic data', error);
        this.snackBar.open('An error occurred while fetching demographic data from id repo', 'Close', {
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

    if (Array.isArray(data) && data[0]?.value) {
      return data[0].value; // Extract 'value' key from the first array item
    }

    if (typeof data === 'object' && data.value) {
      return data.value; // Handle objects with a 'value' key
    }

    if (typeof data === 'string') {
      try {
        // Parse JSON strings if applicable
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.value) {
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

    console.log("persondetails   "+JSON.stringify(this.personDetails));
    roles.forEach(role => {
      const person = this.personDetails.find(person => person.role === role);
      if (person) {
        console.log("person    "+JSON.stringify(person));
        const demographicData = person.details['guardianNIN_AIN'] || person.details[person.role + 'NIN'] || person.details['NIN'];
        console.log("demographic  "+ demographicData)
        if (!this.cachedDemographicsData) {
          this.fetchDemographicData(demographicData);
        } else {
          this.getCachedData();
        }
      }
    });
  }
  getCachedData() {
    if (this.cachedDemographicsData?.response?.status === 'ACTIVATED') {
      this.demographicData = this.cachedDemographicsData.response.identity;
      this.relativeDocumentList = this.cachedDemographicsData.response.documents;
    } else {
      console.log("Error fetching cached data!")
    }
  }


  displayCachedData() {
    if (this.cachedDemographicsData?.response?.status === 'ACTIVATED') {
      this.demographicData = this.cachedDemographicsData.response.identity;
      this.relativeDocumentList = this.cachedDemographicsData.response.documents;
      const newTab = window.open(`/demographic-details`, '_blank');
      if (newTab) {
        localStorage.setItem('demographicData', JSON.stringify(this.demographicData));
        localStorage.setItem('documentData', JSON.stringify(this.relativeDocumentList));
      }
    } else {
      const person = this.personDetails.find(person => person.role === 'guardian');
      if (person) {
        const demographicData = person.details['guardianNIN_AIN'] || person.details[person.role + 'NIN'];
        this.fetchDemographicData(demographicData);
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
    // return this.sectionsCop.filter(section => 
    //   section.subSections.some(sub => 
    //     this.rowData.demographics[sub.id] === 'Y'
    //   )
    // );
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
}

