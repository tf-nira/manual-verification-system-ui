import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

const CONFIG_KEY = makeStateKey<{ [key: string]: any }>('app-config');

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {

      try {
        const data = await this.http.get('./assets/config.json').toPromise();
        console.log(data);
        this.config = data;
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    console.log(this.config);
  }

  getConfig() {
    return this.config;
  }
  
}
