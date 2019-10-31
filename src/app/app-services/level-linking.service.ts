import { UsersService } from './users.service';
import { Injectable } from '@angular/core';

import { GenericResponseObject } from '../objects/generic-response-object';
import { Observable } from 'rxjs';
import { CommonServiceMethods } from './common-service-methods';
import { AppSettings } from './app-settings';
import { EntitiesLink } from '../objects/entities-link';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LevelLinkingService 
{
  constructor(private http: HttpClient,
    private usersService: UsersService) { }

  getEntitiesLinking(idEntity: number, idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levellinking/' + idEntity + '/' + idCompany, options);
  }
  getEntitiesLinkingTree(idCompany: number, companyName: string, culture: string): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levellinking/gettree/' + idCompany + '/' + companyName + '/' + culture, options);
  }
  setEntitiesLinking(entitiesLink: EntitiesLink, isAdd: boolean): Observable<GenericResponseObject>  
  {
    const body = JSON.stringify(entitiesLink);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levellinking/' + isAdd.toString(), body, options);
  }
  removeEntitiesLinkingOnLevelOrderChange(idLevelMoved: number, isMoveUp: boolean): Observable<GenericResponseObject>  
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levellinking/' + idLevelMoved.toString() + '/' + isMoveUp.toString(), options);
  }
}
