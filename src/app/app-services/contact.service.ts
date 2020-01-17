import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';
import { AppSettings } from './app-settings';
import { ContactForm } from '../objects/contact-form';

@Injectable({
  providedIn: 'root'
})
export class ContactService
{

  constructor(private http: HttpClient) { }

  submitContactForm(contactForm:any): Observable<GenericResponseObject>
  {
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    const body = JSON.stringify(contactForm);

    let options = {
      headers: headers
    };

    return this.http.post<GenericResponseObject>(AppSettings.API_ENDPOINT + 'Contact', body, options);
  }
}
