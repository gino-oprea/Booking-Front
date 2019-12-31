import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getCompanyClients(idCompany: number, idEntity:number=null): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity != null ? idEntity.toString() : null);

    let options = {
      headers: null,
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Client/' + idCompany.toString(), options);
  }
}
