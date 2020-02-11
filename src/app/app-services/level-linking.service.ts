import { UsersService } from './users.service';
import { Injectable } from '@angular/core';

import { GenericResponseObject } from '../objects/generic-response-object';
import { Observable } from 'rxjs';
import { CommonServiceMethods } from './common-service-methods';

import { EntitiesLink } from '../objects/entities-link';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class LevelLinkingService 
{
  constructor(private http: HttpClient,
    private usersService: UsersService, private config: AppConfigService) { }

  getEntitiesLinking(idEntity: number, idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'levellinking/' + idEntity + '/' + idCompany, options);
  }
  getEntitiesLinkingTree(idCompany: number, companyName: string, culture: string): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'levellinking/gettree/' + idCompany + '/' + companyName + '/' + culture, options);
  }
  setEntitiesLinking(entitiesLink: EntitiesLink, isAdd: boolean): Observable<GenericResponseObject>  
  {
    const body = JSON.stringify(entitiesLink);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'levellinking/' + isAdd.toString(), body, options);
  }
  setMoveLevelOrderIndex(idLevelMoved: number, isMoveUp: boolean): Observable<GenericResponseObject>  
  {
    let options = {
      headers: null
    };
    return this.http.put<GenericResponseObject>(this.config.api_endpoint + 'levellinking/' + idLevelMoved.toString() + '/' + isMoveUp.toString(), null, options);
  }

  // removeEntitiesLinkingOnLevelOrderChange(idLevelMoved: number, isMoveUp: boolean): Observable<GenericResponseObject>  
  // {
  //   let options = {
  //     headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
  //   };
  //   return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'levellinking/' + idLevelMoved.toString() + '/' + isMoveUp.toString(), options);
  // }
}
