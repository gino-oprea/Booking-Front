import { Injectable } from '@angular/core';
import { Observable, identity } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { UsersService } from './users.service';
import { CommonServiceMethods } from './common-service-methods';
import { AppSettings } from './app-settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ImageService 
{
  constructor(private http: HttpClient, private usersService: UsersService) { }

  getCompanyImages(idCompany: number)
  {
    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/GetCompanyImages/' + idCompany, options);
  }
  uploadCompanyImage(idCompany: number, fileToUpload: any): Observable<GenericResponseObject>
  {
    let input = new FormData();
    input.append("file", fileToUpload);

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/UploadCompanyImage/' + idCompany, input, options);
  }
  deleteCompanyImage(idImage: number, idCompany: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idCompany', idCompany.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/DeleteCompanyImage/' + idImage, options);
  }


  getEntityImages(idEntity: number)
  {
    let options = {
      headers: null
    };
    return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/GetEntityImages/' + idEntity, options);
  }
  uploadEntityImage(idEntity: number, fileToUpload: any): Observable<GenericResponseObject>
  {
    let input = new FormData();
    input.append("file", fileToUpload);

    let options = {
      headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this.usersService, null)      
    };
    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/UploadEntityImage/' + idEntity, input, options);
  }
  deleteEntityImage(idImage: number, idEntity: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idEntity', idEntity.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Image/DeleteEntityImage/' + idImage, options);
  }
}