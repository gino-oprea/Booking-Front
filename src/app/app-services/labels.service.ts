import { Label } from '../objects/label';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams, Headers } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from './app-settings';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LabelsService 
{ 
  cultureSubject = new Subject<string>();

  constructor(private http: HttpClient) { }

  getLabels(): Observable<Label[]>
  {
    return this.http.get<Label[]>(AppSettings.API_ENDPOINT + 'labels');
  }
  getLabelsByKeyName(labelKeys: string[]): Observable<Label[]>
  {
    let cultureChangeSubj = new Subject<Label[]>();

    let params = new HttpParams();

    for (var i = 0; i < labelKeys.length; i++) {
      params = params.append('labelName', labelKeys[i]);
    }

    let options = {
      params: params
    };

    return this.http.get<Label[]>(AppSettings.API_ENDPOINT + 'labels', options);
  }
  
  emmitCultureChange(culture:string)
  {    
    localStorage.setItem('b_front_culture', culture);
    this.cultureSubject.next(culture);   
  }

  addLabel(label:Label):Observable<any>
  {
    const body = JSON.stringify(label);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(AppSettings.API_ENDPOINT + 'labels', body, { headers: headers });
  }
  editLabel(label: Label)
  {
    const body = JSON.stringify(label);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(AppSettings.API_ENDPOINT + 'labels', body, { headers: headers });
  }
}
