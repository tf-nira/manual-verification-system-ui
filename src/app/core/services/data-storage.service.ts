import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { RequestModel } from "../../shared/models/request-model/RequestModel";
import { ConfigService } from "./config.service";
import { AppConfigService } from "../../app-config.service";
import * as appConstants from "../../app.constants";
import { Observable } from 'rxjs';
@Injectable({
    providedIn: "root",
})
export class DataStorageService {
  /**
   * @description Creates an instance of DataStorageService.
   * @see HttpClient
   * @param {HttpClient} httpClient
   * @param {ConfigService} configService
   * @memberof DataStorageService
   */
  
  serverDtFormat = "YYYY/MM/DD";
  private BASE_URL: string = 'http://localhost:9002/v1/manual-verification-service';
  
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

  // get BASE_URL(): string {
  //   return this.configService.getConfig()['BASE_URL'];
  // }

  temp() {
    const data = this.httpClient.get<{ [key: string]: any }>('/assets/config.json').toPromise();
    console.log(data);
  }
  
    
  userLogin(userName: string, password: string) {
    const req = {
        userName: userName,
        password: password
    };
    const obj = new RequestModel(req);
    const url = this.BASE_URL + appConstants.APPEND_URL.auth;
    return this.httpClient.post(url, obj);
  }
  
  fetchApplicationList(userId: string, filters: any = [], sort: any = [], pagination: any = { pageStart: 0, pageFetch: 3 }) {
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      appConstants.APPEND_URL.search;
      const token = localStorage.getItem('authToken');
      console.log(token)
      document.cookie = `Authorization=${token}; path=/`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    const params: any = {
      userId,
      pageStart: pagination.pageStart,
      pageFetch: pagination.pageFetch,
    };

    // Dynamically build filters and sort arrays
    const filterArray = filters.map((filter: any) => ({
      columnName: filter.columnName,
      value: filter.value,
      type: filter.type
  }));

  const sortArray = sort.map((sortObj: any) => ({
      sortField: sortObj.sortField,
      sortType: sortObj.sortType
  }));
  // Prepare the request payload
  const requestPayload = {
    filters:filterArray,
    sort: sortArray,
    pagination
  };

  const requestModel = new RequestModel(requestPayload);

    return this.httpClient.post(url, requestModel,{headers, withCredentials: true });
      // appConstants.APPEND_URL.application_list+
      // userId;
      // return this.httpClient.get(url);
  }


  getApplicationDetails(applicationId :string){
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications+
      applicationId;
      return this.httpClient.get(url);
  }

  changeStatus(applicationId :string, status: string, comment: string = '', rejectionCategory: string = ''){
    const request: any = {
      status: status,
      comment: comment,
    };
    if (status === 'REJECT' && rejectionCategory) {
      request.rejectionCategory = rejectionCategory;
    }
    const obj = new RequestModel(request);
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      applicationId+
      appConstants.APPEND_URL.status;
    return this.httpClient.put(url, obj);
  }

  scheduleInterview(applicationId :string,interviewDetails: { subject: string; content: string; districtOffice: string }){
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      applicationId+
      appConstants.APPEND_URL.schedule_interview;

      const request = {
        id: "id",
        version: "v1",
        requesttime: new Date().toISOString(),
        metadata: null,
        request: {
          subject: interviewDetails.subject,
          content: interviewDetails.content
        }
      };

      
    const obj = new RequestModel(request);
    
    return this.httpClient.post(url, obj);
  }

       // Method to upload documents
  uploadDocuments(applicationId: string, payload: any): Observable<any> {
    const url =
          this.BASE_URL +
          appConstants.APPEND_URL.applications +
          applicationId+
          appConstants.APPEND_URL.upload_document;
    return this.httpClient.post(url, payload);
  }
}