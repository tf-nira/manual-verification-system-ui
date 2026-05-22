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
  MVS_EXECUTIVE_DIRECTOR,
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
  API_CONST_SURNAME,
  API_CONST_GIVEN_NAME,
  API_CONST_DATE_OF_BIRTH,
  API_CONST_RESIDENCE_DISTRICT,
  API_CONST_ENROLMENT_DISTRICT,
  MVS_LEGAL_OFFICER,
  API_CONST_STAGE,
  API_CONST_PENDING,
  API_CONST_ASSIGNED_TO_DISTRICT_OFFICER,
  API_CONST_ASSIGNED_TO_LEGAL_OFFICER,
  API_CONST_INTERVIEW_SCHEDULED,
  API_CONST_FOUNDLINK,
  API_CONST_IN,
  API_CONST_AGE_GROUP,
  API_CONST_REJECTED,
  MVS_INTERNATIONAL_OFFICER,
  DATE_OF_BIRTH,
  SURNAME,
  GIVEN_NAME,
  DOB,
  RESIDENCE_DISTRICT,
  ENROLMENT_DISTRICT,
  MVS_SENIOR_REGISTRATION_OFFICER
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
  searchAttempted: boolean = false;
  role: string = '';
  fields: string[] = [];
  data: any[] = [];
  searchText: string = '';
  selectedService: string = '';
  selectedServiceType: string = '';
  foundling?: boolean | null; 
  dropdownOpen: boolean = false;
  filteredServiceTypes= FILTERED_SERVICE_TYPES; // Holds the filtered service types
  searchSurname: string = '';
  searchGivenName: string = '';
  residenceDistrict: string ='';
  enrolmentDistrict: string ='';
  selectedApplicationStatus: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  //today: string = new Date().toISOString().split('T')[0];
  minToDate: Date | null = null;
  fromDateMax: Date = new Date(); // Default max date is today
  maxToDate: Date | null = null;
  toDateInputType: string = 'text';  // Start as text to prevent pre-filling
  districtMasterData: string[] = [];
  isPanelExpanded = false;
  selectedRow: any = null;
  expandedSections: { [key: string]: boolean } = {};

  uniqueServices: string[] = [];
  uniqueServiceTypes: string[] = [];
  uniqueApplicationStatuses: string[] = [];

  specialAlienServices: string[] = [
  'Alien New Registration',
  'Renewal of Alien',
  'Alien Replacement'
  ];
  
  servicesWithTypes = SERVICES_WITH_TYPES;
  dob: Date | null = null;
  maxDob: Date = new Date();
  ageGroups: string[] = []; 
  selectedAgeGroups: string[] = []; 
  applicationStatuses = ['Pending', 'Interview Scheduled'];
  applicationType: string = 'Assigned'; // Default to 'Assigned'
  rejectedApplicationId: string = ''; // For rejected applications search
  // Add this method to handle application type toggle from header
  onApplicationTypeChange(newType: string): void {
    this.applicationType = newType;
    this.clearFilters();
    this.data = [];
    this.totalRecords = 0;
    this.searchAttempted = false;
  }

  searchRejectedApplication(): void {
    if (!this.rejectedApplicationId.trim()) {
      alert('Please enter an Application ID');
      return;
    }
  
    this.dataService.fetchRejectedApplication(this.rejectedApplicationId).subscribe(
      (appResponse: any) => {
        if (appResponse && appResponse.response) {
          // Check if there's a valid response with applicationId
          if (appResponse.response.applicationId) {
            // Convert the single application object into an array for consistency
            this.data = [appResponse.response];
            const rejectionDetails = {
              rejectedByOfficerRole: appResponse.response.lastAssignedOfficerRole,
              rejectionCategory: appResponse.response.rejectionCategory,
              rejectionComment: appResponse.response.rejectionComment,
              rejectedByOfficerId: appResponse.response.lastAssignedOfficerId,
              rejectionTimeStamp: appResponse.response.lastUpdatedTimes
            };
            localStorage.setItem('rejectionDetails', JSON.stringify(rejectionDetails));
            this.totalRecords = 1;
          } else {
            this.data = [];
            this.totalRecords = 0;
            alert('No rejected application found with the given ID');
          }
        } else if (appResponse.errors && appResponse.errors.length) {
          console.error('API Errors:', appResponse.errors);
          this.data = [];
          this.totalRecords = 0;
          alert('Error fetching rejected application: ' + appResponse.errors[0]?.message || 'Unknown error');
        }
      },
      (appError) => {
        console.error('Error fetching rejected application:', appError);
        this.data = [];
        this.totalRecords = 0;
        alert('Failed to fetch rejected application. Please try again later.');
      }
    );
  }
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
    MVS_EXECUTIVE_DIRECTOR,
    MVS_LEGAL_OFFICER,
    API_CONST_APPLICATION_ID,
    API_CONST_SERVICE,
    API_CONST_SERVICE_TYPE,
    API_CONST_CREATED_DATE,
    API_CONST_ASSIGNED_OFFICER_ID,
    API_CONST_USER_ID,
    API_CONST_EQUALS,
    API_CONST_STATUS,
    MVS_INTERNATIONAL_OFFICER,
    DATE_OF_BIRTH,
    API_CONST_SURNAME,
    API_CONST_GIVEN_NAME,
    API_CONST_DATE_OF_BIRTH,
    API_CONST_RESIDENCE_DISTRICT,
    API_CONST_ENROLMENT_DISTRICT,
    SURNAME,
    GIVEN_NAME,
    DOB,
    RESIDENCE_DISTRICT,
    ENROLMENT_DISTRICT,
    MVS_SENIOR_REGISTRATION_OFFICER
  };

  constructor(
    private router: Router,
    private dataService: DataStorageService
  ) {}

  ngOnInit() {
    const ageGroupRanges = JSON.parse(localStorage.getItem('ageGroupRanges') || '[]');
    this.ageGroups = ageGroupRanges.map((group: any) => `${group.groupName}(${group.range})`);
    this.districtMasterData = JSON.parse(localStorage.getItem('districtMasterData') || '[]');
    this.maxToDate = new Date();
    this.temp = this.currentPage + 1;
    this.role = history.state.role;
    this.fields = ROLE_FIELDS_MAP[this.role];

    //checking if application type is passed from state when  navigating back.
    if(history.state.applicationType){
      this.applicationType = history.state.applicationType;
    }

    // Checking if filters are saved in localStorage
    const savedFilters = localStorage.getItem('applicationListFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);

      if (filters.applicationType) {
        this.applicationType = filters.applicationType;
      }
      if (filters.rejectedApplicationId) {
        this.rejectedApplicationId = filters.rejectedApplicationId;
      }

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
      if(filters.searchSurname?.trim()) {
        this.searchSurname = filters.searchSurname;
      }
      if(filters.searchGivenName?.trim()) {
        this.searchGivenName = filters.searchGivenName;
      }
      if(filters.dob?.trim()) {
        this.dob = filters.dob;
      }
      if(filters.residenceDistrict?.trim()) {
        this.residenceDistrict = filters.residenceDistrict;
      }
      if(filters.enrolmentDistrict?.trim()) {
        this.enrolmentDistrict = filters.enrolmentDistrict;
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
      // this.fetchApplicationList(localStorage.getItem(API_CONST_USER_ID) || '');

      if (this.applicationType === 'Assigned') {
        this.fetchApplicationList(localStorage.getItem(API_CONST_USER_ID) || '');
      } else if (this.applicationType === 'Rejected' && this.rejectedApplicationId) {
        this.searchRejectedApplication();
      } else {
        // Don't fetch data for rejected applications until search is clicked
        this.data = [];
        this.totalRecords = 0;
      }
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
    } else {
      this.minToDate = null; 
    }
  }

  updateMaxFromDate() {
    if (this.toDate) {
      this.fromDateMax = this.toDate;
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
    this.foundling = null;
    this.selectedAgeGroups = [];
    this.rejectedApplicationId = '';
    this.searchSurname = '';
    this.searchGivenName = '';
    this.dob = null;
    this.residenceDistrict = '';
    this.enrolmentDistrict = '';
    // Don't reload data for rejected applications until search is clicked
    if (this.applicationType === 'Assigned') {
      this.search();
    } else {
      // Clear the data for rejected applications
      this.data = [];
      this.totalRecords = 0;
    }
    this.searchAttempted = false;
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
      sortDirection: this.sortDirection,
      applicationType: this.applicationType,
      rejectedApplicationId: this.rejectedApplicationId,
      searchSurname: this.searchSurname,
      searchGivenName: this.searchGivenName,
      dob: this.dob,
      residenceDistrict: this.residenceDistrict,
      enrolmentDistrict: this.enrolmentDistrict
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
          state: { role: this.role, data: response.response ,rowData: rowData, applicationType: this.applicationType},
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
    if (this.applicationType === 'Rejected') {
      this.searchAttempted = true;
      this.searchRejectedApplication();
      return;
    }

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
      value: string | string[] | undefined | Date | null,
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
    // addFilter(this.selectedService, API_CONST_SERVICE, API_CONST_EQUALS);
    if (this.specialAlienServices.includes(this.selectedService)) {
        addFilter(this.selectedService, API_CONST_SERVICE_TYPE, API_CONST_EQUALS);
      } else {
        addFilter(this.selectedService, API_CONST_SERVICE, API_CONST_EQUALS);
      }
    addFilter(this.selectedServiceType, API_CONST_SERVICE_TYPE, API_CONST_EQUALS);
    addFilter(this.searchSurname, API_CONST_SURNAME, API_CONST_EQUALS);
    addFilter(this.searchGivenName, API_CONST_GIVEN_NAME, API_CONST_EQUALS);
    addFilter(this.residenceDistrict, API_CONST_RESIDENCE_DISTRICT, API_CONST_EQUALS);
    addFilter(this.enrolmentDistrict, API_CONST_ENROLMENT_DISTRICT, API_CONST_EQUALS);
    //addFilter("pandey","givenName",API_CONST_EQUALS);
    //addFilter("1998-01-01T00:00:00.000000", "dateOfBirth", API_CONST_EQUALS)
    //addFilter("KABERAMAIDO (54)","applicantPlaceOfEnrolmentDistrict",API_CONST_EQUALS)
    const selectedAgeGroupsFormat = this.selectedAgeGroups.map(age => age.split('(')[0].trim());
    addFilter(selectedAgeGroupsFormat, API_CONST_AGE_GROUP, API_CONST_IN);
    
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
    let fromValue, toValue;
    if (this.fromDate) {
      console.log("From Date :: " + this.fromDate)
      const from_date = new Date(this.fromDate);
      from_date.setHours(0, 0, 0, 0);
      fromValue = `${from_date.getFullYear()}-${String(from_date.getMonth() + 1).padStart(2, '0')}-${String(from_date.getDate()).padStart(2, '0')}T${String(from_date.getHours()).padStart(2, '0')}:${String(from_date.getMinutes()).padStart(2, '0')}:${String(from_date.getSeconds()).padStart(2, '0')}.000000`;
      console.log("from date value is :: "+ fromValue);
      if (this.toDate) {
        const to_date = new Date(this.toDate);
        to_date.setHours(23, 59, 59, 999);
        toValue = `${to_date.getFullYear()}-${String(to_date.getMonth() + 1).padStart(2, '0')}-${String(to_date.getDate()).padStart(2, '0')}T${String(to_date.getHours()).padStart(2, '0')}:${String(to_date.getMinutes()).padStart(2, '0')}:${String(to_date.getSeconds()).padStart(2, '0')}.999999`;
      }
      else {
        const to_date = new Date();
        to_date.setHours(23, 59, 59, 999);
        toValue = `${to_date.getFullYear()}-${String(to_date.getMonth() + 1).padStart(2, '0')}-${String(to_date.getDate()).padStart(2, '0')}T${String(to_date.getHours()).padStart(2, '0')}:${String(to_date.getMinutes()).padStart(2, '0')}:${String(to_date.getSeconds()).padStart(2, '0')}.999999`;
      }

      filters = filters.concat({
        fromValue: fromValue,
        toValue: toValue,
        columnName: API_CONST_CREATED_DATE,
        type: API_CONST_BETWEEN,
      });
    }
    let dobValue;
    if(this.dob) {
      console.log("Date of birth :: "+ this.dob);
      const date_of_birth = new Date(this.dob);
      date_of_birth.setHours(0, 0, 0, 0);
      dobValue = `${date_of_birth.getFullYear()}-${String(date_of_birth.getMonth() + 1).padStart(2, '0')}-${String(date_of_birth.getDate()).padStart(2, '0')}T${String(date_of_birth.getHours()).padStart(2, '0')}:${String(date_of_birth.getMinutes()).padStart(2, '0')}:${String(date_of_birth.getSeconds()).padStart(2, '0')}.000000`;
      console.log("from date value is :: "+ fromValue);
    }
    addFilter(dobValue, API_CONST_DATE_OF_BIRTH, API_CONST_EQUALS);

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
          if (this.currentPage > 0) this.changePage(0);
          else {
            this.totalRecords = 0;
          }
        }
      },
      (appError) => {
        console.error('Error fetching application list:', appError);
      }
    );
  }  
}
