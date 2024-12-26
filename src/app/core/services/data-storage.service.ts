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
  private BASE_URL: string =
    'http://localhost:9090/v1/manual-verification-service';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  userLogin(userName: string, password: string) {
    const url = this.BASE_URL + appConstants.APPEND_URL.auth;

    const req = {
      userName: userName,
      password: password,
    };
    const obj = new RequestModel(req);

    return this.httpClient.post(url, obj);
  }

  fetchApplicationList(
    filters: any = [],
    sort: any = [],
    pagination: any = { pageStart: 0, pageFetch: 3 }
  ) {
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      appConstants.APPEND_URL.search;

    const token = localStorage.getItem('authToken');
    document.cookie = `Authorization=${token}; path=/`;

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
      this.BASE_URL + appConstants.APPEND_URL.applications + applicationId;

    return this.httpClient.get(url);
  }

  changeStatus(
    applicationId: string,
    status: string,
    comment: string = '',
    rejectionCategory: string = ''
  ) {
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.status;

    const request: any = {
      status: status,
      comment: comment,
    };
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
      this.BASE_URL +
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
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      applicationId +
      appConstants.APPEND_URL.upload_document;

    const request = {
      documents: docPayload,
    };
    const obj = new RequestModel(request);

    return this.httpClient.post(url, obj);
  }
}
