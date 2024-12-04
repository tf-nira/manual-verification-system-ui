import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MANUAL-VERIFICATION-UI';
  // constructor(private configService: ConfigService) {}

  // ngOnInit(): void {
  //   this.configService.getConfig().subscribe((config: any) => {
  //     console.log('Loaded Config:', config);
  //   });
  // }
}
