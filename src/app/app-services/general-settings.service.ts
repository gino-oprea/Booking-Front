import { Setting } from '../objects/setting';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { CommonServiceMethods } from './common-service-methods';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class GeneralSettingsService 
{
  constructor(private http: HttpClient, private usersService: UsersService, private config: AppConfigService) { }

  getSettings(): Observable<Setting[]>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<Setting[]>(this.config.api_endpoint + 'generalSettings', options);
  }
  addSetting(setting: Setting): Observable<any>
  {
    const body = JSON.stringify(setting);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<Observable<any>>(this.config.api_endpoint + 'generalSettings', body, options);
  }
  editSetting(setting: Setting)
  {
    const body = JSON.stringify(setting);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.put<Observable<any>>(this.config.api_endpoint + 'generalSettings', body, options);
  }
}
