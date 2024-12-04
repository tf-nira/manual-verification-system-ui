import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { RequestModel } from "../../shared/models/request-model/RequestModel";
import { ConfigService } from "./config.service";
import { AppConfigService } from "../../app-config.service";
import * as appConstants from "../../app.constants";
import { Observable } from "rxjs";

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
    const reqPayload = {
      id: appConstants.IDS.login,
      version: "1.0",
      requesttime: new Date().toISOString(),
      metadata: {},
      request: {
          userName: userName,
          password: password
      }
    };
    
    const url = `${this.BASE_URL}${appConstants.APPEND_URL.auth}`;
    return this.httpClient.post(url, reqPayload);
  }
    
  fetchApplicationList(userId: string){
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.application_list+
      userId;
      return this.httpClient.get(url);
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
    const obj = new RequestModel(appConstants.IDS.login, request);
    const url =
      this.BASE_URL +
      appConstants.APPEND_URL.applications +
      applicationId+
      appConstants.APPEND_URL.status;
    return this.httpClient.put(url, obj);
  }

}