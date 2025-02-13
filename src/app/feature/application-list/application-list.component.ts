import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter  } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MY_DATE_FORMATS } from '../../shared/date-format';
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
  API_CONST_FOUNDLINK,
  API_CONST_IN,
  API_CONST_AGE_GROUP
} from '../../shared/constants';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ConfigService } from '../../core/services/config.service';
import { FILTERED_SERVICE_TYPES, SERVICES_WITH_TYPES } from '../../shared/constants';
import { CustomDateAdapter } from '../../shared/custom-date-adapter';

@Component({
  selector: 'app-application-list',
  standalone: true,
  providers: [DataStorageService, ConfigService,
    { provide: DateAdapter, useClass: CustomDateAdapter }, 
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },  
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }  
  ],
  imports: [NgFor, NgIf, HeaderComponent, FormsModule, CommonModule, MatNativeDateModule,
    MatDatepickerModule, MatFormFieldModule,   
    MatInputModule   
  ],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
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
  sortDirection: 'asc' | 'desc' = 'desc';

  role: string = '';
  fields: string[] = [];
  data: any[] = [];
  searchText: string = '';
  selectedService: string = '';
  selectedServiceType: string = '';
  foundling?: boolean | null; 
  dropdownOpen: boolean = false;
  filteredServiceTypes= FILTERED_SERVICE_TYPES; // Holds the filtered service types
  
  selectedApplicationStatus: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  //today: string = new Date().toISOString().split('T')[0];
  minToDate: Date | null = null;
  fromDateMax: Date = new Date(); // Default max date is today
  toDateInputType: string = 'text';  // Start as text to prevent pre-filling

  isPanelExpanded = false;
  selectedRow: any = null;
  expandedSections: { [key: string]: boolean } = {};

  uniqueServices: string[] = [];
  uniqueServiceTypes: string[] = [];
  uniqueApplicationStatuses: string[] = [];
  
  servicesWithTypes = SERVICES_WITH_TYPES;
  
  ageGroups: string[] = ['INFANT', 'MINOR', 'ADULT']; 
  selectedAgeGroups: string[] = []; 
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
    // Checking if filters are saved in localStorage
    const savedFilters = localStorage.getItem('applicationListFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);

      // Apply filters only if they have valid values
      if (filters.searchText?.trim()) {
        this.searchText = filters.searchText;
      }
      if (filters.selectedService) {
        this.selectedService = filters.selectedService;
      }
      if (filters.selectedServiceType) {
        this.selectedServiceType = filters.selectedServiceType;
      }
      if (filters.selectedApplicationStatus) {
        this.selectedApplicationStatus = filters.selectedApplicationStatus;
      }
      if (filters.fromDate) {
        this.fromDate = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        this.toDate = new Date(filters.toDate);
      }
      if (filters.foundling !== null && filters.foundling !== undefined) {
        this.foundling = filters.foundling;
      }
      if (Array.isArray(filters.selectedAgeGroups) && filters.selectedAgeGroups.length > 0) {
        this.selectedAgeGroups = filters.selectedAgeGroups;
      }
      if (typeof filters.currentPage === 'number' && filters.currentPage >= 0) {
        this.currentPage = filters.currentPage;
      }
      if (filters.sortColumn) {
        this.sortColumn = filters.sortColumn;
      }
      if (filters.sortDirection) {
        this.sortDirection = filters.sortDirection;
      }
      this.search();
      localStorage.removeItem('applicationListFilters');
    } else {
      this.fetchApplicationList(localStorage.getItem(API_CONST_USER_ID) || '');
    }
  }
  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Toggle selection of options
  toggleSelection(age: string) {
    if (this.selectedAgeGroups.includes(age)) {
      this.selectedAgeGroups = this.selectedAgeGroups.filter(item => item !== age);
    } else {
      this.selectedAgeGroups.push(age);
    }
    console.log("this.selectedAgeGroups "+this.selectedAgeGroups)
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
    this.selectedService = selectedValue; 
    this.selectedServiceType = '';
    if (selectedValue) {
    const selectedService = this.servicesWithTypes.find(service => service.value === selectedValue);
    
    this.filteredServiceTypes = selectedService ? selectedService.serviceTypes : [];
  } else {// Clear service types if no service is selected
    this.filteredServiceTypes = [];
  }
  }

  onServiceTypeChange(event: Event): void {
    if(this.selectedServiceType !== 'BY_BIRTH_SERVICE_TYPE'){
      this.foundling = null;
    }
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

  updateMinToDate() {
    if (this.fromDate) {
      this.minToDate = this.fromDate; 
      if (this.toDate && this.toDate < this.fromDate) {
        this.toDate = null; 
      }
    } else {
      this.minToDate = null; 
    }
  }

  updateMaxFromDate() {
    if (this.toDate) {
      this.fromDateMax = this.toDate < this.fromDateMax ? this.toDate : this.fromDateMax;
    } else {
      this.fromDateMax = new Date(); 
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
    this.fromDate = null;
    this.toDate = null;
    this.minToDate = null;
    this.fromDateMax = new Date();
    this.foundling=null;
    this.selectedAgeGroups=[];
  }

  onRowClick(event: MouseEvent, rowData: any) {
    event.stopPropagation();

    //saving the current filter state.
    const filterState = {
      searchText: this.searchText,
      selectedService: this.selectedService,
      selectedServiceType: this.selectedServiceType,
      selectedApplicationStatus: this.selectedApplicationStatus,
      fromDate: this.fromDate,
      toDate: this.toDate,
      foundling: this.foundling,
      selectedAgeGroups: this.selectedAgeGroups,
      currentPage: this.currentPage,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection
    };

    //removing null, empty values from filter
    const cleanedFilterState = this.cleanFilterState(filterState);
    localStorage.setItem('applicationListFilters', JSON.stringify(cleanedFilterState));


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

  cleanFilterState(filterState: any) {
    return Object.keys(filterState).reduce((acc, key) => {
      const value = filterState[key];
      if (
        value !== null &&
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== '') &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  }
  
  search() {
    const userId = localStorage.getItem(API_CONST_USER_ID) || '';
    let filters: { value?: string; values?: string[] ; fromValue?: string; toValue?: string; columnName: string; type: string }[] = [
      {
        value: userId,
        columnName: API_CONST_ASSIGNED_OFFICER_ID,
        type: API_CONST_EQUALS,
      },
    ];
  
    // Helper function to add filters safely
    const addFilter = (
      value: string | string[] | undefined,
      columnName: string,
      type: string
    ) => {
      if (Array.isArray(value) && value.length > 0
        && value.filter(v => v !== null && v !== undefined && v !== '').length > 0) {
        filters = filters.concat({ values: value, columnName, type });
      } else if (typeof value === "string" && value.trim()) {
        // If value is a single string
        filters = filters.concat({ value: value.trim(), columnName, type });
      }
    };
  
    // Add filters for optional parameters
    addFilter(this.searchText, API_CONST_REG_ID, API_CONST_CONTAINS);
    addFilter(this.selectedService, API_CONST_SERVICE, API_CONST_EQUALS);
    addFilter(this.selectedServiceType, API_CONST_SERVICE_TYPE, API_CONST_EQUALS);
    addFilter(this.selectedAgeGroups, API_CONST_AGE_GROUP, API_CONST_IN);
    if (this.foundling !== null && this.foundling !== undefined) {
    const foundlingValue = this.foundling ? "Y" : "N";
    addFilter(foundlingValue, API_CONST_FOUNDLINK, API_CONST_EQUALS);
    }
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
          this.totalRecords = appResponse.response.totalRecord || 0;
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
