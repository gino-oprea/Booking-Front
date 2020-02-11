import { error } from 'util';
import { LogItem } from '../objects/log-item';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppConfigService } from './app-config.service';


@Injectable()
export class LoggerService 
{

  constructor(private http: HttpClient, private usersService: UsersService, private config: AppConfigService) { }

  getLogs(): Observable<LogItem[]>
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<LogItem[]>(this.config.api_endpoint + 'logs', options);
  }
  getLogsFiltered(
    idLog: number,
    email: string,
    idSite: number,
    pageName: string,
    idAction: number,
    isError: boolean,
    dateStart: Date,
    dateEnd: Date,
    errorMessage: string,
    infoMessage: string
  ): Observable<LogItem[]>
  {
    let params = new HttpParams();
    params = params.append('idLog', !!idLog ? idLog.toString() : null);
    params = params.append('email', email);
    params = params.append('idSite', !!idSite ? idSite.toString() : null);
    params = params.append('pageName', pageName);
    params = params.append('idAction', !!idAction ? idAction.toString() : null);
    params = params.append('isError', String(isError));
    params = params.append('dateStart', dateStart.toISOString());
    params = params.append('dateEnd', dateEnd.toISOString());
    params = params.append('errorMessage', errorMessage);
    params = params.append('infoMessage', infoMessage);

    let options = {
      headers: null,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null),
      params: params
    };

    return this.http.get<LogItem[]>(this.config.api_endpoint + 'logs/getFiltered', options);
  }
  getCompanyLogs(idCompany: number, dateStart: string, dateEnd: string,
    email: string,
    phone: string,
    idSite: number,
    pageName: string,
    idAction: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('dateStart', dateStart);
    params = params.append('dateEnd', dateEnd);
    params = params.append('email', email.trim() == '' ? null : email);
    params = params.append('phone', phone.trim() == '' ? null : phone);
    params = params.append('idSite', !!idSite ? idSite.toString() : null);
    params = params.append('pageName', pageName.trim() == '' ? null : pageName);
    params = params.append('idAction', !!idAction ? idAction.toString() : null);

    let options = {
      headers: null,
      params: params
    };

    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'logs/GetCompanyLogs/' + idCompany.toString(), options);
  }
  setLog(log: LogItem): Observable<any>
  {
    let ip = "";


    // return this.http.get('https://api.ipify.org/?format=text', { responseType: 'text' }).pipe(
    //   switchMap((res: string) =>
    //   {
    //     try
    //     {
    //       ip = res;// res._body; 
    //     } catch (e) { }

    //     //aici vom seta ip-ul
    //     log.ip = ip;

    const body = JSON.stringify(log);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.config.api_endpoint + 'logs', body, { headers: headers });
    // }),
    // catchError((err: any) =>
    // {
    //   console.log(err);
    //   const body = JSON.stringify(log);
    //   const headers = new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   });
    //   return this.http.post(this.config.api_endpoint + 'logs', body, { headers: headers });
    // }));
  }
}
