import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { UsersService } from './users.service';
import { WorkingHours } from '../objects/working-hours';
import { Observable } from "rxjs";
import { GenericResponseObject } from '../objects/generic-response-object';
import { CommonServiceMethods } from './common-service-methods';
import { AppSettings } from './app-settings';

@Injectable()
export class HoursMatrixService
{
  constructor(private httpClient: HttpClient, private usersService: UsersService) { }
  
  generateHoursMatrix(idCompany: number, singleDay: number, workingHoursAndBounds: WorkingHours[]): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
   
    params = params.append('singleDay', singleDay.toString());
    params = params.append('idCompany', idCompany.toString());
          

    const body = JSON.stringify(workingHoursAndBounds);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let options = {
      headers: headers,//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, headers),
      params: params
    };

    return this.httpClient.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'HoursMatrix/GenerateHoursMatrix', body, options);
  }
}