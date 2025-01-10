import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { API_CONST_APPROVE, API_CONST_ESCALATE, API_CONST_ESCALATION_DATE, API_CONST_REJECT, APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, MVS_LEGAL_OFFICER, REJECT, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS } from '../../shared/constants';
import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';

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
    { id: 'personal-info-section', label: 'Personal Information' },
    { id: 'place-of-residence-section', label: 'Place Of Residenc' },
    { id: 'foundling-section', label: 'Foundling Check' },
    { id: 'place-of-birth-section', label: 'Place Of Birth' },
    { id: 'place-of-origin-section', label: 'Place of Origin' },
    { id: 'citizenship-details-section', label: 'Citizenship Details' },
    { id: 'voter-info-section', label: 'Voters Information' }, 
    { id: 'marital-status-section', label: 'Marital Status' },
    { id: 'spouse-details-section', label: 'Spouse Details' },
    { id: 'father-details-section', label: 'Fathers Details' },
    { id: 'mother-details-section', label: 'mother Details' },
    { id: 'intoducer-details-section', label: 'Blood Relatives/Introducer Details' },
    { id: 'childrent-details-section', label: 'Particulars of Applicants Children' },
    { id: 'declarant-details-section', label: 'Declarants Details' }
  ];
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
  documents: { category: string; title: string; fileName: string; file: File | null }[] = [
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
  docCategories = ['Category 1', 'Category 2', 'Category 3']; 
  docTitles = ['Title 1', 'Title 2', 'Title 3']; 
  applicantName = 'Steve Smith'

  constructor(private router: Router, private dataService: DataStorageService) { }

  ngOnInit() {
    const state = history.state;

    this.role = state.role || '';
    this.rowData = state.data || {};
    console.log(this.rowData.applicationId);
    this.selectedRow = state.rowData || {};
    /**below two row data sets need to be removed data would come from polcy, this is for example */
    this.rowData = {
      ...this.rowData,
      fatherNin: "123456789", // Example NIN
      fatherName: "John Doe", // Example Name
      fatherAddress: "123 Main Street, Cityville", // Example Address
    }
    this.rowData = {
      ...this.rowData,
      motherNin: "654321", // Example NIN
      motherName: "rosy", // Example Name
      motherAddress: "123 Main Street, Cityville", // Example Address
    }
    
    if (this.role === MVS_DISTRICT_OFFICER || this.role === MVS_LEGAL_OFFICER) {
      this.applicationStatus = this.rowData[APPLICANT_NAME];
    }

    this.serviceType = this.rowData.serviceType || '';
    this.applicationId = this.rowData.applicationId || '';
    this.service = this.rowData.service || '';
    this.commentMVSOfficer = this.rowData[ESCALATION_COMMENT_FROM_MVS_OFFICER] || '';
    this.commentMVSSupervisor = this.rowData[ESCALATION_COMMENT_FROM_MVS_SUPERVISOR] || '';

    this.checkPersonDetails();
    this.setDropdownOptions();

    //doc show-pload
    if (this.rowData.response?.documents?.length) {
      // Use documents from API response
      this.documents = this.rowData.response.documents.map((doc: any) => ({
        category: doc.category || 'Unknown Category', // Fallback for missing category
        title: doc.title || 'Untitled Document', // Fallback for missing title
        fileName: doc.fileName || '', // Default empty fileName
        file: doc.file || null // Default null file
      }));
    } else {
      // Fallback for demonstration purposes
      this.documents = [
        { category: 'Proof of Citizenship', title: 'Father - National ID', fileName: '', file: null },
        { category: 'Proof of Citizenship', title: 'Document Title', fileName: '', file: null },
        { category: 'Proof of Residence', title: 'Local Counsel Letter', fileName: '', file: null },
        { category: 'Proof of Event of Birth', title: 'Birth Certificate', fileName: '', file: null }
      ];
    }
    this.isSectionExpanded = this.documents.map(() => false);
  }


  toggleSection(index: number): void {
    // Toggle the state of the clicked section
    this.isSectionExpanded[index] = !this.isSectionExpanded[index];
  }
  // Process the documents data into the required structure
processDocuments(documentsData: any) {
  this.documents = documentsData.map((docSection: any) => ({
    section: docSection.sectionName,
    items: docSection.items.map((item: any) => ({
      title: item.documentTitle,
      id: item.documentId
    }))
  }));
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
  
    this.personDetails = roles
      .map((role) => {
        const ninKey = `${role}Nin`;
        if (this.rowData[ninKey]) {
          // If NIN exists for the person, collect all details related to the role
          const personData = Object.keys(this.rowData)
            .filter((key) => key.startsWith(role)) // Match keys starting with the role (e.g., father)
            .reduce((acc: { [key: string]: any }, key) => {
              acc[key] = this.rowData[key]; // Add key-value pair to the accumulator
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
          alert(`Application ${status.toLowerCase()}d successfully.`);
          this.router.navigate(['/application-list'], {
            state: { role: this.role }
          });
        },
        (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status. Please try again.');
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

  openDocumentUploadwModal(category: string, title: string) {
    this.currentDocument.category = category;
  this.currentDocument.title = title;
  this.currentDocument.fileName = '';
  this.currentDocument.file = null;
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
              alert('Interview scheduled successfully.');
              this.closeScheduleInterviewModal();
              this.router.navigate(['/application-list'], {
                state: { role: this.role, data: history.state.data }
              });
            } else {
              alert('Failed to schedule the interview. Please try again.');
            }
          },
          (error) => {
            console.error('Error scheduling interview:', error);
            alert('An error occurred while scheduling the interview. Please try again later.');

          });
    } else {
      alert('Please fill all the required fields.');
    }
  }
  viewDocument(document: { category: string; title: string; fileName: string; file: File | null }) {
    if (document.file) {
      const fileURL = URL.createObjectURL(document.file);
      window.open(fileURL, '_blank');
      console.log('Viewing document:', document.fileName);
    } else {
      alert('No file available to view.');
    }
  }
  
  // Handle file selection
  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.currentDocument.fileName = file.name;
      this.currentDocument.file = file;
      console.log('File selected:', file.name);
    }else {
      console.error('No file selected.');
    }
    
  }

  // Add a new document row
  addDocumentRow() {
    this.documents.push({ category: '', title: '', fileName: '', file: null });
  }

  // Confirm and approve action
  confirmAndApprove() {
    debugger
    const docPayload : DocumentPayload = {} ;
    const doc= this.currentDocument;
      if (doc.category && doc.file) { 
        const reader = new FileReader();
        if (doc.file) {
          console.log('File to be read:', doc.file);
        }
        
        reader.onload = () => {
          if (reader.result) {
            const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
            docPayload[doc.category] = {
              document: Array.from(fileBytes),
              value: doc.title,
              type: 'DOC' + Math.floor(100 + Math.random() * 900).toString(), 
              format: doc.fileName.split('.').pop() || '' 
            };
              this.uploadDocuments(docPayload);
          }
        };
        reader.readAsArrayBuffer(doc.file);
        reader.onerror = () => {
          console.error('Error reading file:', reader.error);
        };
        
      }
  }

  uploadDocuments(payload: any) {
    this.dataService.uploadDocuments(this.applicationId, payload).subscribe(
      (response) => {
        if (response?.response?.status === 'Success') {
          alert('All documents uploaded successfully.');
          this.closeDocumentUploadModal();
          
        } else {
          alert('Failed to upload documents. Please try again.');
        }
      },
      (error) => {
        console.error('Error uploading documents:', error);
        alert('An error occurred while uploading the documents.');
      }
    );
  }
  parseJson(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }
  }
  showDemographicData(registrationId: string){
    console.log("showDemographicData"+registrationId);
    this.dataService.fetchDemographicData("10040100290004320241210093511").subscribe(
      (response:any) => {
        console.log("response:: malay :: "+ response)
        if (response?.response?.response?.status === 'ACTIVATED') {
          this.demographicData = response.response.response.identity; // Pass identity data to child
         // Create a new window and navigate to 'demographic-details' route
        const newWindow = window.open(`/demographic-details`, '_blank', 'width=800,height=600');

        // Use localStorage to pass data to the new window
        if (newWindow) {
          localStorage.setItem('demographicData', JSON.stringify(this.demographicData));
        }
        } else {
          alert('Failed to fetch demographic data from id repo');
        }
      },
      (error) => {
        console.error('Error in fetching demographic data', error);
        alert('An error occurred while fetching demographic data from id repo');
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
  
  
}
