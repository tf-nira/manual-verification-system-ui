import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ROLE_DATA_MAP } from '../../shared/application-data';
import { DataStorageService } from '../../core/services/data-storage.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { ConfigService } from '../../core/services/config.service';


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
  flag: boolean = true;

  username: string = '';
  password: string = '';

  // Dummy users mapped to roles
  private dummyUsers: { [username: string]: { password: string; role: string } } = {
    'mvsofficer': { password: 'test', role: 'MVS_OFFICER' },
    'mvssupervisor': { password: 'test', role: 'MVS_SUPERVISOR' },
    'mvsdistrictofficer': { password: 'test', role: 'MVS_DISTRICT_OFFICER' },
    'mvslegalofficer': { password: 'test', role: 'MVS_LEGAL_OFFICER' }
  };

  // private dataService = inject(DataStorageService);
  constructor(private router: Router, private dataService: DataStorageService) {
    console.log("login");
  }
  ngOnInit(): void {
    
  }

  onSubmit() {
    console.log("login submitted for user:", this.username);

    this.dataService.temp();

    if (this.flag) {
      const user = this.dummyUsers[this.username];
      if (user && user.password === this.password) {
        this.router.navigate(['/application-list'], { state: { role: user.role } });
      } else {
        alert('Invalid username or password');
      }
    }
    else {
      this.dataService
      .userLogin(
        this.username,
        this.password
      )
      .subscribe(
        (response: any) => {
          console.log("Login Response:", response);

          // Check if login was successful
          if (response && response.response && response.response.status === "success") {
            localStorage.setItem("authToken", response.response.token);
            localStorage.setItem("refreshToken", response.response.refreshToken);
            localStorage.setItem("userId", response.response.userId || "");
            const userId = response.response.userId;
            
            // decode auth token to fetch role
            const role = '';
            this.router.navigate(['/application-list'], { state: { role } }
            );
          }

        },
        (error) => {
          console.error("Login error:", error);
        }
      );
    }
    

  }
}
