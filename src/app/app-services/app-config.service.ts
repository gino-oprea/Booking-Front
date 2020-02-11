import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfigService
{

  public api_endpoint: string;
  public token_api_endpoint: string;

  constructor(private http: HttpClient) { }

  load(): Promise<any>
  {
    const promise = this.http.get('/app.config.json')
      .toPromise()
      .then(data =>
      {
        Object.assign(this, data);
        return data;
      });

    return promise;
  }
}