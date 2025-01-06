import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-demographic-details',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for pipes like 'json'
  templateUrl: './demographic-details.component.html',
  styleUrls: ['./demographic-details.component.css']
})
export class DemographicDetailsComponent implements OnInit{
  objectKeys = Object.keys; // To iterate over keys in the template
  demographicData: any; // Store the demographic data
  @Input() data: any; // Accept demographicData as input
  ngOnInit(): void {
    const data = localStorage.getItem('demographicData');
    if (data) {
      this.demographicData = JSON.parse(data);
    } else {
      console.error('No demographic data found in localStorage');
    }
  }

  /**
   * Helper function to format keys into readable labels
   */
  formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  /**
   * Helper function to check if a value is an object
   */
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Helper function to check if a value is an array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
