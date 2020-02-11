import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';

import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService
{

  constructor(private http: HttpClient, private config: AppConfigService) { }

  getCompanyClients(idCompany: number, idEntity: number = null): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity != null ? idEntity.toString() : null);

    let options = {
      headers: null,
      params: params
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'Client/' + idCompany.toString(), options);
  }
}
