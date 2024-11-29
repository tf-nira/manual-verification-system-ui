import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FormsModule } from '@angular/forms';
import { APPLICATION_ID, APPLICATION_STATUS, CATEGORY, CLEAR_FILTERS, COMMENT, CREATED_DATE, ESCALATED_DATE, ESCALATION_CATEGORY, ESCALATION_CATEGORY_FROM_MVS_OFFICER, ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR, ESCALATION_COMMENT, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_DATE, FROM_DATE, MVS_DISTRICT_OFFICER, MVS_OFFICER_ESCALATED_DATE, MVS_SUPERVISOR_ESCALATED_DATE, SERVICE, SERVICE_TYPE, TO_DATE, SEARCH } from '../../shared/constants';
import { ROLE_DATA_MAP } from '../../shared/application-data';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [NgFor, NgIf, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {

  role: string = '';
  fields: string[] = [];
  data: any[] = [];
  searchText: string = '';

  selectedService: string = '';
  selectedServiceType: string = '';
  selectedApplicationStatus: string = '';
  fromDate: string = '';
  toDate: string = '';

  uniqueServices: string[] = [];
  uniqueServiceTypes: string[] = [];
  uniqueApplicationStatuses: string[] = [];

  constants = {
    SEARCH,
    FROM_DATE,
    TO_DATE,
    CLEAR_FILTERS,
    CATEGORY,
    COMMENT,
    ESCALATION_DATE,
    APPLICATION_ID,
    SERVICE,
    SERVICE_TYPE,
    CREATED_DATE,
    ESCALATION_CATEGORY,
    ESCALATION_COMMENT,
    ESCALATED_DATE,
    ESCALATION_CATEGORY_FROM_MVS_OFFICER,
    ESCALATION_COMMENT_FROM_MVS_OFFICER,
    MVS_OFFICER_ESCALATED_DATE,
    ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR,
    ESCALATION_COMMENT_FROM_MVS_SUPERVISOR,
    MVS_SUPERVISOR_ESCALATED_DATE,
    APPLICATION_STATUS,
    MVS_DISTRICT_OFFICER
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = history.state.role;
    this.data = ROLE_DATA_MAP[this.role];

    this.fields = ROLE_FIELDS_MAP[this.role];
  }

  search() {
    // call search api with searchText, selectedService, selectedServiceType, selectedApplicationStatus, fromDate, toDate
  }

  clearFilters() {
    this.searchText = '';
    this.selectedService = '';
    this.selectedServiceType = '';
    this.selectedApplicationStatus = '';
    this.fromDate = '';
    this.toDate = '';
  }

  onRowClick(rowData: any) {
    // get application details api
    this.router.navigate(['/application-detail'], { state: { role: this.role, data: rowData }});
  }
}


