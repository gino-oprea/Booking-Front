import { SpecialDay } from '../objects/special-day';
import { Injectable } from '@angular/core';

import { SubscriptionObject } from '../objects/subscription-object';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { WorkingHours } from '../objects/working-hours';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class CompanyService 
{
  constructor(private http: HttpClient, private usersService: UsersService, private config: AppConfigService) { }

  createCompany(idUser: number,
    idSubscription: number,
    amount: number,
    months: number,
    company?: Company): Observable<GenericResponseObject>
  {
    let body = null;
    
    if (company != null)
      body = JSON.stringify(company);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/NewCompany/' +
      idUser + '/' + idSubscription + '/' + amount + '/' + months, body, options);
  }
  getCompanies(idUser: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/' + idUser, options);
  }
  getFavouriteCompanies(): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/GetFavouriteCompanies', options);
  }
  getCompany(idUser: number, idCompany: number)
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/' + idUser + '/' + idCompany, options);
  }
  getActivityCategories()
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/GetActivityCategoriesDic', options);
  }
  getActivitySubCategories(idCategory: number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/GetActivitySubCategoriesDic/' + idCategory.toString(), options);
  }
  getCompanyWorkingHours(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/GetCompanyWorkingHours/' + idCompany, options);
  }
  updateCompany(company: Company): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(company);
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.put<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack', body, options);
  }

  updateCompanyWorkingHours(workingHours: WorkingHours): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(workingHours);
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.put<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/SetCompanyWorkingHours', body, options);
  }
  getCompanySpecialDays(idCompany: number, day: Date): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idComp', idCompany.toString());
    params = params.append('day', day != null ? day.toUTCString() : null);

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/GetCompanySpecialDays', options);
  }
  setCompanySpecialDays(isAdd: boolean, specialDay: SpecialDay): Observable<GenericResponseObject>
  {
    let startDate = specialDay.day != null ? CommonServiceMethods.addUserDateOffset(specialDay.day) : null;

    specialDay.day = startDate;

    const body = JSON.stringify(specialDay);
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );
    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/SetCompanySpecialDays/' + isAdd, body, options);
  }
  setFavouriteCompany(idCompany: number): Observable<GenericResponseObject>
  {
    

    const body = null;
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );
    let options = {
      headers: headers
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/SetFavouriteCompany/' + idCompany.toString(), body, options);
  }

  deleteCompanySpecialDay(id: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/DeleteCompanySpecialDays/' + id, options);
  }
  deleteFavouriteCompany(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'CompanyBack/DeleteFavouriteCompany/' + idCompany.toString(), options);
  }
}
