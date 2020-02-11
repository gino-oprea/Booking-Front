import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CommonServiceMethods } from './common-service-methods';

import { GenericResponseObject } from '../objects/generic-response-object';
import { UsersService } from './users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class CompanyActiveSubscriptionService
{

  constructor(private httpClient: HttpClient, private usersService: UsersService, private config: AppConfigService) { }


  getCompanyActiveSubscription(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'CompanySubscription/' + idCompany.toString(), options);
  }
  getSubscriptionsForRenewUpgrade(idCompany: number, subscriptionType: string): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.httpClient.get<GenericResponseObject>(this.config.api_endpoint + 'CompanySubscription/GetSubscriptionForRenewUpgrade/' + idCompany.toString() + '/' + subscriptionType, options);
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

    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'CompanySubscription/RenewSubscription/' + idCompany.toString() + '/' + idSubscription.toString() + '/' + amount.toString() + '/' + months.toString(), body,
      options);
  }
  upgradeCompanySubscription(idCompany: number, idSubscription: number, amount: number, months: number): Observable<GenericResponseObject>
  {
    const body = null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.httpClient.post<GenericResponseObject>(this.config.api_endpoint + 'CompanySubscription/UpgradeSubscription/' + idCompany.toString() + '/' + idSubscription.toString() + '/' + amount.toString() + '/' + months.toString(), body,
      options);
  }
}
