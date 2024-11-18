import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() role: string = '';

  get formattedRole(): string {
    if (!this.role) return '';

    return this.role
      .split('_')
      .map((word, index) => {
        if (index === 0 && word.toUpperCase() === 'MVS') {
          return 'MVS';
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
