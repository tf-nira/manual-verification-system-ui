import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { DemographicDetailsComponent } from '../demographic-details/demographic-details.component';
import { DocumentsUploadedComponent } from '../documents-uploaded/documents-uploaded.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    DemographicDetailsComponent,
    FormsModule,
    DocumentsUploadedComponent
  ],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent {
  selectedTab: string = 'demographic'; // Default to 'demographic'
  escalateOption: boolean = false;
  showApprovalModal: boolean = false;
  showEscalateModal: boolean = false;
  showRejectModal: boolean = false;
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
    this.showApprovalModal = false; 
  }
  escalateApplication() {
    // Escalate logic here
    this.showEscalateModal = false;
  }

  rejectApplication() {
    // Reject logic here
    this.showRejectModal = false;
  }
  // Method to change tabs
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }
}
