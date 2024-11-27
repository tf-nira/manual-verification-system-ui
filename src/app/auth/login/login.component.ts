import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ROLE_DATA_MAP } from '../../shared/application-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log("Login submitted for user:", this.username);

    // Simulated login logic
    const role = 'MVS_DISTRICT_OFFICER';
    const data = ROLE_DATA_MAP[role];
    this.router.navigate(['/application-list'], { state: { role, data } });
  }
}
