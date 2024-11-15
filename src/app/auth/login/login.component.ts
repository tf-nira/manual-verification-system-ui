import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ROLE_DATA_MAP } from '../../shared/application-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}
  onSubmit(){
    console.log("login submitted");

    // on successful login
    const role = 'o3';
    const data = ROLE_DATA_MAP[role];
    this.router.navigate(['/application-list'], { state: { role, data } });
  }
}
