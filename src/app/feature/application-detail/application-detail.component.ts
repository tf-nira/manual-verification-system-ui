import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { APPLICANT_NAME, APPLICATION_ID, APPLICATION_STATUS, APPROVE, AUTO_RETRIEVE_NIN_DETAILS, BACK, CREATED_DATE, DEMOGRAPHIC_DETAILS, DOCUMENTS_UPLOADED, ESCALATE, ESCALATION_REASON_FROM_MVS_OFFICER, ESCALATION_REASON_FROM_MVS_SUPERVISOR, MVS_DISTRICT_OFFICER, REJECT, SCHEDULE_INTERVIEW, SERVICE, SERVICE_TYPE, UPLOAD_DCOUMENTS } from '../../shared/constants';
import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';

type DocumentPayload = {
  [key: string]: {
    document: number[]; // Array of file bytes
    value: string; // Title
    type: string; // Document type
    format: string; // File format
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

  service: string = '';
  serviceType: string = ''; // Default value
  approvalComment: string = '';
  applicationId: string = '';
  commentMVSOfficer: string = '';
  commentMVSSupervisor: string = ''
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';

  isEditable: boolean = false;
  documents: { category: string; title: string; fileName: string; file: File | null }[] = [
    { category: '', title: '', fileName: '', file: null }
  ];

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
  // documents = [
  //   { category: '', title: '', fileName: '', uploaded: false }, // Initial document row
  // ];

  docCategories = ['Category 1', 'Category 2', 'Category 3']; // Example categories
  docTitles = ['Title 1', 'Title 2', 'Title 3']; // Example titles
  applicantName = 'Steve Smith' //field value will come from the /applications/{appId} api response

  constructor(private router: Router, private dataService: DataStorageService) { }

  ngOnInit() {
    const state = history.state;

    this.role = state.role || '';
    this.rowData = state.data || {};
    console.log(this.rowData)
    if (this.role === 'MVS_DISTRICT_OFFICER' || this.role === 'MVS_LEGAL_OFFICER') {
      this.applicationStatus = this.rowData['Application Status'];
    }

    this.serviceType = this.rowData.serviceType || '';
    this.applicationId = this.rowData.applicationId || '';
    this.service = this.rowData.service || '';
    this.commentMVSOfficer = this.rowData["Escalation Comment From MVS Officer"] || '';
    this.commentMVSSupervisor = this.rowData["Escalation Comment From MVS Supervisor"] || '';


  }

  changeApplicationStatus(status: string, comment: string = '', rejectionCategory: string = '') {
    const applicationId = this.rowData.applicationId;
    this.dataService
      .changeStatus(applicationId, status, comment, rejectionCategory)
      .subscribe(
        (response) => {
          console.log('Status updated successfully:', response);
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
    const comment = this.approvalComment.trim();
    this.changeApplicationStatus('APPROVE', comment);
    this.closeEscalateModal();
  }
  escalateApplication() {
    // Escalate logic 
    this.showEscalateModal = false;
    const comment = this.escalationComment.trim();
    console.log(comment)
    this.changeApplicationStatus('ESCALATE', comment);
    this.closeEscalateModal();
  }

  rejectApplication() {
    // Reject logic 
    this.showRejectModal = false;
    const rejectionCategory = this.rejectionCategory;
    const comment = this.rejectionComment.trim();
    this.changeApplicationStatus('REJECT', comment, rejectionCategory);
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
    this.documents.push({ category: '', title: '', fileName: '', file: null });
  }

  // Confirm and approve action
  confirmAndApprove() {
    const payload: {
      id: string;
      version: string;
      requesttime: string;
      metadata: null;
      request: {
        documents: DocumentPayload;
      };
    } = {
      id: 'id',
      version: 'v1',
      requesttime: new Date().toISOString(),
      metadata: null,
      request: {
        documents: {}
      }
    };
  
    this.documents.forEach((doc) => {
      if (doc.category && doc.file) { // Ensure doc.file is not null
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
            payload.request.documents[doc.category] = {
              document: Array.from(fileBytes),
              value: doc.title,
              type: 'DOC' + Math.floor(100 + Math.random() * 900).toString(), // Example type generation
              format: doc.fileName.split('.').pop() || '' // Safely access doc.file.name
            };
  
            if (Object.keys(payload.request.documents).length === this.documents.length) {
              this.uploadDocuments(payload); // Call API only after all documents are processed
            }
          }
        };
        reader.readAsArrayBuffer(doc.file);
      }
    });
  }

  uploadDocuments(payload: any) {
    this.dataService.uploadDocuments(this.applicationId, payload).subscribe(
      (response) => {
        if (response?.response?.status === 'Success') {
          alert('All documents uploaded successfully.');
          
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

}
