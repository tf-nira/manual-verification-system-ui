import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ROLE_DATA_MAP } from '../../shared/application-data';
import { DataStorageService } from '../../core/services/data-storage.service';
// import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { ConfigService } from '../../core/services/config.service';
import { API_CONST_SUCCESS } from '../../shared/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [DataStorageService, ConfigService],
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  showErrorMessage: boolean = false;
  // private dataService = inject(DataStorageService);
  constructor(
    private router: Router,
    private dataService: DataStorageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //`
  }
  openForgotPasswordPopup() {
    this.snackBar.open('Please contact the administrator to retrieve or reset your password.', 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['center-snackbar'],
    });
  }
  onSubmit() {
    console.log('login submitted for user:', this.username);

    this.dataService.userLogin(this.username, this.password).subscribe(
      (response: any) => {
        // Check if login was successful
        if (
          response &&
          response.response &&
          response.response.status === API_CONST_SUCCESS
        ) {

          const decoded = this.decodeJwt(response.response.token);
          const userId = this.fetchPreferredUsername(decoded);
          const name = this.fetchInitials(decoded);

          localStorage.setItem('authToken', response.response.token);
          localStorage.setItem('userId', userId || '');
          localStorage.setItem('name', name || '');

          const role = this.fetchRole(decoded);
          localStorage.setItem('role', role || '');

          this.router.navigate(['/application-list'], { state: { role } });
        } else {
          this.showErrorMessage = true;
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.showErrorMessage = true;
      }
    );
  }

  decodeJwt(token: string): any {
    return jwtDecode(token);
  }

  fetchRole(decodedToken: any): string | null {
    if (
      decodedToken &&
      decodedToken.realm_access &&
      Array.isArray(decodedToken.realm_access.roles)
    ) {
      const roles = decodedToken.realm_access.roles;
      const mvsRole = roles.find((role: string) => role.startsWith('MVS'));
      return mvsRole || null;
    }
    return null;
  }

  fetchPreferredUsername(decodedToken: any): string | null {
    if (decodedToken && typeof decodedToken.preferred_username === 'string') {
      return decodedToken.preferred_username;
    }
    return null;
  }

  fetchInitials(decodedToken: any): string | null {
    let nameInitials = '';
    if (
      decodedToken &&
      typeof decodedToken.given_name === 'string' &&
      typeof decodedToken.family_name === 'string'
    ) {
      const givenName = decodedToken.given_name;
      const familyName = decodedToken.family_name;
      const firstLetterGiven = givenName.charAt(0).toUpperCase() || '';
      const firstLetterFamily = familyName.charAt(0).toUpperCase() || '';
      nameInitials = firstLetterGiven + firstLetterFamily;
    }
    return nameInitials;
  }
}
