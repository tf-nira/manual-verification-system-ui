import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LOGOUT, NAME, ROLE } from '../../constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @Input() role: string = '';
  @Input() view: string = '';
  name: string = '';
  isDropdownOpen: boolean = false;
  constants = {
    NAME,
    ROLE,
    LOGOUT
  }

  constructor(private router: Router) {}
  get fetchRole(): string {
    this.role = localStorage.getItem("role") || '';
    return this.role
  }
  get fetchName(): string{
    this.name = localStorage.getItem("name") || '';
    return this.name
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {// Perform any logout-specific actions here, like clearing session storage
    sessionStorage.clear(); // Example: clear session data

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
