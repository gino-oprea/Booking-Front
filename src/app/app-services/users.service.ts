import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../objects/user';

import { Injectable } from '@angular/core';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class UsersService
{
    // public loggedIn = false;    
    // loginSubject = new Subject<string>();

    constructor(private http: HttpClient)
    {
        // this.loggedIn = !!localStorage.getItem('b_front_auth_user');        
    }

    getUsers(): Observable<User[]>
    {
        let options = {
            headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<User[]>(AppSettings.API_ENDPOINT + 'users', options);
    }
    getUserByEmail(email: string): Observable<User>
    {
        let options = {
            headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<User>(AppSettings.API_ENDPOINT + 'users/getbyemail/' + email, options);
    }
    getUsersForBookingAutocomplete(idCompany: number,email: string, phone: string): Observable<User[]>
    {
        let params = new HttpParams();
        params = params.append('email', email != null ? email : "");
        params = params.append('phone', phone != null ? phone : "");

        let options = {
            headers: null,
            params: params
        };
        return this.http.get<User[]>(AppSettings.API_ENDPOINT + 'users/GetUsersForBookingAutocomplete/' + idCompany.toString(), options);
    }
    getUserByEmailForUserRegistration(email: string): Observable<GenericResponseObject>
    {
        let options = {
            headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/GetByEmailForRegistration/' + email, options);
    }
    registerUser(user: User): Observable<GenericResponseObject>
    {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let options = {
            headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
        };

        return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users', body, options);
    }
    activateUser(activationKey: string): Observable<User>
    {
        return this.http.get<User>(AppSettings.API_ENDPOINT + 'users/activateuser/' + activationKey);
    }
    checkPassword(idUser: number, password: string): Observable<GenericResponseObject>
    {
        return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/CheckPassword/' + idUser.toString() + '/' + password);
    }
    
    editUser(user: User, updateMode: number): Observable<any>
    {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let options = {
            headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
        };

        return this.http.put(AppSettings.API_ENDPOINT + 'users/' + updateMode.toString(),
            body, options);
    }
    resetUserPassword(user: User): Observable<any>
    {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let options = {
            headers: headers//CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
        };

        return this.http.put(AppSettings.API_ENDPOINT + 'users/resetpassword',
            body, options);
    }
    resetUserPasswordByEmail(email: string): Observable<GenericResponseObject>
    {
        return this.http.put<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/ResetPasswordWithEmail/' + email, null);        
    }
    resendUserActivationLink(userId: number): Observable<GenericResponseObject>
    {
        let options = {
            headers: null//CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/sendActivationLink/' + userId.toString(), options);
    }

}
