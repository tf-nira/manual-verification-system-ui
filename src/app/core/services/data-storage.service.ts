import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestModel } from '../../shared/models/request-model/RequestModel';
import { ConfigService } from './config.service';
import { AppConfigService } from '../../app-config.service';
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
  private BASE_URL: string = 'https://api-internal.niradev.idencode.link';
    private MVS_URL : string ='/v1/manual-verification-service';
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService

  ) {
    configService.loadConfig();
    const config =configService.getConfig();
    // this.BASE_URL = config['BASE_URL'];
    // this.MVS_URL = config['MVS_URL']
    
  }

  userLogin(userName: string, password: string) {
    const url = this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.auth;

    const req = {
      userName: userName,
      password: password,
    };
    const obj = new RequestModel(req);
    console.log(url);
    console.log(obj);
    return this.httpClient.post(url, obj);
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
    document.cookie = `Authorization=${token};`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const filterArray = filters.map((filter: any) => ({
      columnName: filter.columnName,
      value: filter.value,
      type: filter.type,
    }));

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
      headers,
      withCredentials: true,
    });
  }

  getApplicationDetails(applicationId: string) {
    const url =
      this.BASE_URL + this.MVS_URL + appConstants.APPEND_URL.applications + applicationId;

    return this.httpClient.get(url);
  }

  changeStatus(
    applicationId: string,
    status: string,
    comment: string = '',
    rejectionCategory: string = '',
    selectedOfficerLevel?: string
  ) {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.status;

    const request: any = {
      status: status,
      comment: comment,
    };

    if (status === 'ESCALATE' && selectedOfficerLevel && selectedOfficerLevel.trim() !== '') {
      request.selectedOfficerLevel = selectedOfficerLevel;
    }
    if (status === 'REJECT' && rejectionCategory) {
      request.rejectionCategory = rejectionCategory;
    }
    const obj = new RequestModel(request);
    return this.httpClient.put(url, obj);
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

    const request = {
      subject: interviewDetails.subject,
      content: interviewDetails.content,
    };
    const obj = new RequestModel(request);

    return this.httpClient.post(url, obj);
  }

  // Method to upload documents
  uploadDocuments(applicationId: string, docPayload: any): Observable<any> {
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.upload_document;

    const request = {
      documents: docPayload,
    };
    const obj = new RequestModel(request);

    return this.httpClient.post(url, obj);
  }

  //method to retrieve demographic data from idrepo
  fetchDemographicData(registrationId: string){
    const url =
      this.BASE_URL + this.MVS_URL +
      appConstants.APPEND_URL.applications +
      'demographics/'+
      registrationId;
      return this.httpClient.get(url);
  }
}
