import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ApplicationDetailComponent } from './feature/application-detail/application-detail.component';
import { ApplicationListComponent } from './feature/application-list/application-list.component';
import { DemographicDetailsComponent } from './feature/demographic-details/demographic-details.component';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect root path to /login
  { path: 'login', component: LoginComponent },
  { path: 'application-list', component: ApplicationListComponent, canActivate: [AuthGuard] },
  { path: 'application-detail', component: ApplicationDetailComponent, canActivate: [AuthGuard] },
  { path: 'demographic-details', component: DemographicDetailsComponent, canActivate: [AuthGuard] }
];
