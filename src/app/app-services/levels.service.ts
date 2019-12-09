import { Level } from '../objects/level';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { LevelAdditionalCharacteristic } from '../objects/level-additional-characteristic';
import { AppSettings } from './app-settings';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LevelsService 
{
  constructor(private http: HttpClient, private usersService:UsersService) { }

  getLevelTypes():Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/GetLevelTypesDic', options);
  }
  getDurationTypes():Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/GetDurationTypesDic', options);
  }
  getLevelFieldTypes():Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/GetLevelFieldTypesDic', options);
  }
  getLevelAdditionalCharacteristics(idCharacteristic: number, idLevel: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('id', idCharacteristic != null ? idCharacteristic.toString() : null);
    params = params.append('idLevel', idLevel != null ? idLevel.toString() : null);
    
    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/GetLevelAdditionalCharacteristics', options);
  }
  addLevelAdditionalCharacteristic(charact:LevelAdditionalCharacteristic):Observable<GenericResponseObject>
  {
    const body = JSON.stringify(charact);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/AddLevelAdditionalCharacteristic', body, options);
  }
  editLevelAdditionalCharacteristic(charact:LevelAdditionalCharacteristic):Observable<GenericResponseObject>
  {
    const body = JSON.stringify(charact);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/EditLevelAdditionalCharacteristic', body, options);
  }
  getLevels(idCompany: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/' + idCompany, options);
  }
  addLevel(level:Level):Observable<GenericResponseObject>
  {
    const body = JSON.stringify(level);
    const headers = new HttpHeaders(
      {'Content-Type':'application/json'}
    );

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels', body, options);
  }
  updateLevel(level: Level):Observable<GenericResponseObject>
  {
    const body = JSON.stringify(level);
    const headers = new HttpHeaders(
      {'Content-Type':'application/json'}
    );

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };
    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels', body, options);
  }
  deleteLevel(idLevel: number):Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/' + idLevel, options);
  }
  deleteLevelAdditionalCharacteristic(idCharact: number, idLevel: number):Observable<GenericResponseObject>
  {
    let params = new HttpParams();    
    params = params.append('idLevel', idLevel.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'levels/DeleteLevelCharacteristic/' + idCharact, options);
  }
}
