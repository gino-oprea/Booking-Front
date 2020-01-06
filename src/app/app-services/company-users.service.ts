import { Injectable } from '@angular/core';
import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './app-settings';
import { User, CompanyUser } from '../objects/user';


export class CompanyUsersService {

  constructor(private http: HttpClient) { }

  getCompanyUsers(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyUsers/GetCompanyUsers/' + idCompany.toString(), options);
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

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyUsers', body, options);
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

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyUsers', body, options);
  }
  deleteCompanyUser(idUser: number, idCompany: number)
  {    
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );    

    let options = {
      headers: headers      
    };

    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanyUsers/' + idUser.toString() + '/' + idCompany.toString(), options);
  }
}