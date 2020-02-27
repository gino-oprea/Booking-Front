import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';
import { GenericResponseObject } from 'app/objects/generic-response-object';
import { UserRole } from '../objects/user-role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient, private config: AppConfigService) { }

  getRoles(idCompany): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idCompany', idCompany != null ? idCompany.toString() : null);

    let options = {
      headers: null,
      params: params
    };
    return this.http.get<GenericResponseObject>(this.config.api_endpoint + 'Roles/GetUserRolesForBackOffice', options);
  }
  setRole(role: UserRole): Observable<GenericResponseObject>
  {
    const body = JSON.stringify(role);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });   

    let options = {
      headers: headers
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'Roles/AddRoleBackOffice', body, options);
  }

  deleteRole(idRole: number, isForAdmin: boolean): Observable<GenericResponseObject>
  {  
    let options = {
      headers: null
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'Roles/DeleteRoleBackOffice/' + idRole.toString(), options);
  }

  addRoleToModule(idRole: number, idModule: number): Observable<GenericResponseObject>
  {
    const body = null;

    let params = new HttpParams();
    params = params.append('idRole', idRole.toString());
    params = params.append('idModule', idModule.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers,
      params: params
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'Roles/AddRoleToModuleBackOffice', body, options);
  }

  deleteRoleToModule(idRole: number, idModule: number): Observable<GenericResponseObject>
  {
    let params = new HttpParams();
    params = params.append('idRole', idRole.toString());
    params = params.append('idModule', idModule.toString());

    let options = {
      headers: null,
      params: params
    };
    return this.http.delete<GenericResponseObject>(this.config.api_endpoint + 'Roles/DeleteRoleToModuleBackOffice', options);
  }
}
