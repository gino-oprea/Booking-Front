import { SpecialDay } from '../objects/special-day';
import { Injectable } from '@angular/core';

import { SubscriptionObject } from '../objects/subscription-object';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Company } from '../objects/company';
import { WorkingHours } from '../objects/working-hours';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { AppSettings } from './app-settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CompanyService 
{
  constructor(private http:HttpClient, private usersService:UsersService) { }

  createCompany(idUser: number,
    idSubscription: number,
    amount: number,
    months: number): Observable<GenericResponseObject>
  {
    const body = null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/NewCompany/' +
      idUser + '/' + idSubscription + '/' + amount + '/' + months, body, options);
  }
  getCompanies(idUser:number):Observable<GenericResponseObject>
  {    
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/' + idUser, options);
  }
  getCompany(idUser:number, idCompany:number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/' + idUser + '/' + idCompany, options);
  }
  getActivityCategories()
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/GetActivityCategoriesDic', options);
  }
  getActivitySubCategories(idCategory:number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/GetActivitySubCategoriesDic/' + idCategory.toString(), options);
  }
  getCompanyWorkingHours(idCompany: number):Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/GetCompanyWorkingHours/' + idCompany, options);
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

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack', body, options);
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

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/SetCompanyWorkingHours', body, options);
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

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/GetCompanySpecialDays', options);
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

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/SetCompanySpecialDays/' + isAdd, body, options);
  }
  deleteCompanySpecialDay(id: number):Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyBack/DeleteCompanySpecialDays/' + id, options);
  }
}
