import { Injectable } from '@angular/core';
import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { User, CompanyUser } from '../objects/user';
import { AppConfigService } from './app-config.service';


export class CompanyUsersService
{

  constructor(private http: HttpClient, private config: AppConfigService) { }

  getCompanyUsers(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyUsers/GetCompanyUsers/' + idCompany.toString(), options);
  }
  getCurrentUserRolesWithModules(): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'CompanyUsers/GetCurrentUserRolesWithModules', options);
  }
    
  addCompanyUser(user: CompanyUser, idCompany: number)
  {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: headers,
      params: params
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'CompanyUsers', body, options);
  }
  editCompanyUser(user: CompanyUser, idCompany: number)
  {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: headers,
      params: params
    };

    return this.http.put<GenericResponseObject>(this.config.api_endpoint + 'CompanyUsers', body, options);
  }
  deleteCompanyUser(idUser: number, idCompany: number)
  {
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    let options = {
      headers: headers
    };

    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'CompanyUsers/' + idUser.toString() + '/' + idCompany.toString(), options);
  }
}
