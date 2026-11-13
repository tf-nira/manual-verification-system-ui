import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailComponent } from './application-detail.component';

describe('ApplicationDetailComponent', () => {
  let component: ApplicationDetailComponent;
  let fixture: ComponentFixture<ApplicationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show unique categories for the selected Alien COP changes', () => {
    component.service = 'Change of Particulars';
    component.serviceType = 'Alien COP';
    component.rowData = {
      demographics: {
        addingName: 'Y',
        removingName: 'Y',
        changeInPlaceOfResidence: 'Y',
        changeOfDateOfBirth: 'N'
      }
    };

    component.updateCategoriesAndTitles();

    expect(component.docCategories.map(category => category.key)).toEqual([
      'proofOfPassport',
      'proofOfAlienImmigrationFacility',
      'proofOfAlienStatutoryDeclaration',
      'proofOfAlienLCLetter'
    ]);
  });
});