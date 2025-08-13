import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule,Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MANUAL-VERIFICATION-UI';
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Clear session when navigating to login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/login' || event.url === '/') {
          console.log('Navigating to login - clearing session');
          sessionStorage.removeItem('sessionActive');
        }
      });
    
    // Handle browser back/forward button navigation
    window.addEventListener('popstate', () => {
      const currentPath = window.location.pathname;
      console.log('Browser navigation to:', currentPath);
      
      // If navigating to a protected route without session, redirect to login
      const protectedRoutes = ['/application-list', '/application-detail', '/demographic-details'];
      if (protectedRoutes.includes(currentPath)) {
        const sessionActive = sessionStorage.getItem('sessionActive');
        if (!sessionActive) {
          console.log('No active session for protected route, redirecting to login');
          this.router.navigate(['/login']);
        }
      }
    });

    // Clear session on page refresh
    // window.addEventListener('beforeunload', () => {
    //   sessionStorage.clear();
    // });
  }
}
