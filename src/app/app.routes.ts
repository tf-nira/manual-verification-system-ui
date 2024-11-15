import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ApplicationDetailComponent } from './feature/application-detail/application-detail.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect root path to /login
  { path: 'login', component: LoginComponent },
  { path: 'application-detail', component: ApplicationDetailComponent }
];
