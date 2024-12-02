import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configs = {};

  public setConfig(configJson: any) {
    localStorage.setItem('config', JSON.stringify(configJson.response));
  }

  public getConfigByKey(key: string) {
    const config = localStorage.getItem('config');
    // Use a default empty object if `config` is null
    const parsedConfig = config ? JSON.parse(config) : {};
    return parsedConfig[key];
  }

  public getConfig() {
    const config = localStorage.getItem('config');
    // Use a default empty object if `config` is null
    return config ? JSON.parse(config) : {};
  }
}
