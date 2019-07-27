import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CountriesService {

  constructor(private http: HttpClient) { }
  
  getCountries():Observable<GenericResponseObject>
  {
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Country/GetForSearch');
  }
  getTowns(idCountry:number): Observable<GenericResponseObject>
  {
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Country/GetTowns/' + idCountry.toString());
  }

}
