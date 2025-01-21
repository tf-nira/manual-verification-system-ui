import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  async loadConfig(): Promise<void> {

      try {
        const data = await this.http.get('./assets/config.json').toPromise();
        console.log(data);
        this.config = data || {};
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    console.log(this.config);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('config_url', JSON.stringify(this.config));
    }
  }

  getConfig() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('config_url') || '{}');
    }
  }
  
}
