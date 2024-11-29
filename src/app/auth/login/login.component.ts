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

  // Dummy users mapped to roles
  private dummyUsers: { [username: string]: { password: string; role: string } } = {
    'mvsofficer': { password: 'test', role: 'MVS_OFFICER' },
    'mvssupervisor': { password: 'test', role: 'MVS_SUPERVISOR' },
    'mvsdistrictofficer': { password: 'test', role: 'MVS_DISTRICT_OFFICER' },
    'mvslegalofficer': { password: 'test', role: 'MVS_LEGAL_OFFICER' }
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log("Login submitted for user:", this.username);

    const user = this.dummyUsers[this.username];
    if (user && user.password === this.password) {
      // Successful login, navigate with the user's role
      this.router.navigate(['/application-list'], { state: { role: user.role } });
    } else {
      // Invalid username or password
      alert('Invalid username or password');
    }
  }
}
