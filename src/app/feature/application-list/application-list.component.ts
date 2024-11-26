import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [NgFor, NgIf, HeaderComponent, FormsModule],
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = history.state.role;
    this.data = history.state.data;

    this.fields = ROLE_FIELDS_MAP[this.role];
    this.populateDropdownValues();
  }

  populateDropdownValues() {
    this.uniqueServices = Array.from(new Set(this.data.map(row => row['Service'] || ''))).filter(Boolean);
    this.uniqueServiceTypes = Array.from(new Set(this.data.map(row => row['Service Type'] || ''))).filter(Boolean);

    if (this.role === 'MVS_DISTRICT_OFFICER') {
      this.uniqueApplicationStatuses = Array.from(new Set(this.data.map(row => row['Application Status'] || ''))).filter(Boolean);
    }
  }

  get filteredRows() {
    let filtered = this.data;

    if (this.searchText.trim()) {
      filtered = filtered.filter(row =>
        row['Application ID']?.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.selectedService) {
      filtered = filtered.filter(row => row['Service'] === this.selectedService);
    }

    if (this.selectedServiceType) {
      filtered = filtered.filter(row => row['Service Type'] === this.selectedServiceType);
    }

    if (this.role === 'MVS_DISTRICT_OFFICER' && this.selectedApplicationStatus) {
      filtered = filtered.filter(row => row['Application Status'] === this.selectedApplicationStatus);
    }

    if (this.fromDate) {
      filtered = filtered.filter(row => new Date(row['Created Date']) >= new Date(this.fromDate));
    }

    if (this.toDate) {
      filtered = filtered.filter(row => new Date(row['Created Date']) <= new Date(this.toDate));
    }

    return filtered;
  }

  onRowClick(rowData: any) {
    // get application details api
    this.router.navigate(['/application-detail'], { state: { role: this.role, data: rowData }});
  }
}
