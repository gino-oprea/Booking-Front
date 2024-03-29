import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CommonServiceMethods } from './common-service-methods';
import { UsersService } from './users.service';

import { CompanyFilter } from '../objects/company-filter';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';


@Injectable()
export class CompanySearchService 
{
  constructor(private http: HttpClient,
    private usersService: UsersService, private config: AppConfigService) { }

  getCompanies(flt: CompanyFilter): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('id', flt.id != null ? flt.id.toString() : null);
    params = params.append('name', flt.name != null ? flt.name : null);
    params = params.append('idCategory', flt.idCategory != null ? flt.idCategory.toString() : null);
    params = params.append('idSubcategory', flt.idSubcategory != null ? flt.idSubcategory.toString() : null);
    params = params.append('idCountry', flt.idCountry != null ? flt.idCountry.toString() : null);
    params = params.append('idCounty', flt.idCounty != null ? flt.idCounty.toString() : null);
    params = params.append('idCity', flt.idCity != null ? flt.idCity.toString() : null);
    //params = params.append('town', flt.town != null ? flt.town.toString() : null);

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyFront', options);
  }

  getCompany(idUser: number, idCompany: number)
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyFront/' + idUser + '/' + idCompany, options);
  }
}
