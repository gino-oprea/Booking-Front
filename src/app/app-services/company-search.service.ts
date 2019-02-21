import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CommonServiceMethods } from './common-service-methods';
import { UsersService } from './users.service';
import { AppSettings } from './app-settings';
import { CompanyFilter } from '../objects/company-filter';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable()
export class CompanySearchService 
{
  constructor(private http: HttpClient,
  private usersService:UsersService) { } 

  getCompanies(flt:CompanyFilter): Observable<GenericResponseObject>
  {
    let params = new HttpParams(); 
    params = params.append('id', flt.id != null ? flt.id.toString() : null);
    params = params.append('name', flt.name != null ? flt.name : null);
    params = params.append('idCategory', flt.idCategory != null ? flt.idCategory.toString() : null); 
    params = params.append('idSubcategory', flt.idSubcategory != null ? flt.idSubcategory.toString() : null);
    params = params.append('idCountry', flt.idCountry != null ? flt.idCountry.toString() : null);
    params = params.append('town', flt.town != null ? flt.town.toString() : null);

    let options = {
      headers: CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyFront', options);
  }

}
