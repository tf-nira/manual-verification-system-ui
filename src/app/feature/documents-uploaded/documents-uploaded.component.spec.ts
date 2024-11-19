import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsUploadedComponent } from './documents-uploaded.component';

describe('DocumentsUploadedComponent', () => {
  let component: DocumentsUploadedComponent;
  let fixture: ComponentFixture<DocumentsUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsUploadedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
