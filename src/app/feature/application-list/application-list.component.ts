import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FormsModule } from '@angular/forms';
import { APPLICATION_ID, APPLICATION_STATUS, CATEGORY, CLEAR_FILTERS, COMMENT, CREATED_DATE, ESCALATED_DATE, ESCALATION_CATEGORY, ESCALATION_CATEGORY_FROM_MVS_OFFICER, ESCALATION_CATEGORY_FROM_MVS_SUPERVISOR, ESCALATION_COMMENT, ESCALATION_COMMENT_FROM_MVS_OFFICER, ESCALATION_COMMENT_FROM_MVS_SUPERVISOR, ESCALATION_DATE, FROM_DATE, MVS_DISTRICT_OFFICER, MVS_OFFICER_ESCALATED_DATE, MVS_SUPERVISOR_ESCALATED_DATE, SERVICE, SERVICE_TYPE, TO_DATE, SEARCH, RESPONSE_APPLICATION_ID, RESPONSE_SERVICE, RESPONSE_SERVICE_TYPE, RESPONSE_CREATED_DATE } from '../../shared/constants';
import { ROLE_DATA_MAP } from '../../shared/application-data';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { DataStorageService } from '../../core/services/data-storage.service';
import { ConfigService } from '../../core/services/config.service';

interface NavigationState {
  role?: string;
  data?: any[];
}

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

  flag: boolean = false;

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
    RESPONSE_APPLICATION_ID,
    RESPONSE_SERVICE,
    RESPONSE_SERVICE_TYPE,
    RESPONSE_CREATED_DATE
  };

  constructor(private router: Router, private dataService: DataStorageService) { }

  ngOnInit() {
    this.role = history.state.role;

    // this.data = history.state.data;
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras.state || {} as NavigationState;
    // this.role = state.role || '';
    this.fields = ROLE_FIELDS_MAP[this.role];

    if (this.flag) {
      this.data = ROLE_DATA_MAP[this.role];
    }
    else {
      this.fetchApplicationList(localStorage.getItem("userId") || '');
    }
  }

  fetchApplicationList(userId: string) {
    //filters, sort should come from ui
    const filters = [
      {
        "value": userId,
        "columnName": "assignedOfficerId",
        "type": "equals"
      }
    ];
    const sort = [
      {
        sortField: "crDTimes",
        sortType: "DESC"
      }
    ];
    const pagination = {
      pageStart: 0,
      pageFetch: this.pageSize
    };
    this.dataService
      .fetchApplicationList(userId, filters, sort, pagination)
      .subscribe(
        (appResponse: any) => {
          if (appResponse && appResponse.response && appResponse.response.data) {
            this.data = appResponse.response.data;
            this.totalRecords = appResponse.response.totalRecord || 0;
            console.log(this.totalRecords)
            //console.log(applicationData)
            // Process the response data and show in the ui table
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

    if (this.flag) {
      this.router.navigate(['/application-detail'], { state: { role: this.role, data: rowData } });
    }
    else {
      // get application details api
      const applicationId = rowData[this.constants.RESPONSE_APPLICATION_ID];
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

  }

  search() {
    const userId = localStorage.getItem("userId") || '';
    let filters: { value: string; columnName: string; type: string }[] = [
      {
        value: userId,
        columnName: "assignedOfficerId",
        type: "equals"
      }
    ];

    // Helper function to add filters safely
    const addFilter = (value: string | undefined, columnName: string, type: string) => {
      if (value?.trim()) {
        filters = filters.concat({ value: value.trim(), columnName, type });
      }
    };

    // Add filters for optional parameters
    addFilter(this.searchText, "regId", "contains");
    addFilter(this.selectedService, "service", "equals");
    addFilter(this.selectedServiceType, "serviceType", "equals");
    addFilter(this.selectedApplicationStatus, "status", "equals");
    addFilter(this.fromDate, "fromDate", "equals");
    addFilter(this.toDate, "toDate", "equals");

    console.log(filters); // Debugging
    const sort = [
      {
        sortField: this.sortColumn || "crDTimes", // Default to a column if no sort column is selected
        sortType: this.sortDirection || "DESC"   // Default direction if no sorting is applied
      }
    ];
    console.log("current page"+this.currentPage)
    console.log("temp"+this.temp)
    const pagination = {
      pageStart: this.currentPage,
      pageFetch: this.pageSize
    };
    console.log(pagination)
    this.dataService
      .fetchApplicationList(userId, filters, sort, pagination)
      .subscribe(
        (appResponse: any) => {
          console.log("Application List Response:", appResponse);
          if (appResponse && appResponse.response && appResponse.response.data) {
            console.log("1");
            this.data = appResponse.response.data;
            //console.log(applicationData)
            // Process the response data and show in the ui table
            this.data.forEach((application: any) => {
              // console.log("Application ID:", application.applicationId);
              // console.log("Service:", application.service);
              // console.log("Status:", application.status);
            });

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

