import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import {
  APPLICATION_ID,
  APPLICATION_STATUS,
  CATEGORY,
  CLEAR_FILTERS,
  COMMENT,
  CREATED_DATE,
  ESCALATED_DATE,
  ESCALATION_CATEGORY,
  ESCALATION_CATEGORY_FROM_MVS_OFFICER,
  ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR,
  ESCALATION_COMMENT,
  ESCALATION_COMMENT_FROM_MVS_OFFICER,
  ESCALATION_COMMENT_FROM_MVS_SUPERVISOR,
  ESCALATION_DATE,
  FROM_DATE,
  MVS_DISTRICT_OFFICER,
  MVS_OFFICER_ESCALATED_DATE,
  MVS_SUPERVISOR_ESCALATED_DATE,
  SERVICE,
  SERVICE_TYPE,
  TO_DATE,
  SEARCH,
  API_CONST_APPLICATION_ID,
  API_CONST_SERVICE,
  API_CONST_SERVICE_TYPE,
  API_CONST_CREATED_DATE,
  API_CONST_ASSIGNED_OFFICER_ID,
  API_CONST_USER_ID,
  API_CONST_EQUALS,
  API_CONST_BETWEEN,
  API_CONST_REG_ID,
  API_CONST_CONTAINS,
  API_CONST_STATUS,
  API_CONST_FROM_DATE,
  API_CONST_TO_DATE,
  MVS_LEGAL_OFFICER,
  API_CONST_STAGE,
  API_CONST_PENDING,
  API_CONST_ASSIGNED_TO_DISTRICT_OFFICER,
  API_CONST_ASSIGNED_TO_LEGAL_OFFICER,
  API_CONST_INTERVIEW_SCHEDULED,
} from '../../shared/constants';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-application-list',
  standalone: true,
  providers: [DataStorageService, ConfigService],
  imports: [NgFor, NgIf, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css',
})
export class ApplicationListComponent implements OnInit {
  //pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  temp: number = 1;

  isFiltersCollapsed: boolean = false;

  // Sorting state
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  role: string = '';
  fields: string[] = [];
  data: any[] = [];
  searchText: string = '';

  selectedService: string = '';
  selectedServiceType: string = '';
  filteredServiceTypes: { value: string; label: string }[] = [
    { value: 'By Birth /Descent', label: 'Registration of citizens by birth' },
    { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
    { value: 'By Naturalization', label: 'Registration of Citizens by Naturalization' },
    { value: 'By Registration', label: 'Registration of Citizens by Registration' },
    { value: 'Dual Citizenship', label: 'Registration of Dual Citizens' },
    { value: 'By Birth /Descent', label: 'Registration of Child Citizens by birth' },
    { value: 'By Birth /Descent', label: 'Registration of Foundlings' },
    { value: 'Renewal', label: 'Renewal of a card' },
    { value: 'Replacement', label: 'Replacement of a card' },
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

  selectedApplicationStatus: string = '';
  fromDate: string = '';
  toDate: string = '';

  isPanelExpanded = false;
  selectedRow: any = null;
  expandedSections: { [key: string]: boolean } = {};

  uniqueServices: string[] = [];
  uniqueServiceTypes: string[] = [];
  uniqueApplicationStatuses: string[] = [];
  
  servicesWithTypes = [
    {
      value: 'NEW',
      label: 'New registrations',
      serviceTypes: [
        { value: 'By Birth /Descent', label: 'Registration of citizens by birth' },
        { value: 'Citizenship under the Article 9', label: 'Citizenship under the Article 9' },
        { value: 'By Naturalization', label: 'Registration of Citizens by Naturalization' },
        { value: 'By Registration', label: 'Registration of Citizens by Registration' },
        { value: 'Dual Citizenship', label: 'Registration of Dual Citizens' }
      ]
    },
    {
      value: 'RENEWAL',
      label: 'Renewal of card',
      serviceTypes: [
        { value: 'Renewal', label: 'Renewal of a card' },
        { value: 'Replacement', label: 'Replacement of a card' }
      ]
    },
    {
      value: 'LOST',
      label: 'Lost/ Replacement of card',
      serviceTypes: [
        { value: 'Renewal', label: 'Renewal of a card' },
        { value: 'Replacement', label: 'Replacement of a card' }
      ]
    },
    {
      value: 'UPDATE',
      label: 'Change of Particulars',
      serviceTypes: [
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
      ]
    }
  ];
  
  
  applicationStatuses = ['Pending', 'Interview Scheduled'];

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
    MVS_DISTRICT_OFFICER,
    MVS_LEGAL_OFFICER,
    API_CONST_APPLICATION_ID,
    API_CONST_SERVICE,
    API_CONST_SERVICE_TYPE,
    API_CONST_CREATED_DATE,
    API_CONST_ASSIGNED_OFFICER_ID,
    API_CONST_USER_ID,
    API_CONST_EQUALS,
    API_CONST_STATUS,
  };

  constructor(
    private router: Router,
    private dataService: DataStorageService
  ) {}

  ngOnInit() {
    this.temp = this.currentPage + 1;
    this.role = history.state.role;
    this.fields = ROLE_FIELDS_MAP[this.role];
    this.fetchApplicationList(localStorage.getItem(API_CONST_USER_ID) || '');
  }

  fetchApplicationList(userId: string) {
    //filters, sort should come from ui
    const filters = [
      {
        value: userId,
        columnName: API_CONST_ASSIGNED_OFFICER_ID,
        type: API_CONST_EQUALS,
      },
    ];
    const sort = [
      {
        sortField: API_CONST_CREATED_DATE,
        sortType: 'desc',
      },
    ];
    const pagination = {
      pageStart: 0,
      pageFetch: this.pageSize,
    };
    this.dataService.fetchApplicationList(filters, sort, pagination).subscribe(
      (appResponse: any) => {
        if (appResponse && appResponse.response && appResponse.response.data) {
          this.data = appResponse.response.data;
          this.totalRecords = appResponse.response.totalRecord || 0;
          this.data.forEach((application: any) => {});
        } else if (appResponse.errors && appResponse.errors.length) {
          console.error('API Errors:', appResponse.errors);
        }
      },
      (appError) => {
        console.error('Error fetching application list:', appError);
      }
    );
  }
  onServiceChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedService = this.servicesWithTypes.find(service => service.value === selectedValue);
    this.filteredServiceTypes = selectedService ? selectedService.serviceTypes : [];
  }
  togglePanel() {
    this.isPanelExpanded = !this.isPanelExpanded;
  }

  toggleEscalation(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
  
  isEscalationExpanded(section: string): boolean {
    return this.expandedSections[section] || false;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 0;
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.temp = this.currentPage + 1; // Update input field
      this.search();
    }
  }

  jumpToPage(pageInput: number) {
    const newPage = pageInput - 1; // Convert 1-based input to 0-based index
    if (newPage >= 0 && newPage < this.totalPages) {
      this.changePage(newPage);
    } else {
      this.temp = this.currentPage + 1; // Reset input if invalid
    }
  }
  // Sorting logic
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Toggle direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column and default direction
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.search();
  }

  getSortClass(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'sort-icon-asc' : 'sort-icon-desc';
    }
    return 'sort-icon-default';
  }

  toggleFilters() {
    this.isFiltersCollapsed = !this.isFiltersCollapsed;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedService = '';
    this.selectedServiceType = '';
    this.selectedApplicationStatus = '';
    this.fromDate = '';
    this.toDate = '';
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.isPanelExpanded = true;
  }

  onRowClick(event: MouseEvent, rowData: any) {
    event.stopPropagation();

    // get application details api
    const applicationId = rowData[this.constants.API_CONST_APPLICATION_ID];
    this.dataService.getApplicationDetails(applicationId).subscribe(
      (response: any) => {
        // Navigate to the details page with fetched data
        this.router.navigate(['/application-detail'], {
          state: { role: this.role, data: response.response ,rowData: rowData},
        });
      },
      (error) => {
        console.error('Error fetching application details:', error);
        alert('Failed to fetch application details.');
      }
    );
  }

  search() {
    const userId = localStorage.getItem(API_CONST_USER_ID) || '';
    let filters: { value?: string; fromValue?: string; toValue?: string; columnName: string; type: string }[] = [
      {
        value: userId,
        columnName: API_CONST_ASSIGNED_OFFICER_ID,
        type: API_CONST_EQUALS,
      },
    ];
  
    // Helper function to add filters safely
    const addFilter = (
      value: string | undefined,
      columnName: string,
      type: string
    ) => {
      if (value?.trim()) {
        filters = filters.concat({ value: value.trim(), columnName, type });
      }
    };
  
    // Add filters for optional parameters
    addFilter(this.searchText, API_CONST_REG_ID, API_CONST_CONTAINS);
    addFilter(this.selectedService, API_CONST_SERVICE, API_CONST_EQUALS);
    addFilter(this.selectedServiceType, API_CONST_SERVICE_TYPE, API_CONST_EQUALS);
    
    if (this.selectedApplicationStatus == API_CONST_PENDING) {
      if (this.role == MVS_DISTRICT_OFFICER) addFilter(API_CONST_ASSIGNED_TO_DISTRICT_OFFICER, API_CONST_STAGE, API_CONST_EQUALS);
      else if (this.role == MVS_LEGAL_OFFICER) addFilter(API_CONST_ASSIGNED_TO_LEGAL_OFFICER, API_CONST_STAGE, API_CONST_EQUALS);
    }
    else if (this.selectedApplicationStatus == 'Interview Scheduled') addFilter(API_CONST_INTERVIEW_SCHEDULED, API_CONST_STAGE, API_CONST_EQUALS);

    // Add "between" filter for dates
    if (this.fromDate && this.toDate) {
      const fromValue = new Date(this.fromDate).toISOString().replace('Z', '').replace(/\.\d+$/, '.000000');
      const date = new Date(this.toDate);
      date.setHours(23, 59, 59, 999);
      const toValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.999999`;

      filters = filters.concat({
        fromValue: fromValue,
        toValue: toValue,
        columnName: API_CONST_CREATED_DATE,
        type: API_CONST_BETWEEN,
      });
    }
  
    const sort = [
      {
        sortField: this.sortColumn === API_CONST_APPLICATION_ID ? API_CONST_REG_ID : this.sortColumn || API_CONST_CREATED_DATE,
        sortType: this.sortDirection || 'desc',
      },
    ];
    const pagination = {
      pageStart: this.currentPage,
      pageFetch: this.pageSize,
    };
  
    this.dataService.fetchApplicationList(filters, sort, pagination).subscribe(
      (appResponse: any) => {
        if (appResponse && appResponse.response && appResponse.response.data) {
          this.data = appResponse.response.data;
        } else {
          this.data = [];
        }
      },
      (appError) => {
        console.error('Error fetching application list:', appError);
      }
    );
  }  
}
