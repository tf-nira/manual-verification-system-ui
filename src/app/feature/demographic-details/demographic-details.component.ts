import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { CATEGORY_MAP} from '../../shared/constants';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-demographic-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent], // Import CommonModule for pipes like 'json'
  templateUrl: './demographic-details.component.html',
  styleUrls: ['./demographic-details.component.css']
})
export class DemographicDetailsComponent implements OnInit{
  objectKeys = Object.keys; // To iterate over keys in the template
  demographicData: any; // Store the demographic data
  @Input() data: any; // Accept demographicData as input
  sectionsData: any[] = []; // Organized data for UI
  expandedParts: boolean[] = []; // Track expanded state for parts
  isLeftCollapsed: boolean = false;
  
  isRightCollapsed: boolean = true;
  // Define navigation parts and sections
  parts = [
    {
      label: 'Part - A',
      sections: [
        { id: 'personal-info-section', label: 'Personal Information' },
        { id: 'place-of-residence-section', label: 'Place Of Residence' },
        { id: 'place-of-birth-section', label: 'Place Of Birth' },
        { id: 'place-of-origin-section', label: 'Place Of Origin' },
        { id: 'citizenship-details-section', label: 'Citizenship Details' },
      ],
    },
    {
      label: 'Part - B',
      sections: [
        { id: 'voter-info-section', label: 'Voters Information' },
        { id: 'marital-status-section', label: 'Marital Status' },
        { id: 'spouse-details-section', label: 'Spouse Details' },
      ],
    },
    {
      label: 'Part - C',
      sections: [
        { id: 'father-details-section', label: "Father's Details" },
        { id: 'mother-details-section', label: "Mother's Details" },
        { id: 'intoducer-details-section', label: 'Introducer Details' },
      ],
    },
  ];

  sections = [
    {
      id: 'personal-info-section',
      label: 'Personal Information',
      keys: [
        'fullName', 'surname', 'givenName', 'otherNames', 'maidenName', 'previousName',
        'dateOfBirth', 'gender', 'phone', 'email', 'applicantLivingStatus', 'CountryCode',
        'homePhoneNumber', 'highestLevelOfEducation', 'profession', 'occupation',
        'religion', 'disabilities', 'userServiceType', 'userService', 'IDSchemaVersion',
        'cardNumber', 'UIN', 'NIN', 'preferredLang', 'selectedHandles', 'NINVerified',
        'updatedAt', 'renewalNIN', 'nextOfKinPhoneNumber', 'ninExpiryDate', 'applicantNationality',
        'applicantOtherNationality', 'citizenshipCertificateNo', 'foundLink'
      ]
    },
    {
      id: 'place-of-residence-section',
      label: 'Place Of Residence',
      keys: [
        'residenceStatus', 'applicantPlaceOfResidence', 'applicantForeignResidenceCountry',
        'applicantForeignResidenceAddress', 'appResCountryUGA', 'applicantPlaceOfResidenceCounty',
        'applicantPlaceOfResidenceSubCounty', 'applicantPlaceOfResidenceParish',
        'applicantPlaceOfResidenceVillage', 'applicantPlaceOfResidenceStreet',
        'applicantPlaceOfResidenceYearsLived', 'applicantPlaceOfResidenceDistrictOfPrevRes',
        'applicantPlaceOfResidencePostalAddress', 'applicantPlaceOfResidenceHouseNo',
        'applicantPlaceOfResidenceDistrict'
      ]
    },
    {
      id: 'place-of-birth-section',
      label: 'Place Of Birth',
      keys: [
        'applicantForeignBirthCountry', 'applicantForeignBirthAddress', 'appBirCountryUGA',
        'applicantPlaceOfBirthDistrict', 'applicantPlaceOfBirthCounty',
        'applicantPlaceOfBirthSubCounty', 'applicantPlaceOfBirthParish',
        'applicantPlaceOfBirthVillage', 'applicantPlaceOfBirthCity'
      ]
    },
    {
      id: 'place-of-origin-section',
      label: 'Place Of Origin',
      keys: [
        'applicantForeignOriginCountry', 'applicantForeignOriginAddress', 'appOriCountryUGA',
        'applicantPlaceOfOriginDistrict', 'applicantPlaceOfOriginCounty',
        'applicantPlaceOfOriginSubCounty', 'applicantPlaceOfOriginParish',
        'applicantPlaceOfOriginVillage', 'applicantPlaceOfOriginIndigenousCommunityTribe',
        'applicantPlaceOfOriginClan'
      ]
    },
    {
      id: 'citizenship-details-section',
      label: 'Citizenship Details',
      keys: ['applicantPassportNumber', 'applicantPassportFileNumber']
    },
    {
      id: 'voter-info-section',
      label: 'Voters Information',
      keys: [
        'preferredPollingStation', 'pollingStationNameResidence', 'pollingStationNameOrigin'
      ]
    },
    {
      id: 'marital-status-section',
      label: 'Marital Status',
      keys: ['maritalStatus']
    },
    {
      id: 'spouse-details-section',
      label: 'Spouse Details',
      keys: [
        'spouseSurname', 'spouseGivenName', 'spouseOtherNames', 'spouseMaidenName',
        'spousePreviousName', 'spouseNIN', 'spouseCitizenshipType', 'spousePlaceOfMarriage',
        'spouseDateOfMarriage', 'spouseTypeOfMarriage', 'spouseMarriageCertificateNumber',
        'numberOfOtherSpouses', 'spouseTwoSurname', 'spouseTwoGivenName', 'spouseTwoOtherNames',
        'spouseTwoPreviousName', 'spouseTwoNIN', 'spouseTwoCitizenshipType',
        'spouseTwoPlaceOfMarriage', 'spouseTwoDateOfMarriage', 'spouseTwoTypeOfMarriage',
        'spouseTwoMarriageCertificateNumber', 'spouseThreeSurname', 'spouseThreeGivenName',
        'spouseThreeOtherNames', 'spouseThreeMaidenName', 'spouseThreePreviousName',
        'spouseThreeNIN', 'spouseThreeCitizenshipType', 'spouseThreePlaceOfMarriage',
        'spouseThreeDateOfMarriage', 'spouseThreeTypeOfMarriage', 'spouseThreeMarriageCertificateNumber'
      ]
    },
    {
      id: 'father-details-section',
      label: "Father's Details",
      keys: [
        'fatherLivingStatus', 'fatherSurname', 'fatherGivenName', 'fatherOtherNames',
        'fatherPreviousName', 'fatherNIN', 'fatherUIN', 'fatherIDDocumentNo', 'fatherCitizenshipType',
        'fatherCitizenCertificateNumber', 'fatherIndigenousCommunityTribe', 'fatherIndigenousCommunityClan',
        'fatherOccupation', 'fatherForeignResidenceCountry', 'fatherForeignResidenceAddress',
        'fatherPostalAddress', 'fatResCountryUGA', 'fatherPlaceOfResidenceDistrict',
        'fatherPlaceOfResidenceCounty', 'fatherPlaceOfResidenceSubCounty', 'fatherPlaceOfResidenceParish',
        'fatherPlaceOfResidenceVillage', 'fatherPlaceOfResidenceStreet', 'fatherPlaceOfResidenceHouseNo',
        'fatherForeignOriginCountry', 'fatherForeignOriginAddress', 'fatOriCountryUGA',
        'fatherPlaceOfOriginDistrict', 'fatherPlaceOfOriginCounty', 'fatherPlaceOfOriginSubCounty',
        'fatherPlaceOfOriginParish', 'fatherPlaceOfOriginVillage'
      ]
    },
    {
      id: 'mother-details-section',
      label: "Mother's Details",
      keys: [
        'motherLivingStatus', 'motherSurname', 'motherGivenName', 'motherOtherNames',
        'motherPreviousName', 'motherMaidenName', 'motherNIN', 'motherIDDocumentNo',
        'motherCitizenshipType', 'motherCitizenCertificateNumber', 'motherIndigenousCommunityTribe',
        'motherIndigenousCommunityClan', 'motherOccupation', 'motherForeignResidenceCountry',
        'motherForeignResidenceAddress', 'motherPostalAddress', 'motResCountryUGA',
        'motherPlaceOfResidenceDistrict', 'motherPlaceOfResidenceCounty', 'motherPlaceOfResidenceSubCounty',
        'motherPlaceOfResidenceParish', 'motherPlaceOfResidenceVillage', 'motherPlaceOfResidenceStreet',
        'motherPlaceOfResidenceHouseNo', 'motherForeignOriginCountry', 'motherForeignOriginAddress',
        'motOriCountryUGA', 'motherPlaceOfOriginDistrict', 'motherPlaceOfOriginCounty',
        'motherPlaceOfOriginSubCounty', 'motherPlaceOfOriginParish', 'motherPlaceOfOriginVillage'
      ]
    },
    {
      id: 'intoducer-details-section',
      label: "Blood Relative's/Introducer Details",
      keys: [
        'guardianRelationToApplicant', 'guardianSurname', 'guardianGivenName', 'guardianOtherNames',
        'guardianOccupation', 'guardianNIN_AIN', 'guardianIDDocumentnumber', 'guardianPassportNumber',
        'guardianTribe', 'guardianClan', 'guardianCitizenshipType', 'guardianCitizenshipCertificateNumber',
        'guardianOtherNationality', 'guardianForeignOriginCountry', 'guardianForeignOriginAddress',
        'guardiansCountry', 'guardianResidenceDistrict', 'guardianResidenceCounty',
        'guardianResidenceSubCounty', 'guardianResidenceParish', 'guardianResidenceVillage',
        'guardianResidenceStreet', 'guardianResidence', 'guardianDateOfBirth'
      ]
    },
    {
      id: 'children-details-section',
      label: "Particulars of Applicant’s Children",
      keys: [
        'childName', 'childSex', 'childDateOfBirth', 'childTwoName', 'childTwoSex',
        'childTwoDateOfBirth', 'childThreeName', 'childThreeSex', 'childThreeDateOfBirth',
        'childFourName', 'childFourSex', 'childFourDateOfBirth', 'childFiveName',
        'childFiveSex', 'childFiveDateOfBirth'
      ]
    },
    {
      id: 'declarant-details-section',
      label: "Declarant's Details",
      keys: [
        'declarant', 'declarantSurname', 'declarantgivenName', 'declarantotherNames',
        'declarantPreviousNames', 'declarantMaidenName', 'declarantGender', 'declarantNationality',
        'declarantResidenceStatus', 'introducerNIN', 'relationToApplicant', 'PRN'
      ]
    }
  ];
  role: string = '';
  relativeDocumentList: any[] = [];
  categoryMap = CATEGORY_MAP;
  documents: {
    category: string; // Use the key as the category
    title: any; // Map keys to human-readable titles
    fileName: string; // Generate a filename dynamically
    file: any;
  }[] = []; // Initialize as an empty array instead of undefined
  pdfUrl: any;
  constructor(
      private sanitizer: DomSanitizer, private snackBar: MatSnackBar
    ) { }
  
  ngOnInit(): void {
    const state = history.state;
    this.role = state.role || '';
    const data = localStorage.getItem('demographicData');
    const documentData = localStorage.getItem('documentData');

    if (data) {
      this.demographicData = JSON.parse(data);
      this.organizeDataIntoSections();
      this.expandedParts = Array(this.parts.length).fill(false); // Initialize expanded state
   
    } else {
      console.error('No demographic data found in localStorage');
    }
    if (documentData) {
      this.relativeDocumentList = JSON.parse(documentData); // Retrieve and parse the list
      // Convert the array to an object where category is the key and value is the value
      const documentsJson = this.relativeDocumentList.reduce((acc, doc) => {
        acc[doc.category] = doc.value;
        return acc;
      }, {} as { [key: string]: string });
      console.log("documentsJson"+JSON.stringify(documentsJson))
      this.processDocuments(documentsJson);
    } else {
      console.error('No doc data found in relative data');
    }
  }
  // Process the documents data into the required structure
  processDocuments(documentsJson: any) {
    console.log("inside processDocuments")

    this.documents = Object.keys(documentsJson).map((key) => {
      const base64Pdf = documentsJson[key]?.trim();
      return {
        category: key, // Use the key as the category
        title: this.getDocumentTitle(key), // Map keys to human-readable titles
        fileName: `${key}.pdf`, // Generate a filename dynamically
        file: base64Pdf ? this.convertBase64ToPdfUrl(base64Pdf) : null, // Convert Base64 to a SafeResourceUrl
      };
    });
  }

  getDocumentTitle(key: string): string {
    return this.categoryMap[key] || 'Unknown Document';
  }

  viewDocument(document: { file: File | SafeResourceUrl | null }): void {
    if (document.file) {
      const sanitizedUrl = this.sanitizer.sanitize(4, document.file); // Sanitizes the SafeResourceUrl
      if (!sanitizedUrl) {
        this.snackBar.open('Invalid or unsafe URL for the document.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
        return;
      }

      // Open a new window and inject sanitized HTML
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
            <html>
              <head>
                <title>${document.file || 'Document'}</title>
              </head>
              <body style="margin: 0;">
                <iframe
                  src="${sanitizedUrl}"
                  width="100%"
                  height="100%"
                  style="border: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
                ></iframe>
              </body>
            </html>
          `);
      } else {
        this.snackBar.open('Unable to open a new window. Please check your browser settings.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['center-snackbar'],
        });
      }
    } else {
      this.snackBar.open('Document is not available.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['center-snackbar'],
      });
    }
  }

  
    convertBase64ToPdfUrl(base64: string): SafeResourceUrl {
      // Decode Base64 string to a byte array
      const byteCharacters = atob(base64.split(',')[1] || base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
  
      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: 'application/pdf' });
  
      // Create a safe object URL for the Blob
      this.pdfUrl = URL.createObjectURL(blob);
  
      // Use Angular's DomSanitizer to sanitize the URL
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }


  /**
   * Organize data into sections for the UI.
   */
  organizeDataIntoSections(): void {
    this.sectionsData = this.sections
      .map((section) => {
        const filteredData: Record<string, any> = {};
  
        section.keys.forEach((key) => {
          const value = this.demographicData[key];
          // Check if the value is valid and not empty
          if (value !== null && value !== undefined && value !== '') {
            filteredData[key] = value;
          }
        });
  
        // Return section data only if it contains valid fields
        if (Object.keys(filteredData).length > 0) {
          return {
            id: section.id,
            label: section.label,
            data: filteredData
          };
        }
        return null; // Mark empty sections as null
      })
      .filter((section) => section !== null); // Remove null sections
  }
  /**
   * Toggle collapsible part visibility.
   */
  togglePart(index: number): void {
    this.expandedParts[index] = !this.expandedParts[index];
  }

  /**
   * Scroll to a specific section.
   */
  scrollToSection(sectionId: string): void {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  toggleLeft() {
    this.isLeftCollapsed = !this.isLeftCollapsed;
  }

}
