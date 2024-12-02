import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-documents-uploaded',
  standalone: true,
  imports: [],
  templateUrl: './documents-uploaded.component.html',
  styleUrl: './documents-uploaded.component.css'
})
export class DocumentsUploadedComponent {
  @Input() data: any;
}
