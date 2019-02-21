import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../objects/user';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UsersService
{
    public loggedIn = false;    
    loginSubject = new Subject<string>();

    constructor(private http: HttpClient)
    {
        this.loggedIn = !!localStorage.getItem('b_front_auth_user');        
    }

    getUsers(): Observable<User[]>
    {
        let options = {
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<User[]>(AppSettings.API_ENDPOINT + 'users', options);
    }
    getUserByEmail(email: string): Observable<User>
    {
        let options = {
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<User>(AppSettings.API_ENDPOINT + 'users/getbyemail/' + email, options);
    }
    registerUser(user: User): Observable<any>
    {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let options = {
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
        };

        return this.http.post(AppSettings.API_ENDPOINT + 'users', body, options);
    }
    activateUser(activationKey: string): Observable<User>
    {
        return this.http.get<User>(AppSettings.API_ENDPOINT + 'users/activateuser/' + activationKey);
    }
    checkPassword(idUser: number, password: string): Observable<GenericResponseObject>
    {
        return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/CheckPassword/' + idUser.toString() + '/' + password);
    }
    login(email: string, password: string): Observable<User>
    {
        let usr = new User();
        usr.email = email;
        usr.password = password;

        const body = JSON.stringify(usr);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post(AppSettings.API_ENDPOINT + 'users/login', body, { headers: headers }).pipe(
            map((response: Response) =>
            {
                let user = <User>response;
                if (user.error == '')
                //&& (<User>response.json()).idRole == 1)//doar pentru admin
                {
                    localStorage.setItem('b_front_auth_user', JSON.stringify(user));
                    this.loggedIn = true;
                }

                return response as User;
            }));
    }
    isAuthenticated()
    {
        return this.loggedIn;
        //return !!localStorage.getItem('b_front_auth_user');
    }
    getCurrentUser():User
    {
        if (!!localStorage.getItem('b_front_auth_user'))
        {
            return <User>JSON.parse(localStorage.getItem('b_front_auth_user'));
        }
        else
            return null;    
    }
    emmitLoginChange()
    {
        this.loginSubject.next('login change');
    }
    logout()
    {
        localStorage.removeItem('b_front_auth_user');
        this.loggedIn = false;
    }
    editUser(user: User, updateMode: number): Observable<any>
    {
        const body = JSON.stringify(user);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let options = {
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
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
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, headers)
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
            headers: CommonServiceMethods.generateHttpClientAuthHeaders(this, null)
        };
        return this.http.get<GenericResponseObject>(AppSettings.API_ENDPOINT + 'users/sendActivationLink/' + userId.toString(), options);
    }

}
