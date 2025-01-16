import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { API_CONST_APPROVE, API_CONST_ESCALATE, API_CONST_ESCALATION_DATE, API_CONST_REJECT, APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, MVS_LEGAL_OFFICER, REJECT, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS } from '../../shared/constants';
import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
    HttpClientModule
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})

export class ApplicationDetailComponent implements OnInit {

  demographicData: any;
  isChecked = false;
  role: string = '';
  photoBase64: string = '';
  isPhotoError = false;
  // Map document keys to readable titles
  titleMap: { [key: string]: string } = {
    proofOfPhysicalApplicationForm: 'Proof of Physical Application Form',
    proofOfAbandonment: 'Proof of Abandonment',
    proofOfException: 'Proof of Exception',
    proofOfPayment: 'Proof of Payment',
    proofOfRelationship: 'Proof of Relationship',
    proofOfCitizenship: 'Proof of Citizenship',
    proofOfLegalDOcuments: 'Proof of Legal Documents',
    proofOfIdentity: 'Proof of Identity',
    proofOfAddress: 'Proof of Address',
    proofOfReplacement: 'Proof of Replacement',
    proofOfBirth: 'Proof of Birth',
    proofOfOtherSupportingdocumentIssuedbyGovt: 'Proof of Other Supporting Document',
    proofOfOtherSupportingdocuments: 'Proof of Other Supporting Documents',
    applicantProofOfSignature: 'Applicant Proof of Signature',
    introducerProofOfSignature: 'Introducer Proof of Signature',
    proofOfRegistration: 'Proof of Registration',
    proofOfAdoption: 'Proof of Adoption',
    proofOfChangeOfParticulars: 'Proof of Change of Particulars',
    proofOfDeclarant: 'Proof of Declarant',
    proofOfLegalDeepPoll: 'Proof of Legal Deed Poll',
    proofOfLegalGazzette: 'Proof of Legal Gazette',
    proofOfLegalStatutoryDeclaration: 'Proof of Statutory Declaration',
    proofOfModificationConsent: 'Proof of Modification Consent',
  };
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
  currentDocument = {
    category: '',
    title: '',
    fileName: '',
    file: null as File | null // Allow both File and null
  };
  sections = [
    {
      id: 'partA',
      label: 'Part - A',
      open: false,
      subSections: [
        { id: 'personal-info-section', label: 'Personal Information' },
        { id: 'place-of-residence-section', label: 'Place Of Residenc' },
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
        { id: 'mother-details-section', label: 'mother Details' },
        { id: 'intoducer-details-section', label: 'Blood Relatives/Introducer Details' },
        { id: 'childrent-details-section', label: 'Particulars of Applicants Children' },
        { id: 'declarant-details-section', label: 'Declarants Details' }
      ],
    },];
  expandedSections: { [key: string]: boolean } = {};
  activeTab: string = 'history'; // Default tab is 'history'
  service: string = '';
  serviceType: string = '';
  approvalComment: string = '';
  applicationId: string = '';
  commentMVSOfficer: string = '';
  commentMVSSupervisor: string = '';
  dropdownOptions: { value: string; label: string; default: boolean }[] = [];
  selectedOfficerLevel: string = '';
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';
  isSectionExpanded: boolean[] = []; // Tracks expanded/collapsed states for each section

  // Added: State variables for left and right section collapse
  isLeftCollapsed: boolean = false;
  isRightCollapsed: boolean = false;
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
    MVS_DISTRICT_OFFICER,
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
  docCategories = Object.entries(this.titleMap).map(([key, value]) => ({
    key,
    title: value,
  }));
  docTitles = ['Title 1', 'Title 2', 'Title 3'];
  applicantName = 'Steve Smith'
  pdfUrl: any;

  constructor(private router: Router, private dataService: DataStorageService,
    private sanitizer: DomSanitizer, private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const state = history.state;

    this.role = state.role || '';
    this.rowData = state.data || {};
    console.log(this.rowData.applicationId);
    this.selectedRow = state.rowData || {};
    this.photoBase64 = this.rowData?.biometricAttributes?.ApplicantPhoto?.trim() || '';
    // console.log("photoBase64:::: " + this.photoBase64)
    // console.log('Base64 String Length:', this.photoBase64.length);
    // const base64Pdf = this.rowData?.documents?.proofOfPhysicalApplicationForm?.trim() || '';
    // if (base64Pdf) {
    //   this.pdfUrl = this.convertBase64ToPdfUrl(base64Pdf);
    // } else {
    //   this.pdfUrl = null;
    // }
    /**below two row data sets need to be removed data would come from polcy, this is for example */
    // this.rowData = {
    //   ...this.rowData,
    //   fatherNin: "123456789", // Example NIN
    //   fatherName: "John Doe", // Example Name
    //   fatherAddress: "123 Main Street, Cityville", // Example Address
    // }
    // this.rowData = {
    //   ...this.rowData,
    //   motherNin: "654321", // Example NIN
    //   motherName: "rosy", // Example Name
    //   motherAddress: "123 Main Street, Cityville", // Example Address
    // }

    if (this.role === MVS_DISTRICT_OFFICER || this.role === MVS_LEGAL_OFFICER) {
      this.applicationStatus = this.rowData[APPLICANT_NAME];
    }

    this.serviceType = this.rowData.serviceType || '';
    this.applicationId = this.rowData.applicationId || '';
    this.service = this.rowData.service || '';
    this.commentMVSOfficer = this.rowData[ESCALATION_COMMENT_FROM_MVS_OFFICER] || '';
    this.commentMVSSupervisor = this.rowData[ESCALATION_COMMENT_FROM_MVS_SUPERVISOR] || '';

    this.checkPersonDetails();
    console.log(this.personDetails)
    this.setDropdownOptions();

    // Check if the rowData contains documents and process them
    if (this.rowData?.documents) {
      this.processDocuments();
    } else {
      console.log('No documents found in the API response.');
    }
    this.isSectionExpanded = this.documents.map(() => false);
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
  toggleSection(index: number): void {
    // Toggle the state of the clicked section
    this.isSectionExpanded[index] = !this.isSectionExpanded[index];
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

    return this.titleMap[key] || 'Unknown Document';
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
    const roles = ['father', 'mother', 'guardian']; // Define roles to check
    console.log(this.rowData.demographics)
    this.personDetails = roles
      .map((role) => {
        const ninKey = role === 'guardian' ? `${role}NIN_AIN` : `${role}NIN`;
        console.log("for rolw:" + role)
        console.log("checking" + this.rowData.demographics[ninKey])
        if (this.rowData.demographics[ninKey]) {
          console.log(this.rowData.demographics[ninKey] + "exist")
          // If NIN exists for the person, collect all details related to the role
          const personData = Object.keys(this.rowData.demographics)
            .filter((key) => key.startsWith(role)) // Match keys starting with the role (e.g., father)
            .reduce((acc: { [key: string]: any }, key) => {
              acc[key] = this.rowData.demographics[key]; // Add key-value pair to the accumulator
              return acc;
            }, {}); // Initialize acc as an empty object

          return { role, details: personData };
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
        (response) => {
          let statusMsg = '';
          if(status == API_CONST_REJECT) statusMsg = 'Application REJECTED successfully.';
          else statusMsg = `Application ${status}D successfully.`
          this.snackBar.open(statusMsg, 'Close', {
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          
          this.router.navigate(['/application-list'], {state: { role: this.role }});
        },
        (error) => {
          console.error('Error updating status:', error);
          this.snackBar.open('Failed to update status. Please try again', 'Close', {
            duration: 100000,
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
    this.changeApplicationStatus(API_CONST_ESCALATE, comment, '', this.selectedOfficerLevel);
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
    return subject.trim() !== '' && content.trim() !== '' && districtOffice.trim() !== '';
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
                duration: 100000,
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
                duration: 100000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['center-snackbar'],
              });
            }
          },
          (error) => {
            console.error('Error scheduling interview:', error);
            this.snackBar.open('An error occurred while scheduling the interview. Please try again later.', 'Close', {
              duration: 100000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['center-snackbar'],
            });
          });
    } else {
      this.snackBar.open('Please fill all the required fields.', 'Close', {
        duration: 100000,
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
          duration: 100000,
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
          duration: 100000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    } else {
      this.snackBar.open('Document is not available.', 'Close', {
        duration: 100000,
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
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      } else if (file.type === 'application/pdf') {
        const pdfWindow = window.open(fileURL, '_blank');
        if (!pdfWindow) {
          this.snackBar.open('Unable to preview the PDF.', 'Close', {
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      } else {
        this.snackBar.open('Preview is not supported for this file type.', 'Close', {
          duration: 100000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    } else {
      this.snackBar.open('Invalid file type for preview.', 'Close', {
        duration: 100000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }

  // Confirm and approve action
  confirmAndUpload() {
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
                value: doc.title,
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
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
          this.router.navigate(['/application-list'], {
            state: {
              role: this.role, 
              data: this.rowData 
            }
          });

        } else {
          this.snackBar.open('Failed to upload documents. Please try again.', 'Close', {
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      },
      (error) => {
        console.error('Error uploading documents:', error);
        this.snackBar.open('An error occurred while uploading the documents.', 'Close', {
          duration: 100000,
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
  showDemographicData(registrationId: string) {
    console.log("showDemographicData" + registrationId);
    this.dataService.fetchDemographicData(registrationId).subscribe(
      (response: any) => {
        console.log("response:: malay :: " + JSON.stringify(response))
        if (response?.response?.status === 'ACTIVATED') {
          this.demographicData = response.response.identity; // Pass identity data to child
          // Create a new window and navigate to 'demographic-details' route
          const newWindow = window.open(`/demographic-details`, '_blank', 'width=800,height=600');

          // Use localStorage to pass data to the new window
          if (newWindow) {
            localStorage.setItem('demographicData', JSON.stringify(this.demographicData));
          }
        } else {
          this.snackBar.open('Failed to fetch demographic data from id repo', 'Close', {
            duration: 100000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar'],
          });
        }
      },
      (error) => {
        console.error('Error in fetching demographic data', error);
        this.snackBar.open('An error occurred while fetching demographic data from id repo', 'Close', {
          duration: 100000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
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
    return keys.some(key => this.rowData.demographics[key]);
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

}

