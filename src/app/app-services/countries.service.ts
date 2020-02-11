import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';

import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class CountriesService
{

  constructor(private http: HttpClient, private config: AppConfigService) { }

  getCountries(): Observable<GenericResponseObject>
  {
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyLocation/GetForSearch');
  }
  getCounties(idCountry: number): Observable<GenericResponseObject>
  {
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyLocation/GetCounties/' + idCountry.toString());
  }
  getCities(idCounty: number): Observable<GenericResponseObject>
  {
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyLocation/GetCities/' + idCounty.toString());
  }

}
