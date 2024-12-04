import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;
  private configLoaded = false;

  constructor(private http: HttpClient) {}

  async loadAppConfig() {
    this.appConfig = await firstValueFrom(this.http.get('/assets/config.json'));
    this.configLoaded = true;
    console.log(this.appConfig);
    // this.appConfig = data;
  }

  getConfig() {
    if (!this.configLoaded) {
      console.error('Configuration not yet loaded!');
      throw new Error('App configuration not loaded. Ensure loadConfig() is completed before accessing.');
    }
    console.log('Config:', this.appConfig);
    return this.appConfig || {};
  }
}
