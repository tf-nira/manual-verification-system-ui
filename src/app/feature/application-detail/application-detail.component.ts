import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, REJECT, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS } from '../../shared/constants';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DemographicDetailsComponent,
    FormsModule,
    DocumentsUploadedComponent,
    HeaderComponent
],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})

export class ApplicationDetailComponent implements OnInit {
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
    UPLOAD_DCOUMENTS,
    APPLICANT_NAME
  }

  constructor(private router: Router) {}
  // Sample Data
  districtOffices: string[] = ['District Office 1', 'District Office 2', 'District Office 3'];
  documents = [
    { category: '', title: '', fileName: '', uploaded: false }, // Initial document row
  ];

  docCategories = ['Category 1', 'Category 2', 'Category 3']; // Example categories
  docTitles = ['Title 1', 'Title 2', 'Title 3']; // Example titles

  serviceType = ''; // Default value

  ngOnInit() {
    const state = history.state;

    this.role = state.role || '';
    this.rowData = state.data || {};
    if (this.role === 'MVS_DISTRICT_OFFICER') {
      this.applicationStatus = this.rowData['Application Status'];
    }


    this.serviceType = this.rowData['Service Type'] || '';

  }

  goBack() {
    this.router.navigate(['/application-list'],{
      state: { role: this.role, data: history.state.data }
    });
  }
  openApprovalModal() {
    this.showApprovalModal = true;
  }
  openEscalateModal() {
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
    this.showApprovalModal = false; 
  }
  escalateApplication() {
    // Escalate logic 
    this.showEscalateModal = false;
  }

  rejectApplication() {
    // Reject logic 
    this.showRejectModal = false;
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
      this.closeScheduleInterviewModal();
    } else {
      alert('Please fill all the required fields.');
    }
  }

  uploadFile(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.documents[index].uploaded = true; 
    }
  }

  // Handle upload action
  // handleUpload(index: number) {
  //   if (this.documents[index].fileName) {
  //     this.documents[index].uploaded = true; 
  //   }
  // }

  // Add a new document row
  addDocumentRow() {
    this.documents.push({ category: '', title: '', fileName: '', uploaded: false });
  }

  // Confirm and approve action
  confirmAndApprove() {
    console.log('Uploaded Documents:', this.documents);
    // Implement further actions, e.g., API call to save documents
  }
}
