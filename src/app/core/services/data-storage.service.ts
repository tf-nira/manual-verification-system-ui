import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestModel } from '../../shared/models/request-model/RequestModel';
import { ConfigService } from './config.service';
import * as appConstants from '../../app.constants';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  /**
   * @description Creates an instance of DataStorageService.
   * @see HttpClient
   * @param {HttpClient} httpClient
   * @param {ConfigService} configService
   * @memberof DataStorageService
   */

  serverDtFormat = 'YYYY/MM/DD';
  // private BASE_URL: string = 'https://api-internal.niraqa.idencode.link';
  // private MVS_URL : string ='/v1/manual-verification-service';
  private BASE_URL: string = '';
  private MVS_URL : string ='';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.BASE_URL = configService.getConfig()['BASE_URL'];
    this.MVS_URL = configService.getConfig()['MVS_URL'];
  }

  userLogin(userName: string, password: string) {

    const url = this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.auth;

    const req = {
      userName: userName,
      password: password,
    };
    const obj = new RequestModel(req);
    return this.httpClient.post(url, obj);
  }

  getConfig() {
    const url = this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.applications + appConstants.APPEND_URL.get_config;

    return this.httpClient.get(url, {
      withCredentials: true,
    });
  }

  fetchApplicationList(
    filters: any = [],
    sort: any = [],
    pagination: any = { pageStart: 0, pageFetch: 3 }
  ) {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      appConstants.APPEND_URL.search;

    const token = localStorage.getItem('authToken');
    // document.cookie = `Authorization=${token}; path=/; SameSite=None; Secure; Domain=api-internal.niradev.idencode.link`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    const filterArray = filters;

    const sortArray = sort.map((sortObj: any) => ({
      sortField: sortObj.sortField,
      sortType: sortObj.sortType,
    }));

    // Prepare the request payload
    const requestPayload = {
      filters: filterArray,
      sort: sortArray,
      pagination,
    };

    const requestModel = new RequestModel(requestPayload);

    return this.httpClient.post(url, requestModel, {
      withCredentials: true,
    });
  }

  fetchRejectedApplication(applicationId: string) {
    const url = this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.applications+'reject/' + applicationId;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    return this.httpClient.get(url, {
      withCredentials: true,
    });
  }

  getApplicationDetails(applicationId: string) {
    const url = this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.applications + applicationId;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    return this.httpClient.get(url, {
      withCredentials: true,
    });
  }

  changeStatus(
    applicationId: string,
    status: string,
    comment: string = '',
    category: string = '',
    selectedOfficerLevel?: string
  ) {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.status;
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    const request: any = {
      status: status,
      comment: comment,
    };

    if (status === 'ESCALATE' && selectedOfficerLevel && selectedOfficerLevel.trim() !== '') {
      request.selectedOfficerLevel = selectedOfficerLevel;
    }
    if ((status === 'REJECT' || status === 'ESCALATE') && category) {
      request.category = category;
    }
    const obj = new RequestModel(request);
    return this.httpClient.put(url, obj, {
      withCredentials: true,
    });
  }

  scheduleInterview(
    applicationId: string,
    interviewDetails: {
      subject: string;
      content: string;
      districtOffice: string;
    }
  ) {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.schedule_interview;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    const request = {
      subject: interviewDetails.subject,
      content: interviewDetails.content,
    };
    const obj = new RequestModel(request);

    return this.httpClient.post(url, obj, {
      withCredentials: true,
    });
  }

  // Method to upload documents
  uploadDocuments(applicationId: string, docPayload: any): Observable<any> {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.upload_document;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    const request = {
      documents: docPayload,
    };
    // const obj = new RequestModel(request);

    return this.httpClient.post(url, docPayload, {
      withCredentials: true,
    });
  }

  //method to retrieve demographic data from idrepo
  fetchDemographicData(registrationId: string){
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      'demographics/'+
      registrationId;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
    });

    return this.httpClient.get(url, {
      withCredentials: true,
    });
  }

  fetchDocuments(requestPayload: any): Observable<any> {
    const url = this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications + appConstants.APPEND_URL.fetch_documents;
    const token = localStorage.getItem('authToken');
    return this.httpClient.post(url, requestPayload, {
      withCredentials: true
    });
  }

  fetchMatchedRegIdData(registrationId: string) {
    const url = this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications + 'matched-id/demographics/' +
      registrationId;
    return this.httpClient.get(url);
  }

  getAssignedOfficerDetails(registrationId: string) {
    const url = this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications + 'assignedofficer/' +
      registrationId;
    return this.httpClient.get(url);
  }

  saveModifiedRow(changes: any, rowData: any): Observable<any> {
  const url =
    this.BASE_URL + this.MVS_URL +
    appConstants.APPEND_URL.applications +
    rowData.applicationId +
    appConstants.APPEND_URL.save_modified; // Replace with your actual endpoint for saving modifications

  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Cookie': `Authorization=${token}; SameSite=None; Secure; Path=/; Domain=api-internal.niradev.idencode.link`,
  });

  const request = {
   id: 'id',
    version: 'v1',
    requesttime: new Date().toISOString(),
    metadata: null,
    request: changes // Wrap it if your API expects an object, or just send rowData directly
  };

  return this.httpClient.put(url, request, {
    withCredentials: true,
  });
}


}
