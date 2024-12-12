import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FormsModule } from '@angular/forms';
import { APPLICATION_ID, APPLICATION_STATUS, CATEGORY, CLEAR_FILTERS, COMMENT, CREATED_DATE, ESCALATED_DATE, ESCALATION_CATEGORY, ESCALATION_CATEGORY_FROM_MVS_OFFICER, ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR, ESCALATION_COMMENT, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_DATE, FROM_DATE, MVS_DISTRICT_OFFICER, MVS_OFFICER_ESCALATED_DATE, MVS_SUPERVISOR_ESCALATED_DATE, SERVICE, SERVICE_TYPE, TO_DATE, SEARCH, API_CONST_APPLICATION_ID, API_CONST_SERVICE, API_CONST_SERVICE_TYPE, API_CONST_CREATED_DATE, API_CONST_ASSIGNED_OFFICER_ID, API_CONST_USER_ID, API_CONST_EQUALS, API_CONST_REG_ID, API_CONST_CONTAINS, API_CONST_STATUS, API_CONST_FROM_DATE, API_CONST_TO_DATE } from '../../shared/constants';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-application-list',
  standalone: true,
  providers: [DataStorageService, ConfigService],
  imports: [NgFor, NgIf, HeaderComponent, FormsModule, CommonModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {
  //pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  temp: number = 1;

  // Sorting state
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
    MVS_DISTRICT_OFFICER,
    API_CONST_APPLICATION_ID,
    API_CONST_SERVICE,
    API_CONST_SERVICE_TYPE,
    API_CONST_CREATED_DATE,
    API_CONST_ASSIGNED_OFFICER_ID,
    API_CONST_USER_ID,
    API_CONST_EQUALS,
    API_CONST_STATUS
  };

  constructor(private router: Router, private dataService: DataStorageService) { }

  ngOnInit() {
    this.role = history.state.role;
    this.fields = ROLE_FIELDS_MAP[this.role];
    this.fetchApplicationList(localStorage.getItem(API_CONST_USER_ID) || '');
  }

  fetchApplicationList(userId: string) {
    //filters, sort should come from ui
    const filters = [
      {
        "value": userId,
        "columnName": API_CONST_ASSIGNED_OFFICER_ID,
        "type": API_CONST_EQUALS
      }
    ];
    const sort = [
      {
        sortField: API_CONST_CREATED_DATE,
        sortType: "desc"
      }
    ];
    const pagination = {
      pageStart: 0,
      pageFetch: this.pageSize
    };
    this.dataService
      .fetchApplicationList(filters, sort, pagination)
      .subscribe(
        (appResponse: any) => {
          if (appResponse && appResponse.response && appResponse.response.data) {
            this.data = appResponse.response.data;
            this.totalRecords = appResponse.response.totalRecord || 0;
            this.data.forEach((application: any) => {
              
            });

          } else if (appResponse.errors && appResponse.errors.length) {
            console.error("API Errors:", appResponse.errors);
          }
        },
        (appError) => {
          console.error("Error fetching application list:", appError);
        }
      );
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 0;
  }
  
  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
        this.currentPage = newPage; // Correctly set the current page
        this.search(); // Fetch data for the new page
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
    const applicationId = rowData[this.constants.API_CONST_APPLICATION_ID];
    this.dataService
      .getApplicationDetails(applicationId)
      .subscribe(
        (response: any) => {
          // Navigate to the details page with fetched data
          this.router.navigate(['/application-detail'], { state: { role: this.role, data: response.response } });
        },
        (error) => {
          console.error('Error fetching application details:', error);
          alert('Failed to fetch application details.');
        });
  }

  search() {
    const userId = localStorage.getItem(API_CONST_USER_ID) || '';
    let filters: { value: string; columnName: string; type: string }[] = [
      {
        value: userId,
        columnName: API_CONST_ASSIGNED_OFFICER_ID,
        type: API_CONST_EQUALS
      }
    ];

    // Helper function to add filters safely
    const addFilter = (value: string | undefined, columnName: string, type: string) => {
      if (value?.trim()) {
        filters = filters.concat({ value: value.trim(), columnName, type });
      }
    };

    // Add filters for optional parameters
    addFilter(this.searchText, API_CONST_REG_ID, API_CONST_CONTAINS);
    addFilter(this.selectedService, API_CONST_SERVICE, API_CONST_EQUALS);
    addFilter(this.selectedServiceType, API_CONST_SERVICE_TYPE, API_CONST_EQUALS);
    addFilter(this.selectedApplicationStatus, API_CONST_STATUS, API_CONST_EQUALS);
    addFilter(this.fromDate, API_CONST_FROM_DATE, API_CONST_EQUALS);
    addFilter(this.toDate, API_CONST_TO_DATE, API_CONST_EQUALS);

    const sort = [
      {
        sortField: this.sortColumn || API_CONST_CREATED_DATE, 
        sortType: this.sortDirection || 'desc'   
      }
    ];
    const pagination = {
      pageStart: this.currentPage,
      pageFetch: this.pageSize
    };
    this.dataService
      .fetchApplicationList(filters, sort, pagination)
      .subscribe(
        (appResponse: any) => {
          if (appResponse && appResponse.response && appResponse.response.data) {
            this.data = appResponse.response.data;
            this.data.forEach((application: any) => {});
          } else {
            this.data = []
          }
        },
        (appError) => {
          console.error("Error fetching application list:", appError);
        }
      );


  }
}

