import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../app-services/login.service';

@Injectable()
export class NonAuthGuard implements CanActivate
{
  constructor(private loginService:LoginService, private router:Router)
  {

  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean   
  {
    if (this.loginService.isAuthenticated())
      this.router.navigate(['/searchcompany']);  
    else
      return true;  
  }
}