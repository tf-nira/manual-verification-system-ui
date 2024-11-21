import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE_FIELDS_MAP } from '../../shared/role-fields';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [NgFor, HeaderComponent, FormsModule],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.css'
})
export class ApplicationListComponent implements OnInit {

  role: string = '';
  fields: string[] = [];
  data: any[] = [];
  searchText: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = history.state.role;
    this.data = history.state.data;

    this.fields = ROLE_FIELDS_MAP[this.role];
  }

  get filteredRows() {
    if (!this.searchText.trim()) {
      return this.data; // Show full list if searchText is empty
    }
    return this.data.filter(row =>
      row['Application ID']?.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onRowClick(rowData: any) {
    // get application details api
    this.router.navigate(['/application-detail'], { state: { role: this.role, data: rowData }});
  }
}
