import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { GenericResponseObject } from 'app/objects/generic-response-object';
import { WebSites } from '../enums/enums';

@Injectable({
  providedIn: 'root'
})
export class SiteModulesService {

  constructor(private http: HttpClient, private config: AppConfigService) { }

  getSiteModules(): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idSite', WebSites.Back.toString());    

    let options = {
      headers: null,
      params: params
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'SiteModules/GetModulesIsOption', options);
  }
  getSiteModulesByRole(idRole: number = null): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idRole', idRole.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'SiteModules/GetModulesByRole', options);
  }
}
