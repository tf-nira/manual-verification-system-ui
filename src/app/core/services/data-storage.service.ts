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
    'http://localhost:9002/v1/manual-verification-service';
  private ID_REPO_URL : string = 'https://api-internal.niradev.idencode.link/idrepository/v1/identity/idvid/';
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

  //method to retrieve demographic data from idrepo
  fetchDemographicData(registrationId: string){
    // const headers = new HttpHeaders({
    //   Accept: 'application/json',
    //   Cookie: 'Authorization=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJPczJWejRybm5wcXdpMDlTcnRoQVpkT08wcFNsNEhkMTJaU1NpelJYMVVZIn0.eyJleHAiOjE3MzYxMTcxMjcsImlhdCI6MTczNjA4MTEyNywianRpIjoiOGRiYjgyMDUtZTZlMC00YjM3LWJlNTQtMGFiMDZjNDRhNjYxIiwiaXNzIjoiaHR0cHM6Ly9pYW0ubmlyYWRldi5pZGVuY29kZS5saW5rL2F1dGgvcmVhbG1zL21vc2lwIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImRmYzFiNDZkLTNjYjAtNGI1NC05ZGRiLWM3YjA5MmQ4Y2FjZSIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1vc2lwLXByZXJlZy1jbGllbnQiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIlJFR0lTVFJBVElPTl9QUk9DRVNTT1IiLCJQUkVSRUciLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1tb3NpcCIsIklORElWSURVQUwiLCJQUkVfUkVHSVNUUkFUSU9OX0FETUlOIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibW9zaXAtcHJlcmVnLWNsaWVudCI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiY2xpZW50SG9zdCI6IjEwLjQyLjAuMiIsImNsaWVudElkIjoibW9zaXAtcHJlcmVnLWNsaWVudCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1vc2lwLXByZXJlZy1jbGllbnQiLCJjbGllbnRBZGRyZXNzIjoiMTAuNDIuMC4yIn0.Fk0LOUtk0GCNioy88nYqsMOaedY-2pOUxA-sLUVGw_5pkjqyPSOIn0mFt_YpQGj0V4Mdqvt2fk9dQn7QYpBxLT2UGksOQmxhxpeWUXBbW1yh6IFHy-cIdTyvOCPCKk5sTLaEWJ2mVxQb0cIDsh2jDw8wzac4p9IBkmr0yuZeHEiDiGpTCCViW57kaHEq8EZO42kzEvcodUOn2tuikOutit4WNGmtAC02El5Gp0YHgy0yhTRbfqm9X5YZf1lugJMt7eUf3UT794CHFs-NA6LxcRv_AM7qAK2AIBMSrb8nw31-HZeUMT6rGEgA_DSrmBbTBRBNW6Ow96HIAvd9bf3kVg' // Add the authorization cookie
    // });
    const url = this.ID_REPO_URL+registrationId;
    //return this.httpClient.get(url, { headers,withCredentials: true })
    return this.httpClient.get(url, { withCredentials: true })
  }
}
