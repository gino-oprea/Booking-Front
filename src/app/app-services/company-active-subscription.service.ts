import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CommonServiceMethods } from './common-service-methods';
import { AppSettings } from './app-settings';
import { GenericResponseObject } from '../objects/generic-response-object';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CompanyActiveSubscriptionService
{

  constructor(private httpClient:HttpClient, private usersService: UsersService) { }


  getCompanyActiveSubscription(idCompany: number): Observable<GenericResponseObject>
  {
    let options ={
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanySubscription/' + idCompany.toString(), options);
  }
  getSubscriptionsForRenewUpgrade(idCompany: number, subscriptionType: string): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.httpClient.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanySubscription/GetSubscriptionForRenewUpgrade/' + idCompany.toString() + '/' + subscriptionType, options);
  }
  renewCompanySubscription(idCompany: number, idSubscription: number, amount: number, months: number): Observable<GenericResponseObject>
  {
    const body = null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanySubscription/RenewSubscription/' + idCompany.toString() + '/' + idSubscription.toString() + '/' + amount.toString() + '/' + months.toString(), body,
      options);
  }
  upgradeCompanySubscription(idCompany: number, idSubscription: number, amount: number, months: number): Observable<GenericResponseObject>
  {
    const body= null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'CompanySubscription/UpgradeSubscription/' + idCompany.toString() + '/' + idSubscription.toString() + '/' + amount.toString() + '/' + months.toString(), body,
      options);
  }
}
