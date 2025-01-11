import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
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
  
  ngOnInit(): void {
    const state = history.state;
    this.role = state.role || '';
    const data = localStorage.getItem('demographicData');
    if (data) {
      this.demographicData = JSON.parse(data);
      this.organizeDataIntoSections();
      this.expandedParts = Array(this.parts.length).fill(false); // Initialize expanded state
   
    } else {
      console.error('No demographic data found in localStorage');
    }
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
