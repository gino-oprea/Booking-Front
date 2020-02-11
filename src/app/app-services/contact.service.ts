import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponseObject } from '../objects/generic-response-object';

import { ContactForm } from '../objects/contact-form';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService
{

  constructor(private http: HttpClient, private config: AppConfigService) { }

  submitContactForm(contactForm: any): Observable<GenericResponseObject>
  {
    const headers = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    const body = JSON.stringify(contactForm);

    let options = {
      headers: headers
    };

    return this.http.post<GenericResponseObject>(this.config.api_endpoint + 'Contact', body, options);
  }
}
