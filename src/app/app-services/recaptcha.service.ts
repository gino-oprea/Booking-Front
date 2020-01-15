import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from './app-settings';
import { GenericResponseObject } from '../objects/generic-response-object';
import { CaptchaResponse } from '../objects/captcha-response';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService 
{
  constructor(private http: HttpClient)
  { 
    
  }

  checkCaptchaResponse(userResponse: string): Observable<GenericResponseObject>
  { 
    var captchaResponse: CaptchaResponse = { response: userResponse };
    const body = JSON.stringify(captchaResponse);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, */*'  });        

    let options = {
      headers: headers      
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'ReCaptcha', body, options);
  }
}
