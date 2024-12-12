import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ROLE_DATA_MAP } from '../../shared/application-data';
import { DataStorageService } from '../../core/services/data-storage.service';
// import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { ConfigService } from '../../core/services/config.service';
import { API_CONST_SUCCESS } from '../../shared/constants';


@Component({
  selector: 'app-login',
  standalone: true,
  providers: [DataStorageService, ConfigService],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  // private dataService = inject(DataStorageService);
  constructor(private router: Router, private dataService: DataStorageService) {}

  ngOnInit(): void {
    //`
  }

  onSubmit() {
    console.log("login submitted for user:", this.username);

    this.dataService
      .userLogin(
        this.username,
        this.password
      )
      .subscribe(
        (response: any) => {

          // Check if login was successful
          if (response && response.response && response.response.status === API_CONST_SUCCESS) {
            localStorage.setItem("authToken", response.response.token);
            localStorage.setItem("userId", response.response.userId || "");
            // const userId = response.response.userId;
            
            const decoded = this.decodeJwt(response.response.token);
            const userId = this.fetchPreferredUsername(decoded);
            const name = this.fetchName(decoded);

            localStorage.setItem('authToken', response.response.token);
            localStorage.setItem("userId", userId|| "");
            localStorage.setItem("name" , name || ""); 

            const role = this.fetchRole(decoded);
            localStorage.setItem("role", role || '');
            
            this.router.navigate(['/application-list'], { state: { role } }
            );
          }

        },
        (error) => {
          console.error("Login error:", error);
        }
      );
  }

  decodeJwt(token: string): any {
    return jwtDecode(token);
  }

  fetchRole(decodedToken: any): string | null {
    if (decodedToken && decodedToken.realm_access && Array.isArray(decodedToken.realm_access.roles)) {
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

  fetchName(decodedToken: any): string | null {
    if (decodedToken && typeof decodedToken.preferred_username === 'string') {
      return decodedToken.name;
    }
    return null;
  }
}
