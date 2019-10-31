import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubscriptionsService {

  constructor(private http: HttpClient,private usersService:UsersService) { }
  
  getSubscriptions():Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'subscriptions', options);
  }

}
