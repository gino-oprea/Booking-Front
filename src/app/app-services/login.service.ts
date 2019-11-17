import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../objects/user';

import { Injectable } from '@angular/core';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { CommonServiceMethods } from './common-service-methods';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Token } from '../objects/token';
import * as jwt_decode from 'jwt-decode';
import { UsersService } from './users.service';
import { BaseComponent } from '../shared/base-component';
import { Actions } from 'app/enums/enums';



@Injectable()
export class LoginService
{
  public loggedIn = false;  
  loginSubject = new Subject<string>();

  constructor(private http: HttpClient, private usersService:UsersService)
  {
    this.loggedIn = !!localStorage.getItem('b_front_auth_user');
  }

  

  login(email: string, password: string, component: BaseComponent)
  {
    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', 'password');
    body.set('client_id', 'angular_client_resOwner');
    body.set('client_secret', 'dcf47e41-8a50-49ff-ab90-aea7137ae991');
    body.set('scope', 'bookingWebApi');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<Token>(AppSettings.TOKEN_API_ENDPOINT, body.toString(), { headers: headers }).pipe(
      map(token =>
      {
        /////////////
        token.token_generated = new Date();
        localStorage.setItem('b_front_token', JSON.stringify(token));
        /////////////
        var decoded = jwt_decode(token.access_token);
        var username: string = decoded.sub;

        this.usersService.getUserByEmail(username).subscribe(user =>
        {
          if (user.error == '')        
          {
            user.password = password;//se salveaza pe local storage pentru a putea sa-l tinem logat(refacem automat login-ul inainte sa expire tokenul)
            user.token = token.access_token;
            localStorage.setItem('b_front_auth_user', JSON.stringify(user));
            this.loggedIn = true;

            component.logAction(null, false, Actions.Login, "", "");
            
            this.emmitLoginChange();

            this.usersService.editUser(user, 1).subscribe((data) =>//updateaza data ultimului login
            {
              let gro = (<GenericResponseObject>data);
              console.log(gro);
              if (gro.info.indexOf('success') > -1)
              {
                //this.router.navigate(['/searchcompany']);              
              }
              else
              {
                console.log(gro.error);
                component.logAction(null, true, Actions.Login, gro.error, gro.errorDetailed, true, gro.error);
              }
            });
          }
        });

        return token;
      })
    );

  }
  isAuthenticated()
  {
    return this.loggedIn;
    //return !!localStorage.getItem('b_front_auth_user');
  }
  getToken(): Token
  {
    if (!!localStorage.getItem('b_front_token'))
    {
      let token: Token = <Token>JSON.parse(localStorage.getItem('b_front_token'));
      token.token_generated = new Date(token.token_generated);
      return token;
    }
    else
      return null;
  }
  getCurrentUser(): User
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
    localStorage.removeItem('b_front_token');
    localStorage.removeItem('b_front_auth_user');
    this.loggedIn = false;

    this.emmitLoginChange();
  }
}