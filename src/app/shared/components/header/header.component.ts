import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LOGOUT, NAME, ROLE } from '../../constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() role: string = '';
  @Input() view: string = 'List'; // Default to 'List'
  @Input() applicationType: string ='Assigned';
  @Input() hideToggle: boolean = false; 
  @Output() applicationTypeChange = new EventEmitter<string>();
  userId: string = '';
  isDropdownOpen: boolean = false;
  constants = {
    NAME,
    ROLE,
    LOGOUT,
  };
  showLogoutModal: boolean = false;

  constructor(private router: Router) {}
  get fetchRole(): string {
    this.role = localStorage.getItem('role') || '';
    return this.role;
  }
  get fetchUserId(): string {
    this.userId = localStorage.getItem('userId') || '';
    return this.userId;
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleApplicationView(event: Event): void {
    const newType = (event.target as HTMLSelectElement).value;
    this.applicationType = newType;
    console.log("Emitting application type change", this.applicationType)
    this.applicationTypeChange.emit(this.applicationType);
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.clearAuthToken();
    // Store document upload statuses before clearing
    const documentStatuses: Record<string, boolean> = {};

    // Find all document upload status items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('uploadSuccess_')) {
        documentStatuses[key] = localStorage.getItem(key) === 'true';
      }
    });
    localStorage.clear();
    sessionStorage.clear();
    // Restore document upload statuses
    Object.keys(documentStatuses).forEach(key => {
      localStorage.setItem(key, documentStatuses[key] ? 'true' : 'false');
    });
    // Redirect to the login page
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });

  }
  clearAuthToken(): void {
    document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }
  getPageTitle(): string {
    const role = localStorage.getItem('role') || '';
    if (role === 'MVS_ADMIN') {
      return 'Admin Login';
    }
    
    if (this.view === 'List') {
      return this.applicationType === 'Assigned' ? 'Applications List View' : 'Rejected Applications';
    }
    
    const titles: { [key: string]: string } = {
      List: 'Applications List View',
      Details: 'Application Details View',
    };
    return titles[this.view] || 'Default Title'; 
  }

  isAdminUser(): boolean {
    const role = localStorage.getItem('role') || '';
    return role === 'MVS_ADMIN';
  }
}
