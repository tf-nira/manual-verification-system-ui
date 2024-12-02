import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-demographic-details',
  standalone: true,
  imports: [],
  templateUrl: './demographic-details.component.html',
  styleUrl: './demographic-details.component.css'
})
export class DemographicDetailsComponent {
  @Input() data: any;
}
