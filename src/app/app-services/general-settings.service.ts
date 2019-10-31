import { Setting } from '../objects/setting';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { CommonServiceMethods } from './common-service-methods';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GeneralSettingsService 
{
  constructor(private http: HttpClient, private usersService:UsersService) { }

  getSettings():Observable<Setting[]>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<Setting[]>(AppSettings.API_ENDPOINT + 'generalSettings', options);
  }
  addSetting(setting: Setting):Observable<any>
  {
    const body = JSON.stringify(setting);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };
    
    return this.http.post<Observable<any>>(AppSettings.API_ENDPOINT + 'generalSettings', body, options);
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
    
    return this.http.put<Observable<any>>(AppSettings.API_ENDPOINT + 'generalSettings', body, options);
  }
}
