import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ApplicationDetailComponent } from './feature/application-detail/application-detail.component';
import { ApplicationListComponent } from './feature/application-list/application-list.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect root path to /login
  { path: 'login', component: LoginComponent },
  { path: 'application-list', component: ApplicationListComponent },
  { path: 'application-detail', component: ApplicationDetailComponent }
];
