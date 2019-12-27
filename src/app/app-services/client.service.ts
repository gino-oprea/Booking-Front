import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getCompanyClients(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Client/' + idCompany.toString(), options);
  }
}
