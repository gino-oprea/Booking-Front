import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { LoginService } from '../app-services/login.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor
{

  constructor(private loginService:LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    if (req.url.indexOf('ReCaptcha') == -1)
    {
      let token = this.loginService.getToken();
      if (token != null)
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.access_token}`
          }
        });
    }

    return next.handle(req);
  }
  
}
