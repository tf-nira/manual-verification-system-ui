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
     * @param {AppConfigService} appConfigService
     * @param {ConfigService} configService
     * @memberof DataStorageService
     */
    
    serverDtFormat = "YYYY/MM/DD";
    private BASE_URL: string = 'https://';
    
    constructor(private httpClient: HttpClient, private configService: ConfigService) {}

    // get BASE_URL(): string {
    //   return this.configService.getConfig()['BASE_URL'];
    // }
    
    // get PRE_REG_URL(): string {
    //   return this.configService.getConfig()['PRE_REG_URL'];
    // }

    temp() {
      console.log(this.BASE_URL);
    }
    
    userLogin(userName: string, password: string) {
        const req = {
            userName: userName,
            password: password
        };
        const obj = new RequestModel(appConstants.IDS.login, req);
        const url =
          this.BASE_URL +
          appConstants.APPEND_URL.auth +
          "login";
        return this.httpClient.post(url, obj);
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