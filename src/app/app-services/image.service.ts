import { Injectable } from '@angular/core';
import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class ImageService 
{
  constructor(private http: HttpClient, private usersService: UsersService, private config: AppConfigService) { }

  getCompanyImages(idCompany: number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'Image/GetCompanyImages/' + idCompany, options);
  }
  uploadCompanyImage(idCompany: number, fileToUpload: any): Observable<GenericResponseObject>
  {
    let input = new FormData();
    input.append("file", fileToUpload);

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'Image/UploadCompanyImage/' + idCompany, input, options);
  }
  deleteCompanyImage(idImage: number, idCompany: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'Image/DeleteCompanyImage/' + idImage, options);
  }


  getEntityImages(idEntity: number)
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'Image/GetEntityImages/' + idEntity, options);
  }
  uploadEntityImage(idEntity: number, fileToUpload: any): Observable<GenericResponseObject>
  {
    let input = new FormData();
    input.append("file", fileToUpload);

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'Image/UploadEntityImage/' + idEntity, input, options);
  }
  deleteEntityImage(idImage: number, idEntity: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'Image/DeleteEntityImage/' + idImage, options);
  }
}