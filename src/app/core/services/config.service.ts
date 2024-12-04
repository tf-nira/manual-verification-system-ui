import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // private config = {};
  private config: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      const data = await this.http
        .get<{ [key: string]: any; }>('/assets/config.json')
        .toPromise();
      if (data) {
        this.config = data;
      } else {
        console.error('No configuration found in config.json');
      }
      console.log(this.config);
    } catch (error) {
      console.error('Failed to load config:', error);
      throw error;
    }
  }

  getConfig(): { [key: string]: any } {
    // console.log(this.config);
    return this.config;
  }
  
}
