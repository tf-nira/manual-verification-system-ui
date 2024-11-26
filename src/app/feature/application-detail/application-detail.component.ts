import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { DataStorageService } from '../../core/services/data-storage.service';

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
  showRejectModal: boolean = false;
  rowData: any = {};
  serviceType = ''; // Default value
  approvalComment: string = '';
  escalationComment: string = '';
  rejectionCategory: string = '';
  rejectionComment: string = '';
  
  constructor(private router: Router,private dataService: DataStorageService
  ) { }

  ngOnInit() {
     // Access the state object
     const state = history.state;

     // Retrieve role and row data
     this.role = state.role || '';
     this.rowData = state.data || {};
     // Retrieve serviceType from rowData
    this.serviceType = this.rowData['Service Type'] || '';
  }
  changeApplicationStatus(status: string, comment: string = '', rejectionCategory: string = ''){
    const applicationId = this.rowData.applicationId;
    this.dataService
      .changeStatus(applicationId,status,comment,rejectionCategory)
      .subscribe(
        (response) => {
        console.log('Status updated successfully:', response);
        alert(`Application ${status.toLowerCase()}d successfully.`);
        this.router.navigate(['/application-detail']); 
      },
      (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
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
}
