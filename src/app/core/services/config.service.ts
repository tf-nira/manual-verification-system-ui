import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

const CONFIG_KEY = makeStateKey<{ [key: string]: any }>('app-config');

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {

      try {
        const data = await this.http.get<{ [key: string]: any }>('./assets/config.json').toPromise();
        console.log(data);
        this.config = data || {};
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    // }
    console.log(this.config);
  }

  getConfig(): { [key: string]: any } {
    return this.config;
  }
  
}
