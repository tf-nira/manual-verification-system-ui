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

    // Clear session on page refresh
    window.addEventListener('beforeunload', () => {
      sessionStorage.clear();
    });
  }
}
