import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';

import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class SubscriptionsService
{

  constructor(private http: HttpClient, private usersService: UsersService, private config: AppConfigService) { }

  getSubscriptions(): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'subscriptions', options);
  }

}
