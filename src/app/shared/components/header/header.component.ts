import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  isDropdownOpen: boolean = false;

  constructor(private router: Router) {}
  get formattedRole(): string {
    if (!this.role) return '';

    return this.role
      .split('_')
      .map((word, index) => {
        if (index === 0 && word.toUpperCase() === 'MVS') {
          return 'MVS';
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
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
