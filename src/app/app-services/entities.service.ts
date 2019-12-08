import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { Entity } from '../objects/entity';
import { WorkingHours } from '../objects/working-hours';
import { WorkingDay } from '../objects/working-day';
import { SpecialDay } from '../objects/special-day';
import { AppSettings } from './app-settings';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';


@Injectable()
export class EntitiesService 
{
  constructor(private http: HttpClient, private usersService:UsersService) { }

  getEntities(idLevel: number, idEntity: number, idCompany:number=null): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idLevel', idLevel != null ? idLevel.toString() : null);
    params = params.append('idEntity', idEntity != null ? idEntity.toString() : null);
    params = params.append('idCompany', idCompany != null ? idCompany.toString() : null);

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities', options);
  }
  getEntityBookings(idEntity: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());

    let options ={
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/GetEntityBookings', options);      
  }
  getEntitiesWithLevel(idEntities: number[], idLevels: number[]): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    for (var i = 0; i < idEntities.length; i++)
    {
      params = params.append('idEntities', idEntities[i].toString());
    }

    for (let i = 0; i < idLevels.length; i++)
    {
      params = params.append('idLevels', idLevels[i].toString());
    }

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/GetEntitiesWithLevel', options);
  }
  getDurationTypes():Observable<GenericResponseObject>
  {
    let options ={
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/GetDurationTypesDic', options);
  }
  getEntitiesWorkingHours(idCompany: number, idWorkingHours: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());
    params = params.append('idWorkingHours', idWorkingHours != null ? idWorkingHours.toString() : null);    

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/GetEntityCustomHours', options);
  }
  getEntityVariableWorkingHours(idEntity: number, dateStart: Date, dateEnd: Date): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());
    params = params.append('dateStart', this.getDateString(dateStart));
    params = params.append('dateEnd', this.getDateString(dateEnd));
    
    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/GetEntityVariableWorkingHours', options);    
  }
  getDateString(date: Date)
  {    
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();
    
    var dateString = year + "-" + month + "-" + day;
    return dateString;
  }
  addEntity(entity: Entity): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(entity);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities', body, options);
  }
  addEntityWorkingHours(idCompany: number, wh: WorkingHours): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(wh);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: headers,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
      params:params
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/AddEntityCustomHours', body, options);
  }
  addEntityVariableWorkingHours(workingDays: WorkingDay[], idEntity: number): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(workingDays);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers)      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/AddEntityVariableHours/' + idEntity.toString(), body, options);
  }
  editEntity(entity: Entity): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(entity);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers      
    };

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities', body, options);
  }
  validateWorkingHours(idCompany: number, workingHours: WorkingHours, idEntity: number=null): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(workingHours);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();    
    params = params.append('idCompany', idCompany.toString());
    if (idEntity != null)
      params = params.append('idEntity', idEntity.toString());
    

    let options = {
      headers: headers,
      params: params
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/ValidateWorkingHours', body, options);
  }
  editEntityWorkingHours(idCompany: number, wh: WorkingHours): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(wh);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: headers,
      params: params
    };

    return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/EditEntityCustomHours', body, options);
  }
  deleteEntity(idEntity: number): Observable<GenericResponseObject>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'entities/' + idEntity.toString(), options);
  }
  
  deleteEntityWorkingHours(id: number, idCompany: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Entities/DeleteCustomWorkingHours/' + id, options);
  }

  getEntitySpecialDays(idEntity: number, day: Date): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());
    params = params.append('day', day != null ? day.toUTCString() : null);
    
    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Entities/GetEntitySpecialDays', options);
  }
  setEntitySpecialDays(isAdd: boolean, specialDay: SpecialDay): Observable<GenericResponseObject>
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

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Entities/SetEntitySpecialDays/' + isAdd, body, options);
  }
  deleteEntitySpecialDay(id: number, idEntity: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Entities/DeleteEntitySpecialDays/' + id, options);
  }
}
