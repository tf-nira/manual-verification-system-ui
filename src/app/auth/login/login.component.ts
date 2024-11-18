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
  username: string = '' ;
  password: string = '' ;

  constructor(private router: Router) {}
  
  onSubmit(){
    console.log("login submitted for user:", this.username);
  
    // login api
    // on successful login fetch application list for the user
    
    // const role = 'MVS_OFFICER';
    // const role = 'MVS_SUPERVISOR';
    const role = 'MVS_DISTRICT_OFFICER';
    // const role = 'MVS_LEGAL_OFFICER';

    const data = ROLE_DATA_MAP[role];
    this.router.navigate(['/application-list'], { state: { role, data } });
  }
}
