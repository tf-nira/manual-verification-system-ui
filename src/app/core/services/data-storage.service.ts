import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { RequestModel } from "../../shared/models/request-model/RequestModel";
import { ConfigService } from "./config.service";
import { AppConfigService } from "../../app-config.service";
import * as appConstants from "../../app.constants";
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
    BASE_URL: string;
    PRE_REG_URL: string;
    constructor(
      private httpClient: HttpClient,
      private appConfigService: AppConfigService,
      private configService: ConfigService
    ) {
        this.BASE_URL = this.appConfigService.getConfig()["BASE_URL"];
        this.PRE_REG_URL = this.appConfigService.getConfig()["PRE_REG_URL"];
    }
    
    userLogin(userName: string, password: string) {
        const req = {
            userName: userName,
            password: password
        };
        const obj = new RequestModel(appConstants.IDS.login, req);
        const url =
          this.BASE_URL +
          this.PRE_REG_URL +
          appConstants.APPEND_URL.auth +
          "login";
        return this.httpClient.post(url, obj);
      }
      
      fetchApplicationList(userId: string){
        const url =
          this.BASE_URL +
          this.PRE_REG_URL +
          appConstants.APPEND_URL.application_list+
          userId;
          return this.httpClient.get(url);
      }

      getApplicationDetails(applicationId :string){
        const url =
          this.BASE_URL +
          this.PRE_REG_URL +
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
          this.PRE_REG_URL +
          appConstants.APPEND_URL.applications +
          applicationId+
          appConstants.APPEND_URL.status;
        return this.httpClient.put(url, obj);
      }

}